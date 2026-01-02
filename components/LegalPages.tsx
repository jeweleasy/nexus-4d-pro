
import React from 'react';
import { Shield, Info, FileText, Mail, Map, AlertTriangle, Send } from 'lucide-react';
import { ShadowButton } from './ShadowButton';

export const DisclaimerPage: React.FC = () => (
  <article className="max-w-4xl mx-auto space-y-8 animate-in fade-in slide-in-from-bottom-6 duration-700">
    <header className="space-y-4">
      <h1 className="text-4xl font-orbitron font-bold flex items-center gap-4">
        <AlertTriangle className="text-amber-500" /> Legal Disclaimer
      </h1>
      <p className="text-slate-400 text-lg">Important information regarding the use of this data intelligence platform.</p>
    </header>
    <div className="glass p-8 rounded-3xl space-y-6 text-slate-300 leading-relaxed">
      <section className="space-y-4">
        <h2 className="text-xl font-bold text-white">1. Not a Gambling Platform</h2>
        <p>4D Nexus Pro is a data aggregation and analytical tool. We do not provide gambling services, nor do we accept bets or facilitate any form of wagering. Our platform is for informational and entertainment purposes only.</p>
      </section>
      <section className="space-y-4">
        <h2 className="text-xl font-bold text-white">2. Accuracy of Results</h2>
        <p>While we strive for 99.9% accuracy through our multi-source verification engine, official results should always be confirmed with respective licensed operators. 4D Nexus Pro is not responsible for any financial loss resulting from discrepancies in data.</p>
      </section>
      <section className="space-y-4">
        <h2 className="text-xl font-bold text-white">3. Predictions & Patterns</h2>
        <p>Our "Nexus Intelligence Engine" uses historical data patterns. No predictive model can guarantee future outcomes in a game of chance. Users should never rely on these predictions for financial decisions.</p>
      </section>
    </div>
  </article>
);

export const PrivacyPolicy: React.FC = () => (
  <article className="max-w-4xl mx-auto space-y-8 animate-in fade-in slide-in-from-bottom-6 duration-700">
    <header className="space-y-4">
      <h1 className="text-4xl font-orbitron font-bold flex items-center gap-4">
        <Shield className="text-blue-400" /> Privacy Policy
      </h1>
      <p className="text-slate-400 text-lg">Your data security and privacy are our top priorities.</p>
    </header>
    <div className="glass p-8 rounded-3xl space-y-6 text-slate-300 text-sm">
      <p>Last updated: May 24, 2024</p>
      <section className="space-y-2">
        <h2 className="text-lg font-bold text-white">Data Collection</h2>
        <p>We collect minimal data necessary for performance optimization, including device type, browser metadata, and preferred language settings. We do not sell user data to third parties.</p>
      </section>
      <section className="space-y-2">
        <h2 className="text-lg font-bold text-white">Cookies & Tracking</h2>
        <p>We use essential cookies to remember your dashboard preferences and local language selection. Analytics tracking is anonymized to protect your identity.</p>
      </section>
      <section className="space-y-2">
        <h2 className="text-lg font-bold text-white">User Rights</h2>
        <p>Under global privacy standards (GDPR/CCPA), you have the right to request access to or deletion of any metadata associated with your session. Contact our privacy officer for details.</p>
      </section>
    </div>
  </article>
);

export const AboutUs: React.FC = () => (
  <article className="max-w-4xl mx-auto space-y-12 animate-in fade-in slide-in-from-bottom-6 duration-700">
    <div className="text-center space-y-4">
      <h1 className="text-5xl font-orbitron font-bold bg-gradient-to-r from-blue-400 to-purple-500 bg-clip-text text-transparent">The Nexus Mission</h1>
      <p className="text-slate-400 text-xl max-w-2xl mx-auto">Revolutionizing 4D data intelligence through transparency, speed, and advanced computation.</p>
    </div>
    
    <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
      <div className="glass p-8 rounded-3xl space-y-4 border-l-4 border-blue-500">
        <h2 className="text-2xl font-bold">Real-Time Aggregation</h2>
        <p className="text-slate-400 text-sm">Our proprietary engine synchronizes with over 14 global sources every 300 seconds, ensuring you have the latest data before anyone else.</p>
      </div>
      <div className="glass p-8 rounded-3xl space-y-4 border-l-4 border-purple-500">
        <h2 className="text-2xl font-bold">Neural Analytics</h2>
        <p className="text-slate-400 text-sm">We don't just show numbers; we analyze them. Our ML models process 20 years of historical data to identify emerging patterns.</p>
      </div>
    </div>

    <div className="glass p-12 rounded-3xl text-center space-y-6">
      <h3 className="text-3xl font-bold">Global Presence</h3>
      <p className="text-slate-400">Headquartered in the heart of Southeast Asia's tech corridor, serving millions of data-driven punters worldwide.</p>
      <div className="flex justify-center gap-12 pt-8 grayscale opacity-50">
        <div className="text-center font-orbitron font-bold">KL</div>
        <div className="text-center font-orbitron font-bold">SG</div>
        <div className="text-center font-orbitron font-bold">HK</div>
        <div className="text-center font-orbitron font-bold">SYD</div>
      </div>
    </div>
  </article>
);

export const ContactUs: React.FC = () => (
  <article className="max-w-4xl mx-auto space-y-8 animate-in fade-in slide-in-from-bottom-6 duration-700">
    <header className="text-center space-y-4">
      <h1 className="text-4xl font-orbitron font-bold">Connect With Us</h1>
      <p className="text-slate-400">Our support team is active 24/7 to assist with your technical inquiries.</p>
    </header>

    <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
      <div className="md:col-span-2 glass p-8 rounded-3xl space-y-6">
        <form className="space-y-4" onSubmit={(e) => e.preventDefault()}>
          <div className="grid grid-cols-2 gap-4">
            <input type="text" placeholder="Full Name" className="bg-white/5 border border-white/10 p-3 rounded-xl focus:outline-none focus:border-blue-500 transition-all" />
            <input type="email" placeholder="Email Address" className="bg-white/5 border border-white/10 p-3 rounded-xl focus:outline-none focus:border-blue-500 transition-all" />
          </div>
          <select className="bg-white/5 border border-white/10 p-3 rounded-xl w-full focus:outline-none focus:border-blue-500 transition-all text-slate-400">
            <option>General Inquiry</option>
            <option>Technical Support</option>
            <option>Premium Subscription</option>
            <option>Data Licensing</option>
          </select>
          <textarea placeholder="How can we help you?" rows={5} className="bg-white/5 border border-white/10 p-3 rounded-xl w-full focus:outline-none focus:border-blue-500 transition-all"></textarea>
          <ShadowButton variant="primary" className="w-full py-4 flex items-center justify-center gap-2">
            <Send size={18} /> Send Intelligence Request
          </ShadowButton>
        </form>
      </div>

      <div className="space-y-6">
        <div className="glass p-6 rounded-2xl space-y-2">
          <Mail className="text-blue-400 mb-2" />
          <p className="text-xs text-slate-500 uppercase font-bold">Direct Email</p>
          <p className="text-sm font-semibold">intelligence@4dnexuspro.ai</p>
        </div>
        <div className="glass p-6 rounded-2xl space-y-2">
          <Info className="text-purple-400 mb-2" />
          <p className="text-xs text-slate-500 uppercase font-bold">Help Desk</p>
          <p className="text-sm font-semibold">support.4dnexus.pro</p>
        </div>
      </div>
    </div>
  </article>
);

export const Sitemap: React.FC<({ onNavigate: (view: any) => void })> = ({ onNavigate }) => (
  <article className="max-w-4xl mx-auto space-y-8 animate-in fade-in slide-in-from-bottom-6 duration-700">
    <h1 className="text-4xl font-orbitron font-bold">Platform Sitemap</h1>
    <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-8">
      <div className="space-y-4">
        <h3 className="text-blue-400 font-bold uppercase tracking-widest text-xs">Core Engine</h3>
        <ul className="space-y-2 text-slate-400 text-sm">
          <li><button onClick={() => onNavigate('dashboard')} className="hover:text-white transition-colors">Real-Time Dashboard</button></li>
          <li><button onClick={() => onNavigate('stats')} className="hover:text-white transition-colors">Statistical Matrix</button></li>
          <li><button onClick={() => onNavigate('archive')} className="hover:text-white transition-colors">Historical Archive</button></li>
          <li><button onClick={() => onNavigate('predictions')} className="hover:text-white transition-colors">ML Prediction Hub</button></li>
        </ul>
      </div>
      <div className="space-y-4">
        <h3 className="text-purple-400 font-bold uppercase tracking-widest text-xs">Knowledge Base</h3>
        <ul className="space-y-2 text-slate-400 text-sm">
          <li><button onClick={() => onNavigate('news')} className="hover:text-white transition-colors">Industry News</button></li>
          <li><button onClick={() => onNavigate('manual')} className="hover:text-white transition-colors">User Manual</button></li>
          <li><button onClick={() => onNavigate('about')} className="hover:text-white transition-colors">About Our Tech</button></li>
        </ul>
      </div>
      <div className="space-y-4">
        <h3 className="text-slate-500 font-bold uppercase tracking-widest text-xs">Legal & Compliance</h3>
        <ul className="space-y-2 text-slate-400 text-sm">
          <li><button onClick={() => onNavigate('disclaimer')} className="hover:text-white transition-colors">Disclaimer</button></li>
          <li><button onClick={() => onNavigate('privacy')} className="hover:text-white transition-colors">Privacy Policy</button></li>
          <li><button onClick={() => onNavigate('terms')} className="hover:text-white transition-colors">Terms & Conditions</button></li>
          <li><button onClick={() => onNavigate('contact')} className="hover:text-white transition-colors">Contact Support</button></li>
        </ul>
      </div>
    </div>
  </article>
);

export const TermsConditions: React.FC = () => (
  <article className="max-w-4xl mx-auto space-y-8 animate-in fade-in slide-in-from-bottom-6 duration-700">
    <header className="space-y-4">
      <h1 className="text-4xl font-orbitron font-bold flex items-center gap-4">
        <FileText className="text-slate-400" /> Terms & Conditions
      </h1>
      <p className="text-slate-400 text-lg">Your agreement for using 4D Nexus Pro services.</p>
    </header>
    <div className="glass p-8 rounded-3xl space-y-6 text-slate-300 text-sm leading-relaxed">
      <section>
        <h2 className="text-lg font-bold text-white mb-2 underline underline-offset-8">1. Acceptable Use</h2>
        <p>Users agree to use 4D Nexus Pro for personal, non-commercial research only. Automated data scraping or harvesting is strictly prohibited and will result in permanent IP suspension.</p>
      </section>
      <section>
        <h2 className="text-lg font-bold text-white mb-2 underline underline-offset-8">2. Intellectual Property</h2>
        <p>The proprietary "Nexus Engine" visualizations, ML prediction algorithms, and unified data structures are the exclusive intellectual property of 4D Nexus Pro.</p>
      </section>
      <section>
        <h2 className="text-lg font-bold text-white mb-2 underline underline-offset-8">3. Limitation of Liability</h2>
        <p>To the maximum extent permitted by law, 4D Nexus Pro shall not be liable for any indirect, incidental, or consequential damages resulting from the use or inability to use our platform.</p>
      </section>
    </div>
  </article>
);
