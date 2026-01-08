
import React, { useState, useEffect } from 'react';
import { Heart, Share2, Check, ExternalLink, Sparkles, Lock, Copy, Loader2, CheckCircle2, ClipboardCopy } from 'lucide-react';
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
  loading?: boolean;
}

export const ResultCard: React.FC<ResultCardProps> = ({ 
  result, 
  lang, 
  isLoggedIn = false,
  onGuestAttempt,
  isFavorite = false, 
  onToggleFavorite,
  onShare,
  highlightQuery = "",
  loading = false
}) => {
  const t = LANGUAGES[lang];
  const isLive = result.status === 'Live';
  const [pop, setPop] = useState(false);
  const [justShared, setJustShared] = useState(false);
  const [justCopiedAll, setJustCopiedAll] = useState(false);
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

  const handleCopyAll = (e: React.MouseEvent) => {
    e.stopPropagation();
    const parts = [
      `${result.provider} - ${result.drawDate}`,
      `1st: ${result.first}`,
      result.second ? `2nd: ${result.second}` : '',
      result.third ? `3rd: ${result.third}` : '',
      result.fourth ? `4th: ${result.fourth}` : '',
      result.fifth ? `5th: ${result.fifth}` : '',
      result.sixth ? `6th: ${result.sixth}` : '',
      result.specials ? `Specials: ${result.specials.join(', ')}` : '',
      result.consolations ? `Consolations: ${result.consolations.join(', ')}` : ''
    ].filter(Boolean);
    
    navigator.clipboard.writeText(parts.join('\n'));
    setJustCopiedAll(true);
    setTimeout(() => setJustCopiedAll(false), 2000);
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
    if (onToggleFavorite) onToggleFavorite(e);
  };

  const getProviderColor = (provider: LotteryProvider) => {
    switch (provider) {
      case LotteryProvider.MAGNUM: return 'text-amber-500';
      case LotteryProvider.TOTO: return 'text-red-500';
      case LotteryProvider.DAMACAI: return 'text-blue-500';
      case LotteryProvider.SINGAPORE: return 'text-blue-400';
      case LotteryProvider.GDLOTTO: return 'text-red-600';
      default: return 'text-blue-400';
    }
  };

  const isHighlighted = (val?: string) => {
    if (!highlightQuery || !val) return false;
    return val === highlightQuery || val.includes(highlightQuery);
  };

  // Fixed HighlightWrapper type definition to include optional key prop for mapping
  const HighlightWrapper = ({ val, children, className = "", style }: { val?: string, children?: React.ReactNode, className?: string, style?: React.CSSProperties, key?: React.Key }) => {
    const active = isHighlighted(val);
    const justCopied = copiedValue === val;
    return (
      <div style={style} className={`relative transition-all duration-500 group/num ${active ? 'scale-105 z-10' : ''} ${className}`}>
        {active && <div className="absolute inset-0 bg-blue-500/10 blur-xl rounded-full animate-pulse pointer-events-none"></div>}
        {val && (
          <button onClick={(e) => handleCopy(val, e)} className={`absolute -top-2 -right-2 z-20 p-1.5 rounded-lg border opacity-0 group-hover/num:opacity-100 transition-all active:scale-90 shadow-2xl ${justCopied ? 'bg-green-500 border-green-400 text-white opacity-100 scale-110' : 'bg-white dark:bg-black/80 border-slate-200 dark:border-white/10 text-slate-500 dark:text-slate-400 hover:text-blue-500'}`}>
            {justCopied ? <Check size={10} strokeWidth={3} /> : <Copy size={10} />}
          </button>
        )}
        {children}
        {active && <div className="absolute -top-1 -left-1 p-0.5 bg-blue-600 rounded-full shadow-[0_0_10px_rgba(59,130,246,0.8)]"><Sparkles size={8} className="text-white animate-pulse" /></div>}
        {justCopied && <div className="absolute -bottom-8 left-1/2 -translate-x-1/2 px-2 py-1 bg-green-600 text-white text-[7px] font-black uppercase rounded shadow-lg animate-in slide-in-from-top-1 whitespace-nowrap z-30">Synced</div>}
      </div>
    );
  };

  if (loading) {
    return <div className="glass rounded-[2.5rem] p-7 border border-white/5 min-h-[300px] flex flex-col gap-6 animate-pulse bg-white/5" />;
  }

  return (
    <div className={`glass rounded-[2.5rem] p-5 sm:p-7 relative overflow-hidden transition-all duration-500 border ${isLive ? 'animate-pulse-border' : ''} ${shake ? 'animate-shake' : ''} ${isFavorite ? 'border-red-500/40 bg-red-500/[0.03]' : 'border-slate-200 dark:border-white/5 hover:border-blue-500/30'} animate-in fade-in slide-in-from-bottom-6`}>
      <div className="absolute top-4 sm:top-6 right-4 sm:right-7 flex items-center gap-2 z-20">
        <button onClick={handleCopyAll} className={`p-2.5 rounded-2xl transition-all border active:scale-90 ${justCopiedAll ? 'text-blue-500 bg-blue-500/15 border-blue-500/30 shadow-[0_0_15px_rgba(59,130,246,0.3)]' : 'text-slate-500 bg-slate-100 dark:bg-white/5 border-slate-200 dark:border-white/10 hover:border-blue-500/30'}`} title="Copy All">
          {justCopiedAll ? <Check size={18} /> : <ClipboardCopy size={18} />}
        </button>
        <button onClick={handleShareClick} className={`p-2.5 rounded-2xl transition-all border active:scale-90 ${justShared ? 'text-green-500 bg-green-500/15 border-green-500/30' : 'text-slate-500 bg-slate-100 dark:bg-white/5 border-slate-200 dark:border-white/10'}`}>
          {justShared ? <Check size={18} /> : <Share2 size={18} />}
        </button>
        <button onClick={handleFavoriteClick} className={`flex items-center gap-2 p-2.5 px-4 rounded-2xl transition-all border active:scale-90 ${isFavorite ? 'text-red-500 bg-red-500/15 border-red-500/30' : 'text-slate-500 bg-slate-100 dark:bg-white/5 border-slate-200 dark:border-white/10'}`}>
          <Heart size={18} fill={isFavorite ? 'currentColor' : 'none'} className={pop ? 'animate-heart-pop' : ''} />
          {!isLoggedIn && <Lock size={10} className="opacity-50" />}
        </button>
      </div>
      
      <div className="flex justify-between items-start mb-6">
        <div>
          <h3 className={`text-xl sm:text-2xl font-orbitron font-bold ${getProviderColor(result.provider)}`}>{result.provider}</h3>
          <p className="text-slate-500 text-[9px] sm:text-[10px] mt-1.5 uppercase font-black tracking-[0.2em] flex items-center gap-2">
            <span className="w-1 h-1 rounded-full bg-blue-500"></span>
            {result.drawDate} <span className="text-slate-700">|</span> DRAW #{result.drawNumber}
          </p>
        </div>
      </div>

      {result.type === '4D' ? (
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 sm:gap-5 mb-8">
          <HighlightWrapper key={0} val={result.first} className="animate-in fade-in slide-in-from-top-2 duration-500 delay-75">
            <div className="flex flex-col items-center p-4 sm:p-5 rounded-[1.5rem] bg-gradient-to-br from-amber-500/15 via-amber-500/5 to-transparent border border-amber-500/30 shadow-xl animate-radiant-glow">
              <span className="text-amber-600 dark:text-amber-500 text-[8px] sm:text-[9px] font-black uppercase mb-1 tracking-[0.4em]">{t.prizes.first}</span>
              <span className="text-4xl sm:text-5xl font-orbitron font-bold glow-gold tracking-[0.1em] animate-prize-breathe">{result.first}</span>
            </div>
          </HighlightWrapper>
          <HighlightWrapper key={1} val={result.second} className="animate-in fade-in slide-in-from-top-2 duration-500 delay-150">
            <div className="flex flex-col items-center p-4 sm:p-5 rounded-[1.5rem] bg-white/5 border border-slate-400/20 shadow-lg">
              <span className="text-slate-600 dark:text-slate-400 text-[8px] sm:text-[9px] font-black uppercase mb-1 tracking-[0.4em]">{t.prizes.second}</span>
              <span className="text-3xl sm:text-4xl font-orbitron font-bold text-slate-800 dark:text-slate-200 tracking-widest">{result.second}</span>
            </div>
          </HighlightWrapper>
          <HighlightWrapper key={2} val={result.third} className="animate-in fade-in slide-in-from-top-2 duration-500 delay-200">
            <div className="flex flex-col items-center p-4 sm:p-5 rounded-[1.5rem] bg-white/5 border border-orange-600/20 shadow-lg">
              <span className="text-orange-600 dark:text-orange-500 text-[8px] sm:text-[9px] font-black uppercase mb-1 tracking-[0.4em]">{t.prizes.third}</span>
              <span className="text-3xl sm:text-4xl font-orbitron font-bold text-slate-800 dark:text-slate-200 tracking-widest">{result.third}</span>
            </div>
          </HighlightWrapper>
        </div>
      ) : (
        <div className="space-y-4 sm:space-y-6 mb-8">
          <HighlightWrapper key="main" val={result.first} className="w-full animate-in fade-in slide-in-from-top-2 duration-500">
            <div className="flex flex-col items-center p-5 sm:p-8 rounded-[2rem] bg-gradient-to-br from-amber-500/15 border border-amber-500/30 animate-radiant-glow">
              <span className="text-amber-500 text-[9px] font-black uppercase mb-2 tracking-[0.5em]">{t.prizes.first}</span>
              <span className="text-4xl sm:text-6xl font-orbitron font-bold glow-gold tracking-[0.2em]">{result.first}</span>
            </div>
          </HighlightWrapper>
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-5 gap-3">
             {[
               { val: result.second, label: t.prizes.second },
               { val: result.third, label: t.prizes.third },
               { val: result.fourth, label: t.prizes.fourth },
               { val: result.fifth, label: t.prizes.fifth },
               { val: result.sixth, label: t.prizes.sixth },
             ].filter(p => p.val).map((prize, i) => (
               <HighlightWrapper key={i} val={prize.val} className="animate-in fade-in duration-500" style={{ animationDelay: `${(i + 1) * 100}ms` }}>
                  <div className="flex flex-col items-center p-3 sm:p-4 rounded-xl bg-slate-100 dark:bg-white/5 border border-slate-200 dark:border-white/5 hover:border-blue-500/20 transition-all">
                    <span className="text-[7px] sm:text-[8px] font-black uppercase text-slate-500 mb-1 tracking-widest">{prize.label}</span>
                    <span className="text-base sm:text-lg font-orbitron font-bold text-slate-800 dark:text-slate-200">{prize.val}</span>
                  </div>
               </HighlightWrapper>
             ))}
          </div>
        </div>
      )}

      {result.specials && result.specials.length > 0 && (
        <div className="mb-6 space-y-3">
          <div className="flex items-center gap-3"><h4 className="text-slate-500 text-[8px] sm:text-[9px] font-black uppercase tracking-[0.4em] whitespace-nowrap">{t.prizes.special}</h4><div className="h-px w-full bg-gradient-to-r from-slate-200 dark:from-white/10 to-transparent"></div></div>
          <div className="grid grid-cols-5 sm:grid-cols-10 gap-1.5">
            {result.specials.map((num, idx) => (
              <HighlightWrapper key={idx} val={num} className="animate-in fade-in duration-700" style={{ animationDelay: `${idx * 20}ms` }}>
                <div className={`text-[9px] sm:text-[11px] font-orbitron font-bold text-center tracking-tighter hover:text-blue-500 transition-all py-1.5 rounded-lg bg-slate-50 dark:bg-white/5 border border-transparent hover:border-blue-500/20 ${isHighlighted(num) ? 'text-blue-500 bg-blue-500/10' : 'text-slate-700 dark:text-slate-400'}`}>{num}</div>
              </HighlightWrapper>
            ))}
          </div>
        </div>
      )}

      {result.consolations && result.consolations.length > 0 && (
        <div className="space-y-3">
          <div className="flex items-center gap-3"><h4 className="text-slate-500 text-[8px] sm:text-[9px] font-black uppercase tracking-[0.4em] whitespace-nowrap">{t.prizes.consolation}</h4><div className="h-px w-full bg-gradient-to-r from-slate-200 dark:from-white/10 to-transparent"></div></div>
          <div className="grid grid-cols-5 sm:grid-cols-10 gap-1.5">
            {result.consolations.map((num, idx) => (
              <HighlightWrapper key={idx} val={num} className="animate-in fade-in duration-700" style={{ animationDelay: `${idx * 20}ms` }}>
                <div className={`text-[9px] sm:text-[11px] font-orbitron font-medium text-center tracking-tighter hover:text-white transition-all py-1.5 rounded-lg bg-slate-50 dark:bg-white/5 border border-transparent hover:border-blue-500/10 ${isHighlighted(num) ? 'text-blue-400 bg-blue-400/10' : 'text-slate-500'}`}>{num}</div>
              </HighlightWrapper>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};
