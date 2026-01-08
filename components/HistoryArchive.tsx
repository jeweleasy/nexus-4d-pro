
import React, { useState, useMemo, useEffect } from 'react';
import { 
  Search, 
  Calendar, 
  Filter, 
  History, 
  Database, 
  Info, 
  Zap, 
  RotateCcw,
  Target, 
  Plus, 
  Hash,
  Trash2,
  Bell,
  ShieldCheck,
  ChevronDown,
  Trophy,
  X,
  CheckCircle2,
  Clock
} from 'lucide-react';
import { MOCK_RESULTS, LANGUAGES } from '../constants';
import { ResultCard } from './ResultCard';
import { LotteryProvider, LotteryResult } from '../types';
import { ShadowButton } from './ShadowButton';

interface HistoryArchiveProps {
  lang: 'EN' | 'CN' | 'MY';
  isLoggedIn?: boolean;
  onGuestAttempt?: () => void;
  onMatch?: (result: LotteryResult, matchedNum: string) => void;
}

interface WatchedNumber {
  id: string;
  number: string;
  provider: LotteryProvider | 'All';
  timestamp: number;
}

export const HistoryArchive: React.FC<HistoryArchiveProps> = ({ lang, isLoggedIn = false, onGuestAttempt, onMatch }) => {
  const [searchNumber, setSearchNumber] = useState('');
  const [selectedProvider, setSelectedProvider] = useState<LotteryProvider | 'All'>('All');
  const [selectedYear, setSelectedYear] = useState('2024');
  const [drawDayFilter, setDrawDayFilter] = useState<'All' | 'Wed' | 'Sat' | 'Sun' | 'Special'>('All');
  
  const [myNumbers, setMyNumbers] = useState<WatchedNumber[]>(() => {
    const saved = localStorage.getItem('nexus_my_numbers');
    return saved ? JSON.parse(saved) : [];
  });
  const [inputNum, setInputNum] = useState('');
  const [inputProvider, setInputProvider] = useState<LotteryProvider | 'All'>('All');

  const t = LANGUAGES[lang];

  useEffect(() => {
    localStorage.setItem('nexus_my_numbers', JSON.stringify(myNumbers));
  }, [myNumbers]);

  const resetFilters = () => {
    setSearchNumber('');
    setSelectedProvider('All');
    setSelectedYear('2024');
    setDrawDayFilter('All');
  };

  const filteredResults = useMemo(() => {
    return MOCK_RESULTS.filter(res => {
      const matchProvider = selectedProvider === 'All' || res.provider === selectedProvider;
      const matchNumber = !searchNumber || 
        res.first.includes(searchNumber) || 
        res.second?.includes(searchNumber) || 
        res.third?.includes(searchNumber) ||
        res.specials?.some(s => s.includes(searchNumber)) ||
        res.consolations?.some(c => c.includes(searchNumber));
      const matchYear = res.drawDate.startsWith(selectedYear);
      
      const date = new Date(res.drawDate);
      const day = date.getDay(); 
      
      let matchDay = true;
      if (drawDayFilter === 'Wed') matchDay = day === 3;
      else if (drawDayFilter === 'Sat') matchDay = day === 6;
      else if (drawDayFilter === 'Sun') matchDay = day === 0;
      else if (drawDayFilter === 'Special') matchDay = ![0, 3, 6].includes(day);

      return matchProvider && matchNumber && matchYear && matchDay;
    }).sort((a, b) => b.timestamp - a.timestamp);
  }, [searchNumber, selectedProvider, selectedYear, drawDayFilter]);

  const handleAddMyNumber = () => {
    if (!isLoggedIn) {
      onGuestAttempt?.();
      return;
    }
    if (inputNum.length !== 4) return;
    
    const newEntry: WatchedNumber = {
      id: Math.random().toString(36).substring(2, 9),
      number: inputNum,
      provider: inputProvider,
      timestamp: Date.now()
    };
    
    setMyNumbers([newEntry, ...myNumbers]);
    setInputNum('');

    // Immediate check for matches in the current archive context
    const match = MOCK_RESULTS.find(res => {
      const providerMatch = newEntry.provider === 'All' || res.provider === newEntry.provider;
      return providerMatch && (
        res.first === newEntry.number || 
        res.second === newEntry.number || 
        res.third === newEntry.number ||
        res.specials?.includes(newEntry.number) ||
        res.consolations?.includes(newEntry.number)
      );
    });

    if (match && onMatch) {
      onMatch(match, newEntry.number);
    }
  };

  const removeMyNumber = (id: string) => {
    setMyNumbers(myNumbers.filter(n => n.id !== id));
  };

  // Helper to determine if a card should be highlighted based on watchlist
  const getWatchlistHighlight = (result: LotteryResult) => {
    const matchingWatchNode = myNumbers.find(node => {
      const pMatch = node.provider === 'All' || result.provider === node.provider;
      return pMatch && (
        result.first === node.number || 
        result.second === node.number || 
        result.third === node.number ||
        result.specials?.includes(node.number) ||
        result.consolations?.includes(node.number)
      );
    });
    return matchingWatchNode?.number || "";
  };

  return (
    <div className="space-y-8 animate-in fade-in slide-in-from-bottom-6 duration-700">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
          <h2 className="text-3xl font-orbitron font-bold flex items-center gap-3 text-slate-900 dark:text-white">
            <History className="text-blue-500" size={28} />
            {t.nav.archive}
          </h2>
          <p className="text-[10px] text-slate-500 font-black uppercase tracking-widest mt-2">Temporal Pattern Synchronization</p>
        </div>
        <button 
          onClick={resetFilters}
          className="flex items-center gap-2 px-6 py-2.5 rounded-xl bg-red-600/10 border border-red-500/30 text-[10px] font-black uppercase tracking-widest hover:bg-red-600/20 transition-all text-red-500"
        >
          <RotateCcw size={14} /> Reset Filter Matrix
        </button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2 space-y-8">
          {/* Main Filter Matrix */}
          <div className="glass p-8 rounded-[2.5rem] border border-white/10 bg-gradient-to-br from-blue-600/5 to-transparent space-y-8">
            <div className="grid grid-cols-1 md:grid-cols-5 gap-4">
              <div className="md:col-span-2 relative group">
                <input 
                  type="text" 
                  maxLength={4}
                  placeholder="Scan number signature..."
                  value={searchNumber}
                  onChange={(e) => setSearchNumber(e.target.value.replace(/\D/g, ''))}
                  className="w-full bg-black/40 border border-white/10 rounded-2xl px-12 py-5 text-sm font-orbitron focus:outline-none focus:border-blue-500/50 transition-all text-white placeholder:text-slate-700"
                />
                <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-500" size={20} />
                {searchNumber && (
                  <button 
                    onClick={() => setSearchNumber('')}
                    className="absolute right-4 top-1/2 -translate-y-1/2 p-2 rounded-lg bg-white/5 hover:bg-white/10 text-slate-400 hover:text-white transition-all animate-in fade-in zoom-in group"
                    title="Clear Search"
                  >
                    <X size={16} />
                  </button>
                )}
              </div>

              <div className="relative">
                <select 
                  value={selectedYear}
                  onChange={(e) => setSelectedYear(e.target.value)}
                  className="w-full h-full bg-black/40 border border-white/10 rounded-2xl px-10 py-4 text-[10px] font-black uppercase appearance-none focus:outline-none focus:border-blue-500/50 text-white cursor-pointer"
                >
                  {['2024', '2023', '2022', '2021', '2020'].map(y => (
                    <option key={y} value={y}>{y} Series</option>
                  ))}
                </select>
                <Calendar className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-500 pointer-events-none" size={16} />
              </div>

              <div className="md:col-span-2 relative">
                <select 
                  value={selectedProvider}
                  onChange={(e) => setSelectedProvider(e.target.value as any)}
                  className="w-full h-full bg-black/40 border border-white/10 rounded-2xl px-12 py-4 text-[10px] font-black uppercase appearance-none focus:outline-none focus:border-blue-500/50 text-white cursor-pointer"
                >
                  <option value="All">Global Stream (All Operators)</option>
                  {Object.values(LotteryProvider).map(p => (
                    <option key={p} value={p}>{p}</option>
                  ))}
                </select>
                <Filter className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-500 pointer-events-none" size={16} />
                <ChevronDown className="absolute right-8 top-1/2 -translate-y-1/2 text-slate-700 pointer-events-none" size={14} />
              </div>
            </div>

            <div className="flex flex-wrap items-center gap-3 border-t border-white/5 pt-6">
               <span className="text-[10px] font-black uppercase text-slate-500 tracking-[0.2em] mr-4">Temporal Cycle</span>
               {(['All', 'Wed', 'Sat', 'Sun', 'Special'] as const).map(day => (
                 <button
                   key={day}
                   onClick={() => setDrawDayFilter(day)}
                   className={`px-5 py-2.5 rounded-xl text-[10px] font-black uppercase tracking-tight border transition-all ${drawDayFilter === day ? 'bg-blue-600 border-blue-400 text-white shadow-[0_0_15px_rgba(59,130,246,0.3)]' : 'bg-white/5 border-white/5 text-slate-500 hover:border-white/20 hover:text-slate-300'}`}
                 >
                   {day}
                 </button>
               ))}
            </div>
          </div>

          {/* Results Feed */}
          <div className="space-y-6">
            <div className="flex items-center justify-between px-2">
               <div className="flex items-center gap-4">
                  <div className="p-2 bg-blue-600/10 rounded-xl border border-blue-500/20 text-blue-500">
                     <Database size={18}/>
                  </div>
                  <div>
                    <span className="text-[10px] font-black uppercase text-slate-500 tracking-[0.4em]">Archival Ledger</span>
                    <p className="text-[11px] font-bold text-slate-200 uppercase">{filteredResults.length} Result Packets Found</p>
                  </div>
               </div>
            </div>

            <div className="space-y-6">
              {filteredResults.length > 0 ? (
                filteredResults.map((res, i) => {
                  const watchlistHit = getWatchlistHighlight(res);
                  return (
                    <ResultCard 
                      key={`${res.provider}-${res.drawDate}-${i}`} 
                      result={res} 
                      lang={lang} 
                      isLoggedIn={isLoggedIn} 
                      onGuestAttempt={onGuestAttempt} 
                      highlightQuery={searchNumber || watchlistHit}
                    />
                  );
                })
              ) : (
                <div className="glass rounded-[3rem] p-24 text-center border border-dashed border-white/10">
                  <Database className="mx-auto text-slate-800 mb-6" size={64} />
                  <h3 className="text-2xl font-orbitron font-bold text-slate-600 uppercase tracking-widest">No Signals Found</h3>
                  <button onClick={resetFilters} className="mt-8 text-[10px] font-black text-blue-500 hover:text-blue-400 flex items-center gap-2 mx-auto">
                    <RotateCcw size={14} /> Reset Filter Matrix
                  </button>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* My Numbers Watchlist Sidebar */}
        <div className="space-y-8">
           <div className="glass p-8 rounded-[2.5rem] border border-amber-500/20 bg-gradient-to-br from-amber-600/5 to-transparent space-y-6 relative overflow-hidden">
             <div className="absolute -top-10 -right-10 w-24 h-24 bg-amber-500/5 blur-2xl rounded-full"></div>
             
             <div className="flex justify-between items-center">
                <h3 className="text-lg font-orbitron font-bold flex items-center gap-3 text-white">
                  <Target className="text-amber-500" size={20} />
                  My Numbers
                </h3>
             </div>

             <div className="space-y-4">
                <div className="p-4 rounded-2xl bg-white/5 border border-white/5 space-y-3">
                   <div className="flex gap-2">
                      <div className="relative flex-1">
                        <input 
                          type="text" 
                          maxLength={4}
                          placeholder="0000"
                          value={inputNum}
                          onChange={(e) => setInputNum(e.target.value.replace(/\D/g, ''))}
                          className="w-full bg-black/60 border border-white/10 rounded-xl px-10 py-3 text-sm font-orbitron tracking-widest focus:border-amber-500/50 outline-none text-white"
                        />
                        <Hash size={14} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-600" />
                      </div>
                      <select 
                        value={inputProvider}
                        onChange={(e) => setInputProvider(e.target.value as any)}
                        className="bg-black/60 border border-white/10 rounded-xl px-2 text-[9px] font-black uppercase text-slate-400 focus:outline-none w-24 cursor-pointer"
                      >
                        <option value="All">All</option>
                        {Object.values(LotteryProvider).map(p => (
                          <option key={p} value={p}>{p.split(' ')[0]}</option>
                        ))}
                      </select>
                   </div>
                   <ShadowButton 
                     onClick={handleAddMyNumber}
                     variant="gold"
                     disabled={inputNum.length !== 4}
                     className="w-full py-3.5 text-[10px] font-black uppercase tracking-widest flex items-center justify-center gap-2"
                   >
                     <Plus size={16} /> ADD TO VAULT
                   </ShadowButton>
                </div>

                <div className="space-y-2 max-h-[400px] overflow-y-auto custom-scrollbar pr-2">
                   {myNumbers.map((entry) => {
                      const hasMatch = MOCK_RESULTS.some(r => {
                          const pMatch = entry.provider === 'All' || r.provider === entry.provider;
                          return pMatch && (
                            r.first === entry.number || 
                            r.second === entry.number || 
                            r.third === entry.number ||
                            r.specials?.includes(entry.number) ||
                            r.consolations?.includes(entry.number)
                          );
                      });

                      return (
                        <div key={entry.id} className={`p-4 rounded-2xl border transition-all flex items-center justify-between group ${hasMatch ? 'bg-amber-500/10 border-amber-500/30 shadow-[0_0_10px_rgba(245,158,11,0.1)]' : 'bg-white/5 border-white/5 hover:border-white/20'}`}>
                           <div className="flex items-center gap-4">
                              <div className={`w-12 h-12 rounded-xl flex flex-col items-center justify-center font-orbitron font-black text-sm border ${hasMatch ? 'bg-amber-500 text-black border-amber-400' : 'bg-blue-600/10 text-blue-400 border-blue-500/10'}`}>
                                 {entry.number}
                              </div>
                              <div>
                                 <p className="text-[9px] font-black text-slate-400 uppercase truncate max-w-[100px]">{entry.provider}</p>
                                 <div className="flex items-center gap-1.5 mt-0.5">
                                    {hasMatch ? (
                                      <span className="text-[8px] font-black text-amber-500 uppercase flex items-center gap-1"><Zap size={8}/> Archive Hit</span>
                                    ) : (
                                      <span className="text-[8px] font-bold text-slate-600 uppercase">Synchronized</span>
                                    )}
                                 </div>
                              </div>
                           </div>
                           <button 
                             onClick={() => removeMyNumber(entry.id)}
                             className="p-2 text-slate-700 hover:text-red-500 transition-colors opacity-0 group-hover:opacity-100"
                           >
                             <Trash2 size={14} />
                           </button>
                        </div>
                      );
                   })}
                   {myNumbers.length === 0 && (
                     <div className="py-20 text-center opacity-30">
                        <Database size={40} className="mx-auto text-slate-600 mb-3" />
                        <p className="text-[10px] font-black uppercase tracking-widest text-slate-500">Vault Empty</p>
                     </div>
                   )}
                </div>
             </div>

             <div className="pt-4 border-t border-white/5 flex justify-between items-center">
                <span className="text-[8px] font-bold text-slate-600 uppercase tracking-widest flex items-center gap-1">
                   <ShieldCheck size={10} /> Local persistence active
                </span>
                <span className="text-[8px] font-bold text-slate-600 uppercase tracking-widest">{myNumbers.length} Nodes</span>
             </div>
          </div>
        </div>
      </div>
    </div>
  );
};
