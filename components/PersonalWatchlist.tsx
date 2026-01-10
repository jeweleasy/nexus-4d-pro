
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
  ShieldCheck,
  Loader2
} from 'lucide-react';
import { LotteryProvider, LotteryResult } from '../types';
import { ShadowButton } from './ShadowButton';
import { MOCK_RESULTS } from '../constants';
import { supabase } from '../services/supabase';

interface WatchedNumber {
  id: string;
  number: string;
  provider: LotteryProvider | 'All';
  timestamp: number;
  addedAt: string;
  note?: string;
}

interface PersonalWatchlistProps {
  isLoggedIn: boolean;
  onGuestAttempt: () => void;
  onMatch: (result: LotteryResult, matchedNum: string) => void;
}

export const PersonalWatchlist: React.FC<PersonalWatchlistProps> = ({ isLoggedIn, onGuestAttempt, onMatch }) => {
  const [watchedNumbers, setWatchedNumbers] = useState<WatchedNumber[]>([]);
  const [loading, setLoading] = useState(false);
  const [inputNum, setInputNum] = useState('');
  const [selectedProvider, setSelectedProvider] = useState<LotteryProvider | 'All'>('All');
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedHistory, setSelectedHistory] = useState<{ number: string; result: LotteryResult | null; addedAt: string } | null>(null);

  useEffect(() => {
    if (isLoggedIn) {
      fetchNodes();
    } else {
      setWatchedNumbers([]);
    }
  }, [isLoggedIn]);

  const fetchNodes = async () => {
    setLoading(true);
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) return;

      const { data, error } = await supabase
        .from('personal_nodes')
        .select('*')
        .eq('user_id', user.id)
        .order('created_at', { ascending: false });

      if (data) {
        setWatchedNumbers(data.map(d => ({
          id: d.id,
          number: d.number,
          provider: d.provider as any,
          timestamp: new Date(d.created_at).getTime(),
          addedAt: new Date(d.created_at).toLocaleString(),
          note: d.note
        })));
      }
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handleAdd = async () => {
    if (!isLoggedIn) {
      onGuestAttempt();
      return;
    }
    if (inputNum.length !== 4) return;

    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) return;

      const { data, error } = await supabase
        .from('personal_nodes')
        .insert({
          user_id: user.id,
          number: inputNum,
          provider: selectedProvider,
          note: ''
        })
        .select()
        .single();

      if (data) {
        const newEntry: WatchedNumber = {
          id: data.id,
          number: data.number,
          provider: data.provider as any,
          timestamp: new Date(data.created_at).getTime(),
          addedAt: new Date(data.created_at).toLocaleString()
        };
        setWatchedNumbers([newEntry, ...watchedNumbers]);
        setInputNum('');
        checkMatches(newEntry);
      }
    } catch (err) {
      console.error(err);
    }
  };

  const removeNumber = async (id: string) => {
    try {
      await supabase.from('personal_nodes').delete().eq('id', id);
      setWatchedNumbers(prev => prev.filter(n => n.id !== id));
      if (selectedHistory && watchedNumbers.find(n => n.id === id)?.number === selectedHistory.number) {
          setSelectedHistory(null);
      }
    } catch (err) {
      console.error(err);
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

  if (!isLoggedIn) return null;

  return (
    <div className="flex flex-col lg:flex-row gap-6 animate-in fade-in duration-500">
      <div className="flex-1 glass rounded-[2rem] p-6 border border-white/10 space-y-6 relative overflow-hidden group shadow-2xl">
        <div className="absolute -top-10 -right-10 w-24 h-24 bg-blue-500/10 blur-2xl rounded-full"></div>
        
        <div className="flex justify-between items-center">
          <h3 className="text-lg font-orbitron font-bold flex items-center gap-3">
            <Target className="text-blue-500" size={20} />
            Cloud Node Tracker
          </h3>
          <div className="flex items-center gap-1.5 px-2 py-1 bg-green-500/10 rounded-lg border border-green-500/20">
            <ShieldCheck size={12} className="text-green-500" />
            <span className="text-[8px] font-black text-green-500 uppercase tracking-tighter">Live Relay</span>
          </div>
        </div>

        <div className="space-y-4">
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
              <Plus size={14} /> Register Node Signature
            </ShadowButton>
          </div>

          <div className="relative">
            <input 
              type="text" 
              placeholder="Search Saved Nodes..." 
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value.replace(/\D/g, ''))}
              className="w-full bg-black/60 border border-blue-500/20 rounded-xl px-12 py-3.5 text-[10px] font-black uppercase tracking-[0.2em] focus:outline-none focus:border-blue-500/50 transition-all text-blue-400 placeholder:text-blue-900 shadow-[inset_0_0_15px_rgba(59,130,246,0.1)]"
            />
            <Search size={18} className="absolute left-4 top-1/2 -translate-y-1/2 text-blue-900" />
          </div>

          <div className="space-y-2 max-h-[300px] overflow-y-auto custom-scrollbar pr-2">
            {loading ? (
               <div className="py-20 flex flex-col items-center gap-3">
                  <Loader2 size={32} className="text-blue-500 animate-spin" />
                  <p className="text-[10px] font-black uppercase tracking-widest text-slate-500">Retrieving Cloud Ledger...</p>
               </div>
            ) : filteredWatchlist.length > 0 ? (
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
                  <button 
                      onClick={(e) => { e.stopPropagation(); removeNumber(entry.id); }}
                      className="p-2 text-slate-700 hover:text-red-500 transition-colors md:opacity-0 group-hover/item:opacity-100"
                  >
                      <Trash2 size={14} />
                  </button>
                </div>
              ))
            ) : (
              <div className="py-20 text-center space-y-3 opacity-20 group-hover:opacity-40 transition-opacity">
                 <Bell size={48} className="mx-auto text-slate-600" />
                 <p className="text-[10px] font-black uppercase tracking-[0.3em] text-slate-500">
                   Neural Vault Empty
                 </p>
              </div>
            )}
          </div>
        </div>
      </div>

      {selectedHistory && (
        <div className="w-full lg:w-80 glass rounded-[2rem] p-6 border border-amber-500/20 bg-amber-500/[0.03] animate-in slide-in-from-right-4 duration-500 relative flex flex-col h-fit lg:sticky lg:top-24 shadow-2xl">
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
                <h4 className="text-sm font-orbitron font-bold text-white uppercase tracking-wider">Analysis Hub</h4>
                <p className="text-[9px] font-black text-amber-500 uppercase tracking-widest animate-pulse">Scanning Waves...</p>
              </div>
            </div>

            <div className="p-4 rounded-2xl bg-black/60 border border-white/5">
                <p className="text-[9px] font-black text-slate-500 uppercase mb-2 tracking-[0.2em] flex items-center gap-1">
                  <Target size={10} className="text-amber-500" /> Persistent ID
                </p>
                <p className="text-4xl font-orbitron font-black text-white tracking-[0.3em]">{selectedHistory.number}</p>
            </div>

            <div className="border-t border-white/10 pt-6">
              {selectedHistory.result ? (
                <div className="space-y-4">
                   <div className="flex justify-between items-center">
                      <span className="text-[10px] font-black text-green-500 uppercase flex items-center gap-2">
                        <CheckCircle2 size={12} /> CONVERGENCE FOUND
                      </span>
                   </div>
                   <div className="p-5 rounded-[2rem] bg-gradient-to-br from-green-500/10 to-transparent border border-green-500/30 text-center space-y-2">
                      <p className="text-[11px] font-black text-green-400 uppercase tracking-[0.3em]">{selectedHistory.result.provider}</p>
                      <p className="text-3xl font-orbitron font-black text-white">{selectedHistory.result.first}</p>
                   </div>
                </div>
              ) : (
                <div className="py-8 text-center space-y-3 opacity-60 grayscale">
                   <ShieldAlert size={32} className="mx-auto text-slate-600" />
                   <p className="text-[9px] font-black text-slate-500 uppercase tracking-widest">Awaiting Pattern Strike</p>
                </div>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
