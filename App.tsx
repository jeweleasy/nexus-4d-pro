
import React, { useState, useEffect, useMemo } from 'react';
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
  Send
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
import { Heatmap } from './components/Heatmap';
import { GamingTools } from './components/GamingTools';
import { LotteryProvider, LotteryResult } from './types';
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
    const browserLang = navigator.language.toLowerCase();
    if (browserLang.includes('zh')) return 'CN';
    if (browserLang.includes('ms') || browserLang.includes('my')) return 'MY';
    return 'EN';
  };

  const todayStr = new Date().toISOString().split('T')[0];

  const [activeView, setActiveView] = useState<View>('dashboard');
  const [lang, setLang] = useState<LangCode>(detectLanguage());
  const [theme, setTheme] = useState<'dark' | 'light'>('dark');
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [showLangMenu, setShowLangMenu] = useState(false);
  const [selectedResult, setSelectedResult] = useState<LotteryResult | null>(null);
  const [sharingResult, setSharingResult] = useState<LotteryResult | null>(null);
  const [verifyingResultId, setVerifyingResultId] = useState<string | null>(null);
  const [showAr, setShowAr] = useState(false);
  const [toast, setToast] = useState<{ message: string; type: 'success' | 'info' } | null>(null);
  
  const [currentTime, setCurrentTime] = useState(new Date());
  const [syncCountdown, setSyncCountdown] = useState(0);
  const [lastSyncTime, setLastSyncTime] = useState(new Date(Date.now() - 25000));
  const [selectedDate, setSelectedDate] = useState(todayStr);
  const [subscriptionEmail, setSubscriptionEmail] = useState('');
  const [isSubscribed, setIsSubscribed] = useState(false);

  const [favorites, setFavorites] = useState<LotteryResult[]>(() => {
    const saved = localStorage.getItem('nexus_pro_favorites');
    return saved ? JSON.parse(saved) : [];
  });

  useEffect(() => {
    document.documentElement.classList.toggle('dark', theme === 'dark');
  }, [theme]);

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
      if (secondsInCurrentInterval === 0) setLastSyncTime(new Date());
    }, 1000);
    return () => clearInterval(timer);
  }, []);

  useEffect(() => { window.scrollTo(0, 0); }, [activeView]);

  const handleSelectProvider = (provider: LotteryProvider) => {
    const latestForProvider = MOCK_RESULTS
      .filter(r => r.provider === provider)
      .sort((a, b) => b.timestamp - a.timestamp)[0];
    
    if (latestForProvider) {
      setSelectedResult(latestForProvider);
    }
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
    if (dateResults.length > 0) return { results: dateResults, isFallback: false, label: 'OFFICIAL RESULTS', date: selectedDate };
    const latestAvailableDate = [...MOCK_RESULTS].sort((a,b) => b.timestamp - a.timestamp)[0]?.drawDate || todayStr;
    return { results: MOCK_RESULTS.filter(r => r.drawDate === latestAvailableDate), isFallback: true, label: 'LATEST RESULTS', date: latestAvailableDate };
  }, [selectedDate]);

  const handleVoiceCommand = (intent: string, provider: string | null) => {
    setToast({ message: `AI Intent: ${intent}`, type: 'info' });
    
    switch (intent) {
      case 'CHECK_RESULT':
        if (provider) {
          const matchedProvider = Object.values(LotteryProvider).find(p => p.toLowerCase().includes(provider.toLowerCase()));
          if (matchedProvider) handleSelectProvider(matchedProvider);
        } else {
          setActiveView('dashboard');
        }
        break;
      case 'GENERATE_LUCKY':
        setActiveView('dashboard');
        setTimeout(() => {
           document.getElementById('lucky-engine-container')?.scrollIntoView({ behavior: 'smooth' });
        }, 500);
        break;
      case 'VIEW_STATS':
        setActiveView('stats');
        break;
      case 'OPEN_COMMUNITY':
        setActiveView('community');
        break;
      case 'OPEN_AR':
        setShowAr(true);
        break;
      default:
        setToast({ message: "I'm sorry, I couldn't understand that command.", type: 'info' });
    }
  };

  const handleSubscribe = (e: React.FormEvent) => {
    e.preventDefault();
    if (!subscriptionEmail) return;
    setIsSubscribed(true);
    setToast({ message: "Subscription Link Sent", type: 'success' });
    setSubscriptionEmail('');
  };

  const NavItem = ({ icon: Icon, label, id }: { icon: any, label: string, id: View }) => (
    <button
      onClick={() => { setActiveView(id); setSidebarOpen(false); }}
      className={`flex items-center gap-3 px-4 py-3 rounded-xl transition-all w-full text-left ${
        activeView === id 
          ? 'bg-blue-600/10 text-blue-500 dark:text-blue-400 border border-blue-500/20 shadow-sm' 
          : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white hover:bg-slate-100 dark:hover:bg-white/5'
      }`}
    >
      <Icon size={18} />
      <span className="font-medium text-sm">{label}</span>
      {activeView === id && <div className="ml-auto w-1.5 h-1.5 rounded-full bg-blue-500"></div>}
    </button>
  );

  return (
    <div className="min-h-screen flex flex-col md:flex-row bg-transparent">
      {toast && (
        <div className="fixed bottom-8 left-1/2 -translate-x-1/2 z-[200] px-6 py-3 rounded-2xl glass border border-white/10 flex items-center gap-3 shadow-2xl animate-in slide-in-from-bottom-4 duration-300">
          <div className={`w-2 h-2 rounded-full ${toast.type === 'success' ? 'bg-green-500' : 'bg-blue-500'}`}></div>
          <span className="text-xs font-bold font-orbitron tracking-wider">{toast.message}</span>
        </div>
      )}

      {showAr && <ArExperience onClose={() => setShowAr(false)} />}

      <AIChatAssistant />

      {verifyingResultId && (
        <BlockchainVerification 
          resultId={verifyingResultId} 
          onClose={() => setVerifyingResultId(null)} 
        />
      )}

      <ProviderResultsModal 
        result={selectedResult} 
        onClose={() => setSelectedResult(null)} 
        lang={lang}
        isFavorite={selectedResult ? isResultFavorite(selectedResult) : false}
        onToggleFavorite={selectedResult ? () => toggleFavorite(selectedResult) : undefined}
        onShare={selectedResult ? () => setSharingResult(selectedResult) : undefined}
      />

      <ShareModal result={sharingResult} onClose={() => setSharingResult(null)} />

      <aside className={`
        fixed inset-0 z-[100] md:static w-72 h-screen border-r border-slate-200 dark:border-white/5 p-6 flex flex-col gap-6
        transition-transform duration-300 md:translate-x-0 bg-slate-50 dark:bg-[#050505]
        ${sidebarOpen ? 'translate-x-0' : '-translate-x-full'}
      `}>
        <NexusLogo size="md" onClick={() => setActiveView('dashboard')} className="cursor-pointer" />
        
        <nav className="flex-1 space-y-1 overflow-y-auto pr-2">
          <NavItem icon={LayoutDashboard} label="Dashboard" id="dashboard" />
          <NavItem icon={BarChart3} label="Deep Analytics" id="stats" />
          <NavItem icon={History} label="Historical Archive" id="archive" />
          <NavItem icon={Heart} label="My Library" id="favorites" />
          <NavItem icon={MessageCircle} label="Live Community" id="community" />
          <NavItem icon={Trophy} label="Rankings" id="challenges" />
          <NavItem icon={Cpu} label="AI Predictions" id="predictions" />
          <NavItem icon={Newspaper} label="Industry News" id="news" />
          <NavItem icon={Code} label="Web Widgets" id="widgets" />
          <div className="my-4 border-t border-slate-200 dark:border-white/5"></div>
          <NavItem icon={CreditCard} label="Nexus Elite" id="premium" />
          <NavItem icon={ShieldCheck} label="Admin Ops" id="admin" />
        </nav>

        {/* Connect Email Subscription Widget */}
        <div className="glass p-4 rounded-2xl border border-blue-500/10 bg-blue-500/[0.02] space-y-3">
          <div className="flex items-center gap-2">
             <Mail size={14} className="text-blue-500" />
             <span className="text-[10px] font-black uppercase tracking-widest text-slate-500">Live Alerts</span>
          </div>
          {isSubscribed ? (
            <div className="text-[9px] text-green-500 font-bold flex items-center gap-2 animate-in zoom-in">
              <CheckCircle2 size={12} /> Sync Enabled
            </div>
          ) : (
            <form onSubmit={handleSubscribe} className="flex flex-col gap-2">
              <input 
                type="email" 
                placeholder="connect@nexuspro.ai" 
                value={subscriptionEmail}
                onChange={(e) => setSubscriptionEmail(e.target.value)}
                className="bg-white/50 dark:bg-white/5 border border-slate-200 dark:border-white/10 rounded-xl px-3 py-2 text-[10px] focus:outline-none focus:border-blue-500/50 text-slate-900 dark:text-white"
              />
              <button className="w-full py-2 bg-blue-600 rounded-xl text-white text-[9px] font-black uppercase tracking-widest flex items-center justify-center gap-2 hover:bg-blue-500 transition-all">
                Connect <Send size={10} />
              </button>
            </form>
          )}
        </div>

        <LoyaltySystem />
      </aside>

      <main className="flex-1 overflow-y-auto relative flex flex-col bg-slate-50 dark:bg-[#050505] text-slate-900 dark:text-white">
        <header className="flex h-20 items-center justify-between px-8 border-b border-slate-200 dark:border-white/5 sticky top-0 z-50 bg-slate-50/80 dark:bg-[#050505]/80 backdrop-blur-md">
          <div className="flex items-center gap-6">
            <button onClick={() => setSidebarOpen(true)} className="md:hidden p-2 text-slate-500">
              <Menu size={24} />
            </button>
            <div className="hidden lg:flex items-center gap-3 glass px-4 py-2 rounded-xl">
              <Clock size={16} className="text-blue-500 dark:text-blue-400" />
              <span className="text-xs font-orbitron font-bold tabular-nums">
                {currentTime.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', second: '2-digit' })}
              </span>
            </div>
            <VoiceSearch onCommand={handleVoiceCommand} />
            <button 
              onClick={() => setShowAr(true)}
              className="p-2.5 rounded-xl glass border border-blue-200 dark:border-blue-500/20 text-blue-600 dark:text-blue-400 hover:bg-blue-600/10 transition-all flex items-center gap-2 text-[10px] font-black uppercase"
            >
              <Camera size={18} /> AR Scan
            </button>
          </div>

          <div className="flex items-center gap-4">
             <button 
              onClick={() => setTheme(theme === 'dark' ? 'light' : 'dark')}
              className="p-2.5 rounded-xl glass border border-slate-200 dark:border-white/10 text-slate-500 dark:text-slate-400 hover:text-blue-500 dark:hover:text-blue-400 transition-all"
            >
              {theme === 'dark' ? <Sun size={18} /> : <Moon size={18} />}
            </button>
            <ShadowButton variant="primary" onClick={() => setActiveView('premium')} className="hidden sm:flex text-[10px] py-1.5 px-6">
              GO ELITE
            </ShadowButton>
            <div className="h-8 w-[1px] bg-slate-200 dark:bg-white/10 mx-2"></div>
            <img src="https://picsum.photos/seed/admin/40/40" alt="P" className="w-8 h-8 rounded-full border border-slate-200 dark:border-white/10" />
          </div>
        </header>

        {/* Responsible Gaming Banner */}
        <div className="bg-amber-500/10 border-b border-amber-500/20 px-8 py-2 flex items-center justify-center gap-3">
          <ShieldAlert size={14} className="text-amber-600 dark:text-amber-500" />
          <p className="text-[10px] font-bold text-amber-600 dark:text-amber-500 uppercase tracking-widest">
            Responsible Gaming: Stay in control. Play for fun. 18+ only.
          </p>
        </div>

        <div className="p-4 md:p-8 max-w-7xl mx-auto space-y-8 flex-1 w-full">
          {activeView === 'dashboard' && (
            <>
              <div className="flex flex-col gap-6">
                <div className="flex items-center justify-between">
                  <h2 className="text-xl font-orbitron font-bold flex items-center gap-3 text-slate-900 dark:text-white">
                    <div className="nexus-line nexus-line-amber"></div>
                    Live Jackpot Hub
                  </h2>
                  <div className="flex items-center gap-2">
                    <span className="w-2 h-2 rounded-full bg-red-500 animate-ping"></span>
                    <span className="text-[9px] font-black uppercase text-slate-500">Live Pools</span>
                  </div>
                </div>
                <JackpotTracker />
              </div>

              <LogoTicker onSelectProvider={(p) => handleSelectProvider(p)} />
              
              <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                <div className="lg:col-span-2 space-y-6">
                  <div className="flex justify-between items-center bg-white/50 dark:bg-white/5 p-4 rounded-[1.5rem] border border-slate-200 dark:border-white/5 shadow-sm">
                    <div className="flex items-center gap-3">
                      <Zap size={20} className="text-blue-500" />
                      <div>
                        <h2 className="text-sm font-orbitron font-bold text-slate-900 dark:text-white">{displayResults.label}</h2>
                        <p className="text-[9px] text-slate-500 font-bold uppercase">{displayResults.date}</p>
                      </div>
                    </div>
                    <div className="flex items-center gap-3">
                        <button className="hidden sm:flex items-center gap-2 text-[9px] font-black uppercase tracking-widest text-slate-500 hover:text-blue-500 dark:hover:text-blue-400">
                            <ShieldEllipsis size={14} /> Chain Proof Mode
                        </button>
                        <input 
                          type="date" 
                          value={selectedDate}
                          onChange={(e) => setSelectedDate(e.target.value)}
                          className="bg-transparent text-[10px] font-black uppercase font-orbitron outline-none cursor-pointer [color-scheme:light] dark:[color-scheme:dark] text-slate-900 dark:text-white"
                        />
                    </div>
                  </div>

                  <div className="grid grid-cols-1 gap-6">
                    {displayResults.results.map((res, i) => (
                      <div key={i} className="relative group">
                        <div onClick={() => setSelectedResult(res)} className="cursor-pointer">
                          <ResultCard 
                            result={res} 
                            lang={lang} 
                            isFavorite={isResultFavorite(res)}
                            onToggleFavorite={(e) => { e.stopPropagation(); toggleFavorite(res); }}
                            onShare={(e) => { e.stopPropagation(); setSharingResult(res); }}
                          />
                        </div>
                        <button 
                          onClick={() => setVerifyingResultId(res.drawNumber)}
                          className="absolute bottom-6 right-6 p-2 glass rounded-lg border border-slate-200 dark:border-white/10 opacity-0 group-hover:opacity-100 transition-all hover:bg-blue-600/20 text-blue-500 dark:text-blue-400 z-10 shadow-sm"
                          title="Verify on Blockchain"
                        >
                          <ShieldCheck size={14} />
                        </button>
                      </div>
                    ))}
                  </div>
                </div>

                <div className="space-y-8">
                  <div id="lucky-engine-container">
                    <LuckyNumber />
                  </div>
                  <Heatmap />
                  <GamingTools />
                  <Predictor />
                </div>
              </div>
            </>
          )}

          {activeView === 'challenges' && (
            <div className="max-w-4xl mx-auto space-y-8">
               <div className="text-center space-y-4">
                  <Trophy size={48} className="text-amber-500 mx-auto" />
                  <h2 className="text-4xl font-orbitron font-bold text-slate-900 dark:text-white">Nexus Leaderboard</h2>
                  <p className="text-slate-500 dark:text-slate-400">Join daily guessing challenges and earn your place among the elite strategists.</p>
               </div>
               <div className="glass rounded-[2.5rem] border border-slate-200 dark:border-white/10 overflow-hidden shadow-sm">
                  <table className="w-full text-left">
                     <thead>
                        <tr className="bg-slate-50 dark:bg-white/5 text-[10px] font-black uppercase tracking-widest text-slate-500 border-b border-slate-200 dark:border-white/5">
                           <th className="p-6">Rank</th>
                           <th className="p-6">Strategist</th>
                           <th className="p-6">Accuracy</th>
                           <th className="p-6">Nexus Points</th>
                           <th className="p-6 text-right">Badge</th>
                        </tr>
                     </thead>
                     <tbody className="divide-y divide-slate-100 dark:divide-white/5 text-slate-800 dark:text-slate-200">
                        {[
                          { rank: 1, user: 'Lucky_Strike', accuracy: '94.2%', points: 15400, badge: 'Oracle' },
                          { rank: 2, user: 'TotoMaster', accuracy: '89.5%', points: 12100, badge: 'Predictor' },
                          { rank: 3, user: 'Nexus_Phantom', accuracy: '88.1%', points: 11050, badge: 'Elite' },
                          { rank: 4, user: 'You', accuracy: '12.4%', points: 450, badge: 'Novice' },
                        ].map((u, i) => (
                          <tr key={i} className={`hover:bg-slate-50 dark:hover:bg-white/[0.02] transition-colors ${u.user === 'You' ? 'bg-blue-600/5' : ''}`}>
                             <td className="p-6 font-orbitron font-bold">{u.rank}</td>
                             <td className="p-6 font-bold flex items-center gap-2">
                                <img src={`https://picsum.photos/seed/${u.user}/32/32`} className="w-8 h-8 rounded-full border border-slate-200 dark:border-white/10" />
                                {u.user}
                             </td>
                             <td className="p-6 text-green-600 dark:text-green-400 font-mono">{u.accuracy}</td>
                             <td className="p-6 font-orbitron font-bold">{u.points.toLocaleString()}</td>
                             <td className="p-6 text-right">
                                <span className="text-[9px] font-black uppercase px-3 py-1 bg-slate-100 dark:bg-white/5 rounded-full border border-slate-200 dark:border-white/10 text-slate-500 dark:text-slate-400">{u.badge}</span>
                             </td>
                          </tr>
                        ))}
                     </tbody>
                  </table>
               </div>
            </div>
          )}

          {activeView === 'premium' && <PremiumView />}
          {activeView === 'community' && <div className="max-w-3xl mx-auto space-y-8"><h2 className="text-3xl font-orbitron font-bold">Community Pulse</h2><CommunityChat /></div>}
          {activeView === 'widgets' && <div className="max-w-2xl mx-auto space-y-8 text-center"><h2 className="text-4xl font-orbitron font-bold">Nexus Everywhere</h2><WidgetGenerator /></div>}
          {activeView === 'stats' && <div className="space-y-8 animate-in fade-in duration-500"><h2 className="text-3xl font-orbitron font-bold">Market Matrix</h2><StatsChart /><Heatmap /><Predictor /></div>}
          {activeView === 'archive' && <div className="p-8 glass rounded-3xl"><h2 className="text-3xl font-orbitron font-bold mb-8">Draw Archive</h2><table className="w-full text-left"><thead><tr className="text-xs text-slate-500 border-b border-slate-200 dark:border-white/5"><th className="pb-4">Operator</th><th className="pb-4">Draw ID</th><th className="pb-4">1st Prize</th><th className="pb-4 text-right">View</th></tr></thead><tbody className="text-slate-800 dark:text-slate-200">{MOCK_RESULTS.map((r,i)=>(<tr key={i} className="border-b border-slate-100 dark:border-white/5 hover:bg-slate-50 dark:hover:bg-white/5"><td className="py-4 text-sm font-bold">{r.provider}</td><td className="py-4 text-xs font-mono">{r.drawNumber}</td><td className="py-4 font-orbitron font-bold text-amber-600 dark:text-amber-500">{r.first}</td><td className="py-4 text-right"><button onClick={()=>setSelectedResult(r)} className="p-2 bg-slate-100 dark:bg-white/5 rounded-lg hover:text-blue-500"><ExternalLink size={14}/></button></td></tr>))}</tbody></table></div>}
          {activeView === 'news' && <NewsSection />}
          {activeView === 'admin' && <AdminDashboard />}
          {activeView === 'manual' && <UserManual />}
          {activeView === 'favorites' && (
            <div className="space-y-8">
              <h2 className="text-3xl font-orbitron font-bold flex items-center gap-3"><Heart className="text-red-500" fill="currentColor"/> My Favorites</h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">{favorites.map((r,i)=>(<ResultCard key={i} result={r} lang={lang} isFavorite={true} onToggleFavorite={()=>toggleFavorite(r)} onShare={()=>setSharingResult(r)}/>))}</div>
            </div>
          )}
          {['disclaimer', 'privacy', 'about', 'contact', 'sitemap', 'terms'].includes(activeView) && (
            <div className="bg-slate-100 dark:bg-white/5 p-8 rounded-3xl border border-slate-200 dark:border-white/5 text-slate-800 dark:text-slate-200">
              {activeView === 'disclaimer' && <DisclaimerPage />}
              {activeView === 'privacy' && <PrivacyPolicy />}
              {activeView === 'about' && <AboutUs />}
              {activeView === 'contact' && <ContactUs />}
              {activeView === 'sitemap' && <Sitemap onNavigate={setActiveView} />}
              {activeView === 'terms' && <TermsConditions />}
            </div>
          )}
        </div>

        <footer className="mt-auto p-12 border-t border-slate-200 dark:border-white/5 bg-slate-100/40 dark:bg-black/40 text-slate-500">
           <div className="max-w-7xl mx-auto flex flex-col md:flex-row justify-between items-start gap-12">
              <div className="space-y-6 max-w-sm">
                <NexusLogo size="sm" className="opacity-50" />
                <p className="text-xs leading-relaxed">4D Nexus Pro is a data intelligence ecosystem. We operate under strict transparency via Nexus Chain proofing.</p>
                <div className="flex gap-4">
                  <div className="w-8 h-8 rounded-full bg-white dark:bg-white/5 border border-slate-200 dark:border-white/10 flex items-center justify-center hover:bg-blue-600 hover:text-white transition-all cursor-pointer shadow-sm"><Facebook size={14}/></div>
                  <div className="w-8 h-8 rounded-full bg-white dark:bg-white/5 border border-slate-200 dark:border-white/10 flex items-center justify-center hover:bg-blue-400 hover:text-white transition-all cursor-pointer shadow-sm"><Twitter size={14}/></div>
                  <div className="w-8 h-8 rounded-full bg-white dark:bg-white/5 border border-slate-200 dark:border-white/10 flex items-center justify-center hover:bg-red-500 hover:text-white transition-all cursor-pointer shadow-sm"><Instagram size={14}/></div>
                </div>
              </div>
              
              <div className="grid grid-cols-2 sm:grid-cols-3 gap-12">
                <div className="space-y-4">
                  <h4 className="text-[10px] font-black uppercase text-slate-900 dark:text-white tracking-widest">Platform</h4>
                  <ul className="text-xs space-y-2">
                    <li><button onClick={()=>setActiveView('dashboard')} className="hover:text-blue-600 dark:hover:text-blue-400">Dashboard</button></li>
                    <li><button onClick={()=>setActiveView('stats')} className="hover:text-blue-600 dark:hover:text-blue-400">Analytics</button></li>
                    <li><button onClick={() => setActiveView('premium')} className="hover:text-blue-600 dark:hover:text-blue-400">Nexus Elite</button></li>
                  </ul>
                </div>
                <div className="space-y-4">
                  <h4 className="text-[10px] font-black uppercase text-slate-900 dark:text-white tracking-widest">Legal</h4>
                  <ul className="text-xs space-y-2">
                    <li><button onClick={()=>setActiveView('disclaimer')} className="hover:text-blue-600 dark:hover:text-blue-400">Disclaimer</button></li>
                    <li><button onClick={()=>setActiveView('privacy')} className="hover:text-blue-600 dark:hover:text-blue-400">Privacy Policy</button></li>
                    <li><button onClick={()=>setActiveView('contact')} className="hover:text-blue-600 dark:hover:text-blue-400">Contact Support</button></li>
                  </ul>
                </div>
              </div>
           </div>
           <div className="max-w-7xl mx-auto mt-12 pt-8 border-t border-slate-200 dark:border-white/5 flex flex-col sm:flex-row justify-between items-center gap-4">
              <p className="text-[9px] font-bold uppercase tracking-widest text-slate-500">© 2024 NEXUS GLOBAL DATA ECOSYSTEM. ALL RIGHTS RESERVED.</p>
              <div className="flex items-center gap-4">
                <span className="text-[9px] font-bold uppercase tracking-widest text-green-600 dark:text-green-500 flex items-center gap-1">
                   <div className="w-1.5 h-1.5 rounded-full bg-green-500 animate-pulse"></div> Node Stable
                </span>
                <span className="text-[9px] font-bold uppercase tracking-widest text-blue-600 dark:text-blue-500 flex items-center gap-1">
                   <ShieldCheck size={10} /> Blockchain Active
                </span>
              </div>
           </div>
        </footer>
      </main>
    </div>
  );
};

export default App;
