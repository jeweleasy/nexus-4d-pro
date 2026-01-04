
import React, { useState, useMemo } from 'react';
import { Search, Calendar, Filter, Clock, Download, ChevronRight, History, Database, Sparkles, TrendingUp, Info, CheckCircle2, Settings, X, Activity, Server, Zap, Loader2, Check, Globe, ShieldCheck } from 'lucide-react';
import { MOCK_RESULTS, LANGUAGES } from '../constants';
import { ResultCard } from './ResultCard';
import { LotteryProvider, LotteryResult } from '../types';
import { ShadowButton } from './ShadowButton';

interface HistoryArchiveProps {
  lang: 'EN' | 'CN' | 'MY';
  isLoggedIn?: boolean;
  onGuestAttempt?: () => void;
}

export const HistoryArchive: React.FC<HistoryArchiveProps> = ({ lang, isLoggedIn = false, onGuestAttempt }) => {
  const [searchNumber, setSearchNumber] = useState('');
  const [selectedProvider, setSelectedProvider] = useState<LotteryProvider | 'All'>('All');
  const [selectedYear, setSelectedYear] = useState('2024');
  const [drawDayFilter, setDrawDayFilter] = useState<'All' | 'Wed' | 'Sat' | 'Sun' | 'Special'>('All');
  const [isScanning, setIsScanning] = useState(false);
  const [scanProgress, setScanProgress] = useState(0);
  const [scanStage, setScanStage] = useState('');
  const [showExportModal, setShowExportModal] = useState(false);
  const [exportConfig, setExportConfig] = useState({
    includeMain: true,
    includeSpecial: true,
    includeConsolation: false,
    format: 'CSV' as 'CSV' | 'JSON' | 'PDF'
  });
  
  const t = LANGUAGES[lang];

  // Logic for data cache status
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
        matchDay = ![0, 3, 6].includes(day); // Mock logic for special draws
      }

      return matchProvider && matchNumber && matchYear && matchDay;
    }).sort((a, b) => b.timestamp - a.timestamp);
  }, [searchNumber, selectedProvider, selectedYear, drawDayFilter]);

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

  const handleExport = () => {
    alert(`Export Dispatch: ${filteredResults.length} records. Format: ${exportConfig.format}. Settings: Main(${exportConfig.includeMain}) Special(${exportConfig.includeSpecial}) Consolation(${exportConfig.includeConsolation})`);
    setShowExportModal(false);
  };

  return (
    <div className="space-y-8 animate-in fade-in slide-in-from-bottom-6 duration-700">
      {showExportModal && (
        <div className="fixed inset-0 z-[200] flex items-center justify-center p-4">
          <div className="absolute inset-0 bg-black/80 backdrop-blur-md" onClick={() => setShowExportModal(false)}></div>
          <div className="relative w-full max-w-md glass rounded-[2.5rem] border border-white/10 p-8 space-y-8 animate-in zoom-in duration-300">
            <div className="flex justify-between items-center">
              <h3 className="text-xl font-orbitron font-bold flex items-center gap-3">
                <Download size={20} className="text-blue-500" />
                Export Protocol
              </h3>
              <button onClick={() => setShowExportModal(false)} className="p-2 text-slate-500 hover:text-white transition-colors">
                <X size={20} />
              </button>
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
                      onClick={() => setExportConfig({...exportConfig, format: fmt})}
                      className={`flex-1 py-3 rounded-xl border text-[10px] font-black tracking-widest transition-all ${exportConfig.format === fmt ? 'bg-blue-600 text-white border-blue-400' : 'bg-white/5 border-white/5 text-slate-500 hover:border-white/20'}`}
                    >
                      {fmt}
                    </button>
                  ))}
                </div>
              </div>
            </div>

            <ShadowButton onClick={handleExport} variant="primary" className="w-full py-4 text-xs font-black uppercase tracking-widest">
              Initiate Secure Download
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
               <span className="text-[10px] font-black text-green-500 uppercase tracking-widest">Local Cache: {cacheStatus.status}</span>
            </div>
            <div className="flex items-center gap-2 text-[10px] font-bold text-slate-500 uppercase">
               <Server size={12} className="text-slate-600" />
               Node: {cacheStatus.node}
            </div>
          </div>
        </div>
        <div className="flex gap-3">
          <button onClick={() => setShowExportModal(true)} className="flex items-center gap-2 px-6 py-2.5 rounded-xl glass border border-white/10 text-[10px] font-black uppercase tracking-widest hover:border-blue-500/30 transition-all text-blue-400">
            <Download size={14} /> EXPORT DATA
          </button>
        </div>
      </div>

      <div className="glass p-8 rounded-[2.5rem] border border-white/10 bg-gradient-to-br from-blue-600/5 to-transparent space-y-8">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <div className="md:col-span-2 relative">
            <input 
              type="text" 
              maxLength={4}
              placeholder="Query historical number (e.g. 8888)..."
              value={searchNumber}
              onChange={(e) => setSearchNumber(e.target.value.replace(/\D/g, ''))}
              className="w-full bg-black/40 border border-white/10 rounded-2xl px-12 py-5 text-sm font-orbitron focus:outline-none focus:border-blue-500/50 transition-all text-white placeholder:text-slate-700"
            />
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-500" size={20} />
            {searchNumber && (
              <button onClick={() => setSearchNumber('')} className="absolute right-4 top-1/2 -translate-y-1/2 text-[9px] font-black uppercase text-blue-500 hover:text-white bg-blue-500/10 px-2 py-1 rounded">CLEAR</button>
            )}
          </div>

          <div className="relative">
            <select 
              value={selectedProvider}
              onChange={(e) => setSelectedProvider(e.target.value as any)}
              className="w-full h-full bg-black/40 border border-white/10 rounded-2xl px-10 py-4 text-xs font-black uppercase appearance-none focus:outline-none focus:border-blue-500/50 text-white"
            >
              <option value="All">All Operators</option>
              {Object.values(LotteryProvider).map(p => (
                <option key={p} value={p}>{p}</option>
              ))}
            </select>
            <Filter className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-500" size={16} />
          </div>

          <div className="relative">
            <select 
              value={selectedYear}
              onChange={(e) => setSelectedYear(e.target.value)}
              className="w-full h-full bg-black/40 border border-white/10 rounded-2xl px-10 py-4 text-xs font-black uppercase appearance-none focus:outline-none focus:border-blue-500/50 text-white"
            >
              {['2024', '2023', '2022', '2021', '2020'].map(y => (
                <option key={y} value={y}>{y} Series</option>
              ))}
            </select>
            <Calendar className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-500" size={16} />
          </div>
        </div>

        <div className="flex flex-wrap items-center gap-3 border-t border-white/5 pt-6">
           <span className="text-[10px] font-black uppercase text-slate-500 tracking-widest mr-4">Cycle Type:</span>
           {(['All', 'Wed', 'Sat', 'Sun', 'Special'] as const).map(day => (
             <button
               key={day}
               onClick={() => setDrawDayFilter(day)}
               className={`px-5 py-2 rounded-xl text-[10px] font-black uppercase tracking-tight border transition-all ${drawDayFilter === day ? 'bg-blue-600 border-blue-400 text-white shadow-lg' : 'bg-white/5 border-white/5 text-slate-500 hover:border-white/20'}`}
             >
               {day === 'All' ? 'Full Archive' : day === 'Special' ? 'Special Draw' : `${day} Cycle`}
             </button>
           ))}
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2 space-y-6">
          <div className="flex items-center justify-between px-2">
            <div className="flex items-center gap-3">
              <span className="text-[10px] font-black uppercase text-slate-500 tracking-[0.4em]">
                {filteredResults.length} Result Signatures Match Query
              </span>
              {searchNumber && (
                <div className="flex items-center gap-1.5 text-[9px] font-black text-blue-500 bg-blue-500/10 px-2 py-0.5 rounded border border-blue-500/20 animate-pulse">
                  <Zap size={10} /> Neural Highlights Active
                </div>
              )}
            </div>
            <div className="text-[10px] font-bold text-slate-600 uppercase tracking-widest">
               Handshake latency: 24ms
            </div>
          </div>

          <div className="space-y-6">
            {filteredResults.length > 0 ? (
              filteredResults.map((res, i) => (
                <ResultCard 
                  key={i} 
                  result={res} 
                  lang={lang} 
                  isLoggedIn={isLoggedIn} 
                  onGuestAttempt={onGuestAttempt} 
                  highlightQuery={searchNumber}
                />
              ))
            ) : (
              <div className="glass rounded-[2.5rem] p-24 text-center border border-dashed border-white/10 relative overflow-hidden">
                <div className="absolute inset-0 bg-blue-600/[0.02] animate-pulse"></div>
                <Database className="mx-auto text-slate-800 mb-6 relative z-10" size={64} />
                <h3 className="text-2xl font-orbitron font-bold text-slate-500 relative z-10">Signature Mismatch</h3>
                <p className="text-xs text-slate-600 mt-3 max-w-sm mx-auto leading-relaxed relative z-10">The requested data fragment does not reside in the local cache nodes.</p>
                
                <div className="mt-10 max-w-xs mx-auto space-y-4 relative z-10">
                  {isScanning ? (
                    <div className="space-y-5 animate-in fade-in duration-500">
                       <div className="flex justify-between items-center text-[10px] font-black uppercase tracking-widest text-blue-500">
                          <span className="flex items-center gap-2">
                            <Activity size={12} className="animate-pulse" /> 
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
                      <Globe size={18} /> INITIATE DEEP CLOUD SCAN
                    </ShadowButton>
                  )}
                </div>
              </div>
            )}
          </div>
        </div>

        <div className="space-y-8">
          <div className="glass p-8 rounded-[2rem] border border-white/10 space-y-6 relative overflow-hidden">
             <div className="absolute -top-10 -right-10 w-24 h-24 bg-blue-500/10 blur-2xl rounded-full"></div>
             <h3 className="text-lg font-orbitron font-bold flex items-center gap-3 text-white">
                <TrendingUp className="text-green-500" size={20} />
                Cloud Intelligence
             </h3>
             <div className="space-y-4">
                <div className="p-4 rounded-2xl bg-white/5 border border-white/5 hover:bg-white/10 transition-all cursor-default">
                   <p className="text-[9px] font-black uppercase text-slate-500 mb-1 tracking-widest">Global Freq Cluster</p>
                   <div className="flex justify-between items-center">
                      <span className="text-2xl font-orbitron font-bold text-blue-400">2518</span>
                      <span className="text-[10px] font-black bg-blue-600/20 text-blue-400 px-3 py-1 rounded-full border border-blue-500/20">12 Hits</span>
                   </div>
                </div>
                <div className="p-4 rounded-2xl bg-white/5 border border-white/5 hover:bg-white/10 transition-all cursor-default">
                   <p className="text-[9px] font-black uppercase text-slate-500 mb-1 tracking-widest">Dormant "Sub-Zero" Void</p>
                   <div className="flex justify-between items-center">
                      <span className="text-2xl font-orbitron font-bold text-red-500">0944</span>
                      <span className="text-[10px] font-black bg-red-600/20 text-red-500 px-3 py-1 rounded-full border border-red-500/20">420 Days</span>
                   </div>
                </div>
             </div>
             <div className="p-5 rounded-2xl bg-blue-600/10 border border-blue-500/20 flex gap-4 items-start">
                <Info size={18} className="text-blue-500 shrink-0 mt-0.5" />
                <p className="text-[10px] text-blue-100 leading-relaxed italic opacity-80">
                  Scanning over 10.4 million historical data points across 16 global operators to determine positional void resonance.
                </p>
             </div>
          </div>

          <div className="glass p-8 rounded-[2rem] border border-white/10 space-y-4">
             <h3 className="text-[10px] font-black uppercase tracking-[0.3em] text-slate-500 mb-6 px-1">Network Forensics</h3>
             <div className="space-y-3">
                {[
                  { icon: Server, label: 'Origin Node', value: cacheStatus.node },
                  { icon: ShieldCheck, label: 'Integrity', value: cacheStatus.integrity },
                  { icon: Clock, label: 'Last Sync', value: cacheStatus.lastSync }
                ].map((item, i) => (
                  <div key={i} className="flex justify-between items-center p-4 bg-white/5 rounded-2xl border border-white/5 hover:border-white/10 transition-all">
                     <div className="flex items-center gap-3">
                        <item.icon size={16} className="text-slate-600" />
                        <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">{item.label}</span>
                     </div>
                     <span className="text-[10px] font-black text-white font-orbitron">{item.value}</span>
                  </div>
                ))}
             </div>
          </div>
        </div>
      </div>
    </div>
  );
};
