
import React, { useState, useEffect, useRef, useMemo } from 'react';
import { 
  MessageCircle, Send, User, ShieldCheck, Sparkles, Hash, Users, 
  Activity, TrendingUp, Info, Search, Crown, Lock, Link as LinkIcon,
  Clock, Calendar, MessageSquare, Mic, ShieldAlert, Bot, AtSign,
  Phone, Coins, Volume2, Headset, X, Check, Filter, AlertCircle, Trash2, Flag
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
    { id: 'm4', user: 'Data_Pioneer', text: 'Looking at @Lucky_Strike predictions, the convergence is interesting.', time: '14:45', date: '2024-10-24', isRegistered: true, avatarId: 5, tags: ['Lucky_Strike'] },
  ]);

  const registeredUsers = useMemo(() => {
    const users = messages
      .filter(m => m.isRegistered && !m.isBot)
      .map(m => m.user);
    return Array.from(new Set(users));
  }, [messages]);

  const filteredTags = useMemo(() => {
    const parts = input.split(' ');
    const lastWord = parts[parts.length - 1];
    if (lastWord.startsWith('@')) {
      const query = lastWord.slice(1).toLowerCase();
      return registeredUsers.filter(u => u.toLowerCase().includes(query));
    }
    return [];
  }, [input, registeredUsers]);

  useEffect(() => {
    if (!searchQuery && scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [messages, activeChannel, searchQuery]);

  useEffect(() => {
    const parts = input.split(' ');
    const lastWord = parts[parts.length - 1];
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
    if (!searchQuery.trim()) return messages;
    return messages.filter(m => 
      m.text.toLowerCase().includes(searchQuery.toLowerCase()) || 
      m.user.toLowerCase().includes(searchQuery.toLowerCase())
    );
  }, [messages, searchQuery]);

  const handleSend = () => {
    if (!input.trim()) return;
    const hasLink = /http|www|\.com|\.ai|\.my/gi.test(input);
    if (hasLink && !currentUser) {
      alert("Registration Required: Sharing links is restricted to verified nodes.");
      return;
    }
    if (currentUser) {
      const cost = replyTo ? 15 : 10;
      if (currentUser.points < cost) {
        alert(`Insufficient Points: Required ${cost} Pts.`);
        return;
      }
      onUpdateUser({ ...currentUser, points: currentUser.points - cost });
    }
    const newMessage: Message = {
      id: 'msg-' + Date.now(),
      user: currentUser?.nexusId || 'Guest_' + Math.floor(Math.random() * 999),
      text: input,
      time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      date: new Date().toISOString().split('T')[0],
      avatarId: currentUser?.avatarId || Math.floor(Math.random() * 10) + 1,
      isPro: isPremium,
      isRegistered: !!currentUser,
      replyToId: replyTo?.id
    };
    setMessages(prev => [...prev, newMessage]);
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
      alert("Verified Handshake required for linking.");
      return;
    }
    setReplyTo(msg);
    inputRef.current?.focus();
  };

  const handleReport = (msg: Message) => {
    if (!currentUser) return;
    alert(`Node ${msg.user} reported. Kernel Moderation cycle initiated.`);
    const reports = JSON.parse(localStorage.getItem('nexus_moderation_queue') || '[]');
    localStorage.setItem('nexus_moderation_queue', JSON.stringify([...reports, { ...msg, reportedBy: currentUser.nexusId, reportTime: Date.now() }]));
  };

  return (
    <div className="flex flex-col lg:flex-row gap-6 h-[calc(100vh-12rem)] animate-in fade-in slide-in-from-bottom-6 duration-700">
      <aside className="w-full lg:w-72 flex flex-col gap-6 shrink-0">
        <div className="glass p-5 rounded-[2rem] border border-white/5 space-y-4">
           <div className="flex items-center justify-between px-2 mb-2">
              <h3 className="text-[10px] font-black uppercase tracking-[0.3em] text-slate-500">Channels</h3>
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
                     alert("Nexus Elite status required.");
                     return;
                   }
                   setActiveChannel(chan.id);
                 }}
                 className={`w-full flex items-center justify-between p-3 rounded-xl transition-all relative overflow-hidden group ${
                   activeChannel === chan.id ? 'bg-blue-600/10 border border-blue-500/20 text-blue-400' : 'text-slate-500 hover:text-slate-300 hover:bg-white/5'
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
        <div className="glass p-6 rounded-[2rem] border border-white/5 space-y-4 bg-gradient-to-br from-blue-600/5 to-transparent">
           <div className="flex justify-between items-center">
              <h3 className="text-[10px] font-black uppercase tracking-[0.3em] text-slate-500">Voice Nodes</h3>
              <div className={`w-2 h-2 rounded-full ${isVoiceActive ? 'bg-green-500 animate-pulse' : 'bg-slate-700'}`}></div>
           </div>
           <button 
             onClick={() => currentUser ? setIsVoiceActive(!isVoiceActive) : alert("Join network to access voice nodes.")}
             className={`w-full py-4 rounded-2xl border flex items-center justify-center gap-3 transition-all ${
               isVoiceActive ? 'bg-red-500/10 border-red-500/30 text-red-500' : 'bg-blue-600/10 border-blue-500/20 text-blue-500 hover:bg-blue-600/20'
             }`}
           >
             {isVoiceActive ? <Mic size={18} /> : <Headset size={18} />}
             <span className="text-xs font-black uppercase tracking-widest">{isVoiceActive ? 'Leave Relay' : 'Connect Voice'}</span>
           </button>
        </div>
      </aside>

      <div className="flex-1 flex flex-col glass rounded-[2.5rem] border border-white/10 overflow-hidden relative shadow-2xl">
        <div className="px-6 py-5 border-b border-white/5 bg-white/5 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div className="flex items-center gap-4">
             <div className="p-3 bg-blue-600/10 rounded-2xl text-blue-500">
                {CHANNELS.find(c => c.id === activeChannel)?.vip ? <Crown size={20}/> : <MessageSquare size={20} />}
             </div>
             <div>
                <h2 className="font-orbitron font-bold text-lg uppercase">#{activeChannel.replace('-', ' ')}</h2>
                <div className="flex items-center gap-2 text-[9px] font-black uppercase text-slate-500">
                   <span className="w-1.5 h-1.5 rounded-full bg-green-500 animate-pulse"></span>
                   Synchronization Active
                </div>
             </div>
          </div>
          <div className="relative flex-1 max-w-xs group">
            <input 
              type="text" 
              placeholder="Search cache..." 
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full bg-black/40 border border-white/10 rounded-2xl px-10 py-2.5 text-xs focus:outline-none focus:border-blue-500/50"
            />
            <Search size={16} className={`absolute left-3.5 top-1/2 -translate-y-1/2 ${searchQuery ? 'text-blue-500' : 'text-slate-600'}`} />
          </div>
        </div>

        <div ref={scrollRef} className="flex-1 overflow-y-auto p-6 md:p-8 space-y-8 custom-scrollbar scroll-smooth">
          {filteredMessages.map((m) => {
            const isOwner = m.user === currentUser?.nexusId;
            const parentMsg = m.replyToId ? messages.find(msg => msg.id === m.replyToId) : null;
            return (
              <div key={m.id} className={`flex gap-4 group animate-in fade-in slide-in-from-bottom-2 ${isOwner ? 'flex-row-reverse' : ''}`}>
                 <div className="shrink-0 relative">
                    <img src={m.isBot ? `https://api.dicebear.com/7.x/bottts/svg?seed=nexus` : `https://api.dicebear.com/7.x/avataaars/svg?seed=user${m.avatarId}`} className="w-11 h-11 rounded-2xl border border-white/10 shadow-lg" alt={m.user} />
                    {m.isPro && <div className="absolute -top-1 -right-1 w-5 h-5 bg-amber-500 rounded-full flex items-center justify-center text-[8px] text-black font-black border-2 border-[#050505] shadow-lg"><Crown size={10}/></div>}
                 </div>
                 <div className={`flex flex-col gap-1.5 max-w-[85%] sm:max-w-[75%] ${isOwner ? 'items-end' : ''}`}>
                    <div className={`flex items-center gap-3 ${isOwner ? 'flex-row-reverse' : ''}`}>
                      <span className={`text-[10px] font-black uppercase tracking-widest ${m.isBot ? 'text-blue-400' : 'text-slate-500'}`}>{m.user}</span>
                      <span className="text-[8px] text-slate-700 font-bold opacity-60">{m.time}</span>
                    </div>
                    {parentMsg && (
                      <div className={`text-[10px] text-slate-500 bg-white/5 px-4 py-2 rounded-2xl border-l-4 border-blue-500/40 mb-1 max-w-full italic ${isOwner ? 'mr-2' : 'ml-2'}`}>
                        "{parentMsg.text}"
                      </div>
                    )}
                    <div className={`relative px-5 py-3.5 rounded-3xl text-sm leading-relaxed shadow-sm transition-all group/msg ${
                      isOwner ? 'bg-blue-600 text-white rounded-tr-none' 
                      : m.isBot ? 'bg-blue-900/20 text-blue-100 rounded-tl-none border border-blue-500/20' 
                      : 'bg-white/5 text-slate-300 rounded-tl-none border border-white/5 group-hover:border-white/10'
                    }`}>
                      {m.text.split(' ').map((word, i) => (
                        word.startsWith('@') ? <span key={i} className="text-amber-400 font-black">{word} </span> : word + ' '
                      ))}
                      <div className={`absolute top-1/2 -translate-y-1/2 opacity-0 group-hover/msg:opacity-100 transition-all flex gap-1 ${isOwner ? 'left-[-120px]' : 'right-[-120px]'}`}>
                        <button onClick={() => handleReply(m)} className="p-2 bg-black/80 backdrop-blur-xl rounded-xl text-[10px] font-black uppercase text-slate-400 hover:text-blue-500 border border-white/10 flex items-center gap-1.5">
                          {currentUser ? 'Reply' : <Lock size={10} />}
                        </button>
                        {!m.isBot && !isOwner && currentUser && (
                           <button onClick={() => handleReport(m)} className="p-2 bg-black/80 backdrop-blur-xl rounded-xl text-[10px] font-black uppercase text-slate-500 hover:text-red-500 border border-white/10">
                              <Flag size={12} />
                           </button>
                        )}
                      </div>
                    </div>
                 </div>
              </div>
            );
          })}
        </div>

        <div className="p-4 md:p-8 bg-black/40 border-t border-white/10 relative">
          {replyTo && (
            <div className="absolute bottom-full left-8 right-8 px-5 py-3 bg-blue-600/10 border-x border-t border-blue-500/30 rounded-t-[1.5rem] flex items-center justify-between animate-in slide-in-from-bottom-2 z-10">
               <span className="text-[10px] font-black text-blue-400 uppercase truncate italic">Linking Node {replyTo.user}: "{replyTo.text}"</span>
               <button onClick={() => setReplyTo(null)} className="text-slate-500 hover:text-white ml-2"><X size={16}/></button>
            </div>
          )}
          {showTagSuggestions && (
            <div className="absolute bottom-[calc(100%+8px)] left-8 w-64 bg-[#0a0a0a] border border-white/10 rounded-2xl shadow-2xl overflow-hidden animate-in fade-in slide-in-from-bottom-2 z-20">
              <div className="p-3 border-b border-white/5 bg-white/5 flex items-center justify-between">
                <span className="text-[8px] font-black text-slate-500 uppercase tracking-widest">Nodes</span>
                <AtSign size={10} className="text-blue-500" />
              </div>
              <div className="max-h-48 overflow-y-auto custom-scrollbar">
                {filteredTags.map(user => (
                  <button key={user} onClick={() => selectTagSuggestion(user)} className="w-full text-left px-4 py-2.5 text-xs text-slate-300 hover:bg-blue-600 hover:text-white transition-colors">
                    <span className="font-bold">@{user}</span>
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
                placeholder={currentUser ? `Tag with @...` : "Handshake required for tagging."}
                className="w-full bg-white/5 border border-white/10 rounded-[1.5rem] px-6 py-4.5 text-sm focus:outline-none focus:border-blue-500/50"
              />
              <div className="absolute right-4 top-1/2 -translate-y-1/2 flex items-center gap-3">
                 {currentUser && (
                   <div className="flex items-center gap-1.5 px-2 py-1 bg-amber-500/10 border border-amber-500/20 rounded-lg">
                      <Coins size={14} className="text-amber-500" />
                      <span className="text-[10px] font-black text-amber-500">{replyTo ? '15' : '10'}</span>
                   </div>
                 )}
              </div>
            </div>
            <button onClick={handleSend} disabled={!input.trim()} className="w-16 bg-blue-600 rounded-[1.5rem] text-white hover:bg-blue-500 transition-all flex items-center justify-center">
              <Send size={24} />
            </button>
          </div>
          <div className="flex items-center justify-between px-2 mt-4 text-[9px] font-black uppercase text-slate-500">
             <div className="flex gap-6">
                <span>Kernel Protected</span>
                <span>E2E Encryption</span>
             </div>
             {!currentUser && <span className="text-amber-500"><Lock size={10} className="inline mr-1" /> Handshake Required</span>}
          </div>
        </div>
      </div>
    </div>
  );
};
