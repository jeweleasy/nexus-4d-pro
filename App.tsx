
import React, { useState, useEffect, useMemo } from 'react';
import { 
  LayoutDashboard, 
  BarChart3, 
  History, 
  Cpu, 
  Bell, 
  Globe, 
  Search,
  Timer,
  CloudSun,
  Menu,
  X,
  CreditCard,
  ChevronRight,
  BookOpen,
  ShieldCheck,
  Activity,
  Newspaper,
  Map,
  AlertTriangle,
  Facebook,
  Twitter,
  Send,
  MessageCircle,
  Instagram,
  ChevronDown,
  Calendar as CalendarIcon,
  Database,
  ArrowUpDown,
  Trophy,
  Clock,
  RefreshCw,
  Zap,
  CheckCircle2,
  Heart,
  Share2,
  Trash2
} from 'lucide-react';
import { MOCK_RESULTS, LANGUAGES, HOT_NUMBERS } from './constants';
import { ResultCard } from './components/ResultCard';
import { StatsChart } from './components/StatsChart';
import { Predictor } from './components/Predictor';
import { LuckyNumber } from './components/LuckyNumber';
import { ShadowButton } from './components/ShadowButton';
import { UserManual } from './components/UserManual';
import { AdminDashboard } from './components/AdminDashboard';
import { NewsSection } from './components/NewsSection';
import { LogoTicker } from './components/LogoTicker';
import { NexusLogo } from './components/NexusLogo';
import { ProviderResultsModal } from './components/ProviderResultsModal';
import { ShareModal } from './components/ShareModal';
import { LotteryProvider, LotteryResult } from './types';
import { 
  DisclaimerPage, 
  PrivacyPolicy, 
  AboutUs, 
  ContactUs, 
  Sitemap, 
  TermsConditions 
} from './components/LegalPages';

type View = 'dashboard' | 'stats' | 'archive' | 'predictions' | 'news' | 'favorites' | 'premium' | 'manual' | 'admin' | 'disclaimer' | 'privacy' | 'about' | 'contact' | 'sitemap' | 'terms';
type LangCode = 'EN' | 'CN' | 'MY';

const App: React.FC = () => {
  const detectLanguage = (): LangCode => {
    const browserLang = navigator.language.toLowerCase();
    if (browserLang.includes('zh')) return 'CN';
    if (browserLang.includes('ms') || browserLang.includes('my')) return 'MY';
    return 'EN';
  };

  const todayStr = new Date().toISOString().split('T')[0];

  const [activeView, setActiveView] = useState<View>('dashboard');
  const [lang, setLang] = useState<LangCode>(detectLanguage());
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [showLangMenu, setShowLangMenu] = useState(false);
  const [selectedResult, setSelectedResult] = useState<LotteryResult | null>(null);
  const [sharingResult, setSharingResult] = useState<LotteryResult | null>(null);
  const [toast, setToast] = useState<{ message: string; type: 'success' | 'info' } | null>(null);
  
  // Real-time Clock & Sync States
  const [currentTime, setCurrentTime] = useState(new Date());
  const [syncCountdown, setSyncCountdown] = useState(0);
  const [lastSyncTime, setLastSyncTime] = useState(new Date(Date.now() - 25000));
  
  // Favorites State with persistence
  const [favorites, setFavorites] = useState<LotteryResult[]>(() => {
    const saved = localStorage.getItem('nexus_pro_favorites');
    return saved ? JSON.parse(saved) : [];
  });

  // Master Date State
  const [selectedDate, setSelectedDate] = useState(todayStr);

  useEffect(() => {
    localStorage.setItem('nexus_pro_favorites', JSON.stringify(favorites));
  }, [favorites]);

  useEffect(() => {
    if (toast) {
      const timer = setTimeout(() => setToast(null), 3000);
      return () => clearTimeout(timer);
    }
  }, [toast]);

  useEffect(() => {
    const timer = setInterval(() => {
      const now = new Date();
      setCurrentTime(now);
      
      const secondsInCurrentInterval = (now.getMinutes() % 5) * 60 + now.getSeconds();
      setSyncCountdown(300 - secondsInCurrentInterval);

      if (secondsInCurrentInterval === 0) {
        setLastSyncTime(new Date());
      }
    }, 1000);
    return () => clearInterval(timer);
  }, []);

  useEffect(() => {
    window.scrollTo(0, 0);
  }, [activeView]);

  const toggleFavorite = (result: LotteryResult) => {
    setFavorites(prev => {
      const exists = prev.some(f => 
        f.provider === result.provider && 
        f.drawDate === result.drawDate && 
        f.drawNumber === result.drawNumber
      );
      if (exists) {
        setToast({ message: `${result.provider} removed from favorites`, type: 'info' });
        return prev.filter(f => 
          !(f.provider === result.provider && f.drawDate === result.drawDate && f.drawNumber === result.drawNumber)
        );
      }
      setToast({ message: `${result.provider} saved to favorites`, type: 'success' });
      return [...prev, result];
    });
  };

  const clearAllFavorites = () => {
    if (window.confirm('Are you sure you want to clear all saved favorites?')) {
      setFavorites([]);
      setToast({ message: 'All favorites cleared', type: 'info' });
    }
  };

  const isResultFavorite = (result: LotteryResult) => {
    return favorites.some(f => 
      f.provider === result.provider && 
      f.drawDate === result.drawDate && 
      f.drawNumber === result.drawNumber
    );
  };

  const formatTime = (sec: number) => {
    const mins = Math.floor(sec / 60);
    const secs = sec % 60;
    return `${mins}:${secs < 10 ? '0' : ''}${secs}`;
  };

  const handleSelectProvider = (providerId: LotteryProvider) => {
    const result = MOCK_RESULTS.find(r => r.provider === providerId && r.drawDate === selectedDate);
    if (result) {
      setSelectedResult(result);
    } else {
      const fallback = MOCK_RESULTS.find(r => r.provider === providerId) || MOCK_RESULTS[0];
      setSelectedResult({ ...fallback, drawDate: selectedDate, status: 'Final' });
    }
  };

  const displayResults = useMemo(() => {
    const dateResults = MOCK_RESULTS.filter(res => res.drawDate === selectedDate);
    
    if (dateResults.length > 0) {
      return { 
        results: dateResults, 
        isFallback: false, 
        label: selectedDate === todayStr ? 'LIVE UPDATES' : 'OFFICIAL RESULTS',
        date: selectedDate 
      };
    }

    const pastResults = [...MOCK_RESULTS]
      .filter(r => new Date(r.drawDate) <= new Date())
      .sort((a, b) => new Date(b.drawDate).getTime() - new Date(a.drawDate).getTime());
    
    const latestAvailableDate = pastResults[0]?.drawDate || todayStr;
    const latestResults = MOCK_RESULTS.filter(res => res.drawDate === latestAvailableDate);

    return { 
      results: latestResults, 
      isFallback: true, 
      label: 'LATEST VERIFIED RESULTS',
      date: latestAvailableDate 
    };
  }, [selectedDate, todayStr]);

  const NavItem = ({ icon: Icon, label, id }: { icon: any, label: string, id: View }) => (
    <button
      onClick={() => {
        setActiveView(id);
        setSidebarOpen(false);
      }}
      className={`flex items-center gap-3 px-4 py-3 rounded-xl transition-all w-full text-left ${
        activeView === id 
          ? 'bg-blue-600/10 text-blue-400 border border-blue-500/20' 
          : 'text-slate-400 hover:text-white hover:bg-white/5'
      }`}
    >
      <Icon size={20} />
      <span className="font-medium">{label}</span>
      {activeView === id && <div className="ml-auto w-1.5 h-1.5 rounded-full bg-blue-500 shadow-[0_0_8px_rgba(59,130,246,0.5)]"></div>}
    </button>
  );

  const LanguageSwitcher = ({ isMobile = false }) => (
    <div className={`relative ${isMobile ? 'mr-2' : ''}`}>
      <button 
        onClick={() => setShowLangMenu(!showLangMenu)}
        className="flex items-center gap-2 px-3 py-1.5 glass rounded-xl text-xs font-bold border border-white/10 hover:border-blue-500/50 transition-all"
      >
        <Globe size={14} className="text-blue-400" />
        <span>{lang}</span>
        <ChevronDown size={12} className={`transition-transform duration-200 ${showLangMenu ? 'rotate-180' : ''}`} />
      </button>
      
      {showLangMenu && (
        <>
          <div className="fixed inset-0 z-40" onClick={() => setShowLangMenu(false)}></div>
          <div className="absolute right-0 mt-2 w-32 glass border border-white/10 rounded-xl overflow-hidden shadow-2xl z-50 animate-in fade-in slide-in-from-top-2 duration-200">
            {(['EN', 'CN', 'MY'] as const).map(l => (
              <button
                key={l}
                onClick={() => {
                  setLang(l);
                  setShowLangMenu(false);
                }}
                className={`w-full px-4 py-2.5 text-left text-xs font-semibold hover:bg-blue-600/20 transition-colors ${
                  lang === l ? 'text-blue-400 bg-blue-600/10' : 'text-slate-400'
                }`}
              >
                {l === 'EN' ? 'English' : l === 'CN' ? '中文 (简体)' : 'Bahasa Melayu'}
              </button>
            ))}
          </div>
        </>
      )}
    </div>
  );

  return (
    <div className="min-h-screen flex flex-col md:flex-row bg-[#050505] text-white">
      {/* Toast Notification */}
      {toast && (
        <div className={`fixed bottom-8 left-1/2 -translate-x-1/2 z-[200] px-6 py-3 rounded-2xl glass border border-white/10 flex items-center gap-3 shadow-2xl animate-in slide-in-from-bottom-4 duration-300`}>
          <div className={`w-2 h-2 rounded-full ${toast.type === 'success' ? 'bg-green-500' : 'bg-blue-500'}`}></div>
          <span className="text-xs font-bold font-orbitron tracking-wider text-slate-200">{toast.message}</span>
        </div>
      )}

      <ProviderResultsModal 
        result={selectedResult} 
        onClose={() => setSelectedResult(null)} 
        lang={lang}
        isFavorite={selectedResult ? isResultFavorite(selectedResult) : false}
        onToggleFavorite={selectedResult ? () => toggleFavorite(selectedResult) : undefined}
      />

      <ShareModal 
        result={sharingResult}
        onClose={() => setSharingResult(null)}
      />

      {/* Mobile Header */}
      <div className="md:hidden flex items-center justify-between p-4 border-b border-white/5 sticky top-0 z-50 bg-[#050505]/80 backdrop-blur-md">
        <NexusLogo size="sm" onClick={() => setActiveView('dashboard')} className="cursor-pointer" />
        <div className="flex items-center gap-2">
           <div className="flex flex-col items-end mr-2">
              <span className="text-[10px] font-orbitron font-bold text-blue-400">
                {currentTime.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
              </span>
           </div>
          <LanguageSwitcher isMobile />
          <button onClick={() => setSidebarOpen(!sidebarOpen)} className="p-2 text-slate-400">
            {sidebarOpen ? <X size={24} /> : <Menu size={24} />}
          </button>
        </div>
      </div>

      <aside className={`
        fixed inset-0 z-40 md:static w-72 h-screen border-r border-white/5 p-6 flex flex-col gap-8
        transition-transform duration-300 md:translate-x-0 bg-[#050505]
        ${sidebarOpen ? 'translate-x-0' : '-translate-x-full'}
      `}>
        <div className="hidden md:block">
          <NexusLogo size="md" onClick={() => setActiveView('dashboard')} className="cursor-pointer" />
        </div>

        <nav className="flex-1 space-y-1 overflow-y-auto">
          <NavItem icon={LayoutDashboard} label={LANGUAGES[lang].dashboard} id="dashboard" />
          <NavItem icon={BarChart3} label={LANGUAGES[lang].stats} id="stats" />
          <NavItem icon={History} label={LANGUAGES[lang].archive} id="archive" />
          <NavItem icon={Heart} label={LANGUAGES[lang].favorites} id="favorites" />
          <NavItem icon={Cpu} label={LANGUAGES[lang].predictions} id="predictions" />
          <NavItem icon={Newspaper} label={LANGUAGES[lang].news} id="news" />
          <NavItem icon={BookOpen} label="User Manual" id="manual" />
          <div className="my-6 border-t border-white/5"></div>
          <NavItem icon={ShieldCheck} label="Admin Portal" id="admin" />
          <NavItem icon={CreditCard} label="Nexus Premium" id="premium" />
        </nav>

        <div className="mt-auto space-y-4">
          <div className="bg-gradient-to-br from-blue-600/20 to-purple-600/20 p-4 rounded-2xl border border-white/5 shadow-lg shadow-blue-500/5">
            <div className="flex justify-between items-center mb-2">
              <span className="text-[10px] text-slate-400 uppercase font-bold tracking-widest">Global Data Sync</span>
              <div className="flex items-center gap-1">
                <div className="w-1.5 h-1.5 rounded-full bg-blue-500 animate-pulse"></div>
                <span className="text-[8px] font-black text-blue-500 uppercase">Live</span>
              </div>
            </div>
            <div className="text-2xl font-orbitron font-bold text-white tabular-nums">{formatTime(syncCountdown)}</div>
            <div className="mt-2 h-1 w-full bg-white/5 rounded-full overflow-hidden">
                <div className="h-full bg-blue-500 transition-all duration-1000" style={{ width: `${(syncCountdown / 300) * 100}%` }}></div>
            </div>
          </div>
        </div>
      </aside>

      <main className="flex-1 overflow-y-auto relative">
        <header className="hidden md:flex h-20 items-center justify-between px-8 border-b border-white/5 sticky top-0 z-30 bg-[#050505]/80 backdrop-blur-md">
          <div className="flex items-center gap-6">
            <div className="flex items-center gap-4 px-5 py-2.5 bg-white/5 rounded-2xl border border-white/5 shadow-inner">
              <div className="flex items-center gap-3 border-r border-white/10 pr-5">
                <div className="p-1.5 rounded-lg bg-blue-600/10">
                  <Clock size={18} className="text-blue-400" />
                </div>
                <div className="flex flex-col">
                  <span className="text-sm font-orbitron font-bold text-white tabular-nums leading-none">
                    {currentTime.toLocaleTimeString([], { hour12: false })}
                  </span>
                  <span className="text-[9px] text-slate-500 mt-1 uppercase font-black tracking-tighter">
                    {currentTime.toLocaleDateString('en-US', { day: 'numeric', month: 'short', year: 'numeric' })}
                  </span>
                </div>
              </div>
              <div className="flex items-center gap-3 pl-1">
                 <div className="p-1.5 rounded-lg bg-green-600/10">
                   <CheckCircle2 size={18} className="text-green-500" />
                 </div>
                 <div>
                    <p className="text-[8px] text-slate-500 uppercase font-black leading-none mb-1">Last Verified Update</p>
                    <p className="text-[10px] font-bold text-slate-200 leading-tight">
                      {lastSyncTime.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', second: '2-digit' })}
                    </p>
                 </div>
              </div>
            </div>
          </div>

          <div className="flex items-center gap-4">
            <div className="relative group">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-500 group-focus-within:text-blue-400 transition-colors" size={14} />
              <input 
                type="text" 
                placeholder="Search Draw #..." 
                className="bg-white/5 border border-white/10 rounded-xl py-2 pl-9 pr-4 w-48 focus:outline-none focus:border-blue-500/50 transition-all text-[10px] font-bold uppercase tracking-widest"
              />
            </div>
            <LanguageSwitcher />
            <div className="h-8 w-[1px] bg-white/10 mx-2"></div>
            <div className="flex items-center gap-3">
              <img src="https://picsum.photos/seed/admin/40/40" alt="Profile" className="w-9 h-9 rounded-full border border-white/10 ring-2 ring-white/5" />
            </div>
          </div>
        </header>

        <div className="p-4 md:p-8 max-w-7xl mx-auto space-y-8">
          {activeView === 'dashboard' && (
            <>
              {/* Intelligent Hero Banner */}
              <div className="relative h-48 md:h-64 rounded-[2.5rem] overflow-hidden group border border-white/5 shadow-2xl">
                <img 
                  src="https://picsum.photos/seed/network/1200/400" 
                  alt="4D Nexus" 
                  className="w-full h-full object-cover brightness-[0.25] group-hover:scale-105 transition-transform duration-1000"
                />
                <div className="absolute inset-0 p-8 md:p-12 flex flex-col justify-center">
                  <div className="flex items-center gap-3 mb-4">
                    <div className="px-3 py-1 rounded-full bg-blue-600/20 border border-blue-500/30 text-blue-400 text-[10px] font-black uppercase tracking-widest flex items-center gap-2">
                      <div className="w-1.5 h-1.5 rounded-full bg-blue-500 animate-ping"></div>
                      Data Stream Active
                    </div>
                  </div>
                  <h1 className="text-4xl md:text-6xl font-orbitron font-bold mb-4 leading-none tracking-tighter bg-gradient-to-r from-white via-white to-slate-500 bg-clip-text text-transparent">NEXUS PULSE</h1>
                  <p className="text-slate-400 max-w-md text-xs md:text-sm leading-relaxed font-medium">
                    Instant Draw Aggregation Engine. We provide verified results from across the region with sub-second synchronization.
                  </p>
                  <div className="mt-8">
                    <ShadowButton variant="gold" className="text-[10px] px-10 py-3 uppercase tracking-widest" onClick={() => setActiveView('stats')}>
                      Deep Analytics Hub
                    </ShadowButton>
                  </div>
                </div>
              </div>

              <LogoTicker onSelectProvider={handleSelectProvider} />

              <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                <div className="lg:col-span-2 space-y-6">
                  {/* Status Bar */}
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-white/5 p-4 rounded-[1.5rem] border border-white/5 shadow-lg">
                    <div className="flex items-center gap-3">
                      <div className="p-2 rounded-xl bg-blue-600/10">
                        <Zap size={20} className="text-blue-500" />
                      </div>
                      <div>
                        <h2 className="text-sm font-orbitron font-bold text-white uppercase tracking-wider leading-none">
                          {displayResults.label}
                        </h2>
                        <p className="text-[9px] text-slate-500 font-bold uppercase tracking-widest mt-1">
                          DRAW CYCLE: {displayResults.date}
                        </p>
                      </div>
                    </div>
                    
                    <div className="flex items-center gap-3">
                      <div className="relative flex items-center gap-2 glass px-3 py-1.5 rounded-xl border border-white/10 group focus-within:border-blue-500/50 transition-all">
                        <CalendarIcon size={14} className="text-blue-400" />
                        <input 
                          type="date" 
                          value={selectedDate}
                          onChange={(e) => setSelectedDate(e.target.value)}
                          className="bg-transparent text-[10px] font-black uppercase font-orbitron outline-none cursor-pointer [color-scheme:dark]"
                        />
                      </div>
                      <button 
                        onClick={() => setSelectedDate(todayStr)}
                        className={`text-[9px] uppercase font-black px-5 py-2 rounded-xl transition-all border ${selectedDate === todayStr ? 'bg-blue-600 border-blue-500 text-white shadow-lg shadow-blue-500/20' : 'bg-white/5 border-white/10 text-slate-500 hover:text-white'}`}
                      >
                        Today
                      </button>
                    </div>
                  </div>

                  {displayResults.isFallback && (
                    <div className="p-5 rounded-2xl bg-blue-600/5 border border-blue-500/20 flex items-center justify-between group animate-in slide-in-from-top-4 duration-500">
                       <div className="flex items-center gap-4">
                          <div className="w-12 h-12 rounded-2xl bg-blue-500/10 flex items-center justify-center text-blue-400 shrink-0">
                             <Timer size={24} />
                          </div>
                          <div>
                             <p className="text-xs font-black text-blue-400 uppercase tracking-[0.1em]">Awaiting Live Sync</p>
                             <p className="text-[10px] text-slate-500 font-medium leading-relaxed max-w-sm mt-0.5">
                               Today's draws ({todayStr}) are pending broadcast. We are currently displaying the <strong>most recent verified results</strong> for your immediate review.
                             </p>
                          </div>
                       </div>
                       <div className="hidden sm:flex items-center gap-2 text-slate-600 group-hover:text-blue-400 transition-colors">
                          <span className="text-[9px] font-black uppercase tracking-widest">Scanning Sources</span>
                          <RefreshCw size={12} className="animate-spin-slow" />
                       </div>
                    </div>
                  )}

                  <div className="grid grid-cols-1 gap-6">
                    {displayResults.results.map((res, i) => (
                      <div 
                        key={i} 
                        onClick={() => setSelectedResult(res)} 
                        className="cursor-pointer group"
                        style={{ 
                          animationDelay: `${i * 100}ms`,
                          animationFillMode: 'both'
                        }}
                      >
                        <ResultCard 
                          result={res} 
                          lang={lang} 
                          isFavorite={isResultFavorite(res)}
                          onToggleFavorite={(e) => {
                            e.stopPropagation();
                            toggleFavorite(res);
                          }}
                          onShare={(e) => {
                            e.stopPropagation();
                            setSharingResult(res);
                          }}
                        />
                      </div>
                    ))}
                  </div>
                </div>

                <div className="space-y-8">
                  <LuckyNumber />
                  <Predictor />
                  
                  {/* Latest Stats Insight */}
                  <div className="glass rounded-[2rem] p-6 border border-white/5 bg-gradient-to-br from-white/5 to-transparent">
                    <h3 className="text-xs font-orbitron font-bold mb-4 uppercase tracking-[0.2em] text-slate-400 flex items-center gap-2">
                      <BarChart3 size={14} className="text-blue-500" /> Statistical Pulse
                    </h3>
                    <div className="space-y-4">
                      {HOT_NUMBERS.slice(0, 3).map((n, i) => (
                        <div key={i} className="flex items-center justify-between p-3 rounded-xl bg-white/5 border border-white/5">
                          <span className="text-lg font-orbitron font-bold text-white tracking-widest">{n.number}</span>
                          <div className="flex flex-col items-end">
                            <span className="text-[9px] text-slate-500 font-black uppercase">Freq</span>
                            <span className="text-xs font-bold text-blue-400">{n.frequency}x</span>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              </div>
            </>
          )}

          {activeView === 'favorites' && (
            <div className="space-y-8 animate-in fade-in slide-in-from-bottom-6 duration-700">
              <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
                <div>
                  <h2 className="text-3xl font-orbitron font-bold flex items-center gap-3">
                    <Heart size={32} className="text-red-500" fill="currentColor" />
                    {LANGUAGES[lang].favorites}
                  </h2>
                  <p className="text-slate-500 text-[10px] mt-1 uppercase tracking-[0.3em] font-black">Your Personalized Nexus Library</p>
                </div>
                <div className="flex items-center gap-3">
                  {favorites.length > 0 && (
                    <ShadowButton variant="secondary" onClick={clearAllFavorites} className="text-xs py-2 flex items-center gap-2 border-red-500/50 hover:bg-red-500/10">
                      <Trash2 size={14} className="text-red-500" />
                      Clear All
                    </ShadowButton>
                  )}
                  <ShadowButton variant="primary" onClick={() => setActiveView('dashboard')} className="text-xs py-2">
                    Return to Dashboard
                  </ShadowButton>
                </div>
              </div>

              {favorites.length > 0 ? (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  {favorites.map((res, i) => (
                    <div key={i} onClick={() => setSelectedResult(res)} className="cursor-pointer group">
                      <ResultCard 
                        result={res} 
                        lang={lang} 
                        isFavorite={true}
                        onToggleFavorite={(e) => {
                          e.stopPropagation();
                          toggleFavorite(res);
                        }}
                        onShare={(e) => {
                          e.stopPropagation();
                          setSharingResult(res);
                        }}
                      />
                    </div>
                  ))}
                </div>
              ) : (
                <div className="py-32 flex flex-col items-center justify-center text-center space-y-6 glass rounded-[3rem] border-2 border-dashed border-white/10">
                  <div className="w-20 h-20 rounded-full bg-slate-900 flex items-center justify-center text-slate-700 shadow-inner">
                    <Heart size={40} />
                  </div>
                  <div>
                    <h3 className="text-2xl font-orbitron font-bold text-white mb-2">No Favorites Saved</h3>
                    <p className="text-slate-500 text-sm max-w-sm mx-auto">Click the heart icon on any result card to save it for quick reference.</p>
                  </div>
                  <ShadowButton variant="primary" onClick={() => setActiveView('dashboard')}>Explore Results</ShadowButton>
                </div>
              )}
            </div>
          )}

          {activeView === 'archive' && (
            <div className="space-y-8 animate-in fade-in slide-in-from-bottom-6 duration-700">
              <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
                <div>
                  <h2 className="text-3xl font-orbitron font-bold flex items-center gap-3">
                    <div className="nexus-line"></div>
                    Historical Archive
                  </h2>
                  <p className="text-slate-500 text-[10px] mt-1 uppercase tracking-[0.3em] font-black">Draw Database Hub</p>
                </div>
                
                <div className="flex items-center gap-4 glass p-3 rounded-[1.25rem] border border-white/10">
                   <div className="flex items-center gap-2 px-2 border-r border-white/10 mr-1">
                     <CalendarIcon size={16} className="text-blue-400" />
                     <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Jump to:</span>
                   </div>
                   <input 
                    type="date" 
                    value={selectedDate}
                    onChange={(e) => setSelectedDate(e.target.value)}
                    className="bg-white/5 border border-white/10 rounded-lg px-3 py-1.5 text-[10px] font-bold font-orbitron outline-none cursor-pointer [color-scheme:dark] hover:border-blue-500/50 transition-all uppercase"
                  />
                </div>
              </div>

              <div className="glass rounded-[2.5rem] overflow-hidden border border-white/10 shadow-2xl">
                <div className="bg-white/5 p-5 border-b border-white/10 flex justify-between items-center">
                   <div className="flex items-center gap-3">
                      <div className="w-1.5 h-1.5 rounded-full bg-blue-500"></div>
                      <span className="text-[10px] font-black uppercase tracking-widest text-slate-400">
                        {displayResults.label} &mdash; {displayResults.date}
                      </span>
                   </div>
                   {displayResults.isFallback && (
                     <span className="text-[9px] font-black text-amber-500 uppercase px-3 py-1 bg-amber-500/10 rounded-full border border-amber-500/20">
                       Using Most Recent Verified Data
                     </span>
                   )}
                </div>
                <table className="w-full text-left border-collapse">
                  <thead>
                    <tr className="bg-white/[0.02] text-slate-500 text-[9px] uppercase tracking-[0.2em] font-black border-b border-white/5">
                      <th className="p-6">Provider & Draw ID</th>
                      <th className="p-6 text-center">1st Prize</th>
                      <th className="p-6 text-center">2nd Prize</th>
                      <th className="p-6 text-center">3rd Prize</th>
                      <th className="p-6 text-right">Action</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-white/5">
                    {displayResults.results.map((row, i) => (
                      <tr key={i} className="hover:bg-white/[0.03] transition-colors group">
                        <td className="p-6">
                          <div className="flex items-center gap-4">
                            <div className="w-11 h-11 rounded-2xl bg-blue-600/10 flex items-center justify-center font-orbitron font-black text-blue-400 border border-blue-500/20 shadow-lg">
                              {row.provider.charAt(0)}
                            </div>
                            <div>
                              <p className="text-xs font-bold text-slate-200 group-hover:text-blue-400 transition-colors">{row.provider}</p>
                              <p className="text-[9px] text-slate-600 uppercase font-black tracking-tighter mt-0.5">#Draw {row.drawNumber}</p>
                            </div>
                          </div>
                        </td>
                        <td className="p-6 text-center">
                          <span className="text-2xl font-orbitron font-bold text-amber-500 glow-gold">{row.first}</span>
                        </td>
                        <td className="p-6 text-center">
                          <span className="text-xl font-orbitron font-bold text-slate-300">{row.second}</span>
                        </td>
                        <td className="p-6 text-center">
                          <span className="text-xl font-orbitron font-bold text-orange-500/80">{row.third}</span>
                        </td>
                        <td className="p-6 text-right">
                          <button 
                            onClick={() => setSelectedResult(row)}
                            className="px-5 py-2 rounded-xl bg-white/5 border border-white/10 text-[9px] font-black uppercase tracking-widest hover:bg-blue-600 hover:text-white hover:border-blue-500 transition-all shadow-md active:scale-95"
                          >
                            Full Report
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}

          {activeView === 'stats' && (
            <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-700">
               <h2 className="text-3xl font-orbitron font-bold flex items-center gap-3">
                 <div className="nexus-line"></div>
                 Deep Data Analytics
               </h2>
               <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                  <div className="glass rounded-[2rem] p-8 border border-white/5 bg-gradient-to-br from-white/5 to-transparent shadow-2xl">
                    <h3 className="text-xl font-bold mb-6 text-white flex items-center gap-3">
                      <Trophy size={20} className="text-amber-500" />
                      Frequency Intensity Heatmap
                    </h3>
                    <StatsChart />
                  </div>
                  <div className="space-y-8">
                     <div className="glass rounded-[2rem] p-8 border border-white/5">
                        <h3 className="text-xl font-bold mb-4">Market Probability Matrix</h3>
                        <p className="text-slate-400 text-sm leading-relaxed mb-6">Our algorithms have identified 4 high-convergence zones in the current draw cycle. Numbers in these zones show a 12.4% higher repeat rate.</p>
                        <div className="grid grid-cols-2 gap-4">
                           <div className="p-4 rounded-2xl bg-white/5 border border-white/5 text-center">
                              <p className="text-[9px] text-slate-500 font-black uppercase mb-1">Alpha Cluster</p>
                              <p className="text-xl font-orbitron font-bold text-blue-400">84xx</p>
                           </div>
                           <div className="p-4 rounded-2xl bg-white/5 border border-white/5 text-center">
                              <p className="text-[9px] text-slate-500 font-black uppercase mb-1">Beta Cluster</p>
                              <p className="text-xl font-orbitron font-bold text-purple-400">11xx</p>
                           </div>
                        </div>
                     </div>
                  </div>
               </div>
            </div>
          )}

          {activeView === 'predictions' && <div className="max-w-4xl mx-auto"><Predictor /></div>}
          {activeView === 'news' && <NewsSection />}
          {activeView === 'manual' && <UserManual />}
          {activeView === 'admin' && <AdminDashboard />}
          {activeView === 'disclaimer' && <DisclaimerPage />}
          {activeView === 'privacy' && <PrivacyPolicy />}
          {activeView === 'about' && <AboutUs />}
          {activeView === 'contact' && <ContactUs />}
          {activeView === 'sitemap' && <Sitemap onNavigate={setActiveView} />}
          {activeView === 'terms' && <TermsConditions />}
        </div>

        <footer className="mt-20 p-8 border-t border-white/5 bg-black/40 text-slate-500">
           <div className="max-w-7xl mx-auto flex flex-col md:flex-row justify-between items-center gap-4 text-[9px] font-bold uppercase tracking-[0.2em]">
              <div className="flex items-center gap-4">
                <NexusLogo size="sm" className="opacity-50 grayscale" />
                <p>© 2024 4D NEXUS PRO. INTELLIGENT DATA ECOSYSTEM.</p>
              </div>
              <div className="flex gap-8">
                <span className="flex items-center gap-1"><ShieldCheck size={10} className="text-blue-500" /> AES-256 SECURE</span>
                <span className="text-slate-600">Sync: Southeast Asia Cloud</span>
              </div>
           </div>
        </footer>
      </main>
    </div>
  );
};

export default App;
