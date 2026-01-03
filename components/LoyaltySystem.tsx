
import React, { useState, useEffect } from 'react';
import { Gift, Coins, Trophy, Star, Sparkles, TrendingUp, Zap, Target, RefreshCw, Clock } from 'lucide-react';
import { ShadowButton } from './ShadowButton';
import { User } from '../types';

interface LoyaltySystemProps {
  currentUser: User | null;
  onUpdateUser: (updatedUser: User) => void;
}

export const LoyaltySystem: React.FC<LoyaltySystemProps> = ({ currentUser, onUpdateUser }) => {
  const [points, setPoints] = useState(() => {
    const saved = localStorage.getItem('nexus_points');
    return saved ? parseInt(saved) : 450;
  });

  const [lastClaimTime, setLastClaimTime] = useState<number>(() => {
    const saved = localStorage.getItem('nexus_last_claim');
    return saved ? parseInt(saved) : 0;
  });

  const [timeLeft, setTimeLeft] = useState<string>('');
  const [canClaimDaily, setCanClaimDaily] = useState(false);

  // Sync internal points with currentUser points if logged in
  useEffect(() => {
    if (currentUser) {
      setPoints(currentUser.points);
    }
  }, [currentUser]);

  useEffect(() => {
    localStorage.setItem('nexus_points', points.toString());
  }, [points]);

  // Handle 24-hour countdown logic
  useEffect(() => {
    const checkTime = () => {
      const now = Date.now();
      const nextAllowed = lastClaimTime + (24 * 60 * 60 * 1000);
      
      if (now >= nextAllowed) {
        setCanClaimDaily(true);
        setTimeLeft('READY');
      } else {
        setCanClaimDaily(false);
        const diff = nextAllowed - now;
        const hours = Math.floor(diff / (1000 * 60 * 60));
        const mins = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60));
        const secs = Math.floor((diff % (1000 * 60)) / 1000);
        setTimeLeft(`${hours.toString().padStart(2, '0')}:${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`);
      }
    };

    const timer = setInterval(checkTime, 1000);
    checkTime();
    return () => clearInterval(timer);
  }, [lastClaimTime]);

  const handleDailyClaim = () => {
    if (!canClaimDaily) return;

    const bonus = Math.floor(Math.random() * (19 - 6 + 1)) + 6;
    const newPoints = points + bonus;
    const now = Date.now();
    
    setPoints(newPoints);
    setLastClaimTime(now);
    localStorage.setItem('nexus_last_claim', now.toString());

    if (currentUser) {
      onUpdateUser({ ...currentUser, points: newPoints });
    }
  };

  const handleNexusFrequencyPulse = () => {
    if (!currentUser) return;
    if (points < 9) {
      alert("Insufficient points for Frequency Pulse. Required: 9 Pts");
      return;
    }

    // Spend 9 points to get a random 6-19 points bonus (Repeatable for members)
    const bonus = Math.floor(Math.random() * (19 - 6 + 1)) + 6;
    const newPoints = points - 9 + bonus;
    setPoints(newPoints);
    
    const updatedUser = { 
      ...currentUser, 
      points: newPoints
    };
    
    onUpdateUser(updatedUser);
    alert(`Nexus Pulse Successful: Frequency Shifted. Neural Entropy stabilized: -9 Pts. Pulse Reward: +${bonus} Pts.`);
  };

  return (
    <div className="glass rounded-[2rem] p-6 border border-white/10 bg-gradient-to-br from-indigo-500/5 to-transparent relative overflow-hidden group">
      <div className="flex justify-between items-center mb-6">
        <h3 className="text-lg font-orbitron font-bold flex items-center gap-3">
          <Star className="text-indigo-400" size={18} /> Nexus Ledger
        </h3>
        <div className="flex items-center gap-2 px-3 py-1 bg-white/5 rounded-full border border-white/5">
          <Coins size={14} className="text-amber-400" />
          <span className="text-xs font-black font-orbitron tracking-widest">{points}</span>
        </div>
      </div>

      <div className="space-y-4">
        {/* Daily Bonus Section - Available for Everyone, 1x per 24h */}
        <div className="p-4 rounded-2xl bg-white/5 border border-white/5 space-y-3">
          <div className="flex justify-between items-center">
             <span className="text-[9px] font-black uppercase text-slate-500 tracking-[0.2em]">Daily Synapse</span>
             <div className="flex items-center gap-1.5 text-[9px] font-black text-blue-400">
               <Clock size={10} />
               {timeLeft}
             </div>
          </div>
          <ShadowButton 
            variant="primary" 
            disabled={!canClaimDaily}
            onClick={handleDailyClaim}
            className="w-full flex items-center justify-center gap-2 py-2 text-[10px]"
          >
            {canClaimDaily ? (
              <><Gift size={14} /> CLAIM BONUS (6-19 PTS)</>
            ) : (
              <><RefreshCw size={14} className="animate-spin" /> LOCKED ({timeLeft})</>
            )}
          </ShadowButton>
        </div>

        {/* Registered Member Only Section - Repeatable 9-point pulse */}
        {currentUser ? (
          <div className="p-4 rounded-2xl border bg-amber-500/5 border-amber-500/20 space-y-3">
            <div className="flex justify-between items-center">
               <span className="text-[9px] font-black uppercase text-amber-500 tracking-[0.2em]">Frequency Pulse</span>
               <span className="text-[8px] text-amber-500/60 font-bold">MEMBER EXCLUSIVE</span>
            </div>
            
            <p className="text-[8px] text-slate-400 leading-tight italic">
              Members can pulse multiple times. <span className="text-amber-500">Cost: 9 Pts</span> per activation. Earn 6-19 Pts in return.
            </p>

            <ShadowButton 
              variant="gold" 
              onClick={handleNexusFrequencyPulse}
              disabled={points < 9}
              className="w-full text-[10px] py-2 flex items-center justify-center gap-2"
            >
              <Zap size={14} /> PULSE FOR 9 PTS
            </ShadowButton>
          </div>
        ) : (
          <div className="p-4 rounded-2xl bg-slate-900/40 border border-white/5 text-center">
            <p className="text-[9px] text-slate-600 font-bold uppercase tracking-widest">
              Register for Multiple Pulse Rewards
            </p>
          </div>
        )}

        <div className="relative h-1 w-full bg-white/5 rounded-full overflow-hidden">
          <div 
            className="h-full bg-gradient-to-r from-indigo-500 to-blue-500 transition-all duration-1000"
            style={{ width: `${(points % 1000) / 10}%` }}
          ></div>
        </div>
      </div>

      <div className="mt-4 p-2 bg-indigo-500/10 rounded-lg text-center">
        <p className="text-[8px] font-black uppercase text-indigo-400 tracking-widest">
          Nexus Points: Stabilize your prediction matrix
        </p>
      </div>
    </div>
  );
};
