
import React, { useState, useEffect, useMemo } from 'react';
import { 
  Target, 
  Plus, 
  Trash2, 
  Bell, 
  ShieldAlert, 
  Hash, 
  Filter, 
  CheckCircle2, 
  Sparkles, 
  Trophy, 
  Search, 
  Clock, 
  Calendar,
  ExternalLink,
  Zap,
  X,
  // Added ShieldCheck to the imports to fix the reference error on line 154
  ShieldCheck
} from 'lucide-react';
import { LotteryProvider, LotteryResult } from '../types';
import { ShadowButton } from './ShadowButton';
import { MOCK_RESULTS } from '../constants';

interface WatchedNumber {
  id: string;
  number: string;
  provider: LotteryProvider | 'All';
  timestamp: number;
  addedAt: string; // "YYYY-MM-DD HH:MM:SS"
}

interface PersonalWatchlistProps {
  isLoggedIn: boolean;
  onGuestAttempt: () => void;
  onMatch: (result: LotteryResult, matchedNum: string) => void;
}

export const PersonalWatchlist: React.FC<PersonalWatchlistProps> = ({ isLoggedIn, onGuestAttempt, onMatch }) => {
  const [watchedNumbers, setWatchedNumbers] = useState<WatchedNumber[]>(() => {
    try {
      const saved = localStorage.getItem('nexus_watchlist');
      return saved ? JSON.parse(saved) : [];
    } catch (e) {
      return [];
    }
  });

  const [inputNum, setInputNum] = useState('');
  const [selectedProvider, setSelectedProvider] = useState<LotteryProvider | 'All'>('All');
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedHistory, setSelectedHistory] = useState<{ number: string; result: LotteryResult | null; addedAt: string } | null>(null);

  const saveWatchlist = (list: WatchedNumber[]) => {
    setWatchedNumbers(list);
    localStorage.setItem('nexus_watchlist', JSON.stringify(list));
  };

  const handleAdd = () => {
    if (!isLoggedIn) {
      onGuestAttempt();
      return;
    }
    if (inputNum.length !== 4) return;

    const now = new Date();
    const formattedDate = `${now.getFullYear()}-${(now.getMonth() + 1).toString().padStart(2, '0')}-${now.getDate().toString().padStart(2, '0')} ${now.getHours().toString().padStart(2, '0')}:${now.getMinutes().toString().padStart(2, '0')}:${now.getSeconds().toString().padStart(2, '0')}`;

    const newEntry: WatchedNumber = {
      id: Math.random().toString(36).substring(2, 9),
      number: inputNum,
      provider: selectedProvider,
      timestamp: Date.now(),
      addedAt: formattedDate
    };

    const newList = [newEntry, ...watchedNumbers];
    saveWatchlist(newList);
    setInputNum('');
    checkMatches(newEntry);
  };

  const removeNumber = (id: string) => {
    const newList = watchedNumbers.filter(n => n.id !== id);
    saveWatchlist(newList);
    if (selectedHistory && watchedNumbers.find(n => n.id === id)?.number === selectedHistory.number) {
        setSelectedHistory(null);
    }
  };

  const checkMatches = (entry: WatchedNumber) => {
    const match = MOCK_RESULTS.find(res => {
      const providerMatch = entry.provider === 'All' || res.provider === entry.provider;
      if (!providerMatch) return false;

      const num = entry.number;
      return res.first === num || 
             res.second === num || 
             res.third === num || 
             res.specials?.includes(num) || 
             res.consolations?.includes(num);
    });

    if (match) {
      onMatch(match, entry.number);
    }
  };

  const filteredWatchlist = useMemo(() => {
    if (!searchQuery.trim()) return watchedNumbers;
    return watchedNumbers.filter(n => n.number.includes(searchQuery));
  }, [watchedNumbers, searchQuery]);

  // When searching, if there's exactly one match, show it in the side box automatically
  useEffect(() => {
    if (searchQuery.length === 4) {
      const found = watchedNumbers.find(n => n.number === searchQuery);
      if (found) {
        handleInspectNumber(found);
      }
    }
  }, [searchQuery]);

  const handleInspectNumber = (entry: WatchedNumber) => {
    const match = MOCK_RESULTS.find(res => {
      const providerMatch = entry.provider === 'All' || res.provider === entry.provider;
      if (!providerMatch) return false;
      const num = entry.number;
      return res.first === num || res.second === num || res.third === num || res.specials?.includes(num) || res.consolations?.includes(num);
    });

    setSelectedHistory({
      number: entry.number,
      addedAt: entry.addedAt,
      result: match || null
    });
  };

  // Requirement: "when user login then show personal nodes, otherwise dont show"
  if (!isLoggedIn) return null;

  return (
    <div className="flex flex-col lg:flex-row gap-6 animate-in fade-in duration-500">
      {/* Main Watchlist Control */}
      <div className="flex-1 glass rounded-[2rem] p-6 border border-white/10 space-y-6 relative overflow-hidden group shadow-2xl">
        <div className="absolute -top-10 -right-10 w-24 h-24 bg-blue-500/10 blur-2xl rounded-full"></div>
        
        <div className="flex justify-between items-center">
          <h3 className="text-lg font-orbitron font-bold flex items-center gap-3">
            <Target className="text-blue-500" size={20} />
            Personal Nodes
          </h3>
          <div className="flex items-center gap-1.5 px-2 py-1 bg-green-500/10 rounded-lg border border-green-500/20">
            <ShieldCheck size={12} className="text-green-500" />
            <span className="text-[8px] font-black text-green-500 uppercase tracking-tighter">Secure Vault</span>
          </div>
        </div>

        <div className="space-y-4">
          {/* Add Section */}
          <div className="p-4 rounded-2xl bg-white/5 border border-white/5 space-y-3">
            <p className="text-[9px] font-black uppercase text-slate-500 tracking-widest px-1">Commit New Entry</p>
            <div className="flex flex-col sm:flex-row gap-3">
              <div className="relative flex-1">
                <input 
                  type="text" 
                  maxLength={4}
                  placeholder="4D Number..."
                  value={inputNum}
                  onChange={(e) => setInputNum(e.target.value.replace(/\D/g, ''))}
                  className="w-full bg-black/40 border border-white/10 rounded-xl px-10 py-3.5 text-sm font-orbitron tracking-widest focus:outline-none focus:border-blue-500/50 transition-all text-white"
                />
                <Hash size={16} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-600" />
              </div>

              <div className="relative flex-1">
                <select 
                  value={selectedProvider}
                  onChange={(e) => setSelectedProvider(e.target.value as any)}
                  className="w-full h-full bg-black/40 border border-white/10 rounded-xl px-10 py-3.5 text-[10px] font-black uppercase appearance-none focus:outline-none focus:border-blue-500/50 cursor-pointer text-slate-300"
                >
                  <option value="All">All Operators</option>
                  {Object.values(LotteryProvider).map(p => (
                    <option key={p} value={p}>{p}</option>
                  ))}
                </select>
                <Filter size={16} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-600" />
              </div>
            </div>
            <ShadowButton 
              onClick={handleAdd}
              variant="primary"
              disabled={inputNum.length !== 4}
              className="w-full py-3 text-[10px] font-black uppercase tracking-widest flex items-center justify-center gap-2"
            >
              <Plus size={14} /> Register Signature
            </ShadowButton>
          </div>

          {/* Search Section */}
          <div className="relative">
            <input 
              type="text" 
              placeholder="Search Saved Nodes..." 
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value.replace(/\D/g, ''))}
              className="w-full bg-black/60 border border-blue-500/20 rounded-xl px-12 py-3.5 text-[10px] font-black uppercase tracking-[0.2em] focus:outline-none focus:border-blue-500/50 transition-all text-blue-400 placeholder:text-blue-900 shadow-[inset_0_0_15px_rgba(59,130,246,0.1)]"
            />
            <Search size={18} className="absolute left-4 top-1/2 -translate-y-1/2 text-blue-900" />
            {searchQuery && (
                <button onClick={() => setSearchQuery('')} className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-600 hover:text-white">
                    <X size={16} />
                </button>
            )}
          </div>

          {/* List Section */}
          <div className="space-y-2 max-h-[300px] overflow-y-auto custom-scrollbar pr-2">
            {filteredWatchlist.length > 0 ? (
              filteredWatchlist.map((entry) => (
                <div 
                  key={entry.id} 
                  onClick={() => handleInspectNumber(entry)}
                  className={`p-3 rounded-2xl border transition-all cursor-pointer flex items-center justify-between group/item ${selectedHistory?.number === entry.number ? 'bg-blue-600/10 border-blue-500/40' : 'bg-white/5 border-white/5 hover:border-blue-500/30'}`}
                >
                  <div className="flex items-center gap-4">
                    <div className={`w-12 h-12 rounded-xl flex flex-col items-center justify-center font-orbitron font-black text-sm border ${selectedHistory?.number === entry.number ? 'bg-blue-500 text-white border-blue-400' : 'bg-blue-600/10 text-blue-400 border-blue-500/10'}`}>
                      <span>{entry.number}</span>
                    </div>
                    <div className="overflow-hidden">
                      <p className="text-[10px] font-black text-slate-300 uppercase truncate max-w-[120px]">{entry.provider}</p>
                      <div className="flex items-center gap-1.5 mt-0.5">
                        <Clock size={10} className="text-slate-600" />
                        <span className="text-[8px] font-bold text-slate-600 uppercase tabular-nums">{entry.addedAt}</span>
                      </div>
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    {MOCK_RESULTS.some(r => r.first === entry.number || r.second === entry.number || r.third === entry.number) && (
                        <div className="p-1 bg-amber-500/10 rounded-lg text-amber-500" title="Historical Win Found">
                            <Trophy size={14} />
                        </div>
                    )}
                    <button 
                        onClick={(e) => { e.stopPropagation(); removeNumber(entry.id); }}
                        className="p-2 text-slate-700 hover:text-red-500 transition-colors md:opacity-0 group-hover/item:opacity-100"
                    >
                        <Trash2 size={14} />
                    </button>
                  </div>
                </div>
              ))
            ) : (
              <div className="py-20 text-center space-y-3 opacity-20 group-hover:opacity-40 transition-opacity">
                 <Bell size={48} className="mx-auto text-slate-600" />
                 <p className="text-[10px] font-black uppercase tracking-[0.3em] text-slate-500">
                   {searchQuery ? "No node matching criteria" : "Neural Vault Empty"}
                 </p>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Requirement: "side box winning number at the same time with personal savings number, date & operator" */}
      {selectedHistory && (
        <div className="w-full lg:w-80 glass rounded-[2rem] p-6 border border-amber-500/20 bg-amber-500/[0.03] animate-in slide-in-from-right-4 duration-500 relative flex flex-col h-fit lg:sticky lg:top-24">
          <button 
            onClick={() => setSelectedHistory(null)}
            className="absolute top-4 right-4 p-2 hover:bg-white/5 rounded-xl text-slate-500 hover:text-white transition-colors"
          >
            <X size={18} />
          </button>
          
          <div className="space-y-6">
            <div className="flex items-center gap-3">
              <div className="p-3 bg-amber-500 rounded-2xl shadow-[0_0_20px_rgba(245,158,11,0.4)] border border-amber-400">
                <Zap size={20} className="text-black" />
              </div>
              <div>
                <h4 className="text-sm font-orbitron font-bold text-white uppercase tracking-wider">Node Intelligence</h4>
                <p className="text-[9px] font-black text-amber-500 uppercase tracking-widest animate-pulse">Syncing Archives...</p>
              </div>
            </div>

            <div className="space-y-4">
               <div className="p-4 rounded-2xl bg-black/60 border border-white/5 group-hover:border-amber-500/30 transition-all">
                  <p className="text-[9px] font-black text-slate-500 uppercase mb-2 tracking-[0.2em] flex items-center gap-1">
                    <Target size={10} className="text-amber-500" /> Personal Savings Node
                  </p>
                  <p className="text-4xl font-orbitron font-black text-white tracking-[0.3em]">{selectedHistory.number}</p>
               </div>
               
               <div className="p-4 rounded-2xl bg-black/60 border border-white/5 space-y-3">
                  <div>
                    <p className="text-[8px] font-black text-slate-500 uppercase mb-1 tracking-widest flex items-center gap-1"><Calendar size={9}/> Committed Date/Time</p>
                    <p className="text-[10px] font-bold text-slate-200 tabular-nums">{selectedHistory.addedAt}</p>
                  </div>
                  <div>
                    <p className="text-[8px] font-black text-slate-500 uppercase mb-1 tracking-widest flex items-center gap-1"><Filter size={9}/> Scope</p>
                    <p className="text-[10px] font-bold text-blue-400 uppercase tracking-widest">
                        {watchedNumbers.find(n => n.number === selectedHistory.number)?.provider || 'Global'}
                    </p>
                  </div>
               </div>
            </div>

            <div className="border-t border-white/10 pt-6">
              {selectedHistory.result ? (
                <div className="space-y-4">
                   <div className="flex justify-between items-center">
                      <span className="text-[10px] font-black text-green-500 uppercase flex items-center gap-2">
                        <CheckCircle2 size={12} /> MATCH FOUND
                      </span>
                      <span className="text-[9px] font-bold text-slate-500 uppercase tabular-nums">Sync: {selectedHistory.result.drawDate}</span>
                   </div>
                   <div className="p-5 rounded-[2rem] bg-gradient-to-br from-green-500/10 to-transparent border border-green-500/30 text-center space-y-2 group/win">
                      <p className="text-[11px] font-black text-green-400 uppercase tracking-[0.3em]">{selectedHistory.result.provider}</p>
                      <p className="text-3xl font-orbitron font-black text-white glow-gold group-hover/win:scale-110 transition-transform">#{selectedHistory.result.drawNumber}</p>
                      <div className="pt-2">
                         <span className="px-3 py-1 bg-green-500 text-black text-[8px] font-black uppercase rounded-lg shadow-lg">Verified Victory</span>
                      </div>
                   </div>
                </div>
              ) : (
                <div className="py-8 text-center space-y-3 opacity-60 grayscale">
                   <ShieldAlert size={32} className="mx-auto text-slate-600" />
                   <p className="text-[9px] font-black text-slate-500 uppercase tracking-widest">Awaiting Convergence</p>
                   <p className="text-[8px] text-slate-700 uppercase italic">No historical matches in current cycle</p>
                </div>
              )}
            </div>

            <ShadowButton variant="secondary" className="w-full py-3 text-[9px] font-black uppercase tracking-widest flex items-center justify-center gap-2 border-white/10">
                <ExternalLink size={12} /> VIEW DEEP LEDGER
            </ShadowButton>
          </div>
        </div>
      )}
    </div>
  );
};
