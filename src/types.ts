export enum Language {
  EN = 'en',
  FA = 'fa'
}

export enum FileType {
  JS = 'js',
  JSX = 'jsx',
  TS = 'ts',
  TSX = 'tsx',
  UNKNOWN = 'unknown'
}

export interface AnalysisResult {
  dependencies: string[];
  localImports: string[];
}

export interface GeneratedProjectConfig {
  fileName: string;
  fileContent: string;
  projectName: string;
  dependencies: string[];
  localImports: string[];
}

export interface Translation {
  title: string;
  subtitle: string;
  dragDrop: string;
  orSelect: string;
  analyzing: string;
  generate: string;
  detectedDeps: string;
  noDeps: string;
  projectName: string;
  downloading: string;
  success: string;
  aboutTitle: string;
  aboutDesc: string;
  techStack: string;
  whyVite: string;
  whyViteDesc: string;
  howToRun: string;
  step1: string;
  step2: string;
  step3: string;
  footer: string;
  pasteCode: string;
  tabUpload: string;
  tabPaste: string;
  processing: string;
}