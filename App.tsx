
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
  Fingerprint
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

const App: React.FC = () => {
  const detectLanguage = (): LangCode => {
    const saved = localStorage.getItem('nexus_pro_lang') as LangCode;
    if (saved && (saved === 'EN' || saved === 'CN' || saved === 'MY')) return saved;
    
    const browserLang = navigator.language.toLowerCase();
    if (browserLang.includes('zh')) return 'CN';
    if (browserLang.includes('ms') || browserLang.includes('my')) return 'MY';
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
  const [toast, setToast] = useState<{ message: string; type: 'success' | 'info' | 'premium' } | null>(null);
  const [showScrollTop, setShowScrollTop] = useState(false);
  const [showLangMenu, setShowLangMenu] = useState(false);
  const [showLogin, setShowLogin] = useState(false);
  
  const mainRef = useRef<HTMLDivElement>(null);
  const [isPremium, setIsPremium] = useState(false);
  const [isAdmin, setIsAdmin] = useState(false);
  const [currentUser, setCurrentUser] = useState<User | null>(() => {
    const saved = localStorage.getItem('nexus_user');
    return saved ? JSON.parse(saved) : null;
  });
  
  const [currentTime, setCurrentTime] = useState(new Date());
  const [selectedDate, setSelectedDate] = useState(todayStr);

  const [favorites, setFavorites] = useState<LotteryResult[]>(() => {
    const saved = localStorage.getItem('nexus_pro_favorites');
    return saved ? JSON.parse(saved) : [];
  });

  const t = LANGUAGES[lang];

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
      if (mainRef.current) {
        setShowScrollTop(mainRef.current.scrollTop > 400);
      }
    };
    const mainEl = mainRef.current;
    mainEl?.addEventListener('scroll', handleScroll);
    return () => mainEl?.removeEventListener('scroll', handleScroll);
  }, []);

  useEffect(() => { mainRef.current?.scrollTo(0, 0); }, [activeView]);

  const handleSelectProvider = (provider: LotteryProvider) => {
    const latestForProvider = MOCK_RESULTS
      .filter(r => r.provider === provider)
      .sort((a, b) => b.timestamp - a.timestamp)[0];
    if (latestForProvider) setSelectedResult(latestForProvider);
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
  }, [selectedDate, lang]);

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

  const scrollToTop = () => {
    mainRef.current?.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleUpdateUser = (updatedUser: User) => {
    setCurrentUser(updatedUser);
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
          toast.type === 'premium' ? 'border-amber-500/30 bg-amber-500/10 text-amber-500' : 'border-white/10'
        }`}>
          <div className={`w-2 h-2 rounded-full ${toast.type === 'success' ? 'bg-green-500' : toast.type === 'premium' ? 'bg-amber-500' : 'bg-blue-500'}`}></div>
          <span className="text-xs font-bold font-orbitron tracking-wider">{toast.message}</span>
        </div>
      )}

      {showScrollTop && (
        <button 
          onClick={scrollToTop}
          className="fixed bottom-8 right-8 z-[140] w-12 h-12 glass border border-white/10 rounded-2xl flex items-center justify-center text-blue-500 shadow-2xl hover:scale-110 active:scale-95 transition-all animate-in slide-in-from-bottom-4"
        >
          <ChevronUp size={24} />
        </button>
      )}

      {showAr && <ArExperience onClose={() => setShowAr(false)} />}
      <AIChatAssistant />
      {verifyingResultId && <BlockchainVerification resultId={verifyingResultId} onClose={() => setVerifyingResultId(null)} />}
      <ProviderResultsModal result={selectedResult} onClose={() => setSelectedResult(null)} lang={lang} isFavorite={selectedResult ? isResultFavorite(selectedResult) : false} onToggleFavorite={selectedResult ? () => toggleFavorite(selectedResult) : undefined} onShare={selectedResult ? () => setSharingResult(selectedResult) : undefined} />
      <ShareModal result={sharingResult} onClose={() => setSharingResult(null)} />
      
      <LoginModal 
        isOpen={showLogin}
        onClose={() => setShowLogin(false)}
        lang={lang}
        onLogin={(user) => {
          setCurrentUser(user);
          const isNew = user.points === 15;
          setToast({ 
            message: isNew ? `Node ${user.nexusId} Activated! Welcome Bonus: +15 Pts` : `Access Granted. Welcome back, Node ${user.nexusId}`, 
            type: 'success' 
          });
        }}
        onCreateId={() => {
          setToast({ message: "Redirecting to Activation Channel", type: 'info' });
        }}
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
                <div className="flex items-center gap-2">
                   <Zap size={14} className="group-hover:animate-pulse" />
                   {t.common.upgrade}
                </div>
                <ArrowRight size={14} />
             </button>
           )}
           <LoyaltySystem currentUser={currentUser} onUpdateUser={handleUpdateUser} />
        </div>
      </aside>

      <main ref={mainRef} className="flex-1 overflow-y-auto relative flex flex-col bg-slate-50 dark:bg-[#050505] text-slate-900 dark:text-white scroll-smooth">
        <header className="flex h-20 items-center justify-between px-4 md:px-8 border-b border-slate-200 dark:border-white/5 sticky top-0 z-50 bg-slate-50/80 dark:bg-[#050505]/80 backdrop-blur-md">
          <div className="flex items-center gap-4 md:gap-6">
            <button onClick={() => setSidebarOpen(true)} className="md:hidden p-2 text-slate-500 hover:text-blue-500 transition-colors">
              <Menu size={24} />
            </button>
            <div className="hidden lg:flex items-center gap-3 glass px-4 py-2 rounded-xl border border-white/5">
              <Clock size={16} className="text-blue-500" />
              <span className="text-xs font-orbitron font-bold tabular-nums">
                {currentTime.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', second: '2-digit' })}
              </span>
            </div>
            <div className="flex-shrink-0">
               <VoiceSearch onCommand={handleVoiceCommand} />
            </div>
          </div>

          <div className="flex items-center gap-2 md:gap-4">
            <div className="hidden sm:flex items-center gap-2 mr-2 md:mr-4">
                <div className={`h-2 w-2 rounded-full ${isPremium ? 'bg-amber-500 animate-pulse shadow-[0_0_8px_amber]' : currentUser ? 'bg-blue-500 shadow-[0_0_8px_rgba(59,130,246,0.5)]' : 'bg-slate-500'}`}></div>
                <span className="text-[10px] font-black uppercase text-slate-500">
                  {isPremium ? t.common.elite : currentUser ? t.common.verifiedNode : t.common.guestPunter}
                </span>
            </div>
            
            <div className="relative">
              <button 
                onClick={() => setShowLangMenu(!showLangMenu)}
                className="p-2.5 rounded-xl glass border border-slate-200 dark:border-white/10 text-slate-500 dark:text-slate-400 hover:text-blue-500 transition-all flex items-center gap-2"
              >
                <Languages size={18} />
                <span className="hidden xs:block text-[10px] font-black">{lang}</span>
              </button>
              {showLangMenu && (
                <div className="absolute top-full right-0 mt-2 w-32 glass border border-white/10 rounded-2xl p-2 shadow-2xl animate-in fade-in slide-in-from-top-2">
                   {(['EN', 'CN', 'MY'] as LangCode[]).map(l => (
                     <button
                       key={l}
                       onClick={() => { setLang(l); setShowLangMenu(false); }}
                       className={`w-full text-left px-4 py-2 rounded-xl text-xs font-bold transition-all ${lang === l ? 'bg-blue-600/10 text-blue-500' : 'text-slate-500 hover:bg-white/5 hover:text-slate-300'}`}
                     >
                       {l === 'EN' ? 'English' : l === 'CN' ? '中文' : 'Melayu'}
                     </button>
                   ))}
                </div>
              )}
            </div>

            <button onClick={() => setTheme(theme === 'dark' ? 'light' : 'dark')} className="p-2.5 rounded-xl glass border border-slate-200 dark:border-white/10 text-slate-500 dark:text-slate-400 hover:text-blue-500 transition-all">
              {theme === 'dark' ? <Sun size={18} /> : <Moon size={18} />}
            </button>

            {currentUser ? (
              <div className="flex items-center gap-3 glass p-1 md:p-1.5 rounded-2xl border border-white/5">
                <img src={`https://api.dicebear.com/7.x/avataaars/svg?seed=user${currentUser.avatarId}`} className="w-8 h-8 rounded-xl border border-white/10" alt="Avatar" />
                <div className="hidden md:block pr-2">
                  <p className="text-[10px] font-black text-slate-900 dark:text-white leading-tight">{currentUser.nexusId}</p>
                  <p className="text-[8px] font-bold text-slate-500">ID: {currentUser.id.substring(0, 8)}</p>
                </div>
              </div>
            ) : (
              <div className="flex items-center gap-2">
                <button 
                  onClick={() => setShowLogin(true)}
                  className="flex items-center gap-2 px-4 py-2.5 rounded-xl bg-blue-600 text-white text-[10px] font-black uppercase tracking-widest hover:bg-blue-500 transition-all shadow-lg shadow-blue-500/20 active:scale-95"
                >
                  <Fingerprint size={16} />
                  {t.common.activation}
                </button>
              </div>
            )}
          </div>
        </header>

        <div className="p-4 md:p-8 max-w-7xl mx-auto space-y-8 flex-1 w-full">
          {activeView === 'dashboard' && (
            <>
              <div className="flex flex-col gap-6">
                <div className="flex items-center justify-between">
                  <h2 className="text-xl font-orbitron font-bold flex items-center gap-3">
                    <div className="nexus-line nexus-line-amber"></div>
                    {t.common.jackpotPulse}
                  </h2>
                  <div className="flex items-center gap-2">
                    <span className="w-2 h-2 rounded-full bg-red-500 animate-ping"></span>
                    <span className="text-[9px] font-black uppercase text-slate-500">{t.common.syncActive}</span>
                  </div>
                </div>
                <JackpotTracker />
              </div>
              <LogoTicker onSelectProvider={(p) => handleSelectProvider(p)} />
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
                        <input type="date" value={selectedDate} onChange={(e) => setSelectedDate(e.target.value)} className="bg-transparent text-[10px] font-black uppercase font-orbitron outline-none cursor-pointer [color-scheme:light] dark:[color-scheme:dark] flex-1" />
                    </div>
                  </div>
                  <div className="grid grid-cols-1 gap-6">
                    {displayResults.results.map((res, i) => (
                      <div key={i} className="relative group">
                        <div onClick={() => setSelectedResult(res)} className="cursor-pointer">
                          <ResultCard result={res} lang={lang} isFavorite={isResultFavorite(res)} onToggleFavorite={(e) => { e.stopPropagation(); toggleFavorite(res); }} onShare={(e) => { e.stopPropagation(); setSharingResult(res); }} />
                        </div>
                        <button onClick={() => setVerifyingResultId(res.drawNumber)} className="absolute bottom-6 right-6 p-2 glass rounded-lg border border-slate-200 dark:border-white/10 opacity-0 group-hover:opacity-100 transition-all hover:bg-blue-600/20 text-blue-500 z-10" title="Verify Nexus Chain Hash">
                          <ShieldCheck size={14} />
                        </button>
                      </div>
                    ))}
                  </div>
                </div>
                <div className="space-y-8">
                  <LuckyNumber lang={lang} />
                  <Predictor isPremium={isPremium} lang={lang} />
                  <DigitHeatmap lang={lang} />
                  {!isPremium && <AdSensePlaceholder slot="SIDEBAR_NATIVE" />}
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
            } else {
              setShowLogin(true);
            }
          }} />}
          
          {activeView === 'admin' && (
             isAdmin ? <AdminDashboard /> : (
               <div className="max-w-md mx-auto py-20 space-y-8 text-center">
                  <div className="w-20 h-20 rounded-3xl bg-red-500/10 flex items-center justify-center mx-auto border border-red-500/20">
                     <Lock size={40} className="text-red-500" />
                  </div>
                  <h2 className="text-3xl font-orbitron font-bold">Admin Restricted</h2>
                  <p className="text-slate-500 text-sm">You must have specialized node permissions to access backend operations.</p>
                  <ShadowButton onClick={() => setIsAdmin(true)} variant="secondary" className="w-full py-4">
                     Simulate Admin Login
                  </ShadowButton>
               </div>
             )
          )}
          
          {activeView === 'community' && <CommunityChat isPremium={isPremium} currentUser={currentUser} onUpdateUser={handleUpdateUser} />}
          {activeView === 'challenges' && <RankingSystem />}
          {activeView === 'predictions' && (
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
               <Predictor isPremium={isPremium} lang={lang} />
               <div className="space-y-8">
                 <LuckyNumber lang={lang} />
                 <DigitHeatmap lang={lang} />
               </div>
            </div>
          )}
          {activeView === 'stats' && <div className="space-y-8"><h2 className="text-3xl font-orbitron font-bold">{t.nav.stats}</h2><StatsChart /><DigitHeatmap lang={lang} /></div>}
          {activeView === 'news' && <NewsSection />}
          {activeView === 'favorites' && (
            <div className="space-y-8">
              <h2 className="text-3xl font-orbitron font-bold flex items-center gap-3"><Heart className="text-red-500" fill="currentColor"/> {t.nav.favorites}</h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">{favorites.map((r,i)=>(<ResultCard key={i} result={r} lang={lang} isFavorite={true} onToggleFavorite={()=>toggleFavorite(r)} onShare={()=>setSharingResult(r)}/>))}</div>
            </div>
          )}
          {['disclaimer', 'privacy', 'about', 'contact', 'sitemap', 'terms'].includes(activeView) && (
            <div className="glass p-8 rounded-3xl border border-white/5">
              {activeView === 'disclaimer' && <DisclaimerPage />}
              {activeView === 'privacy' && <PrivacyPolicy />}
              {activeView === 'about' && <AboutUs />}
              {activeView === 'contact' && <ContactUs />}
              {activeView === 'sitemap' && <Sitemap onNavigate={setActiveView} />}
              {activeView === 'terms' && <TermsConditions />}
            </div>
          )}
          {activeView === 'widgets' && <div className="max-w-3xl mx-auto"><WidgetGenerator /></div>}
        </div>

        <footer className="mt-auto p-12 border-t border-slate-200 dark:border-white/5 bg-slate-100/40 dark:bg-black/40 text-slate-500">
           <div className="max-w-7xl mx-auto flex flex-col md:flex-row justify-between items-start gap-12">
              <div className="space-y-6 max-w-sm">
                <NexusLogo size="sm" className="opacity-50" />
                <p className="text-xs leading-relaxed">4D Nexus Pro is a data intelligence ecosystem. We operate under strict transparency via Nexus Chain proofing.</p>
                <div className="flex gap-4">
                  <div className="w-8 h-8 rounded-full bg-white dark:bg-white/5 border border-slate-200 dark:border-white/10 flex items-center justify-center hover:bg-blue-600 hover:text-white transition-all cursor-pointer"><Facebook size={14}/></div>
                  <div className="w-8 h-8 rounded-full bg-white dark:bg-white/5 border border-slate-200 dark:border-white/10 flex items-center justify-center hover:bg-blue-400 hover:text-white transition-all cursor-pointer"><Twitter size={14}/></div>
                  <div className="w-8 h-8 rounded-full bg-white dark:bg-white/5 border border-slate-200 dark:border-white/10 flex items-center justify-center hover:bg-red-500 hover:text-white transition-all cursor-pointer"><Instagram size={14}/></div>
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
                    <li><button onClick={()=>setActiveView('contact')} className="hover:text-blue-600 transition-colors">Contact Support</button></li>
                  </ul>
                </div>
              </div>
           </div>
        </footer>
      </main>
    </div>
  );
};

export default App;
