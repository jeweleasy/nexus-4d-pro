
import React, { useState, useMemo, useEffect } from 'react';
import { Layers, Activity, Info, Sparkles, Crosshair, RefreshCw, Zap, Filter, Calendar } from 'lucide-react';
import { LANGUAGES } from '../constants';
import { FrequencyNode } from '../App';

interface DigitHeatmapProps {
  lang: 'EN' | 'CN' | 'MY';
  data: FrequencyNode[];
  onSync: (newData: FrequencyNode[]) => void;
}

export const DigitHeatmap: React.FC<DigitHeatmapProps> = ({ lang, data, onSync }) => {
  const [hoverNode, setHoverNode] = useState<FrequencyNode | null>(null);
  const [isSyncing, setIsSyncing] = useState(false);
  const [filterProvider, setFilterProvider] = useState('All Sources');
  const [filterRange, setFilterRange] = useState('30 Days');
  
  const t = LANGUAGES[lang];

  const handleSync = () => {
    setIsSyncing(true);
    // Simulate complex recalibration
    setTimeout(() => {
      const newData = data.map(node => ({
        ...node,
        freq: Math.max(5, Math.min(99, node.freq + (Math.random() > 0.5 ? Math.floor(Math.random() * 5) : -Math.floor(Math.random() * 5))))
      }));
      onSync(newData);
      setIsSyncing(false);
    }, 2000);
  };

  const getIntensityColor = (freq: number) => {
    // Dynamic intensity mapping
    if (freq > 90) return 'bg-amber-500 shadow-[0_0_20px_rgba(245,158,11,0.6)] border-white/40 ring-2 ring-amber-400/50 scale-105';
    if (freq > 75) return 'bg-amber-500/80 border-amber-500/30 shadow-[0_0_10px_rgba(245,158,11,0.3)]';
    if (freq > 50) return 'bg-blue-600/70 border-blue-500/20';
    if (freq > 30) return 'bg-blue-900/50 border-white/5';
    return 'bg-white/5 border-white/5 opacity-30';
  };

  const getIntensityText = (freq: number) => {
    if (freq > 75) return 'text-black font-black';
    if (freq > 50) return 'text-white font-bold';
    return 'text-slate-500';
  };

  return (
    <div className="glass rounded-[2rem] p-6 border border-white/10 relative overflow-hidden group">
      <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-blue-600/0 via-blue-500/50 to-blue-600/0 opacity-30 group-hover:opacity-100 transition-opacity"></div>
      
      <div className="flex flex-col sm:flex-row sm:items-center justify-between mb-8 gap-4">
        <div className="space-y-1">
          <h3 className="text-lg font-orbitron font-bold flex items-center gap-3">
            <Layers className="text-blue-500" size={18} />
            {t.common.heatmap}
          </h3>
          <p className="text-[9px] font-black uppercase text-slate-500 tracking-[0.2em]">Positional Frequency Matrix</p>
        </div>
        
        <div className="flex items-center gap-2">
          <div className="flex gap-1 glass p-1 rounded-xl border border-white/5">
             <select 
               value={filterProvider} 
               onChange={(e) => setFilterProvider(e.target.value)}
               className="bg-transparent text-[8px] font-black uppercase outline-none text-slate-400 px-2 py-1"
             >
                <option>All Sources</option>
                <option>Magnum</option>
                <option>Toto</option>
                <option>Da Ma Cai</option>
             </select>
             <select 
               value={filterRange} 
               onChange={(e) => setFilterRange(e.target.value)}
               className="bg-transparent text-[8px] font-black uppercase outline-none text-slate-400 px-2 py-1"
             >
                <option>30 Days</option>
                <option>90 Days</option>
                <option>1 Year</option>
             </select>
          </div>
          <button 
            onClick={handleSync}
            disabled={isSyncing}
            className={`flex items-center gap-2 px-4 py-2 rounded-xl border transition-all text-[10px] font-black uppercase tracking-widest ${
              isSyncing 
                ? 'bg-blue-600 text-white animate-pulse' 
                : 'bg-white/5 border-white/10 text-blue-400 hover:bg-blue-600/10'
            }`}
          >
            {isSyncing ? <RefreshCw size={14} className="animate-spin" /> : <RefreshCw size={14} />}
            {isSyncing ? 'Calibrating...' : 'Sync Matrix'}
          </button>
        </div>
      </div>

      <div className="grid grid-cols-11 gap-1.5 relative">
        {isSyncing && (
          <div className="absolute inset-0 z-20 bg-black/40 backdrop-blur-[2px] flex items-center justify-center rounded-xl animate-in fade-in duration-300">
             <div className="flex flex-col items-center gap-4">
                <div className="w-12 h-12 border-4 border-blue-500 border-t-transparent rounded-full animate-spin"></div>
                <div className="text-[10px] font-black font-orbitron text-blue-400 tracking-[0.2em] animate-pulse">RECALIBRATING NEURAL WEIGHTS...</div>
             </div>
          </div>
        )}
        
        {/* Header Digits 0-9 */}
        <div className="h-6"></div>
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
                  aspect-square rounded-lg border flex items-center justify-center transition-all duration-300 cursor-crosshair relative group/node
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
                
                {/* Floating Tooltip */}
                <div className="absolute bottom-full left-1/2 -translate-x-1/2 mb-2 opacity-0 group-hover/node:opacity-100 transition-opacity pointer-events-none z-50">
                   <div className="glass p-2 rounded-lg border border-white/20 whitespace-nowrap shadow-2xl">
                      <p className="text-[8px] font-black uppercase text-blue-400">Freq: {node.freq}%</p>
                      <p className="text-[7px] font-bold text-slate-500">Last: {node.lastSeen}</p>
                   </div>
                </div>
              </div>
            ))}
          </React.Fragment>
        ))}
      </div>

      <div className="mt-8 space-y-4">
        {/* Detail Panel */}
        <div className="h-20 bg-black/40 rounded-2xl border border-white/5 p-4 flex items-center justify-between transition-all group-hover:border-white/10">
          {hoverNode ? (
            <div className="flex items-center justify-between w-full animate-in fade-in slide-in-from-left-2">
              <div className="flex items-center gap-4">
                <div className="w-12 h-12 rounded-2xl bg-blue-600/20 border border-blue-500/30 flex items-center justify-center">
                  <span className="text-2xl font-orbitron font-black text-blue-400">{hoverNode.digit}</span>
                </div>
                <div>
                  <p className="text-[10px] font-black uppercase text-slate-500">Position {hoverNode.pos}</p>
                  <p className="text-xs font-bold text-white">Frequency: {hoverNode.freq}%</p>
                </div>
              </div>
              <div className="text-right">
                <p className="text-[10px] font-black uppercase text-slate-500 flex items-center justify-end gap-1"><Activity size={10}/> Stability</p>
                <p className="text-xs font-bold text-green-400">Deep Sync Active</p>
                <p className="text-[8px] text-slate-600 font-bold mt-1">Sighted: {hoverNode.lastSeen}</p>
              </div>
            </div>
          ) : (
            <div className="flex items-center gap-3 text-slate-600 opacity-50">
              <Crosshair size={18} />
              <p className="text-[10px] font-black uppercase tracking-widest">Hover a matrix node for positional telemetry</p>
            </div>
          )}
        </div>

        <div className="flex justify-between items-center text-[8px] font-black uppercase text-slate-500 tracking-widest px-1">
          <div className="flex gap-4">
            <span className="flex items-center gap-1.5">
              <div className="w-2 h-2 rounded bg-amber-500 shadow-[0_0_8px_amber]"></div> {t.common.hotNumbers}
            </span>
            <span className="flex items-center gap-1.5">
              <div className="w-2 h-2 rounded bg-blue-600/70"></div> {t.common.normalNumbers}
            </span>
            <span className="flex items-center gap-1.5">
              <div className="w-2 h-2 rounded bg-white/5 border border-white/10 opacity-30"></div> {t.common.coldNumbers}
            </span>
          </div>
          <div className="flex items-center gap-3">
             <p className="text-slate-600 flex items-center gap-1"><Calendar size={10}/> Updated: {new Date().toLocaleTimeString()}</p>
          </div>
        </div>
      </div>

      <div className="absolute -bottom-12 -left-12 w-32 h-32 bg-blue-600/5 blur-[60px] rounded-full pointer-events-none"></div>
    </div>
  );
};
