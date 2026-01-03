
import React from 'react';
import { Trophy, Medal, Star, TrendingUp, Target, Users, ShieldCheck } from 'lucide-react';
import { MOCK_LEADERBOARD } from '../constants';

export const RankingSystem: React.FC = () => {
  return (
    <div className="space-y-12 animate-in fade-in slide-in-from-bottom-6 duration-700">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
          <h2 className="text-3xl font-orbitron font-bold flex items-center gap-3">
            <div className="nexus-line nexus-line-amber"></div>
            Nexus Oracle Rankings
          </h2>
          <p className="text-slate-400 text-sm mt-1">Global leaderboard for algorithmic prediction accuracy</p>
        </div>
        <div className="flex items-center gap-2 px-4 py-2 rounded-xl bg-blue-600/10 border border-blue-500/20 text-blue-400">
          <Users size={18} />
          <span className="text-xs font-bold font-orbitron">ACTIVE NODES: 2,492</span>
        </div>
      </div>

      {/* Top 3 Podium */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-8 items-end max-w-5xl mx-auto pt-10">
        {/* Silver - 2nd Place */}
        <div className="order-2 md:order-1 glass p-8 rounded-[2rem] border border-slate-300 dark:border-white/5 flex flex-col items-center text-center space-y-4 relative group hover:-translate-y-2 transition-transform h-[320px] justify-end">
           <div className="absolute -top-10 flex flex-col items-center">
              <div className="w-20 h-20 rounded-full border-4 border-slate-300 bg-slate-100 dark:bg-slate-800 p-1">
                 <img src={`https://picsum.photos/seed/podium2/80/80`} className="w-full h-full rounded-full object-cover" alt="2nd" />
              </div>
              <div className="w-8 h-8 rounded-full bg-slate-300 text-slate-800 font-black flex items-center justify-center -mt-4 shadow-lg">2</div>
           </div>
           <h3 className="font-orbitron font-bold text-xl">{MOCK_LEADERBOARD[1].username}</h3>
           <p className="text-xs font-black uppercase text-slate-500 tracking-widest">{MOCK_LEADERBOARD[1].badge}</p>
           <div className="flex items-center gap-4 pt-4 w-full">
              <div className="flex-1 text-center">
                 <p className="text-[10px] text-slate-500 font-bold uppercase">Accuracy</p>
                 <p className="text-lg font-orbitron font-bold text-blue-500">{MOCK_LEADERBOARD[1].accuracy}%</p>
              </div>
           </div>
        </div>

        {/* Gold - 1st Place */}
        <div className="order-1 md:order-2 glass p-10 rounded-[2.5rem] border border-amber-500/30 flex flex-col items-center text-center space-y-4 relative group hover:-translate-y-4 transition-transform h-[400px] justify-end bg-gradient-to-t from-amber-500/10 to-transparent">
           <div className="absolute -top-14 flex flex-col items-center">
              <div className="relative">
                <div className="absolute inset-0 bg-amber-500 blur-2xl opacity-20 animate-pulse"></div>
                <div className="w-28 h-28 rounded-full border-4 border-amber-500 bg-amber-50/10 p-1 relative z-10">
                   <img src={`https://picsum.photos/seed/podium1/112/112`} className="w-full h-full rounded-full object-cover" alt="1st" />
                </div>
                <div className="absolute -top-6 left-1/2 -translate-x-1/2">
                   <Medal size={40} className="text-amber-500 fill-amber-500 animate-bounce" />
                </div>
              </div>
              <div className="w-10 h-10 rounded-full bg-amber-500 text-black font-black flex items-center justify-center -mt-4 shadow-lg z-20">1</div>
           </div>
           <h3 className="font-orbitron font-black text-2xl text-white flex items-center gap-2">
              {MOCK_LEADERBOARD[0].username}
              <ShieldCheck className="text-blue-500" size={20} />
           </h3>
           <p className="text-[10px] font-black uppercase text-amber-500 tracking-[0.4em]">{MOCK_LEADERBOARD[0].badge}</p>
           <div className="flex items-center gap-8 pt-4 w-full border-t border-white/10 mt-4">
              <div className="flex-1 text-center">
                 <p className="text-[10px] text-slate-500 font-bold uppercase">Accuracy</p>
                 <p className="text-2xl font-orbitron font-bold text-amber-500">{MOCK_LEADERBOARD[0].accuracy}%</p>
              </div>
              <div className="flex-1 text-center">
                 <p className="text-[10px] text-slate-500 font-bold uppercase">Nexus Pts</p>
                 <p className="text-2xl font-orbitron font-bold text-white">{MOCK_LEADERBOARD[0].points}</p>
              </div>
           </div>
        </div>

        {/* Bronze - 3rd Place */}
        <div className="order-3 md:order-3 glass p-8 rounded-[2rem] border border-orange-500/20 flex flex-col items-center text-center space-y-4 relative group hover:-translate-y-2 transition-transform h-[280px] justify-end">
           <div className="absolute -top-10 flex flex-col items-center">
              <div className="w-20 h-20 rounded-full border-4 border-orange-500/50 bg-slate-100 dark:bg-slate-800 p-1">
                 <img src={`https://picsum.photos/seed/podium3/80/80`} className="w-full h-full rounded-full object-cover" alt="3rd" />
              </div>
              <div className="w-8 h-8 rounded-full bg-orange-500/50 text-white font-black flex items-center justify-center -mt-4 shadow-lg">3</div>
           </div>
           <h3 className="font-orbitron font-bold text-xl">{MOCK_LEADERBOARD[2].username}</h3>
           <p className="text-xs font-black uppercase text-slate-500 tracking-widest">{MOCK_LEADERBOARD[2].badge}</p>
           <div className="flex items-center gap-4 pt-4 w-full">
              <div className="flex-1 text-center">
                 <p className="text-[10px] text-slate-500 font-bold uppercase">Accuracy</p>
                 <p className="text-lg font-orbitron font-bold text-orange-400">{MOCK_LEADERBOARD[2].accuracy}%</p>
              </div>
           </div>
        </div>
      </div>

      {/* Main Ranking Table */}
      <div className="glass rounded-[2.5rem] p-8 border border-white/5 overflow-hidden">
        <div className="flex justify-between items-center mb-8">
           <h3 className="text-xl font-orbitron font-bold flex items-center gap-3">
             <Trophy className="text-blue-500" size={24} />
             Predictor Pool
           </h3>
           <div className="flex items-center gap-4">
              <div className="relative">
                 <input type="text" placeholder="Search user..." className="bg-white/5 border border-white/10 rounded-xl px-4 py-2 text-xs focus:outline-none focus:border-blue-500/50 w-48" />
              </div>
           </div>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left">
            <thead>
              <tr className="text-[10px] font-black uppercase text-slate-500 border-b border-white/5 pb-4">
                <th className="pb-4 px-4">Rank</th>
                <th className="pb-4">User Node</th>
                <th className="pb-4">Badge</th>
                <th className="pb-4">Avg Accuracy</th>
                <th className="pb-4">Total Points</th>
                <th className="pb-4 text-right">Trend</th>
              </tr>
            </thead>
            <tbody className="text-sm">
              {MOCK_LEADERBOARD.slice(3).map((user) => (
                <tr key={user.rank} className="border-b border-white/5 hover:bg-white/5 transition-colors group">
                  <td className="py-6 px-4 font-orbitron font-bold text-slate-500 group-hover:text-white">#{user.rank}</td>
                  <td className="py-6">
                    <div className="flex items-center gap-3">
                       <img src={`https://picsum.photos/seed/u${user.rank}/40/40`} className="w-10 h-10 rounded-xl border border-white/10" alt={user.username} />
                       <span className="font-bold text-slate-200">{user.username}</span>
                    </div>
                  </td>
                  <td className="py-6">
                    <span className="text-[10px] font-black uppercase tracking-widest text-blue-400 bg-blue-500/10 px-3 py-1 rounded-full border border-blue-500/20">
                      {user.badge}
                    </span>
                  </td>
                  <td className="py-6">
                    <div className="flex flex-col gap-1">
                       <span className="font-bold text-slate-100">{user.accuracy}%</span>
                       <div className="w-24 h-1 bg-white/5 rounded-full overflow-hidden">
                          <div className="h-full bg-blue-500" style={{ width: `${user.accuracy}%` }}></div>
                       </div>
                    </div>
                  </td>
                  <td className="py-6 font-mono font-bold text-slate-300">{user.points.toLocaleString()}</td>
                  <td className="py-6 text-right px-4">
                    <div className="flex items-center justify-end gap-1 text-green-500 font-bold text-xs">
                      <TrendingUp size={14} />
                      +4
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Challenges Section */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        <div className="glass p-8 rounded-[2rem] border border-blue-500/20 bg-gradient-to-br from-blue-600/5 to-transparent space-y-6">
           <h3 className="text-xl font-orbitron font-bold flex items-center gap-3">
              <Target size={24} className="text-blue-400" />
              Active Weekly Challenges
           </h3>
           <div className="space-y-4">
              <div className="p-5 rounded-2xl bg-white/5 border border-white/10 flex justify-between items-center group cursor-pointer hover:border-blue-500/50">
                 <div>
                    <h4 className="text-sm font-bold text-white">The "Exact" Strike</h4>
                    <p className="text-xs text-slate-500">Predict any 4D first prize exactly in 7 days.</p>
                 </div>
                 <div className="text-right">
                    <p className="text-[10px] font-black text-amber-500 uppercase">Reward</p>
                    <p className="text-xs font-bold font-orbitron">500 Pts</p>
                 </div>
              </div>
              <div className="p-5 rounded-2xl bg-white/5 border border-white/10 flex justify-between items-center group cursor-pointer hover:border-blue-500/50">
                 <div>
                    <h4 className="text-sm font-bold text-white">Chain Verification Marathon</h4>
                    <p className="text-xs text-slate-500">Verify 50 draw results via Nexus Chain.</p>
                 </div>
                 <div className="text-right">
                    <p className="text-[10px] font-black text-amber-500 uppercase">Reward</p>
                    <p className="text-xs font-bold font-orbitron">200 Pts</p>
                 </div>
              </div>
           </div>
        </div>

        <div className="glass p-8 rounded-[2rem] border border-purple-500/20 space-y-6 flex flex-col items-center text-center justify-center">
           <div className="p-4 rounded-3xl bg-purple-500/10 text-purple-400 mb-2">
              <Star size={40} className="animate-spin-slow" />
           </div>
           <h3 className="text-xl font-orbitron font-bold text-white">Elite Node Access</h3>
           <p className="text-slate-400 text-sm max-w-sm">Reach "Grandmaster" rank to unlock priority node synchronization and direct access to neural cluster weights.</p>
           <button className="px-8 py-3 rounded-xl bg-purple-600 text-white font-black text-[10px] uppercase tracking-[0.2em] shadow-lg shadow-purple-500/20 hover:scale-105 transition-all">
             View Rank Perks
           </button>
        </div>
      </div>

      <style>{`
        .animate-spin-slow {
          animation: spin 8s linear infinite;
        }
        @keyframes spin {
          from { transform: rotate(0deg); }
          to { transform: rotate(360deg); }
        }
      `}</style>
    </div>
  );
};
