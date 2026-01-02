
import React from 'react';
import { HelpCircle, ChevronRight, Zap, Target, Shield } from 'lucide-react';

export const UserManual: React.FC = () => {
  return (
    <div className="space-y-12 animate-in fade-in slide-in-from-bottom-6 duration-700">
      <div className="space-y-4">
        <h2 className="text-4xl font-orbitron font-bold">User Manual</h2>
        <p className="text-slate-400 text-lg max-w-2xl">Master the 4D Nexus Pro intelligence platform. Learn how to interpret our data engine and ML predictions.</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        <div className="space-y-8">
          <section className="glass p-8 rounded-2xl space-y-4">
            <h3 className="text-xl font-bold flex items-center gap-2 text-blue-400">
              <Zap size={20} /> Getting Started
            </h3>
            <p className="text-slate-300 text-sm leading-relaxed">
              Upon entering the dashboard, you are presented with the latest live results aggregated from 10+ major sources. 
              The <span className="text-red-500 font-bold">LIVE</span> indicator means draw results are currently being broadcasted in real-time.
            </p>
            <div className="flex flex-col gap-3 pt-2">
              <div className="flex items-center gap-3 p-3 rounded-xl bg-white/5 border border-white/5">
                <div className="w-8 h-8 rounded-lg bg-blue-600/20 flex items-center justify-center text-blue-400 font-bold">1</div>
                <span className="text-xs text-slate-400">Select your preferred language in the sidebar.</span>
              </div>
              <div className="flex items-center gap-3 p-3 rounded-xl bg-white/5 border border-white/5">
                <div className="w-8 h-8 rounded-lg bg-blue-600/20 flex items-center justify-center text-blue-400 font-bold">2</div>
                <span className="text-xs text-slate-400">Check the countdown timer for the next sync cycle.</span>
              </div>
            </div>
          </section>

          <section className="glass p-8 rounded-2xl space-y-4">
            <h3 className="text-xl font-bold flex items-center gap-2 text-purple-400">
              <Target size={20} /> Understanding ML Predictions
            </h3>
            <p className="text-slate-300 text-sm leading-relaxed">
              Our "Nexus Intelligence Engine" uses historical pattern recognition. 
              Each number is assigned a <strong>Confidence Score</strong> based on three primary factors:
            </p>
            <ul className="space-y-3 text-xs text-slate-400">
              <li className="flex gap-2">
                <ChevronRight size={14} className="text-purple-500 shrink-0" />
                <span><strong>Frequency Weight:</strong> How often the number appears in recent 180-day cycles.</span>
              </li>
              <li className="flex gap-2">
                <ChevronRight size={14} className="text-purple-500 shrink-0" />
                <span><strong>Cycle Convergence:</strong> Historical gaps between wins for specific number groups.</span>
              </li>
              <li className="flex gap-2">
                <ChevronRight size={14} className="text-purple-500 shrink-0" />
                <span><strong>Market Sentiment:</strong> Aggregated trending data from community search patterns.</span>
              </li>
            </ul>
          </section>
        </div>

        <div className="space-y-8">
          <section className="glass p-8 rounded-2xl space-y-4">
            <h3 className="text-xl font-bold flex items-center gap-2 text-green-400">
              <Shield size={20} /> Data Reliability
            </h3>
            <p className="text-slate-300 text-sm leading-relaxed">
              We employ a "Quorum-Based" verification system. Results are only finalized once 3+ independent primary sources provide identical data points.
            </p>
            <div className="p-4 rounded-xl bg-green-500/5 border border-green-500/10 space-y-2">
              <div className="flex justify-between text-xs">
                <span className="text-green-400 font-bold uppercase tracking-widest">Verification Level</span>
                <span className="text-slate-400 italic">Tier 1: High</span>
              </div>
              <div className="h-1.5 w-full bg-slate-800 rounded-full overflow-hidden">
                <div className="h-full bg-green-500 w-[98%]"></div>
              </div>
            </div>
          </section>

          <section className="glass p-8 rounded-2xl space-y-6">
            <h3 className="text-xl font-bold flex items-center gap-2 text-amber-500">
              <HelpCircle size={20} /> FAQ
            </h3>
            <div className="space-y-4">
              <details className="group">
                <summary className="list-none flex justify-between items-center cursor-pointer p-4 rounded-xl bg-white/5 border border-white/5 hover:border-amber-500/30 transition-all">
                  <span className="text-sm font-medium">How accurate are the predictions?</span>
                  <ChevronRight size={18} className="group-open:rotate-90 transition-transform" />
                </summary>
                <div className="p-4 text-xs text-slate-400 leading-relaxed border-x border-b border-white/5 rounded-b-xl">
                  Predictions are probabilistic, not deterministic. While our engine finds patterns, lottery remains 100% random. Use predictions as an entertainment tool.
                </div>
              </details>
              <details className="group">
                <summary className="list-none flex justify-between items-center cursor-pointer p-4 rounded-xl bg-white/5 border border-white/5 hover:border-amber-500/30 transition-all">
                  <span className="text-sm font-medium">What is the "Hot Frequency" widget?</span>
                  <ChevronRight size={18} className="group-open:rotate-90 transition-transform" />
                </summary>
                <div className="p-4 text-xs text-slate-400 leading-relaxed border-x border-b border-white/5 rounded-b-xl">
                  It displays numbers that have appeared most frequently across all providers (Magnum, Toto, etc.) in the last 6 months.
                </div>
              </details>
            </div>
          </section>
        </div>
      </div>
    </div>
  );
};
