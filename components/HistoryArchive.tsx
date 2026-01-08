
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
  Clock,
  ArrowRight
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
  const [startDate, setStartDate] = useState('');
  const [endDate, setEndDate] = useState('');
  const [selectedDays, setSelectedDays] = useState<string[]>([]);
  
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
    setStartDate('');
    setEndDate('');
    setSelectedDays([]);
  };

  const toggleDay = (day: string) => {
    setSelectedDays(prev => 
      prev.includes(day) ? prev.filter(d => d !== day) : [...prev, day]
    );
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
      
      const resDate = res.drawDate;
      const matchDateRange = (!startDate || resDate >= startDate) && (!endDate || resDate <= endDate);
      
      const dateObj = new Date(res.drawDate);
      const dayIdx = dateObj.getDay(); 
      const dayNames = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
      const dayName = dayNames[dayIdx];
      
      let matchDay = true;
      if (selectedDays.length > 0) {
        if (selectedDays.includes('Special')) {
           const isPrimaryDay = ['Wed', 'Sat', 'Sun'].includes(dayName);
           matchDay = selectedDays.includes(dayName) || !isPrimaryDay;
        } else {
           matchDay = selectedDays.includes(dayName);
        }
      }

      return matchProvider && matchNumber && matchDateRange && matchDay;
    }).sort((a, b) => b.timestamp - a.timestamp);
  }, [searchNumber, selectedProvider, startDate, endDate, selectedDays]);

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
    const match = MOCK_RESULTS.find(res => {
      const pMatch = newEntry.provider === 'All' || res.provider === newEntry.provider;
      return pMatch && (res.first === newEntry.number || res.second === newEntry.number || res.third === newEntry.number || res.specials?.includes(newEntry.number));
    });
    if (match && onMatch) onMatch(match, newEntry.number);
  };

  const removeMyNumber = (id: string) => setMyNumbers(myNumbers.filter(n => n.id !== id));

  return (
    <div className="space-y-8 animate-in fade-in slide-in-from-bottom-6 duration-700">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
          <h2 className="text-3xl font-orbitron font-bold flex items-center gap-3">
            <History className="text-blue-500" size={28} />
            {t.nav.archive}
          </h2>
          <p className="text-[10px] text-slate-500 font-black uppercase tracking-widest mt-2">Neural Temporal Synchronization</p>
        </div>
        <button onClick={resetFilters} className="flex items-center gap-2 px-6 py-2.5 rounded-xl bg-red-600/10 border border-red-500/30 text-[10px] font-black uppercase tracking-widest hover:bg-red-600/20 transition-all text-red-500">
          <RotateCcw size={14} /> Reset Matrix
        </button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2 space-y-8">
          <div className="glass p-6 sm:p-8 rounded-[2.5rem] border border-white/10 bg-gradient-to-br from-blue-600/5 to-transparent space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
              <div className="lg:col-span-2 relative">
                <input 
                  type="text" maxLength={4} placeholder="Scan number signature..."
                  value={searchNumber} onChange={(e) => setSearchNumber(e.target.value.replace(/\D/g, ''))}
                  className="w-full bg-black/40 border border-white/10 rounded-2xl px-12 py-4 text-sm font-orbitron focus:outline-none focus:border-blue-500/50 transition-all text-white placeholder:text-slate-700"
                />
                <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-500" size={20} />
                {searchNumber && <button onClick={() => setSearchNumber('')} className="absolute right-4 top-1/2 -translate-y-1/2 p-2 rounded-lg bg-white/5 text-slate-500 hover:text-white"><X size={16} /></button>}
              </div>

              <div className="relative">
                <input type="date" value={startDate} onChange={e => setStartDate(e.target.value)} className="w-full bg-black/40 border border-white/10 rounded-2xl px-10 py-4 text-[9px] font-black uppercase focus:outline-none focus:border-blue-500/50 text-white [color-scheme:dark]" />
                <Calendar className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-500 pointer-events-none" size={16} />
              </div>

              <div className="relative">
                <input type="date" value={endDate} onChange={e => setEndDate(e.target.value)} className="w-full bg-black/40 border border-white/10 rounded-2xl px-10 py-4 text-[9px] font-black uppercase focus:outline-none focus:border-blue-500/50 text-white [color-scheme:dark]" />
                <ArrowRight className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-500 pointer-events-none" size={16} />
              </div>
            </div>

            <div className="relative">
              <select value={selectedProvider} onChange={(e) => setSelectedProvider(e.target.value as any)} className="w-full bg-black/40 border border-white/10 rounded-2xl px-12 py-4 text-[10px] font-black uppercase appearance-none focus:outline-none focus:border-blue-500/50 text-white">
                <option value="All">Global Stream (All Operators)</option>
                {Object.values(LotteryProvider).map(p => <option key={p} value={p}>{p}</option>)}
              </select>
              <Filter className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-500 pointer-events-none" size={16} />
            </div>

            <div className="flex flex-wrap items-center gap-3 border-t border-white/5 pt-6">
               <span className="text-[10px] font-black uppercase text-slate-500 tracking-[0.2em] mr-2">Cycle Filter</span>
               {['Wed', 'Sat', 'Sun', 'Special'].map(day => (
                 <button
                   key={day} onClick={() => toggleDay(day)}
                   className={`px-4 py-2 rounded-xl text-[10px] font-black uppercase border transition-all ${selectedDays.includes(day) ? 'bg-blue-600 border-blue-400 text-white shadow-[0_0_15px_rgba(59,130,246,0.3)]' : 'bg-white/5 border-white/5 text-slate-500 hover:text-slate-300'}`}
                 >
                   {day}
                 </button>
               ))}
            </div>
          </div>

          <div className="space-y-6">
            <div className="flex items-center gap-4 px-2">
               <div className="p-2 bg-blue-600/10 rounded-xl text-blue-500"><Database size={18}/></div>
               <div>
                 <span className="text-[10px] font-black uppercase text-slate-500 tracking-[0.4em]">Ledger Feed</span>
                 <p className="text-[11px] font-bold text-slate-200 uppercase">{filteredResults.length} Node Responses</p>
               </div>
            </div>

            <div className="space-y-6">
              {filteredResults.length > 0 ? filteredResults.map((res, i) => (
                <ResultCard key={i} result={res} lang={lang} isLoggedIn={isLoggedIn} onGuestAttempt={onGuestAttempt} highlightQuery={searchNumber} />
              )) : (
                <div className="glass rounded-[3rem] p-24 text-center border border-dashed border-white/10">
                  <Database className="mx-auto text-slate-800 mb-6" size={64} />
                  <h3 className="text-xl font-orbitron font-bold text-slate-600 uppercase tracking-widest">Signal Missing</h3>
                  <p className="text-xs text-slate-500 mt-2">Adjust temporal range or node filters</p>
                </div>
              )}
            </div>
          </div>
        </div>

        <div className="space-y-8">
           <div className="glass p-8 rounded-[2.5rem] border border-amber-500/20 bg-amber-500/5 space-y-6 relative overflow-hidden">
             <h3 className="text-lg font-orbitron font-bold flex items-center gap-3 text-white">
               <Target className="text-amber-500" size={20} /> My Vault
             </h3>
             <div className="space-y-4">
                <div className="p-4 rounded-2xl bg-white/5 border border-white/5 space-y-3">
                   <div className="flex gap-2">
                      <div className="relative flex-1">
                        <input type="text" maxLength={4} placeholder="0000" value={inputNum} onChange={(e) => setInputNum(e.target.value.replace(/\D/g, ''))} className="w-full bg-black/60 border border-white/10 rounded-xl px-10 py-3 text-sm font-orbitron tracking-widest focus:border-amber-500/50 outline-none text-white" />
                        <Hash size={14} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-600" />
                      </div>
                   </div>
                   <ShadowButton onClick={handleAddMyNumber} variant="gold" disabled={inputNum.length !== 4} className="w-full py-3.5 text-[10px] font-black uppercase flex items-center justify-center gap-2">
                     <Plus size={16} /> SAVE NODE
                   </ShadowButton>
                </div>

                <div className="space-y-2 max-h-[400px] overflow-y-auto custom-scrollbar pr-2">
                   {myNumbers.map((entry) => (
                     <div key={entry.id} className="p-4 rounded-2xl bg-white/5 border border-white/5 flex items-center justify-between group hover:border-blue-500/30 transition-all">
                        <div className="flex items-center gap-4">
                           <div className="w-12 h-12 rounded-xl bg-blue-600/10 text-blue-400 font-orbitron font-black text-sm flex items-center justify-center">{entry.number}</div>
                           <div>
                              <p className="text-[9px] font-black text-slate-400 uppercase">{entry.provider}</p>
                              <p className="text-[8px] font-bold text-slate-600 uppercase">Registered</p>
                           </div>
                        </div>
                        <button onClick={() => removeMyNumber(entry.id)} className="p-2 text-slate-700 hover:text-red-500 opacity-0 group-hover:opacity-100 transition-all"><Trash2 size={14} /></button>
                     </div>
                   ))}
                </div>
             </div>
           </div>
        </div>
      </div>
    </div>
  );
};
