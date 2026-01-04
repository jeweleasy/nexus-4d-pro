
import React, { useState, useEffect, useMemo } from 'react';
import { predictionService } from '../services/geminiService';
import { PredictionResult } from '../types';
import { ShadowButton } from './ShadowButton';
import { BrainCircuit, Activity, TrendingUp, Info, Crown, Lock, Layers, Sparkles, RefreshCw } from 'lucide-react';
import { LANGUAGES } from '../constants';
import { FrequencyNode } from '../App';

interface PredictorProps {
  isPremium?: boolean;
  lang: 'EN' | 'CN' | 'MY';
  heatmapData: FrequencyNode[];
}

export const Predictor: React.FC<PredictorProps> = ({ isPremium = false, lang, heatmapData }) => {
  const [loading, setLoading] = useState(false);
  const [predictions, setPredictions] = useState<PredictionResult[]>([]);
  const [insights, setInsights] = useState<any>(null);

  const t = LANGUAGES[lang];

  const heatmapInsight = useMemo(() => {
    const topPerPos = [1, 2, 3, 4].map(p => {
      const nodes = heatmapData.filter(n => n.pos === p);
      return nodes.sort((a, b) => b.freq - a.freq)[0];
    });
    
    // Find absolute highest frequency node across all positions
    const outlier = [...heatmapData].sort((a, b) => b.freq - a.freq)[0];
    
    const avgSync = topPerPos.reduce((acc, curr) => acc + curr.freq, 0) / 4;
    return {
      topSequence: topPerPos.map(n => n.digit).join(''),
      outlierNode: `P${outlier.pos}-D${outlier.digit}`,
      outlierFreq: outlier.freq,
      avgSync: Math.floor(avgSync)
    };
  }, [heatmapData]);

  const fetchPredictions = async () => {
    setLoading(true);
    const historicalData = "8492, 1102, 2518, 0904, 7721, 6543, 2190, 8872";
    const [predRes, insightRes] = await Promise.all([
      predictionService.getPredictions(historicalData),
      predictionService.getDeepInsights(historicalData),
      new Promise(resolve => setTimeout(resolve, 1500))
    ]);
    setPredictions(predRes.predictions);
    setInsights(insightRes);
    setLoading(false);
  };

  useEffect(() => {
    fetchPredictions();
  }, []);

  return (
    <div className={`glass rounded-3xl p-6 overflow-hidden border relative transition-all duration-500 ${
      isPremium ? 'border-amber-500/30 bg-gradient-to-br from-amber-600/5 to-transparent' : 'border-white/5'
    }`}>
      {isPremium && (
        <div className="absolute top-4 right-6 flex items-center gap-2 px-3 py-1 bg-amber-500/10 rounded-full border border-amber-500/20 z-10">
           <Crown size={12} className="text-amber-500" />
           <span className="text-[9px] font-black text-amber-500 uppercase tracking-widest">ELITE MODE</span>
        </div>
      )}

      <div className="flex justify-between items-center mb-6">
        <h3 className="text-xl font-orbitron font-bold flex items-center gap-3">
          <BrainCircuit className={isPremium ? "text-amber-400" : "text-purple-400"} size={20} />
          {t.common.predictor}
        </h3>
      </div>

      <div className="grid grid-cols-2 gap-4 mb-6">
        {insights ? (
          <>
            <div className="p-3 rounded-xl bg-white/5 border border-white/5 flex flex-col gap-1 hover:bg-white/10 transition-colors cursor-default">
              <span className="text-[8px] font-black uppercase text-slate-500 tracking-widest">AI Sentiment</span>
              <span className={`text-xs font-bold flex items-center gap-1 ${isPremium ? 'text-amber-400' : 'text-blue-400'}`}>
                <Activity size={12}/> {insights.sentiment}
              </span>
            </div>
            <div className="p-3 rounded-xl bg-white/5 border border-white/5 flex flex-col gap-1 hover:bg-white/10 transition-colors cursor-default">
              <span className="text-[8px] font-black uppercase text-slate-500 tracking-widest">Convergence</span>
              <span className={`text-xs font-bold flex items-center gap-1 ${isPremium ? 'text-amber-400' : 'text-purple-400'}`}>
                <TrendingUp size={12}/> {insights.convergence}%
              </span>
            </div>
          </>
        ) : (
          <>
            <div className="h-14 bg-white/5 rounded-xl animate-pulse"></div>
            <div className="h-14 bg-white/5 rounded-xl animate-pulse"></div>
          </>
        )}
        
        <div className={`col-span-2 p-4 rounded-2xl border text-[10px] leading-relaxed relative overflow-hidden group ${
          isPremium ? 'bg-amber-600/10 border-amber-500/20 text-amber-200' : 'bg-purple-600/10 border-purple-500/20 text-purple-200'
        }`}>
           <Layers className="absolute -right-2 -bottom-2 text-white/5 group-hover:text-white/10 transition-colors" size={64} />
           <div className="relative z-10 space-y-2">
              <p className="flex items-center gap-2 font-black uppercase tracking-widest text-[9px] border-b border-white/5 pb-1 mb-2">
                 <div className="w-1.5 h-1.5 rounded-full bg-blue-500"></div>
                 Neural Intelligence Digest
              </p>
              <p>
                <strong>Engine Focus:</strong> Clustering detected at <strong>{heatmapInsight.outlierNode}</strong> with {heatmapInsight.outlierFreq}% density. This drift aligns with {insights?.recommendation || 'stable patterns'}.
              </p>
              <p className="opacity-80">
                Heatmap synchronization at <strong>{heatmapInsight.avgSync}%</strong> suggest highest resonance for sequence <strong>{heatmapInsight.topSequence}</strong> in current market cycles.
              </p>
           </div>
        </div>
      </div>

      {loading ? (
        <div className="flex flex-col items-center justify-center py-12 space-y-4">
          <div className="relative">
             <div className={`w-14 h-14 border-4 rounded-full animate-spin ${isPremium ? 'border-amber-500 border-t-transparent' : 'border-purple-500 border-t-transparent'}`}></div>
             <Sparkles size={16} className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 text-white/50 animate-pulse" />
          </div>
          <p className="text-slate-500 text-xs animate-pulse font-black uppercase tracking-[0.3em]">Aggregating Digital Entropy...</p>
        </div>
      ) : (
        <div className="space-y-4">
          {predictions.map((p, idx) => (
            <div key={idx} className={`rounded-2xl p-4 border transition-all hover:translate-x-2 flex items-center justify-between group ${
              isPremium ? 'bg-amber-500/5 border-amber-500/10 hover:border-amber-500/40' : 'bg-white/5 border-white/5 hover:border-purple-500/30'
            }`}>
              <div className="space-y-1">
                 <div className="flex items-center gap-2">
                    <span className={`text-3xl font-orbitron font-bold tracking-[0.2em] ${isPremium ? 'text-amber-500' : 'text-purple-400'}`}>{p.number}</span>
                    {idx === 0 && <span className="px-1.5 py-0.5 rounded bg-green-500/20 text-green-500 text-[7px] font-black uppercase">Alpha</span>}
                 </div>
                 <p className="text-[10px] text-slate-500 italic font-medium leading-tight group-hover:text-slate-300 transition-colors">"{p.reasoning}"</p>
              </div>
              <div className="text-right">
                <span className="text-[10px] text-slate-500 uppercase block font-bold tracking-tighter">Confidence</span>
                <span className={`text-lg font-orbitron font-black ${p.probability > 0.8 ? 'text-green-500' : 'text-amber-500'}`}>
                    {(p.probability * 100).toFixed(1)}%
                </span>
              </div>
            </div>
          ))}

          {!isPremium && predictions.length > 0 && (
             <button onClick={() => {}} className="w-full bg-white/5 border border-dashed border-white/20 rounded-2xl p-6 text-center space-y-3 group hover:border-amber-500/50 hover:bg-amber-500/5 transition-all">
                <Lock size={20} className="text-slate-600 mx-auto group-hover:text-amber-500 transition-colors" />
                <p className="text-[10px] text-slate-500 font-black uppercase tracking-widest group-hover:text-slate-300">Upgrade for Elite Precision Patterns</p>
             </button>
          )}
        </div>
      )}

      <div className="mt-8 flex items-start gap-3 text-[9px] text-slate-600 border-t border-white/5 pt-5">
        <Info size={16} className="shrink-0 text-slate-700" />
        <p className="leading-relaxed">Predictions are probabilistic models based on pattern recognition. Lottery outcomes remain random. 4D Nexus Pro advocates for Responsible Gaming.</p>
      </div>

      <ShadowButton 
        onClick={fetchPredictions} 
        variant={isPremium ? "gold" : "secondary"} 
        disabled={loading}
        className="w-full mt-6 py-4 text-[10px] uppercase font-black tracking-[0.3em] flex items-center justify-center gap-2"
      >
        {loading ? <RefreshCw size={14} className="animate-spin" /> : <RefreshCw size={14} />}
        {t.common.recalibrate}
      </ShadowButton>
    </div>
  );
};
