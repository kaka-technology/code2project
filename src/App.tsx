import React, { useState, useEffect, useRef } from 'react';
import { 
  Upload, FileCode, Download, Sun, Moon,
  Cpu, Zap, CheckCircle, Package, Terminal,
  Code2, ShieldCheck, Box, Activity, Sparkles
} from 'lucide-react';
import { CyberCard } from './components/CyberCard';
import { Language, FileType, Translation } from './types';
import { TRANSLATIONS } from './constants';
import { analyzeDependencies } from './services/analyzer';
import { generateProjectZip } from './services/zipGenerator';

const App: React.FC = () => {
  const [language, setLanguage] = useState<Language>(Language.FA);
  const [theme, setTheme] = useState<'dark' | 'light'>('dark');
  const [activeTab, setActiveTab] = useState<'upload' | 'paste'>('upload');
  
  const [fileContent, setFileContent] = useState<string>('');
  const [fileName, setFileName] = useState<string>('');
  const [fileType, setFileType] = useState<FileType>(FileType.UNKNOWN);
  
  const [dependencies, setDependencies] = useState<string[]>([]);
  const [localImports, setLocalImports] = useState<string[]>([]);
  const [projectName, setProjectName] = useState('neon-app-01');
  const [isProcessing, setIsProcessing] = useState(false);
  const [downloadUrl, setDownloadUrl] = useState<string | null>(null);

  const t: Translation = TRANSLATIONS[language];
  const fileInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    const root = document.documentElement;
    const body = document.body;
    if (theme === 'dark') {
      root.classList.add('dark');
      root.classList.remove('light');
      body.classList.remove('light-bg');
      body.classList.add('cyber-bg');
      body.classList.add('text-white');
      body.classList.remove('text-gray-900');
    } else {
      root.classList.add('light');
      root.classList.remove('dark');
      body.classList.remove('cyber-bg');
      body.classList.add('light-bg');
      body.classList.remove('text-white');
      body.classList.add('text-gray-900');
    }
  }, [theme]);

  const toggleTheme = () => setTheme(prev => prev === 'dark' ? 'light' : 'dark');
  const toggleLang = () => setLanguage(language === Language.EN ? Language.FA : Language.EN);

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
      const text = await file.text();
      setFileName(file.name);
      setFileContent(text);
      detectFileType(file.name);
      analyzeDeps(text);
    }
  };

  const handleTextChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    const text = e.target.value;
    setFileContent(text);
    if (!fileName) {
       setFileName('App.tsx');
       setFileType(FileType.TSX);
    }
    analyzeDeps(text);
  };

  const detectFileType = (name: string) => {
    if (name.endsWith('.tsx')) setFileType(FileType.TSX);
    else if (name.endsWith('.ts')) setFileType(FileType.TS);
    else if (name.endsWith('.jsx')) setFileType(FileType.JSX);
    else if (name.endsWith('.js')) setFileType(FileType.JS);
    else setFileType(FileType.UNKNOWN);
  };

  const analyzeDeps = (code: string) => {
    const result = analyzeDependencies(code);
    setDependencies(result.dependencies);
    setLocalImports(result.localImports);
    setDownloadUrl(null);
  };

  const handleGenerate = async () => {
    if (!fileContent) return;

    setIsProcessing(true);
    
    try {
      await new Promise(resolve => setTimeout(resolve, 800));
      const finalName = fileName || 'App.tsx';

      const blob = await generateProjectZip({
        fileContent,
        fileName: finalName,
        projectName,
        dependencies,
        localImports
      }, fileType === FileType.UNKNOWN ? FileType.TSX : fileType);

      const url = URL.createObjectURL(blob);
      setDownloadUrl(url);
    } catch (error) {
      console.error(error);
      alert('Error generating project');
    } finally {
      setIsProcessing(false);
    }
  };

  const isRTL = language === Language.FA;

  return (
    <div dir={isRTL ? 'rtl' : 'ltr'} className="min-h-full flex flex-col relative z-10 transition-colors duration-500">
      
      {/* Navbar */}
      <nav className="z-50">
        <div className="max-w-7xl mx-auto px-6">
          <div className="flex items-center justify-between h-20">
            <div className="flex items-center gap-4 select-none group cursor-default">
              <div className="relative w-12 h-12 flex items-center justify-center rounded-2xl bg-gradient-to-br from-cyan-500 to-pink-500 shadow-neon-cyan group-hover:shadow-neon-pink transition-all duration-500 group-hover:rotate-180">
                <Activity className="w-7 h-7 text-white" />
              </div>
              <div className="flex flex-col">
                <span className="text-2xl font-cyber font-black text-neon-3d bg-gradient-to-r from-cyan-400 via-purple-400 to-pink-400 bg-clip-text text-transparent tracking-wider leading-none">
                  CODE<span className="text-gray-900 dark:text-white">2</span>PROJECT
                </span>
                <span className="text-[9px] font-bold text-cyan-600 dark:text-cyan-400/60 tracking-[0.35em] mt-1.5 group-hover:text-pink-600 dark:group-hover:text-pink-400/60 transition-colors">
                  GLASS EDITION
                </span>
              </div>
            </div>
            
            <div className="flex items-center gap-3">
               <button 
                onClick={toggleTheme}
                className="w-11 h-11 flex items-center justify-center rounded-full glass-card text-cyan-600 dark:text-cyan-400 hover:text-pink-600 dark:hover:text-pink-400 hover:shadow-neon-cyan transition-all duration-500 group"
              >
                <div className="group-hover:rotate-180 transition-transform duration-500">
                  {theme === 'dark' ? <Sun className="w-5 h-5" /> : <Moon className="w-5 h-5" />}
                </div>
              </button>
              
                <button 
                onClick={toggleLang} 
                className="px-5 h-11 flex items-center justify-center rounded-full glass-card font-cyber font-black text-sm tracking-wider text-gray-900 dark:text-white hover:shadow-neon-cyan transition-all duration-500"
              >
                {language === Language.EN ? 'EN' : 'فا'}
              </button>
            </div>
          </div>
        </div>
      </nav>

      {/* Main Content */}
      <div className="flex-grow max-w-7xl mx-auto px-6 py-12 w-full">
        
        {/* Header Section */}
        <div className="text-center mb-16 relative">
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[700px] h-[200px] bg-gradient-to-r from-cyan-500/10 via-purple-500/10 to-pink-500/10 blur-[100px] -z-10 rounded-full animate-glow"></div>
          
          <div className="inline-block mb-8 animate-float">
            <div className="relative">
              <div className="absolute inset-0 bg-gradient-to-r from-cyan-500 to-pink-500 blur-2xl opacity-50"></div>
              <Sparkles className="relative w-16 h-16 text-cyan-400 mx-auto" />
            </div>
          </div>

          <h1 className="text-6xl md:text-8xl font-cyber font-black text-neon-3d mb-6 tracking-tight">
            <span className="bg-gradient-to-r from-cyan-400 via-purple-400 to-pink-400 bg-clip-text text-transparent">
              {t.title}
            </span>
          </h1>
          <p className="text-lg md:text-xl text-gray-700 dark:text-white/80 max-w-2xl mx-auto font-medium leading-relaxed">
            {t.subtitle}
          </p>
        </div>

        {/* Main Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 mb-16">
          
          {/* Left: Input (8 cols) */}
          <div className="lg:col-span-8 h-full">
            <CyberCard 
              title={activeTab === 'paste' ? t.tabPaste : t.tabUpload}
              icon={<Code2 className="w-5 h-5" />}
              className="h-full flex flex-col"
            >
              {/* Tab Switcher */}
              <div className="relative flex mb-6 p-1.5 glass-card rounded-full" dir="ltr">
                {/* Sliding Background */}
                <div 
                  className="absolute top-1.5 bottom-1.5 w-[calc(50%-6px)] rounded-full shadow-lg transition-all duration-500 ease-out"
                  style={{
                    background: 'rgba(255, 255, 255, 0.15)',
                    backdropFilter: 'blur(20px)',
                    WebkitBackdropFilter: 'blur(20px)',
                    border: '1px solid rgba(255, 255, 255, 0.3)',
                    left: language === Language.FA 
                      ? (activeTab === 'paste' ? '6px' : 'calc(50% + 3px)')
                      : (activeTab === 'upload' ? '6px' : 'calc(50% + 3px)')
                  }}
                />
                
                {language === Language.FA ? (
                  <>
                    <button 
                      onClick={() => setActiveTab('paste')}
                      className={`relative flex-1 py-3 px-6 text-xs font-cyber font-black uppercase tracking-wider rounded-full transition-all duration-500 z-10 ${
                        activeTab === 'paste' 
                          ? 'text-cyan-600 dark:text-cyan-400 scale-105' 
                          : 'text-gray-600 dark:text-white/50 hover:text-gray-900 dark:hover:text-white/80'
                      }`}
                    >
                      <div className="flex items-center justify-center gap-2">
                        <Code2 className="w-4 h-4" />
                        {t.tabPaste}
                      </div>
                    </button>
                    
                    <button 
                      onClick={() => setActiveTab('upload')}
                      className={`relative flex-1 py-3 px-6 text-xs font-cyber font-black uppercase tracking-wider rounded-full transition-all duration-500 z-10 ${
                        activeTab === 'upload' 
                          ? 'text-cyan-600 dark:text-cyan-400 scale-105' 
                          : 'text-gray-600 dark:text-white/50 hover:text-gray-900 dark:hover:text-white/80'
                      }`}
                    >
                      <div className="flex items-center justify-center gap-2">
                        <Upload className="w-4 h-4" />
                        {t.tabUpload}
                      </div>
                    </button>
                  </>
                ) : (
                  <>
                    <button 
                      onClick={() => setActiveTab('upload')}
                      className={`relative flex-1 py-3 px-6 text-xs font-cyber font-black uppercase tracking-wider rounded-full transition-all duration-500 z-10 ${
                        activeTab === 'upload' 
                          ? 'text-cyan-600 dark:text-cyan-400 scale-105' 
                          : 'text-gray-600 dark:text-white/50 hover:text-gray-900 dark:hover:text-white/80'
                      }`}
                    >
                      <div className="flex items-center justify-center gap-2">
                        <Upload className="w-4 h-4" />
                        {t.tabUpload}
                      </div>
                    </button>
                    
                    <button 
                      onClick={() => setActiveTab('paste')}
                      className={`relative flex-1 py-3 px-6 text-xs font-cyber font-black uppercase tracking-wider rounded-full transition-all duration-500 z-10 ${
                        activeTab === 'paste' 
                          ? 'text-cyan-600 dark:text-cyan-400 scale-105' 
                          : 'text-gray-600 dark:text-white/50 hover:text-gray-900 dark:hover:text-white/80'
                      }`}
                    >
                      <div className="flex items-center justify-center gap-2">
                        <Code2 className="w-4 h-4" />
                        {t.tabPaste}
                      </div>
                    </button>
                  </>
                )}
              </div>

              {activeTab === 'paste' ? (
                <div className="flex flex-col gap-4 flex-1">
                  <div className="relative" style={{ height: '450px' }}>
                     <textarea
                        className="relative w-full h-full glass-card rounded-3xl p-6 font-mono text-sm text-gray-900 dark:text-white/90 focus:outline-none resize-none placeholder-gray-400 dark:placeholder-white/40 transition-all"
                        placeholder={t.pasteCode}
                        value={fileContent}
                        onChange={handleTextChange}
                     />
                  </div>
                </div>
              ) : (
                <div 
                  onClick={() => fileInputRef.current?.click()}
                  className="relative flex-1 min-h-[350px] border-2 border-dashed border-white/10 glass-card rounded-3xl flex flex-col items-center justify-center cursor-pointer hover:border-cyan-500/50 hover:shadow-neon-cyan transition-all duration-500 group overflow-hidden"
                >
                  <div className="absolute inset-0 bg-gradient-to-br from-cyan-500/5 to-pink-500/5 opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
                  
                  <input 
                    type="file" 
                    ref={fileInputRef} 
                    className="hidden" 
                    accept=".js,.jsx,.ts,.tsx"
                    onChange={handleFileChange}
                  />
                  
                  <div className="relative z-10 flex flex-col items-center animate-float">
                    <div className="relative mb-8 group-hover:scale-110 transition-transform duration-500">
                      <div className="absolute inset-0 bg-gradient-to-br from-cyan-500 to-pink-500 rounded-3xl blur-xl opacity-50 group-hover:opacity-100 transition-opacity"></div>
                      <div className="relative w-24 h-24 rounded-3xl glass-card flex items-center justify-center border-2 border-white/10 group-hover:border-cyan-500/50">
                        <Upload className="w-12 h-12 text-cyan-400 group-hover:text-pink-400 transition-colors" />
                      </div>
                    </div>
                    <p className="text-2xl font-cyber font-black text-gray-900 dark:text-white mb-3">{t.dragDrop}</p>
                    <p className="text-sm text-gray-600 dark:text-white/60 font-mono tracking-wide">{t.orSelect}</p>
                  </div>
                </div>
              )}

              {/* Show filename status if uploaded */}
              {activeTab === 'upload' && fileName && (
                <div className="mt-4 flex items-center gap-3 p-4 glass-card rounded-2xl border border-emerald-500/30 animate-in slide-in-from-bottom-2 fade-in shadow-neon-cyan">
                  <div className="relative">
                    <div className="absolute inset-0 bg-emerald-500 rounded-full blur-md opacity-50"></div>
                    <div className="relative p-2 rounded-full bg-emerald-500/20">
                      <CheckCircle className="w-5 h-5 text-emerald-400" />
                    </div>
                  </div>
                  <span className="font-mono text-sm font-bold text-emerald-400">{fileName}</span>
                </div>
              )}
            </CyberCard>
          </div>

          {/* Right: Controls & Stats (4 cols) */}
          <div className="lg:col-span-4 flex flex-col gap-6">
            <CyberCard title={t.projectName} icon={<Box className="w-5 h-5"/>} className="flex-none">
              <div className="space-y-5">
                <div className="relative group">
                   <label className="block text-[10px] font-cyber font-black text-cyan-400/60 mb-3 uppercase tracking-widest pl-1">Project ID</label>
                   <div className="absolute bottom-0 left-0 right-0 h-[2px] bg-gradient-to-r from-cyan-500 to-pink-500 opacity-0 group-focus-within:opacity-100 transition-opacity duration-300 blur-sm"></div>
                   <input
                    type="text"
                    value={projectName}
                    onChange={(e) => setProjectName(e.target.value)}
                    className="w-full glass-card rounded-2xl px-5 py-4 text-sm font-mono text-gray-900 dark:text-white focus:outline-none transition-all placeholder-gray-400 dark:placeholder-white/40"
                  />
                </div>
                
                <button
                  disabled={!fileContent || isProcessing || (activeTab === 'paste' && !fileName)}
                  onClick={handleGenerate}
                  className={`
                    w-full py-5 rounded-full font-cyber font-black text-sm uppercase tracking-widest flex items-center justify-center gap-3 transition-all duration-500 group relative overflow-hidden
                    ${!fileContent || isProcessing || (activeTab === 'paste' && !fileName)
                      ? 'glass-card text-gray-500 dark:text-white/30 cursor-not-allowed' 
                      : 'bg-gradient-to-r from-cyan-500 to-pink-500 text-white shadow-neon-cyan hover:shadow-neon-pink hover:scale-105'
                    }
                  `}
                >
                  <div className="absolute inset-0 bg-gradient-to-r from-pink-500 to-cyan-500 translate-x-full group-hover:translate-x-0 transition-transform duration-500"></div>
                  {isProcessing ? (
                    <>
                      <Zap className="w-6 h-6 animate-spin relative z-10" />
                      <span className="relative z-10">{t.processing}</span>
                    </>
                  ) : (
                    <>
                      <Cpu className="w-6 h-6 relative z-10 group-hover:rotate-180 transition-transform duration-500" />
                      <span className="relative z-10">{t.generate}</span>
                    </>
                  )}
                </button>

                {downloadUrl && (
                  <a
                    href={downloadUrl}
                    download={`${projectName}.zip`}
                    className="w-full py-5 bg-gradient-to-r from-emerald-500 to-teal-500 text-white rounded-full font-cyber font-black text-sm uppercase tracking-wider transition-all shadow-neon-cyan hover:shadow-neon-pink flex items-center justify-center gap-3 animate-in fade-in zoom-in duration-500 hover:scale-105"
                  >
                    <Download className="w-6 h-6" />
                    DOWNLOAD ZIP
                  </a>
                )}
              </div>
            </CyberCard>

            <CyberCard title={t.detectedDeps} icon={<Package className="w-5 h-5"/>} className="flex-1 min-h-[200px]">
              {(dependencies.length > 0 || localImports.length > 0) ? (
                <div className="flex flex-wrap gap-2 content-start">
                  {dependencies.map((dep, idx) => (
                    <span 
                      key={idx} 
                      className="group px-3 py-2 glass-card rounded-full text-cyan-600 dark:text-cyan-400 text-xs font-mono font-bold flex items-center gap-2 hover:shadow-neon-cyan hover:scale-105 transition-all duration-300"
                    >
                      <Package className="w-3.5 h-3.5 group-hover:rotate-180 transition-transform duration-500" />
                      {dep}
                    </span>
                  ))}
                  {localImports.map((imp, idx) => (
                     <span 
                     key={`local-${idx}`} 
                     className="group px-3 py-2 glass-card rounded-full text-pink-600 dark:text-pink-400 text-xs font-mono font-bold flex items-center gap-2 hover:shadow-neon-pink hover:scale-105 transition-all duration-300"
                   >
                     <FileCode className="w-3.5 h-3.5 group-hover:rotate-180 transition-transform duration-500" />
                     {imp}
                   </span>
                  ))}
                </div>
              ) : (
                <div className="h-full flex flex-col items-center justify-center text-gray-500 dark:text-white/40 gap-4">
                   <div className="relative">
                     <div className="absolute inset-0 bg-cyan-500/20 rounded-full blur-xl"></div>
                     <div className="relative w-16 h-16 rounded-full glass-card flex items-center justify-center animate-pulse">
                       <Package className="w-8 h-8" />
                     </div>
                   </div>
                   <span className="text-xs font-mono tracking-widest">{t.noDeps}</span>
                </div>
              )}
            </CyberCard>
          </div>
        </div>

        {/* Bottom Section */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
           <CyberCard title={t.aboutTitle} icon={<ShieldCheck className="w-4 h-4" />}>
              <p className="text-gray-700 dark:text-white/70 text-xs leading-relaxed mb-5 font-medium">
                {t.aboutDesc}
              </p>
              <div className="flex items-center gap-2 text-[10px] font-cyber font-black text-emerald-600 dark:text-emerald-400 glass-card px-4 py-2 rounded-full w-fit group hover:shadow-neon-cyan transition-all">
                 <span className="w-2 h-2 bg-emerald-500 rounded-full animate-pulse"></span>
                 <span className="group-hover:tracking-wider transition-all">SYSTEM ONLINE</span>
              </div>
           </CyberCard>

           <CyberCard title={t.whyVite} icon={<Zap className="w-4 h-4" />}>
              <p className="text-gray-700 dark:text-white/70 text-xs leading-relaxed font-medium">
                {t.whyViteDesc}
              </p>
           </CyberCard>

           <CyberCard title={t.techStack} icon={<FileCode className="w-4 h-4" />}>
              <div className="grid grid-cols-2 gap-3">
                 {['TSX', 'JSX', 'TS', 'JS'].map((fmt) => (
                    <div key={fmt} className="group flex items-center justify-center py-3 glass-card rounded-2xl hover:shadow-neon-cyan transition-all cursor-default">
                       <span className="text-sm font-cyber font-black text-gray-800 dark:text-white/80 group-hover:text-cyan-600 dark:group-hover:text-cyan-400 transition-colors group-hover:scale-110 inline-block">{fmt}</span>
                    </div>
                 ))}
              </div>
           </CyberCard>

           <CyberCard title={t.howToRun} icon={<Terminal className="w-4 h-4" />}>
             <ul className="space-y-3 font-mono text-[11px] text-gray-700 dark:text-white/70">
                <li className="flex items-center gap-3 p-3 glass-card rounded-2xl group hover:shadow-neon-cyan transition-all">
                  <span className="text-cyan-600 dark:text-cyan-400 font-black text-xl leading-none group-hover:translate-x-1 transition-transform">›</span>
                  <span className="group-hover:text-gray-900 dark:group-hover:text-white transition-colors">{t.step1}</span>
                </li>
                <li className="flex items-center gap-3 p-3 glass-card rounded-2xl group hover:shadow-neon-pink transition-all">
                  <span className="text-pink-600 dark:text-pink-400 font-black text-xl leading-none group-hover:translate-x-1 transition-transform">›</span>
                  <span className="text-gray-900 dark:text-white font-bold group-hover:scale-105 inline-block transition-transform">npm install</span>
                </li>
                <li className="flex items-center gap-3 p-3 glass-card rounded-2xl group hover:shadow-lg transition-all">
                  <span className="text-purple-600 dark:text-purple-400 font-black text-xl leading-none group-hover:translate-x-1 transition-transform">›</span>
                  <span className="text-gray-900 dark:text-white font-bold group-hover:scale-105 inline-block transition-transform">npm run dev</span>
                </li>
             </ul>
           </CyberCard>
        </div>
      </div>
    </div>
  );
};

export default App;