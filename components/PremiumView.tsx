
import React from 'react';
import { Zap, Shield, Crown, CheckCircle, ArrowRight } from 'lucide-react';
import { ShadowButton } from './ShadowButton';

export const PremiumView: React.FC = () => {
  return (
    <div className="space-y-12 py-8 animate-in fade-in zoom-in duration-700">
      <div className="text-center space-y-4">
        <h1 className="text-5xl font-orbitron font-bold bg-gradient-to-r from-amber-400 via-amber-200 to-amber-500 bg-clip-text text-transparent">NEXUS ELITE</h1>
        <p className="text-slate-400 text-lg max-w-2xl mx-auto">The ultimate edge for data-driven players. Unlock advanced neural analysis and an ad-free experience.</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
        {[
          { icon: Zap, title: 'Ad-Free Experience', desc: 'Zero distractions. Focus purely on data flows and patterns.' },
          { icon: Shield, title: 'Priority Data Sync', desc: 'Get results delivered 30 seconds faster than standard users.' },
          { icon: Crown, title: 'Neural Predictor+', desc: 'Access 8-digit pattern analysis and market probability heatmaps.' },
        ].map((item, idx) => (
          <div key={idx} className="glass p-8 rounded-[2.5rem] border border-amber-500/20 hover:border-amber-500/50 transition-all flex flex-col items-center text-center space-y-4">
            <div className="w-16 h-16 rounded-2xl bg-amber-500/10 flex items-center justify-center text-amber-500">
              <item.icon size={32} />
            </div>
            <h3 className="text-xl font-bold">{item.title}</h3>
            <p className="text-slate-400 text-sm leading-relaxed">{item.desc}</p>
          </div>
        ))}
      </div>

      <div className="max-w-md mx-auto glass p-8 rounded-[3rem] border border-amber-500/30 bg-gradient-to-br from-amber-500/5 to-transparent space-y-8">
        <div className="text-center">
          <span className="text-[10px] font-black uppercase text-amber-500 tracking-widest bg-amber-500/10 px-4 py-1 rounded-full">Most Popular</span>
          <div className="mt-4 flex items-baseline justify-center gap-1">
            <span className="text-4xl font-orbitron font-bold">$9.99</span>
            <span className="text-slate-500 text-sm">/ month</span>
          </div>
        </div>

        <ul className="space-y-4">
          {['Everything in Free Tier', 'Advanced Pattern Discovery', 'Exclusive Elite Community', 'Direct Data Export (CSV)', '24/7 Priority Concierge'].map((f, i) => (
            <li key={i} className="flex items-center gap-3 text-sm text-slate-300">
              <CheckCircle size={16} className="text-amber-500" />
              {f}
            </li>
          ))}
        </ul>

        <ShadowButton variant="gold" className="w-full py-4 flex items-center justify-center gap-2">
          UPGRADE NOW <ArrowRight size={18} />
        </ShadowButton>
      </div>
    </div>
  );
};
