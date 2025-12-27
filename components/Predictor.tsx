
import React, { useState, useEffect } from 'react';
import { predictionService } from '../services/geminiService';
import { PredictionResult } from '../types';
import { ShadowButton } from './ShadowButton';

export const Predictor: React.FC = () => {
  const [loading, setLoading] = useState(false);
  const [predictions, setPredictions] = useState<PredictionResult[]>([]);

  const fetchPredictions = async () => {
    setLoading(true);
    const result = await predictionService.getPredictions("8492, 1102, 2518, 0904, 7721, 6543, 2190, 8872");
    setPredictions(result.predictions);
    setLoading(false);
  };

  useEffect(() => {
    fetchPredictions();
  }, []);

  return (
    <div className="glass rounded-2xl p-6 overflow-hidden">
      <div className="flex justify-between items-center mb-6">
        <h3 className="text-xl font-orbitron font-bold text-white flex items-center gap-2">
          <span className="text-purple-400">✧</span> ML Predictions
        </h3>
        <ShadowButton onClick={fetchPredictions} variant="secondary" className="text-xs py-1 px-4">
          Refresh AI
        </ShadowButton>
      </div>

      <p className="text-slate-400 text-xs mb-6 italic">
        * Predictions are generated using pattern analysis and machine learning. 
        Lottery is a game of chance. Play responsibly.
      </p>

      {loading ? (
        <div className="flex flex-col items-center justify-center py-12 space-y-4">
          <div className="w-10 h-10 border-4 border-purple-500 border-t-transparent rounded-full animate-spin"></div>
          <p className="text-slate-500 text-sm animate-pulse">Aggregating trends & calculating probabilities...</p>
        </div>
      ) : (
        <div className="space-y-4">
          {predictions.map((p, idx) => (
            <div key={idx} className="bg-white/5 rounded-xl p-4 border border-white/5 hover:border-purple-500/30 transition-colors">
              <div className="flex justify-between items-center mb-2">
                <span className="text-3xl font-orbitron font-bold text-purple-400 tracking-widest">{p.number}</span>
                <div className="text-right">
                  <span className="text-[10px] text-slate-500 uppercase block">Confidence</span>
                  <span className="text-sm font-bold text-green-400">{(p.probability * 100).toFixed(1)}%</span>
                </div>
              </div>
              <p className="text-xs text-slate-300 leading-relaxed">{p.reasoning}</p>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};
