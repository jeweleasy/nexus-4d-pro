
import React, { useState, useEffect } from 'react';
import { Flame, TrendingUp, Coins, ChevronRight, Info } from 'lucide-react';
import { LotteryProvider, JackpotData } from '../types';

export const JackpotTracker: React.FC = () => {
  const [jackpots, setJackpots] = useState<JackpotData[]>([
    { provider: LotteryProvider.MAGNUM, amount: 12450892.45, label: 'Jackpot 1', isHot: true, currency: 'RM' },
    { provider: LotteryProvider.TOTO, amount: 28410200.00, label: 'Supreme Toto 6/58', isHot: true, currency: 'RM' },
    { provider: LotteryProvider.DAMACAI, amount: 3105670.15, label: '3+3D Bonus', isHot: false, currency: 'RM' },
    { provider: LotteryProvider.GDLOTTO, amount: 145020.00, label: 'Dragon Jackpot', isHot: false, currency: 'USD' }
  ]);

  // Simulate live accumulation
  useEffect(() => {
    const timer = setInterval(() => {
      setJackpots(prev => prev.map(jp => ({
        ...jp,
        amount: jp.amount + (Math.random() * 2.5)
      })));
    }, 2000);
    return () => clearInterval(timer);
  }, []);

  const formatCurrency = (val: number, curr: string) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: curr === 'RM' ? 'MYR' : curr,
      minimumFractionDigits: 2,
    }).format(val).replace('MYR', 'RM');
  };

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 w-full">
      {jackpots.map((jp, idx) => (
        <div 
          key={idx} 
          className={`
            glass rounded-[2rem] p-5 border relative overflow-hidden transition-all duration-500
            ${jp.isHot ? 'border-amber-500/30 bg-amber-500/[0.03]' : 'border-white/5'}
            hover:border-blue-500/30 group cursor-pointer
          `}
        >
          {jp.isHot && (
            <div className="absolute -top-10 -right-10 w-24 h-24 bg-amber-500/10 blur-2xl rounded-full"></div>
          )}
          
          <div className="flex justify-between items-start mb-3">
            <div>
              <p className="text-[9px] font-black uppercase tracking-widest text-slate-500">{jp.provider}</p>
              <h4 className="text-xs font-bold text-slate-300 mt-0.5">{jp.label}</h4>
            </div>
            {jp.isHot ? (
              <Flame size={14} className="text-amber-500 animate-pulse" />
            ) : (
              <TrendingUp size={14} className="text-green-500" />
            )}
          </div>

          <div className="py-2">
            <p className="text-[9px] font-black uppercase tracking-widest text-slate-600 mb-1">Current Pool</p>
            <div className="text-xl font-orbitron font-black text-white group-hover:text-blue-400 transition-colors flex items-baseline gap-1">
              {formatCurrency(jp.amount, jp.currency)}
              <span className="w-1.5 h-1.5 rounded-full bg-green-500 animate-ping"></span>
            </div>
          </div>

          <div className="mt-4 pt-4 border-t border-white/5 flex justify-between items-center opacity-0 group-hover:opacity-100 transition-opacity">
            <span className="text-[8px] font-bold text-slate-500 uppercase tracking-[0.2em] flex items-center gap-1">
              <Info size={10} /> Probability Heat: 0.0004%
            </span>
            <ChevronRight size={14} className="text-blue-500" />
          </div>
        </div>
      ))}
    </div>
  );
};
