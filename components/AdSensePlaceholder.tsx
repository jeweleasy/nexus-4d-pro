
import React from 'react';
import { Info } from 'lucide-react';

export const AdSensePlaceholder: React.FC<{ slot?: string, className?: string }> = ({ slot, className = '' }) => {
  return (
    <div className={`glass rounded-2xl p-4 flex flex-col items-center justify-center border-dashed border-2 border-white/5 relative group ${className}`}>
      <div className="absolute top-2 right-2 opacity-0 group-hover:opacity-100 transition-opacity">
        <Info size={12} className="text-slate-500 cursor-help" />
      </div>
      <span className="text-[10px] font-bold text-slate-500 uppercase tracking-widest mb-2">Advertisement</span>
      <div className="w-full h-32 bg-white/5 rounded-xl flex items-center justify-center text-slate-600 text-xs italic">
        {slot || "Premium Placement Slot"}
      </div>
      <p className="text-[8px] text-slate-600 mt-2 text-center">Ads by Google Nexus Partner Network</p>
    </div>
  );
};
