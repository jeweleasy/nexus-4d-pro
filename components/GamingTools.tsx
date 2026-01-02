
import React, { useState } from 'react';
import { ShieldAlert, CreditCard, Bell, Lock } from 'lucide-react';
import { ShadowButton } from './ShadowButton';

export const GamingTools: React.FC = () => {
  const [limit, setLimit] = useState(100);
  const [spent, setSpent] = useState(45);

  const percentage = (spent / limit) * 100;

  return (
    <div className="glass rounded-2xl p-6 border border-white/10 space-y-6">
      <div className="flex items-center justify-between">
        <h3 className="text-lg font-orbitron font-bold flex items-center gap-3">
          <ShieldAlert className="text-red-500" size={18} /> Responsible Ops
        </h3>
        <Lock className="text-slate-600" size={14} />
      </div>

      <div className="space-y-4">
        <div className="flex justify-between items-end">
          <div className="space-y-1">
            <span className="text-[10px] font-black uppercase text-slate-500 tracking-widest">Monthly Limit</span>
            <p className="text-lg font-orbitron font-bold">RM {limit}</p>
          </div>
          <button className="text-[10px] font-bold text-blue-400 underline uppercase">Edit Limit</button>
        </div>

        <div className="h-2 w-full bg-white/5 rounded-full overflow-hidden">
          <div 
            className={`h-full transition-all duration-1000 ${percentage > 80 ? 'bg-red-500' : 'bg-blue-500'}`}
            style={{ width: `${percentage}%` }}
          ></div>
        </div>

        <div className="flex justify-between text-[10px] font-black uppercase text-slate-500">
          <span>Spent: RM {spent}</span>
          <span>{percentage.toFixed(0)}% Consumed</span>
        </div>
      </div>

      <div className="grid grid-cols-2 gap-3">
        <button className="flex items-center justify-center gap-2 p-3 rounded-xl bg-white/5 border border-white/5 text-[10px] font-black uppercase text-slate-400 hover:text-white transition-all">
           <Bell size={14}/> Set Alerts
        </button>
        <button className="flex items-center justify-center gap-2 p-3 rounded-xl bg-red-600/10 border border-red-500/20 text-[10px] font-black uppercase text-red-500 hover:bg-red-600/20 transition-all">
           Self-Exclude
        </button>
      </div>

      <div className="p-3 rounded-xl bg-blue-600/5 border border-blue-500/10 text-[9px] text-slate-500 leading-relaxed italic">
        "Gaming is a form of entertainment. If it stops being fun, take a break. Nexus Pro supports your wellbeing."
      </div>
    </div>
  );
};
