import { AnalysisResult } from '../types';

/**
 * Analyzes source code to find import statements.
 * Separates external NPM dependencies from local relative imports.
 */
export const analyzeDependencies = (code: string): AnalysisResult => {
  const dependencies = new Set<string>();
  const localImports = new Set<string>();

  // Regex to capture: import ... from "path";
  const importRegex = /(?:import|require)\s*(?:\(\s*|.*?from\s*)['"]([^'"]+)['"]/g;
  
  // Regex for side-effect imports: import "path";
  const sideEffectImportRegex = /import\s+['"]([^'"]+)['"]/g;

  const processPath = (path: string) => {
    if (!path) return;

    // Check if it's a local import
    if (path.startsWith('.') || path.startsWith('/')) {
      // Normalize path (remove leading ./)
      localImports.add(path);
    } else {
      // It's a package
      const pkg = cleanPackageName(path);
      if (pkg) dependencies.add(pkg);
    }
  };

  let match;
  while ((match = importRegex.exec(code)) !== null) {
    processPath(match[1]);
  }

  while ((match = sideEffectImportRegex.exec(code)) !== null) {
    processPath(match[1]);
  }

  // Smart Detection for implicit dependencies
  if (code.includes('motion.') || code.includes('AnimatePresence')) {
    dependencies.add('framer-motion');
  }
  
  // Clean up core react deps as they are handled manually in generator
  dependencies.delete('react');
  dependencies.delete('react-dom');
  dependencies.delete('fs');
  dependencies.delete('path');

  return {
    dependencies: Array.from(dependencies),
    localImports: Array.from(localImports)
  };
};

// Helper to handle deep imports like 'lodash/debounce' -> 'lodash'
const cleanPackageName = (name: string): string | null => {
  if (!name) return null;
  if (name.startsWith('.') || name.startsWith('/')) return null;

  if (name.startsWith('@')) {
    const parts = name.split('/');
    if (parts.length >= 2) return `${parts[0]}/${parts[1]}`;
    return name;
  }

  const parts = name.split('/');
  return parts[0];
};