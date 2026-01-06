
import React, { useState, useEffect } from 'react';
import { Target, Plus, Trash2, Bell, ShieldAlert, Hash, Filter, CheckCircle2, Sparkles, Trophy } from 'lucide-react';
import { LotteryProvider, LotteryResult } from '../types';
import { ShadowButton } from './ShadowButton';
import { MOCK_RESULTS } from '../constants';

interface WatchedNumber {
  id: string;
  number: string;
  provider: LotteryProvider | 'All';
  timestamp: number;
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

    const newEntry: WatchedNumber = {
      id: Math.random().toString(36).substring(2, 9),
      number: inputNum,
      provider: selectedProvider,
      timestamp: Date.now()
    };

    const newList = [newEntry, ...watchedNumbers];
    saveWatchlist(newList);
    setInputNum('');
    
    // Check if this new number matches anything immediately in the current feed
    checkMatches(newEntry);
  };

  const removeNumber = (id: string) => {
    const newList = watchedNumbers.filter(n => n.id !== id);
    saveWatchlist(newList);
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
      // Trigger the animated big congrats in parent
      onMatch(match, entry.number);
    }
  };

  return (
    <div className="glass rounded-[2rem] p-6 border border-white/10 space-y-6 relative overflow-hidden group">
      <div className="absolute -top-10 -right-10 w-24 h-24 bg-blue-500/10 blur-2xl rounded-full"></div>
      
      <div className="flex justify-between items-center">
        <h3 className="text-lg font-orbitron font-bold flex items-center gap-3">
          <Target className="text-blue-500" size={20} />
          Personal Nodes
        </h3>
        {!isLoggedIn && (
          <div className="flex items-center gap-1.5 px-2 py-1 bg-red-500/10 rounded-lg border border-red-500/20">
            <ShieldAlert size={12} className="text-red-500" />
            <span className="text-[8px] font-black text-red-500 uppercase tracking-tighter">Registration Required</span>
          </div>
        )}
      </div>

      <div className="space-y-4">
        <div className="flex flex-col gap-3">
          <div className="relative">
            <input 
              type="text" 
              maxLength={4}
              placeholder="Enter My 4D..."
              value={inputNum}
              onChange={(e) => setInputNum(e.target.value.replace(/\D/g, ''))}
              disabled={!isLoggedIn}
              className="w-full bg-black/40 border border-white/10 rounded-xl px-10 py-3.5 text-sm font-orbitron tracking-widest focus:outline-none focus:border-blue-500/50 disabled:opacity-30 disabled:cursor-not-allowed transition-all"
            />
            <Hash size={16} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-600" />
          </div>

          <div className="relative">
            <select 
              value={selectedProvider}
              onChange={(e) => setSelectedProvider(e.target.value as any)}
              disabled={!isLoggedIn}
              className="w-full bg-black/40 border border-white/10 rounded-xl px-10 py-3.5 text-[10px] font-black uppercase appearance-none focus:outline-none focus:border-blue-500/50 cursor-pointer disabled:opacity-30 disabled:cursor-not-allowed transition-all"
            >
              <option value="All">All Operators</option>
              {Object.values(LotteryProvider).map(p => (
                <option key={p} value={p}>{p}</option>
              ))}
            </select>
            <Filter size={16} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-600" />
          </div>

          <ShadowButton 
            onClick={handleAdd}
            variant="primary"
            disabled={!isLoggedIn || inputNum.length !== 4}
            className="w-full py-3 text-[10px] font-black uppercase tracking-widest flex items-center justify-center gap-2"
          >
            <Plus size={14} /> Add My Number
          </ShadowButton>
        </div>

        <div className="space-y-2 max-h-[260px] overflow-y-auto custom-scrollbar pr-2">
          {watchedNumbers.length > 0 ? (
            watchedNumbers.map((entry) => (
              <div key={entry.id} className="p-3 rounded-2xl bg-white/5 border border-white/5 flex items-center justify-between group/item hover:border-blue-500/30 transition-all">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-xl bg-blue-600/10 flex items-center justify-center font-orbitron font-bold text-blue-400 text-sm border border-blue-500/10">
                    {entry.number}
                  </div>
                  <div className="overflow-hidden">
                    <p className="text-[9px] font-black text-slate-500 uppercase truncate max-w-[120px]">{entry.provider}</p>
                    <div className="flex items-center gap-1">
                      <div className="w-1 h-1 rounded-full bg-green-500 animate-pulse"></div>
                      <span className="text-[7px] font-bold text-slate-600 uppercase">Monitoring Result...</span>
                    </div>
                  </div>
                </div>
                <button 
                  onClick={() => removeNumber(entry.id)}
                  className="p-2 text-slate-700 hover:text-red-500 transition-colors md:opacity-0 group-hover/item:opacity-100"
                >
                  <Trash2 size={14} />
                </button>
              </div>
            ))
          ) : (
            <div className="py-12 text-center space-y-2 opacity-20">
               <Bell size={32} className="mx-auto text-slate-600" />
               <p className="text-[9px] font-black uppercase tracking-[0.2em] text-slate-500">No watched numbers</p>
            </div>
          )}
        </div>
      </div>

      <div className="pt-4 border-t border-white/5 flex items-center gap-2">
        <Sparkles size={12} className="text-amber-500" />
        <p className="text-[8px] text-slate-600 uppercase font-black tracking-tight italic">Live notification on pattern match</p>
      </div>
    </div>
  );
};
