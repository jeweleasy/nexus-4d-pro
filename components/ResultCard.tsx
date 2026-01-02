
import React, { useState, useEffect } from 'react';
import { Heart, Share2, Check, ExternalLink } from 'lucide-react';
import { LotteryResult, LotteryProvider } from '../types';
import { LANGUAGES } from '../constants';

interface ResultCardProps {
  result: LotteryResult;
  lang: 'EN' | 'CN' | 'MY';
  isFavorite?: boolean;
  onToggleFavorite?: (e: React.MouseEvent) => void;
  onShare?: (e: React.MouseEvent) => void;
}

export const ResultCard: React.FC<ResultCardProps> = ({ 
  result, 
  lang, 
  isFavorite = false, 
  onToggleFavorite,
  onShare
}) => {
  const t = LANGUAGES[lang];
  const isLive = result.status === 'Live';
  const [pop, setPop] = useState(false);
  const [justShared, setJustShared] = useState(false);

  useEffect(() => {
    if (isFavorite) {
      setPop(true);
      const timer = setTimeout(() => setPop(false), 300);
      return () => clearTimeout(timer);
    }
  }, [isFavorite]);

  const handleShareClick = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (onShare) {
      onShare(e);
      setJustShared(true);
      setTimeout(() => setJustShared(false), 2000);
    }
  };

  const getOperatorLink = (provider: LotteryProvider) => {
    switch (provider) {
      case LotteryProvider.MAGNUM: return 'https://www.magnum4d.my';
      case LotteryProvider.TOTO: return 'https://www.sportstoto.com.my';
      case LotteryProvider.DAMACAI: return 'https://www.damacai.com.my';
      default: return '#';
    }
  };

  const getProviderColor = (provider: LotteryProvider) => {
    switch (provider) {
      case LotteryProvider.MAGNUM: return 'text-amber-500';
      case LotteryProvider.TOTO: return 'text-red-500';
      case LotteryProvider.TOTO5D: return 'text-red-600';
      case LotteryProvider.TOTO6D: return 'text-red-700';
      case LotteryProvider.DAMACAI: return 'text-blue-500';
      case LotteryProvider.SINGAPORE: return 'text-blue-400';
      case LotteryProvider.GDLOTTO: return 'text-red-600';
      case LotteryProvider.PERDANA4D: return 'text-purple-500';
      case LotteryProvider.SABAH88: return 'text-orange-500';
      case LotteryProvider.MAGNUMLIFE: return 'text-amber-400';
      default: return 'text-blue-400';
    }
  };

  const renderPrizeValue = (val: string | undefined) => {
    if (!val) return null;
    return val.split(',').map((num, i) => (
      <span key={i} className="mx-1">{num.trim()}</span>
    ));
  };

  return (
    <div className={`
      glass rounded-[2rem] p-6 relative overflow-hidden 
      transition-all duration-500 ease-out 
      hover:scale-[1.02] 
      hover:shadow-[0_20px_40px_rgba(0,0,0,0.4)]
      border 
      ${isLive ? 'animate-pulse-border' : ''}
      ${isFavorite 
        ? 'border-red-500/30 bg-red-500/[0.02] shadow-[0_0_20px_rgba(239,68,68,0.1)]' 
        : 'border-slate-200 dark:border-white/5 hover:border-blue-500/30'
      }
      animate-in fade-in slide-in-from-bottom-4
    `}>
      {isFavorite && <div className="absolute -right-10 -top-10 w-32 h-32 bg-red-500/5 blur-[50px] rounded-full pointer-events-none"></div>}

      <div className="absolute top-4 right-6 flex items-center gap-2 z-10">
        <div className="flex items-center gap-2">
          {onShare && (
            <button 
              onClick={handleShareClick}
              className={`p-2 rounded-xl transition-all duration-300 border active:scale-90 flex items-center justify-center ${
                justShared 
                ? 'text-green-600 bg-green-500/10 border-green-500/30 shadow-[0_0_10px_rgba(34,197,94,0.2)]' 
                : 'text-slate-500 hover:text-slate-900 dark:hover:text-white bg-slate-100 dark:bg-white/5 border-slate-200 dark:border-white/10'
              }`}
            >
              {justShared ? <Check size={18} className="animate-in zoom-in" /> : <Share2 size={18} />}
            </button>
          )}
          {onToggleFavorite && (
            <button 
              onClick={onToggleFavorite}
              className={`
                flex items-center gap-2 p-2 px-3 rounded-xl transition-all duration-300
                ${isFavorite 
                  ? 'text-red-500 bg-red-500/10 border border-red-500/30 shadow-[0_0_10px_rgba(239,68,68,0.2)]' 
                  : 'text-slate-500 hover:text-slate-900 dark:hover:text-white bg-slate-100 dark:bg-white/5 border-slate-200 dark:border-white/10'
                }
                active:scale-90
              `}
            >
              <Heart size={18} fill={isFavorite ? 'currentColor' : 'none'} className={`${pop ? 'animate-heart-pop' : ''}`} />
              {isFavorite && <span className="text-[9px] font-black uppercase tracking-widest">Saved</span>}
            </button>
          )}
        </div>
      </div>
      
      <div className="flex justify-between items-start mb-6">
        <div>
          <div className="flex items-center gap-2">
            <h3 className={`text-xl font-orbitron font-bold tracking-tight ${getProviderColor(result.provider)}`}>
              {result.provider}
            </h3>
            <a href={getOperatorLink(result.provider)} target="_blank" rel="noopener noreferrer" className="text-slate-400 hover:text-blue-500 transition-colors">
              <ExternalLink size={12} />
            </a>
            <span className="text-[8px] font-black uppercase bg-slate-100 dark:bg-white/10 px-2 py-0.5 rounded text-slate-500 dark:text-slate-400">
              {result.type}
            </span>
          </div>
          <p className="text-slate-500 dark:text-slate-500 text-[10px] mt-1 uppercase font-black tracking-widest opacity-80">
            {result.drawDate} | Draw #{result.drawNumber}
          </p>
        </div>
        <div className="w-10 h-10 rounded-xl bg-slate-100 dark:bg-white/5 flex items-center justify-center font-orbitron font-black border border-slate-200 dark:border-white/10 text-slate-900 dark:text-white">
            {result.provider.substring(0, 1)}
        </div>
      </div>

      {result.type === '4D' && (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
          <div className="flex flex-col items-center p-4 rounded-2xl bg-gradient-to-br from-amber-500/10 to-transparent border border-amber-500/20 group-hover:border-amber-500/40 transition-all duration-500 shadow-sm">
            <span className="text-amber-600 dark:text-amber-500 text-[9px] font-black uppercase mb-1 tracking-widest opacity-70">{t.prizes.first}</span>
            <span className="text-4xl font-orbitron font-bold glow-gold tracking-widest text-slate-900 dark:text-white">{result.first}</span>
          </div>
          <div className="flex flex-col items-center p-4 rounded-2xl bg-gradient-to-br from-slate-300/10 to-transparent border border-slate-300/20 shadow-sm">
            <span className="text-slate-600 dark:text-slate-400 text-[9px] font-black uppercase mb-1 tracking-widest opacity-70">{t.prizes.second}</span>
            <span className="text-3xl font-orbitron font-bold text-slate-800 dark:text-slate-100 tracking-widest">{result.second}</span>
          </div>
          <div className="flex flex-col items-center p-4 rounded-2xl bg-gradient-to-br from-orange-500/10 to-transparent border border-orange-500/20 shadow-sm">
            <span className="text-orange-600 dark:text-orange-500 text-[9px] font-black uppercase mb-1 tracking-widest opacity-70">{t.prizes.third}</span>
            <span className="text-3xl font-orbitron font-bold text-slate-800 dark:text-slate-100 tracking-widest">{result.third}</span>
          </div>
        </div>
      )}

      {(result.type === '5D' || result.type === '6D') && (
        <div className="space-y-4 mb-8">
           <div className="flex flex-col items-center p-6 rounded-[2rem] bg-gradient-to-br from-amber-500/10 to-transparent border border-amber-500/20 shadow-sm">
            <span className="text-amber-600 dark:text-amber-500 text-[9px] font-black uppercase mb-2 tracking-widest opacity-70">{t.prizes.first}</span>
            <span className="text-5xl font-orbitron font-bold glow-gold tracking-[0.2em] text-slate-900 dark:text-white">{result.first}</span>
          </div>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
             <div className="flex flex-col items-center p-3 rounded-xl bg-slate-50 dark:bg-white/5 border border-slate-200 dark:border-white/5 shadow-sm">
                <span className="text-[8px] font-bold uppercase text-slate-500 mb-1">{t.prizes.second}</span>
                <span className="text-lg font-orbitron font-bold text-slate-800 dark:text-slate-200">{result.second}</span>
             </div>
             <div className="flex flex-col items-center p-3 rounded-xl bg-slate-50 dark:bg-white/5 border border-slate-200 dark:border-white/5 shadow-sm">
                <span className="text-[8px] font-bold uppercase text-slate-500 mb-1">{t.prizes.third}</span>
                <span className="text-lg font-orbitron font-bold text-slate-800 dark:text-slate-200">{result.third}</span>
             </div>
             <div className="flex flex-col items-center p-3 rounded-xl bg-slate-50 dark:bg-white/5 border border-slate-200 dark:border-white/5 shadow-sm">
                <span className="text-[8px] font-bold uppercase text-slate-500 mb-1">{t.prizes.fourth}</span>
                <span className="text-lg font-orbitron font-bold text-slate-800 dark:text-slate-200">{result.fourth}</span>
             </div>
             <div className="flex flex-col items-center p-3 rounded-xl bg-slate-50 dark:bg-white/5 border border-slate-200 dark:border-white/5 shadow-sm">
                <span className="text-[8px] font-bold uppercase text-slate-500 mb-1">{t.prizes.fifth}</span>
                <span className="text-lg font-orbitron font-bold text-slate-800 dark:text-slate-200">{result.fifth}</span>
             </div>
          </div>
        </div>
      )}

      {result.type === 'LIFE' && (
        <div className="mb-8">
           <div className="flex flex-col items-center p-6 rounded-[2rem] bg-gradient-to-br from-blue-500/10 to-transparent border border-blue-200 dark:border-blue-500/20 shadow-sm">
            <span className="text-blue-600 dark:text-blue-400 text-[9px] font-black uppercase mb-4 tracking-widest opacity-70">Winning Combination</span>
            <div className="flex flex-wrap justify-center gap-3">
              {result.first.split(',').map((num, i) => (
                <div key={i} className="w-12 h-12 rounded-full glass border border-blue-300 dark:border-blue-500/30 flex items-center justify-center font-orbitron font-bold text-blue-600 dark:text-blue-400 shadow-[0_0_10px_rgba(59,130,246,0.1)]">
                  {num.trim()}
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {result.specials && result.specials.length > 0 && (
        <div className="mb-6 space-y-3">
          <div className="flex items-center gap-3">
            <h4 className="text-slate-500 dark:text-slate-600 text-[9px] font-black uppercase tracking-[0.3em] whitespace-nowrap">{t.prizes.special}</h4>
            <div className="h-px w-full bg-slate-200 dark:bg-white/5"></div>
          </div>
          <div className="grid grid-cols-5 gap-y-3 gap-x-1 text-slate-700 dark:text-slate-400">
            {result.specials.map((num, idx) => (
              <span key={idx} className="text-xs font-orbitron font-bold text-center tracking-tighter hover:text-blue-500 dark:hover:text-blue-400 transition-colors cursor-default">{num}</span>
            ))}
          </div>
        </div>
      )}

      {result.consolations && result.consolations.length > 0 && (
        <div className="space-y-3">
          <div className="flex items-center gap-3">
            <h4 className="text-slate-500 dark:text-slate-600 text-[9px] font-black uppercase tracking-[0.3em] whitespace-nowrap">{t.prizes.consolation}</h4>
            <div className="h-px w-full bg-slate-200 dark:bg-white/5"></div>
          </div>
          <div className="grid grid-cols-5 gap-y-3 gap-x-1 text-slate-500 dark:text-slate-500">
            {result.consolations.map((num, idx) => (
              <span key={idx} className="text-xs font-orbitron font-medium text-center tracking-tighter hover:text-slate-900 dark:hover:text-white transition-colors cursor-default">{num}</span>
            ))}
          </div>
        </div>
      )}

      <div className="mt-4 pt-4 border-t border-slate-200 dark:border-white/5 flex justify-center">
        <span className="text-[8px] font-bold text-slate-500 dark:text-slate-600 uppercase tracking-widest flex items-center gap-1">
          <Check size={8} className="text-green-600 dark:text-green-500"/> Verified by Nexus Engine
        </span>
      </div>
    </div>
  );
};
