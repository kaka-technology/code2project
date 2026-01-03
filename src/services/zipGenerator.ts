import JSZip from 'jszip';
import { FileType, GeneratedProjectConfig } from '../types';

export const generateProjectZip = async (
  config: GeneratedProjectConfig,
  fileType: FileType
): Promise<Blob> => {
  const zip = new JSZip();
  const isTS = fileType === FileType.TS || fileType === FileType.TSX;
  const ext = isTS ? 'ts' : 'js';
  const jsxExt = isTS ? 'tsx' : 'jsx';

  // ---------------------------------------------------------
  // 1. Package.json
  // ---------------------------------------------------------
  const dependencies: Record<string, string> = {
    "react": "^19.0.0",
    "react-dom": "^19.0.0",
    "clsx": "^2.1.0",
    "tailwind-merge": "^2.2.0",
    "lucide-react": "latest",
    "framer-motion": "^11.0.0",
    "tailwindcss-animate": "^1.0.7",
    "@tailwindcss/typography": "^0.5.10",
    "@tailwindcss/forms": "^0.5.7",
    "date-fns": "latest", 
    "recharts": "latest"
  };

  config.dependencies.forEach(dep => {
    if (!dependencies[dep]) {
      dependencies[dep] = "latest";
    }
  });

  const packageJson = {
    name: config.projectName.toLowerCase().replace(/\s+/g, '-'),
    private: true,
    version: "0.1.0",
    type: "module",
    scripts: {
      dev: "vite",
      build: "vite build",
      preview: "vite preview"
    },
    dependencies,
    devDependencies: {
      "@types/react": "^19.0.0",
      "@types/react-dom": "^19.0.0",
      "@vitejs/plugin-react": "^4.3.4",
      "vite": "latest", 
      "tailwindcss": "^4.0.0", 
      "@tailwindcss/postcss": "^4.0.0",
      "postcss": "^8.5.1",
      "sass": "^1.70.0",
      ...(isTS ? {
        "typescript": "^5.7.2",
        "@types/node": "^20.0.0"
      } : {})
    }
  };

  zip.file("package.json", JSON.stringify(packageJson, null, 2));

  // ---------------------------------------------------------
  // 2. Config Files (Vite, PostCSS, TS)
  // ---------------------------------------------------------
  const viteConfig = `
import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import path from 'path'

export default defineConfig({
  plugins: [react()],
  resolve: {
    alias: {
      "@": path.resolve(__dirname, "./src"),
    },
  },
  server: {
    host: true,
    port: 3000
  }
})
`;
  zip.file(`vite.config.${ext}`, viteConfig);

  const postcssConfig = `export default { plugins: { '@tailwindcss/postcss': {} } }`;
  zip.file(`postcss.config.${ext}`, postcssConfig);

  if (isTS) {
    const tsConfig = {
      "compilerOptions": {
        "target": "ES2020",
        "useDefineForClassFields": true,
        "lib": ["ES2020", "DOM", "DOM.Iterable"],
        "module": "ESNext",
        "skipLibCheck": true,
        "moduleResolution": "bundler",
        "allowImportingTsExtensions": true,
        "resolveJsonModule": true,
        "isolatedModules": true,
        "noEmit": true,
        "jsx": "react-jsx",
        "strict": true,
        "noUnusedLocals": false,
        "noUnusedParameters": false,
        "noFallthroughCasesInSwitch": true,
        "baseUrl": ".",
        "paths": { "@/*": ["./src/*"] }
      },
      "include": ["src"],
      "references": [{ "path": "./tsconfig.node.json" }]
    };
    zip.file("tsconfig.json", JSON.stringify(tsConfig, null, 2));
    
    zip.file("tsconfig.node.json", JSON.stringify({
      "compilerOptions": {
        "composite": true,
        "skipLibCheck": true,
        "module": "ESNext",
        "moduleResolution": "bundler",
        "allowSyntheticDefaultImports": true
      },
      "include": ["vite.config.ts"]
    }, null, 2));
  }

  // ---------------------------------------------------------
  // 3. Source Files & Index.html
  // ---------------------------------------------------------
  
  const html = `
<!doctype html>
<html lang="en">
  <head>
    <meta charset="UTF-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1.0" />
    <title>${config.projectName}</title>
    <link href="https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500;600;700&family=Vazirmatn:wght@300;400;500;700&display=swap" rel="stylesheet">
  </head>
  <body>
    <div id="root"></div>
    <script type="module" src="/src/main.${jsxExt}"></script>
  </body>
</html>
`;
  zip.file("index.html", html);

  const src = zip.folder("src");
  if (!src) throw new Error("Could not create src folder");

  // Main entry
  const mainContent = `
import React from 'react'
import ReactDOM from 'react-dom/client'
import App from './App' 
import './index.css'

const root = document.getElementById('root')
if (root) {
  ReactDOM.createRoot(root).render(
    <React.StrictMode>
      <div className="min-h-screen bg-background text-foreground antialiased font-sans selection:bg-primary/20">
        <App />
      </div>
    </React.StrictMode>,
  )
}
`;
  src.file(`main.${jsxExt}`, mainContent);
  
  // User's App file
  const appFileName = `App.${isTS ? 'tsx' : 'jsx'}`;
  src.file(appFileName, config.fileContent);

  // ---------------------------------------------------------
  // 4. Ghost File Generator (Fix missing imports)
  // ---------------------------------------------------------
  
  config.localImports.forEach(importPath => {
    let cleanPath = importPath.replace(/^\.\//, '').replace(/^\//, '');
    let extension = '';
    const lastPart = cleanPath.split('/').pop() || '';
    
    if (lastPart.includes('.')) {
      if (lastPart.match(/\.(css|scss|sass|less|styl)$/)) {
        src.file(cleanPath, "/* Placeholder style - Generated by CodeToProject */");
        return;
      }
      if (lastPart.match(/\.(png|jpg|jpeg|svg|gif|webp|ico|bmp)$/)) {
        src.file(cleanPath, `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 100 100" style="background:#f1f5f9;"><text x="50" y="50" dominant-baseline="middle" text-anchor="middle" font-family="sans-serif" fill="#64748b" font-weight="bold">IMAGE</text></svg>`);
        return;
      }
      if (lastPart.match(/\.(json)$/)) {
        src.file(cleanPath, "{}");
        return;
      }
    } else {
      extension = isTS ? '.tsx' : '.jsx';
    }

    const fullPath = extension ? `${cleanPath}${extension}` : cleanPath;
    const componentName = lastPart.replace(/[^a-zA-Z0-9]/g, '') || 'Component';
    
    const dummyContent = `
import React from 'react';
// Ghost Component generated to prevent build errors
// Missing file: ${cleanPath}
const ${componentName} = (props: any) => (
  <div className="p-4 border border-dashed border-amber-300 bg-amber-50 rounded text-center">
    <p className="text-amber-600 font-mono text-xs">Missing Component: ${cleanPath}</p>
  </div>
);
export default ${componentName};
export const ${componentName}Named = ${componentName};
`;
    src.file(fullPath, dummyContent);
  });


  // ---------------------------------------------------------
  // 5. CSS (Tailwind V4 + Universal Alignment Fixes)
  // ---------------------------------------------------------
  const cssContent = `
@import "tailwindcss";

@plugin "tailwindcss-animate";
@plugin "@tailwindcss/typography";
@plugin "@tailwindcss/forms";

@theme {
  --font-sans: 'Inter', 'Vazirmatn', sans-serif;
  --radius-lg: var(--radius);
  --radius-md: calc(var(--radius) - 2px);
  --radius-sm: calc(var(--radius) - 4px);

  --color-background: var(--background);
  --color-foreground: var(--foreground);
  --color-card: var(--card);
  --color-card-foreground: var(--card-foreground);
  --color-popover: var(--popover);
  --color-popover-foreground: var(--popover-foreground);
  --color-primary: var(--primary);
  --color-primary-foreground: var(--primary-foreground);
  --color-secondary: var(--secondary);
  --color-secondary-foreground: var(--secondary-foreground);
  --color-muted: var(--muted);
  --color-muted-foreground: var(--muted-foreground);
  --color-accent: var(--accent);
  --color-accent-foreground: var(--accent-foreground);
  --color-destructive: var(--destructive);
  --color-destructive-foreground: var(--destructive-foreground);
  --color-border: var(--border);
  --color-input: var(--input);
  --color-ring: var(--ring);

  --animate-accordion-down: accordion-down 0.2s ease-out;
  --animate-accordion-up: accordion-up 0.2s ease-out;

  @keyframes accordion-down {
    from { height: 0 }
    to { height: var(--radix-accordion-content-height) }
  }
  @keyframes accordion-up {
    from { height: var(--radix-accordion-content-height) }
    to { height: 0 }
  }
}

/*
  Universal Reset & Variable Definitions
  Ensures perfect button alignment and consistent theming.
*/
@layer base {
  :root {
    --background: hsl(0 0% 100%);
    --foreground: hsl(222.2 84% 4.9%);
    --card: hsl(0 0% 100%);
    --card-foreground: hsl(222.2 84% 4.9%);
    --popover: hsl(0 0% 100%);
    --popover-foreground: hsl(222.2 84% 4.9%);
    --primary: hsl(221.2 83.2% 53.3%);
    --primary-foreground: hsl(210 40% 98%);
    --secondary: hsl(210 40% 96.1%);
    --secondary-foreground: hsl(222.2 47.4% 11.2%);
    --muted: hsl(210 40% 96.1%);
    --muted-foreground: hsl(215.4 16.3% 46.9%);
    --accent: hsl(210 40% 96.1%);
    --accent-foreground: hsl(222.2 47.4% 11.2%);
    --destructive: hsl(0 84.2% 60.2%);
    --destructive-foreground: hsl(210 40% 98%);
    --border: hsl(214.3 31.8% 91.4%);
    --input: hsl(214.3 31.8% 91.4%);
    --ring: hsl(221.2 83.2% 53.3%);
    --radius: 0.5rem;
  }

  .dark {
    --background: hsl(222.2 84% 4.9%);
    --foreground: hsl(210 40% 98%);
    --card: hsl(222.2 84% 4.9%);
    --card-foreground: hsl(210 40% 98%);
    --popover: hsl(222.2 84% 4.9%);
    --popover-foreground: hsl(210 40% 98%);
    --primary: hsl(217.2 91.2% 59.8%);
    --primary-foreground: hsl(222.2 47.4% 11.2%);
    --secondary: hsl(217.2 32.6% 17.5%);
    --secondary-foreground: hsl(210 40% 98%);
    --muted: hsl(217.2 32.6% 17.5%);
    --muted-foreground: hsl(215 20.2% 65.1%);
    --accent: hsl(217.2 32.6% 17.5%);
    --accent-foreground: hsl(210 40% 98%);
    --destructive: hsl(0 62.8% 30.6%);
    --destructive-foreground: hsl(210 40% 98%);
    --border: hsl(217.2 32.6% 17.5%);
    --input: hsl(217.2 32.6% 17.5%);
    --ring: hsl(212.7 26.8% 83.9%);
  }

  * {
    border-color: var(--border);
  }

  body {
    background-color: var(--background);
    color: var(--foreground);
    font-feature-settings: "rlig" 1, "calt" 1;
    -webkit-font-smoothing: antialiased;
    -moz-osx-font-smoothing: grayscale;
  }

  /* 
    CRITICAL: Enforce flexbox centering for all buttons 
    This fixes the "crooked button" issue caused by line-height/vertical-align
  */
  button, 
  [role="button"],
  input[type="submit"],
  input[type="reset"],
  input[type="button"],
  .btn {
    display: inline-flex;
    align-items: center;
    justify-content: center;
    white-space: nowrap;
    vertical-align: middle;
  }
}
`;
  src.file("index.css", cssContent);

  return await zip.generateAsync({ type: "blob" });
};