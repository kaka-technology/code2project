#!/usr/bin/env python3
# -*- coding: utf-8 -*-

"""
Code2Project - Data Processing Utilities
Advanced data processing and analysis tools for project generation
"""

import json
import re
import os
import sys
from typing import List, Dict, Any, Optional, Tuple
from pathlib import Path
from datetime import datetime
import hashlib


class DataProcessor:
    """Main data processing class for Code2Project"""
    
    def __init__(self, config: Optional[Dict] = None):
        self.config = config or {}
        self.cache = {}
        
    def process_file(self, file_path: str) -> Dict[str, Any]:
        """Process a single file and extract metadata"""
        if not os.path.exists(file_path):
            raise FileNotFoundError(f"File not found: {file_path}")
            
        file_info = {
            'path': file_path,
            'name': os.path.basename(file_path),
            'size': os.path.getsize(file_path),
            'extension': Path(file_path).suffix,
            'modified': datetime.fromtimestamp(
                os.path.getmtime(file_path)
            ).isoformat()
        }
        
        return file_info
    
    def analyze_dependencies(self, code: str) -> List[str]:
        """Analyze code and extract dependencies"""
        dependencies = []
        
        # ES6 imports
        import_pattern = r'import\s+.*?\s+from\s+[\'"]([^\'"]+)[\'"]'
        dependencies.extend(re.findall(import_pattern, code))
        
        # Require statements
        require_pattern = r'require\([\'"]([^\'"]+)[\'"]\)'
        dependencies.extend(re.findall(require_pattern, code))
        
        return list(set(dependencies))
    
    def extract_components(self, code: str) -> List[Dict[str, str]]:
        """Extract React components from code"""
        components = []
        
        # Function components
        func_pattern = r'(?:export\s+)?(?:default\s+)?function\s+(\w+)'
        func_components = re.findall(func_pattern, code)
        
        # Arrow function components  
        arrow_pattern = r'(?:export\s+)?(?:const|let|var)\s+(\w+)\s*=\s*\([^)]*\)\s*=>'
        arrow_components = re.findall(arrow_pattern, code)
        
        # Class components
        class_pattern = r'class\s+(\w+)\s+extends\s+(?:React\.)?Component'
        class_components = re.findall(class_pattern, code)
        
        for name in func_components + arrow_components:
            components.append({
                'name': name,
                'type': 'function'
            })
            
        for name in class_components:
            components.append({
                'name': name,
                'type': 'class'
            })
        
        return components
    
    def calculate_complexity(self, code: str) -> Dict[str, Any]:
        """Calculate code complexity metrics"""
        lines = code.split('\n')
        total_lines = len(lines)
        code_lines = len([l for l in lines if l.strip() and not l.strip().startswith('//')])
        comment_lines = len([l for l in lines if l.strip().startswith('//')])
        
        return {
            'total_lines': total_lines,
            'code_lines': code_lines,
            'comment_lines': comment_lines,
            'blank_lines': total_lines - code_lines - comment_lines,
            'complexity_score': self._calculate_cyclomatic_complexity(code)
        }
    
    def _calculate_cyclomatic_complexity(self, code: str) -> int:
        """Calculate cyclomatic complexity"""
        keywords = ['if', 'else', 'for', 'while', 'case', '&&', '||', '?']
        complexity = 1
        
        for keyword in keywords:
            complexity += code.count(keyword)
        
        return complexity
    
    def optimize_imports(self, imports: List[str]) -> List[str]:
        """Optimize and deduplicate imports"""
        npm_packages = []
        local_imports = []
        
        for imp in imports:
            if imp.startswith('.') or imp.startswith('/'):
                local_imports.append(imp)
            else:
                # Extract base package name
                base_pkg = imp.split('/')[0]
                if base_pkg.startswith('@'):
                    base_pkg = '/'.join(imp.split('/')[:2])
                npm_packages.append(base_pkg)
        
        return {
            'npm': sorted(list(set(npm_packages))),
            'local': sorted(list(set(local_imports)))
        }
    
    def generate_hash(self, content: str) -> str:
        """Generate SHA256 hash of content"""
        return hashlib.sha256(content.encode()).hexdigest()
    
    def validate_syntax(self, code: str, language: str = 'javascript') -> Dict[str, Any]:
        """Basic syntax validation"""
        errors = []
        warnings = []
        
        # Check for common syntax errors
        if language in ['javascript', 'typescript']:
            # Unclosed brackets
            if code.count('{') != code.count('}'):
                errors.append('Mismatched curly braces')
            if code.count('(') != code.count(')'):
                errors.append('Mismatched parentheses')
            if code.count('[') != code.count(']'):
                errors.append('Mismatched square brackets')
            
            # Missing semicolons (warning)
            lines = code.split('\n')
            for i, line in enumerate(lines):
                stripped = line.strip()
                if stripped and not stripped.endswith((';', '{', '}', ',')) and \
                   not stripped.startswith(('if', 'for', 'while', 'function', 'class', '//')):
                    warnings.append(f'Line {i+1}: Missing semicolon')
        
        return {
            'valid': len(errors) == 0,
            'errors': errors,
            'warnings': warnings
        }
    
    def format_package_json(self, dependencies: List[str], 
                          project_name: str = 'my-project') -> Dict[str, Any]:
        """Generate package.json content"""
        return {
            'name': project_name.lower().replace(' ', '-'),
            'version': '1.0.0',
            'private': True,
            'type': 'module',
            'scripts': {
                'dev': 'vite',
                'build': 'tsc && vite build',
                'preview': 'vite preview',
                'lint': 'eslint . --ext ts,tsx --report-unused-disable-directives --max-warnings 0'
            },
            'dependencies': self._get_dependency_versions(dependencies),
            'devDependencies': {
                '@types/react': '^18.3.12',
                '@types/react-dom': '^18.3.1',
                '@typescript-eslint/eslint-plugin': '^8.15.0',
                '@typescript-eslint/parser': '^8.15.0',
                '@vitejs/plugin-react': '^4.3.4',
                'eslint': '^9.15.0',
                'eslint-plugin-react-hooks': '^5.0.0',
                'eslint-plugin-react-refresh': '^0.4.14',
                'typescript': '^5.6.2',
                'vite': '^6.0.1'
            }
        }
    
    def _get_dependency_versions(self, deps: List[str]) -> Dict[str, str]:
        """Get latest versions for dependencies"""
        version_map = {
            'react': '^18.3.1',
            'react-dom': '^18.3.1',
            'react-router-dom': '^6.28.0',
            'axios': '^1.7.9',
            'lodash': '^4.17.21',
            'moment': '^2.30.1',
            'classnames': '^2.5.1',
            '@tanstack/react-query': '^5.62.8',
            'zustand': '^5.0.2',
            'framer-motion': '^11.15.0'
        }
        
        return {dep: version_map.get(dep, '^1.0.0') for dep in deps}
    
    def generate_report(self, analysis_results: Dict[str, Any]) -> str:
        """Generate analysis report in markdown"""
        report = f"""# Code Analysis Report
Generated: {datetime.now().strftime('%Y-%m-%d %H:%M:%S')}

## Summary
- **Total Files**: {analysis_results.get('file_count', 0)}
- **Total Lines**: {analysis_results.get('total_lines', 0)}
- **Components Found**: {len(analysis_results.get('components', []))}
- **Dependencies**: {len(analysis_results.get('dependencies', []))}

## Complexity Metrics
- **Average Complexity**: {analysis_results.get('avg_complexity', 0):.2f}
- **Code Lines**: {analysis_results.get('code_lines', 0)}
- **Comment Lines**: {analysis_results.get('comment_lines', 0)}

## Dependencies
```json
{json.dumps(analysis_results.get('dependencies', []), indent=2)}
```

## Components
"""
        for comp in analysis_results.get('components', []):
            report += f"- **{comp['name']}** ({comp['type']})\n"
        
        return report


class CodeOptimizer:
    """Optimize and clean up code"""
    
    @staticmethod
    def remove_comments(code: str, language: str = 'javascript') -> str:
        """Remove comments from code"""
        if language in ['javascript', 'typescript']:
            # Remove single-line comments
            code = re.sub(r'//.*?$', '', code, flags=re.MULTILINE)
            # Remove multi-line comments
            code = re.sub(r'/\*.*?\*/', '', code, flags=re.DOTALL)
        
        return code
    
    @staticmethod
    def minify_code(code: str) -> str:
        """Basic code minification"""
        # Remove extra whitespace
        code = re.sub(r'\s+', ' ', code)
        # Remove spaces around operators
        code = re.sub(r'\s*([{}();,])\s*', r'\1', code)
        
        return code.strip()
    
    @staticmethod
    def format_code(code: str, indent: int = 2) -> str:
        """Format code with proper indentation"""
        lines = code.split('\n')
        formatted = []
        indent_level = 0
        
        for line in lines:
            stripped = line.strip()
            if not stripped:
                continue
            
            # Decrease indent for closing brackets
            if stripped.startswith(('}', ']', ')')):
                indent_level = max(0, indent_level - 1)
            
            formatted.append(' ' * (indent_level * indent) + stripped)
            
            # Increase indent for opening brackets
            if stripped.endswith(('{', '[', '(')):
                indent_level += 1
        
        return '\n'.join(formatted)


class ProjectGenerator:
    """Generate complete project structure"""
    
    def __init__(self, base_path: str = '.'):
        self.base_path = Path(base_path)
        
    def create_structure(self, project_name: str) -> Dict[str, str]:
        """Create project directory structure"""
        project_path = self.base_path / project_name
        
        directories = [
            'src',
            'src/components',
            'src/utils',
            'src/services',
            'public',
            'public/assets'
        ]
        
        created = {}
        for directory in directories:
            dir_path = project_path / directory
            dir_path.mkdir(parents=True, exist_ok=True)
            created[directory] = str(dir_path)
        
        return created
    
    def generate_config_files(self, project_path: str) -> Dict[str, str]:
        """Generate configuration files"""
        configs = {
            'tsconfig.json': self._get_tsconfig(),
            'vite.config.ts': self._get_vite_config(),
            '.gitignore': self._get_gitignore(),
            '.eslintrc.json': self._get_eslint_config()
        }
        
        return configs
    
    @staticmethod
    def _get_tsconfig() -> str:
        """Get TypeScript configuration"""
        return json.dumps({
            'compilerOptions': {
                'target': 'ES2020',
                'useDefineForClassFields': True,
                'lib': ['ES2020', 'DOM', 'DOM.Iterable'],
                'module': 'ESNext',
                'skipLibCheck': True,
                'moduleResolution': 'bundler',
                'allowImportingTsExtensions': True,
                'resolveJsonModule': True,
                'isolatedModules': True,
                'noEmit': True,
                'jsx': 'react-jsx',
                'strict': True,
                'noUnusedLocals': True,
                'noUnusedParameters': True,
                'noFallthroughCasesInSwitch': True
            },
            'include': ['src'],
            'references': [{'path': './tsconfig.node.json'}]
        }, indent=2)
    
    @staticmethod
    def _get_vite_config() -> str:
        """Get Vite configuration"""
        return """import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

export default defineConfig({
  plugins: [react()],
  server: {
    port: 3000,
    open: true
  }
})"""
    
    @staticmethod
    def _get_gitignore() -> str:
        """Get .gitignore content"""
        return """# Logs
logs
*.log
npm-debug.log*
yarn-debug.log*
yarn-error.log*
pnpm-debug.log*
lerna-debug.log*

node_modules
dist
dist-ssr
*.local

# Editor directories and files
.vscode/*
!.vscode/extensions.json
.idea
.DS_Store
*.suo
*.ntvs*
*.njsproj
*.sln
*.sw?
"""
    
    @staticmethod
    def _get_eslint_config() -> str:
        """Get ESLint configuration"""
        return json.dumps({
            'extends': [
                'eslint:recommended',
                'plugin:@typescript-eslint/recommended',
                'plugin:react-hooks/recommended'
            ],
            'parser': '@typescript-eslint/parser',
            'plugins': ['react-refresh'],
            'rules': {
                'react-refresh/only-export-components': 'warn'
            }
        }, indent=2)


def main():
    """Main entry point"""
    print("Code2Project - Data Processor v1.0.0")
    print("=" * 50)
    
    processor = DataProcessor()
    optimizer = CodeOptimizer()
    generator = ProjectGenerator()
    
    # Example usage
    sample_code = """
    import React from 'react';
    import { useState } from 'react';
    
    function App() {
        const [count, setCount] = useState(0);
        return <div>Count: {count}</div>;
    }
    
    export default App;
    """
    
    print("\n📊 Analyzing code...")
    deps = processor.analyze_dependencies(sample_code)
    print(f"✅ Found {len(deps)} dependencies")
    
    complexity = processor.calculate_complexity(sample_code)
    print(f"📈 Complexity score: {complexity['complexity_score']}")
    
    print("\n✨ Optimization complete!")


if __name__ == '__main__':
    main()
