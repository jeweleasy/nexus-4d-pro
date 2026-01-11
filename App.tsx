
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
  ArrowUp,
  Youtube,
  Github,
  Video,
  Mic
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
import { LoginModal } from './components/LoginModal';
import { HistoryArchive } from './components/HistoryArchive';
import { PersonalWatchlist } from './components/PersonalWatchlist';
import { SellerArchive } from './components/SellerArchive';
import { LiveConsultant } from './components/LiveConsultant';
import { DrawSimulator } from './components/DrawSimulator';
import { LotteryProvider, LotteryResult, User, EliteRequest } from './types';
import { supabase } from './services/supabase';
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
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [selectedResult, setSelectedResult] = useState<LotteryResult | null>(null);
  const [sharingResult, setSharingResult] = useState<LotteryResult | null>(null);
  const [toast, setToast] = useState<{ message: string; type: 'success' | 'info' | 'premium' | 'error' } | null>(null);
  const [showLogin, setShowLogin] = useState(false);
  const [showProfileMenu, setShowProfileMenu] = useState(false);
  const [pendingEliteRequests, setPendingEliteRequests] = useState<EliteRequest[]>([]);
  const [activeProviderFilter, setActiveProviderFilter] = useState<LotteryProvider | 'All'>('All');
  
  const [showLiveConsultant, setShowLiveConsultant] = useState(false);
  const [showDrawSimulator, setShowDrawSimulator] = useState(false);
  const [showArMode, setShowArMode] = useState(false);

  const mainRef = useRef<HTMLDivElement>(null);
  const [currentUser, setCurrentUser] = useState<User | null>(null);
  const [selectedDate, setSelectedDate] = useState(todayStr);
  const [favorites, setFavorites] = useState<LotteryResult[]>([]);

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

  const fetchUserData = async (userId: string) => {
    try {
      const { data: savedData } = await supabase
        .from('saved_results')
        .select('*')
        .eq('user_id', userId);

      if (savedData) {
        const mappedResults: LotteryResult[] = savedData.map(d => ({
          provider: d.provider as LotteryProvider,
          type: '4D',
          drawDate: d.draw_date,
          drawNumber: d.draw_number,
          first: d.first_prize,
          status: 'Final',
          timestamp: new Date(d.created_at).getTime()
        }));
        setFavorites(mappedResults);
      }

      const { data: profile } = await supabase
        .from('profiles')
        .select('*')
        .eq('id', userId)
        .single();
      
      if (profile) {
        setCurrentUser(prev => prev ? ({
          ...prev,
          points: profile.points,
          isPremium: profile.is_premium,
          nexusId: profile.nexus_id || prev.nexusId
        }) : null);
      }
    } catch (err) {
      console.error("Neural sync interrupted:", err);
    }
  };

  useEffect(() => {
    const checkSession = async () => {
      const { data: { session } } = await supabase.auth.getSession();
      if (session) {
        const { user } = session;
        setCurrentUser({
          id: user.id,
          nexusId: user.user_metadata.nexus_id || 'EliteNode',
          email: user.email!,
          points: 15,
          isPremium: false,
          registrationDate: user.created_at,
          avatarId: user.user_metadata.avatar_id || 1
        });
        await fetchUserData(user.id);
      }
      setIsHandshaking(false);
    };

    checkSession();

    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
      if (session) {
        const { user } = session;
        setCurrentUser({
          id: user.id,
          nexusId: user.user_metadata.nexus_id || 'EliteNode',
          email: user.email!,
          points: 15,
          isPremium: false,
          registrationDate: user.created_at,
          avatarId: user.user_metadata.avatar_id || 1
        });
        fetchUserData(user.id);
      } else {
        setCurrentUser(null);
        setFavorites([]);
      }
    });

    return () => subscription.unsubscribe();
  }, []);

  const handleLogout = async () => {
    await supabase.auth.signOut();
    setCurrentUser(null);
    setToast({ message: "Node Securely Disconnected", type: 'info' });
    setShowProfileMenu(false);
  };

  const navigateTo = (view: View) => {
    setActiveView(view);
    if(mainRef.current) mainRef.current.scrollTop = 0;
    setSidebarOpen(false);
  };

  const handleGuestAttempt = () => {
    setToast({ message: t.common.guestRestriction, type: 'error' });
  };

  const toggleFavorite = async (result: LotteryResult) => {
    if (!currentUser) {
      handleGuestAttempt();
      return;
    }

    const exists = favorites.find(f => f.provider === result.provider && f.drawDate === result.drawDate);
    
    try {
      if (exists) {
        await supabase
          .from('saved_results')
          .delete()
          .eq('user_id', currentUser.id)
          .eq('provider', result.provider)
          .eq('draw_date', result.drawDate);
          
        setFavorites(prev => prev.filter(f => !(f.provider === result.provider && f.drawDate === result.drawDate)));
        setToast({ message: `${result.provider} removed from cloud`, type: 'info' });
      } else {
        await supabase
          .from('saved_results')
          .insert({
            user_id: currentUser.id,
            provider: result.provider,
            draw_date: result.drawDate,
            draw_number: result.drawNumber,
            first_prize: result.first
          });

        setFavorites(prev => [...prev, result]);
        setToast({ message: `${result.provider} synced to library`, type: 'success' });
      }
    } catch (err) {
      setToast({ message: "Link to Nexus Database failed", type: 'error' });
    }
  };

  const isResultFavorite = (result: LotteryResult) => 
    favorites.some(f => f.provider === result.provider && f.drawDate === result.drawDate);

  const displayResults = useMemo(() => {
    const providerResults = activeProviderFilter === 'All' 
      ? MOCK_RESULTS 
      : MOCK_RESULTS.filter(res => res.provider === activeProviderFilter);

    const dateResults = providerResults.filter(res => res.drawDate === selectedDate);
    if (dateResults.length > 0) return { results: dateResults, label: t.common.officialResults, date: selectedDate };
    
    const latestAvailableDate = [...providerResults].sort((a,b) => b.timestamp - a.timestamp)[0]?.drawDate || todayStr;
    return { results: providerResults.filter(r => r.drawDate === latestAvailableDate), label: t.common.latestResults, date: latestAvailableDate };
  }, [selectedDate, t, activeProviderFilter]);

  if (isHandshaking) {
    return (
      <div className="fixed inset-0 bg-[#050505] flex flex-col items-center justify-center space-y-6 z-[300]">
         <div className="relative">
            <div className="absolute inset-0 bg-blue-500 blur-[80px] opacity-20 animate-pulse"></div>
            <NexusLogo size="lg" className="relative z-10 animate-pulse" />
         </div>
         <div className="flex flex-col items-center space-y-2">
            <Loader2 className="text-blue-500 animate-spin" size={24} />
            <p className="text-[10px] font-black uppercase tracking-[0.4em] text-slate-500">Preparing Deployment Node...</p>
         </div>
      </div>
    );
  }

  const NavItem = ({ icon: Icon, label, id, badge }: { icon: any, label: string, id: View, badge?: string }) => (
    <button
      onClick={() => navigateTo(id)}
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

      <aside className={`fixed inset-y-0 left-0 z-[160] md:static w-72 h-full border-r border-slate-200 dark:border-white/5 p-6 flex flex-col gap-6 transition-transform duration-300 md:translate-x-0 bg-slate-50 dark:bg-[#050505] shadow-2xl md:shadow-none ${sidebarOpen ? 'translate-x-0' : '-translate-x-full'}`}>
        <div className="flex items-center justify-between">
           <NexusLogo size="md" onClick={() => navigateTo('dashboard')} className="cursor-pointer" />
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
          <NavItem icon={Cpu} label={t.nav.predictions} id="predictions" badge={currentUser?.isPremium ? "PRO" : "LITE"} />
          <NavItem icon={Newspaper} label={t.nav.news} id="news" />
          <NavItem icon={Code} label={t.nav.widgets} id="widgets" />
          
          <div className="my-4 border-t border-slate-200 dark:border-white/5 pt-4">
             <p className="text-[10px] font-black uppercase text-slate-500 tracking-widest px-4 mb-2">Neural Ops</p>
             <button onClick={() => setShowLiveConsultant(true)} className="flex items-center gap-3 px-4 py-3 rounded-xl transition-all w-full text-left group hover:bg-blue-600/10 text-slate-400 hover:text-blue-400">
                <Mic size={18} />
                <span className="font-semibold text-sm">AI Live Strategist</span>
             </button>
             <button onClick={() => setShowDrawSimulator(true)} className="flex items-center gap-3 px-4 py-3 rounded-xl transition-all w-full text-left group hover:bg-purple-600/10 text-slate-400 hover:text-purple-400">
                <Video size={18} />
                <span className="font-semibold text-sm">Draw Simulator</span>
             </button>
          </div>

          <div className="my-4 border-t border-slate-200 dark:border-white/5"></div>
          <NavItem icon={CreditCard} label={t.nav.premium} id="premium" />
          <NavItem icon={ShieldCheck} label={t.nav.admin} id="admin" />
        </nav>
        <LoyaltySystem currentUser={currentUser} onUpdateUser={setCurrentUser} />
      </aside>

      <main ref={mainRef} className="flex-1 overflow-y-auto relative flex flex-col bg-slate-50 dark:bg-[#050505] text-slate-900 dark:text-white pb-0">
        <header className="flex h-20 items-center justify-between px-4 md:px-8 border-b border-slate-200 dark:border-white/5 sticky top-0 z-50 bg-slate-50/80 dark:bg-[#050505]/80 backdrop-blur-md">
          <div className="flex items-center gap-2 md:gap-6">
            <button onClick={() => setSidebarOpen(true)} className="md:hidden p-3 text-slate-500 hover:text-blue-500 transition-colors active:scale-95">
              <Menu size={26} />
            </button>
            <VoiceSearch onCommand={(i, p) => {
               if (i === 'CHECK_RESULT' && p) setActiveProviderFilter(p as any);
               if (i === 'VIEW_STATS') navigateTo('stats');
               if (i === 'GENERATE_LUCKY') navigateTo('dashboard');
               if (i === 'OPEN_COMMUNITY') navigateTo('community');
               if (i === 'OPEN_AR') setShowArMode(true);
               setToast({ message: `AI Intent: ${i}`, type: 'info' });
            }} />
          </div>

          <div className="flex items-center gap-2 md:gap-4">
             <button onClick={() => setShowArMode(true)} className="p-3 rounded-xl bg-white/5 border border-white/10 text-slate-500 hover:text-blue-500 transition-all hover:scale-110 active:scale-95">
                <Camera size={20} />
             </button>
            {currentUser ? (
              <div className="relative">
                <button onClick={() => setShowProfileMenu(!showProfileMenu)} className="flex items-center gap-2 sm:gap-3 glass p-1.5 rounded-2xl border border-white/10 hover:border-blue-500/50 transition-all active:scale-95">
                  <img src={`https://api.dicebear.com/7.x/avataaars/svg?seed=${currentUser.id}`} className="w-8 h-8 rounded-xl border border-white/10" alt="Avatar" />
                  <div className="hidden sm:block pr-2 text-left">
                    <p className="text-[10px] font-black leading-tight">{currentUser.nexusId}</p>
                    <p className="text-[8px] font-bold text-slate-500 uppercase tracking-tighter">Node Synchronized</p>
                  </div>
                </button>
                {showProfileMenu && (
                  <div className="absolute top-full right-0 mt-2 w-48 glass border border-white/10 rounded-2xl p-2 shadow-2xl z-50 animate-in zoom-in duration-200">
                    <button onClick={handleLogout} className="w-full text-left px-4 py-2 rounded-xl text-xs font-bold text-red-400 hover:bg-red-500/10 flex items-center gap-2 transition-colors">
                      <LogOut size={14} /> Disconnect Hub
                    </button>
                  </div>
                )}
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
              <JackpotTracker />
              <LogoTicker onSelectProvider={setActiveProviderFilter as any} />
              <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                <div className="lg:col-span-2 space-y-6">
                  {displayResults.results.map((res, i) => (
                    <div key={i} onClick={() => setSelectedResult(res)} className="cursor-pointer transition-transform hover:scale-[1.01]">
                      <ResultCard 
                        result={res} lang={lang} isLoggedIn={!!currentUser} 
                        onGuestAttempt={handleGuestAttempt} 
                        isFavorite={isResultFavorite(res)}
                        onToggleFavorite={(e) => { e.stopPropagation(); toggleFavorite(res); }}
                        onShare={(e) => { e.stopPropagation(); setSharingResult(res); }}
                      />
                    </div>
                  ))}
                </div>
                <div className="space-y-8">
                  <PersonalWatchlist isLoggedIn={!!currentUser} onGuestAttempt={handleGuestAttempt} onMatch={(res, num) => {
                     setToast({ message: `Signature Match: ${num} found in ${res.provider}!`, type: 'success' });
                  }} />
                  <LuckyNumber lang={lang} heatmapData={heatmapData} />
                  <Predictor isPremium={currentUser?.isPremium} lang={lang} heatmapData={heatmapData} />
                </div>
              </div>
            </>
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
               <GamingTools />
            </div>
          )}
          {activeView === 'archive' && (
            <HistoryArchive 
              lang={lang} 
              isLoggedIn={!!currentUser} 
              onGuestAttempt={handleGuestAttempt} 
              onMatch={() => {}}
              onToggleFavorite={toggleFavorite}
              onShare={setSharingResult}
              isFavorite={isResultFavorite}
            />
          )}
          {activeView === 'favorites' && (
             <div className="space-y-8">
                <h2 className="text-3xl font-orbitron font-bold flex items-center gap-3"><Heart className="text-red-500" /> Cloud Saved Nodes</h2>
                {favorites.length > 0 ? (
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    {favorites.map((res, i) => (
                       <ResultCard 
                        key={i} result={res} lang={lang} isLoggedIn={true} 
                        isFavorite={true} onToggleFavorite={() => toggleFavorite(res)}
                        onShare={(e) => { e.stopPropagation(); setSharingResult(res); }} 
                       />
                    ))}
                  </div>
                ) : (
                  <div className="glass rounded-[3rem] py-32 text-center border-2 border-dashed border-white/5 opacity-50">
                    <History size={48} className="mx-auto text-slate-500 mb-4" />
                    <p className="font-orbitron font-bold uppercase tracking-widest">Cloud Library Empty</p>
                    <ShadowButton variant="primary" onClick={() => navigateTo('dashboard')} className="mt-6">Sync New Results</ShadowButton>
                  </div>
                )}
             </div>
          )}
          {activeView === 'sellers' && <SellerArchive isAdmin={currentUser?.isPremium || false} onNavigateToContact={() => navigateTo('contact')} />}
          {activeView === 'news' && <NewsSection isLoggedIn={!!currentUser} onGuestAttempt={handleGuestAttempt} />}
          {activeView === 'community' && <CommunityChat isPremium={currentUser?.isPremium} currentUser={currentUser} onUpdateUser={setCurrentUser} onGuestAttempt={handleGuestAttempt} />}
          {activeView === 'challenges' && <RankingSystem />}
          {activeView === 'predictions' && (
             <div className="max-w-4xl mx-auto py-8">
                <h2 className="text-3xl font-orbitron font-bold mb-8 flex items-center gap-3"><Cpu className="text-purple-500" /> Full Neural Prediction Stack</h2>
                <Predictor isPremium={currentUser?.isPremium} lang={lang} heatmapData={heatmapData} />
             </div>
          )}
          {activeView === 'widgets' && <div className="max-w-xl mx-auto py-12"><WidgetGenerator /></div>}
          {activeView === 'premium' && <PremiumView isPremium={currentUser?.isPremium || false} currentUser={currentUser} pendingRequests={pendingEliteRequests} onRequestUpgrade={navigateTo as any} />}
          {activeView === 'about' && <AboutUs />}
          {activeView === 'contact' && <ContactUs />}
          {activeView === 'privacy' && <PrivacyPolicy />}
          {activeView === 'terms' && <TermsConditions />}
          {activeView === 'disclaimer' && <DisclaimerPage />}
          {activeView === 'sitemap' && <Sitemap onNavigate={navigateTo} />}
          {activeView === 'admin' && <AdminDashboard eliteRequests={pendingEliteRequests} onApproveElite={() => {}} />}
        </div>
      </main>

      <LoginModal 
        isOpen={showLogin} onClose={() => setShowLogin(false)} lang={lang} 
        onLogin={(u) => { setCurrentUser(u); setShowLogin(false); fetchUserData(u.id); }} onCreateId={() => {}} 
      />
      <AIChatAssistant />
      
      {showLiveConsultant && <LiveConsultant onClose={() => setShowLiveConsultant(false)} />}
      {showDrawSimulator && <DrawSimulator onClose={() => setShowDrawSimulator(false)} />}
      {showArMode && <ArExperience onClose={() => setShowArMode(false)} />}

      {selectedResult && (
        <ProviderResultsModal 
          result={selectedResult} 
          onClose={() => setSelectedResult(null)} 
          lang={lang} 
          isLoggedIn={!!currentUser}
          isFavorite={isResultFavorite(selectedResult)}
          onToggleFavorite={() => toggleFavorite(selectedResult)}
          onShare={() => setSharingResult(selectedResult)}
        />
      )}
      
      {sharingResult && (
        <ShareModal result={sharingResult} onClose={() => setSharingResult(null)} />
      )}
    </div>
  );
};

export default App;
