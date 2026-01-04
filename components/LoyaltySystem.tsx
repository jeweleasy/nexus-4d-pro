
import React, { useState, useEffect } from 'react';
import { Gift, Coins, Trophy, Star, Sparkles, TrendingUp, Zap, Target, RefreshCw, Clock, Crown, MessageSquare, ArrowUpRight, Loader2, ShieldCheck, Activity } from 'lucide-react';
import { ShadowButton } from './ShadowButton';
import { User } from '../types';

interface LoyaltySystemProps {
  currentUser: User | null;
  onUpdateUser: (updatedUser: User) => void;
}

export const LoyaltySystem: React.FC<LoyaltySystemProps> = ({ currentUser, onUpdateUser }) => {
  const [activeTab, setActiveTab] = useState<'daily' | 'redeem'>('daily');
  const [isClaiming, setIsClaiming] = useState(false);
  const [claimProgress, setClaimProgress] = useState(0);
  const [claimCountdown, setClaimCountdown] = useState(21);
  
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

  useEffect(() => {
    if (currentUser) {
      setPoints(currentUser.points);
    }
  }, [currentUser]);

  useEffect(() => {
    localStorage.setItem('nexus_points', points.toString());
  }, [points]);

  // Daily Timer logic
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

  // Claim process effect (21 seconds)
  useEffect(() => {
    let interval: any;
    if (isClaiming) {
      interval = setInterval(() => {
        setClaimCountdown((prev) => {
          if (prev <= 1) {
            finalizeClaim();
            return 0;
          }
          return prev - 1;
        });
        setClaimProgress((prev) => Math.min(100, prev + (100 / 21)));
      }, 1000);
    }
    return () => clearInterval(interval);
  }, [isClaiming]);

  const handleStartClaim = () => {
    if (!canClaimDaily || isClaiming) return;
    setIsClaiming(true);
    setClaimCountdown(21);
    setClaimProgress(0);
  };

  const finalizeClaim = () => {
    const bonus = Math.floor(Math.random() * (19 - 6 + 1)) + 6;
    const newPoints = points + bonus;
    const now = Date.now();
    
    setPoints(newPoints);
    setLastClaimTime(now);
    localStorage.setItem('nexus_last_claim', now.toString());
    
    if (currentUser) {
      onUpdateUser({ ...currentUser, points: newPoints });
    }
    
    setIsClaiming(false);
    setClaimProgress(0);
  };

  const handleNexusFrequencyPulse = () => {
    if (!currentUser) return;
    if (points < 9) {
      alert("Insufficient points for Frequency Pulse. Required: 9 Pts");
      return;
    }
    const bonus = Math.floor(Math.random() * (19 - 6 + 1)) + 6;
    const newPoints = points - 9 + bonus;
    setPoints(newPoints);
    onUpdateUser({ ...currentUser, points: newPoints });
  };

  const redeemReward = (cost: number, label: string) => {
    if (!currentUser) {
      alert("Register to redeem rewards.");
      return;
    }
    if (points < cost) {
      alert(`Insufficient points for ${label}.`);
      return;
    }
    const newPoints = points - cost;
    setPoints(newPoints);
    onUpdateUser({ ...currentUser, points: newPoints });
    alert(`Reward Activated: ${label}! Benefit applied to your node.`);
  };

  const REWARDS = [
    { icon: Crown, label: "Algorithm Boost", desc: "Unlock 8-digit precision for 1 hour", cost: 150 },
    { icon: MessageSquare, label: "Community Glow", desc: "Gold username in chat for 24h", cost: 75 },
    { icon: Zap, label: "Priority Sync", desc: "Instant result transmission for 1 cycle", cost: 50 },
  ];

  return (
    <div className="glass rounded-[2rem] p-6 border border-white/10 bg-gradient-to-br from-indigo-500/5 to-transparent relative overflow-hidden group">
      <div className="flex justify-between items-center mb-6">
        <div className="flex gap-4">
           <button 
             onClick={() => setActiveTab('daily')}
             className={`text-[10px] font-black uppercase tracking-widest pb-1 transition-all ${activeTab === 'daily' ? 'text-white border-b-2 border-blue-500' : 'text-slate-500 hover:text-slate-300'}`}
           >
             Ledger
           </button>
           <button 
             onClick={() => setActiveTab('redeem')}
             className={`text-[10px] font-black uppercase tracking-widest pb-1 transition-all ${activeTab === 'redeem' ? 'text-white border-b-2 border-amber-500' : 'text-slate-500 hover:text-slate-300'}`}
           >
             Redeem
           </button>
        </div>
        <div className="flex items-center gap-2 px-3 py-1 bg-white/5 rounded-full border border-white/5">
          <Coins size={14} className="text-amber-400" />
          <span className="text-xs font-black font-orbitron tracking-widest">{points}</span>
        </div>
      </div>

      {activeTab === 'daily' ? (
        <div className="space-y-4 animate-in fade-in duration-300">
          <div className="p-4 rounded-2xl bg-white/5 border border-white/5 space-y-3 relative overflow-hidden">
            {isClaiming && (
              <div className="absolute inset-0 bg-blue-600/10 z-0 animate-pulse"></div>
            )}
            
            <div className="flex justify-between items-center relative z-10">
               <span className="text-[9px] font-black uppercase text-slate-500 tracking-[0.2em]">
                 {isClaiming ? 'Extracting Points...' : 'Daily Synapse'}
               </span>
               <div className="flex items-center gap-1.5 text-[9px] font-black text-blue-400">
                 <Clock size={10} />
                 {isClaiming ? `${claimCountdown}S` : timeLeft}
               </div>
            </div>

            {isClaiming ? (
              <div className="space-y-3 relative z-10 animate-in fade-in zoom-in duration-300">
                <div className="flex flex-col items-center justify-center py-2 space-y-3">
                   <div className="relative">
                      <RefreshCw size={32} className="text-blue-500 animate-spin" />
                      <Activity size={14} className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 text-white animate-pulse" />
                   </div>
                   <p className="text-[10px] font-bold text-blue-300 tracking-widest">QUANTUM VERIFICATION IN PROGRESS</p>
                </div>
                <div className="h-2 w-full bg-black/40 rounded-full overflow-hidden border border-white/5">
                   <div 
                     className="h-full bg-gradient-to-r from-blue-600 to-indigo-400 transition-all duration-1000 ease-linear shadow-[0_0_10px_rgba(59,130,246,0.5)]"
                     style={{ width: `${claimProgress}%` }}
                   ></div>
                </div>
                <button disabled className="w-full py-2 bg-white/5 border border-white/10 rounded-lg text-[9px] font-black text-slate-500 uppercase tracking-widest cursor-wait">
                   Synchronizing Node...
                </button>
              </div>
            ) : (
              <ShadowButton 
                variant="primary" 
                disabled={!canClaimDaily}
                onClick={handleStartClaim}
                className="w-full flex items-center justify-center gap-2 py-2 text-[10px] relative z-10 group"
              >
                {canClaimDaily ? (
                  <>
                    <Gift size={14} className="group-hover:scale-110 transition-transform" /> 
                    CLAIM BONUS (6-19 PTS)
                  </>
                ) : (
                  <>
                    <RefreshCw size={14} className="animate-spin" /> 
                    LOCKED ({timeLeft})
                  </>
                )}
              </ShadowButton>
            )}
          </div>

          {currentUser ? (
            <div className="p-4 rounded-2xl border bg-amber-500/5 border-amber-500/20 space-y-3">
              <div className="flex justify-between items-center">
                 <span className="text-[9px] font-black uppercase text-amber-500 tracking-[0.2em]">Frequency Pulse</span>
                 <span className="text-[8px] text-amber-500/60 font-bold">MEMBER ONLY</span>
              </div>
              <p className="text-[8px] text-slate-400 leading-tight italic">
                Repeatedly pulse for 9 Pts to shift entropy. Reward: 6-19 Pts.
              </p>
              <ShadowButton 
                variant="gold" 
                onClick={handleNexusFrequencyPulse}
                disabled={points < 9 || isClaiming}
                className="w-full text-[10px] py-2 flex items-center justify-center gap-2"
              >
                <Zap size={14} /> PULSE FOR 9 PTS
              </ShadowButton>
            </div>
          ) : (
            <div className="p-4 rounded-2xl bg-slate-900/40 border border-white/5 text-center">
              <p className="text-[9px] text-slate-600 font-bold uppercase tracking-widest">
                Register for Pulse Rewards
              </p>
            </div>
          )}
        </div>
      ) : (
        <div className="space-y-3 animate-in slide-in-from-right-4 duration-300">
           {REWARDS.map((reward, i) => (
             <button 
               key={i}
               onClick={() => redeemReward(reward.cost, reward.label)}
               disabled={points < reward.cost || isClaiming}
               className={`w-full text-left p-3 rounded-2xl border flex items-center gap-4 group transition-all ${
                 points >= reward.cost && !isClaiming
                 ? 'bg-white/5 border-white/10 hover:border-amber-500/50' 
                 : 'bg-black/20 border-white/5 opacity-50 grayscale'
               }`}
             >
               <div className={`p-2.5 rounded-xl ${points >= reward.cost ? 'bg-amber-500/10 text-amber-500' : 'bg-slate-800 text-slate-600'}`}>
                 <reward.icon size={18} />
               </div>
               <div className="flex-1">
                 <div className="flex justify-between items-center">
                   <p className="text-[10px] font-black text-slate-300 uppercase">{reward.label}</p>
                   <p className="text-[9px] font-bold text-amber-500 font-orbitron">{reward.cost} Pts</p>
                 </div>
                 <p className="text-[8px] text-slate-500 mt-0.5">{reward.desc}</p>
               </div>
               <ArrowUpRight size={12} className="text-slate-700 group-hover:text-amber-500" />
             </button>
           ))}
        </div>
      )}

      <div className="mt-6 relative h-1 w-full bg-white/5 rounded-full overflow-hidden">
        <div 
          className="h-full bg-gradient-to-r from-indigo-500 to-blue-500 transition-all duration-1000"
          style={{ width: `${(points % 1000) / 10}%` }}
        ></div>
      </div>
    </div>
  );
};
