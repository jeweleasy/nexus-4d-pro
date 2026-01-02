
import React from 'react';

export const NexusLogo: React.FC<{ size?: 'sm' | 'md' | 'lg', className?: string }> = ({ size = 'md', className = '' }) => {
  const dimensions = {
    sm: { box: 'w-8 h-8', font: 'text-lg' },
    md: { box: 'w-10 h-10', font: 'text-xl' },
    lg: { box: 'w-14 h-14', font: 'text-3xl' }
  };

  return (
    <div className={`flex items-center gap-3 ${className}`}>
      <div className={`${dimensions[size].box} relative group`}>
        {/* Outer Glow Hexagon */}
        <div className="absolute inset-0 bg-blue-600 rounded-lg rotate-45 opacity-20 group-hover:opacity-40 transition-opacity blur-sm"></div>
        
        {/* Main Logo Container */}
        <div className="absolute inset-0 bg-gradient-to-br from-blue-600 to-indigo-800 rounded-lg rotate-45 border border-white/20 flex items-center justify-center overflow-hidden shadow-lg shadow-blue-500/20">
          <div className="-rotate-45 font-orbitron font-black text-white select-none">
            N
          </div>
          {/* Scanning Effect Overlay */}
          <div className="absolute inset-0 bg-gradient-to-t from-transparent via-white/10 to-transparent -translate-y-full group-hover:translate-y-full transition-transform duration-1000 ease-in-out"></div>
        </div>
      </div>
      
      <div className="flex flex-col">
        <span className={`font-orbitron font-bold tracking-tighter ${dimensions[size].font}`}>
          4DNEXUS<span className="text-blue-500 drop-shadow-[0_0_8px_rgba(59,130,246,0.5)]">PRO</span>
        </span>
        {size !== 'sm' && (
          <span className="text-[10px] text-slate-500 uppercase font-bold tracking-[0.3em] -mt-1">Intelligence Platform</span>
        )}
      </div>
    </div>
  );
};
