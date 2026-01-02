
import React, { useState, useEffect } from 'react';
import { 
  LayoutDashboard, 
  BarChart3, 
  History, 
  Cpu, 
  Bell, 
  Settings, 
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
  RefreshCw,
  Database,
  Users,
  Newspaper
} from 'lucide-react';
import { MOCK_RESULTS, LANGUAGES, HOT_NUMBERS } from './constants';
import { ResultCard } from './components/ResultCard';
import { StatsChart } from './components/StatsChart';
import { Predictor } from './components/Predictor';
import { ShadowButton } from './components/ShadowButton';
import { UserManual } from './components/UserManual';
import { AdminDashboard } from './components/AdminDashboard';
import { NewsSection } from './components/NewsSection';

type View = 'dashboard' | 'stats' | 'archive' | 'predictions' | 'news' | 'premium' | 'manual' | 'admin';

const App: React.FC = () => {
  const [activeView, setActiveView] = useState<View>('dashboard');
  const [lang, setLang] = useState<'EN' | 'CN' | 'MY'>('EN');
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [countdown, setCountdown] = useState(240); // 4 minutes until next draw update

  useEffect(() => {
    const timer = setInterval(() => {
      setCountdown(prev => (prev > 0 ? prev - 1 : 300));
    }, 1000);
    return () => clearInterval(timer);
  }, []);

  const formatTime = (sec: number) => {
    const mins = Math.floor(sec / 60);
    const secs = sec % 60;
    return `${mins}:${secs < 10 ? '0' : ''}${secs}`;
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

  return (
    <div className="min-h-screen flex flex-col md:flex-row bg-[#050505] text-white">
      {/* Mobile Header */}
      <div className="md:hidden flex items-center justify-between p-4 border-b border-white/5 sticky top-0 z-50 bg-[#050505]/80 backdrop-blur-md">
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 bg-blue-600 rounded-lg flex items-center justify-center font-orbitron font-bold">N</div>
          <span className="font-orbitron font-bold text-lg tracking-tight">4DNEXUS<span className="text-blue-500">PRO</span></span>
        </div>
        <button onClick={() => setSidebarOpen(!sidebarOpen)} className="p-2 text-slate-400">
          {sidebarOpen ? <X size={24} /> : <Menu size={24} />}
        </button>
      </div>

      {/* Sidebar Navigation */}
      <aside className={`
        fixed inset-0 z-40 md:static w-72 h-screen border-r border-white/5 p-6 flex flex-col gap-8
        transition-transform duration-300 md:translate-x-0 bg-[#050505]
        ${sidebarOpen ? 'translate-x-0' : '-translate-x-full'}
      `}>
        <div className="hidden md:flex items-center gap-3 cursor-pointer" onClick={() => setActiveView('dashboard')}>
          <div className="w-10 h-10 bg-blue-600 rounded-xl flex items-center justify-center font-orbitron font-bold shadow-lg shadow-blue-500/20">N</div>
          <div>
            <span className="font-orbitron font-bold text-xl block tracking-tight">4DNEXUS<span className="text-blue-500">PRO</span></span>
            <span className="text-[10px] text-slate-500 uppercase font-bold tracking-[0.2em]">Premium Intelligence</span>
          </div>
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
          
          <div className="flex gap-2 p-1 bg-white/5 rounded-lg">
            {(['EN', 'CN', 'MY'] as const).map(l => (
              <button
                key={l}
                onClick={() => setLang(l)}
                className={`flex-1 py-1.5 text-xs font-bold rounded-md transition-all ${
                  lang === l ? 'bg-white/10 text-white shadow-sm' : 'text-slate-500 hover:text-slate-300'
                }`}
              >
                {l}
              </button>
            ))}
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
                  alt="Banner" 
                  className="w-full h-full object-cover brightness-50 group-hover:scale-105 transition-transform duration-700"
                />
                <div className="absolute inset-0 bg-gradient-to-r from-black via-black/40 to-transparent p-8 md:p-12 flex flex-col justify-center">
                  <span className="text-blue-400 text-sm font-bold uppercase tracking-widest mb-2">Special Draw Alert</span>
                  <h1 className="text-3xl md:text-5xl font-orbitron font-bold mb-4 leading-tight">THE NEXUS<br/>JACKPOT PULSE</h1>
                  <p className="text-slate-300 max-w-lg text-sm md:text-base hidden md:block">Real-time aggregation engine synchronizing with 10+ global sources every 300 seconds.</p>
                  <div className="mt-6 flex gap-4">
                    <ShadowButton variant="gold">Check Live Jackpot</ShadowButton>
                    <button className="text-white font-semibold flex items-center gap-2 hover:gap-3 transition-all" onClick={() => setActiveView('manual')}>
                      Learn More <ChevronRight size={18} />
                    </button>
                  </div>
                </div>
              </div>

              {/* Data Quality & Source Indicators */}
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
                <div className="flex items-center gap-4 text-xs font-bold text-slate-500">
                  <span>LATENCY: 42ms</span>
                  <span>ACCURACY: 99.9%</span>
                </div>
              </div>

              {/* Grid Content */}
              <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                <div className="lg:col-span-2 space-y-6">
                  <div className="flex items-center justify-between">
                    <h2 className="text-2xl font-orbitron font-bold flex items-center gap-3">
                      <span className="w-1.5 h-6 bg-blue-600 rounded-full"></span>
                      Latest Results
                    </h2>
                    <div className="flex gap-2">
                      <button className="px-3 py-1 rounded-full bg-white/5 border border-white/10 text-xs hover:bg-white/10 transition-colors">Yesterday</button>
                      <button className="px-3 py-1 rounded-full bg-blue-600/20 border border-blue-500/30 text-xs text-blue-400">Today</button>
                    </div>
                  </div>

                  <div className="grid grid-cols-1 gap-6">
                    {MOCK_RESULTS.map((res, i) => (
                      <ResultCard key={i} result={res} lang={lang} />
                    ))}
                  </div>
                </div>

                <div className="space-y-8">
                  <Predictor />
                  <div className="glass rounded-2xl p-6">
                    <h3 className="text-lg font-orbitron font-bold mb-4 flex items-center gap-2">
                      <BarChart3 size={20} className="text-amber-500" />
                      Hot Frequency
                    </h3>
                    <div className="space-y-4">
                      {HOT_NUMBERS.slice(0, 3).map((n, i) => (
                        <div key={i} className="flex items-center justify-between p-3 rounded-xl bg-white/5 border border-white/5">
                          <span className="text-xl font-orbitron font-bold text-white tracking-widest">{n.number}</span>
                          <div className="text-right">
                            <span className="text-[10px] text-slate-500 block uppercase">Hits (6mo)</span>
                            <span className="text-sm font-bold text-amber-500">{n.frequency}x</span>
                          </div>
                        </div>
                      ))}
                    </div>
                    <ShadowButton variant="secondary" className="w-full mt-4 text-xs" onClick={() => setActiveView('stats')}>
                      Full Analytics
                    </ShadowButton>
                  </div>
                </div>
              </div>
            </>
          )}

          {activeView === 'stats' && (
            <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-700">
               <h2 className="text-3xl font-orbitron font-bold">Deep Data Analytics</h2>
               <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                  <div className="glass rounded-2xl p-8">
                    <h3 className="text-xl font-bold mb-2">Number Frequency Distribution</h3>
                    <p className="text-slate-400 text-sm mb-6">Aggregate hit count over the last 180 days across all major platforms.</p>
                    <StatsChart />
                  </div>
                  <div className="glass rounded-2xl p-8 space-y-6">
                    <h3 className="text-xl font-bold mb-4">Market Sentiment</h3>
                    <div className="space-y-6">
                       {['Magnum', 'Toto', 'Da Ma Cai'].map((m, i) => (
                         <div key={i} className="space-y-2">
                           <div className="flex justify-between text-sm">
                             <span className="text-slate-300">{m} 4D Stability</span>
                             <span className="text-blue-400 font-bold">8{i} %</span>
                           </div>
                           <div className="h-2 bg-white/5 rounded-full overflow-hidden">
                             <div className="h-full bg-blue-600 rounded-full transition-all duration-1000" style={{ width: `${80 + i * 5}%` }}></div>
                           </div>
                         </div>
                       ))}
                    </div>
                  </div>
               </div>
            </div>
          )}

          {activeView === 'predictions' && (
             <div className="max-w-4xl mx-auto space-y-8 animate-in zoom-in duration-500">
                <div className="text-center space-y-4 py-8">
                   <h2 className="text-4xl font-orbitron font-bold bg-gradient-to-r from-blue-400 via-purple-400 to-pink-400 bg-clip-text text-transparent">Nexus Intelligence Engine</h2>
                   <p className="text-slate-400">Advanced ML models trained on 20 years of historical 4D data.</p>
                </div>
                <Predictor />
             </div>
          )}

          {activeView === 'news' && <NewsSection />}

          {activeView === 'archive' && (
            <div className="space-y-6">
              <h2 className="text-3xl font-orbitron font-bold">Historical Archive</h2>
              <div className="glass rounded-2xl overflow-hidden border border-white/10">
                <table className="w-full text-left border-collapse">
                  <thead>
                    <tr className="bg-white/5 text-slate-400 text-xs uppercase tracking-widest font-bold">
                      <th className="p-6">Date</th>
                      <th className="p-6">Provider</th>
                      <th className="p-6">Draw ID</th>
                      <th className="p-6">1st Prize</th>
                      <th className="p-6">2nd Prize</th>
                      <th className="p-6">3rd Prize</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-white/5">
                    {[...MOCK_RESULTS, ...MOCK_RESULTS].map((row, i) => (
                      <tr key={i} className="hover:bg-white/[0.02] transition-colors cursor-pointer group">
                        <td className="p-6 text-sm text-slate-300 font-orbitron">{row.drawDate}</td>
                        <td className="p-6 text-sm font-semibold text-blue-400">{row.provider}</td>
                        <td className="p-6 text-sm text-slate-500">{row.drawNumber}</td>
                        <td className="p-6 font-orbitron font-bold text-amber-500 group-hover:scale-110 transition-transform origin-left">{row.first}</td>
                        <td className="p-6 font-orbitron text-slate-300">{row.second}</td>
                        <td className="p-6 font-orbitron text-slate-300">{row.third}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}

          {activeView === 'manual' && <UserManual />}
          {activeView === 'admin' && <AdminDashboard />}
          {activeView === 'premium' && (
            <div className="max-w-3xl mx-auto space-y-12 py-12 text-center">
              <div className="space-y-4">
                <h2 className="text-5xl font-orbitron font-bold">Nexus Premium</h2>
                <p className="text-slate-400 text-lg">Unlock the full power of real-time 4D intelligence.</p>
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                <div className="glass p-8 rounded-3xl border border-white/5 space-y-6">
                  <h3 className="text-2xl font-bold">Free Tier</h3>
                  <div className="text-4xl font-orbitron font-bold">$0<span className="text-sm text-slate-500 font-normal">/mo</span></div>
                  <ul className="text-slate-400 text-left space-y-4">
                    <li className="flex items-center gap-2"><div className="w-1.5 h-1.5 rounded-full bg-blue-500"></div> Real-time results</li>
                    <li className="flex items-center gap-2"><div className="w-1.5 h-1.5 rounded-full bg-blue-500"></div> Basic frequency stats</li>
                  </ul>
                  <button className="w-full py-3 rounded-xl border border-white/10 text-slate-400 cursor-default">Current Plan</button>
                </div>

                <div className="glass p-8 rounded-3xl border border-blue-500/30 bg-blue-600/5 space-y-6 relative overflow-hidden">
                  <div className="absolute top-0 right-0 bg-blue-600 text-white text-[10px] font-bold px-4 py-1 rounded-bl-xl uppercase tracking-widest">Most Popular</div>
                  <h3 className="text-2xl font-bold text-blue-400">Pro Tier</h3>
                  <div className="text-4xl font-orbitron font-bold">$19<span className="text-sm text-slate-500 font-normal">/mo</span></div>
                  <ShadowButton variant="primary" className="w-full py-3">Upgrade to Pro</ShadowButton>
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Responsible Gaming Footer */}
        <footer className="mt-20 p-8 border-t border-white/5 bg-black/40 text-slate-500">
           <div className="max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-3 gap-8 mb-12">
              <div className="space-y-4">
                <div className="flex items-center gap-2 opacity-50">
                  <div className="w-6 h-6 bg-slate-600 rounded flex items-center justify-center font-orbitron font-bold text-xs">N</div>
                  <span className="font-orbitron font-bold tracking-tight">4DNEXUS<span className="text-slate-500">PRO</span></span>
                </div>
                <p className="text-xs leading-relaxed">
                  4D Nexus Pro is a data intelligence platform and not a gambling site. 
                </p>
              </div>
              <div className="space-y-2">
                <h4 className="text-xs font-bold uppercase tracking-widest text-slate-400">Resources</h4>
                <div className="grid grid-cols-2 gap-2 text-xs">
                  <a href="#" className="hover:text-blue-400 transition-colors">Privacy Policy</a>
                  <a href="#" className="hover:text-blue-400 transition-colors" onClick={() => setActiveView('manual')}>User Manual</a>
                </div>
              </div>
              <div className="p-4 rounded-xl border border-white/5 bg-white/5">
                <h4 className="text-xs font-bold uppercase tracking-widest text-slate-400 mb-2">Responsible Gaming</h4>
                <p className="text-[10px] leading-relaxed mb-3">Lottery is for adults 18+. Play only what you can afford to lose.</p>
              </div>
           </div>
        </footer>
      </main>
    </div>
  );
};

export default App;
