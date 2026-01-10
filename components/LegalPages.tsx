
import React, { useState } from 'react';
import { 
  Shield, 
  Info, 
  FileText, 
  Mail, 
  Map, 
  AlertTriangle, 
  Send, 
  CheckCircle2, 
  RefreshCw, 
  Scale, 
  Lock, 
  Eye, 
  ShieldCheck,
  Globe,
  Users,
  Compass,
  LayoutGrid,
  Zap,
  Server,
  Sparkles
} from 'lucide-react';
import { ShadowButton } from './ShadowButton';
import { supabase } from '../services/supabase';

const PageHeader: React.FC<{ icon: any, title: string, subtitle: string, color: string }> = ({ icon: Icon, title, subtitle, color }) => (
  <header className="space-y-4 mb-12 animate-in fade-in slide-in-from-bottom-4 duration-700">
    <div className={`w-16 h-16 rounded-2xl bg-${color}-500/10 flex items-center justify-center border border-${color}-500/20`}>
      <Icon className={`text-${color}-500`} size={32} />
    </div>
    <div className="space-y-2">
      <h1 className="text-4xl font-orbitron font-black tracking-tight text-slate-900 dark:text-white">{title}</h1>
      <p className="text-slate-500 dark:text-slate-400 text-lg font-medium">{subtitle}</p>
    </div>
    <div className="h-1 w-20 bg-blue-600 rounded-full"></div>
  </header>
);

const ContentSection: React.FC<{ title: string, children: React.ReactNode }> = ({ title, children }) => (
  <section className="space-y-4 mb-10">
    <h2 className="text-xl font-orbitron font-bold text-slate-900 dark:text-white flex items-center gap-3">
      <span className="w-1.5 h-6 bg-blue-500/40 rounded-full"></span>
      {title}
    </h2>
    <div className="text-slate-600 dark:text-slate-400 leading-relaxed space-y-4 text-sm md:text-base">
      {children}
    </div>
  </section>
);

export const DisclaimerPage: React.FC = () => (
  <article className="max-w-4xl mx-auto py-12 px-4 animate-in fade-in duration-700">
    <PageHeader 
      icon={AlertTriangle} 
      title="Legal Disclaimer" 
      subtitle="Operational boundaries and data utilization warnings."
      color="amber"
    />
    <div className="glass p-8 md:p-12 rounded-[3rem] border border-white/10 space-y-2 shadow-2xl">
      <ContentSection title="1. Informational Neutrality">
        <p>4D Nexus Pro operates as an independent data aggregation and statistical analysis interface. We are not affiliated with, authorized by, or endorsed by any official lottery operators including Magnum, Sports Toto, or Da Ma Cai.</p>
        <p>The information provided on this platform is for individual research and entertainment purposes only. It does not constitute financial, legal, or professional advice.</p>
      </ContentSection>
      <ContentSection title="2. Result Discrepancies">
        <p>While our neural engine synchronizes with multiple sources to ensure 99.9% data integrity, hardware latency or source-level errors may occur. Users must verify all results with the official licensed outlets or websites before making any claims or decisions.</p>
      </ContentSection>
      <ContentSection title="3. No Gambling Facilitation">
        <p>Under no circumstances does 4D Nexus Pro accept bets, facilitate wagers, or provide a medium for gambling. We strictly aggregate historical and real-time data for analytical observation.</p>
      </ContentSection>
      <div className="pt-8 mt-8 border-t border-white/5 flex items-center gap-3 text-[10px] font-black uppercase text-slate-500 tracking-widest">
        <Scale size={14} /> Global Compliance Protocol v4.2
      </div>
    </div>
  </article>
);

export const PrivacyPolicy: React.FC = () => (
  <article className="max-w-4xl mx-auto py-12 px-4 animate-in fade-in duration-700">
    <PageHeader 
      icon={Shield} 
      title="Privacy Policy" 
      subtitle="Comprehensive data protection and cookie management standards."
      color="blue"
    />
    <div className="glass p-8 md:p-12 rounded-[3rem] border border-white/10 space-y-2 shadow-2xl">
      <div className="mb-8 p-4 rounded-2xl bg-blue-500/5 border border-blue-500/20 text-xs text-blue-400 font-bold uppercase tracking-widest">
        Last Modified: October 24, 2024
      </div>
      <ContentSection title="1. Data Extraction & Usage">
        <p>We collect non-identifiable metadata to optimize neural throughput, including browser signatures, geographic regions, and interface interaction patterns. Registered nodes provide email and Nexus IDs which are encrypted via AES-256 protocols.</p>
      </ContentSection>
      <ContentSection title="2. Google AdSense & Cookies">
        <p>This platform utilizes Google AdSense to serve telemetry-based advertisements. Google uses cookies to serve ads based on your prior visits to our website or other websites.</p>
        <p><strong>DART Cookie:</strong> Google's use of advertising cookies enables it and its partners to serve ads to our users based on their visit to 4D Nexus Pro and/or other sites on the Internet.</p>
      </ContentSection>
      <ContentSection title="3. Third-Party Intelligence">
        <p>We may share anonymized traffic data with analytical partners to improve pattern recognition algorithms. We never sell raw personal identities or email databases to third-party marketing firms.</p>
      </ContentSection>
      <ContentSection title="4. Data Autonomy">
        <p>Users maintain full right to "The Forge" (account deletion). Upon request, all node signatures and historical ledger entries associated with an account will be purged within 48 neural hours.</p>
      </ContentSection>
    </div>
  </article>
);

export const AboutUs: React.FC = () => (
  <article className="max-w-5xl mx-auto py-12 px-4 animate-in fade-in duration-700">
    <div className="text-center space-y-6 mb-20">
      <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-blue-500/10 border border-blue-500/20 text-[10px] font-black uppercase text-blue-500 tracking-[0.4em]">
        <Sparkles size={12} /> The Nexus Evolution
      </div>
      <h1 className="text-5xl md:text-7xl font-orbitron font-black text-white leading-tight">
        Quantifying <span className="text-blue-500">Luck</span> Through <br/>Neural Data.
      </h1>
      <p className="text-slate-500 text-lg md:text-xl max-w-3xl mx-auto font-medium">
        4D Nexus Pro is the world's most advanced lottery intelligence platform, built on a foundation of decentralized data aggregation and predictive entropy analysis.
      </p>
    </div>

    <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-20">
       {[
         { icon: Server, title: 'Edge Network', desc: 'Operating 14+ high-throughput nodes globally for zero-latency result syncing.' },
         { icon: Zap, title: 'Neural Core', desc: 'Proprietary ML models trained on 20+ years of Malaysian and Singaporean draw history.' },
         { icon: ShieldCheck, title: 'Trust Matrix', desc: 'Blockchain-verified data verification ensures 100% immutable record integrity.' },
       ].map((f, i) => (
         <div key={i} className="glass p-10 rounded-[2.5rem] border border-white/10 hover:border-blue-500/30 transition-all group">
            <div className="p-4 rounded-2xl bg-white/5 w-fit mb-6 group-hover:scale-110 transition-transform">
               <f.icon className="text-blue-500" size={32} />
            </div>
            <h3 className="text-xl font-orbitron font-bold text-white mb-3">{f.title}</h3>
            <p className="text-slate-500 text-sm leading-relaxed">{f.desc}</p>
         </div>
       ))}
    </div>

    <div className="glass p-12 md:p-20 rounded-[4rem] text-center border border-white/10 bg-gradient-to-br from-blue-600/5 to-transparent relative overflow-hidden">
      <div className="absolute top-0 right-0 w-64 h-64 bg-blue-600/10 blur-[120px] pointer-events-none" />
      <h2 className="text-4xl font-orbitron font-bold mb-8">Global Operations</h2>
      <p className="text-slate-400 text-lg max-w-2xl mx-auto">Founded in the tech hub of Kuala Lumpur, our vision is to democratize lottery data through professional-grade analytics tools available to every punter.</p>
      <div className="flex flex-wrap justify-center gap-12 grayscale opacity-40">
        {['KL HUB', 'SG NODE', 'HK RELAY', 'SYD DEPOT'].map(city => (
          <div key={city} className="font-orbitron font-black text-sm tracking-[0.5em]">{city}</div>
        ))}
      </div>
    </div>
  </article>
);

export const ContactUs: React.FC = () => {
  const [submitted, setSubmitted] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    const formData = new FormData(e.target as HTMLFormElement);
    const payload = {
      name: formData.get('name') as string,
      email: formData.get('email') as string,
      category: formData.get('category') as string,
      message: formData.get('message') as string,
    };

    try {
      const { error: insertError } = await supabase
        .from('inquiries')
        .insert([payload]);

      if (insertError) throw insertError;

      setSubmitted(true);
    } catch (err: any) {
      console.error("Submission failed:", err);
      setError(err.message || "Failed to transmit signal to Nexus Command.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <article className="max-w-5xl mx-auto py-12 px-4 animate-in fade-in duration-700">
      <PageHeader 
        icon={Mail} 
        title="Command Support" 
        subtitle="24/7 technical relay for all nexus operations."
        color="purple"
      />

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-12">
        <div className="lg:col-span-2 glass p-8 md:p-12 rounded-[3rem] border border-white/10 shadow-2xl relative overflow-hidden">
          <div className="absolute -top-10 -right-10 w-40 h-40 bg-purple-500/10 blur-[80px] rounded-full" />
          
          {submitted ? (
            <div className="flex flex-col items-center justify-center py-20 text-center space-y-6 animate-in zoom-in">
              <div className="w-20 h-20 rounded-full bg-green-500/20 flex items-center justify-center text-green-500 border border-green-500/30">
                <CheckCircle2 size={48} />
              </div>
              <div className="space-y-2">
                 <h3 className="text-2xl font-orbitron font-bold text-white uppercase tracking-widest">Signal Transmitted</h3>
                 <p className="text-slate-500 max-w-xs mx-auto">Your intelligence request is being routed to the appropriate sector. Your data has been logged in the Nexus database.</p>
              </div>
              <ShadowButton variant="secondary" onClick={() => setSubmitted(false)} className="px-10">Return to Comms</ShadowButton>
            </div>
          ) : (
            <form className="space-y-6" onSubmit={handleSubmit}>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-1">
                   <label className="text-[10px] font-black uppercase text-slate-500 tracking-widest px-2">Operator Name</label>
                   <input required name="name" type="text" placeholder="John Doe" className="w-full bg-black/40 border border-white/10 p-4 rounded-2xl focus:border-purple-500/50 outline-none text-white transition-all" />
                </div>
                <div className="space-y-1">
                   <label className="text-[10px] font-black uppercase text-slate-500 tracking-widest px-2">Handshake Email</label>
                   <input required name="email" type="email" placeholder="nexus@operator.ai" className="w-full bg-black/40 border border-white/10 p-4 rounded-2xl focus:border-purple-500/50 outline-none text-white transition-all" />
                </div>
              </div>
              <div className="space-y-1">
                 <label className="text-[10px] font-black uppercase text-slate-500 tracking-widest px-2">Transmission Category</label>
                 <select name="category" className="w-full bg-black/40 border border-white/10 p-4 rounded-2xl focus:border-purple-500/50 outline-none text-slate-400 font-bold appearance-none">
                    <option value="General Intelligence">General Intelligence Inquiry</option>
                    <option value="Technical Maintenance">Technical Hub Maintenance</option>
                    <option value="Elite Membership">Elite Membership Escalation</option>
                    <option value="Business Data">Business Data Licensing</option>
                 </select>
              </div>
              <div className="space-y-1">
                 <label className="text-[10px] font-black uppercase text-slate-500 tracking-widest px-2">Manifest Details</label>
                 <textarea required name="message" placeholder="Outline your inquiry or node issues..." rows={6} className="w-full bg-black/40 border border-white/10 p-4 rounded-2xl focus:border-purple-500/50 outline-none text-white transition-all resize-none"></textarea>
              </div>
              
              {error && (
                <div className="p-4 rounded-2xl bg-red-500/10 border border-red-500/20 text-red-500 text-xs font-bold flex items-center gap-2">
                  <AlertTriangle size={16} />
                  {error}
                </div>
              )}

              <ShadowButton disabled={loading} variant="primary" className="w-full py-5 flex items-center justify-center gap-3 text-sm font-black uppercase tracking-widest">
                {loading ? <RefreshCw className="animate-spin" size={20} /> : <Send size={20} />}
                {loading ? 'Routing Transmission...' : 'Execute Intelligence Relay'}
              </ShadowButton>
            </form>
          )}
        </div>

        <div className="space-y-8">
          <div className="glass p-6 rounded-[2rem] space-y-4 border border-blue-500/20 bg-blue-500/5 group hover:border-blue-500/40 transition-all">
            <Mail className="text-blue-500 group-hover:scale-110 transition-transform" size={28} />
            <div>
               <p className="text-[10px] text-slate-500 uppercase font-black tracking-widest">Digital Relay</p>
               <p className="text-sm font-orbitron font-bold text-white">ops@nexuspro.ai</p>
            </div>
          </div>
          <div className="glass p-6 rounded-[2rem] space-y-4 border border-amber-500/20 bg-amber-500/5 group hover:border-amber-500/40 transition-all">
            <Globe className="text-amber-500 group-hover:scale-110 transition-transform" size={28} />
            <div>
               <p className="text-[10px] text-slate-500 uppercase font-black tracking-widest">Node Registry</p>
               <p className="text-sm font-orbitron font-bold text-white">nodes.nexuspro.ai</p>
            </div>
          </div>
          <div className="p-6 rounded-[2rem] bg-slate-900/40 border border-white/5 space-y-4">
             <div className="flex items-center gap-2 text-green-500 animate-pulse">
                <ShieldCheck size={16} />
                <span className="text-[10px] font-black uppercase tracking-widest">System Operational</span>
             </div>
             <p className="text-[10px] text-slate-500 leading-relaxed italic">
               "Nexus Command prioritizes signals from Elite Tier nodes. Standard relay response time is within 24 operational hours."
             </p>
          </div>
        </div>
      </div>
    </article>
  );
};

export const Sitemap: React.FC<({ onNavigate: (view: any) => void })> = ({ onNavigate }) => {
  const SITEMAP_DATA = [
    {
      title: 'Neural Core',
      icon: Compass,
      color: 'blue',
      links: [
        { id: 'dashboard', label: 'Real-Time Matrix' },
        { id: 'stats', label: 'Deep Analytics Hub' },
        { id: 'archive', label: 'Historical Ledger' },
        { id: 'predictions', label: 'ML Prediction Hub' }
      ]
    },
    {
      title: 'Intelligence Hub',
      icon: LayoutGrid,
      color: 'purple',
      links: [
        { id: 'news', label: 'Industry Reports' },
        { id: 'sellers', label: 'Terminal Registry' },
        { id: 'community', label: 'Nexus Collective' },
        { id: 'challenges', label: 'Oracle Rankings' }
      ]
    },
    {
      title: 'Protocols & Ops',
      icon: FileText,
      color: 'slate',
      links: [
        { id: 'manual', label: 'User Operations' },
        { id: 'premium', label: 'Elite Escalation' },
        { id: 'widgets', label: 'Publisher Nodes' },
        { id: 'about', label: 'System Mission' }
      ]
    },
    {
      title: 'Governance',
      icon: Scale,
      color: 'amber',
      links: [
        { id: 'disclaimer', label: 'Legal Disclaimer' },
        { id: 'privacy', label: 'Privacy Standards' },
        { id: 'terms', label: 'Terms of Sync' },
        { id: 'contact', label: 'Command Support' }
      ]
    }
  ];

  return (
    <article className="max-w-6xl mx-auto py-12 px-4 animate-in fade-in duration-700">
      <PageHeader 
        icon={Compass} 
        title="Neural Directory" 
        subtitle="Global sitemap for rapid platform synchronization."
        color="blue"
      />

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
        {SITEMAP_DATA.map((section, idx) => (
          <div key={idx} className="glass p-8 rounded-[2.5rem] border border-white/10 hover:border-white/20 transition-all flex flex-col h-full shadow-xl">
             <div className="flex items-center gap-3 mb-8">
                <div className={`p-2 rounded-xl bg-${section.color}-500/10 text-${section.color}-500`}>
                   <section.icon size={20} />
                </div>
                <h3 className="font-orbitron font-bold text-white text-sm uppercase tracking-widest">{section.title}</h3>
             </div>
             <ul className="space-y-4 flex-1">
                {section.links.map((link) => (
                  <li key={link.id}>
                    <button 
                      onClick={() => onNavigate(link.id)}
                      className="text-slate-500 hover:text-blue-400 transition-colors flex items-center gap-2 text-sm font-bold group"
                    >
                      <Zap size={10} className="opacity-0 group-hover:opacity-100 transition-opacity" />
                      {link.label}
                    </button>
                  </li>
                ))}
             </ul>
          </div>
        ))}
      </div>
      
      <div className="mt-20 p-8 rounded-[2rem] bg-white/5 border border-dashed border-white/10 text-center">
         <p className="text-[10px] font-black uppercase text-slate-500 tracking-[0.4em]">Search Engine Bot Manifest v1.0 &bull; Automated Indexing Permitted</p>
      </div>
    </article>
  );
};

export const TermsConditions: React.FC = () => (
  <article className="max-w-4xl mx-auto py-12 px-4 animate-in fade-in duration-700">
    <PageHeader 
      icon={FileText} 
      title="Terms of Sync" 
      subtitle="Standard operating procedures for node interaction."
      color="slate"
    />
    <div className="glass p-8 md:p-12 rounded-[3rem] border border-white/10 space-y-2 shadow-2xl">
      <ContentSection title="1. Agreement of Protocol">
        <p>By establishing a handshake with 4D Nexus Pro, you acknowledge that you have read and synchronized with these operational terms. Unauthorized scraping or automated data retrieval is strictly prohibited.</p>
      </ContentSection>
      <ContentSection title="2. Intellectual Property Vault">
        <p>The visual matrix, neural prediction weights, and aggregated data structures remain the exclusive digital property of 4D Nexus Pro. Distribution of these data points without API clearance is a violation of international tech treaties.</p>
      </ContentSection>
      <ContentSection title="3. Node Termination">
        <p>We reserve the authority to terminate any user node found attempting to disrupt global sync flows, injecting malicious code into the community chat, or misusing the Oracle rankings.</p>
      </ContentSection>
      <ContentSection title="4. Governing Jurisdiction">
        <p>These terms are governed by the digital commerce laws of the Malaysia Tech Corridor (MSC) and Singapore Cyber Governance authorities.</p>
      </ContentSection>
    </div>
  </article>
);
