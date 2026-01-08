
import React, { useState, useEffect, useMemo, useRef } from 'react';
import { 
  LayoutDashboard, 
  BarChart3, 
  History, 
  Cpu, 
  Globe, 
  Search,
  Timer,
  Menu,
  X,
  CreditCard,
  BookOpen,
  ShieldCheck,
  Newspaper,
  ChevronDown,
  Calendar as CalendarIcon,
  Trophy,
  Clock,
  RefreshCw,
  Zap,
  CheckCircle2,
  Heart,
  MessageCircle,
  Code,
  Sun,
  Moon,
  ShieldAlert,
  ArrowRight,
  ExternalLink,
  Facebook,
  Twitter,
  Instagram,
  ShieldEllipsis,
  Camera,
  Layers,
  Users,
  Mail,
  Send,
  Lock,
  Settings,
  ChevronUp,
  Languages,
  UserPlus,
  LogIn,
  Fingerprint,
  User as UserIcon,
  MoreVertical,
  LogOut,
  Sliders,
  Coins,
  AlertTriangle,
  Skull,
  Monitor,
  Sparkles,
  MapPin,
  Loader2,
  ArrowUp
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
import { AdSensePlaceholder } from './components/AdSensePlaceholder';
import { CommunityChat } from './components/CommunityChat';
import { WidgetGenerator } from './components/WidgetGenerator';
import { PremiumView } from './components/PremiumView';
import { VoiceSearch } from './components/VoiceSearch';
import { LoyaltySystem } from './components/LoyaltySystem';
import { BlockchainVerification } from './components/BlockchainVerification';
import { JackpotTracker } from './components/JackpotTracker';
import { AIChatAssistant } from './components/AIChatAssistant';
import { ArExperience } from './components/ArExperience';
import { DigitHeatmap } from './components/DigitHeatmap';
import { GamingTools } from './components/GamingTools';
import { RankingSystem } from './components/RankingSystem';
import { RegistrationModal } from './components/RegistrationModal';
import { LoginModal } from './components/LoginModal';
import { HistoryArchive } from './components/HistoryArchive';
import { PersonalWatchlist } from './components/PersonalWatchlist';
import { SellerArchive } from './components/SellerArchive';
import { LotteryProvider, LotteryResult, User, EliteRequest } from './types';
import { 
  DisclaimerPage, 
  PrivacyPolicy, 
  AboutUs, 
  ContactUs, 
  Sitemap, 
  TermsConditions 
} from './components/LegalPages';

type View = 'dashboard' | 'stats' | 'archive' | 'predictions' | 'news' | 'favorites' | 'premium' | 'manual' | 'admin' | 'disclaimer' | 'privacy' | 'about' | 'contact' | 'sitemap' | 'terms' | 'community' | 'widgets' | 'challenges' | 'sellers';
type LangCode = 'EN' | 'CN' | 'MY';

export interface FrequencyNode {
  digit: number;
  pos: number;
  freq: number;
  lastSeen: string;
}

const App: React.FC = () => {
  const [isHandshaking, setIsHandshaking] = useState(true);
  
  const detectLanguage = (): LangCode => {
    try {
      const saved = localStorage.getItem('nexus_pro_lang') as LangCode;
      if (saved && ['EN', 'CN', 'MY'].includes(saved)) return saved;
      const browserLang = (navigator.language || 'en').toLowerCase();
      if (browserLang.includes('zh')) return 'CN';
      if (browserLang.includes('ms') || browserLang.includes('my')) return 'MY';
    } catch (e) {}
    return 'EN';
  };

  const todayStr = new Date().toISOString().split('T')[0];

  const [lang, setLang] = useState<LangCode>(detectLanguage());
  const [activeView, setActiveView] = useState<View>('dashboard');
  const [theme, setTheme] = useState<'dark' | 'light'>('dark');
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [selectedResult, setSelectedResult] = useState<LotteryResult | null>(null);
  const [sharingResult, setSharingResult] = useState<LotteryResult | null>(null);
  const [toast, setToast] = useState<{ message: string; type: 'success' | 'info' | 'premium' | 'error' } | null>(null);
  const [showLangMenu, setShowLangMenu] = useState(false);
  const [showLogin, setShowLogin] = useState(false);
  const [showProfileMenu, setShowProfileMenu] = useState(false);
  const [showScrollTop, setShowScrollTop] = useState(false);
  
  const [pendingEliteRequests, setPendingEliteRequests] = useState<EliteRequest[]>(() => {
    try {
      const saved = localStorage.getItem('nexus_elite_requests');
      return saved ? JSON.parse(saved) : [];
    } catch (e) { return []; }
  });

  const [celebrationMatch, setCelebrationMatch] = useState<{ result: LotteryResult; num: string } | null>(null);
  const mainRef = useRef<HTMLDivElement>(null);
  const [isPremium, setIsPremium] = useState(false);
  const [isAdmin, setIsAdmin] = useState(false);
  
  const [currentUser, setCurrentUser] = useState<User | null>(() => {
    try {
      const saved = localStorage.getItem('nexus_user');
      return saved ? JSON.parse(saved) : null;
    } catch (e) { return null; }
  });
  
  const [currentTime, setCurrentTime] = useState(new Date());
  const [selectedDate, setSelectedDate] = useState(todayStr);

  const [favorites, setFavorites] = useState<LotteryResult[]>(() => {
    try {
      const saved = localStorage.getItem('nexus_pro_favorites');
      return saved ? JSON.parse(saved) : [];
    } catch (e) { return []; }
  });

  const [heatmapData, setHeatmapData] = useState<FrequencyNode[]>(() => {
    const nodes: FrequencyNode[] = [];
    for (let pos = 1; pos <= 4; pos++) {
      for (let digit = 0; digit <= 9; digit++) {
        const baseFreq = 40 + (Math.sin(pos * digit) * 30) + (Math.random() * 20);
        nodes.push({
          digit, pos, freq: Math.floor(Math.min(99, Math.max(5, baseFreq))),
          lastSeen: `${Math.floor(Math.random() * 24)}h ago`
        });
      }
    }
    return nodes;
  });

  const t = LANGUAGES[lang] || LANGUAGES.EN;

  useEffect(() => {
    const timer = setTimeout(() => {
      setIsHandshaking(false);
    }, 1200);
    return () => clearTimeout(timer);
  }, []);

  useEffect(() => {
    const handleScroll = () => {
      if (mainRef.current) {
        setShowScrollTop(mainRef.current.scrollTop > 400);
      }
    };
    const mainEl = mainRef.current;
    mainEl?.addEventListener('scroll', handleScroll);
    return () => mainEl?.removeEventListener('scroll', handleScroll);
  }, []);

  useEffect(() => {
    document.documentElement.classList.toggle('dark', theme === 'dark');
  }, [theme]);

  useEffect(() => {
    localStorage.setItem('nexus_pro_favorites', JSON.stringify(favorites));
  }, [favorites]);

  useEffect(() => {
    localStorage.setItem('nexus_pro_lang', lang);
  }, [lang]);

  useEffect(() => {
    if (currentUser) {
      localStorage.setItem('nexus_user', JSON.stringify(currentUser));
      setIsPremium(currentUser.isPremium);
      if (currentUser.nexusId === 'admin_jewel') setIsAdmin(true);
    } else {
      localStorage.removeItem('nexus_user');
      setIsAdmin(false);
    }
  }, [currentUser]);

  useEffect(() => {
    if (toast) {
      const timer = setTimeout(() => setToast(null), 3000);
      return () => clearTimeout(timer);
    }
  }, [toast]);

  useEffect(() => {
    const timer = setInterval(() => setCurrentTime(new Date()), 1000);
    return () => clearInterval(timer);
  }, []);

  const handleSelectProvider = (provider: LotteryProvider) => {
    const latestForProvider = MOCK_RESULTS
      .filter(r => r.provider === provider)
      .sort((a, b) => b.timestamp - a.timestamp)[0];
    if (latestForProvider) setSelectedResult(latestForProvider);
  };

  const handleGuestAttempt = () => {
    setToast({ message: t.common.guestRestriction, type: 'error' });
  };

  const handleWatchlistMatch = (result: LotteryResult, matchedNum: string) => {
    setCelebrationMatch({ result, num: matchedNum });
    setToast({ message: "Victory Signature Detected!", type: 'success' });
  };

  const toggleFavorite = (result: LotteryResult) => {
    setFavorites(prev => {
      const exists = prev.some(f => f.provider === result.provider && f.drawDate === result.drawDate);
      if (exists) {
        setToast({ message: `${result.provider} removed`, type: 'info' });
        return prev.filter(f => !(f.provider === result.provider && f.drawDate === result.drawDate));
      }
      setToast({ message: `${result.provider} saved`, type: 'success' });
      return [...prev, result];
    });
  };

  const isResultFavorite = (result: LotteryResult) => 
    favorites.some(f => f.provider === result.provider && f.drawDate === result.drawDate);

  const displayResults = useMemo(() => {
    const dateResults = MOCK_RESULTS.filter(res => res.drawDate === selectedDate);
    if (dateResults.length > 0) return { results: dateResults, isFallback: false, label: t.common.officialResults, date: selectedDate };
    const latestAvailableDate = [...MOCK_RESULTS].sort((a,b) => b.timestamp - a.timestamp)[0]?.drawDate || todayStr;
    return { results: MOCK_RESULTS.filter(r => r.drawDate === latestAvailableDate), isFallback: true, label: t.common.latestResults, date: latestAvailableDate };
  }, [selectedDate, t]);

  if (isHandshaking) {
    return (
      <div className="fixed inset-0 bg-[#050505] flex flex-col items-center justify-center space-y-6 z-[300]">
         <div className="relative">
            <div className="absolute inset-0 bg-blue-500 blur-[80px] opacity-20 animate-pulse"></div>
            <NexusLogo size="lg" className="relative z-10 animate-pulse" />
         </div>
         <div className="flex flex-col items-center space-y-2">
            <Loader2 className="text-blue-500 animate-spin" size={24} />
            <p className="text-[10px] font-black uppercase tracking-[0.4em] text-slate-500">Establishing Handshake Protocol...</p>
         </div>
      </div>
    );
  }

  const NavItem = ({ icon: Icon, label, id, badge }: { icon: any, label: string, id: View, badge?: string }) => (
    <button
      onClick={() => { setActiveView(id); setSidebarOpen(false); if(mainRef.current) mainRef.current.scrollTop = 0; }}
      className={`flex items-center gap-3 px-4 py-3 sm:py-3.5 rounded-xl transition-all w-full text-left group active:scale-[0.98] md:active:scale-100 ${
        activeView === id 
          ? 'bg-blue-600/10 text-blue-500 dark:text-blue-400 border border-blue-500/20 shadow-sm' 
          : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white hover:bg-slate-100 dark:hover:bg-white/5'
      }`}
    >
      <Icon size={18} className={activeView === id ? 'text-blue-500' : 'group-hover:scale-110 transition-transform'} />
      <span className="font-semibold text-sm flex-1">{label}</span>
      {badge && <span className="text-[8px] font-black bg-blue-500 text-white px-1.5 py-0.5 rounded-full">{badge}</span>}
      {activeView === id && <div className="w-1.5 h-1.5 rounded-full bg-blue-500 shadow-[0_0_8px_rgba(59,130,246,0.5)]"></div>}
    </button>
  );

  return (
    <div className="min-h-screen flex flex-col md:flex-row bg-transparent">
      {toast && (
        <div className={`fixed bottom-8 left-1/2 -translate-x-1/2 z-[200] px-6 py-3 rounded-2xl glass border flex items-center gap-3 shadow-2xl animate-in slide-in-from-bottom-4 duration-300 ${
          toast.type === 'premium' ? 'border-amber-500/30 bg-amber-500/10 text-amber-500' : 
          toast.type === 'error' ? 'border-red-500/30 bg-red-500/10 text-red-500' :
          'border-white/10'
        }`}>
          <div className={`w-2 h-2 rounded-full ${toast.type === 'success' ? 'bg-green-500' : toast.type === 'premium' ? 'bg-amber-500' : toast.type === 'error' ? 'bg-red-500' : 'bg-blue-500'}`}></div>
          <span className="text-xs font-bold font-orbitron tracking-wider text-center">{toast.message}</span>
        </div>
      )}

      {celebrationMatch && (
        <div className="fixed inset-0 z-[300] flex items-center justify-center p-4">
          <div className="absolute inset-0 bg-black/90 backdrop-blur-2xl animate-in fade-in duration-500" onClick={() => setCelebrationMatch(null)}></div>
          <div className="relative glass rounded-[3rem] border-2 border-amber-500/40 p-8 sm:p-12 text-center space-y-8 shadow-[0_0_100px_rgba(245,158,11,0.2)] animate-in zoom-in slide-in-from-bottom-12 duration-700 max-w-lg">
             <div className="relative z-10 space-y-4">
                <div className="w-20 sm:w-24 h-20 sm:h-24 bg-amber-500/10 rounded-full flex items-center justify-center mx-auto border border-amber-500/30 shadow-[0_0_30px_rgba(245,158,11,0.2)] animate-bounce">
                   <Trophy size={40} className="text-amber-500 sm:size-48" />
                </div>
                <h2 className="text-4xl sm:text-6xl font-orbitron font-black text-white glow-gold tracking-tighter">CONGRATS!</h2>
                <p className="text-sm sm:text-xl font-orbitron font-bold text-amber-500 uppercase tracking-[0.3em]">Signature Match Detected</p>
             </div>
             <div className="relative z-10 bg-white/5 border border-white/10 rounded-[2rem] p-6 sm:p-8 space-y-4">
                <p className="text-[10px] font-black text-slate-500 uppercase tracking-widest">Matched Sequence</p>
                <div className="text-6xl sm:text-8xl font-orbitron font-black text-white tracking-[0.1em]">{celebrationMatch.num}</div>
                <div className="flex flex-col gap-1">
                   <p className="text-lg font-orbitron font-bold text-blue-400">{celebrationMatch.result.provider}</p>
                   <p className="text-[10px] sm:text-xs text-slate-500 font-bold uppercase tracking-widest">{celebrationMatch.result.drawDate} &bull; Draw #{celebrationMatch.result.drawNumber}</p>
                </div>
             </div>
             <div className="relative z-10 flex gap-4">
                <ShadowButton onClick={() => setCelebrationMatch(null)} variant="gold" className="flex-1 py-4 sm:py-5 text-sm font-black uppercase">
                  Collect Victory Data
                </ShadowButton>
             </div>
          </div>
        </div>
      )}

      {sidebarOpen && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm z-[155] md:hidden animate-in fade-in duration-300" onClick={() => setSidebarOpen(false)}></div>
      )}

      <aside className={`fixed inset-y-0 left-0 z-[160] md:static w-72 h-full border-r border-slate-200 dark:border-white/5 p-6 flex flex-col gap-6 transition-transform duration-300 md:translate-x-0 bg-slate-50 dark:bg-[#050505] shadow-2xl md:shadow-none ${sidebarOpen ? 'translate-x-0' : '-translate-x-full'}`}>
        <div className="flex items-center justify-between">
           <NexusLogo size="md" onClick={() => setActiveView('dashboard')} className="cursor-pointer" />
           <button onClick={() => setSidebarOpen(false)} className="md:hidden p-2 text-slate-500 active:bg-slate-200 dark:active:bg-white/10 rounded-lg"><X size={24}/></button>
        </div>
        <nav className="flex-1 space-y-1 overflow-y-auto pr-2 custom-scrollbar">
          <NavItem icon={LayoutDashboard} label={t.nav.dashboard} id="dashboard" />
          <NavItem icon={BarChart3} label={t.nav.stats} id="stats" />
          <NavItem icon={History} label={t.nav.archive} id="archive" />
          <NavItem icon={MapPin} label={t.nav.sellers} id="sellers" />
          <NavItem icon={Heart} label={t.nav.favorites} id="favorites" />
          <NavItem icon={MessageCircle} label={t.nav.community} id="community" />
          <NavItem icon={Trophy} label={t.nav.challenges} id="challenges" />
          <NavItem icon={Cpu} label={t.nav.predictions} id="predictions" badge={isPremium ? "PRO" : "LITE"} />
          <NavItem icon={Newspaper} label={t.nav.news} id="news" />
          <NavItem icon={Code} label={t.nav.widgets} id="widgets" />
          <div className="my-4 border-t border-slate-200 dark:border-white/5"></div>
          <NavItem icon={CreditCard} label={t.nav.premium} id="premium" />
          <NavItem icon={ShieldCheck} label={t.nav.admin} id="admin" />
        </nav>
        <LoyaltySystem currentUser={currentUser} onUpdateUser={setCurrentUser} />
      </aside>

      <main ref={mainRef} className="flex-1 overflow-y-auto relative flex flex-col bg-slate-50 dark:bg-[#050505] text-slate-900 dark:text-white pb-24 md:pb-0">
        <header className="flex h-20 items-center justify-between px-4 md:px-8 border-b border-slate-200 dark:border-white/5 sticky top-0 z-50 bg-slate-50/80 dark:bg-[#050505]/80 backdrop-blur-md">
          <div className="flex items-center gap-2 md:gap-6">
            <button onClick={() => setSidebarOpen(true)} className="md:hidden p-3 text-slate-500 hover:text-blue-500 transition-colors active:scale-95">
              <Menu size={26} />
            </button>
            <div className="hidden lg:flex items-center gap-3 glass px-4 py-2 rounded-xl border border-white/5">
              <Clock size={16} className="text-blue-500" />
              <span className="text-xs font-orbitron font-bold tabular-nums">
                {currentTime.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', second: '2-digit' })}
              </span>
            </div>
            <VoiceSearch onCommand={(i, p) => setToast({ message: `AI Intent: ${i}`, type: 'info' })} />
          </div>

          <div className="flex items-center gap-2 md:gap-4">
            <div className="hidden xl:flex items-center gap-2 mr-4">
                <div className={`h-2 w-2 rounded-full ${isPremium ? 'bg-amber-500' : currentUser ? 'bg-blue-500' : 'bg-slate-500'}`}></div>
                <span className="text-[10px] font-black uppercase text-slate-500">
                  {isPremium ? t.common.elite : currentUser ? t.common.verifiedNode : t.common.guestPunter}
                </span>
            </div>
            
            <div className="flex items-center gap-2">
              <div className="relative">
                <button onClick={() => setShowLangMenu(!showLangMenu)} className="p-2.5 rounded-xl glass border border-white/10 text-slate-500 hover:text-blue-500 transition-all flex items-center gap-2 active:scale-95">
                  <Languages size={18} />
                  <span className="hidden xl:block text-[10px] font-black">{lang}</span>
                </button>
                {showLangMenu && (
                  <div className="absolute top-full right-0 mt-2 w-32 glass border border-white/10 rounded-2xl p-2 shadow-2xl animate-in zoom-in z-50">
                    {(['EN', 'CN', 'MY'] as LangCode[]).map(l => (
                      <button key={l} onClick={() => { setLang(l); setShowLangMenu(false); }} className={`w-full text-left px-4 py-2 rounded-xl text-xs font-bold ${lang === l ? 'bg-blue-600/10 text-blue-500' : 'text-slate-500 hover:bg-white/5'}`}>{l}</button>
                    ))}
                  </div>
                )}
              </div>
            </div>

            {currentUser ? (
              <div className="relative">
                <button onClick={() => setShowProfileMenu(!showProfileMenu)} className="flex items-center gap-2 sm:gap-3 glass p-1.5 rounded-2xl border border-white/10 hover:border-blue-500/50 transition-all active:scale-95">
                  <img src={`https://api.dicebear.com/7.x/avataaars/svg?seed=user${currentUser.avatarId}`} className="w-8 h-8 rounded-xl border border-white/10" alt="Avatar" />
                  <div className="hidden sm:block pr-2 text-left">
                    <p className="text-[10px] font-black leading-tight">{currentUser.nexusId}</p>
                    <p className="text-[8px] font-bold text-slate-500">{currentUser.points} PTS</p>
                  </div>
                </button>
              </div>
            ) : (
              <button onClick={() => setShowLogin(true)} className="flex items-center gap-2 px-3 sm:px-4 py-2.5 rounded-xl bg-blue-600 text-white text-[10px] font-black uppercase tracking-widest hover:bg-blue-500 transition-all shadow-lg active:scale-95">
                <Fingerprint size={16} /> <span className="hidden xs:inline">{t.common.activation}</span>
              </button>
            )}
          </div>
        </header>

        <div className="p-4 md:p-8 max-w-7xl mx-auto space-y-8 flex-1 w-full">
          {activeView === 'dashboard' && (
            <>
              <div className="flex flex-col gap-6">
                <div className="flex items-center justify-between px-1">
                  <h2 className="text-lg sm:text-xl font-orbitron font-bold flex items-center gap-3">
                    <div className="nexus-line nexus-line-amber"></div> {t.common.jackpotPulse}
                  </h2>
                  <div className="flex items-center gap-2">
                    <span className="w-2 h-2 rounded-full bg-red-500 animate-ping"></span>
                    <span className="text-[9px] font-black uppercase text-slate-500 hidden sm:inline">{t.common.syncActive}</span>
                  </div>
                </div>
                <JackpotTracker />
              </div>
              <LogoTicker onSelectProvider={handleSelectProvider} />
              <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                <div className="lg:col-span-2 space-y-6">
                  <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 bg-white/50 dark:bg-white/5 p-4 rounded-[1.5rem] border border-slate-200 dark:border-white/5">
                    <div className="flex items-center gap-3">
                      <Zap size={20} className="text-blue-500" />
                      <div>
                        <h2 className="text-sm font-orbitron font-bold uppercase">{displayResults.label}</h2>
                        <p className="text-[9px] text-slate-500 font-bold">{displayResults.date}</p>
                      </div>
                    </div>
                    <input type="date" value={selectedDate} onChange={(e) => setSelectedDate(e.target.value)} className="bg-transparent text-[10px] font-black uppercase font-orbitron outline-none w-full sm:w-auto" />
                  </div>
                  <div className="grid grid-cols-1 gap-6">
                    {displayResults.results.map((res, i) => (
                      <div key={i} onClick={() => setSelectedResult(res)} className="cursor-pointer transition-transform hover:scale-[1.01] active:scale-[0.99]">
                        <ResultCard 
                          result={res} lang={lang} isLoggedIn={!!currentUser} 
                          onGuestAttempt={handleGuestAttempt} 
                          isFavorite={isResultFavorite(res)}
                          onToggleFavorite={(e) => { e.stopPropagation(); toggleFavorite(res); }}
                        />
                      </div>
                    ))}
                  </div>
                </div>
                <div className="space-y-8">
                  {currentUser && <PersonalWatchlist isLoggedIn={true} onGuestAttempt={handleGuestAttempt} onMatch={handleWatchlistMatch} />}
                  <LuckyNumber lang={lang} heatmapData={heatmapData} />
                  <Predictor isPremium={isPremium} lang={lang} heatmapData={heatmapData} />
                  <DigitHeatmap lang={lang} data={heatmapData} onSync={setHeatmapData} />
                </div>
              </div>
            </>
          )}

          {activeView === 'predictions' && (
            <div className="space-y-8 max-w-4xl mx-auto">
               <div className="flex items-center gap-4">
                  <Cpu className="text-amber-500" size={32} />
                  <h2 className="text-3xl font-orbitron font-bold">Neural Core Activation</h2>
               </div>
               <Predictor isPremium={isPremium} lang={lang} heatmapData={heatmapData} />
               <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                  <DigitHeatmap lang={lang} data={heatmapData} onSync={setHeatmapData} />
                  <LuckyNumber lang={lang} heatmapData={heatmapData} />
               </div>
            </div>
          )}

          {activeView === 'stats' && (
            <div className="space-y-8">
               <h2 className="text-2xl sm:text-3xl font-orbitron font-bold">Deep Analytics Matrix</h2>
               <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                  <div className="glass p-6 sm:p-8 rounded-[2rem] border border-white/5">
                     <h3 className="text-lg sm:text-xl font-bold mb-6">Hot Spot Frequency</h3>
                     <StatsChart />
                  </div>
                  <DigitHeatmap lang={lang} data={heatmapData} onSync={setHeatmapData} />
               </div>
            </div>
          )}

          {activeView === 'archive' && <HistoryArchive lang={lang} isLoggedIn={!!currentUser} onGuestAttempt={handleGuestAttempt} onMatch={handleWatchlistMatch} />}
          {activeView === 'news' && <NewsSection isLoggedIn={!!currentUser} onGuestAttempt={handleGuestAttempt} />}
          {activeView === 'favorites' && (
            <div className="space-y-8">
              <h2 className="text-2xl sm:text-3xl font-orbitron font-bold">My Personal Library</h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {favorites.length > 0 ? favorites.map((res, i) => (
                   <ResultCard 
                    key={i} result={res} lang={lang} isLoggedIn={!!currentUser} 
                    onGuestAttempt={handleGuestAttempt} isFavorite={true}
                    onToggleFavorite={() => toggleFavorite(res)}
                   />
                )) : (
                  <div className="col-span-full py-40 text-center glass rounded-[3rem] border border-dashed border-white/10">
                     <Heart size={64} className="mx-auto text-slate-800 mb-4" />
                     <p className="text-slate-500 font-bold uppercase tracking-widest">Library Empty</p>
                  </div>
                )}
              </div>
            </div>
          )}
          
          {activeView === 'community' && <CommunityChat isPremium={isPremium} currentUser={currentUser} onUpdateUser={setCurrentUser} onGuestAttempt={handleGuestAttempt} />}
          {activeView === 'challenges' && <RankingSystem />}
          {activeView === 'sellers' && <SellerArchive isAdmin={isAdmin} onNavigateToContact={() => setActiveView('contact')} />}
          {activeView === 'premium' && <PremiumView isPremium={isPremium} currentUser={currentUser} pendingRequests={pendingEliteRequests} onRequestUpgrade={() => setToast({message: "Upgrade Request Synchronized", type: 'info'})} />}
          {activeView === 'admin' && <AdminDashboard eliteRequests={pendingEliteRequests} onApproveElite={(id) => {
            setPendingEliteRequests(prev => prev.filter(r => r.id !== id));
            setToast({ message: "Node Promoted to Elite", type: 'premium' });
          }} />}
          {activeView === 'manual' && <UserManual />}
          {activeView === 'disclaimer' && <DisclaimerPage />}
          {activeView === 'privacy' && <PrivacyPolicy />}
          {activeView === 'about' && <AboutUs />}
          {activeView === 'contact' && <ContactUs />}
          {activeView === 'sitemap' && <Sitemap onNavigate={setActiveView} />}
          {activeView === 'terms' && <TermsConditions />}
          {activeView === 'widgets' && <WidgetGenerator />}
        </div>
      </main>

      {showScrollTop && (
        <button 
          onClick={() => mainRef.current?.scrollTo({ top: 0, behavior: 'smooth' })}
          className="fixed bottom-6 right-24 w-12 h-12 glass border border-white/10 rounded-full flex items-center justify-center text-blue-500 shadow-2xl animate-in fade-in slide-in-from-bottom-4 transition-all hover:bg-blue-600 hover:text-white z-[140]"
        >
          <ArrowUp size={20} />
        </button>
      )}

      {selectedResult && (
        <ProviderResultsModal 
          result={selectedResult} 
          onClose={() => setSelectedResult(null)} 
          lang={lang} 
          isLoggedIn={!!currentUser} 
          onGuestAttempt={handleGuestAttempt}
          isFavorite={isResultFavorite(selectedResult)}
          onToggleFavorite={() => toggleFavorite(selectedResult)}
          onShare={(e) => { e.stopPropagation(); setSharingResult(selectedResult); }}
        />
      )}

      {sharingResult && <ShareModal result={sharingResult} onClose={() => setSharingResult(null)} />}
      <LoginModal 
        isOpen={showLogin} onClose={() => setShowLogin(false)} lang={lang} 
        onLogin={(u) => { setCurrentUser(u); setShowLogin(false); }} onCreateId={() => {}} 
      />
      <AIChatAssistant />
    </div>
  );
};

export default App;
