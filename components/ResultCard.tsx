
import React, { useState, useEffect } from 'react';
import { Heart, Share2, Check, ExternalLink, Sparkles } from 'lucide-react';
import { LotteryResult, LotteryProvider } from '../types';
import { LANGUAGES } from '../constants';

interface ResultCardProps {
  result: LotteryResult;
  lang: 'EN' | 'CN' | 'MY';
  isLoggedIn?: boolean;
  onGuestAttempt?: () => void;
  isFavorite?: boolean;
  onToggleFavorite?: (e: React.MouseEvent) => void;
  onShare?: (e: React.MouseEvent) => void;
  highlightQuery?: string;
}

export const ResultCard: React.FC<ResultCardProps> = ({ 
  result, 
  lang, 
  isLoggedIn = false,
  onGuestAttempt,
  isFavorite = false, 
  onToggleFavorite,
  onShare,
  highlightQuery = ""
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
    if (!isLoggedIn && onGuestAttempt) {
      onGuestAttempt();
      return;
    }
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

  const isHighlighted = (val?: string) => {
    if (!highlightQuery || !val) return false;
    // Match exact or partial depending on length
    return val.includes(highlightQuery);
  };

  // Added key to props type to fix mapping errors
  const HighlightWrapper = ({ val, children, className = "" }: { val?: string, children?: React.ReactNode, className?: string, key?: React.Key }) => {
    const active = isHighlighted(val);
    return (
      <div className={`relative transition-all duration-500 ${active ? 'scale-110 z-10' : ''} ${className}`}>
        {active && (
          <div className="absolute inset-0 bg-blue-500/20 blur-xl rounded-full animate-pulse pointer-events-none"></div>
        )}
        {children}
        {active && (
          <div className="absolute -top-2 -right-2 p-0.5 bg-blue-600 rounded-full shadow-[0_0_10px_rgba(59,130,246,0.6)]">
            <Sparkles size={8} className="text-white" />
          </div>
        )}
      </div>
    );
  };

  return (
    <div className={`
      glass rounded-[2rem] p-6 relative overflow-hidden 
      transition-all duration-500 ease-out 
      hover:scale-[1.01] 
      hover:shadow-[0_20px_40px_rgba(0,0,0,0.3)]
      border 
      ${isLive ? 'animate-pulse-border' : ''}
      ${isFavorite 
        ? 'border-red-500/30 bg-red-500/[0.02] shadow-[0_0_20px_rgba(239,68,68,0.1)]' 
        : 'border-slate-200 dark:border-white/5 hover:border-blue-500/30'
      }
      animate-in fade-in slide-in-from-bottom-4
    `}>
      <div className="absolute top-4 right-6 flex items-center gap-2 z-10">
        {onShare && (
          <button 
            onClick={handleShareClick}
            className={`p-2 rounded-xl transition-all duration-300 border active:scale-90 flex items-center justify-center ${
              justShared 
              ? 'text-green-600 bg-green-500/10 border-green-500/30 shadow-[0_0_10px_rgba(34,197,94,0.2)]' 
              : 'text-slate-500 hover:text-slate-900 dark:hover:text-white bg-slate-100 dark:bg-white/5 border-slate-200 dark:border-white/10'
            }`}
          >
            {justShared ? <Check size={18} /> : <Share2 size={18} />}
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
          </button>
        )}
      </div>
      
      <div className="flex justify-between items-start mb-6">
        <div>
          <div className="flex items-center gap-2">
            <h3 className={`text-xl font-orbitron font-bold tracking-tight ${getProviderColor(result.provider)}`}>
              {result.provider}
            </h3>
            <a 
              href={getOperatorLink(result.provider)} 
              target="_blank" 
              rel="noopener noreferrer" 
              className="text-slate-400 hover:text-blue-500 transition-colors"
            >
              <ExternalLink size={12} />
            </a>
          </div>
          <p className="text-slate-500 text-[10px] mt-1 uppercase font-black tracking-widest opacity-80">
            {result.drawDate} | Draw #{result.drawNumber}
          </p>
        </div>
      </div>

      {result.type === '4D' && (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
          <HighlightWrapper val={result.first} className="flex flex-col items-center p-4 rounded-2xl bg-gradient-to-br from-amber-500/10 to-transparent border border-amber-500/20 group-hover:border-amber-500/40 transition-all duration-500 shadow-sm">
            <span className="text-amber-600 dark:text-amber-500 text-[9px] font-black uppercase mb-1 tracking-widest opacity-70">{t.prizes.first}</span>
            <span className="text-4xl font-orbitron font-bold glow-gold tracking-widest text-slate-900 dark:text-white">{result.first}</span>
          </HighlightWrapper>
          <HighlightWrapper val={result.second} className="flex flex-col items-center p-4 rounded-2xl bg-gradient-to-br from-slate-300/10 to-transparent border border-slate-300/20 shadow-sm">
            <span className="text-slate-600 dark:text-slate-400 text-[9px] font-black uppercase mb-1 tracking-widest opacity-70">{t.prizes.second}</span>
            <span className="text-3xl font-orbitron font-bold text-slate-800 dark:text-slate-100 tracking-widest">{result.second}</span>
          </HighlightWrapper>
          <HighlightWrapper val={result.third} className="flex flex-col items-center p-4 rounded-2xl bg-gradient-to-br from-orange-500/10 to-transparent border border-orange-500/20 shadow-sm">
            <span className="text-orange-600 dark:text-orange-500 text-[9px] font-black uppercase mb-1 tracking-widest opacity-70">{t.prizes.third}</span>
            <span className="text-3xl font-orbitron font-bold text-slate-800 dark:text-slate-100 tracking-widest">{result.third}</span>
          </HighlightWrapper>
        </div>
      )}

      {(result.type === '5D' || result.type === '6D') && (
        <div className="space-y-4 mb-8">
          <HighlightWrapper val={result.first} className="flex flex-col items-center p-6 rounded-[2rem] bg-gradient-to-br from-amber-500/10 to-transparent border border-amber-500/20 shadow-sm">
            <span className="text-amber-600 dark:text-amber-500 text-[9px] font-black uppercase mb-2 tracking-widest opacity-70">{t.prizes.first}</span>
            <span className="text-5xl font-orbitron font-bold glow-gold tracking-[0.2em] text-slate-900 dark:text-white">{result.first}</span>
          </HighlightWrapper>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
             {[result.second, result.third, result.fourth, result.fifth].map((val, i) => (
               <HighlightWrapper key={i} val={val} className="flex flex-col items-center p-3 rounded-xl bg-slate-50 dark:bg-white/5 border border-slate-200 dark:border-white/5 shadow-sm">
                  <span className="text-[8px] font-bold uppercase text-slate-500 mb-1">{[t.prizes.second, t.prizes.third, t.prizes.fourth, t.prizes.fifth][i]}</span>
                  <span className="text-lg font-orbitron font-bold text-slate-800 dark:text-slate-200">{val}</span>
               </HighlightWrapper>
             ))}
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
              <HighlightWrapper key={idx} val={num}>
                <span className={`text-xs font-orbitron font-bold text-center tracking-tighter hover:text-blue-500 transition-colors cursor-default ${isHighlighted(num) ? 'text-blue-500 font-black' : ''}`}>{num}</span>
              </HighlightWrapper>
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
              <HighlightWrapper key={idx} val={num}>
                <span className={`text-xs font-orbitron font-medium text-center tracking-tighter hover:text-slate-900 dark:hover:text-white transition-colors cursor-default ${isHighlighted(num) ? 'text-blue-400/80 font-bold' : ''}`}>{num}</span>
              </HighlightWrapper>
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
