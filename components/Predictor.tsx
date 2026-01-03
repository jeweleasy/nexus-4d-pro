
import React, { useState, useEffect } from 'react';
import { predictionService } from '../services/geminiService';
import { PredictionResult } from '../types';
import { ShadowButton } from './ShadowButton';
import { BrainCircuit, Activity, TrendingUp, Info, Crown, Lock } from 'lucide-react';

interface PredictorProps {
  isPremium?: boolean;
}

export const Predictor: React.FC<PredictorProps> = ({ isPremium = false }) => {
  const [loading, setLoading] = useState(false);
  const [predictions, setPredictions] = useState<PredictionResult[]>([]);
  const [insights, setInsights] = useState<any>(null);

  const fetchPredictions = async () => {
    setLoading(true);
    const historicalData = "8492, 1102, 2518, 0904, 7721, 6543, 2190, 8872";
    const [predRes, insightRes] = await Promise.all([
      predictionService.getPredictions(historicalData),
      predictionService.getDeepInsights(historicalData)
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
        <div className="absolute top-4 right-6 flex items-center gap-2 px-3 py-1 bg-amber-500/10 rounded-full border border-amber-500/20">
           <Crown size={12} className="text-amber-500" />
           <span className="text-[9px] font-black text-amber-500 uppercase tracking-widest">ELITE MODE</span>
        </div>
      )}

      <div className="flex justify-between items-center mb-6">
        <h3 className="text-xl font-orbitron font-bold flex items-center gap-3">
          <BrainCircuit className={isPremium ? "text-amber-400" : "text-purple-400"} size={20} />
          Neural Predictor
        </h3>
      </div>

      {insights && (
        <div className="grid grid-cols-2 gap-4 mb-6">
          <div className="p-3 rounded-xl bg-white/5 border border-white/5 flex flex-col gap-1">
            <span className="text-[8px] font-black uppercase text-slate-500 tracking-widest">AI Sentiment</span>
            <span className={`text-xs font-bold flex items-center gap-1 ${isPremium ? 'text-amber-400' : 'text-blue-400'}`}>
              <Activity size={12}/> {insights.sentiment}
            </span>
          </div>
          <div className="p-3 rounded-xl bg-white/5 border border-white/5 flex flex-col gap-1">
            <span className="text-[8px] font-black uppercase text-slate-500 tracking-widest">Convergence</span>
            <span className={`text-xs font-bold flex items-center gap-1 ${isPremium ? 'text-amber-400' : 'text-purple-400'}`}>
              <TrendingUp size={12}/> {insights.convergence}%
            </span>
          </div>
          <div className={`col-span-2 p-3 rounded-xl border text-[10px] leading-relaxed ${
            isPremium ? 'bg-amber-600/10 border-amber-500/20 text-amber-200' : 'bg-purple-600/10 border-purple-500/20 text-purple-200'
          }`}>
            <strong>Neural Recommendation:</strong> {isPremium ? insights.recommendation + " Elite confidence levels suggest positive divergence." : insights.recommendation}
          </div>
        </div>
      )}

      {loading ? (
        <div className="flex flex-col items-center justify-center py-12 space-y-4">
          <div className={`w-10 h-10 border-4 rounded-full animate-spin ${isPremium ? 'border-amber-500 border-t-transparent' : 'border-purple-500 border-t-transparent'}`}></div>
          <p className="text-slate-500 text-sm animate-pulse font-black uppercase tracking-widest">Aggregating entropy...</p>
        </div>
      ) : (
        <div className="space-y-4">
          {predictions.map((p, idx) => (
            <div key={idx} className={`rounded-2xl p-4 border transition-all hover:translate-x-1 flex items-center justify-between group ${
              isPremium ? 'bg-amber-500/5 border-amber-500/10 hover:border-amber-500/40' : 'bg-white/5 border-white/5 hover:border-purple-500/30'
            }`}>
              <div className="space-y-1">
                 <span className={`text-3xl font-orbitron font-bold tracking-[0.2em] ${isPremium ? 'text-amber-500' : 'text-purple-400'}`}>{p.number}</span>
                 <p className="text-[10px] text-slate-500 italic font-medium leading-tight group-hover:text-slate-300">"{p.reasoning}"</p>
              </div>
              <div className="text-right">
                <span className="text-[10px] text-slate-500 uppercase block font-bold">Confidence</span>
                <span className={`text-sm font-black ${p.probability > 0.7 ? 'text-green-500' : 'text-amber-500'}`}>
                    {(p.probability * 100).toFixed(1)}%
                </span>
              </div>
            </div>
          ))}

          {!isPremium && predictions.length > 0 && (
             <div className="bg-white/5 border border-dashed border-white/20 rounded-2xl p-6 text-center space-y-3 blur-[1px] hover:blur-0 transition-all cursor-pointer" onClick={() => {}}>
                <Lock size={20} className="text-slate-600 mx-auto" />
                <p className="text-[10px] text-slate-500 font-bold uppercase tracking-widest">Upgrade to Nexus Elite to unlock 8-digit high-precision patterns</p>
             </div>
          )}
        </div>
      )}

      <div className="mt-6 flex items-start gap-2 text-[9px] text-slate-600 border-t border-white/5 pt-4">
        <Info size={14} className="shrink-0" />
        <p>Predictions are based on algorithmic pattern discovery and universal digital resonance. No outcomes are guaranteed. Nexus Pro supports Responsible Gaming.</p>
      </div>

      <ShadowButton 
        onClick={fetchPredictions} 
        variant={isPremium ? "gold" : "secondary"} 
        className="w-full mt-4 py-3 text-[10px] uppercase font-black tracking-widest"
      >
        RECALIBRATE ENGINE
      </ShadowButton>
    </div>
  );
};
