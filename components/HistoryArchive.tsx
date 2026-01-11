
import React, { useState, useMemo, useEffect } from 'react';
import { 
  Search, 
  Calendar, 
  Filter, 
  History, 
  Database, 
  RotateCcw,
  Target, 
  Plus, 
  Hash,
  Trash2,
  Trophy,
  X,
  CheckCircle2,
  Clock,
  ArrowRight,
  Zap,
  LayoutGrid,
  ChevronDown,
  StickyNote,
  BarChart3,
  Download,
  CheckSquare,
  Square,
  BarChart,
  LineChart,
  Activity,
  ArrowUpDown,
  Edit3
} from 'lucide-react';
import { MOCK_RESULTS, LANGUAGES } from '../constants';
import { ResultCard } from './ResultCard';
import { LotteryProvider, LotteryResult } from '../types';
import { ShadowButton } from './ShadowButton';
import { ResponsiveContainer, BarChart as RechartsBarChart, Bar, XAxis, YAxis, Tooltip, Cell, CartesianGrid } from 'recharts';

interface HistoryArchiveProps {
  lang: 'EN' | 'CN' | 'MY';
  isLoggedIn?: boolean;
  onGuestAttempt?: () => void;
  onMatch?: (result: LotteryResult, matchedNum: string) => void;
  onToggleFavorite?: (result: LotteryResult) => void;
  onShare?: (result: LotteryResult) => void;
  isFavorite?: (result: LotteryResult) => boolean;
}

interface WatchedNumber {
  id: string;
  number: string;
  provider: LotteryProvider | 'All';
  timestamp: number;
  note?: string;
}

export const HistoryArchive: React.FC<HistoryArchiveProps> = ({ 
  lang, 
  isLoggedIn = false, 
  onGuestAttempt, 
  onMatch,
  onToggleFavorite,
  onShare,
  isFavorite
}) => {
  const [searchNumber, setSearchNumber] = useState('');
  const [selectedProvider, setSelectedProvider] = useState<LotteryProvider | 'All'>('All');
  const [startDate, setStartDate] = useState('');
  const [endDate, setEndDate] = useState('');
  const [selectedDays, setSelectedDays] = useState<string[]>([]);
  const [showPatternAnalysis, setShowPatternAnalysis] = useState(false);
  
  const [myNumbers, setMyNumbers] = useState<WatchedNumber[]>(() => {
    try {
      const saved = localStorage.getItem('nexus_my_numbers');
      return saved ? JSON.parse(saved) : [];
    } catch(e) { return []; }
  });
  const [inputNum, setInputNum] = useState('');
  const [inputProvider, setInputProvider] = useState<LotteryProvider | 'All'>('All');
  const [inputNote, setInputNote] = useState('');
  const [editingNoteId, setEditingNoteId] = useState<string | null>(null);
  const [tempNote, setTempNote] = useState('');

  // Bulk selection state
  const [selectedMyNumbers, setSelectedMyNumbers] = useState<Set<string>>(new Set());
  const [watchlistSearch, setWatchlistSearch] = useState('');
  const [watchlistSort, setWatchlistSort] = useState<'date' | 'number'>('date');

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

  // Pattern Analysis Data
  const patternData = useMemo(() => {
    const stats = Array.from({ length: 10 }, (_, i) => ({ digit: i.toString(), count: 0 }));
    filteredResults.forEach(res => {
      [res.first, res.second, res.third].forEach(num => {
        if (!num) return;
        num.split('').forEach(digit => {
          if (stats[parseInt(digit)]) stats[parseInt(digit)].count++;
        });
      });
    });
    return stats;
  }, [filteredResults]);

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
      timestamp: Date.now(),
      note: inputNote
    };
    setMyNumbers([newEntry, ...myNumbers]);
    setInputNum('');
    setInputNote('');
    const match = MOCK_RESULTS.find(res => {
      const pMatch = newEntry.provider === 'All' || res.provider === newEntry.provider;
      return pMatch && (res.first === newEntry.number || res.second === newEntry.number || res.third === newEntry.number || res.specials?.includes(newEntry.number));
    });
    if (match && onMatch) onMatch(match, newEntry.number);
  };

  const removeMyNumber = (id: string) => setMyNumbers(myNumbers.filter(n => n.id !== id));

  const handleBulkDelete = () => {
    setMyNumbers(myNumbers.filter(n => !selectedMyNumbers.has(n.id)));
    setSelectedMyNumbers(new Set());
  };

  const toggleSelect = (id: string) => {
    const next = new Set(selectedMyNumbers);
    if (next.has(id)) next.delete(id);
    else next.add(id);
    setSelectedMyNumbers(next);
  };

  const handleExport = () => {
    const csv = [
      ['Provider', 'Date', 'Draw#', '1st', '2nd', '3rd'].join(','),
      ...filteredResults.map(r => [r.provider, r.drawDate, r.drawNumber, r.first, r.second, r.third].join(','))
    ].join('\n');
    const blob = new Blob([csv], { type: 'text/csv' });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `nexus_export_${Date.now()}.csv`;
    a.click();
  };

  const filteredMyNumbers = useMemo(() => {
    return myNumbers
      .filter(n => 
        n.number.includes(watchlistSearch) || 
        (n.note?.toLowerCase().includes(watchlistSearch.toLowerCase()))
      )
      .sort((a, b) => {
        if (watchlistSort === 'number') return a.number.localeCompare(b.number);
        return b.timestamp - a.timestamp;
      });
  }, [myNumbers, watchlistSearch, watchlistSort]);

  const saveNote = (id: string) => {
    setMyNumbers(prev => prev.map(n => n.id === id ? { ...n, note: tempNote } : n));
    setEditingNoteId(null);
  };

  // Indicators for active filters
  const isSearchActive = !!searchNumber;
  const isProviderActive = selectedProvider !== 'All';
  const isDateActive = !!startDate || !!endDate;
  const isDaysActive = selectedDays.length > 0;

  return (
    <div className="space-y-8 animate-in fade-in slide-in-from-bottom-6 duration-700 pb-20">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6">
        <div className="space-y-1">
          <h2 className="text-3xl font-orbitron font-bold flex items-center gap-4">
            <div className="w-1.5 h-10 bg-blue-600 rounded-full shadow-[0_0_15px_rgba(59,130,246,0.8)]" />
            {t.nav.archive}
          </h2>
          <p className="text-[10px] text-slate-500 font-black uppercase tracking-[0.3em] px-5">Deep Temporal Ledger Synchronization</p>
        </div>
        <div className="flex items-center gap-3">
           <button 
             onClick={() => setShowPatternAnalysis(!showPatternAnalysis)}
             className={`flex items-center gap-2 px-6 py-3 rounded-2xl border text-[10px] font-black uppercase tracking-widest transition-all shadow-lg ${showPatternAnalysis ? 'bg-blue-600/20 border-blue-500 text-blue-400' : 'bg-white/5 border-white/10 text-slate-400'}`}
           >
             <BarChart3 size={14} /> Pattern Analysis
           </button>
           <button 
            onClick={resetFilters} 
            className="flex items-center gap-2 px-6 py-3 rounded-2xl bg-red-600/10 border border-red-500/30 text-[10px] font-black uppercase tracking-widest hover:bg-red-600/20 transition-all text-red-500 active:scale-95 shadow-lg"
          >
            <RotateCcw size={14} /> Clear Matrix
          </button>
        </div>
      </div>

      {showPatternAnalysis && (
        <div className="glass p-8 rounded-[3rem] border border-blue-500/20 bg-blue-600/[0.02] animate-in zoom-in duration-500">
           <div className="flex justify-between items-center mb-8">
              <div>
                 <h3 className="text-xl font-orbitron font-bold text-white flex items-center gap-3">
                    <Activity className="text-blue-500" size={20} /> Neural Frequency Heatmap
                 </h3>
                 <p className="text-[10px] text-slate-500 font-black uppercase tracking-widest">Global digit distribution in filtered results</p>
              </div>
              <button onClick={() => setShowPatternAnalysis(false)} className="p-2 text-slate-500 hover:text-white"><X size={20}/></button>
           </div>
           
           <div className="h-64 w-full">
              <ResponsiveContainer width="100%" height="100%">
                <RechartsBarChart data={patternData}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#ffffff05" vertical={false} />
                  <XAxis dataKey="digit" axisLine={false} tickLine={false} tick={{fill: '#64748b', fontSize: 12, fontWeight: 'bold'}} />
                  <YAxis hide />
                  <Tooltip 
                    cursor={{fill: '#ffffff05'}}
                    contentStyle={{backgroundColor: '#0a0a0a', border: '1px solid #ffffff10', borderRadius: '12px'}}
                    itemStyle={{color: '#3b82f6', fontWeight: 'bold', fontSize: '12px'}}
                  />
                  <Bar dataKey="count" radius={[8, 8, 0, 0]} barSize={40}>
                    {patternData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={parseInt(entry.digit) % 2 === 0 ? '#3b82f6' : '#8b5cf6'} fillOpacity={0.8} />
                    ))}
                  </Bar>
                </RechartsBarChart>
              </ResponsiveContainer>
           </div>
        </div>
      )}

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2 space-y-8">
          <div className="glass p-6 sm:p-10 rounded-[3rem] border border-white/10 bg-gradient-to-br from-blue-600/[0.03] via-transparent to-transparent space-y-8 shadow-2xl relative overflow-hidden">
            <div className="absolute top-0 right-0 w-64 h-64 bg-blue-500/5 blur-[100px] pointer-events-none" />
            
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-5">
              <div className={`lg:col-span-2 relative group transition-all ${isSearchActive ? 'ring-2 ring-blue-500/30 bg-blue-500/5 rounded-[1.5rem]' : ''}`}>
                <input 
                  type="text" maxLength={4} placeholder="Scan Signature (e.g. 8492)..."
                  value={searchNumber} onChange={(e) => setSearchNumber(e.target.value.replace(/\D/g, ''))}
                  className="w-full bg-black/60 border border-white/10 rounded-[1.5rem] px-12 py-4.5 text-sm font-orbitron tracking-widest focus:outline-none focus:border-blue-500/50 transition-all text-white placeholder:text-slate-700 shadow-inner group-hover:border-white/20"
                />
                <Search className={`absolute left-4 top-1/2 -translate-y-1/2 transition-colors ${isSearchActive ? 'text-blue-500' : 'text-slate-600'}`} size={20} />
                {searchNumber && <button onClick={() => setSearchNumber('')} className="absolute right-4 top-1/2 -translate-y-1/2 p-2 rounded-xl bg-white/5 text-slate-500 hover:text-white transition-all"><X size={16} /></button>}
              </div>

              <div className={`relative group transition-all ${startDate ? 'ring-2 ring-blue-500/30 bg-blue-500/5 rounded-[1.5rem]' : ''}`}>
                <input type="date" value={startDate} onChange={e => setStartDate(e.target.value)} className="w-full bg-black/60 border border-white/10 rounded-[1.5rem] px-10 py-4.5 text-[9px] font-black uppercase focus:outline-none focus:border-blue-500/50 text-white [color-scheme:dark] shadow-inner group-hover:border-white/20" />
                <Calendar className={`absolute left-4 top-1/2 -translate-y-1/2 transition-colors ${startDate ? 'text-blue-500' : 'text-slate-600'}`} size={16} />
              </div>

              <div className={`relative group transition-all ${endDate ? 'ring-2 ring-blue-500/30 bg-blue-500/5 rounded-[1.5rem]' : ''}`}>
                <input type="date" value={endDate} onChange={e => setEndDate(e.target.value)} className="w-full bg-black/60 border border-white/10 rounded-[1.5rem] px-10 py-4.5 text-[9px] font-black uppercase focus:outline-none focus:border-blue-500/50 text-white [color-scheme:dark] shadow-inner group-hover:border-white/20" />
                <ArrowRight className={`absolute left-4 top-1/2 -translate-y-1/2 transition-colors ${endDate ? 'text-blue-500' : 'text-slate-600'}`} size={16} />
              </div>
            </div>

            <div className="flex flex-col sm:flex-row gap-5">
              <div className={`flex-1 relative group transition-all ${isProviderActive ? 'ring-2 ring-blue-500/30 bg-blue-500/5 rounded-[1.5rem]' : ''}`}>
                <select 
                  value={selectedProvider} 
                  onChange={(e) => setSelectedProvider(e.target.value as any)} 
                  className="w-full bg-black/60 border border-white/10 rounded-[1.5rem] px-12 py-4.5 text-[10px] font-black uppercase appearance-none focus:outline-none focus:border-blue-500/50 text-white cursor-pointer group-hover:border-white/20"
                >
                  <option value="All">Global Ledger (All Operators)</option>
                  {Object.values(LotteryProvider).map(p => <option key={p} value={p}>{p}</option>)}
                </select>
                <LayoutGrid className={`absolute left-4 top-1/2 -translate-y-1/2 transition-colors ${isProviderActive ? 'text-blue-500' : 'text-slate-600'}`} size={18} />
                <ChevronDown className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-600 pointer-events-none" size={16} />
              </div>

              <div className="flex items-center gap-2 glass p-2 rounded-[1.5rem] border border-white/10">
                 {['Wed', 'Sat', 'Sun', 'Special'].map(day => (
                   <button
                     key={day} onClick={() => toggleDay(day)}
                     className={`flex-1 min-w-[70px] py-3 rounded-xl text-[9px] font-black uppercase transition-all border active:scale-95 ${selectedDays.includes(day) ? 'bg-blue-600 border-blue-400 text-white shadow-[0_0_15px_rgba(59,130,246,0.4)]' : 'bg-transparent border-transparent text-slate-500 hover:bg-white/5 hover:text-slate-300'}`}
                   >
                     {day}
                   </button>
                 ))}
              </div>
            </div>
          </div>

          <div className="space-y-6">
            <div className="flex items-center justify-between px-4">
               <div className="flex items-center gap-4">
                  <div className="p-3 bg-blue-600/10 rounded-2xl text-blue-500 shadow-xl"><Database size={20}/></div>
                  <div>
                    <span className="text-[10px] font-black uppercase text-slate-500 tracking-[0.4em]">Ledger Stream</span>
                    <p className="text-xs font-bold text-slate-200 uppercase">{filteredResults.length} Matching Temporal Points</p>
                  </div>
               </div>
               <div className="flex items-center gap-3">
                  {filteredResults.length > 0 && (
                    <button 
                      onClick={handleExport}
                      className="p-3 rounded-xl glass border border-white/10 text-slate-400 hover:text-white hover:border-blue-500/50 transition-all flex items-center gap-2 text-[9px] font-black uppercase tracking-widest"
                    >
                      <Download size={14}/> Export CSV
                    </button>
                  )}
                  {searchNumber && (
                    <div className="flex items-center gap-2 px-4 py-2 rounded-full bg-amber-500/10 border border-amber-500/20 animate-pulse">
                        <Zap size={12} className="text-amber-500" />
                        <span className="text-[8px] font-black text-amber-500 uppercase tracking-widest">Active Analysis: {searchNumber}</span>
                    </div>
                  )}
               </div>
            </div>

            <div className="space-y-8">
              {filteredResults.length > 0 ? filteredResults.map((res, i) => (
                <ResultCard 
                  key={i} 
                  result={res} 
                  lang={lang} 
                  isLoggedIn={isLoggedIn} 
                  onGuestAttempt={onGuestAttempt} 
                  highlightQuery={searchNumber} 
                  isFavorite={isFavorite?.(res)}
                  onToggleFavorite={() => onToggleFavorite?.(res)}
                  onShare={(e) => { e.stopPropagation(); onShare?.(res); }}
                />
              )) : (
                <div className="glass rounded-[3rem] p-32 text-center border border-dashed border-white/10 space-y-6">
                  <div className="w-24 h-24 bg-white/5 rounded-full flex items-center justify-center mx-auto shadow-2xl">
                    <Database className="text-slate-800" size={48} />
                  </div>
                  <div className="space-y-2">
                    <h3 className="text-2xl font-orbitron font-bold text-slate-600 uppercase tracking-[0.3em]">Signal Terminated</h3>
                    <p className="text-sm text-slate-500 max-w-xs mx-auto">Neural filters yielded zero convergence points. Recalibrate temporal range.</p>
                  </div>
                  <ShadowButton variant="secondary" onClick={resetFilters} className="px-10 py-3">Reset Core Filter</ShadowButton>
                </div>
              )}
            </div>
          </div>
        </div>

        <div className="space-y-8">
           <div className="glass p-8 rounded-[3rem] border border-amber-500/20 bg-amber-500/[0.02] space-y-8 relative overflow-hidden shadow-2xl">
             <div className="absolute top-0 right-0 w-32 h-32 bg-amber-500/10 blur-[60px] pointer-events-none" />
             <div className="flex items-center justify-between">
                <div className="flex items-center gap-4">
                  <div className="p-3 bg-amber-500 rounded-2xl shadow-[0_0_20px_rgba(245,158,11,0.3)]">
                    <Target className="text-black" size={24} />
                  </div>
                  <div>
                    <h3 className="text-xl font-orbitron font-bold text-white">The Vault</h3>
                    <p className="text-[10px] text-amber-500 font-black uppercase tracking-widest">Personal Saving Nodes</p>
                  </div>
                </div>
                {selectedMyNumbers.size > 0 && (
                  <button onClick={handleBulkDelete} className="p-3 rounded-xl bg-red-600/20 text-red-500 border border-red-500/30 hover:bg-red-600 transition-all hover:text-white">
                    <Trash2 size={18} />
                  </button>
                )}
             </div>

             <div className="space-y-5">
                <div className="p-6 rounded-[2rem] bg-black/60 border border-white/10 space-y-5 shadow-inner">
                   <div className="space-y-4">
                      <div className="relative group">
                        <input 
                          type="text" maxLength={4} placeholder="0000" 
                          value={inputNum} onChange={(e) => setInputNum(e.target.value.replace(/\D/g, ''))} 
                          className="w-full bg-black/80 border border-white/10 rounded-2xl px-12 py-4 text-lg font-orbitron tracking-[0.4em] focus:border-amber-500/50 outline-none text-white shadow-inner group-hover:border-white/20 transition-all" 
                        />
                        <Hash size={18} className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-600" />
                      </div>
                      <div className="relative group">
                         <select 
                           value={inputProvider} 
                           onChange={(e) => setInputProvider(e.target.value as any)}
                           className="w-full bg-black/80 border border-white/10 rounded-2xl px-5 py-4 text-[10px] font-black uppercase appearance-none text-slate-400 outline-none focus:border-blue-500/50 cursor-pointer"
                         >
                            <option value="All">All Operators</option>
                            {Object.values(LotteryProvider).map(p => <option key={p} value={p}>{p}</option>)}
                         </select>
                         <ChevronDown className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-600 pointer-events-none" size={16} />
                      </div>
                      <div className="relative group">
                        <textarea 
                          placeholder="Add neural note..." 
                          value={inputNote} onChange={(e) => setInputNote(e.target.value)}
                          className="w-full bg-black/80 border border-white/10 rounded-2xl px-5 py-4 text-xs font-medium focus:border-blue-500/50 outline-none text-slate-300 shadow-inner group-hover:border-white/20 transition-all h-20 resize-none"
                        />
                      </div>
                   </div>
                   <ShadowButton onClick={handleAddMyNumber} variant="gold" disabled={inputNum.length !== 4} className="w-full py-4.5 text-[11px] font-black uppercase flex items-center justify-center gap-3 shadow-[0_10px_25px_-5px_rgba(245,158,11,0.3)]">
                     <Plus size={20} /> COMMIT SIGNATURE
                   </ShadowButton>
                </div>

                <div className="space-y-4">
                  <div className="flex items-center gap-3 bg-white/5 p-2 rounded-2xl border border-white/10">
                    <div className="relative flex-1">
                      <input 
                        type="text" placeholder="Search nodes or notes..." 
                        value={watchlistSearch} onChange={e => setWatchlistSearch(e.target.value)}
                        className="w-full bg-transparent border-none focus:outline-none text-[10px] text-white px-4 py-2" 
                      />
                      <Search size={14} className="absolute left-0 top-1/2 -translate-y-1/2 text-slate-600" />
                    </div>
                    <button onClick={() => setWatchlistSort(watchlistSort === 'date' ? 'number' : 'date')} className="p-2 text-slate-500 hover:text-white transition-all">
                      <ArrowUpDown size={14} />
                    </button>
                  </div>

                  <div className="space-y-3 max-h-[400px] overflow-y-auto custom-scrollbar pr-2">
                    {filteredMyNumbers.length > 0 ? filteredMyNumbers.map((entry) => (
                      <div 
                        key={entry.id} 
                        className={`p-4 rounded-2xl border flex flex-col gap-3 group transition-all shadow-sm ${selectedMyNumbers.has(entry.id) ? 'bg-blue-600/10 border-blue-500/50' : 'bg-white/5 border-white/5 hover:bg-white/10'}`}
                      >
                          <div className="flex items-center justify-between">
                            <div className="flex items-center gap-4">
                              <button onClick={() => toggleSelect(entry.id)} className="text-slate-600 hover:text-blue-500 transition-colors">
                                {selectedMyNumbers.has(entry.id) ? <CheckSquare size={16} /> : <Square size={16} />}
                              </button>
                              <div className="w-14 h-14 rounded-2xl bg-blue-600/10 text-blue-400 font-orbitron font-black text-lg flex items-center justify-center border border-blue-500/10 group-hover:scale-110 transition-transform">{entry.number}</div>
                              <div>
                                <p className="text-[10px] font-black text-slate-300 uppercase truncate max-w-[100px]">{entry.provider}</p>
                                <div className="flex items-center gap-1.5 mt-0.5 text-slate-600 font-bold uppercase text-[8px]">
                                  <Clock size={10} /> {new Date(entry.timestamp).toLocaleDateString()}
                                </div>
                              </div>
                            </div>
                            <button onClick={() => removeMyNumber(entry.id)} className="p-3 text-slate-700 hover:text-red-500 transition-all opacity-0 group-hover:opacity-100 bg-black/40 rounded-xl"><Trash2 size={16} /></button>
                          </div>
                          
                          <div className="px-1 border-t border-white/5 pt-3">
                            {editingNoteId === entry.id ? (
                              <div className="flex gap-2">
                                <input 
                                  autoFocus 
                                  className="flex-1 bg-black/60 border border-white/10 rounded-lg px-3 py-1.5 text-[10px] text-slate-300 outline-none" 
                                  value={tempNote} onChange={e => setTempNote(e.target.value)} 
                                  onKeyDown={e => e.key === 'Enter' && saveNote(entry.id)}
                                />
                                <button onClick={() => saveNote(entry.id)} className="p-1.5 bg-blue-600 text-white rounded-lg"><CheckCircle2 size={14}/></button>
                              </div>
                            ) : (
                              <div className="flex items-start justify-between gap-2 group/note">
                                <p className="text-[9px] text-slate-500 font-medium italic leading-relaxed flex items-start gap-2">
                                  <StickyNote size={12} className="shrink-0 text-slate-700" />
                                  {entry.note || "No neural notes attached."}
                                </p>
                                <button 
                                  onClick={() => { setEditingNoteId(entry.id); setTempNote(entry.note || ''); }}
                                  className="p-1 text-slate-700 hover:text-blue-500 opacity-0 group-hover/note:opacity-100 transition-all"
                                >
                                  <Edit3 size={10} />
                                </button>
                              </div>
                            )}
                          </div>
                      </div>
                    )) : (
                      <div className="py-20 text-center space-y-3 opacity-20 group-hover:opacity-40 transition-opacity">
                          <Database size={48} className="mx-auto text-slate-600" />
                          <p className="text-[10px] font-black uppercase tracking-[0.2em] text-slate-500">Node Vault Empty</p>
                      </div>
                    )}
                  </div>
                </div>
             </div>

             <div className="pt-6 border-t border-white/10 flex flex-col items-center gap-4">
                <div className="flex items-center gap-3">
                   <CheckCircle2 size={16} className="text-green-500" />
                   <span className="text-[9px] font-black text-slate-500 uppercase tracking-widest">Neural Watch Active</span>
                </div>
                <p className="text-[8px] text-center text-slate-700 font-medium uppercase italic leading-relaxed">
                   Syncing your vault signatures with global real-time streams automatically.
                </p>
             </div>
           </div>
        </div>
      </div>
    </div>
  );
};
