
import React, { useState, useEffect } from 'react';
import { Heart, Share2, Check } from 'lucide-react';
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

  // Trigger pop animation when favorited
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

  const getProviderColor = (provider: LotteryProvider) => {
    switch (provider) {
      case LotteryProvider.MAGNUM: return 'text-amber-500';
      case LotteryProvider.TOTO: return 'text-red-500';
      case LotteryProvider.DAMACAI: return 'text-blue-500';
      case LotteryProvider.SINGAPORE: return 'text-blue-400';
      case LotteryProvider.GDLOTTO: return 'text-red-600';
      case LotteryProvider.PERDANA4D: return 'text-purple-500';
      case LotteryProvider.SABAH88: return 'text-orange-500';
      default: return 'text-blue-400';
    }
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
        : 'border-white/5 hover:border-blue-500/30 hover:bg-white/[0.05]'
      }
      animate-in fade-in slide-in-from-bottom-4
    `}>
      {/* Dynamic Background Glow for Favorited Items */}
      {isFavorite && (
        <div className="absolute -right-10 -top-10 w-32 h-32 bg-red-500/5 blur-[50px] rounded-full pointer-events-none"></div>
      )}

      <div className="absolute top-4 right-6 flex items-center gap-2 z-10">
        <div className="flex items-center gap-2">
          {onShare && (
            <button 
              onClick={handleShareClick}
              className={`p-2 rounded-xl transition-all duration-300 border active:scale-90 flex items-center justify-center ${
                justShared 
                ? 'text-green-500 bg-green-500/10 border-green-500/30 shadow-[0_0_10px_rgba(34,197,94,0.2)]' 
                : 'text-slate-500 hover:text-white bg-white/5 border-white/10 hover-pulse-icon'
              }`}
              title="Share Result"
            >
              {justShared ? <Check size={18} className="animate-in zoom-in duration-300" /> : <Share2 size={18} />}
            </button>
          )}
          {onToggleFavorite && (
            <button 
              onClick={onToggleFavorite}
              className={`
                flex items-center gap-2 p-2 px-3 rounded-xl transition-all duration-300
                ${isFavorite 
                  ? 'text-red-500 bg-red-500/10 border border-red-500/30 shadow-[0_0_10px_rgba(239,68,68,0.2)]' 
                  : 'text-slate-500 hover:text-white bg-white/5 border border-white/10'
                }
                active:scale-90
              `}
              title={isFavorite ? 'Remove from Favorites' : 'Add to Favorites'}
            >
              <Heart 
                size={18} 
                fill={isFavorite ? 'currentColor' : 'none'} 
                className={`transition-transform duration-300 ${pop ? 'animate-heart-pop' : ''}`}
              />
              {isFavorite && (
                <span className="text-[9px] font-black uppercase tracking-widest animate-in slide-in-from-right-2 duration-300">
                  Saved
                </span>
              )}
            </button>
          )}
        </div>
        
        {isLive && (
          <div className="flex items-center gap-2 bg-black/40 px-3 py-1 rounded-full border border-red-500/20 backdrop-blur-md">
            <span className="w-2 h-2 bg-red-500 rounded-full animate-ping"></span>
            <span className="text-red-500 text-[10px] font-black uppercase tracking-[0.2em]">{t.live}</span>
          </div>
        )}
      </div>
      
      <div className="flex justify-between items-start mb-6">
        <div>
          <h3 className={`text-xl font-orbitron font-bold tracking-tight ${getProviderColor(result.provider)}`}>
            {result.provider}
          </h3>
          <p className="text-slate-500 text-[10px] mt-1 uppercase font-black tracking-widest opacity-80">
            {result.drawDate} | Draw #{result.drawNumber}
          </p>
        </div>
        <div className="w-10 h-10 rounded-xl bg-white/5 flex items-center justify-center font-orbitron font-black border border-white/10 group-hover:border-blue-500/50 transition-colors">
            {result.provider.substring(0, 1)}
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
        <div className="flex flex-col items-center p-4 rounded-2xl bg-gradient-to-br from-amber-500/10 to-transparent border border-amber-500/20 group-hover:border-amber-500/40 transition-all duration-500">
          <span className="text-amber-500 text-[9px] font-black uppercase mb-1 tracking-widest opacity-70">{t.prizes.first}</span>
          <span className="text-4xl font-orbitron font-bold glow-gold tracking-widest text-white group-hover:scale-110 transition-transform duration-500">{result.first}</span>
        </div>
        <div className="flex flex-col items-center p-4 rounded-2xl bg-gradient-to-br from-slate-300/10 to-transparent border border-slate-300/20">
          <span className="text-slate-400 text-[9px] font-black uppercase mb-1 tracking-widest opacity-70">{t.prizes.second}</span>
          <span className="text-3xl font-orbitron font-bold text-slate-100 tracking-widest">{result.second}</span>
        </div>
        <div className="flex flex-col items-center p-4 rounded-2xl bg-gradient-to-br from-orange-500/10 to-transparent border border-orange-500/20">
          <span className="text-orange-500 text-[9px] font-black uppercase mb-1 tracking-widest opacity-70">{t.prizes.third}</span>
          <span className="text-3xl font-orbitron font-bold text-slate-100 tracking-widest">{result.third}</span>
        </div>
      </div>

      <div className="mb-6 space-y-3">
        <div className="flex items-center gap-3">
          <h4 className="text-slate-600 text-[9px] font-black uppercase tracking-[0.3em] whitespace-nowrap">{t.prizes.special}</h4>
          <div className="h-px w-full bg-white/5"></div>
        </div>
        <div className="grid grid-cols-5 gap-y-3 gap-x-1">
          {result.specials.map((num, idx) => (
            <span key={idx} className="text-xs font-orbitron font-bold text-slate-400 text-center tracking-tighter hover:text-blue-400 transition-colors cursor-default">{num}</span>
          ))}
        </div>
      </div>

      <div className="space-y-3">
        <div className="flex items-center gap-3">
          <h4 className="text-slate-600 text-[9px] font-black uppercase tracking-[0.3em] whitespace-nowrap">{t.prizes.consolation}</h4>
          <div className="h-px w-full bg-white/5"></div>
        </div>
        <div className="grid grid-cols-5 gap-y-3 gap-x-1">
          {result.consolations.map((num, idx) => (
            <span key={idx} className="text-xs font-orbitron font-medium text-slate-500 text-center tracking-tighter hover:text-white transition-colors cursor-default">{num}</span>
          ))}
        </div>
      </div>
    </div>
  );
};
