
import React, { useState, useEffect } from 'react';
import { Heart, Share2, Check, ExternalLink, Sparkles, Lock, Copy } from 'lucide-react';
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
  const [shake, setShake] = useState(false);
  const [copiedValue, setCopiedValue] = useState<string | null>(null);

  useEffect(() => {
    if (isFavorite) {
      setPop(true);
      const timer = setTimeout(() => setPop(false), 400);
      return () => clearTimeout(timer);
    }
  }, [isFavorite]);

  const handleCopy = (val: string, e: React.MouseEvent) => {
    e.stopPropagation();
    navigator.clipboard.writeText(val);
    setCopiedValue(val);
    setTimeout(() => setCopiedValue(null), 2000);
  };

  const handleShareClick = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (!isLoggedIn && onGuestAttempt) {
      setShake(true);
      setTimeout(() => setShake(false), 500);
      onGuestAttempt();
      return;
    }
    if (onShare) {
      onShare(e);
      setJustShared(true);
      setTimeout(() => setJustShared(false), 2000);
    }
  };

  const handleFavoriteClick = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (!isLoggedIn && onGuestAttempt) {
      setShake(true);
      setTimeout(() => setShake(false), 500);
      onGuestAttempt();
      return;
    }
    if (onToggleFavorite) {
      onToggleFavorite(e);
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
      case LotteryProvider.DAMACAI: return 'text-blue-500';
      case LotteryProvider.SINGAPORE: return 'text-blue-400';
      case LotteryProvider.GDLOTTO: return 'text-red-600';
      case LotteryProvider.MAGNUMLIFE: return 'text-amber-400';
      default: return 'text-blue-400';
    }
  };

  const isHighlighted = (val?: string) => {
    if (!highlightQuery || !val) return false;
    return val.includes(highlightQuery);
  };

  const HighlightWrapper = ({ val, children, className = "", style }: { val?: string, children?: React.ReactNode, className?: string, style?: React.CSSProperties, key?: React.Key }) => {
    const active = isHighlighted(val);
    const justCopied = copiedValue === val;

    return (
      <div 
        style={style}
        className={`relative transition-all duration-500 group/num ${active ? 'scale-110 z-10' : ''} ${className}`}
      >
        {active && (
          <div className="absolute inset-0 bg-blue-500/20 blur-xl rounded-full animate-pulse pointer-events-none"></div>
        )}
        
        {/* Enhanced Copy Button */}
        {val && (
          <button 
            onClick={(e) => handleCopy(val, e)}
            className={`absolute -top-3 -right-3 z-20 p-2 rounded-xl border opacity-0 group-hover/num:opacity-100 transition-all active:scale-95 shadow-xl ${
              justCopied 
              ? 'bg-green-500 border-green-400 text-white opacity-100 scale-110' 
              : 'bg-white/90 dark:bg-black/80 border-slate-200 dark:border-white/10 text-slate-500 dark:text-slate-400 hover:text-blue-500 hover:border-blue-500/50'
            }`}
            title="Copy Number"
          >
            {justCopied ? <Check size={12} strokeWidth={3} /> : <Copy size={12} />}
          </button>
        )}

        {children}

        {active && (
          <div className="absolute -top-2 -left-2 p-1 bg-blue-600 rounded-full shadow-[0_0_15px_rgba(59,130,246,0.8)]">
            <Sparkles size={10} className="text-white animate-pulse" />
          </div>
        )}

        {justCopied && (
          <div className="absolute -bottom-7 left-1/2 -translate-x-1/2 text-[7px] font-black text-green-500 uppercase tracking-widest animate-in fade-in slide-in-from-top-1">
            Copied
          </div>
        )}
      </div>
    );
  };

  return (
    <div className={`
      glass rounded-[2.5rem] p-7 relative overflow-hidden 
      transition-all duration-500 ease-out 
      hover:scale-[1.01] 
      hover:shadow-[0_30px_60px_rgba(0,0,0,0.4)]
      border 
      ${isLive ? 'animate-pulse-border' : ''}
      ${shake ? 'animate-shake' : ''}
      ${isFavorite 
        ? 'border-red-500/40 bg-red-500/[0.03] shadow-[0_0_25px_rgba(239,68,68,0.15)]' 
        : 'border-slate-200 dark:border-white/5 hover:border-blue-500/40'
      }
      animate-in fade-in slide-in-from-bottom-6 duration-700
    `}>
      {/* Action Buttons */}
      <div className="absolute top-6 right-7 flex items-center gap-2.5 z-20">
        <button 
          onClick={handleShareClick}
          className={`group p-2.5 rounded-2xl transition-all duration-300 border active:scale-90 flex items-center justify-center ${
            justShared 
            ? 'text-green-500 bg-green-500/15 border-green-500/30 shadow-[0_0_15px_rgba(34,197,94,0.3)]' 
            : 'text-slate-500 hover:text-slate-900 dark:hover:text-white bg-slate-100 dark:bg-white/5 border-slate-200 dark:border-white/10 hover:border-blue-500/30'
          }`}
          title="Share results"
        >
          {justShared ? <Check size={18} className="animate-in zoom-in" /> : <Share2 size={18} className="group-hover:rotate-12 transition-transform" />}
        </button>
        
        <button 
          onClick={handleFavoriteClick}
          className={`
            flex items-center gap-2 p-2.5 px-4 rounded-2xl transition-all duration-300
            ${isFavorite 
              ? 'text-red-500 bg-red-500/15 border border-red-500/30 shadow-[0_0_15px_rgba(239,68,68,0.3)]' 
              : 'text-slate-500 hover:text-slate-900 dark:hover:text-white bg-slate-100 dark:bg-white/5 border-slate-200 dark:border-white/10 hover:border-red-500/30'
            }
            active:scale-90
          `}
          title={isFavorite ? "Remove from favorites" : "Add to favorites"}
        >
          <Heart size={18} fill={isFavorite ? 'currentColor' : 'none'} className={`${pop ? 'animate-heart-pop' : ''}`} />
          {!isLoggedIn && <Lock size={10} className="opacity-50" />}
        </button>
      </div>
      
      <div className="flex justify-between items-start mb-8">
        <div className="animate-in slide-in-from-left duration-500">
          <div className="flex items-center gap-2.5">
            <h3 className={`text-2xl font-orbitron font-bold tracking-tight ${getProviderColor(result.provider)}`}>
              {result.provider}
            </h3>
            <a 
              href={getOperatorLink(result.provider)} 
              target="_blank" 
              rel="noopener noreferrer" 
              className="p-1.5 rounded-lg bg-white/5 hover:bg-blue-600/10 text-slate-500 hover:text-blue-500 transition-all"
            >
              <ExternalLink size={14} />
            </a>
          </div>
          <p className="text-slate-500 text-[10px] mt-2 uppercase font-black tracking-[0.3em] opacity-80 flex items-center gap-2">
            <span className="w-1 h-1 rounded-full bg-blue-500"></span>
            {result.drawDate} <span className="text-slate-700">|</span> DRAW #{result.drawNumber}
          </p>
        </div>
      </div>

      {result.type === '4D' && (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-5 mb-10">
          <HighlightWrapper val={result.first} className="animate-in zoom-in slide-in-from-top-4 duration-500 delay-100">
            <div className="flex flex-col items-center p-5 rounded-[2rem] bg-gradient-to-br from-amber-500/15 via-amber-500/5 to-transparent border border-amber-500/30 group-hover:border-amber-500/60 transition-all duration-700 shadow-xl animate-radiant-glow">
              <span className="text-amber-600 dark:text-amber-500 text-[10px] font-black uppercase mb-2 tracking-[0.4em] opacity-90">{t.prizes.first}</span>
              <span className="text-5xl font-orbitron font-bold glow-gold tracking-[0.1em] text-slate-900 dark:text-white animate-prize-breathe">{result.first}</span>
            </div>
          </HighlightWrapper>
          
          <HighlightWrapper val={result.second} className="animate-in zoom-in slide-in-from-top-4 duration-500 delay-200">
            <div className="flex flex-col items-center p-5 rounded-[2rem] bg-gradient-to-br from-slate-400/10 to-transparent border border-slate-400/20 shadow-lg hover:border-slate-400/40 transition-all duration-700">
              <span className="text-slate-600 dark:text-slate-400 text-[10px] font-black uppercase mb-2 tracking-[0.4em] opacity-80">{t.prizes.second}</span>
              <span className="text-4xl font-orbitron font-bold text-slate-800 dark:text-slate-200 tracking-widest">{result.second}</span>
            </div>
          </HighlightWrapper>
          
          <HighlightWrapper val={result.third} className="animate-in zoom-in slide-in-from-top-4 duration-500 delay-300">
            <div className="flex flex-col items-center p-5 rounded-[2rem] bg-gradient-to-br from-orange-600/10 to-transparent border border-orange-600/20 shadow-lg hover:border-orange-600/40 transition-all duration-700">
              <span className="text-orange-600 dark:text-orange-500 text-[10px] font-black uppercase mb-2 tracking-[0.4em] opacity-80">{t.prizes.third}</span>
              <span className="text-4xl font-orbitron font-bold text-slate-800 dark:text-slate-200 tracking-widest">{result.third}</span>
            </div>
          </HighlightWrapper>
        </div>
      )}

      {(result.type === '5D' || result.type === '6D') && (
        <div className="space-y-5 mb-10">
          <HighlightWrapper val={result.first} className="animate-in zoom-in slide-in-from-top-4 duration-700">
            <div className="flex flex-col items-center p-8 rounded-[2.5rem] bg-gradient-to-br from-amber-500/15 via-transparent to-transparent border border-amber-500/30 shadow-2xl animate-radiant-glow">
              <span className="text-amber-600 dark:text-amber-500 text-[10px] font-black uppercase mb-3 tracking-[0.5em] opacity-90">{t.prizes.first}</span>
              <span className="text-6xl font-orbitron font-bold glow-gold tracking-[0.2em] text-slate-900 dark:text-white animate-prize-breathe">{result.first}</span>
            </div>
          </HighlightWrapper>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
             {[result.second, result.third, result.fourth, result.fifth].map((val, i) => (
               <HighlightWrapper key={i} val={val} className="animate-in slide-in-from-bottom-2 duration-500" style={{ animationDelay: `${(i+1)*100}ms` }}>
                  <div className="flex flex-col items-center p-4 rounded-2xl bg-slate-100 dark:bg-white/5 border border-slate-200 dark:border-white/5 shadow-md hover:border-blue-500/20 transition-all">
                    <span className="text-[9px] font-bold uppercase text-slate-500 mb-2 tracking-widest">{[t.prizes.second, t.prizes.third, t.prizes.fourth, t.prizes.fifth][i]}</span>
                    <span className="text-xl font-orbitron font-bold text-slate-800 dark:text-slate-200 tracking-wider">{val}</span>
                  </div>
               </HighlightWrapper>
             ))}
          </div>
        </div>
      )}

      {result.specials && result.specials.length > 0 && (
        <div className="mb-8 space-y-4 animate-in fade-in duration-1000 delay-500">
          <div className="flex items-center gap-4">
            <h4 className="text-slate-500 dark:text-slate-600 text-[10px] font-black uppercase tracking-[0.4em] whitespace-nowrap">{t.prizes.special}</h4>
            <div className="h-px w-full bg-gradient-to-r from-slate-200 dark:from-white/10 to-transparent"></div>
          </div>
          <div className="grid grid-cols-5 gap-y-4 gap-x-2 text-slate-700 dark:text-slate-400">
            {result.specials.map((num, idx) => (
              <HighlightWrapper key={idx} val={num}>
                <div className={`text-[13px] font-orbitron font-bold text-center tracking-tighter hover:text-blue-500 transition-all cursor-default py-1 px-2 rounded-lg hover:bg-white/5 ${isHighlighted(num) ? 'text-blue-500 font-black scale-110' : ''}`}>{num}</div>
              </HighlightWrapper>
            ))}
          </div>
        </div>
      )}

      {result.consolations && result.consolations.length > 0 && (
        <div className="space-y-4 animate-in fade-in duration-1000 delay-700">
          <div className="flex items-center gap-4">
            <h4 className="text-slate-500 dark:text-slate-600 text-[10px] font-black uppercase tracking-[0.4em] whitespace-nowrap">{t.prizes.consolation}</h4>
            <div className="h-px w-full bg-gradient-to-r from-slate-200 dark:from-white/10 to-transparent"></div>
          </div>
          <div className="grid grid-cols-5 gap-y-4 gap-x-2 text-slate-500 dark:text-slate-500">
            {result.consolations.map((num, idx) => (
              <HighlightWrapper key={idx} val={num}>
                <div className={`text-[13px] font-orbitron font-medium text-center tracking-tighter hover:text-slate-900 dark:hover:text-white transition-all cursor-default py-1 px-2 rounded-lg hover:bg-white/5 ${isHighlighted(num) ? 'text-blue-400/80 font-bold scale-110' : ''}`}>{num}</div>
              </HighlightWrapper>
            ))}
          </div>
        </div>
      )}

      <div className="mt-8 pt-5 border-t border-slate-200 dark:border-white/5 flex justify-center">
        <div className="flex items-center gap-2 px-4 py-1.5 rounded-full bg-green-500/5 border border-green-500/10">
          <Check size={10} className="text-green-600 dark:text-green-500 animate-pulse"/>
          <span className="text-[9px] font-black text-slate-500 dark:text-slate-400 uppercase tracking-[0.3em]">Verified Nexus Signature</span>
        </div>
      </div>
    </div>
  );
};
