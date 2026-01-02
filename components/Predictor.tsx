
import React, { useState, useEffect } from 'react';
import { predictionService } from '../services/geminiService';
import { PredictionResult } from '../types';
import { ShadowButton } from './ShadowButton';
import { BrainCircuit, Activity, TrendingUp, Info } from 'lucide-react';

export const Predictor: React.FC = () => {
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
    <div className="glass rounded-2xl p-6 overflow-hidden border border-white/5 bg-gradient-to-br from-purple-600/5 to-transparent">
      <div className="flex justify-between items-center mb-6">
        <h3 className="text-xl font-orbitron font-bold text-white flex items-center gap-3">
          <BrainCircuit className="text-purple-400" size={20} />
          Neural Predictor
        </h3>
        <ShadowButton onClick={fetchPredictions} variant="secondary" className="text-xs py-1 px-4">
          Recalibrate
        </ShadowButton>
      </div>

      {insights && (
        <div className="grid grid-cols-2 gap-4 mb-6">
          <div className="p-3 rounded-xl bg-white/5 border border-white/5 flex flex-col gap-1">
            <span className="text-[8px] font-black uppercase text-slate-500 tracking-widest">AI Sentiment</span>
            <span className="text-xs font-bold text-blue-400 flex items-center gap-1">
              <Activity size={12}/> {insights.sentiment}
            </span>
          </div>
          <div className="p-3 rounded-xl bg-white/5 border border-white/5 flex flex-col gap-1">
            <span className="text-[8px] font-black uppercase text-slate-500 tracking-widest">Convergence</span>
            <span className="text-xs font-bold text-purple-400 flex items-center gap-1">
              <TrendingUp size={12}/> {insights.convergence}%
            </span>
          </div>
          <div className="col-span-2 p-3 rounded-xl bg-purple-600/10 border border-purple-500/20 text-[10px] text-purple-200">
            <strong>Neural Recommendation:</strong> {insights.recommendation}
          </div>
        </div>
      )}

      {loading ? (
        <div className="flex flex-col items-center justify-center py-12 space-y-4">
          <div className="w-10 h-10 border-4 border-purple-500 border-t-transparent rounded-full animate-spin"></div>
          <p className="text-slate-500 text-sm animate-pulse font-black uppercase tracking-widest">Aggregating entropy...</p>
        </div>
      ) : (
        <div className="space-y-4">
          {predictions.map((p, idx) => (
            <div key={idx} className="bg-white/5 rounded-xl p-4 border border-white/5 hover:border-purple-500/30 transition-all hover:translate-x-1">
              <div className="flex justify-between items-center mb-2">
                <span className="text-3xl font-orbitron font-bold text-purple-400 tracking-widest">{p.number}</span>
                <div className="text-right">
                  <span className="text-[10px] text-slate-500 uppercase block">Confidence</span>
                  <span className="text-sm font-bold text-green-400">{(p.probability * 100).toFixed(1)}%</span>
                </div>
              </div>
              <p className="text-xs text-slate-400 leading-relaxed font-medium italic">"{p.reasoning}"</p>
            </div>
          ))}
        </div>
      )}

      <div className="mt-6 flex items-start gap-2 text-[9px] text-slate-600 border-t border-white/5 pt-4">
        <Info size={14} className="shrink-0" />
        <p>Predictions are based on algorithmic pattern discovery and universal digital resonance. No outcomes are guaranteed. Nexus Pro supports Responsible Gaming.</p>
      </div>
    </div>
  );
};
