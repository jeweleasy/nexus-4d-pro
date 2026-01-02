
import React from 'react';
import { ShieldCheck, Info } from 'lucide-react';
import { LotteryProvider } from '../types';

const PROVIDERS = [
  { id: LotteryProvider.MAGNUM, name: 'Magnum 4D', color: '#fbbf24', border: 'border-amber-500/50' },
  { id: LotteryProvider.TOTO, name: 'Sports Toto', color: '#ef4444', border: 'border-red-500/50' },
  { id: LotteryProvider.DAMACAI, name: 'Da Ma Cai', color: '#3b82f6', border: 'border-blue-500/50' },
  { id: LotteryProvider.SINGAPORE, name: 'Singapore Pools', color: '#60a5fa', border: 'border-blue-400/50' },
  { id: LotteryProvider.GDLOTTO, name: 'GD Lotto', color: '#dc2626', border: 'border-red-600/50' },
  { id: LotteryProvider.PERDANA4D, name: 'Perdana 4D', color: '#a855f7', border: 'border-purple-500/50' },
  { id: LotteryProvider.SABAH88, name: 'Sabah 88', color: '#f97316', border: 'border-orange-500/50' },
  { id: LotteryProvider.STC, name: 'STC 4D', color: '#22c55e', border: 'border-green-500/50' },
  { id: LotteryProvider.SWEEP, name: 'Cash Sweep', color: '#10b981', border: 'border-emerald-500/50' },
  { id: LotteryProvider.LUCKYHARIHARI, name: 'Lucky Hari Hari', color: '#fbbf24', border: 'border-yellow-500/50' },
  { id: LotteryProvider.NEWWIN4D, name: 'NewWin 4D', color: '#3b82f6', border: 'border-blue-500/50' },
  { id: LotteryProvider.DRAGON4D, name: 'Dragon 4D', color: '#ef4444', border: 'border-red-500/50' },
  { id: LotteryProvider.KINGDOM4D, name: 'Kingdom 4D', color: '#6366f1', border: 'border-indigo-500/50' },
  { id: LotteryProvider.LUCKY4D, name: 'Lucky 4D', color: '#f59e0b', border: 'border-amber-500/50' },
  { id: LotteryProvider.PMP4D, name: 'PMP 4D', color: '#3b82f6', border: 'border-blue-500/50' },
];

interface LogoTickerProps {
  onSelectProvider: (provider: LotteryProvider) => void;
}

export const LogoTicker: React.FC<LogoTickerProps> = ({ onSelectProvider }) => {
  return (
    <div className="w-full py-6 overflow-hidden relative glass border-y border-white/5">
      <div className="absolute left-0 top-0 bottom-0 w-24 bg-gradient-to-r from-[#050505] to-transparent z-10" />
      <div className="absolute right-0 top-0 bottom-0 w-24 bg-gradient-to-l from-[#050505] to-transparent z-10" />
      
      <div className="flex items-center justify-between mb-3 px-8">
        <div className="flex items-center gap-4">
          <ShieldCheck size={14} className="text-blue-400" />
          <span className="text-[10px] font-bold uppercase tracking-[0.3em] text-slate-500">Verified Official Operators</span>
        </div>
        <div className="flex items-center gap-2 text-[10px] text-slate-600 font-bold uppercase animate-pulse">
           <Info size={12}/> Click to View Full Result
        </div>
      </div>

      <div className="flex animate-scroll hover:[animation-play-state:paused]">
        {/* First set of logos */}
        <div className="flex shrink-0 items-center gap-8 px-4">
          {PROVIDERS.map((provider, i) => (
            <button 
              key={i} 
              onClick={() => onSelectProvider(provider.id)}
              className={`flex items-center gap-3 px-5 py-2.5 rounded-xl border ${provider.border} bg-white/5 transition-all hover:bg-white/10 group cursor-pointer shadow-lg shadow-black/20 hover:-translate-y-1 active:scale-95`}
            >
              <div className="w-8 h-8 rounded-lg flex items-center justify-center font-orbitron font-black text-sm" style={{ backgroundColor: `${provider.color}20`, color: provider.color }}>
                {provider.name.charAt(0)}
              </div>
              <span className="font-orbitron font-bold text-xs whitespace-nowrap tracking-wider group-hover:text-white text-slate-300">
                {provider.name}
              </span>
            </button>
          ))}
        </div>
        {/* Duplicate for seamless scrolling */}
        <div className="flex shrink-0 items-center gap-8 px-4">
          {PROVIDERS.map((provider, i) => (
            <button 
              key={`dup-${i}`} 
              onClick={() => onSelectProvider(provider.id)}
              className={`flex items-center gap-3 px-5 py-2.5 rounded-xl border ${provider.border} bg-white/5 transition-all hover:bg-white/10 group cursor-pointer shadow-lg shadow-black/20 hover:-translate-y-1 active:scale-95`}
            >
              <div className="w-8 h-8 rounded-lg flex items-center justify-center font-orbitron font-black text-sm" style={{ backgroundColor: `${provider.color}20`, color: provider.color }}>
                {provider.name.charAt(0)}
              </div>
              <span className="font-orbitron font-bold text-xs whitespace-nowrap tracking-wider group-hover:text-white text-slate-300">
                {provider.name}
              </span>
            </button>
          ))}
        </div>
      </div>
    </div>
  );
};
