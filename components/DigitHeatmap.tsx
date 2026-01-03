
import React, { useState, useMemo } from 'react';
import { Layers, Activity, Info, Sparkles, Crosshair } from 'lucide-react';
import { LANGUAGES } from '../constants';

interface FrequencyNode {
  digit: number;
  pos: number;
  freq: number;
  lastSeen: string;
}

interface DigitHeatmapProps {
  lang: 'EN' | 'CN' | 'MY';
}

export const DigitHeatmap: React.FC<DigitHeatmapProps> = ({ lang }) => {
  const [hoverNode, setHoverNode] = useState<FrequencyNode | null>(null);
  
  const t = LANGUAGES[lang];

  // Generate deterministic mock data for the heatmap
  const data: FrequencyNode[] = useMemo(() => {
    const nodes: FrequencyNode[] = [];
    for (let pos = 1; pos <= 4; pos++) {
      for (let digit = 0; digit <= 9; digit++) {
        // Create some pseudo-patterns
        const baseFreq = 40 + (Math.sin(pos * digit) * 30) + (Math.random() * 20);
        nodes.push({
          digit,
          pos,
          freq: Math.floor(Math.min(99, Math.max(5, baseFreq))),
          lastSeen: `${Math.floor(Math.random() * 24)}h ago`
        });
      }
    }
    return nodes;
  }, []);

  const getIntensityColor = (freq: number) => {
    if (freq > 85) return 'bg-amber-500 shadow-[0_0_15px_rgba(245,158,11,0.4)] border-amber-400';
    if (freq > 70) return 'bg-amber-500/60 border-amber-500/30';
    if (freq > 50) return 'bg-blue-600/50 border-blue-500/20';
    if (freq > 30) return 'bg-blue-900/30 border-white/5';
    return 'bg-white/5 border-white/5 opacity-40';
  };

  const getIntensityText = (freq: number) => {
    if (freq > 85) return 'text-black font-black';
    if (freq > 70) return 'text-amber-100 font-bold';
    return 'text-slate-400';
  };

  return (
    <div className="glass rounded-[2rem] p-6 border border-white/10 relative overflow-hidden group">
      <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-blue-600/0 via-blue-500/50 to-blue-600/0 opacity-30 group-hover:opacity-100 transition-opacity"></div>
      
      <div className="flex items-center justify-between mb-6">
        <div className="space-y-1">
          <h3 className="text-lg font-orbitron font-bold flex items-center gap-3">
            <Layers className="text-blue-500" size={18} />
            {t.common.heatmap}
          </h3>
          <p className="text-[9px] font-black uppercase text-slate-500 tracking-[0.2em]">Positional Frequency Matrix</p>
        </div>
        <div className="p-2 rounded-xl bg-blue-600/10 border border-blue-500/20">
          <Activity size={16} className="text-blue-400 animate-pulse" />
        </div>
      </div>

      <div className="grid grid-cols-11 gap-1.5">
        {/* Header Empty space */}
        <div className="h-6"></div>
        {/* Digits 0-9 */}
        {Array.from({ length: 10 }).map((_, i) => (
          <div key={i} className="h-6 flex items-center justify-center text-[10px] font-orbitron font-bold text-slate-500">
            {i}
          </div>
        ))}

        {/* Rows for Positions 1-4 */}
        {[1, 2, 3, 4].map((pos) => (
          <React.Fragment key={pos}>
            <div className="flex items-center justify-center text-[10px] font-black text-blue-500/60 uppercase pr-1">
              P{pos}
            </div>
            {data.filter(n => n.pos === pos).map((node) => (
              <div 
                key={`${pos}-${node.digit}`}
                onMouseEnter={() => setHoverNode(node)}
                onMouseLeave={() => setHoverNode(null)}
                className={`
                  aspect-square rounded-lg border flex items-center justify-center transition-all duration-300 cursor-crosshair
                  ${getIntensityColor(node.freq)}
                  hover:scale-125 hover:z-10 hover:rotate-6
                `}
              >
                <span className={`text-[9px] ${getIntensityText(node.freq)}`}>
                  {node.freq}
                </span>
                {node.freq > 90 && (
                  <div className="absolute -top-1 -right-1 w-2 h-2 bg-amber-400 rounded-full animate-ping"></div>
                )}
              </div>
            ))}
          </React.Fragment>
        ))}
      </div>

      <div className="mt-8 space-y-4">
        {/* Detail Panel */}
        <div className="h-16 bg-black/40 rounded-2xl border border-white/5 p-4 flex items-center justify-between transition-all">
          {hoverNode ? (
            <div className="flex items-center justify-between w-full animate-in fade-in slide-in-from-left-2">
              <div className="flex items-center gap-4">
                <div className="w-10 h-10 rounded-xl bg-blue-600/20 border border-blue-500/30 flex items-center justify-center">
                  <span className="text-xl font-orbitron font-black text-blue-400">{hoverNode.digit}</span>
                </div>
                <div>
                  <p className="text-[10px] font-black uppercase text-slate-500">Position {hoverNode.pos}</p>
                  <p className="text-xs font-bold text-white">Frequency: {hoverNode.freq}%</p>
                </div>
              </div>
              <div className="text-right">
                <p className="text-[10px] font-black uppercase text-slate-500">Stability</p>
                <p className="text-xs font-bold text-green-400">High Sync</p>
              </div>
            </div>
          ) : (
            <div className="flex items-center gap-3 text-slate-600 opacity-50">
              <Crosshair size={18} />
              <p className="text-[10px] font-black uppercase tracking-widest">Hover a node for positional delta</p>
            </div>
          )}
        </div>

        <div className="flex justify-between items-center text-[8px] font-black uppercase text-slate-500 tracking-widest px-1">
          <div className="flex gap-4">
            <span className="flex items-center gap-1.5">
              <div className="w-2 h-2 rounded bg-amber-500 shadow-[0_0_8px_amber]"></div> {t.common.hotNumbers}
            </span>
            <span className="flex items-center gap-1.5">
              <div className="w-2 h-2 rounded bg-blue-600/50"></div> {t.common.normalNumbers}
            </span>
            <span className="flex items-center gap-1.5">
              <div className="w-2 h-2 rounded bg-white/5 border border-white/10"></div> {t.common.coldNumbers}
            </span>
          </div>
          <button className="flex items-center gap-1 hover:text-blue-400 transition-colors">
            <Info size={10} /> Full Report
          </button>
        </div>
      </div>

      {/* Background decoration */}
      <div className="absolute -bottom-12 -left-12 w-32 h-32 bg-blue-600/5 blur-[60px] rounded-full pointer-events-none"></div>
    </div>
  );
};
