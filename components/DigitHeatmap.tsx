
import React, { useState, useMemo } from 'react';
import { Layers, Activity, Info, Sparkles, Crosshair, RefreshCw, Zap, Filter, Calendar, List, Grid3X3, Loader2, Clock } from 'lucide-react';
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
  const [activeTab, setActiveTab] = useState<'matrix' | 'ledger'>('matrix');
  const [posFilter, setPosFilter] = useState<'All' | 1 | 2 | 3 | 4>('All');
  
  const t = LANGUAGES[lang];

  const handleSync = () => {
    setIsSyncing(true);
    setTimeout(() => {
      const newData = data.map(node => ({
        ...node,
        freq: Math.max(5, Math.min(99, node.freq + (Math.random() > 0.5 ? Math.floor(Math.random() * 5) : -Math.floor(Math.random() * 5))))
      }));
      onSync(newData);
      setIsSyncing(false);
    }, 1500);
  };

  const getIntensityColor = (freq: number) => {
    if (freq > 90) return 'bg-amber-500 shadow-[0_0_20px_rgba(245,158,11,0.6)] border-white/40 ring-2 ring-amber-400/50 scale-105';
    if (freq > 75) return 'bg-amber-500/80 border-amber-500/30';
    if (freq > 50) return 'bg-blue-600/70 border-blue-500/20';
    if (freq > 30) return 'bg-blue-900/50 border-white/5';
    return 'bg-white/5 border-white/5 opacity-30';
  };

  const filteredData = useMemo(() => {
    if (posFilter === 'All') return data;
    return data.filter(n => n.pos === posFilter);
  }, [data, posFilter]);

  return (
    <div className="glass rounded-[2rem] p-6 border border-white/10 relative overflow-hidden group">
      <div className="flex flex-col gap-6 mb-8">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div className="space-y-1">
            <h3 className="text-lg font-orbitron font-bold flex items-center gap-3">
              <Layers className="text-blue-500" size={18} />
              {t.common.heatmap}
            </h3>
            <p className="text-[9px] font-black uppercase text-slate-500 tracking-[0.2em]">Positional Frequency Matrix</p>
          </div>
          
          <div className="flex items-center gap-2">
            <div className="flex glass p-1 rounded-xl border border-white/5">
              <button 
                onClick={() => setActiveTab('matrix')}
                className={`p-2 rounded-lg transition-all ${activeTab === 'matrix' ? 'bg-blue-600 text-white shadow-lg' : 'text-slate-500 hover:text-slate-300'}`}
              >
                <Grid3X3 size={14} />
              </button>
              <button 
                onClick={() => setActiveTab('ledger')}
                className={`p-2 rounded-lg transition-all ${activeTab === 'ledger' ? 'bg-blue-600 text-white shadow-lg' : 'text-slate-500 hover:text-slate-300'}`}
              >
                <List size={14} />
              </button>
            </div>
          </div>
        </div>

        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-y border-white/5 py-4">
           <div className="flex flex-wrap gap-2">
              {(['All', 1, 2, 3, 4] as const).map((p) => (
                <button
                  key={p}
                  onClick={() => setPosFilter(p)}
                  className={`px-3 py-1 rounded-lg text-[9px] font-black uppercase tracking-tighter transition-all border ${
                    posFilter === p 
                      ? 'bg-blue-500/20 border-blue-500 text-blue-400' 
                      : 'bg-white/5 border-white/5 text-slate-500 hover:border-white/20'
                  }`}
                >
                  {p === 'All' ? 'Global Cycle' : `Position ${p}`}
                </button>
              ))}
           </div>
           
           <button 
              onClick={handleSync}
              disabled={isSyncing}
              className={`flex items-center gap-2 px-6 py-2 rounded-2xl border transition-all text-[10px] font-black uppercase tracking-widest ${
                isSyncing ? 'bg-blue-600 text-white animate-pulse border-blue-400' : 'bg-white/5 border-white/10 text-blue-400 hover:bg-blue-600/10'
              }`}
            >
              <RefreshCw size={14} className={isSyncing ? 'animate-spin' : ''} />
              {isSyncing ? 'Recalibrating...' : 'Force Sync Engine'}
            </button>
        </div>
      </div>

      {activeTab === 'matrix' ? (
        <div className="grid grid-cols-11 gap-1.5 relative py-4">
          {isSyncing && (
            <div className="absolute inset-0 z-20 bg-black/40 backdrop-blur-[2px] flex items-center justify-center rounded-xl">
               <Loader2 className="text-blue-500 animate-spin" size={32} />
            </div>
          )}
          
          <div className="h-6"></div>
          {Array.from({ length: 10 }).map((_, i) => (
            <div key={i} className="h-6 flex items-center justify-center text-[10px] font-orbitron font-bold text-slate-500">{i}</div>
          ))}

          {([1, 2, 3, 4] as const).filter(p => posFilter === 'All' || posFilter === p).map((pos) => (
            <React.Fragment key={pos}>
              <div className="flex items-center justify-center text-[10px] font-black text-blue-500/60 uppercase pr-1">P{pos}</div>
              {data.filter(n => n.pos === pos).map((node) => (
                <div 
                  key={`${pos}-${node.digit}`}
                  className={`aspect-square rounded-lg border flex items-center justify-center transition-all duration-300 cursor-crosshair relative group/node ${getIntensityColor(node.freq)} hover:scale-125 hover:z-10`}
                >
                  <span className={`text-[9px] ${node.freq > 75 ? 'text-black font-black' : 'text-white'}`}>{node.freq}</span>
                  
                  <div className="absolute bottom-full left-1/2 -translate-x-1/2 mb-3 opacity-0 group-hover/node:opacity-100 transition-all pointer-events-none z-50 translate-y-2 group-hover/node:translate-y-0">
                     <div className="glass p-3 rounded-xl border border-blue-500/30 whitespace-nowrap shadow-3xl bg-[#0a0a0a]/95 backdrop-blur-xl">
                        <div className="flex items-center gap-3 mb-2 border-b border-white/10 pb-2">
                           <div className="w-8 h-8 rounded-lg bg-blue-600/20 flex items-center justify-center text-blue-400 font-orbitron font-bold border border-blue-500/30">
                              {node.digit}
                           </div>
                           <div>
                             <p className="text-[9px] font-black uppercase text-blue-400 tracking-wider">Node Position {node.pos}</p>
                             <p className="text-[7px] text-slate-500 font-bold uppercase tracking-widest">Spectral Analysis Active</p>
                           </div>
                        </div>
                        <div className="space-y-2">
                           <div className="flex justify-between items-center gap-8">
                             <span className="text-[9px] font-bold text-slate-400 uppercase">Frequency Intensity</span>
                             <span className="text-xs font-black text-white">{node.freq}%</span>
                           </div>
                           <div className="flex justify-between items-center gap-8">
                             <span className="text-[9px] font-bold text-slate-400 uppercase">Last Neural Trace</span>
                             <span className="text-[9px] font-bold text-amber-500 uppercase">{node.lastSeen}</span>
                           </div>
                        </div>
                     </div>
                     <div className="w-2 h-2 bg-[#0a0a0a] border-r border-b border-blue-500/30 rotate-45 mx-auto -mt-1 relative z-10"></div>
                  </div>
                </div>
              ))}
            </React.Fragment>
          ))}
        </div>
      ) : (
        <div className="max-h-[400px] overflow-y-auto custom-scrollbar border border-white/5 rounded-xl">
           <table className="w-full text-left border-collapse">
              <thead>
                 <tr className="text-[9px] font-black uppercase text-slate-500 bg-white/5 sticky top-0 z-10">
                    <th className="p-4 border-b border-white/10">Neural Node</th>
                    <th className="p-4 border-b border-white/10">Digit Signature</th>
                    <th className="p-4 border-b border-white/10">Convergence</th>
                    <th className="p-4 border-b border-white/10">Temporal Trace</th>
                 </tr>
              </thead>
              <tbody className="text-[10px]">
                 {filteredData.map((node, i) => (
                    <tr key={i} className="hover:bg-blue-600/5 border-b border-white/5 group transition-colors">
                       <td className="p-4 font-bold text-blue-400">Position {node.pos}</td>
                       <td className="p-4">
                          <span className="w-8 h-8 rounded-lg bg-white/5 border border-white/10 flex items-center justify-center font-orbitron font-bold text-white group-hover:border-blue-500/30">
                            {node.digit}
                          </span>
                       </td>
                       <td className="p-4">
                          <div className="flex items-center gap-3">
                             <div className="w-16 h-1.5 bg-white/5 rounded-full overflow-hidden border border-white/5">
                                <div className="h-full bg-blue-600 shadow-[0_0_8px_rgba(59,130,246,0.5)]" style={{ width: `${node.freq}%` }}></div>
                             </div>
                             <span className="font-orbitron font-bold">{node.freq}%</span>
                          </div>
                       </td>
                       <td className="p-4">
                          <div className="flex items-center gap-2 text-slate-400 group-hover:text-amber-400 transition-colors">
                            <Clock size={10} />
                            <span className="italic font-medium">{node.lastSeen}</span>
                          </div>
                       </td>
                    </tr>
                 ))}
              </tbody>
           </table>
        </div>
      )}

      <div className="mt-8 pt-4 border-t border-white/5 flex justify-between items-center text-[8px] font-black text-slate-600 uppercase tracking-widest">
         <div className="flex gap-4">
            <span className="flex items-center gap-1.5"><div className="w-2 h-2 rounded bg-amber-500 shadow-[0_0_8px_rgba(245,158,11,0.5)]"></div> Hot Cluster</span>
            <span className="flex items-center gap-1.5"><div className="w-2 h-2 rounded bg-blue-600/60"></div> Stable Flow</span>
            <span className="flex items-center gap-1.5"><div className="w-2 h-2 rounded bg-white/5 border border-white/10"></div> Low Trace</span>
         </div>
         <span className="flex items-center gap-1"><Info size={10} className="text-slate-500" /> pos_drift_index: 0.034_res</span>
      </div>
    </div>
  );
};
