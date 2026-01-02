
import React from 'react';
import { Layers } from 'lucide-react';

export const Heatmap: React.FC = () => {
  // Mock frequency data: [Pos1, Pos2, Pos3, Pos4] x [Digit 0-9]
  const data = Array(4).fill(0).map(() => Array(10).fill(0).map(() => Math.floor(Math.random() * 100)));

  const getIntensity = (val: number) => {
    if (val > 80) return 'bg-amber-500 text-black';
    if (val > 60) return 'bg-amber-500/60 text-white';
    if (val > 40) return 'bg-blue-600/40 text-blue-200';
    return 'bg-white/5 text-slate-600';
  };

  return (
    <div className="glass rounded-2xl p-6 border border-white/5 space-y-6">
      <div className="flex items-center justify-between">
        <h3 className="text-lg font-orbitron font-bold flex items-center gap-3">
          <Layers className="text-amber-500" size={18} /> Digit Heatmap
        </h3>
        <span className="text-[9px] font-black uppercase text-slate-500 tracking-widest">Position Frequency</span>
      </div>

      <div className="grid grid-cols-5 gap-2">
        <div className="text-[10px] text-slate-500 uppercase font-bold text-center">Digit</div>
        <div className="text-[10px] text-slate-500 uppercase font-bold text-center">Pos 1</div>
        <div className="text-[10px] text-slate-500 uppercase font-bold text-center">Pos 2</div>
        <div className="text-[10px] text-slate-500 uppercase font-bold text-center">Pos 3</div>
        <div className="text-[10px] text-slate-500 uppercase font-bold text-center">Pos 4</div>
        
        {Array(10).fill(0).map((_, digit) => (
          <React.Fragment key={digit}>
            <div className="flex items-center justify-center font-orbitron font-bold text-slate-400">{digit}</div>
            {data.map((pos, i) => (
              <div 
                key={i} 
                className={`h-8 rounded-lg flex items-center justify-center text-[10px] font-black transition-all hover:scale-110 cursor-help ${getIntensity(pos[digit])}`}
                title={`Digit ${digit} at Pos ${i+1}: ${pos[digit]}% Frequency`}
              >
                {pos[digit]}
              </div>
            ))}
          </React.Fragment>
        ))}
      </div>

      <div className="flex justify-between items-center pt-4 border-t border-white/5">
        <div className="flex gap-4">
           <div className="flex items-center gap-1"><div className="w-2 h-2 rounded bg-amber-500"></div> <span className="text-[8px] uppercase text-slate-500">Hot</span></div>
           <div className="flex items-center gap-1"><div className="w-2 h-2 rounded bg-blue-600/40"></div> <span className="text-[8px] uppercase text-slate-500">Normal</span></div>
           <div className="flex items-center gap-1"><div className="w-2 h-2 rounded bg-white/5"></div> <span className="text-[8px] uppercase text-slate-500">Cold</span></div>
        </div>
        <button className="text-[9px] font-black uppercase text-blue-500 hover:text-blue-400">Expand Matrix</button>
      </div>
    </div>
  );
};
