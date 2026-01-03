
import React, { useState, useEffect, useRef } from 'react';
import { MessageCircle, Send, User, ShieldCheck, Sparkles, Hash, Users, Activity, TrendingUp, Info } from 'lucide-react';

interface Message {
  id: string;
  user: string;
  text: string;
  time: string;
  isPro?: boolean;
  avatarId: number;
}

export const CommunityChat: React.FC = () => {
  const [activeChannel, setActiveChannel] = useState('general-market');
  const [messages, setMessages] = useState<Message[]>([
    { id: '1', user: 'Lucky_Strike', text: 'Magnum 84xx sequence looks strong for tonight. Pattern convergence is at 88%.', time: '14:30', isPro: true, avatarId: 1 },
    { id: '2', user: 'TotoMaster', text: 'Anyone tracking the 1102 cluster? It was cold for 120 days.', time: '14:32', avatarId: 2 },
    { id: '3', user: 'QuantumPunter', text: 'AI sentiment on GDLotto is slightly bearish today, wait for the next cycle.', time: '14:35', isPro: true, avatarId: 3 },
    { id: '4', user: 'NexusFan', text: 'Just verified my ticket via AR. Amazing accuracy!', time: '14:38', avatarId: 4 },
  ]);
  const [input, setInput] = useState('');
  const scrollRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [messages]);

  const handleSend = () => {
    if (!input.trim()) return;
    const newMessage = {
      id: Date.now().toString(),
      user: 'Elite_Member_01',
      text: input,
      time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      avatarId: 5,
      isPro: true
    };
    setMessages([...messages, newMessage]);
    setInput('');
  };

  const CHANNELS = [
    { id: 'general-market', name: 'General Market', icon: Hash, count: 1240 },
    { id: 'magnum-toto', name: 'Magnum & Toto', icon: Hash, count: 850 },
    { id: 'damacai-sg', name: 'Da Ma Cai & SG', icon: Hash, count: 420 },
    { id: 'predictive-ai', name: 'Neural Predictions', icon: Sparkles, count: 680 },
    { id: 'verification', name: 'Chain Verification', icon: ShieldCheck, count: 150 },
  ];

  return (
    <div className="flex flex-col lg:flex-row gap-8 h-[calc(100vh-12rem)] animate-in fade-in slide-in-from-bottom-6 duration-700">
      {/* Sidebar Channels */}
      <aside className="w-full lg:w-72 flex flex-col gap-6">
        <div className="glass p-6 rounded-[2rem] border border-white/5 space-y-4">
           <h3 className="text-xs font-black uppercase tracking-[0.3em] text-slate-500 mb-4 px-2">Nexus Channels</h3>
           <div className="space-y-1">
             {CHANNELS.map((chan) => (
               <button 
                 key={chan.id}
                 onClick={() => setActiveChannel(chan.id)}
                 className={`w-full flex items-center justify-between p-3 rounded-xl transition-all ${
                   activeChannel === chan.id 
                   ? 'bg-blue-600/10 border border-blue-500/20 text-blue-400' 
                   : 'text-slate-500 hover:text-slate-300 hover:bg-white/5'
                 }`}
               >
                 <div className="flex items-center gap-3">
                   <chan.icon size={16} className={activeChannel === chan.id ? 'text-blue-500' : ''} />
                   <span className="text-xs font-bold">{chan.name}</span>
                 </div>
                 <span className="text-[9px] font-black opacity-40">{chan.count}</span>
               </button>
             ))}
           </div>
        </div>

        <div className="glass p-6 rounded-[2rem] border border-white/5 space-y-4">
           <h3 className="text-xs font-black uppercase tracking-[0.3em] text-slate-500 px-2">Trending Logic</h3>
           <div className="space-y-3">
             {[
               { tag: '8492_CLUSTER', weight: 92, color: 'text-amber-500' },
               { tag: 'ENTROPY_GAP', weight: 45, color: 'text-blue-500' },
               { tag: 'TOTO_6D_PEAK', weight: 78, color: 'text-red-500' },
             ].map((t, i) => (
               <div key={i} className="flex flex-col gap-1 p-3 bg-white/5 rounded-xl border border-white/5">
                  <div className="flex justify-between items-center">
                    <span className={`text-[10px] font-black ${t.color}`}>#{t.tag}</span>
                    <TrendingUp size={12} className="text-slate-600" />
                  </div>
                  <div className="flex items-center gap-2">
                    <div className="flex-1 h-1 bg-white/5 rounded-full overflow-hidden">
                       <div className={`h-full ${t.color.replace('text', 'bg')}`} style={{ width: `${t.weight}%` }}></div>
                    </div>
                    <span className="text-[8px] font-bold text-slate-600">{t.weight}%</span>
                  </div>
               </div>
             ))}
           </div>
        </div>
      </aside>

      {/* Main Chat Area */}
      <div className="flex-1 flex flex-col glass rounded-[2.5rem] border border-white/10 overflow-hidden relative">
        <div className="p-6 border-b border-white/5 bg-white/5 flex items-center justify-between">
          <div className="flex items-center gap-4">
             <div className="p-3 bg-blue-600/10 rounded-2xl text-blue-500">
                <Users size={20} />
             </div>
             <div>
                <h2 className="font-orbitron font-bold text-lg tracking-tight">#{activeChannel.replace('-', ' ')}</h2>
                <div className="flex items-center gap-2 text-[9px] font-black uppercase text-slate-500">
                   <span className="w-1.5 h-1.5 rounded-full bg-green-500 animate-pulse"></span>
                   1,248 Nodes Online
                </div>
             </div>
          </div>
          <div className="flex gap-2">
             <button className="p-2 glass border border-white/10 rounded-xl text-slate-400 hover:text-white transition-all">
                <Activity size={18} />
             </button>
             <button className="p-2 glass border border-white/10 rounded-xl text-slate-400 hover:text-white transition-all">
                <Info size={18} />
             </button>
          </div>
        </div>

        <div ref={scrollRef} className="flex-1 overflow-y-auto p-8 space-y-6 custom-scrollbar scroll-smooth">
          {messages.map((m) => (
            <div key={m.id} className={`flex gap-4 ${m.user === 'Elite_Member_01' ? 'flex-row-reverse' : ''}`}>
               <div className="shrink-0">
                  <img src={`https://picsum.photos/seed/user${m.avatarId}/40/40`} className="w-10 h-10 rounded-xl border border-white/10" alt={m.user} />
               </div>
               <div className={`flex flex-col gap-1.5 max-w-[70%] ${m.user === 'Elite_Member_01' ? 'items-end' : ''}`}>
                  <div className="flex items-center gap-2">
                    {m.isPro && <ShieldCheck size={12} className="text-blue-500" />}
                    <span className="text-[10px] font-black text-slate-500 uppercase tracking-widest">{m.user}</span>
                    <span className="text-[8px] text-slate-700">{m.time}</span>
                  </div>
                  <div className={`px-5 py-3 rounded-3xl text-sm leading-relaxed ${
                    m.user === 'Elite_Member_01' 
                    ? 'bg-blue-600 text-white rounded-tr-none shadow-lg shadow-blue-500/20' 
                    : 'bg-white/5 text-slate-300 rounded-tl-none border border-white/5'
                  }`}>
                    {m.text}
                  </div>
               </div>
            </div>
          ))}
        </div>

        <div className="p-6 bg-black/40 border-t border-white/10 flex gap-4">
          <div className="flex-1 relative">
            <input 
              type="text" 
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyDown={(e) => e.key === 'Enter' && handleSend()}
              placeholder={`Post to #${activeChannel}...`}
              className="w-full bg-white/5 border border-white/10 rounded-2xl px-6 py-4 text-sm focus:outline-none focus:border-blue-500/50 pr-12 transition-all"
            />
            <div className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-700">
               <Hash size={16} />
            </div>
          </div>
          <button 
            onClick={handleSend}
            className="px-6 bg-blue-600 rounded-2xl text-white hover:bg-blue-500 transition-all flex items-center justify-center shadow-lg shadow-blue-500/20 active:scale-95"
          >
            <Send size={20} />
          </button>
        </div>

        <div className="p-3 bg-blue-600/10 text-center relative overflow-hidden">
           <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/5 to-transparent animate-[shimmer_3s_infinite]" style={{ backgroundSize: '200% 100%' }}></div>
           <p className="text-[9px] text-blue-400 font-black uppercase tracking-[0.4em] flex items-center justify-center gap-2 relative z-10">
             <Sparkles size={10}/> Nexus Moderator V2.4 Active: Encrypted Stream
           </p>
        </div>
      </div>
    </div>
  );
};
