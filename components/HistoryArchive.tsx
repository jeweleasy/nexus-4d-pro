
import React, { useState, useMemo } from 'react';
import { Search, Calendar, Filter, Clock, Download, ChevronRight, History, Database, Sparkles, TrendingUp, Info } from 'lucide-react';
import { MOCK_RESULTS, LANGUAGES } from '../constants';
import { ResultCard } from './ResultCard';
import { LotteryProvider, LotteryResult } from '../types';
import { ShadowButton } from './ShadowButton';

interface HistoryArchiveProps {
  lang: 'EN' | 'CN' | 'MY';
}

export const HistoryArchive: React.FC<HistoryArchiveProps> = ({ lang }) => {
  const [searchNumber, setSearchNumber] = useState('');
  const [selectedProvider, setSelectedProvider] = useState<LotteryProvider | 'All'>('All');
  const [selectedYear, setSelectedYear] = useState('2024');
  const [isScanning, setIsScanning] = useState(false);
  const t = LANGUAGES[lang];

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
      return matchProvider && matchNumber && matchYear;
    }).sort((a, b) => b.timestamp - a.timestamp);
  }, [searchNumber, selectedProvider, selectedYear]);

  const handleDeepScan = () => {
    setIsScanning(true);
    setTimeout(() => setIsScanning(false), 2000);
  };

  return (
    <div className="space-y-8 animate-in fade-in slide-in-from-bottom-6 duration-700">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
          <h2 className="text-3xl font-orbitron font-bold flex items-center gap-3">
            <History className="text-blue-500" />
            {t.nav.archive}
          </h2>
          <p className="text-slate-400 text-sm mt-1">Access 10+ years of verified draw signatures and positional data.</p>
        </div>
        <div className="flex gap-2">
          <ShadowButton variant="secondary" className="py-2 px-4 text-[10px] flex items-center gap-2">
            <Download size={14} /> EXPORT CSV
          </ShadowButton>
        </div>
      </div>

      <div className="glass p-6 rounded-[2.5rem] border border-white/10 bg-gradient-to-br from-blue-600/5 to-transparent">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <div className="md:col-span-2 relative">
            <input 
              type="text" 
              maxLength={4}
              placeholder="Search 4D Number (e.g. 8888)..."
              value={searchNumber}
              onChange={(e) => setSearchNumber(e.target.value.replace(/\D/g, ''))}
              className="w-full bg-black/40 border border-white/10 rounded-2xl px-12 py-4 text-sm font-orbitron focus:outline-none focus:border-blue-500/50 transition-all"
            />
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-500" size={18} />
            {searchNumber && (
              <button 
                onClick={() => setSearchNumber('')}
                className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-500 hover:text-white"
              >
                Clear
              </button>
            )}
          </div>

          <div className="relative">
            <select 
              value={selectedProvider}
              onChange={(e) => setSelectedProvider(e.target.value as any)}
              className="w-full bg-black/40 border border-white/10 rounded-2xl px-10 py-4 text-xs font-black uppercase appearance-none focus:outline-none focus:border-blue-500/50"
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
              className="w-full bg-black/40 border border-white/10 rounded-2xl px-10 py-4 text-xs font-black uppercase appearance-none focus:outline-none focus:border-blue-500/50"
            >
              {['2024', '2023', '2022', '2021', '2020'].map(y => (
                <option key={y} value={y}>{y} Series</option>
              ))}
            </select>
            <Calendar className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-500" size={16} />
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2 space-y-6">
          <div className="flex items-center justify-between px-2">
            <span className="text-[10px] font-black uppercase text-slate-500 tracking-[0.3em]">
              Showing {filteredResults.length} Result Nodes
            </span>
            <div className="flex items-center gap-4 text-[10px] font-bold text-slate-600">
               <span className="flex items-center gap-1"><Clock size={12}/> Sorted by Chronos</span>
            </div>
          </div>

          <div className="space-y-6">
            {filteredResults.length > 0 ? (
              filteredResults.map((res, i) => (
                <ResultCard key={i} result={res} lang={lang} />
              ))
            ) : (
              <div className="glass rounded-[2rem] p-20 text-center border border-dashed border-white/10">
                <Database className="mx-auto text-slate-700 mb-4" size={48} />
                <h3 className="text-xl font-orbitron font-bold text-slate-500">No Historical Matches</h3>
                <p className="text-xs text-slate-600 mt-2">The requested data signature does not exist in the current local cache.</p>
                <ShadowButton onClick={handleDeepScan} variant="primary" className="mt-8" disabled={isScanning}>
                  {isScanning ? <><Sparkles size={16} className="animate-spin mr-2"/> SCANNING GLOBAL ARCHIVE...</> : 'INITIATE DEEP CLOUD SCAN'}
                </ShadowButton>
              </div>
            )}
          </div>
        </div>

        <div className="space-y-8">
          <div className="glass p-6 rounded-[2rem] border border-white/10 space-y-6 relative overflow-hidden">
             <div className="absolute -top-10 -right-10 w-24 h-24 bg-blue-500/10 blur-2xl rounded-full"></div>
             <h3 className="text-lg font-orbitron font-bold flex items-center gap-3">
                <TrendingUp className="text-green-500" size={20} />
                Historical Analytics
             </h3>
             <div className="space-y-4">
                <div className="p-4 rounded-2xl bg-white/5 border border-white/5">
                   <p className="text-[9px] font-black uppercase text-slate-500 mb-1">Most Frequent (Year)</p>
                   <div className="flex justify-between items-center">
                      <span className="text-2xl font-orbitron font-bold text-blue-400">2518</span>
                      <span className="text-[10px] font-black bg-blue-600/20 text-blue-400 px-2 py-1 rounded-lg">12 Hits</span>
                   </div>
                </div>
                <div className="p-4 rounded-2xl bg-white/5 border border-white/5">
                   <p className="text-[9px] font-black uppercase text-slate-500 mb-1">Dormant "Cold" Number</p>
                   <div className="flex justify-between items-center">
                      <span className="text-2xl font-orbitron font-bold text-amber-500">0944</span>
                      <span className="text-[10px] font-black bg-amber-600/20 text-amber-500 px-2 py-1 rounded-lg">420 Days</span>
                   </div>
                </div>
             </div>
             <div className="p-4 rounded-2xl bg-blue-600/10 border border-blue-500/20 flex gap-3 items-start">
                <Info size={16} className="text-blue-500 shrink-0 mt-0.5" />
                <p className="text-[10px] text-blue-100 leading-relaxed italic">
                  Historical analysis uses a 3,650-day rolling window to identify positional resonance and digit exhaustion points.
                </p>
             </div>
          </div>

          <div className="glass p-6 rounded-[2rem] border border-white/10 space-y-4">
             <h3 className="text-sm font-black uppercase tracking-widest text-slate-500">Quick Filters</h3>
             <div className="flex flex-wrap gap-2">
                {['Draw Wednesday', 'Draw Saturday', 'Draw Sunday', 'Special Draw'].map(f => (
                  <button key={f} className="px-3 py-1.5 rounded-xl bg-white/5 border border-white/10 text-[9px] font-bold text-slate-400 hover:border-blue-500/50 hover:text-white transition-all">
                    {f}
                  </button>
                ))}
             </div>
          </div>
        </div>
      </div>
    </div>
  );
};
