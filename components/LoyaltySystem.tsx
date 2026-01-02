
import React, { useState, useEffect } from 'react';
import { Gift, Coins, Trophy, Star, Sparkles, TrendingUp } from 'lucide-react';
import { ShadowButton } from './ShadowButton';

export const LoyaltySystem: React.FC = () => {
  const [points, setPoints] = useState(() => {
    const saved = localStorage.getItem('nexus_points');
    return saved ? parseInt(saved) : 450;
  });
  const [claimed, setClaimed] = useState(false);

  useEffect(() => {
    localStorage.setItem('nexus_points', points.toString());
  }, [points]);

  const handleClaim = () => {
    setPoints(prev => prev + 50);
    setClaimed(true);
    setTimeout(() => setClaimed(false), 3000);
  };

  return (
    <div className="glass rounded-[2rem] p-6 border border-white/10 bg-gradient-to-br from-indigo-500/5 to-transparent relative overflow-hidden group">
      <div className="flex justify-between items-center mb-6">
        <h3 className="text-lg font-orbitron font-bold flex items-center gap-3">
          <Star className="text-indigo-400" size={18} /> Nexus Rewards
        </h3>
        <div className="flex items-center gap-2 px-3 py-1 bg-white/5 rounded-full border border-white/5">
          <Coins size={14} className="text-amber-400" />
          <span className="text-xs font-black font-orbitron tracking-widest">{points}</span>
        </div>
      </div>

      <div className="space-y-6">
        <div className="relative h-2 w-full bg-white/5 rounded-full overflow-hidden">
          <div 
            className="h-full bg-gradient-to-r from-indigo-500 to-blue-500 transition-all duration-1000"
            style={{ width: `${(points % 1000) / 10}%` }}
          ></div>
        </div>
        
        <div className="flex justify-between text-[10px] font-black uppercase tracking-widest text-slate-500">
          <span>Tier: Silver Member</span>
          <span>{1000 - (points % 1000)} Pts to Gold</span>
        </div>

        <div className="grid grid-cols-2 gap-3">
          <div className="p-3 rounded-xl bg-white/5 border border-white/5 flex flex-col items-center gap-2">
            <Trophy size={16} className="text-blue-400" />
            <span className="text-[9px] font-black uppercase">Daily Streak</span>
            <span className="text-xs font-bold">5 Days</span>
          </div>
          <div className="p-3 rounded-xl bg-white/5 border border-white/5 flex flex-col items-center gap-2">
            <TrendingUp size={16} className="text-green-400" />
            <span className="text-[9px] font-black uppercase">Win Bonus</span>
            <span className="text-xs font-bold">+12.5%</span>
          </div>
        </div>

        <ShadowButton 
          variant="gold" 
          disabled={claimed}
          onClick={handleClaim}
          className="w-full flex items-center justify-center gap-2"
        >
          {claimed ? (
            <><Sparkles size={16} /> REWARD COLLECTED</>
          ) : (
            <><Gift size={16} /> CLAIM DAILY BONUS</>
          )}
        </ShadowButton>
      </div>

      <div className="mt-4 p-2 bg-indigo-500/10 rounded-lg text-center">
        <p className="text-[8px] font-black uppercase text-indigo-400 tracking-widest">
          Nexus Points: Redeem for Premium access & high-res predictions
        </p>
      </div>
    </div>
  );
};
