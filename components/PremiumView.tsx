
import React, { useState } from 'react';
import { Zap, Shield, Crown, CheckCircle, ArrowRight, Sparkles, Loader2 } from 'lucide-react';
import { ShadowButton } from './ShadowButton';

interface PremiumViewProps {
  isPremium: boolean;
  onUpgrade: () => void;
}

export const PremiumView: React.FC<PremiumViewProps> = ({ isPremium, onUpgrade }) => {
  const [loading, setLoading] = useState(false);

  const handleUpgrade = () => {
    setLoading(true);
    // Simulate payment processing
    setTimeout(() => {
      setLoading(false);
      onUpgrade();
    }, 2500);
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
          { icon: Shield, title: 'Priority Edge Sync', desc: 'Get results delivered 30 seconds faster than standard standard nodes.' },
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

      <div className="max-w-md mx-auto glass p-8 rounded-[3rem] border border-amber-500/30 bg-gradient-to-br from-amber-500/5 to-transparent space-y-8 relative overflow-hidden">
        <div className="absolute -right-12 -top-12 w-40 h-40 bg-amber-500/10 blur-[50px] rounded-full pointer-events-none"></div>
        
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

        <ShadowButton 
          variant="gold" 
          onClick={handleUpgrade}
          disabled={loading}
          className="w-full py-5 flex items-center justify-center gap-3 shadow-[0_0_20px_rgba(245,158,11,0.2)]"
        >
          {loading ? (
             <>
               <Loader2 size={20} className="animate-spin" />
               SECURE PROCESSING...
             </>
          ) : (
             <>
               UPGRADE NOW <ArrowRight size={20} />
             </>
          )}
        </ShadowButton>
        
        <div className="text-center">
           <p className="text-[8px] text-slate-600 uppercase font-black tracking-widest">Secure Checkout Powered by Nexus Pay</p>
        </div>
      </div>
    </div>
  );
};
