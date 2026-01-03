import React from 'react';

interface CyberCardProps {
  children: React.ReactNode;
  className?: string;
  title?: string;
  icon?: React.ReactNode;
}

export const CyberCard: React.FC<CyberCardProps> = ({ children, className = '', title, icon }) => {
  return (
    <div className={`
      relative group
      glass-card
      rounded-3xl
      shadow-glass
      transition-all duration-500
      hover:shadow-glass-hover hover:scale-[1.01]
      hover:border-cyan-400/40
      overflow-hidden
      ${className}
    `}>
      {/* Animated Border Glow */}
      <div className="absolute inset-0 rounded-3xl opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none">
        <div className="absolute top-0 left-0 w-full h-[2px] bg-gradient-to-r from-transparent via-cyan-400 to-transparent animate-shimmer"></div>
      </div>

      {/* Floating Orb Effect */}
      <div className="absolute -top-24 -right-24 w-48 h-48 bg-gradient-to-br from-cyan-400/15 to-pink-400/15 rounded-full blur-3xl opacity-0 group-hover:opacity-100 transition-opacity duration-700"></div>

      {title && (
        <div className="relative px-7 py-6 flex items-center gap-4 border-b border-white/5">
          {icon && (
            <div className="relative group-hover:scale-110 transition-transform duration-300">
              <div className="absolute inset-0 bg-gradient-to-br from-cyan-400/40 to-pink-400/40 rounded-2xl blur-lg opacity-0 group-hover:opacity-100 transition-opacity"></div>
              <div className="relative p-3 rounded-2xl glass-card text-cyan-400">
                {icon}
              </div>
            </div>
          )}
          <h3 className="text-lg font-cyber font-bold text-neon-3d bg-gradient-to-r from-cyan-400 to-pink-400 bg-clip-text text-transparent tracking-wide drop-shadow-lg">
            {title}
          </h3>
        </div>
      )}
      
      <div className="relative p-7 z-10">
        {children}
      </div>
    </div>
  );
};
