
import React, { useState, useEffect } from 'react';
import { Sparkles, Zap, RefreshCw, Cpu } from 'lucide-react';
import { predictionService } from '../services/geminiService';
import { ShadowButton } from './ShadowButton';

export const LuckyNumber: React.FC = () => {
  const [analyzing, setAnalyzing] = useState(false);
  const [luckyResult, setLuckyResult] = useState<{ number: string; fortune: string } | null>(null);
  const [ticker, setTicker] = useState("0000");

  useEffect(() => {
    let interval: any;
    if (analyzing) {
      interval = setInterval(() => {
        setTicker(Math.floor(Math.random() * 9999).toString().padStart(4, '0'));
      }, 50);
    }
    return () => clearInterval(interval);
  }, [analyzing]);

  const handleGenerate = async () => {
    setAnalyzing(true);
    setLuckyResult(null);
    
    // Artificial delay for tension
    const [result] = await Promise.all([
      predictionService.generateLuckyNumber(),
      new Promise(resolve => setTimeout(resolve, 2000))
    ]);
    
    setLuckyResult(result);
    setAnalyzing(false);
  };

  return (
    <div className="glass rounded-2xl p-6 border border-white/10 bg-gradient-to-br from-blue-600/5 via-transparent to-purple-600/5 relative overflow-hidden group">
      <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-transparent via-amber-500 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
      
      <div className="flex justify-between items-center mb-6">
        <h3 className="text-lg font-orbitron font-bold text-white flex items-center gap-3">
          <div className="nexus-line nexus-line-amber"></div>
          Nexus Luck Engine
        </h3>
        <Sparkles size={18} className="text-amber-500 animate-pulse" />
      </div>

      <div className="flex flex-col items-center py-4 space-y-6">
        <div className={`
          relative w-48 h-20 glass rounded-2xl flex items-center justify-center border-2 transition-all duration-500
          ${analyzing ? 'border-amber-500/50 shadow-[0_0_20px_rgba(245,158,11,0.2)]' : 'border-white/5'}
        `}>
          {analyzing ? (
            <span className="text-5xl font-orbitron font-bold text-amber-500 tracking-[0.2em]">{ticker}</span>
          ) : luckyResult ? (
            <span className="text-5xl font-orbitron font-bold text-white glow-gold tracking-[0.2em] animate-in zoom-in duration-500">
              {luckyResult.number}
            </span>
          ) : (
            <div className="flex flex-col items-center text-slate-600">
              <Zap size={24} className="mb-1" />
              <span className="text-[10px] font-bold uppercase tracking-widest">Awaiting Pulse</span>
            </div>
          )}
          
          {analyzing && (
            <div className="absolute inset-0 bg-amber-500/5 flex items-center justify-center overflow-hidden">
                <div className="w-full h-0.5 bg-amber-500/50 absolute animate-[scan-line_1s_infinite_linear]"></div>
            </div>
          )}
        </div>

        {luckyResult && !analyzing && (
          <div className="text-center space-y-2 animate-in fade-in slide-in-from-top-2 duration-700">
            <p className="text-[10px] text-amber-500 uppercase font-bold tracking-widest">Cosmic Rationale</p>
            <p className="text-xs text-slate-400 italic leading-relaxed px-4">"{luckyResult.fortune}"</p>
          </div>
        )}

        <ShadowButton 
          variant="gold" 
          onClick={handleGenerate} 
          disabled={analyzing}
          className="w-full py-3 text-xs uppercase tracking-widest flex items-center justify-center gap-2"
        >
          {analyzing ? (
            <>
              <RefreshCw size={14} className="animate-spin" />
              Synchronizing...
            </>
          ) : (
            <>
              <Cpu size={14} />
              {luckyResult ? 'Recalibrate Luck' : 'Activate Nexus Luck'}
            </>
          )}
        </ShadowButton>
      </div>

      <div className="mt-4 pt-4 border-t border-white/5">
        <p className="text-[9px] text-slate-500 text-center leading-relaxed">
          * This is an AI-generated number based on digital entropy. Accuracy is not guaranteed. 18+ Only.
        </p>
      </div>
    </div>
  );
};
