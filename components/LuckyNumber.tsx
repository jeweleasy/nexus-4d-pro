
import React, { useState, useEffect, useMemo } from 'react';
import { Sparkles, Zap, RefreshCw, Cpu, Calendar, Star, Fingerprint, Search, Info, TrendingUp, History } from 'lucide-react';
import { predictionService } from '../services/geminiService';
import { ShadowButton } from './ShadowButton';
import { LANGUAGES } from '../constants';
import { FrequencyNode } from '../App';

interface LuckyNumberProps {
  lang: 'EN' | 'CN' | 'MY';
  heatmapData: FrequencyNode[];
}

export const LuckyNumber: React.FC<LuckyNumberProps> = ({ lang, heatmapData }) => {
  const [analyzing, setAnalyzing] = useState(false);
  const [luckyResult, setLuckyResult] = useState<{ number: string; fortune: string } | null>(null);
  const [ticker, setTicker] = useState("0000");
  const [birthdate, setBirthdate] = useState('');
  const [zodiac, setZodiac] = useState('');
  const [showConfig, setShowConfig] = useState(false);
  const [lookupValue, setLookupValue] = useState('');

  const t = LANGUAGES[lang];

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

  const lookupResults = useMemo(() => {
    if (lookupValue.length !== 4) return null;
    const digits = lookupValue.split('').map(Number);
    return digits.map((digit, i) => {
      return heatmapData.find(n => n.pos === (i + 1) && n.digit === digit);
    });
  }, [lookupValue, heatmapData]);

  const avgFreq = useMemo(() => {
    if (!lookupResults) return 0;
    const valid = lookupResults.filter((r): r is FrequencyNode => !!r);
    if (valid.length === 0) return 0;
    return Math.floor(valid.reduce((acc, curr) => acc + curr.freq, 0) / valid.length);
  }, [lookupResults]);

  return (
    <div className="glass rounded-2xl p-6 border border-white/10 bg-gradient-to-br from-blue-600/5 via-transparent to-purple-600/5 relative overflow-hidden group">
      <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-transparent via-amber-500 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
      
      <div className="flex justify-between items-center mb-6">
        <h3 className="text-lg font-orbitron font-bold text-white flex items-center gap-3">
          <div className="nexus-line nexus-line-amber"></div>
          {t.common.luckyNumber}
        </h3>
        <div className="flex items-center gap-1">
          <button onClick={() => setShowConfig(!showConfig)} className={`p-2 rounded-xl transition-all ${showConfig ? 'bg-amber-500/20 text-amber-400' : 'hover:bg-white/5 text-slate-500'}`}>
            <Fingerprint size={18} />
          </button>
        </div>
      </div>

      {showConfig && (
        <div className="space-y-6 mb-6 p-5 rounded-2xl bg-black/40 border border-white/5 animate-in slide-in-from-top-4">
          <div className="space-y-4">
             <p className="text-[9px] font-black uppercase tracking-widest text-blue-400 flex items-center gap-2"><Sparkles size={10}/> Resonance Tuning</p>
             <div className="flex flex-col gap-2">
                <label className="text-[10px] font-black uppercase text-slate-500 tracking-widest flex items-center gap-2">
                  <Calendar size={12}/> Birth Resonance
                </label>
                <input 
                  type="date" 
                  value={birthdate}
                  onChange={(e) => setBirthdate(e.target.value)}
                  className="bg-black/60 border border-white/10 rounded-xl p-3 text-xs focus:outline-none focus:border-amber-500/50 [color-scheme:dark] transition-all"
                />
             </div>
             <div className="flex flex-col gap-2">
                <label className="text-[10px] font-black uppercase text-slate-500 tracking-widest flex items-center gap-2">
                  <Star size={12}/> Zodiac Alignment
                </label>
                <select 
                  value={zodiac}
                  onChange={(e) => setZodiac(e.target.value)}
                  className="bg-black/60 border border-white/10 rounded-xl p-3 text-xs focus:outline-none focus:border-amber-500/50 transition-all appearance-none"
                >
                  <option value="">Auto-Detect Node</option>
                  {['Aries', 'Taurus', 'Gemini', 'Cancer', 'Leo', 'Virgo', 'Libra', 'Scorpio', 'Sagittarius', 'Capricorn', 'Aquarius', 'Pisces'].map(z => (
                    <option key={z} value={z}>{z}</option>
                  ))}
                </select>
             </div>
          </div>

          <div className="pt-4 border-t border-white/5 space-y-4">
             <p className="text-[9px] font-black uppercase tracking-widest text-amber-500 flex items-center gap-2"><Search size={10}/> Neural Lookup</p>
             <div className="relative">
                <input 
                  type="text" 
                  maxLength={4}
                  placeholder="Enter 4D Number..."
                  value={lookupValue}
                  onChange={(e) => setLookupValue(e.target.value.replace(/\D/g, ''))}
                  className="w-full bg-black/60 border border-white/10 rounded-xl p-3 pl-10 text-sm font-orbitron tracking-[0.4em] focus:outline-none focus:border-blue-500/50"
                />
                <Search size={16} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-600" />
             </div>
             
             {lookupResults && (
                <div className="space-y-3 animate-in fade-in duration-300">
                   <div className="flex justify-between items-center bg-blue-600/10 p-3 rounded-xl border border-blue-500/20">
                      <div>
                         <p className="text-[8px] font-black text-slate-500 uppercase">Avg Confidence</p>
                         <p className="text-sm font-orbitron font-bold text-white">{avgFreq}%</p>
                      </div>
                      <div className="text-right">
                         <p className="text-[8px] font-black text-slate-500 uppercase">Signal</p>
                         <p className={`text-xs font-bold ${avgFreq > 70 ? 'text-green-400' : 'text-amber-400'}`}>{avgFreq > 70 ? 'STRONG' : 'NORMAL'}</p>
                      </div>
                   </div>
                   <div className="grid grid-cols-4 gap-2">
                      {lookupResults.map((res, i) => (
                         <div key={i} className="bg-white/5 p-2 rounded-lg border border-white/5 text-center">
                            <p className="text-[7px] text-slate-600 font-black uppercase mb-1">P{i+1}</p>
                            <p className="text-[10px] font-bold text-blue-400">{res?.freq}%</p>
                         </div>
                      ))}
                   </div>
                </div>
             )}
          </div>
        </div>
      )}

      <div className="flex flex-col items-center py-4 space-y-6">
        <div className={`
          relative w-56 h-24 glass rounded-[2rem] flex items-center justify-center border-2 transition-all duration-700
          ${analyzing ? 'border-amber-500/50 shadow-[0_0_30px_rgba(245,158,11,0.3)] rotate-1' : 'border-white/5 hover:border-white/20'}
        `}>
          {analyzing ? (
            <span className="text-6xl font-orbitron font-bold text-amber-500 tracking-[0.2em]">{ticker}</span>
          ) : luckyResult ? (
            <div className="relative group/lucky">
               <span className="text-6xl font-orbitron font-bold text-white glow-gold tracking-[0.2em] animate-in zoom-in duration-500">
                {luckyResult.number}
              </span>
              <div className="absolute -top-8 -right-8 opacity-0 group-hover/lucky:opacity-100 transition-opacity">
                 <div className="glass p-2 rounded-lg text-[8px] font-black text-amber-400 border-amber-500/30">ELITE PICK</div>
              </div>
            </div>
          ) : (
            <div className="flex flex-col items-center text-slate-600 space-y-2">
              <Zap size={28} className="animate-pulse" />
              <span className="text-[9px] font-black uppercase tracking-[0.3em]">Neural Link Offline</span>
            </div>
          )}
          {/* Subtle scanning effect */}
          {analyzing && <div className="absolute inset-0 bg-gradient-to-t from-transparent via-white/5 to-transparent h-1 animate-[scan-line_1s_infinite_linear]"></div>}
        </div>

        {luckyResult && !analyzing && (
          <div className="text-center space-y-3 animate-in fade-in slide-in-from-top-2 duration-700 max-w-xs">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-amber-500/10 border border-amber-500/20">
               <Sparkles size={10} className="text-amber-500"/>
               <p className="text-[10px] text-amber-500 uppercase font-black tracking-widest">Cosmic Rationale</p>
            </div>
            <p className="text-xs text-slate-400 italic leading-relaxed px-4">"{luckyResult.fortune}"</p>
          </div>
        )}

        <ShadowButton 
          variant="gold" 
          onClick={handleGenerate} 
          disabled={analyzing}
          className="w-full py-4 text-xs font-black uppercase tracking-[0.2em] flex items-center justify-center gap-3 relative group"
        >
          {analyzing ? (
            <><RefreshCw size={16} className="animate-spin" /> SYNCHRONIZING PATHS...</>
          ) : (
            <>
               <Cpu size={18} className="group-hover:rotate-180 transition-transform duration-1000" /> 
               {luckyResult ? 'RECALIBRATE FREQUENCY' : 'ACTIVATE NEXUS LUCK'}
               <Zap size={14} className="opacity-50" />
            </>
          )}
        </ShadowButton>
      </div>

      <div className="mt-4 pt-4 border-t border-white/5 flex justify-between items-center text-[8px] font-black text-slate-600 uppercase tracking-widest">
         <span className="flex items-center gap-1"><History size={10}/> Last Seed: {Date.now().toString().slice(-4)}</span>
         <span className="flex items-center gap-1"><TrendingUp size={10}/> Drift: +0.02%</span>
      </div>
    </div>
  );
};
