
import React, { useState, useEffect } from 'react';
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
  ChevronDown
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
import { LotteryProvider, LotteryResult } from './types';
import { 
  DisclaimerPage, 
  PrivacyPolicy, 
  AboutUs, 
  ContactUs, 
  Sitemap, 
  TermsConditions 
} from './components/LegalPages';

type View = 'dashboard' | 'stats' | 'archive' | 'predictions' | 'news' | 'premium' | 'manual' | 'admin' | 'disclaimer' | 'privacy' | 'about' | 'contact' | 'sitemap' | 'terms';
type LangCode = 'EN' | 'CN' | 'MY';

const App: React.FC = () => {
  const detectLanguage = (): LangCode => {
    const browserLang = navigator.language.toLowerCase();
    if (browserLang.includes('zh')) return 'CN';
    if (browserLang.includes('ms') || browserLang.includes('my')) return 'MY';
    return 'EN';
  };

  const [activeView, setActiveView] = useState<View>('dashboard');
  const [lang, setLang] = useState<LangCode>(detectLanguage());
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [countdown, setCountdown] = useState(240);
  const [showLangMenu, setShowLangMenu] = useState(false);
  const [selectedResult, setSelectedResult] = useState<LotteryResult | null>(null);

  useEffect(() => {
    const timer = setInterval(() => {
      setCountdown(prev => (prev > 0 ? prev - 1 : 300));
    }, 1000);
    return () => clearInterval(timer);
  }, []);

  useEffect(() => {
    window.scrollTo(0, 0);
  }, [activeView]);

  const formatTime = (sec: number) => {
    const mins = Math.floor(sec / 60);
    const secs = sec % 60;
    return `${mins}:${secs < 10 ? '0' : ''}${secs}`;
  };

  const handleSelectProvider = (providerId: LotteryProvider) => {
    const result = MOCK_RESULTS.find(r => r.provider === providerId);
    if (result) {
      setSelectedResult(result);
    } else {
      // Fallback for providers that don't have mock data yet
      const fallback = MOCK_RESULTS[0];
      setSelectedResult({ ...fallback, provider: providerId });
    }
  };

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
      {/* Result Drill-down Modal */}
      <ProviderResultsModal 
        result={selectedResult} 
        onClose={() => setSelectedResult(null)} 
        lang={lang} 
      />

      {/* Mobile Header */}
      <div className="md:hidden flex items-center justify-between p-4 border-b border-white/5 sticky top-0 z-50 bg-[#050505]/80 backdrop-blur-md">
        <NexusLogo size="sm" onClick={() => setActiveView('dashboard')} className="cursor-pointer" />
        <div className="flex items-center gap-2">
          <LanguageSwitcher isMobile />
          <button onClick={() => setSidebarOpen(!sidebarOpen)} className="p-2 text-slate-400">
            {sidebarOpen ? <X size={24} /> : <Menu size={24} />}
          </button>
        </div>
      </div>

      {/* Sidebar Navigation */}
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
          <NavItem icon={Cpu} label={LANGUAGES[lang].predictions} id="predictions" />
          <NavItem icon={Newspaper} label={LANGUAGES[lang].news} id="news" />
          <NavItem icon={BookOpen} label="User Manual" id="manual" />
          <div className="my-6 border-t border-white/5"></div>
          <NavItem icon={ShieldCheck} label="Admin Portal" id="admin" />
          <NavItem icon={CreditCard} label="Nexus Premium" id="premium" />
        </nav>

        <div className="mt-auto space-y-4">
          <div className="bg-gradient-to-br from-blue-600/20 to-purple-600/20 p-4 rounded-2xl border border-white/5">
            <div className="flex justify-between items-center mb-2">
              <span className="text-[10px] text-slate-400 uppercase font-bold tracking-widest">Next Update</span>
              <Timer size={14} className="text-blue-400" />
            </div>
            <div className="text-2xl font-orbitron font-bold text-white tabular-nums">{formatTime(countdown)}</div>
          </div>
        </div>
      </aside>

      {/* Main Content Area */}
      <main className="flex-1 overflow-y-auto relative">
        <header className="hidden md:flex h-20 items-center justify-between px-8 border-b border-white/5 sticky top-0 z-30 bg-[#050505]/80 backdrop-blur-md">
          <div className="flex items-center gap-6">
            <div className="relative group w-96">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-500 group-focus-within:text-blue-400 transition-colors" size={18} />
              <input 
                type="text" 
                placeholder="Search numbers, dates, or draw IDs..." 
                className="bg-white/5 border border-white/10 rounded-xl py-2 pl-10 pr-4 w-full focus:outline-none focus:border-blue-500/50 transition-all text-sm"
              />
            </div>
            <div className="flex items-center gap-2 text-slate-400 text-sm">
              <CloudSun size={18} />
              <span>Kuala Lumpur, 28°C</span>
            </div>
          </div>

          <div className="flex items-center gap-4">
            <LanguageSwitcher />
            <button className="relative p-2 text-slate-400 hover:text-white transition-colors">
              <Bell size={20} />
              <span className="absolute top-1.5 right-1.5 w-2 h-2 bg-blue-500 rounded-full border-2 border-[#050505]"></span>
            </button>
            <div className="h-8 w-[1px] bg-white/5"></div>
            <div className="flex items-center gap-3 pl-2">
              <div className="text-right">
                <p className="text-sm font-semibold">Admin User</p>
                <p className="text-[10px] text-red-400 uppercase font-bold tracking-tighter">System Administrator</p>
              </div>
              <img src="https://picsum.photos/seed/admin/40/40" alt="Profile" className="w-10 h-10 rounded-full border border-red-500/20 ring-2 ring-red-500/10" />
            </div>
          </div>
        </header>

        <div className="p-4 md:p-8 max-w-7xl mx-auto space-y-8">
          {activeView === 'dashboard' && (
            <>
              {/* Promotional Banner */}
              <div className="relative h-48 md:h-64 rounded-3xl overflow-hidden group">
                <img 
                  src="https://picsum.photos/seed/cyberpunk/1200/400" 
                  alt="4D Nexus Intelligence Banner" 
                  className="w-full h-full object-cover brightness-50 group-hover:scale-105 transition-transform duration-700"
                />
                <div className="absolute inset-0 bg-gradient-to-r from-black via-black/40 to-transparent p-8 md:p-12 flex flex-col justify-center">
                  <span className="text-blue-400 text-sm font-bold uppercase tracking-widest mb-2">Special Draw Alert</span>
                  <h1 className="text-3xl md:text-5xl font-orbitron font-bold mb-4 leading-tight">THE NEXUS<br/>JACKPOT PULSE</h1>
                  <p className="text-slate-300 max-w-lg text-sm md:text-base hidden md:block">Real-time aggregation engine synchronizing with 10+ global sources every 300 seconds.</p>
                  <div className="mt-6 flex gap-4">
                    <ShadowButton variant="gold" onClick={() => setActiveView('stats')}>Check Live Jackpot</ShadowButton>
                    <button className="text-white font-semibold flex items-center gap-2 hover:gap-3 transition-all" onClick={() => setActiveView('about')}>
                      Learn More <ChevronRight size={18} />
                    </button>
                  </div>
                </div>
              </div>

              {/* Logo Ticker Section */}
              <LogoTicker onSelectProvider={handleSelectProvider} />

              {/* Data Quality Indicators */}
              <div className="flex flex-wrap gap-4 items-center justify-between">
                <div className="flex gap-4">
                  <div className="flex items-center gap-2 text-xs">
                    <span className="w-2 h-2 bg-green-500 rounded-full"></span>
                    <span className="text-slate-400">Sources Synced: 14/14</span>
                  </div>
                  <div className="flex items-center gap-2 text-xs">
                    <span className="w-2 h-2 bg-blue-500 rounded-full animate-pulse"></span>
                    <span className="text-slate-400">Aggregator Engine: Active</span>
                  </div>
                </div>
              </div>

              <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                <div className="lg:col-span-2 space-y-6">
                  <div className="flex items-center justify-between">
                    <h2 className="text-2xl font-orbitron font-bold flex items-center gap-3">
                      <div className="nexus-line"></div>
                      Latest Results
                    </h2>
                  </div>
                  <div className="grid grid-cols-1 gap-6">
                    {MOCK_RESULTS.map((res, i) => (
                      <div key={i} onClick={() => setSelectedResult(res)} className="cursor-pointer">
                        <ResultCard result={res} lang={lang} />
                      </div>
                    ))}
                  </div>
                </div>

                <div className="space-y-8">
                  <LuckyNumber />
                  <Predictor />
                  <div className="glass rounded-2xl p-6 border border-white/5">
                    <h3 className="text-lg font-orbitron font-bold mb-4 flex items-center gap-3">
                      <div className="nexus-line nexus-line-amber"></div>
                      Hot Frequency
                    </h3>
                    <div className="space-y-4">
                      {HOT_NUMBERS.slice(0, 3).map((n, i) => (
                        <div key={i} className="flex items-center justify-between p-3 rounded-xl bg-white/5 border border-white/5">
                          <span className="text-xl font-orbitron font-bold text-white tracking-widest">{n.number}</span>
                          <div className="text-right">
                            <span className="text-sm font-bold text-amber-500">{n.frequency}x</span>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              </div>
            </>
          )}

          {activeView === 'stats' && (
            <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-700">
               <h2 className="text-3xl font-orbitron font-bold flex items-center gap-3">
                 <div className="nexus-line"></div>
                 Deep Data Analytics
               </h2>
               <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                  <div className="glass rounded-2xl p-8 border border-white/5">
                    <h3 className="text-xl font-bold mb-2 text-white">Number Frequency Distribution</h3>
                    <StatsChart />
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

          {activeView === 'archive' && (
            <div className="space-y-6">
              <h2 className="text-3xl font-orbitron font-bold flex items-center gap-3">
                <div className="nexus-line"></div>
                Historical Archive
              </h2>
              <div className="glass rounded-2xl overflow-hidden border border-white/10">
                <table className="w-full text-left border-collapse">
                  <thead>
                    <tr className="bg-white/5 text-slate-400 text-xs uppercase tracking-widest font-bold">
                      <th className="p-6">Date</th>
                      <th className="p-6">Provider</th>
                      <th className="p-6">1st Prize</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-white/5">
                    {MOCK_RESULTS.map((row, i) => (
                      <tr key={i} className="hover:bg-white/[0.02] transition-colors cursor-pointer" onClick={() => setSelectedResult(row)}>
                        <td className="p-6 text-sm text-slate-300 font-orbitron">{row.drawDate}</td>
                        <td className="p-6 text-sm font-semibold text-blue-400">{row.provider}</td>
                        <td className="p-6 font-orbitron font-bold text-amber-500">{row.first}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}
        </div>

        {/* Footer */}
        <footer className="mt-20 p-8 md:p-12 border-t border-white/5 bg-black/40 text-slate-500">
           <div className="max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-4 gap-12 mb-12">
              <div className="space-y-6">
                <NexusLogo size="sm" />
                <p className="text-xs leading-relaxed max-w-xs">
                  The world's premier 4D lottery data aggregation platform. Powered by the Nexus Engine for real-time synchronization and pattern analysis.
                </p>
                <div className="flex flex-wrap gap-3 pt-4">
                  <a href="#" className="w-10 h-10 rounded-full bg-white/5 flex items-center justify-center hover:bg-blue-600/20 hover:text-blue-400 transition-all"><Facebook size={18} /></a>
                  <a href="#" className="w-10 h-10 rounded-full bg-white/5 flex items-center justify-center hover:bg-blue-400/20 hover:text-blue-400 transition-all"><Twitter size={18} /></a>
                  <a href="#" className="w-10 h-10 rounded-full bg-white/5 flex items-center justify-center hover:bg-blue-500/20 hover:text-blue-400 transition-all"><Send size={18} /></a>
                  <a href="#" className="w-10 h-10 rounded-full bg-white/5 flex items-center justify-center hover:bg-green-600/20 hover:text-green-400 transition-all"><MessageCircle size={18} /></a>
                  <a href="#" className="w-10 h-10 rounded-full bg-white/5 flex items-center justify-center hover:bg-pink-600/20 hover:text-pink-400 transition-all"><Instagram size={18} /></a>
                </div>
              </div>

              <div className="space-y-4">
                <h4 className="text-xs font-bold uppercase tracking-widest text-slate-200">Quick Navigation</h4>
                <ul className="space-y-2 text-xs">
                  <li><button onClick={() => setActiveView('dashboard')} className="hover:text-blue-400 transition-colors">Live 4D Dashboard</button></li>
                  <li><button onClick={() => setActiveView('stats')} className="hover:text-blue-400 transition-colors">Number Analytics</button></li>
                  <li><button onClick={() => setActiveView('predictions')} className="hover:text-blue-400 transition-colors">AI Predictions</button></li>
                  <li><button onClick={() => setActiveView('news')} className="hover:text-blue-400 transition-colors">Industry Reports</button></li>
                  <li><button onClick={() => setActiveView('sitemap')} className="hover:text-blue-400 transition-colors flex items-center gap-2"><Map size={12} /> Full Sitemap</button></li>
                </ul>
              </div>

              <div className="space-y-4">
                <h4 className="text-xs font-bold uppercase tracking-widest text-slate-200">Legal Intelligence</h4>
                <ul className="space-y-2 text-xs">
                  <li><button onClick={() => setActiveView('disclaimer')} className="hover:text-blue-400 transition-colors flex items-center gap-2"><AlertTriangle size={12} /> Legal Disclaimer</button></li>
                  <li><button onClick={() => setActiveView('privacy')} className="hover:text-blue-400 transition-colors">Privacy & Data Security</button></li>
                  <li><button onClick={() => setActiveView('terms')} className="hover:text-blue-400 transition-colors">Terms of Service</button></li>
                  <li><button onClick={() => setActiveView('about')} className="hover:text-blue-400 transition-colors">Our Mission</button></li>
                  <li><button onClick={() => setActiveView('contact')} className="hover:text-blue-400 transition-colors">Contact Intelligence</button></li>
                </ul>
              </div>

              <div className="space-y-4">
                <div className="p-6 rounded-2xl border border-white/5 bg-white/5 space-y-3">
                  <h4 className="text-xs font-bold uppercase tracking-widest text-amber-500">Responsible Gaming</h4>
                  <p className="text-[10px] leading-relaxed">
                    Lottery data analysis is for informational purposes only. Play responsibly. Adults 18+ only.
                  </p>
                  <ShadowButton variant="secondary" className="w-full text-[10px] py-1" onClick={() => setActiveView('contact')}>
                    Get Help
                  </ShadowButton>
                </div>
              </div>
           </div>
           
           <div className="max-w-7xl mx-auto pt-8 border-t border-white/5 flex flex-col md:flex-row justify-between items-center gap-4 text-[10px] font-medium uppercase tracking-[0.2em]">
              <p>© 2024 4D NEXUS PRO INTELLIGENCE. ALL RIGHTS RESERVED.</p>
              <div className="flex gap-8">
                <span>Optimized for Search Engines</span>
                <span className="text-green-500">SSL ENCRYPTED</span>
              </div>
           </div>
        </footer>
      </main>
    </div>
  );
};

export default App;
