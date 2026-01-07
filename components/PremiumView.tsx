
import React, { useState } from 'react';
import { Zap, Shield, Crown, CheckCircle, ArrowRight, Sparkles, Loader2, Clock, ShieldAlert, Fingerprint } from 'lucide-react';
import { ShadowButton } from './ShadowButton';
import { User, EliteRequest } from '../types';

interface PremiumViewProps {
  isPremium: boolean;
  currentUser: User | null;
  pendingRequests: EliteRequest[];
  onRequestUpgrade: () => void;
}

export const PremiumView: React.FC<PremiumViewProps> = ({ isPremium, currentUser, pendingRequests, onRequestUpgrade }) => {
  const [isSyncing, setIsSyncing] = useState(false);
  
  const hasPendingRequest = currentUser && pendingRequests.some(r => r.userId === currentUser.id);

  const handleUpgradeClick = () => {
    setIsSyncing(true);
    // Simulate internal processing before sending signal to parent
    setTimeout(() => {
      setIsSyncing(false);
      onRequestUpgrade();
    }, 2000);
  };

  if (isPremium) {
    return (
      <div className="max-w-4xl mx-auto py-20 text-center space-y-12 animate-in fade-in zoom-in duration-700">
         <div className="relative inline-block">
            <div className="absolute inset-0 bg-amber-500 blur-[60px] opacity-20 animate-pulse"></div>
            <Crown size={80} className="text-amber-500 mx-auto relative z-10" />
         </div>
         <div className="space-y-4">
            <h1 className="text-5xl font-orbitron font-bold">NEXUS ELITE ACTIVE</h1>
            <p className="text-slate-500 text-lg max-w-xl mx-auto font-medium">Your node is currently operating at maximum throughput. All premium features, predictions, and analytics are unlocked.</p>
         </div>
         <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
            {[
              { label: 'Subscription', value: 'Active' },
              { label: 'Tier', value: 'Platinum' },
              { label: 'Ad-Filtering', value: 'ON' },
              { label: 'Latency', value: '-30%' },
            ].map((s, i) => (
              <div key={i} className="glass p-6 rounded-3xl border border-amber-500/20">
                 <p className="text-[10px] font-black uppercase text-slate-500 tracking-widest">{s.label}</p>
                 <p className="text-lg font-orbitron font-bold text-amber-500 mt-1">{s.value}</p>
              </div>
            ))}
         </div>
         <ShadowButton variant="secondary" className="px-12 py-3">
            Manage Subscription
         </ShadowButton>
      </div>
    );
  }

  return (
    <div className="space-y-12 py-8 animate-in fade-in zoom-in duration-700">
      <div className="text-center space-y-4">
        <h1 className="text-5xl font-orbitron font-bold bg-gradient-to-r from-amber-400 via-amber-200 to-amber-500 bg-clip-text text-transparent">NEXUS ELITE</h1>
        <p className="text-slate-400 text-lg max-w-2xl mx-auto">The ultimate edge for data-driven players. Unlock advanced neural analysis and an ad-free experience.</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
        {[
          { icon: Zap, title: 'Ad-Free Flows', desc: 'Zero distractions. Focus purely on data flows and patterns with clean UI.' },
          { icon: Shield, title: 'Priority Edge Sync', desc: 'Get results delivered 30 seconds faster than standard nodes.' },
          { icon: Crown, title: 'Neural Predictor+', desc: 'Access 8-digit pattern analysis and market probability heatmaps.' },
        ].map((item, idx) => (
          <div key={idx} className="glass p-8 rounded-[2.5rem] border border-amber-500/10 hover:border-amber-500/30 transition-all flex flex-col items-center text-center space-y-4 group">
            <div className="w-16 h-16 rounded-2xl bg-amber-500/5 border border-amber-500/10 flex items-center justify-center text-amber-500 group-hover:scale-110 transition-transform">
              <item.icon size={32} />
            </div>
            <h3 className="text-xl font-bold">{item.title}</h3>
            <p className="text-slate-500 text-sm leading-relaxed">{item.desc}</p>
          </div>
        ))}
      </div>

      <div className="max-w-md mx-auto glass p-8 rounded-[3rem] border border-amber-500/30 bg-gradient-to-br from-amber-600/5 to-transparent space-y-8 relative overflow-hidden group">
        <div className="absolute -right-12 -top-12 w-40 h-40 bg-amber-500/10 blur-[50px] rounded-full pointer-events-none group-hover:bg-amber-500/20 transition-all"></div>
        
        <div className="text-center">
          <span className="text-[10px] font-black uppercase text-amber-500 tracking-widest bg-amber-500/10 px-4 py-1 rounded-full border border-amber-500/20">Elite Intelligence Plan</span>
          <div className="mt-4 flex items-baseline justify-center gap-1">
            <span className="text-5xl font-orbitron font-bold text-white tracking-tighter">$9.99</span>
            <span className="text-slate-500 text-sm font-bold">/ MONTH</span>
          </div>
          <p className="text-slate-500 text-[10px] mt-2 font-bold uppercase tracking-widest">Billed Monthly &bull; Cancel Anytime</p>
        </div>

        <ul className="space-y-4">
          {[
            'Everything in Standard Tier', 
            'Advanced Neural Pattern Discovery', 
            'Exclusive Elite Hub & Chat', 
            'Real-time Chain Verification Logs', 
            '24/7 Priority Node Support'
          ].map((f, i) => (
            <li key={i} className="flex items-center gap-3 text-sm text-slate-300">
              <CheckCircle size={16} className="text-amber-500 shrink-0" />
              {f}
            </li>
          ))}
        </ul>

        <div className="pt-2">
          {hasPendingRequest ? (
            <div className="space-y-4 animate-in slide-in-from-bottom-2 duration-500">
               <div className="p-5 rounded-[2rem] bg-amber-500/10 border border-amber-500/40 text-center space-y-3 relative overflow-hidden">
                  <div className="absolute inset-0 bg-gradient-to-t from-amber-500/5 via-transparent to-transparent animate-pulse"></div>
                  <Clock className="text-amber-500 mx-auto animate-spin-slow" size={32} />
                  <div>
                    <p className="text-xs font-black uppercase text-amber-500 tracking-widest">Awaiting Quorum Approval</p>
                    <p className="text-[9px] text-slate-500 font-bold uppercase mt-1">Activation Signal Dispatched to Admin Ops</p>
                  </div>
               </div>
               <p className="text-[8px] text-center text-slate-600 uppercase font-black leading-relaxed">
                  Your node metadata is being verified by Nexus Authority. <br/>
                  Estimated resolution: <span className="text-amber-500">2-5 Neural Minutes</span>
               </p>
            </div>
          ) : (
            <ShadowButton 
              variant="gold" 
              onClick={handleUpgradeClick}
              disabled={isSyncing}
              className="w-full py-5 flex items-center justify-center gap-3 shadow-[0_0_25px_rgba(245,158,11,0.3)] relative overflow-hidden"
            >
              {isSyncing ? (
                <>
                  <Loader2 size={20} className="animate-spin" />
                  <span className="font-orbitron tracking-widest text-xs">ENCRYPTING SIGNAL...</span>
                </>
              ) : (
                <>
                  <Fingerprint size={20} className="group-hover:rotate-12 transition-transform" />
                  <span className="font-orbitron tracking-widest text-xs uppercase font-black">REQUEST ELITE ACCESS</span>
                  <ArrowRight size={20} className="group-hover:translate-x-1 transition-transform" />
                </>
              )}
              {isSyncing && (
                 <div className="absolute inset-0 bg-white/5">
                    <div className="w-full h-0.5 bg-amber-400 absolute animate-[scan-line_1s_infinite_linear]"></div>
                 </div>
              )}
            </ShadowButton>
          )}
        </div>
        
        <div className="text-center">
           <p className="text-[8px] text-slate-600 uppercase font-black tracking-widest">Manual Admin verification required for high-throughput nodes</p>
        </div>
      </div>

      <style>{`
        .animate-spin-slow {
          animation: spin 3s linear infinite;
        }
        @keyframes spin {
          from { transform: rotate(0deg); }
          to { transform: rotate(360deg); }
        }
      `}</style>
    </div>
  );
};
