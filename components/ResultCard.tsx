
import React from 'react';
import { LotteryResult, LotteryProvider } from '../types';
import { LANGUAGES } from '../constants';

interface ResultCardProps {
  result: LotteryResult;
  lang: 'EN' | 'CN' | 'MY';
}

export const ResultCard: React.FC<ResultCardProps> = ({ result, lang }) => {
  const t = LANGUAGES[lang];
  const isLive = result.status === 'Live';

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
    <div className={`glass rounded-2xl p-6 relative overflow-hidden transition-all duration-300 hover:scale-[1.01] border border-white/5 ${isLive ? 'animate-pulse-border' : ''}`}>
      {isLive && (
        <div className="absolute top-2 right-4 flex items-center gap-2">
          <span className="w-2 h-2 bg-red-500 rounded-full animate-ping"></span>
          <span className="text-red-500 text-[10px] font-bold uppercase tracking-widest">{t.live}</span>
        </div>
      )}
      
      <div className="flex justify-between items-start mb-6">
        <div>
          <h3 className={`text-xl font-orbitron font-bold ${getProviderColor(result.provider)}`}>
            {result.provider}
          </h3>
          <p className="text-slate-400 text-[10px] mt-1 uppercase tracking-tighter">
            {result.drawDate} | Draw #{result.drawNumber}
          </p>
        </div>
        <div className="w-10 h-10 rounded-xl bg-white/5 flex items-center justify-center font-orbitron font-bold border border-white/10">
            {result.provider.substring(0, 1)}
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
        <div className="flex flex-col items-center p-3 rounded-xl bg-gradient-to-br from-amber-500/20 to-transparent border border-amber-500/30">
          <span className="text-amber-500 text-[10px] font-bold uppercase mb-1">{t.prizes.first}</span>
          <span className="text-4xl font-orbitron font-bold glow-gold tracking-widest">{result.first}</span>
        </div>
        <div className="flex flex-col items-center p-3 rounded-xl bg-gradient-to-br from-slate-300/20 to-transparent border border-slate-300/30">
          <span className="text-slate-300 text-[10px] font-bold uppercase mb-1">{t.prizes.second}</span>
          <span className="text-3xl font-orbitron font-bold text-slate-100 tracking-widest">{result.second}</span>
        </div>
        <div className="flex flex-col items-center p-3 rounded-xl bg-gradient-to-br from-orange-500/20 to-transparent border border-orange-500/30">
          <span className="text-orange-500 text-[10px] font-bold uppercase mb-1">{t.prizes.third}</span>
          <span className="text-3xl font-orbitron font-bold text-slate-100 tracking-widest">{result.third}</span>
        </div>
      </div>

      <div className="mb-6">
        <h4 className="text-slate-500 text-[10px] font-bold uppercase mb-2 tracking-widest border-b border-white/5 pb-1">{t.prizes.special}</h4>
        <div className="grid grid-cols-5 gap-y-2 gap-x-1">
          {result.specials.map((num, idx) => (
            <span key={idx} className="text-xs font-orbitron text-slate-300 text-center tracking-tighter">{num}</span>
          ))}
        </div>
      </div>

      <div>
        <h4 className="text-slate-500 text-[10px] font-bold uppercase mb-2 tracking-widest border-b border-white/5 pb-1">{t.prizes.consolation}</h4>
        <div className="grid grid-cols-5 gap-y-2 gap-x-1">
          {result.consolations.map((num, idx) => (
            <span key={idx} className="text-xs font-orbitron text-slate-400 text-center tracking-tighter">{num}</span>
          ))}
        </div>
      </div>
    </div>
  );
};
