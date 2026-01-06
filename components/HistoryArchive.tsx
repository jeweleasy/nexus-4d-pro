
import React, { useState, useMemo, useEffect } from 'react';
import { 
  Search, 
  Calendar, 
  Filter, 
  Clock, 
  Download, 
  ChevronRight, 
  History, 
  Database, 
  Sparkles, 
  TrendingUp, 
  Info, 
  CheckCircle2, 
  Settings, 
  X, 
  Activity, 
  Server, 
  Zap, 
  Loader2, 
  Check, 
  Globe, 
  ShieldCheck, 
  Box, 
  AlertTriangle, 
  Target, 
  Plus, 
  Hash,
  Trash2,
  Bell,
  ShieldAlert,
  ChevronDown,
  ArrowUpRight,
  Flame
} from 'lucide-react';
import { MOCK_RESULTS, LANGUAGES, HOT_NUMBERS } from '../constants';
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

const Tooltip: React.FC<{ text: string; children: React.ReactNode }> = ({ text, children }) => (
  <div className="group relative">
    {children}
    <div className="absolute bottom-full left-1/2 -translate-x-1/2 mb-3 w-56 px-4 py-2.5 bg-[#0a0a0a] border border-blue-500/30 text-[10px] font-bold text-slate-300 uppercase tracking-widest rounded-2xl opacity-0 group-hover:opacity-100 pointer-events-none transition-all z-[210] shadow-[0_10px_30px_rgba(0,0,0,0.5)] backdrop-blur-xl">
      <p className="leading-relaxed">{text}</p>
      <div className="absolute top-full left-1/2 -translate-x-1/2 w-3 h-3 bg-[#0a0a0a] border-r border-b border-blue-500/30 rotate-45 -mt-1.5"></div>
    </div>
  </div>
);

export const HistoryArchive: React.FC<HistoryArchiveProps> = ({ lang, isLoggedIn = false, onGuestAttempt, onMatch }) => {
  const [searchNumber, setSearchNumber] = useState('');
  const [selectedProvider, setSelectedProvider] = useState<LotteryProvider | 'All'>('All');
  const [selectedYear, setSelectedYear] = useState('2024');
  const [drawDayFilter, setDrawDayFilter] = useState<'All' | 'Wed' | 'Sat' | 'Sun' | 'Special'>('All');
  const [isScanning, setIsScanning] = useState(false);
  const [isExporting, setIsExporting] = useState(false);
  const [scanProgress, setScanProgress] = useState(0);
  const [scanStage, setScanStage] = useState('');
  const [showExportModal, setShowExportModal] = useState(false);
  const [showClearConfirm, setShowClearConfirm] = useState(false);
  
  // Watchlist State (Integrated with global nexus_watchlist)
  const [watchedNumbers, setWatchedNumbers] = useState<WatchedNumber[]>([]);
  const [monitorNum, setMonitorNum] = useState('');
  const [monitorProvider, setMonitorProvider] = useState<LotteryProvider | 'All'>('All');

  const [exportConfig, setExportConfig] = useState({
    includeMain: true,
    includeSpecial: true,
    includeConsolation: false,
    format: 'CSV' as 'CSV' | 'JSON' | 'PDF'
  });
  
  const t = LANGUAGES[lang];

  useEffect(() => {
    const saved = localStorage.getItem('nexus_watchlist');
    if (saved) setWatchedNumbers(JSON.parse(saved));
  }, []);

  const saveWatchlist = (list: WatchedNumber[]) => {
    setWatchedNumbers(list);
    localStorage.setItem('nexus_watchlist', JSON.stringify(list));
  };

  const cacheStatus = useMemo(() => {
    return {
      status: 'Updated',
      node: 'SG-PO-01',
      lastSync: '112s ago',
      integrity: '99.98%'
    };
  }, []);

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
      const day = date.getDay(); // 0=Sun, 3=Wed, 6=Sat
      
      let matchDay = true;
      if (drawDayFilter === 'Wed') matchDay = day === 3;
      else if (drawDayFilter === 'Sat') matchDay = day === 6;
      else if (drawDayFilter === 'Sun') matchDay = day === 0;
      else if (drawDayFilter === 'Special') {
        matchDay = ![0, 3, 6].includes(day);
      }

      return matchProvider && matchNumber && matchYear && matchDay;
    }).sort((a, b) => b.timestamp - a.timestamp);
  }, [searchNumber, selectedProvider, selectedYear, drawDayFilter]);

  // Real-time lookup statistics
  const searchStats = useMemo(() => {
    if (!searchNumber || searchNumber.length < 2) return null;
    let hits = 0;
    filteredResults.forEach(res => {
      if (res.first === searchNumber || res.second === searchNumber || res.third === searchNumber) hits++;
      if (res.specials?.includes(searchNumber)) hits++;
      if (res.consolations?.includes(searchNumber)) hits++;
    });
    return { hits };
  }, [searchNumber, filteredResults]);

  const handleMonitorAdd = () => {
    if (!isLoggedIn) {
      onGuestAttempt?.();
      return;
    }
    if (monitorNum.length !== 4) return;

    const newEntry: WatchedNumber = {
      id: Math.random().toString(36).substring(2, 9),
      number: monitorNum,
      provider: monitorProvider,
      timestamp: Date.now()
    };

    const newList = [newEntry, ...watchedNumbers];
    saveWatchlist(newList);
    setMonitorNum('');

    // Immediate check against all history
    const match = MOCK_RESULTS.find(res => {
      const providerMatch = monitorProvider === 'All' || res.provider === monitorProvider;
      if (!providerMatch) return false;
      return res.first === monitorNum || res.second === monitorNum || res.third === monitorNum || res.specials?.includes(monitorNum) || res.consolations?.includes(monitorNum);
    });

    if (match) {
      onMatch?.(match, monitorNum);
    }
  };

  const handleRemoveWatched = (id: string) => {
    saveWatchlist(watchedNumbers.filter(n => n.id !== id));
  };

  const handleDeepScan = () => {
    setIsScanning(true);
    setScanProgress(0);
    setScanStage('Initializing Quorum...');
    
    const stages = [
      { p: 15, s: 'Genesis Node Ping...' },
      { p: 40, s: 'Aggregating Signatures...' },
      { p: 70, s: 'Validating Checksums...' },
      { p: 90, s: 'Writing Local Cache...' },
      { p: 100, s: 'Sync Complete' }
    ];

    stages.forEach((stage, i) => {
      setTimeout(() => {
        setScanProgress(stage.p);
        setScanStage(stage.s);
        if (stage.p === 100) {
          setTimeout(() => setIsScanning(false), 500);
        }
      }, (i + 1) * 600);
    });
  };

  const triggerDownload = (filename: string, content: string, mimeType: string) => {
    const blob = new Blob([content], { type: mimeType });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = filename;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
  };

  const handleExport = () => {
    if (exportConfig.format === 'PDF') {
      alert("PDF Export Engine is currently under maintenance. Please use CSV or JSON.");
      return;
    }

    if (filteredResults.length === 0) {
      alert("No results found to export.");
      return;
    }

    setIsExporting(true);

    setTimeout(() => {
      const dataToExport = filteredResults.map(res => {
        const obj: any = {
          date: res.drawDate,
          draw: res.drawNumber,
          provider: res.provider,
          type: res.type
        };
        if (exportConfig.includeMain) {
          obj.first = res.first;
          obj.second = res.second || '';
          obj.third = res.third || '';
        }
        if (exportConfig.includeSpecial) {
          obj.specials = res.specials?.join(' ') || '';
        }
        if (exportConfig.includeConsolation) {
          obj.consolations = res.consolations?.join(' ') || '';
        }
        return obj;
      });

      if (exportConfig.format === 'JSON') {
        const content = JSON.stringify(dataToExport, null, 2);
        triggerDownload(`4D_Nexus_Archive_${selectedYear}.json`, content, 'application/json');
      } else if (exportConfig.format === 'CSV') {
        const headers = Object.keys(dataToExport[0]);
        const csvRows = [
          headers.join(','),
          ...dataToExport.map((row: any) => 
            headers.map(fieldName => JSON.stringify(row[fieldName], (key, value) => value ?? '')).join(',')
          )
        ];
        triggerDownload(`4D_Nexus_Archive_${selectedYear}.csv`, csvRows.join('\r\n'), 'text/csv');
      }

      setIsExporting(false);
      setShowExportModal(false);
    }, 1500);
  };

  return (
    <div className="space-y-8 animate-in fade-in slide-in-from-bottom-6 duration-700">
      {showExportModal && (
        <div className="fixed inset-0 z-[200] flex items-center justify-center p-4">
          <div className="absolute inset-0 bg-black/80 backdrop-blur-md" onClick={() => !isExporting && setShowExportModal(false)}></div>
          <div className="relative w-full max-w-md glass rounded-[2.5rem] border border-white/10 p-8 space-y-8 animate-in zoom-in duration-300">
            <div className="flex justify-between items-center">
              <h3 className="text-xl font-orbitron font-bold flex items-center gap-3">
                <Download size={20} className="text-blue-500" />
                Export Protocol
              </h3>
              {!isExporting && (
                <button onClick={() => setShowExportModal(false)} className="p-2 text-slate-500 hover:text-white transition-colors">
                  <X size={20} />
                </button>
              )}
            </div>

            <div className="space-y-6">
              <div className="space-y-3">
                <label className="text-[10px] font-black uppercase text-slate-500 tracking-widest px-1">Configure Data Columns</label>
                <div className="grid grid-cols-1 gap-2">
                  {[
                    { key: 'includeMain' as const, label: 'Main Tier (1st-3rd)', icon: TrendingUp },
                    { key: 'includeSpecial' as const, label: 'Special Tier', icon: Sparkles },
                    { key: 'includeConsolation' as const, label: 'Consolation Tier', icon: CheckCircle2 }
                  ].map((field) => (
                    <button 
                      key={field.key}
                      disabled={isExporting}
                      onClick={() => setExportConfig({...exportConfig, [field.key]: !exportConfig[field.key]})}
                      className={`flex items-center justify-between p-4 rounded-xl border transition-all ${exportConfig[field.key] ? 'bg-blue-600/10 border-blue-500/30 text-white' : 'bg-white/5 border-white/5 text-slate-500'}`}
                    >
                      <div className="flex items-center gap-3">
                        <field.icon size={16} />
                        <span className="text-xs font-bold">{field.label}</span>
                      </div>
                      {exportConfig[field.key] ? <div className="w-5 h-5 rounded-full bg-blue-500 flex items-center justify-center"><Check size={12} className="text-white"/></div> : <div className="w-5 h-5 rounded-full border border-slate-700" />}
                    </button>
                  ))}
                </div>
              </div>

              <div className="space-y-3">
                <label className="text-[10px] font-black uppercase text-slate-500 tracking-widest px-1">Target Format</label>
                <div className="flex gap-2">
                  {(['CSV', 'JSON', 'PDF'] as const).map(fmt => (
                    <button 
                      key={fmt}
                      disabled={isExporting}
                      onClick={() => setExportConfig({...exportConfig, format: fmt})}
                      className={`flex-1 py-3 rounded-xl border text-[10px] font-black tracking-widest transition-all ${exportConfig.format === fmt ? 'bg-blue-600 text-white border-blue-400' : 'bg-white/5 border-white/5 text-slate-500 hover:border-white/20'}`}
                    >
                      {fmt}
                    </button>
                  ))}
                </div>
              </div>
            </div>

            <ShadowButton 
              onClick={handleExport} 
              variant="primary" 
              disabled={isExporting}
              className="w-full py-4 text-xs font-black uppercase tracking-widest flex items-center justify-center gap-3"
            >
              {isExporting ? (
                <>
                  <Loader2 size={18} className="animate-spin" />
                  SEALING PACKETS...
                </>
              ) : (
                'Initiate Secure Download'
              )}
            </ShadowButton>
          </div>
        </div>
      )}

      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
          <h2 className="text-3xl font-orbitron font-bold flex items-center gap-3 text-slate-900 dark:text-white">
            <History className="text-blue-500" size={28} />
            {t.nav.archive}
          </h2>
          <div className="flex flex-wrap items-center gap-4 mt-2">
            <div className="flex items-center gap-2 px-3 py-1 rounded-full bg-green-500/10 border border-green-500/20">
               <div className="w-1.5 h-1.5 rounded-full bg-green-500 animate-pulse"></div>
               <span className="text-[10px] font-black text-green-500 uppercase tracking-widest">Archive Sync: {cacheStatus.status}</span>
            </div>
            <div className="flex items-center gap-2 text-[10px] font-bold text-slate-500 uppercase">
               <Server size={12} className="text-slate-600" />
               Consensus Node: {cacheStatus.node}
            </div>
          </div>
        </div>
        <div className="flex gap-3">
          <button onClick={() => setShowExportModal(true)} className="flex items-center gap-2 px-6 py-2.5 rounded-xl glass border border-white/10 text-[10px] font-black uppercase tracking-widest hover:border-blue-500/30 transition-all text-blue-400 shadow-lg">
            <Download size={14} /> EXPORT DATA
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2 space-y-8">
          {/* Enhanced Neural Search Console */}
          <div className="glass p-8 rounded-[2.5rem] border border-white/10 bg-gradient-to-br from-blue-600/5 to-transparent space-y-6">
            <div className="space-y-4">
              <div className="flex items-center justify-between px-1">
                 <div className="flex items-center gap-2 text-[10px] font-black uppercase text-blue-500 tracking-[0.2em]">
                    <Search size={14} /> 
                    Neural Number Lookup
                 </div>
                 {searchStats && searchStats.hits > 0 && (
                   <div className="flex items-center gap-2 px-3 py-1 rounded-full bg-blue-500/10 border border-blue-500/20 animate-in fade-in slide-in-from-right-2">
                      <Flame size={12} className="text-amber-500" />
                      <span className="text-[9px] font-black text-blue-400 uppercase tracking-tighter">Matches Found: {searchStats.hits} Hits</span>
                   </div>
                 )}
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                <div className="md:col-span-2 relative group">
                  <input 
                    type="text" 
                    maxLength={4}
                    placeholder="Scan specific number (e.g. 8888)..."
                    value={searchNumber}
                    onChange={(e) => setSearchNumber(e.target.value.replace(/\D/g, ''))}
                    className="w-full bg-black/40 border border-white/10 rounded-2xl px-12 py-5 text-sm font-orbitron focus:outline-none focus:border-blue-500/50 transition-all text-white placeholder:text-slate-700 shadow-inner group-focus-within:border-blue-500/40"
                  />
                  <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-500 group-focus-within:text-blue-500 transition-colors" size={20} />
                  
                  {searchNumber && (
                    <div className="absolute right-4 top-1/2 -translate-y-1/2 flex items-center gap-2">
                      {showClearConfirm ? (
                        <div className="flex items-center gap-2 animate-in slide-in-from-right-2 duration-300">
                          <button 
                            onClick={() => { setSearchNumber(''); setShowClearConfirm(false); }}
                            className="text-[9px] font-black uppercase text-white bg-red-600 px-3 py-1 rounded shadow-lg"
                          >
                            WIPE
                          </button>
                          <button onClick={() => setShowClearConfirm(false)} className="text-slate-500"><X size={14}/></button>
                        </div>
                      ) : (
                        <button onClick={() => setShowClearConfirm(true)} className="text-[9px] font-black uppercase text-blue-500 hover:text-white bg-blue-500/10 px-2 py-1 rounded transition-all">CLEAR</button>
                      )}
                    </div>
                  )}
                </div>

                <div className="relative">
                  <select 
                    value={selectedProvider}
                    onChange={(e) => setSelectedProvider(e.target.value as any)}
                    className="w-full h-full bg-black/40 border border-white/10 rounded-2xl px-10 py-4 text-[10px] font-black uppercase appearance-none focus:outline-none focus:border-blue-500/50 text-white cursor-pointer"
                  >
                    <option value="All">All Operators</option>
                    {Object.values(LotteryProvider).map(p => (
                      <option key={p} value={p}>{p}</option>
                    ))}
                  </select>
                  <Filter className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-500 pointer-events-none" size={16} />
                  <ChevronDown className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-700 pointer-events-none" size={14} />
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
                  <ChevronDown className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-700 pointer-events-none" size={14} />
                </div>
              </div>

              {/* Quick Search Chips */}
              <div className="flex flex-wrap items-center gap-2 pt-2">
                 <span className="text-[8px] font-black uppercase text-slate-600 tracking-widest mr-2">Frequent Signatures:</span>
                 {HOT_NUMBERS.slice(0, 5).map(hot => (
                   <button 
                     key={hot.number}
                     onClick={() => setSearchNumber(hot.number)}
                     className={`px-3 py-1.5 rounded-full text-[9px] font-bold font-orbitron transition-all border ${searchNumber === hot.number ? 'bg-amber-500 text-black border-amber-400' : 'bg-white/5 border-white/10 text-slate-400 hover:text-white hover:border-white/20'}`}
                   >
                     {hot.number}
                   </button>
                 ))}
              </div>
            </div>

            <div className="flex flex-wrap items-center gap-3 border-t border-white/5 pt-6">
               <span className="text-[10px] font-black uppercase text-slate-500 tracking-[0.2em] mr-4">Temporal Filter:</span>
               {(['All', 'Wed', 'Sat', 'Sun', 'Special'] as const).map(day => (
                 <button
                   key={day}
                   onClick={() => setDrawDayFilter(day)}
                   className={`px-5 py-2.5 rounded-xl text-[10px] font-black uppercase tracking-tight border transition-all ${drawDayFilter === day ? 'bg-blue-600 border-blue-400 text-white shadow-[0_0_15px_rgba(59,130,246,0.3)]' : 'bg-white/5 border-white/5 text-slate-500 hover:border-white/20 hover:text-slate-300'}`}
                 >
                   {day === 'All' ? 'Full Archive' : day === 'Special' ? 'Special Draw' : `${day} Cycle`}
                 </button>
               ))}
            </div>
          </div>

          <div className="space-y-6">
            <div className="flex items-center justify-between px-2">
              <div className="flex items-center gap-4">
                <span className="text-[10px] font-black uppercase text-slate-500 tracking-[0.4em]">
                  {filteredResults.length} Node Signatures Found
                </span>
                {searchNumber && (
                  <div className="flex items-center gap-1.5 text-[9px] font-black text-blue-500 bg-blue-500/10 px-2 py-0.5 rounded border border-blue-500/20 animate-pulse">
                    <Zap size={10} /> Neural Lookup Active
                  </div>
                )}
              </div>
            </div>

            <div className="space-y-6">
              {filteredResults.length > 0 ? (
                filteredResults.map((res, i) => (
                  <ResultCard 
                    key={`${res.provider}-${res.drawDate}-${i}`} 
                    result={res} 
                    lang={lang} 
                    isLoggedIn={isLoggedIn} 
                    onGuestAttempt={onGuestAttempt} 
                    highlightQuery={searchNumber}
                  />
                ))
              ) : (
                <div className="glass rounded-[3rem] p-24 text-center border border-dashed border-white/10 relative overflow-hidden group">
                  <div className="absolute inset-0 bg-blue-600/[0.01] group-hover:bg-blue-600/[0.03] transition-colors" />
                  <Database className="mx-auto text-slate-800 mb-6 relative z-10" size={64} />
                  <h3 className="text-2xl font-orbitron font-bold text-slate-600 relative z-10">Data Mismatch</h3>
                  <p className="text-xs text-slate-600 mt-3 max-w-sm mx-auto leading-relaxed relative z-10 font-medium">The requested signal packet does not reside in the current local series. Initiate a cloud sync?</p>
                  
                  <div className="mt-10 max-w-xs mx-auto space-y-4 relative z-10">
                    {isScanning ? (
                      <div className="space-y-5 animate-in fade-in duration-500">
                         <div className="flex justify-between items-center text-[10px] font-black uppercase tracking-widest text-blue-500">
                            <span className="flex items-center gap-2">
                              <Loader2 size={12} className="animate-spin" /> 
                              {scanStage}
                            </span>
                            <span className="font-orbitron">{scanProgress}%</span>
                         </div>
                         <div className="h-2 w-full bg-white/5 rounded-full overflow-hidden border border-white/5 p-0.5">
                            <div 
                              className="h-full bg-blue-600 transition-all duration-300 shadow-[0_0_15px_rgba(59,130,246,0.6)] rounded-full"
                              style={{ width: `${scanProgress}%` }}
                            />
                         </div>
                      </div>
                    ) : (
                      <ShadowButton onClick={handleDeepScan} variant="primary" className="w-full py-4 text-xs font-black uppercase tracking-widest flex items-center justify-center gap-3">
                        <Globe size={18} /> INITIATE DEEP CLOUD SYNC
                      </ShadowButton>
                    )}
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Sidebar Controls in Archive */}
        <div className="space-y-8">
          {/* Watchlist Monitor Console */}
          <div className="glass p-8 rounded-[2rem] border border-amber-500/20 bg-gradient-to-br from-amber-600/5 to-transparent space-y-6">
             <div className="flex justify-between items-center">
                <h3 className="text-lg font-orbitron font-bold flex items-center gap-3 text-white">
                  <Target className="text-amber-500" size={20} />
                  My Signatures
                </h3>
                {!isLoggedIn && (
                  <div className="flex items-center gap-1.5 px-2 py-0.5 bg-red-500/10 rounded border border-red-500/20">
                    <ShieldAlert size={10} className="text-red-500" />
                    <span className="text-[7px] font-black text-red-500 uppercase tracking-tighter">Locked</span>
                  </div>
                )}
             </div>

             <div className="space-y-4">
                <div className="relative group">
                   <input 
                     type="text" 
                     maxLength={4}
                     placeholder="Register Number..."
                     value={monitorNum}
                     onChange={(e) => setMonitorNum(e.target.value.replace(/\D/g, ''))}
                     disabled={!isLoggedIn}
                     className="w-full bg-black/60 border border-white/10 rounded-xl px-10 py-3 text-xs font-orbitron tracking-[0.3em] focus:outline-none focus:border-amber-500/50 disabled:opacity-30 disabled:cursor-not-allowed transition-all"
                   />
                   <Hash className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-600 group-focus-within:text-amber-500 transition-colors" size={16} />
                </div>

                <div className="relative">
                   <select 
                     value={monitorProvider}
                     onChange={(e) => setMonitorProvider(e.target.value as any)}
                     disabled={!isLoggedIn}
                     className="w-full bg-black/60 border border-white/10 rounded-xl px-10 py-3 text-[10px] font-black uppercase appearance-none focus:outline-none focus:border-amber-500/50 cursor-pointer disabled:opacity-30 disabled:cursor-not-allowed transition-all"
                   >
                     <option value="All">All Archives</option>
                     {Object.values(LotteryProvider).map(p => (
                       <option key={p} value={p}>{p}</option>
                     ))}
                   </select>
                   <Settings className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-600" size={16} />
                   <ChevronDown className="absolute right-3.5 top-1/2 -translate-y-1/2 text-slate-700" size={14} />
                </div>

                <ShadowButton 
                  onClick={handleMonitorAdd}
                  variant="gold"
                  disabled={!isLoggedIn || monitorNum.length !== 4}
                  className="w-full py-3.5 text-[10px] font-black uppercase tracking-[0.2em] flex items-center justify-center gap-2 shadow-[0_0_15px_rgba(245,158,11,0.1)]"
                >
                  <Plus size={16} /> MONITOR NODE
                </ShadowButton>
             </div>

             <div className="pt-4 border-t border-white/5 space-y-3 max-h-[300px] overflow-y-auto custom-scrollbar pr-2">
                {watchedNumbers.length > 0 ? (
                  watchedNumbers.map((entry) => (
                    <div key={entry.id} className="p-3.5 rounded-2xl bg-white/5 border border-white/5 flex items-center justify-between group/item hover:border-blue-500/30 transition-all hover:bg-white/[0.08]">
                      <div className="flex items-center gap-4">
                        <div className="w-11 h-11 rounded-xl bg-blue-600/10 flex flex-col items-center justify-center font-orbitron font-bold text-blue-400 border border-blue-500/20 shadow-lg">
                           <span className="text-xs">{entry.number}</span>
                           <span className="text-[6px] opacity-40 -mt-0.5">ACTIVE</span>
                        </div>
                        <div className="overflow-hidden">
                          <p className="text-[9px] font-black text-slate-300 uppercase truncate max-w-[100px] tracking-widest">{entry.provider}</p>
                          <div className="flex items-center gap-1.5 mt-0.5">
                            <div className="w-1.5 h-1.5 rounded-full bg-green-500 animate-pulse"></div>
                            <span className="text-[7px] font-black text-slate-500 uppercase">Live Watch</span>
                          </div>
                        </div>
                      </div>
                      <button 
                        onClick={() => handleRemoveWatched(entry.id)}
                        className="p-2 text-slate-700 hover:text-red-500 transition-all md:opacity-0 group-hover/item:opacity-100"
                        title="Deregister node"
                      >
                        <Trash2 size={14} />
                      </button>
                    </div>
                  ))
                ) : (
                  <div className="py-12 text-center space-y-3 opacity-20 group-hover:opacity-40 transition-opacity">
                     <Bell size={40} className="mx-auto text-slate-600" />
                     <p className="text-[9px] font-black uppercase tracking-[0.3em] text-slate-500">No active signatures</p>
                  </div>
                )}
             </div>

             <div className="flex items-center gap-2 pt-2 px-2">
                <Info size={12} className="text-slate-700" />
                <p className="text-[8px] text-slate-600 uppercase font-black leading-tight italic">Matches trigger a system-wide high-priority neural notification.</p>
             </div>
          </div>

          {/* Quick Intelligence Panel */}
          <div className="glass p-8 rounded-[2rem] border border-white/10 space-y-6 relative overflow-hidden">
             <h3 className="text-lg font-orbitron font-bold flex items-center gap-3 text-white">
                <TrendingUp className="text-green-500" size={20} />
                Cloud Intelligence
             </h3>
             <div className="space-y-4">
                <div className="p-4 rounded-2xl bg-white/5 border border-white/5 hover:bg-white/10 transition-all cursor-default group/intel">
                   <p className="text-[9px] font-black uppercase text-slate-500 mb-1 tracking-widest group-hover/intel:text-blue-400 transition-colors">Global Freq Cluster</p>
                   <div className="flex justify-between items-center">
                      <span className="text-2xl font-orbitron font-bold text-white">2518</span>
                      <span className="text-[10px] font-black bg-blue-600/20 text-blue-400 px-3 py-1 rounded-full border border-blue-500/20 flex items-center gap-1">
                        <Activity size={10} /> 12 Hits
                      </span>
                   </div>
                </div>
                <div className="p-4 rounded-2xl bg-white/5 border border-white/5 hover:bg-white/10 transition-all cursor-default group/intel">
                   <p className="text-[9px] font-black uppercase text-slate-500 mb-1 tracking-widest group-hover/intel:text-red-400 transition-colors">Dormant "Sub-Zero" Void</p>
                   <div className="flex justify-between items-center">
                      <span className="text-2xl font-orbitron font-bold text-white">0944</span>
                      <span className="text-[10px] font-black bg-red-600/20 text-red-500 px-3 py-1 rounded-full border border-blue-500/20 flex items-center gap-1">
                         <ShieldAlert size={10} /> 420 Days
                      </span>
                   </div>
                </div>
             </div>
             <button className="w-full py-3 rounded-xl bg-white/5 border border-white/5 text-[9px] font-black uppercase tracking-widest text-slate-500 hover:text-white transition-all flex items-center justify-center gap-2">
                Open Deep Matrix <ArrowUpRight size={12}/>
             </button>
          </div>
        </div>
      </div>
    </div>
  );
};
