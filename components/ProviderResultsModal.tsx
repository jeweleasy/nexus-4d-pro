
import React, { useState } from 'react';
import { X, Trophy, ShieldCheck, Calendar, Hash, Heart, Share2, Check } from 'lucide-react';
import { LotteryResult, LotteryProvider } from '../types';
import { LANGUAGES } from '../constants';
import { ShadowButton } from './ShadowButton';

interface ProviderResultsModalProps {
  result: LotteryResult | null;
  onClose: () => void;
  lang: 'EN' | 'CN' | 'MY';
  isLoggedIn?: boolean;
  onGuestAttempt?: () => void;
  isFavorite?: boolean;
  onToggleFavorite?: () => void;
  onShare?: (e: React.MouseEvent) => void;
}

export const ProviderResultsModal: React.FC<ProviderResultsModalProps> = ({ 
  result, 
  onClose, 
  lang,
  isLoggedIn = false,
  onGuestAttempt,
  isFavorite = false,
  onToggleFavorite,
  onShare
}) => {
  if (!result) return null;

  const t = LANGUAGES[lang];
  const [justShared, setJustShared] = useState(false);
  
  const getProviderColor = (provider: LotteryProvider) => {
    switch (provider) {
      case LotteryProvider.MAGNUM: return 'from-amber-500 to-amber-700';
      case LotteryProvider.TOTO:
      case LotteryProvider.TOTO5D:
      case LotteryProvider.TOTO6D: return 'from-red-500 to-red-700';
      case LotteryProvider.DAMACAI: return 'from-blue-500 to-blue-700';
      case LotteryProvider.SINGAPORE: return 'from-blue-400 to-blue-600';
      default: return 'from-blue-600 to-indigo-800';
    }
  };

  const handleShare = (e: React.MouseEvent) => {
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

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 md:p-8">
      <div className="absolute inset-0 bg-black/80 backdrop-blur-xl animate-in fade-in duration-300" onClick={onClose}></div>
      
      <div className="relative w-full max-w-4xl glass rounded-[2.5rem] border border-white/10 overflow-hidden shadow-2xl animate-in zoom-in slide-in-from-bottom-8 duration-500">
        <div className={`h-2 w-full bg-gradient-to-r ${getProviderColor(result.provider)}`}></div>
        
        <div className="p-8 md:p-12">
          <div className="flex justify-between items-start mb-10">
            <div className="space-y-2">
              <div className="flex items-center gap-3">
                <div className={`w-12 h-12 rounded-2xl bg-gradient-to-br ${getProviderColor(result.provider)} flex items-center justify-center font-orbitron font-black text-xl shadow-lg`}>
                  {result.provider.charAt(0)}
                </div>
                <div>
                  <h2 className="text-3xl font-orbitron font-bold text-white tracking-tight">{result.provider}</h2>
                  <div className="flex items-center gap-4 text-slate-500 text-xs mt-1">
                    <span className="flex items-center gap-1"><Calendar size={14}/> {result.drawDate}</span>
                    <span className="flex items-center gap-1"><Hash size={14}/> Draw #{result.drawNumber}</span>
                    <span className="bg-white/10 px-2 py-0.5 rounded uppercase tracking-widest text-[10px]">{result.type} Mode</span>
                  </div>
                </div>
              </div>
            </div>
            <div className="flex items-center gap-3">
              {onShare && (
                <button 
                  onClick={handleShare}
                  className={`p-3 rounded-full transition-all border flex items-center justify-center ${
                    justShared 
                    ? 'text-green-500 bg-green-500/10 border-green-500/20 shadow-[0_0_10px_rgba(34,197,94,0.2)]' 
                    : 'text-slate-400 bg-white/5 border-white/10 hover:text-white hover:bg-white/10 hover-pulse-icon'
                  }`}
                  title="Share Result"
                >
                  {justShared ? <Check size={24} className="animate-in zoom-in duration-300" /> : <Share2 size={24} />}
                </button>
              )}
              {onToggleFavorite && (
                <button 
                  onClick={onToggleFavorite}
                  className={`p-3 rounded-full transition-all border ${isFavorite ? 'text-red-500 bg-red-500/10 border-red-500/20 shadow-[0_0_10px_rgba(239,68,68,0.2)]' : 'text-slate-400 bg-white/5 border-white/10 hover:text-white hover:bg-white/10'}`}
                >
                  <Heart size={24} fill={isFavorite ? 'currentColor' : 'none'} />
                </button>
              )}
              <button onClick={onClose} className="p-3 rounded-full bg-white/5 hover:bg-white/10 text-slate-400 hover:text-white transition-all">
                <X size={24} />
              </button>
            </div>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
            <div className="space-y-8">
              <div className="p-8 rounded-3xl bg-gradient-to-br from-white/5 to-transparent border border-white/10 relative overflow-hidden group">
                <div className="absolute -right-8 -top-8 w-32 h-32 bg-amber-500/10 blur-3xl rounded-full"></div>
                <div className="flex items-center justify-between mb-4">
                  <span className="text-amber-500 text-xs font-black uppercase tracking-[0.3em] flex items-center gap-2">
                    <Trophy size={16} /> {result.type === 'LIFE' ? 'Winning Set' : t.prizes.first}
                  </span>
                  <ShieldCheck size={18} className="text-blue-500" />
                </div>
                
                {result.type === 'LIFE' ? (
                  <div className="flex flex-wrap justify-center gap-4 py-8">
                    {result.first.split(',').map((num, i) => (
                      <div key={i} className="w-16 h-16 rounded-full glass border border-amber-500/30 flex items-center justify-center font-orbitron font-bold text-2xl text-amber-500 shadow-[0_0_15px_rgba(245,158,11,0.2)]">
                        {num.trim()}
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="text-7xl md:text-8xl font-orbitron font-black text-white glow-gold tracking-[0.1em] text-center py-4">
                    {result.first}
                  </div>
                )}
              </div>

              {(result.type === '4D' || result.type === '5D' || result.type === '6D') && (
                <div className="grid grid-cols-2 gap-6">
                  <div className="p-6 rounded-2xl bg-white/5 border border-white/10 text-center">
                    <span className="text-slate-400 text-[10px] font-black uppercase tracking-widest mb-2 block">{t.prizes.second}</span>
                    <span className="text-3xl font-orbitron font-bold text-slate-200 tracking-widest">{result.second}</span>
                  </div>
                  <div className="p-6 rounded-2xl bg-white/5 border border-white/10 text-center">
                    <span className="text-orange-500 text-[10px] font-black uppercase tracking-widest mb-2 block">{t.prizes.third}</span>
                    <span className="text-3xl font-orbitron font-bold text-slate-200 tracking-widest">{result.third}</span>
                  </div>
                </div>
              )}

              {(result.type === '5D' || result.type === '6D') && (
                <div className="grid grid-cols-3 gap-4">
                   <div className="p-4 rounded-xl bg-white/5 border border-white/5 text-center">
                    <span className="text-slate-500 text-[9px] font-bold uppercase mb-1 block">{t.prizes.fourth}</span>
                    <span className="text-xl font-orbitron font-bold text-slate-300">{result.fourth}</span>
                  </div>
                   <div className="p-4 rounded-xl bg-white/5 border border-white/5 text-center">
                    <span className="text-slate-500 text-[9px] font-bold uppercase mb-1 block">{t.prizes.fifth}</span>
                    <span className="text-xl font-orbitron font-bold text-slate-300">{result.fifth}</span>
                  </div>
                   {result.type === '6D' && (
                     <div className="p-4 rounded-xl bg-white/5 border border-white/5 text-center">
                      <span className="text-slate-500 text-[9px] font-bold uppercase mb-1 block">{t.prizes.sixth}</span>
                      <span className="text-xl font-orbitron font-bold text-slate-300">{result.sixth || '-'}</span>
                    </div>
                   )}
                </div>
              )}
            </div>

            <div className="space-y-8">
              {result.specials && (
                <div>
                  <h4 className="text-[10px] font-black uppercase tracking-[0.3em] text-slate-500 mb-4 flex items-center gap-2">
                     <div className="w-1.5 h-1.5 rounded-full bg-blue-500"></div> {t.prizes.special}
                  </h4>
                  <div className="grid grid-cols-2 gap-3">
                    {result.specials.map((num, i) => (
                      <div key={i} className="py-3 px-4 rounded-xl bg-white/5 border border-white/5 flex justify-between items-center group hover:bg-white/10 transition-all">
                        <span className="text-[10px] text-slate-600 font-bold">{String(i+1).padStart(2, '0')}</span>
                        <span className="text-lg font-orbitron font-bold text-slate-300 group-hover:text-blue-400">{num}</span>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {result.consolations && (
                <div>
                  <h4 className="text-[10px] font-black uppercase tracking-[0.3em] text-slate-500 mb-4 flex items-center gap-2">
                     <div className="w-1.5 h-1.5 rounded-full bg-slate-500"></div> {t.prizes.consolation}
                  </h4>
                  <div className="grid grid-cols-2 gap-3">
                    {result.consolations.map((num, i) => (
                      <div key={i} className="py-3 px-4 rounded-xl bg-white/5 border border-white/5 flex justify-between items-center group hover:bg-white/10 transition-all">
                        <span className="text-[10px] text-slate-600 font-bold">{String(i+1).padStart(2, '0')}</span>
                        <span className="text-lg font-orbitron font-bold text-slate-400 group-hover:text-white">{num}</span>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>
          </div>

          <div className="mt-12 flex justify-center">
             <ShadowButton variant="primary" onClick={onClose} className="px-12 py-3">
               Close Detailed View
             </ShadowButton>
          </div>
        </div>
      </div>
    </div>
  );
};
