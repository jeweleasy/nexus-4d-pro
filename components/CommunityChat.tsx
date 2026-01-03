
import React, { useState, useEffect, useRef, useMemo } from 'react';
import { 
  MessageCircle, Send, User, ShieldCheck, Sparkles, Hash, Users, 
  Activity, TrendingUp, Info, Search, Crown, Lock, Link as LinkIcon,
  Clock, Calendar, MessageSquare, Mic, ShieldAlert, Bot, AtSign,
  Phone, Coins, Volume2, Headset, X, Check
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
  const [showTagSuggestions, setShowTagSuggestions] = useState(false);
  const [isVoiceActive, setIsVoiceActive] = useState(false);
  const scrollRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  const [messages, setMessages] = useState<Message[]>([
    { id: 'm1', user: 'Nexus_Bot', text: 'Welcome to the 4D Nexus Community. Ask me anything about results or rules!', time: '09:00', date: '2024-10-24', isBot: true, avatarId: 0 },
    { id: 'm2', user: 'Lucky_Strike', text: 'Magnum 84xx sequence looks strong for tonight.', time: '14:30', date: '2024-10-24', isPro: true, isRegistered: true, avatarId: 1 },
    { id: 'm3', user: 'TotoMaster', text: 'Anyone tracking the 1102 cluster?', time: '14:32', date: '2024-10-24', isRegistered: true, avatarId: 2 },
  ]);

  // Derived list of unique users for tagging suggestions
  const recentUsers = useMemo(() => {
    const users = messages.filter(m => !m.isBot).map(m => m.user);
    return Array.from(new Set(users));
  }, [messages]);

  const filteredTags = useMemo(() => {
    const lastWord = input.split(' ').pop() || '';
    if (lastWord.startsWith('@')) {
      const query = lastWord.slice(1).toLowerCase();
      return recentUsers.filter(u => u.toLowerCase().includes(query));
    }
    return [];
  }, [input, recentUsers]);

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [messages, activeChannel]);

  useEffect(() => {
    const lastWord = input.split(' ').pop() || '';
    setShowTagSuggestions(lastWord.startsWith('@') && filteredTags.length > 0 && !!currentUser);
  }, [input, filteredTags, currentUser]);

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

    // Restriction: Member point deduction
    if (currentUser) {
      const cost = replyTo ? 15 : 10; // Extra cost for threading
      if (currentUser.points < cost) {
        alert(`Insufficient Nexus Points: This transmission costs ${cost} Pts. Sync your daily bonus to continue.`);
        return;
      }
      onUpdateUser({ ...currentUser, points: currentUser.points - cost });
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
      replyToId: replyTo?.id
    };

    setMessages(prev => [...prev, newMessage]);
    handleBotResponse(input);
    setInput('');
    setReplyTo(null);
  };

  const selectTagSuggestion = (user: string) => {
    const words = input.split(' ');
    words.pop();
    setInput(words.join(' ') + (words.length > 0 ? ' ' : '') + '@' + user + ' ');
    setShowTagSuggestions(false);
    inputRef.current?.focus();
  };

  const handleReply = (msg: Message) => {
    if (!currentUser) {
      alert("Registration Required: Replying is a restricted node feature.");
      return;
    }
    setReplyTo(msg);
    inputRef.current?.focus();
  };

  const toggleVoiceNode = () => {
    if (!currentUser) {
      alert("Registration Required: Join the Nexus network to enter Voice discuss nodes.");
      return;
    }
    setIsVoiceActive(!isVoiceActive);
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

        {/* Voice Hub Section */}
        <div className="glass p-6 rounded-[2rem] border border-white/5 space-y-4 bg-gradient-to-br from-blue-600/5 to-transparent">
           <div className="flex justify-between items-center">
              <h3 className="text-[10px] font-black uppercase tracking-[0.3em] text-slate-500">Voice Node</h3>
              <div className={`w-2 h-2 rounded-full ${isVoiceActive ? 'bg-green-500 animate-pulse' : 'bg-slate-700'}`}></div>
           </div>
           <button 
             onClick={toggleVoiceNode}
             className={`w-full py-4 rounded-2xl border flex items-center justify-center gap-3 transition-all ${
               isVoiceActive 
               ? 'bg-red-500/10 border-red-500/30 text-red-500' 
               : 'bg-blue-600/10 border-blue-500/20 text-blue-500 hover:bg-blue-600/20'
             }`}
           >
             {isVoiceActive ? <Mic size={18} /> : <Headset size={18} />}
             <span className="text-xs font-black uppercase tracking-widest">
               {isVoiceActive ? 'LEAVE VOICE' : 'JOIN VOICE NODE'}
             </span>
           </button>
           {isVoiceActive && (
             <div className="flex -space-x-2 overflow-hidden justify-center py-2 animate-in fade-in">
               {[1,2,3].map(i => (
                 <img key={i} src={`https://api.dicebear.com/7.x/avataaars/svg?seed=node${i}`} className="w-8 h-8 rounded-full border-2 border-black bg-slate-900" alt="Active" />
               ))}
               <div className="w-8 h-8 rounded-full border-2 border-black bg-slate-800 flex items-center justify-center text-[10px] font-black">+12</div>
             </div>
           )}
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
                  <img src={m.isBot ? `https://api.dicebear.com/7.x/bottts/svg?seed=nexus` : `https://api.dicebear.com/7.x/avataaars/svg?seed=user${m.avatarId}`} className="w-10 h-10 rounded-xl border border-white/10 shadow-lg" alt={m.user} />
                  {m.isPro && <div className="absolute -top-1 -right-1 w-4 h-4 bg-amber-500 rounded-full flex items-center justify-center text-[8px] text-black font-black border border-black"><Crown size={8}/></div>}
                  {m.isRegistered && !m.isPro && !m.isBot && <div className="absolute -top-1 -right-1 w-4 h-4 bg-blue-500 rounded-full flex items-center justify-center text-[8px] text-white font-black border border-black"><ShieldCheck size={8}/></div>}
               </div>

               <div className={`flex flex-col gap-1.5 max-w-[80%] sm:max-w-[70%] ${m.user === currentUser?.nexusId ? 'items-end' : ''}`}>
                  <div className={`flex items-center gap-2 ${m.user === currentUser?.nexusId ? 'flex-row-reverse' : ''}`}>
                    {m.isBot && <Bot size={12} className="text-blue-400" />}
                    <span className={`text-[10px] font-black uppercase tracking-widest ${m.isBot ? 'text-blue-400' : 'text-slate-500'}`}>
                      {m.user}
                    </span>
                    <span className="text-[8px] text-slate-700 flex items-center gap-1 opacity-60">
                      <Clock size={8}/> {m.time}
                    </span>
                  </div>

                  {m.replyToId && (
                    <div className="text-[10px] italic text-slate-500 bg-white/5 px-3 py-1.5 rounded-xl border-l-2 border-blue-500/30 mb-1 max-w-full truncate flex items-center gap-2">
                      <TrendingUp size={10} className="text-blue-500/50" />
                      Replying to: {messages.find(msg => msg.id === m.replyToId)?.text}
                    </div>
                  )}

                  <div className={`relative px-5 py-3 rounded-3xl text-sm leading-relaxed group shadow-sm transition-all ${
                    m.user === currentUser?.nexusId 
                    ? 'bg-blue-600 text-white rounded-tr-none' 
                    : m.isBot ? 'bg-blue-900/20 text-blue-100 rounded-tl-none border border-blue-500/20' 
                    : 'bg-white/5 text-slate-300 rounded-tl-none border border-white/5'
                  }`}>
                    {m.text.split(' ').map((word, i) => (
                      word.startsWith('@') ? <span key={i} className="text-amber-400 font-black">{word} </span> : word + ' '
                    ))}
                    
                    <div className={`absolute top-1/2 -translate-y-1/2 opacity-0 group-hover:opacity-100 transition-opacity flex gap-1 ${m.user === currentUser?.nexusId ? 'left-[-80px]' : 'right-[-80px]'}`}>
                      <button 
                        onClick={() => handleReply(m)}
                        className={`p-2 bg-black/60 backdrop-blur-md rounded-lg text-[10px] font-black uppercase tracking-tighter hover:text-blue-400 text-slate-400 transition-colors shadow-xl ${!currentUser ? 'opacity-50 cursor-not-allowed' : ''}`}
                      >
                        {currentUser ? 'Reply' : <Lock size={10} />}
                      </button>
                    </div>
                  </div>
               </div>
            </div>
          ))}
        </div>

        {replyTo && (
          <div className="mx-6 px-4 py-3 bg-blue-600/10 border-x border-t border-blue-500/20 rounded-t-2xl flex items-center justify-between animate-in slide-in-from-bottom-2">
             <div className="flex items-center gap-2 overflow-hidden">
                <div className="w-1.5 h-1.5 rounded-full bg-blue-500 animate-pulse"></div>
                <span className="text-[10px] font-black text-blue-400 uppercase">Replying to {replyTo.user}:</span>
                <span className="text-[10px] text-slate-500 truncate italic">{replyTo.text}</span>
             </div>
             <button onClick={() => setReplyTo(null)} className="text-slate-500 hover:text-white p-1"><X size={14}/></button>
          </div>
        )}

        <div className="p-4 md:p-6 bg-black/40 border-t border-white/10 flex flex-col gap-4 relative">
          {/* Tag Suggestions Dropdown */}
          {showTagSuggestions && (
            <div className="absolute bottom-full left-6 w-56 bg-[#0a0a0a] border border-white/10 rounded-2xl shadow-2xl mb-2 overflow-hidden animate-in fade-in slide-in-from-bottom-2">
              <div className="p-2 border-b border-white/5 bg-white/5">
                <span className="text-[8px] font-black text-slate-500 uppercase tracking-widest px-2">Suggesting Nodes</span>
              </div>
              <div className="max-h-40 overflow-y-auto custom-scrollbar">
                {filteredTags.map(user => (
                  <button 
                    key={user}
                    onClick={() => selectTagSuggestion(user)}
                    className="w-full text-left px-4 py-2 text-xs text-slate-300 hover:bg-blue-600 hover:text-white transition-colors flex items-center justify-between"
                  >
                    <span>@{user}</span>
                    <Check size={10} className="opacity-0 group-hover:opacity-100" />
                  </button>
                ))}
              </div>
            </div>
          )}

          <div className="flex gap-4">
            <div className="flex-1 relative">
              <input 
                ref={inputRef}
                type="text" 
                value={input}
                onChange={(e) => setInput(e.target.value)}
                onKeyDown={(e) => e.key === 'Enter' && handleSend()}
                placeholder={currentUser ? `Type @ to tag nodes in #${activeChannel}...` : "Public chat active (Text only)..."}
                className="w-full bg-white/5 border border-white/10 rounded-2xl px-6 py-4 text-sm focus:outline-none focus:border-blue-500/50 pr-12 transition-all shadow-inner"
              />
              <div className="absolute right-4 top-1/2 -translate-y-1/2 flex items-center gap-2">
                 {currentUser && (
                   <div className="flex items-center gap-1.5 px-2 py-1 bg-amber-500/10 border border-amber-500/20 rounded-lg" title={replyTo ? "Reply: 15 Pts" : "Msg: 10 Pts"}>
                      <Coins size={12} className="text-amber-500" />
                      <span className="text-[9px] font-black text-amber-500">{replyTo ? '15' : '10'} Pts</span>
                   </div>
                 )}
                 <button className={`text-slate-600 hover:text-blue-500 transition-colors ${!currentUser ? 'opacity-30 cursor-not-allowed' : ''}`} disabled={!currentUser}><Mic size={16} /></button>
                 <div className="w-px h-4 bg-white/10"></div>
                 <LinkIcon size={16} className={`${input.includes('http') ? 'text-amber-500' : 'text-slate-600'} ${!currentUser ? 'opacity-30' : ''}`} />
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
                <Lock size={10} /> Links/Replies Restricted
              </p>
            ) : (
              <p className="text-[9px] text-slate-600 font-bold uppercase tracking-widest hidden sm:block">
                Replies cost +5 bonus Pts
              </p>
            )}
          </div>
        </div>

        <div className="p-3 bg-blue-600/10 text-center relative overflow-hidden border-t border-white/5">
           <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/5 to-transparent animate-[shimmer_5s_infinite]" style={{ backgroundSize: '200% 100%' }}></div>
           <p className="text-[9px] text-blue-400 font-black uppercase tracking-[0.4em] flex items-center justify-center gap-2 relative z-10">
             <Volume2 size={10}/> Global Voice Node Relay ACTIVE &bull; Decentralized Node {activeChannel.toUpperCase()}
           </p>
        </div>
      </div>
    </div>
  );
};
