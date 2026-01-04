
import React from 'react';
import { Info, Play, Monitor, Tv } from 'lucide-react';

interface AdSensePlaceholderProps {
  slot?: string;
  className?: string;
  variant?: 'SIDEBAR' | 'BANNER' | 'VIDEO' | 'IN_FEED';
}

export const AdSensePlaceholder: React.FC<AdSensePlaceholderProps> = ({ 
  slot, 
  className = '', 
  variant = 'SIDEBAR' 
}) => {
  const getVariantStyles = () => {
    switch (variant) {
      case 'BANNER':
        return 'w-full h-24 md:h-32';
      case 'VIDEO':
        return 'w-full aspect-video md:h-48 min-h-[120px]';
      case 'IN_FEED':
        return 'w-full h-40';
      default:
        return 'w-full h-64';
    }
  };

  return (
    <div className={`glass rounded-2xl p-4 flex flex-col items-center justify-center border-dashed border-2 border-white/5 relative group overflow-hidden ${getVariantStyles()} ${className}`}>
      <div className="absolute top-2 right-2 opacity-0 group-hover:opacity-100 transition-opacity z-10">
        <Info size={12} className="text-slate-500 cursor-help" />
      </div>
      
      {variant === 'VIDEO' ? (
        <div className="absolute inset-0 bg-gradient-to-br from-slate-900 to-black flex flex-col items-center justify-center space-y-3">
           <div className="relative">
              <div className="absolute inset-0 bg-blue-500 blur-xl opacity-20 animate-pulse"></div>
              <div className="w-14 h-14 rounded-full bg-white/10 flex items-center justify-center border border-white/20 relative z-10 hover:scale-110 transition-transform cursor-pointer">
                 <Play size={24} className="text-white fill-white ml-1" />
              </div>
           </div>
           <div className="text-center z-10">
              <p className="text-[8px] font-black uppercase text-blue-400 tracking-[0.3em]">Neural Commercial Stream</p>
              <p className="text-[7px] text-slate-500 mt-0.5">CLICK TO SYNC AUDIO</p>
           </div>
           <div className="absolute top-3 left-3 flex items-center gap-1.5 px-2 py-1 rounded bg-black/40 border border-white/10">
              <Tv size={10} className="text-slate-400" />
              <span className="text-[7px] font-black text-slate-400 uppercase">Live Ad</span>
           </div>
        </div>
      ) : (
        <>
          <span className="text-[10px] font-bold text-slate-500 uppercase tracking-widest mb-2">Advertisement</span>
          <div className="w-full h-full bg-white/5 rounded-xl flex items-center justify-center text-slate-600 text-xs italic border border-white/5">
            {slot || `Nexus ${variant} Slot`}
          </div>
        </>
      )}
      
      <div className="absolute bottom-1 right-2 flex items-center gap-1">
         <Monitor size={8} className="text-slate-700" />
         <p className="text-[7px] text-slate-700 uppercase font-bold">Ads by Google</p>
      </div>
    </div>
  );
};
