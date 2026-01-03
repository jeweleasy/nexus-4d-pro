
import React, { useState, useEffect, useRef, useMemo } from 'react';
import { 
  MessageCircle, Send, User, ShieldCheck, Sparkles, Hash, Users, 
  Activity, TrendingUp, Info, Search, Crown, Lock, Link as LinkIcon,
  Clock, Calendar, MessageSquare, Mic, ShieldAlert, Bot, AtSign,
  Phone, Coins
} from 'lucide-react';
import { predictionService } from '../services/geminiService';
import { User as NexusUser } from '../types';

interface CommunityChatProps {
  isPremium?: boolean;
  currentUser: NexusUser | null;
  onUpdateUser: (updatedUser: NexusUser) => void;
}

interface Message {
  id: string;
  user: string;
  text: string;
  time: string;
  date: string;
  isPro?: boolean;
  isBot?: boolean;
  isRegistered?: boolean;
  avatarId: number;
  pointsCost?: number;
  replyToId?: string;
  tags?: string[];
}

export const CommunityChat: React.FC<CommunityChatProps> = ({ isPremium = false, currentUser, onUpdateUser }) => {
  const [activeChannel, setActiveChannel] = useState('general-market');
  const [searchQuery, setSearchQuery] = useState('');
  const [input, setInput] = useState('');
  const [isLoadingBot, setIsLoadingBot] = useState(false);
  const [replyTo, setReplyTo] = useState<Message | null>(null);
  const scrollRef = useRef<HTMLDivElement>(null);

  const [messages, setMessages] = useState<Message[]>([
    { id: 'm1', user: 'Nexus_Bot', text: 'Welcome to the 4D Nexus Community. Ask me anything about results or rules!', time: '09:00', date: '2024-10-24', isBot: true, avatarId: 0 },
    { id: 'm2', user: 'Lucky_Strike', text: 'Magnum 84xx sequence looks strong for tonight.', time: '14:30', date: '2024-10-24', isPro: true, isRegistered: true, avatarId: 1 },
    { id: 'm3', user: 'TotoMaster', text: 'Anyone tracking the 1102 cluster?', time: '14:32', date: '2024-10-24', isRegistered: true, avatarId: 2 },
  ]);

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [messages, activeChannel]);

  const CHANNELS = [
    { id: 'general-market', name: 'General Market', icon: Hash, count: 1240, vip: false },
    { id: 'magnum-4d', name: 'Magnum 4D', icon: Hash, count: 850, vip: false },
    { id: 'toto-4d', name: 'Sports Toto', icon: Hash, count: 420, vip: false },
    { id: 'damacai', name: 'Da Ma Cai', icon: Hash, count: 310, vip: false },
    { id: 'sg-pools', name: 'Singapore Pools', icon: Hash, count: 290, vip: false },
    { id: 'vip-lounge', name: 'Elite Prediction Hub', icon: Crown, count: 150, vip: true },
  ];

  const filteredMessages = useMemo(() => {
    let list = messages;
    if (searchQuery.trim()) {
      list = list.filter(m => m.text.toLowerCase().includes(searchQuery.toLowerCase()) || m.user.toLowerCase().includes(searchQuery.toLowerCase()));
    }
    return list;
  }, [messages, searchQuery]);

  const handleBotResponse = async (userText: string) => {
    setIsLoadingBot(true);
    if (userText.includes('?') || userText.toLowerCase().includes('bot') || userText.toLowerCase().includes('how') || userText.toLowerCase().includes('result')) {
      const response = await predictionService.chatWithAssistant([], userText);
      const botMsg: Message = {
        id: 'bot-' + Date.now(),
        user: 'Nexus_Bot',
        text: response,
        time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
        date: new Date().toISOString().split('T')[0],
        isBot: true,
        avatarId: 0
      };
      setMessages(prev => [...prev, botMsg]);
    }
    setIsLoadingBot(false);
  };

  const handleSend = () => {
    if (!input.trim()) return;

    const hasLink = /http|www|\.com|\.ai|\.my/gi.test(input);
    const hasPhone = /(\+?\d{8,15})/.test(input.replace(/\s/g, ''));

    // Restriction: Guest cannot share links or phone numbers
    if ((hasLink || hasPhone) && !currentUser) {
      alert("Registration Required: Sharing links, promotions, or mobile numbers is restricted to registered Nexus Nodes only.");
      return;
    }

    // Restriction: Member point deduction (10 points per message/reply/link)
    if (currentUser) {
      if (currentUser.points < 10) {
        alert("Insufficient Nexus Points: Each transmission costs 10 Pts. Sync your daily bonus to continue.");
        return;
      }
      
      // Deduct points
      const updatedUser = { ...currentUser, points: currentUser.points - 10 };
      onUpdateUser(updatedUser);
    }

    const newMessage: Message = {
      id: 'msg-' + Date.now(),
      user: currentUser?.nexusId || 'Guest_User_' + Math.floor(Math.random() * 999),
      text: input,
      time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      date: new Date().toISOString().split('T')[0],
      avatarId: currentUser?.avatarId || 4,
      isPro: isPremium,
      isRegistered: !!currentUser,
      pointsCost: 10,
      replyToId: replyTo?.id
    };

    setMessages(prev => [...prev, newMessage]);
    handleBotResponse(input);
    setInput('');
    setReplyTo(null);
  };

  const handleReply = (msg: Message) => {
    if (!currentUser) {
      alert("Registration Required: The reply feature is reserved for registered members to maintain message threading integrity.");
      return;
    }
    setReplyTo(msg);
  };

  const handleTag = (user: string) => {
    if (!currentUser) {
      alert("Registration Required: Tagging users is an advanced node feature.");
      return;
    }
    setInput(`@${user} ${input}`);
  };

  return (
    <div className="flex flex-col lg:flex-row gap-6 h-[calc(100vh-12rem)] animate-in fade-in slide-in-from-bottom-6 duration-700">
      <aside className="w-full lg:w-72 flex flex-col gap-6 shrink-0">
        <div className="glass p-5 rounded-[2rem] border border-white/5 space-y-4">
           <div className="flex items-center justify-between px-2 mb-2">
              <h3 className="text-[10px] font-black uppercase tracking-[0.3em] text-slate-500">Nexus Nodes</h3>
              <div className="flex items-center gap-1 text-[9px] text-blue-400 font-bold bg-blue-500/10 px-2 py-0.5 rounded-full">
                <Users size={10}/> {CHANNELS.find(c => c.id === activeChannel)?.count}
              </div>
           </div>
           <div className="space-y-1">
             {CHANNELS.map((chan) => (
               <button 
                 key={chan.id}
                 onClick={() => {
                   if (chan.vip && !isPremium) {
                     alert("Nexus Elite access required for VIP lounge.");
                     return;
                   }
                   setActiveChannel(chan.id);
                 }}
                 className={`w-full flex items-center justify-between p-3 rounded-xl transition-all relative overflow-hidden group ${
                   activeChannel === chan.id 
                   ? 'bg-blue-600/10 border border-blue-500/20 text-blue-400' 
                   : 'text-slate-500 hover:text-slate-300 hover:bg-white/5'
                 }`}
               >
                 <div className="flex items-center gap-3 z-10">
                   <chan.icon size={16} className={activeChannel === chan.id ? 'text-blue-500' : ''} />
                   <span className="text-xs font-bold">{chan.name}</span>
                 </div>
                 {chan.vip && !isPremium && <Lock size={12} className="text-slate-700 z-10" />}
                 {activeChannel === chan.id && <div className="absolute left-0 top-0 bottom-0 w-1 bg-blue-500"></div>}
               </button>
             ))}
           </div>
        </div>

        <div className="glass p-6 rounded-[2rem] border border-white/5 space-y-4 bg-gradient-to-br from-indigo-500/5 to-transparent">
           <div className="flex justify-between items-center">
              <h3 className="text-[10px] font-black uppercase tracking-[0.3em] text-slate-500">My Ledger</h3>
              <Sparkles size={14} className="text-amber-500" />
           </div>
           <div className="flex items-center justify-between bg-white/5 p-4 rounded-2xl border border-white/5">
              <div>
                 <p className="text-[8px] text-slate-500 uppercase font-black">Nexus Points</p>
                 <p className="text-xl font-orbitron font-bold text-white">{currentUser?.points || 0}</p>
              </div>
              <button className="p-2 bg-blue-600/10 rounded-lg text-blue-400 hover:bg-blue-600/20"><TrendingUp size={16}/></button>
           </div>
           <div className="p-3 bg-white/5 rounded-xl border border-white/5 space-y-2">
              <div className="flex items-center gap-2 text-[8px] font-black text-slate-500 uppercase">
                <ShieldAlert size={10} className="text-amber-500" /> Node Stake Mode
              </div>
              <ul className="text-[9px] text-slate-400 space-y-1 italic">
                <li className="text-amber-500 font-bold">• Transmission: -10 Pts</li>
                <li>• Reply & Tags: -10 Pts</li>
                <li>• Links & Mobiles: -10 Pts</li>
                <li>• Guest Status: Text only</li>
              </ul>
           </div>
        </div>
      </aside>

      <div className="flex-1 flex flex-col glass rounded-[2.5rem] border border-white/10 overflow-hidden relative shadow-2xl">
        <div className="px-6 py-4 border-b border-white/5 bg-white/5 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div className="flex items-center gap-4">
             <div className="p-3 bg-blue-600/10 rounded-2xl text-blue-500 shadow-inner">
                {CHANNELS.find(c => c.id === activeChannel)?.icon === Crown ? <Crown size={20}/> : <MessageSquare size={20} />}
             </div>
             <div>
                <h2 className="font-orbitron font-bold text-lg tracking-tight flex items-center gap-2 uppercase">
                  {activeChannel.replace('-', ' ')}
                  {activeChannel === 'vip-lounge' && <span className="text-[8px] bg-amber-500 text-black px-1.5 py-0.5 rounded font-black">ELITE</span>}
                </h2>
                <div className="flex items-center gap-2 text-[9px] font-black uppercase text-slate-500">
                   <span className="w-1.5 h-1.5 rounded-full bg-green-500 animate-pulse shadow-[0_0_8px_green]"></span>
                   Live Synchronization Active
                </div>
             </div>
          </div>

          <div className="relative flex-1 max-w-xs">
            <input 
              type="text" 
              placeholder="Search past 7 days..." 
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full bg-black/20 border border-white/5 rounded-xl px-10 py-2 text-xs focus:outline-none focus:border-blue-500/50"
            />
            <Search size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-600" />
          </div>
        </div>

        <div ref={scrollRef} className="flex-1 overflow-y-auto p-6 md:p-8 space-y-6 custom-scrollbar scroll-smooth">
          {filteredMessages.map((m) => (
            <div key={m.id} className={`flex gap-4 group animate-in fade-in slide-in-from-bottom-2 ${m.user === currentUser?.nexusId ? 'flex-row-reverse' : ''}`}>
               <div className="shrink-0 relative">
                  <img src={m.isBot ? `https://api.dicebear.com/7.x/bottts/svg?seed=nexus` : `https://picsum.photos/seed/user${m.avatarId}/40/40`} className="w-10 h-10 rounded-xl border border-white/10 shadow-lg" alt={m.user} />
                  {m.isPro && <div className="absolute -top-1 -right-1 w-4 h-4 bg-amber-500 rounded-full flex items-center justify-center text-[8px] text-black font-black border border-black"><Crown size={8}/></div>}
                  {m.isRegistered && !m.isPro && !m.isBot && <div className="absolute -top-1 -right-1 w-4 h-4 bg-blue-500 rounded-full flex items-center justify-center text-[8px] text-white font-black border border-black"><ShieldCheck size={8}/></div>}
               </div>

               <div className={`flex flex-col gap-1.5 max-w-[80%] sm:max-w-[70%] ${m.user === currentUser?.nexusId ? 'items-end' : ''}`}>
                  <div className={`flex items-center gap-2 ${m.user === currentUser?.nexusId ? 'flex-row-reverse' : ''}`}>
                    {m.isBot && <Bot size={12} className="text-blue-400" />}
                    <span className={`text-[10px] font-black uppercase tracking-widest ${m.isBot ? 'text-blue-400' : 'text-slate-500'}`}>
                      {m.user}
                    </span>
                    <span className="text-[8px] text-slate-700 flex items-center gap-1">
                      <Clock size={8}/> {m.time} &bull; {m.date}
                    </span>
                  </div>

                  {m.replyToId && (
                    <div className="text-[10px] italic text-slate-500 bg-white/5 px-3 py-1 rounded-lg border-l-2 border-blue-500/30 mb-1 max-w-full truncate">
                      Replying to: {messages.find(msg => msg.id === m.replyToId)?.text}
                    </div>
                  )}

                  <div className={`relative px-5 py-3 rounded-3xl text-sm leading-relaxed group shadow-sm transition-all ${
                    m.user === currentUser?.nexusId 
                    ? 'bg-blue-600 text-white rounded-tr-none' 
                    : m.isBot ? 'bg-blue-900/20 text-blue-100 rounded-tl-none border border-blue-500/20' 
                    : 'bg-white/5 text-slate-300 rounded-tl-none border border-white/5'
                  }`}>
                    {m.text.includes('@') ? (
                      m.text.split(' ').map((word, i) => (
                        word.startsWith('@') ? <span key={i} className="text-amber-400 font-bold">{word} </span> : word + ' '
                      ))
                    ) : m.text}
                    
                    <div className={`absolute top-1/2 -translate-y-1/2 opacity-0 group-hover:opacity-100 transition-opacity flex gap-1 ${m.user === currentUser?.nexusId ? 'left-[-80px]' : 'right-[-80px]'}`}>
                      <button 
                        onClick={() => handleReply(m)}
                        className={`p-2 bg-black/40 rounded-lg text-[10px] font-black uppercase tracking-tighter hover:text-white ${!currentUser ? 'opacity-50 cursor-not-allowed' : ''}`}
                      >
                        {currentUser ? 'Reply' : <Lock size={10} />}
                      </button>
                      <button 
                        onClick={() => handleTag(m.user)}
                        className={`p-2 bg-black/40 rounded-lg text-[10px] font-black uppercase tracking-tighter hover:text-white ${!currentUser ? 'opacity-50 cursor-not-allowed' : ''}`}
                      >
                        <AtSign size={10} />
                      </button>
                    </div>
                  </div>
               </div>
            </div>
          ))}
        </div>

        {replyTo && (
          <div className="mx-6 px-4 py-2 bg-blue-600/10 border-x border-t border-blue-500/20 rounded-t-xl flex items-center justify-between">
             <div className="flex items-center gap-2 overflow-hidden">
                <span className="text-[10px] font-black text-blue-400 uppercase">Replying to {replyTo.user}:</span>
                <span className="text-[10px] text-slate-500 truncate italic">{replyTo.text}</span>
             </div>
             <button onClick={() => setReplyTo(null)} className="text-slate-500 hover:text-white"><X size={14}/></button>
          </div>
        )}

        <div className="p-4 md:p-6 bg-black/40 border-t border-white/10 flex flex-col gap-4">
          <div className="flex gap-4">
            <div className="flex-1 relative">
              <input 
                type="text" 
                value={input}
                onChange={(e) => setInput(e.target.value)}
                onKeyDown={(e) => e.key === 'Enter' && handleSend()}
                placeholder={currentUser ? `Message in #${activeChannel}...` : "Public chat active (Text only)..."}
                className="w-full bg-white/5 border border-white/10 rounded-2xl px-6 py-4 text-sm focus:outline-none focus:border-blue-500/50 pr-12 transition-all shadow-inner"
              />
              <div className="absolute right-4 top-1/2 -translate-y-1/2 flex items-center gap-2">
                 {currentUser && (
                   <div className="flex items-center gap-1.5 px-2 py-1 bg-amber-500/10 border border-amber-500/20 rounded-lg">
                      <Coins size={12} className="text-amber-500" />
                      <span className="text-[9px] font-black text-amber-500">10 Pts</span>
                   </div>
                 )}
                 <button className={`text-slate-600 hover:text-blue-500 transition-colors ${!currentUser ? 'opacity-30 cursor-not-allowed' : ''}`} disabled={!currentUser}><Mic size={16} /></button>
                 <div className="w-px h-4 bg-white/10"></div>
                 <LinkIcon size={16} className={`${input.includes('http') ? 'text-amber-500' : 'text-slate-600'} ${!currentUser ? 'opacity-30' : ''}`} />
                 <Phone size={14} className={`${!currentUser ? 'opacity-30' : 'text-slate-600'}`} />
              </div>
            </div>
            <button 
              onClick={handleSend}
              className="px-6 bg-blue-600 rounded-2xl text-white hover:bg-blue-500 transition-all flex items-center justify-center shadow-lg shadow-blue-500/20 active:scale-95 shrink-0"
            >
              <Send size={20} />
            </button>
          </div>
          
          <div className="flex items-center justify-between px-2">
            <div className="flex items-center gap-4">
               <div className="flex items-center gap-1.5 text-[9px] font-black uppercase text-slate-500">
                  <ShieldAlert size={12} className="text-amber-500" />
                  Anti-Spam Active
               </div>
               <div className="flex items-center gap-1.5 text-[9px] font-black uppercase text-slate-500">
                  <ShieldCheck size={12} className="text-green-500" />
                  Node Sync Ready
               </div>
            </div>
            {!currentUser ? (
              <p className="text-[9px] text-amber-500 font-black uppercase tracking-widest flex items-center gap-2">
                <Lock size={10} /> Text only for Guests
              </p>
            ) : (
              <p className="text-[9px] text-slate-600 font-bold uppercase tracking-widest hidden sm:block">
                Transmission costs 10 Nexus Pts
              </p>
            )}
          </div>
        </div>

        <div className="p-3 bg-blue-600/10 text-center relative overflow-hidden border-t border-white/5">
           <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/5 to-transparent animate-[shimmer_5s_infinite]" style={{ backgroundSize: '200% 100%' }}></div>
           <p className="text-[9px] text-blue-400 font-black uppercase tracking-[0.4em] flex items-center justify-center gap-2 relative z-10">
             <Sparkles size={10}/> Nexus Moderator V2.4 Active &bull; Encrypted Decentralized Stream
           </p>
        </div>
      </div>
    </div>
  );
};

const X = ({ size }: { size: number }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M18 6 6 18"/><path d="m6 6 12 12"/>
  </svg>
);
