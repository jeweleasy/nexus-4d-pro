
import React, { useState, useEffect } from 'react';
import { Sparkles, Zap, RefreshCw, Cpu, Calendar, Star, Fingerprint } from 'lucide-react';
import { predictionService } from '../services/geminiService';
import { ShadowButton } from './ShadowButton';

export const LuckyNumber: React.FC = () => {
  const [analyzing, setAnalyzing] = useState(false);
  const [luckyResult, setLuckyResult] = useState<{ number: string; fortune: string } | null>(null);
  const [ticker, setTicker] = useState("0000");
  const [birthdate, setBirthdate] = useState('');
  const [zodiac, setZodiac] = useState('');
  const [showConfig, setShowConfig] = useState(false);

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
    
    const [result] = await Promise.all([
      predictionService.generatePersonalizedLucky({ birthdate, zodiac }),
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
        <button onClick={() => setShowConfig(!showConfig)} className="p-2 hover:bg-white/5 rounded-xl text-amber-500 transition-all">
          <Fingerprint size={18} />
        </button>
      </div>

      {showConfig && (
        <div className="space-y-4 mb-6 p-4 rounded-2xl bg-white/5 border border-white/5 animate-in slide-in-from-top-4">
          <div className="flex flex-col gap-2">
            <label className="text-[10px] font-black uppercase text-slate-500 tracking-widest flex items-center gap-2">
              <Calendar size={12}/> Birth Resonance
            </label>
            <input 
              type="date" 
              value={birthdate}
              onChange={(e) => setBirthdate(e.target.value)}
              className="bg-black/40 border border-white/10 rounded-xl p-2 text-xs focus:outline-none focus:border-amber-500/50 [color-scheme:dark]"
            />
          </div>
          <div className="flex flex-col gap-2">
            <label className="text-[10px] font-black uppercase text-slate-500 tracking-widest flex items-center gap-2">
              <Star size={12}/> Zodiac Alignment
            </label>
            <select 
              value={zodiac}
              onChange={(e) => setZodiac(e.target.value)}
              className="bg-black/40 border border-white/10 rounded-xl p-2 text-xs focus:outline-none focus:border-amber-500/50"
            >
              <option value="">Auto-Detect</option>
              {['Aries', 'Taurus', 'Gemini', 'Cancer', 'Leo', 'Virgo', 'Libra', 'Scorpio', 'Sagittarius', 'Capricorn', 'Aquarius', 'Pisces'].map(z => (
                <option key={z} value={z}>{z}</option>
              ))}
            </select>
          </div>
        </div>
      )}

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
            <><RefreshCw size={14} className="animate-spin" /> Synchronizing...</>
          ) : (
            <><Cpu size={14} /> {luckyResult ? 'Recalibrate Luck' : 'Activate Nexus Luck'}</>
          )}
        </ShadowButton>
      </div>
    </div>
  );
};
