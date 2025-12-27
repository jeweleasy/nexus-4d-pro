
import React from 'react';
import { LotteryResult } from '../types';
import { LANGUAGES } from '../constants';

interface ResultCardProps {
  result: LotteryResult;
  lang: 'EN' | 'CN' | 'MY';
}

export const ResultCard: React.FC<ResultCardProps> = ({ result, lang }) => {
  const t = LANGUAGES[lang];
  const isLive = result.status === 'Live';

  return (
    <div className={`glass rounded-2xl p-6 relative overflow-hidden transition-all duration-300 hover:scale-[1.01] ${isLive ? 'animate-pulse-border' : ''}`}>
      {isLive && (
        <div className="absolute top-2 right-4 flex items-center gap-2">
          <span className="w-2 h-2 bg-red-500 rounded-full animate-ping"></span>
          <span className="text-red-500 text-xs font-bold uppercase tracking-widest">{t.live}</span>
        </div>
      )}
      
      <div className="flex justify-between items-start mb-6">
        <div>
          <h3 className="text-xl font-orbitron font-bold text-blue-400">{result.provider}</h3>
          <p className="text-slate-400 text-sm mt-1">{result.drawDate} | Draw {result.drawNumber}</p>
        </div>
        <img 
          src={`https://picsum.photos/seed/${result.provider}/40/40`} 
          alt={result.provider} 
          className="rounded-lg ring-1 ring-white/10"
        />
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
        <div className="flex flex-col items-center p-3 rounded-xl bg-gradient-to-br from-amber-500/20 to-transparent border border-amber-500/30">
          <span className="text-amber-500 text-[10px] font-bold uppercase mb-1">{t.prizes.first}</span>
          <span className="text-4xl font-orbitron font-bold glow-gold">{result.first}</span>
        </div>
        <div className="flex flex-col items-center p-3 rounded-xl bg-gradient-to-br from-slate-300/20 to-transparent border border-slate-300/30">
          <span className="text-slate-300 text-[10px] font-bold uppercase mb-1">{t.prizes.second}</span>
          <span className="text-3xl font-orbitron font-bold text-slate-100">{result.second}</span>
        </div>
        <div className="flex flex-col items-center p-3 rounded-xl bg-gradient-to-br from-orange-500/20 to-transparent border border-orange-500/30">
          <span className="text-orange-500 text-[10px] font-bold uppercase mb-1">{t.prizes.third}</span>
          <span className="text-3xl font-orbitron font-bold text-slate-100">{result.third}</span>
        </div>
      </div>

      <div className="mb-6">
        <h4 className="text-slate-500 text-[10px] font-bold uppercase mb-2 tracking-widest border-b border-white/5 pb-1">{t.prizes.special}</h4>
        <div className="grid grid-cols-5 gap-2">
          {result.specials.map((num, idx) => (
            <span key={idx} className="text-sm font-orbitron text-slate-300 text-center">{num}</span>
          ))}
        </div>
      </div>

      <div>
        <h4 className="text-slate-500 text-[10px] font-bold uppercase mb-2 tracking-widest border-b border-white/5 pb-1">{t.prizes.consolation}</h4>
        <div className="grid grid-cols-5 gap-2">
          {result.consolations.map((num, idx) => (
            <span key={idx} className="text-sm font-orbitron text-slate-400 text-center">{num}</span>
          ))}
        </div>
      </div>
    </div>
  );
};
