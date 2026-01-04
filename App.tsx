
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
  Monitor
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
import { LotteryProvider, LotteryResult, User } from './types';
import { 
  DisclaimerPage, 
  PrivacyPolicy, 
  AboutUs, 
  ContactUs, 
  Sitemap, 
  TermsConditions 
} from './components/LegalPages';

type View = 'dashboard' | 'stats' | 'archive' | 'predictions' | 'news' | 'favorites' | 'premium' | 'manual' | 'admin' | 'disclaimer' | 'privacy' | 'about' | 'contact' | 'sitemap' | 'terms' | 'community' | 'widgets' | 'challenges';
type LangCode = 'EN' | 'CN' | 'MY';

const SIX_DAYS_MS = 6 * 24 * 60 * 60 * 1000;
const SEVEN_DAYS_MS = 7 * 24 * 60 * 60 * 1000;

export interface FrequencyNode {
  digit: number;
  pos: number;
  freq: number;
  lastSeen: string;
}

const App: React.FC = () => {
  const detectLanguage = (): LangCode => {
    try {
      const saved = localStorage.getItem('nexus_pro_lang') as LangCode;
      if (saved && (saved === 'EN' || saved === 'CN' || saved === 'MY')) return saved;
      const browserLang = (navigator.language || 'en').toLowerCase();
      if (browserLang.includes('zh')) return 'CN';
      if (browserLang.includes('ms') || browserLang.includes('my')) return 'MY';
    } catch (e) {
      console.warn("Storage or Navigator access limited.");
    }
    return 'EN';
  };

  const todayStr = new Date().toISOString().split('T')[0];

  const [lang, setLang] = useState<LangCode>(detectLanguage());
  const [activeView, setActiveView] = useState<View>('dashboard');
  const [theme, setTheme] = useState<'dark' | 'light'>('dark');
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [selectedResult, setSelectedResult] = useState<LotteryResult | null>(null);
  const [sharingResult, setSharingResult] = useState<LotteryResult | null>(null);
  const [verifyingResultId, setVerifyingResultId] = useState<string | null>(null);
  const [showAr, setShowAr] = useState(false);
  const [toast, setToast] = useState<{ message: string; type: 'success' | 'info' | 'premium' | 'error' } | null>(null);
  const [showScrollTop, setShowScrollTop] = useState(false);
  const [showLangMenu, setShowLangMenu] = useState(false);
  const [showLogin, setShowLogin] = useState(false);
  const [showProfileMenu, setShowProfileMenu] = useState(false);
  const [showMobileTools, setShowMobileTools] = useState(false);
  
  const mainRef = useRef<HTMLDivElement>(null);
  const [isPremium, setIsPremium] = useState(false);
  const [isAdmin, setIsAdmin] = useState(false);
  
  const [currentUser, setCurrentUser] = useState<User | null>(() => {
    try {
      const saved = localStorage.getItem('nexus_user');
      return saved ? JSON.parse(saved) : null;
    } catch (e) {
      console.error("User restoration failed.");
      return null;
    }
  });
  
  const [currentTime, setCurrentTime] = useState(new Date());
  const [selectedDate, setSelectedDate] = useState(todayStr);

  const [favorites, setFavorites] = useState<LotteryResult[]>(() => {
    try {
      const saved = localStorage.getItem('nexus_pro_favorites');
      return saved ? JSON.parse(saved) : [];
    } catch (e) {
      return [];
    }
  });

  const [inactivityState, setInactivityState] = useState<{ showWarning: boolean; countdown: string }>({
    showWarning: false,
    countdown: ''
  });

  const [heatmapData, setHeatmapData] = useState<FrequencyNode[]>(() => {
    const nodes: FrequencyNode[] = [];
    for (let pos = 1; pos <= 4; pos++) {
      for (let digit = 0; digit <= 9; digit++) {
        const baseFreq = 40 + (Math.sin(pos * digit) * 30) + (Math.random() * 20);
        nodes.push({
          digit,
          pos,
          freq: Math.floor(Math.min(99, Math.max(5, baseFreq))),
          lastSeen: `${Math.floor(Math.random() * 24)}h ago`
        });
      }
    }
    return nodes;
  });

  const t = LANGUAGES[lang] || LANGUAGES.EN;

  useEffect(() => {
    const checkInactivity = () => {
      try {
        const lastActive = localStorage.getItem('nexus_last_active');
        if (!lastActive || !currentUser) return;

        const diff = Date.now() - parseInt(lastActive);
        
        if (diff >= SEVEN_DAYS_MS) {
          localStorage.clear();
          setCurrentUser(null);
          setFavorites([]);
          setInactivityState({ showWarning: false, countdown: '' });
          setToast({ message: "Inactivity purge complete. Data neutralized.", type: 'error' });
        } else if (diff >= SIX_DAYS_MS) {
          const remaining = SEVEN_DAYS_MS - diff;
          const hours = Math.floor(remaining / (1000 * 60 * 60));
          const mins = Math.floor((remaining % (1000 * 60 * 60)) / (1000 * 60));
          const secs = Math.floor((remaining % (1000 * 60)) / 1000);
          setInactivityState({
            showWarning: true,
            countdown: `${hours.toString().padStart(2, '0')}:${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`
          });
        } else {
          setInactivityState({ showWarning: false, countdown: '' });
        }
      } catch (e) {}
    };

    const timer = setInterval(checkInactivity, 1000);
    return () => clearInterval(timer);
  }, [currentUser]);

  useEffect(() => {
    const trackActivity = () => {
      if (currentUser) {
        try {
          localStorage.setItem('nexus_last_active', Date.now().toString());
        } catch(e) {}
      }
    };

    window.addEventListener('mousedown', trackActivity);
    window.addEventListener('keydown', trackActivity);
    return () => {
      window.removeEventListener('mousedown', trackActivity);
      window.removeEventListener('keydown', trackActivity);
    };
  }, [currentUser]);

  useEffect(() => {
    document.documentElement.classList.toggle('dark', theme === 'dark');
  }, [theme]);

  useEffect(() => {
    try {
      localStorage.setItem('nexus_pro_favorites', JSON.stringify(favorites));
    } catch(e) {}
  }, [favorites]);

  useEffect(() => {
    try {
      localStorage.setItem('nexus_pro_lang', lang);
    } catch(e) {}
  }, [lang]);

  useEffect(() => {
    if (currentUser) {
      try {
        localStorage.setItem('nexus_user', JSON.stringify(currentUser));
        localStorage.setItem('nexus_last_active', Date.now().toString());
      } catch(e) {}
      setIsPremium(currentUser.isPremium);
    } else {
      try {
        localStorage.removeItem('nexus_user');
        localStorage.removeItem('nexus_last_active');
      } catch(e) {}
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

  useEffect(() => {
    const handleScroll = () => {
      if (mainRef.current) setShowScrollTop(mainRef.current.scrollTop > 400);
    };
    const mainEl = mainRef.current;
    mainEl?.addEventListener('scroll', handleScroll);
    return () => mainEl?.removeEventListener('scroll', handleScroll);
  }, []);

  useEffect(() => { mainRef.current?.scrollTo(0, 0); }, [activeView]);

  const handleLogout = () => {
    setCurrentUser(null);
    setShowProfileMenu(false);
    setToast({ message: "Node Deactivated. Safe session ended.", type: 'info' });
  };

  const handleSelectProvider = (provider: LotteryProvider) => {
    const latestForProvider = MOCK_RESULTS
      .filter(r => r.provider === provider)
      .sort((a, b) => b.timestamp - a.timestamp)[0];
    if (latestForProvider) setSelectedResult(latestForProvider);
  };

  const handleGuestAttempt = () => {
    setToast({ message: t.common.guestRestriction, type: 'error' });
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

  const handleVoiceCommand = (intent: string, provider: string | null) => {
    setToast({ message: `AI Intent: ${intent}`, type: 'info' });
    if (intent === 'OPEN_COMMUNITY') setActiveView('community');
    else if (intent === 'VIEW_STATS') setActiveView('stats');
    else if (intent === 'CHECK_RESULT') {
        if (provider) {
          const matched = Object.values(LotteryProvider).find(p => p.toLowerCase().includes(provider.toLowerCase()));
          if (matched) handleSelectProvider(matched);
        } else setActiveView('dashboard');
    }
  };

  const handleRecalibrateHeatmap = (newData: FrequencyNode[]) => {
    setHeatmapData(newData);
    setToast({ message: "Global Heatmap Sync Complete", type: 'success' });
  };

  const NavItem = ({ icon: Icon, label, id, badge }: { icon: any, label: string, id: View, badge?: string }) => (
    <button
      onClick={() => { setActiveView(id); setSidebarOpen(false); }}
      className={`flex items-center gap-3 px-4 py-3 rounded-xl transition-all w-full text-left group ${
        activeView === id 
          ? 'bg-blue-600/10 text-blue-500 dark:text-blue-400 border border-blue-500/20 shadow-sm' 
          : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white hover:bg-slate-100 dark:hover:bg-white/5'
      }`}
    >
      <Icon size={18} className={activeView === id ? 'text-blue-500' : 'group-hover:scale-110 transition-transform'} />
      <span className="font-medium text-sm flex-1">{label}</span>
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

      {inactivityState.showWarning && (
        <div className="fixed top-0 left-0 right-0 z-[300] bg-red-600 text-white py-3 px-6 flex items-center justify-between animate-in slide-in-from-top duration-500 shadow-2xl">
          <div className="flex items-center gap-4">
             <AlertTriangle size={24} className="animate-pulse" />
             <div>
                <p className="text-xs font-black uppercase tracking-widest leading-none">INACTIVITY CRITICAL WARNING</p>
                <p className="text-[10px] opacity-80 mt-1 uppercase font-bold tracking-tighter">Your node will be purged in {inactivityState.countdown} unless you initiate a sync.</p>
             </div>
          </div>
          <button 
            onClick={() => {
              try { localStorage.setItem('nexus_last_active', Date.now().toString()); } catch(e) {}
            }}
            className="px-6 py-2 bg-white text-red-600 font-black text-[10px] uppercase tracking-widest rounded-xl hover:bg-slate-100 transition-all active:scale-95"
          >
            SYNC NOW
          </button>
        </div>
      )}

      {showScrollTop && (
        <button 
          onClick={() => mainRef.current?.scrollTo({ top: 0, behavior: 'smooth' })}
          className="fixed bottom-24 right-8 z-[140] w-12 h-12 glass border border-white/10 rounded-2xl flex items-center justify-center text-blue-500 shadow-2xl hover:scale-110 active:scale-95 transition-all animate-in slide-in-from-bottom-4"
        >
          <ChevronUp size={24} />
        </button>
      )}

      {showAr && <ArExperience onClose={() => setShowAr(false)} />}
      <AIChatAssistant />
      {verifyingResultId && <BlockchainVerification resultId={verifyingResultId} onClose={() => setVerifyingResultId(null)} />}
      <ProviderResultsModal 
        result={selectedResult} 
        onClose={() => setSelectedResult(null)} 
        lang={lang} 
        isLoggedIn={!!currentUser}
        onGuestAttempt={handleGuestAttempt}
        isFavorite={selectedResult ? isResultFavorite(selectedResult) : false} 
        onToggleFavorite={selectedResult ? () => toggleFavorite(selectedResult) : undefined} 
        onShare={selectedResult ? (e) => {
          if (!currentUser) { handleGuestAttempt(); return; }
          setSharingResult(selectedResult);
        } : undefined} 
      />
      <ShareModal result={sharingResult} onClose={() => setSharingResult(null)} />
      
      <LoginModal 
        isOpen={showLogin}
        onClose={() => setShowLogin(false)}
        lang={lang}
        onLogin={(user) => {
          setCurrentUser(user);
          const isNew = user.points === 15;
          setToast({ message: isNew ? `Node Activated: Welcome Bonus +15 Pts` : `Access Granted, Node ${user.nexusId}`, type: 'success' });
        }}
        onCreateId={() => {}}
      />

      <aside className={`fixed inset-0 z-[160] md:static w-72 h-screen border-r border-slate-200 dark:border-white/5 p-6 flex flex-col gap-6 transition-transform duration-300 md:translate-x-0 bg-slate-50 dark:bg-[#050505] ${sidebarOpen ? 'translate-x-0' : '-translate-x-full'}`}>
        <div className="flex items-center justify-between">
           <NexusLogo size="md" onClick={() => setActiveView('dashboard')} className="cursor-pointer" />
           <button onClick={() => setSidebarOpen(false)} className="md:hidden p-2 text-slate-500"><X size={20}/></button>
        </div>
        <nav className="flex-1 space-y-1 overflow-y-auto pr-2 custom-scrollbar">
          <NavItem icon={LayoutDashboard} label={t.nav.dashboard} id="dashboard" />
          <NavItem icon={BarChart3} label={t.nav.stats} id="stats" />
          <NavItem icon={History} label={t.nav.archive} id="archive" />
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
        <div className="space-y-4">
           {!isPremium && (
             <button onClick={() => setActiveView('premium')} className="w-full p-4 rounded-2xl bg-gradient-to-r from-amber-500/20 to-amber-600/20 border border-amber-500/30 text-amber-500 text-xs font-bold flex items-center justify-between group hover:scale-[1.02] transition-all">
                <div className="flex items-center gap-2"><Zap size={14} className="group-hover:animate-pulse" /> {t.common.upgrade}</div>
                <ArrowRight size={14} />
             </button>
           )}
           <LoyaltySystem currentUser={currentUser} onUpdateUser={setCurrentUser} />
        </div>
      </aside>

      <main ref={mainRef} className="flex-1 overflow-y-auto relative flex flex-col bg-slate-50 dark:bg-[#050505] text-slate-900 dark:text-white scroll-smooth pb-24">
        <header className="flex h-20 items-center justify-between px-4 md:px-8 border-b border-slate-200 dark:border-white/5 sticky top-0 z-50 bg-slate-50/80 dark:bg-[#050505]/80 backdrop-blur-md">
          <div className="flex items-center gap-2 md:gap-6">
            <button onClick={() => setSidebarOpen(true)} className="md:hidden p-2 text-slate-500 hover:text-blue-500 transition-colors">
              <Menu size={24} />
            </button>
            <div className="hidden lg:flex items-center gap-3 glass px-4 py-2 rounded-xl border border-white/5">
              <Clock size={16} className="text-blue-500" />
              <span className="text-xs font-orbitron font-bold tabular-nums">
                {currentTime.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', second: '2-digit' })}
              </span>
            </div>
            
            <div className="md:hidden relative">
               <button onClick={() => setShowMobileTools(!showMobileTools)} className="p-2.5 rounded-xl glass border border-white/10 text-slate-500">
                  <Sliders size={20} />
               </button>
               {showMobileTools && (
                 <div className="absolute top-full left-0 mt-2 w-56 glass border border-white/10 rounded-2xl p-4 shadow-2xl animate-in zoom-in slide-in-from-top-2 flex flex-col gap-4 z-50">
                    <VoiceSearch onCommand={handleVoiceCommand} />
                    <div className="flex items-center justify-between">
                       <span className="text-[10px] font-black text-slate-500">THEME</span>
                       <button onClick={() => setTheme(theme === 'dark' ? 'light' : 'dark')} className="p-2 rounded-xl bg-white/5 border border-white/10 text-blue-500">
                         {theme === 'dark' ? <Sun size={16} /> : <Moon size={16} />}
                       </button>
                    </div>
                    <div className="flex flex-col gap-2">
                       <span className="text-[10px] font-black text-slate-500">LANGUAGE</span>
                       <div className="flex gap-2">
                         {(['EN', 'CN', 'MY'] as LangCode[]).map(l => (
                           <button key={l} onClick={() => { setLang(l); setShowMobileTools(false); }} className={`flex-1 py-1 rounded-lg text-[9px] font-black ${lang === l ? 'bg-blue-600 text-white' : 'bg-white/5 text-slate-500'}`}>{l}</button>
                         ))}
                       </div>
                    </div>
                 </div>
               )}
            </div>

            <div className="hidden md:block">
               <VoiceSearch onCommand={handleVoiceCommand} />
            </div>
          </div>

          <div className="flex items-center gap-2 md:gap-4">
            <div className="hidden lg:flex items-center gap-2 mr-2 md:mr-4">
                <div className={`h-2 w-2 rounded-full ${isPremium ? 'bg-amber-500 shadow-[0_0_8px_amber]' : currentUser ? 'bg-blue-500' : 'bg-slate-500'}`}></div>
                <span className="text-[10px] font-black uppercase text-slate-500">
                  {isPremium ? t.common.elite : currentUser ? t.common.verifiedNode : t.common.guestPunter}
                </span>
            </div>
            
            <div className="hidden md:flex items-center gap-2">
              <div className="relative">
                <button onClick={() => setShowLangMenu(!showLangMenu)} className="p-2.5 rounded-xl glass border border-white/10 text-slate-500 hover:text-blue-500 transition-all flex items-center gap-2">
                  <Languages size={18} />
                  <span className="hidden xl:block text-[10px] font-black">{lang}</span>
                </button>
                {showLangMenu && (
                  <div className="absolute top-full right-0 mt-2 w-32 glass border border-white/10 rounded-2xl p-2 shadow-2xl animate-in zoom-in z-50">
                    {(['EN', 'CN', 'MY'] as LangCode[]).map(l => (
                      <button key={l} onClick={() => { setLang(l); setShowLangMenu(false); }} className={`w-full text-left px-4 py-2 rounded-xl text-xs font-bold ${lang === l ? 'bg-blue-600/10 text-blue-500' : 'text-slate-500 hover:bg-white/5'}`}>{l === 'EN' ? 'English' : l === 'CN' ? '中文' : 'Melayu'}</button>
                    ))}
                  </div>
                )}
              </div>
              <button onClick={() => setTheme(theme === 'dark' ? 'light' : 'dark')} className="p-2.5 rounded-xl glass border border-white/10 text-slate-500 hover:text-blue-500 transition-all">
                {theme === 'dark' ? <Sun size={18} /> : <Moon size={18} />}
              </button>
            </div>

            {currentUser ? (
              <div className="relative">
                <button 
                  onClick={() => setShowProfileMenu(!showProfileMenu)}
                  className="flex items-center gap-3 glass p-1 md:p-1.5 rounded-2xl border border-white/10 hover:border-blue-500/50 transition-all"
                >
                  <img src={`https://api.dicebear.com/7.x/avataaars/svg?seed=user${currentUser.avatarId}`} className="w-8 h-8 rounded-xl border border-white/10" alt="Avatar" />
                  <div className="hidden md:block pr-2 text-left">
                    <p className="text-[10px] font-black leading-tight">{currentUser.nexusId}</p>
                    <div className="flex items-center gap-1.5">
                       <Coins size={8} className="text-amber-500" />
                       <p className="text-[8px] font-bold text-slate-500">{currentUser.points} PTS</p>
                    </div>
                  </div>
                  <ChevronDown size={14} className={`text-slate-600 transition-transform ${showProfileMenu ? 'rotate-180' : ''}`} />
                </button>
                {showProfileMenu && (
                  <div className="absolute top-full right-0 mt-3 w-64 glass border border-white/10 rounded-[2rem] p-4 shadow-3xl animate-in zoom-in slide-in-from-top-3 z-50 overflow-hidden">
                    <div className="absolute -top-10 -right-10 w-24 h-24 bg-blue-500/10 blur-2xl rounded-full"></div>
                    <div className="space-y-4 relative z-10">
                       <div className="flex items-center gap-3 p-2">
                          <img src={`https://api.dicebear.com/7.x/avataaars/svg?seed=user${currentUser.avatarId}`} className="w-12 h-12 rounded-2xl border border-white/10 shadow-lg" alt="Avatar" />
                          <div>
                             <p className="text-xs font-black uppercase">{currentUser.nexusId}</p>
                             <p className="text-[8px] text-slate-500 font-bold">NODE: {currentUser.id.substring(0,12)}</p>
                          </div>
                       </div>
                       <div className="grid grid-cols-2 gap-2">
                          <div className="p-3 rounded-2xl bg-white/5 border border-white/5 text-center">
                             <p className="text-[8px] font-black text-slate-500 uppercase">Points</p>
                             <p className="text-sm font-orbitron font-bold text-amber-500">{currentUser.points}</p>
                          </div>
                          <div className="p-3 rounded-2xl bg-white/5 border border-white/5 text-center">
                             <p className="text-[8px] font-black text-slate-500 uppercase">Level</p>
                             <p className="text-sm font-orbitron font-bold text-blue-500">{isPremium ? 'ELITE' : 'CORE'}</p>
                          </div>
                       </div>
                       <div className="space-y-1">
                          <button onClick={() => { setActiveView('challenges'); setShowProfileMenu(false); }} className="w-full flex items-center gap-3 p-3 rounded-xl hover:bg-white/5 text-xs text-slate-300 font-bold transition-all group">
                             <Trophy size={16} className="text-slate-500 group-hover:text-amber-500" /> Rewards & Stats
                          </button>
                          <button onClick={() => { setActiveView('premium'); setShowProfileMenu(false); }} className="w-full flex items-center gap-3 p-3 rounded-xl hover:bg-white/5 text-xs text-slate-300 font-bold transition-all group">
                             <Sliders size={16} className="text-slate-500 group-hover:text-blue-500" /> Account Config
                          </button>
                          <div className="my-2 border-t border-white/5"></div>
                          <button onClick={handleLogout} className="w-full flex items-center gap-3 p-3 rounded-xl hover:bg-red-500/10 text-xs text-red-500 font-bold transition-all">
                             <LogOut size={16} /> Deactivate Session
                          </button>
                       </div>
                    </div>
                  </div>
                )}
              </div>
            ) : (
              <button 
                onClick={() => setShowLogin(true)}
                className="flex items-center gap-2 px-4 py-2.5 rounded-xl bg-blue-600 text-white text-[10px] font-black uppercase tracking-widest hover:bg-blue-500 transition-all shadow-lg active:scale-95"
              >
                <Fingerprint size={16} /> {t.common.activation}
              </button>
            )}
          </div>
        </header>

        <div className="p-4 md:p-8 max-w-7xl mx-auto space-y-8 flex-1 w-full">
          {activeView === 'dashboard' && (
            <>
              <div className="flex flex-col gap-6">
                <div className="flex items-center justify-between">
                  <h2 className="text-xl font-orbitron font-bold flex items-center gap-3">
                    <div className="nexus-line nexus-line-amber"></div> {t.common.jackpotPulse}
                  </h2>
                  <div className="flex items-center gap-2">
                    <span className="w-2 h-2 rounded-full bg-red-500 animate-ping"></span>
                    <span className="text-[9px] font-black uppercase text-slate-500">{t.common.syncActive}</span>
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
                    <div className="flex items-center gap-3 w-full sm:w-auto">
                        <input type="date" value={selectedDate} onChange={(e) => setSelectedDate(e.target.value)} className="bg-transparent text-[10px] font-black uppercase font-orbitron outline-none flex-1" />
                    </div>
                  </div>
                  <div className="grid grid-cols-1 gap-6">
                    {displayResults.results.slice(0, 2).map((res, i) => (
                      <div key={i} className="relative group">
                        <div onClick={() => setSelectedResult(res)} className="cursor-pointer">
                          <ResultCard 
                            result={res} 
                            lang={lang} 
                            isLoggedIn={!!currentUser}
                            onGuestAttempt={handleGuestAttempt}
                            isFavorite={isResultFavorite(res)} 
                            onToggleFavorite={(e) => { e.stopPropagation(); toggleFavorite(res); }} 
                            onShare={(e) => { 
                              e.stopPropagation(); 
                              if (!currentUser) { handleGuestAttempt(); return; }
                              setSharingResult(res); 
                            }} 
                          />
                        </div>
                        <button onClick={() => setVerifyingResultId(res.drawNumber)} className="absolute bottom-6 right-6 p-2 glass rounded-lg border border-slate-200 dark:border-white/10 opacity-0 group-hover:opacity-100 transition-all hover:bg-blue-600/20 text-blue-500 z-10">
                          <ShieldCheck size={14} />
                        </button>
                      </div>
                    ))}
                    
                    {!isPremium && <AdSensePlaceholder variant="IN_FEED" slot="DASHBOARD_FEED_AD" />}

                    {displayResults.results.slice(2).map((res, i) => (
                      <div key={i+2} className="relative group">
                        <div onClick={() => setSelectedResult(res)} className="cursor-pointer">
                          <ResultCard 
                            result={res} 
                            lang={lang} 
                            isLoggedIn={!!currentUser}
                            onGuestAttempt={handleGuestAttempt}
                            isFavorite={isResultFavorite(res)} 
                            onToggleFavorite={(e) => { e.stopPropagation(); toggleFavorite(res); }} 
                            onShare={(e) => { 
                              e.stopPropagation(); 
                              if (!currentUser) { handleGuestAttempt(); return; }
                              setSharingResult(res); 
                            }} 
                          />
                        </div>
                        <button onClick={() => setVerifyingResultId(res.drawNumber)} className="absolute bottom-6 right-6 p-2 glass rounded-lg border border-slate-200 dark:border-white/10 opacity-0 group-hover:opacity-100 transition-all hover:bg-blue-600/20 text-blue-500 z-10">
                          <ShieldCheck size={14} />
                        </button>
                      </div>
                    ))}
                  </div>
                </div>
                <div className="space-y-8">
                  <LuckyNumber lang={lang} heatmapData={heatmapData} />
                  <Predictor isPremium={isPremium} lang={lang} heatmapData={heatmapData} />
                  <DigitHeatmap lang={lang} data={heatmapData} onSync={handleRecalibrateHeatmap} />
                  {!isPremium && <AdSensePlaceholder slot="SIDEBAR_NATIVE" variant="SIDEBAR" />}
                  <GamingTools />
                </div>
              </div>
            </>
          )}

          {activeView === 'premium' && <PremiumView isPremium={isPremium} onUpgrade={() => {
            if (currentUser) {
              setCurrentUser({...currentUser, isPremium: true});
              setToast({ message: "Welcome to Nexus Elite!", type: 'premium' });
              setActiveView('dashboard');
            } else setShowLogin(true);
          }} />}
          
          {activeView === 'admin' && (isAdmin ? <AdminDashboard /> : <div className="max-w-md mx-auto py-20 text-center space-y-8"><div className="w-20 h-20 rounded-3xl bg-red-500/10 flex items-center justify-center mx-auto border border-red-500/20"><Lock size={40} className="text-red-500" /></div><h2 className="text-3xl font-orbitron font-bold">Admin Restricted</h2><ShadowButton onClick={() => setIsAdmin(true)} variant="secondary" className="w-full py-4">Simulate Admin Login</ShadowButton></div>)}
          {activeView === 'community' && <CommunityChat isPremium={isPremium} currentUser={currentUser} onUpdateUser={setCurrentUser} onGuestAttempt={handleGuestAttempt} />}
          {activeView === 'challenges' && <RankingSystem />}
          {activeView === 'predictions' && <div className="grid grid-cols-1 lg:grid-cols-2 gap-8"><Predictor isPremium={isPremium} lang={lang} heatmapData={heatmapData} /><div className="space-y-8"><LuckyNumber lang={lang} heatmapData={heatmapData} /><DigitHeatmap lang={lang} data={heatmapData} onSync={handleRecalibrateHeatmap} /></div></div>}
          {activeView === 'stats' && <div className="space-y-8"><h2 className="text-3xl font-orbitron font-bold">{t.nav.stats}</h2><StatsChart />{!isPremium && <AdSensePlaceholder variant="BANNER" slot="STATS_TOP_BANNER" />}<DigitHeatmap lang={lang} data={heatmapData} onSync={handleRecalibrateHeatmap} /></div>}
          {activeView === 'archive' && <HistoryArchive lang={lang} isLoggedIn={!!currentUser} onGuestAttempt={handleGuestAttempt} />}
          {activeView === 'news' && <NewsSection isLoggedIn={!!currentUser} onGuestAttempt={handleGuestAttempt} />}
          {activeView === 'favorites' && <div className="space-y-8"><h2 className="text-3xl font-orbitron font-bold flex items-center gap-3"><Heart className="text-red-500" fill="currentColor"/> {t.nav.favorites}</h2><div className="grid grid-cols-1 md:grid-cols-2 gap-6">{favorites.map((r,i)=>(<ResultCard key={i} result={r} lang={lang} isLoggedIn={!!currentUser} onGuestAttempt={handleGuestAttempt} isFavorite={true} onToggleFavorite={()=>toggleFavorite(r)} onShare={(e)=>{
            e.stopPropagation();
            if (!currentUser) { handleGuestAttempt(); return; }
            setSharingResult(r);
          }}/>))}</div></div>}
          {['disclaimer', 'privacy', 'about', 'contact', 'sitemap', 'terms'].includes(activeView) && (<div className="glass p-8 rounded-3xl border border-white/5">{activeView === 'disclaimer' && <DisclaimerPage />}{activeView === 'privacy' && <PrivacyPolicy />}{activeView === 'about' && <AboutUs />}{activeView === 'contact' && <ContactUs />}{activeView === 'sitemap' && <Sitemap onNavigate={setActiveView} />}{activeView === 'terms' && <TermsConditions />}</div>)}
          {activeView === 'widgets' && <div className="max-w-3xl mx-auto"><WidgetGenerator /></div>}
        </div>

        <footer className="mt-auto p-12 border-t border-slate-200 dark:border-white/5 bg-slate-100/40 dark:bg-black/40 text-slate-500">
           <div className="max-w-7xl mx-auto flex flex-col md:flex-row justify-between items-start gap-12">
              <div className="space-y-6 max-w-sm">
                <NexusLogo size="sm" className="opacity-50" />
                <p className="text-xs leading-relaxed">4D Nexus Pro intelligence ecosystem. Secured by Nexus Chain proofing.</p>
                <div className="flex gap-4">
                  <div onClick={() => !currentUser ? handleGuestAttempt() : null} className="w-8 h-8 rounded-full bg-white dark:bg-white/5 border border-slate-200 dark:border-white/10 flex items-center justify-center hover:bg-blue-600 hover:text-white transition-all cursor-pointer"><Facebook size={14}/></div>
                  <div onClick={() => !currentUser ? handleGuestAttempt() : null} className="w-8 h-8 rounded-full bg-white dark:bg-white/5 border border-slate-200 dark:border-white/10 flex items-center justify-center hover:bg-blue-400 hover:text-white transition-all cursor-pointer"><Twitter size={14}/></div>
                  <div onClick={() => !currentUser ? handleGuestAttempt() : null} className="w-8 h-8 rounded-full bg-white dark:bg-white/5 border border-slate-200 dark:border-white/10 flex items-center justify-center hover:bg-red-500 hover:text-white transition-all cursor-pointer"><Instagram size={14}/></div>
                </div>
              </div>
              <div className="grid grid-cols-2 gap-12">
                <div className="space-y-4">
                  <h4 className="text-[10px] font-black uppercase text-slate-900 dark:text-white tracking-widest">Platform</h4>
                  <ul className="text-xs space-y-2">
                    <li><button onClick={()=>setActiveView('dashboard')} className="hover:text-blue-600 transition-colors">{t.nav.dashboard}</button></li>
                    <li><button onClick={()=>setActiveView('stats')} className="hover:text-blue-600 transition-colors">{t.nav.stats}</button></li>
                    <li><button onClick={() => setActiveView('premium')} className="hover:text-blue-600 transition-colors">{t.nav.premium}</button></li>
                  </ul>
                </div>
                <div className="space-y-4">
                  <h4 className="text-[10px] font-black uppercase text-slate-900 dark:text-white tracking-widest">Legal</h4>
                  <ul className="text-xs space-y-2">
                    <li><button onClick={()=>setActiveView('disclaimer')} className="hover:text-blue-600 transition-colors">Disclaimer</button></li>
                    <li><button onClick={()=>setActiveView('privacy')} className="hover:text-blue-600 transition-colors">Privacy Policy</button></li>
                  </ul>
                </div>
              </div>
           </div>
        </footer>

        {!isPremium && (
          <div className="fixed bottom-0 left-0 md:left-72 right-0 z-[145] h-20 md:h-24 glass-strong border-t border-white/10 flex items-center justify-center animate-in slide-in-from-bottom-full duration-1000">
             <div className="w-full max-w-4xl px-4 flex items-center gap-4">
                <div className="hidden sm:block shrink-0 p-2 bg-blue-600/10 rounded-lg border border-blue-500/20">
                   <Monitor size={16} className="text-blue-500" />
                </div>
                <div className="flex-1">
                   <AdSensePlaceholder variant="BANNER" slot="GLOBAL_STICKY_BOTTOM" className="!bg-transparent !border-0 h-16 md:h-20" />
                </div>
                <div className="hidden lg:flex shrink-0 w-32 items-center justify-center">
                   <AdSensePlaceholder variant="VIDEO" slot="STICKY_CORNER_VIDEO" className="!bg-transparent !border-0 !h-16" />
                </div>
                <button onClick={() => setToast({ message: 'Elite Membership required to remove ads.', type: 'premium' })} className="p-2 text-slate-500 hover:text-white transition-colors">
                   <X size={16} />
                </button>
             </div>
          </div>
        )}
      </main>
    </div>
  );
};

export default App;
