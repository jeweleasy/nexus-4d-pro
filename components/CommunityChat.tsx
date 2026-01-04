
import React, { useState, useEffect, useRef, useMemo } from 'react';
import { 
  MessageCircle, Send, User, ShieldCheck, Sparkles, Hash, Users, 
  Activity, TrendingUp, Info, Search, Crown, Lock, Link as LinkIcon,
  Clock, Calendar, MessageSquare, Mic, ShieldAlert, Bot, AtSign,
  Phone, Coins, Volume2, Headset, X, Check, Filter, AlertCircle, Trash2, Flag,
  CornerDownRight, History
} from 'lucide-react';
import { predictionService } from '../services/geminiService';
import { User as NexusUser } from '../types';

interface CommunityChatProps {
  isPremium?: boolean;
  currentUser: NexusUser | null;
  onUpdateUser: (updatedUser: NexusUser) => void;
  onGuestAttempt?: () => void;
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

export const CommunityChat: React.FC<CommunityChatProps> = ({ isPremium = false, currentUser, onUpdateUser, onGuestAttempt }) => {
  const [activeChannel, setActiveChannel] = useState('general-market');
  const [searchQuery, setSearchQuery] = useState('');
  const [input, setInput] = useState('');
  const [replyTo, setReplyTo] = useState<Message | null>(null);
  const [showTagSuggestions, setShowTagSuggestions] = useState(false);
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

  const filteredMessages = useMemo(() => {
    if (!searchQuery.trim()) return messages;
    return messages.filter(m => 
      m.text.toLowerCase().includes(searchQuery.toLowerCase()) || 
      m.user.toLowerCase().includes(searchQuery.toLowerCase())
    );
  }, [messages, searchQuery]);

  const handleSend = () => {
    if (!currentUser) {
      if (onGuestAttempt) onGuestAttempt();
      return;
    }
    
    if (!input.trim()) return;
    
    const cost = replyTo ? 15 : 10;
    if (currentUser.points < cost) {
      alert(`Insufficient Points: Required ${cost} Pts for this handshake.`);
      return;
    }
    onUpdateUser({ ...currentUser, points: currentUser.points - cost });

    const newMessage: Message = {
      id: 'msg-' + Date.now(),
      user: currentUser.nexusId,
      text: input,
      time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      date: new Date().toISOString().split('T')[0],
      avatarId: currentUser.avatarId,
      isPro: isPremium,
      isRegistered: true,
      replyToId: replyTo?.id
    };

    setMessages(prev => [...prev, newMessage]);
    setInput('');
    setReplyTo(null);
  };

  const handleReplyClick = (m: Message) => {
    if (!currentUser) {
      if (onGuestAttempt) onGuestAttempt();
      return;
    }
    setReplyTo(m);
    inputRef.current?.focus();
  };

  const selectTagSuggestion = (user: string) => {
    const words = input.split(' ');
    words.pop();
    setInput(words.join(' ') + (words.length > 0 ? ' ' : '') + '@' + user + ' ');
    setShowTagSuggestions(false);
    inputRef.current?.focus();
  };

  return (
    <div className="flex flex-col lg:flex-row gap-6 h-[calc(100vh-12rem)] animate-in fade-in slide-in-from-bottom-6 duration-700">
      <aside className="w-full lg:w-72 flex flex-col gap-6 shrink-0">
        <div className="glass p-6 rounded-[2rem] border border-white/5 space-y-4">
           <div className="flex justify-between items-center mb-2">
              <h3 className="text-[10px] font-black uppercase tracking-[0.3em] text-slate-500">Archival Search</h3>
              <History size={12} className="text-slate-600" />
           </div>
           <div className="relative group">
              <input 
                type="text" 
                placeholder="Search 7-day cache..." 
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full bg-black/40 border border-white/10 rounded-2xl px-10 py-3 text-xs focus:outline-none focus:border-blue-500/50"
              />
              <Search size={16} className={`absolute left-3.5 top-1/2 -translate-y-1/2 ${searchQuery ? 'text-blue-500' : 'text-slate-600'}`} />
              {searchQuery && (
                <button onClick={() => setSearchQuery('')} className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-500 hover:text-white">
                  <X size={14} />
                </button>
              )}
           </div>
           {searchQuery && (
             <p className="text-[9px] text-blue-400 font-bold animate-pulse">Filtering signals: {filteredMessages.length} matches found</p>
           )}
        </div>

        <div className="glass p-5 rounded-[2rem] border border-white/5 space-y-2 flex-1 overflow-y-auto custom-scrollbar">
           <h3 className="text-[10px] font-black uppercase tracking-[0.3em] text-slate-500 px-2 mb-4">Clusters</h3>
           {['General Market', 'Magnum 4D', 'Sports Toto', 'Elite Predictors'].map((chan) => (
             <button 
               key={chan}
               onClick={() => setActiveChannel(chan.toLowerCase().replace(' ', '-'))}
               className={`w-full flex items-center gap-3 p-3 rounded-xl transition-all ${
                 activeChannel === chan.toLowerCase().replace(' ', '-') ? 'bg-blue-600/10 border border-blue-500/20 text-blue-400' : 'text-slate-500 hover:text-slate-300 hover:bg-white/5'
               }`}
             >
               <Hash size={14} />
               <span className="text-xs font-bold">{chan}</span>
             </button>
           ))}
        </div>
      </aside>

      <div className="flex-1 flex flex-col glass rounded-[2.5rem] border border-white/10 overflow-hidden relative shadow-2xl">
        <div className="px-6 py-4 border-b border-white/5 bg-white/5 flex items-center justify-between">
          <div className="flex items-center gap-4">
             <div className="p-2.5 bg-blue-600/10 rounded-xl text-blue-500">
                <MessageSquare size={18} />
             </div>
             <div>
                <h2 className="font-orbitron font-bold text-sm uppercase">#{activeChannel}</h2>
                <p className="text-[8px] font-black text-slate-500 uppercase tracking-widest">Global Intelligence Relay</p>
             </div>
          </div>
        </div>

        <div ref={scrollRef} className="flex-1 overflow-y-auto p-6 space-y-6 custom-scrollbar">
          {filteredMessages.map((m) => {
            const isOwner = m.user === currentUser?.nexusId;
            const parentMsg = m.replyToId ? messages.find(msg => msg.id === m.replyToId) : null;
            return (
              <div key={m.id} className={`flex gap-4 group ${isOwner ? 'flex-row-reverse' : ''}`}>
                 <img src={m.isBot ? `https://api.dicebear.com/7.x/bottts/svg?seed=nexus` : `https://api.dicebear.com/7.x/avataaars/svg?seed=user${m.avatarId}`} className="w-10 h-10 rounded-xl border border-white/10 shadow-lg bg-white/5 shrink-0" alt={m.user} />
                 <div className={`flex flex-col gap-1.5 max-w-[80%] ${isOwner ? 'items-end' : ''}`}>
                    <div className="flex items-center gap-2">
                      <span className={`text-[10px] font-black uppercase tracking-widest ${m.isBot ? 'text-blue-400' : m.isRegistered ? 'text-slate-300' : 'text-slate-500 italic'}`}>{m.user}</span>
                      <span className="text-[8px] text-slate-700 font-bold">{m.time}</span>
                    </div>

                    {parentMsg && (
                      <div className="text-[9px] text-slate-500 bg-white/5 px-3 py-1.5 rounded-xl border-l-2 border-blue-500/40 italic flex items-center gap-2 max-w-full truncate">
                        <CornerDownRight size={10} />
                        Replying to @{parentMsg.user}: "{parentMsg.text.substring(0, 20)}..."
                      </div>
                    )}

                    <div className={`px-4 py-3 rounded-2xl text-xs leading-relaxed shadow-sm group-hover:border-white/20 border border-transparent transition-all ${
                      isOwner ? 'bg-blue-600 text-white rounded-tr-none' : m.isBot ? 'bg-blue-900/20 text-blue-100 rounded-tl-none' : 'bg-white/5 text-slate-300 rounded-tl-none'
                    }`}>
                      {m.text.split(' ').map((word, i) => (
                        word.startsWith('@') ? <span key={i} className="text-amber-400 font-black">{word} </span> : word + ' '
                      ))}
                    </div>

                    <div className="opacity-0 group-hover:opacity-100 transition-opacity flex gap-3">
                       <button onClick={() => handleReplyClick(m)} className="text-[8px] font-black uppercase text-blue-500 hover:underline">Reply (15 Pts)</button>
                       {!isOwner && <button className="text-[8px] font-black uppercase text-red-500/50 hover:text-red-500">Report</button>}
                    </div>
                 </div>
              </div>
            );
          })}
        </div>

        <div className="p-4 bg-black/40 border-t border-white/10 relative">
          {replyTo && (
            <div className="absolute bottom-full left-4 right-4 px-4 py-2 bg-blue-600/10 border-t border-x border-blue-500/30 rounded-t-2xl flex items-center justify-between animate-in slide-in-from-bottom-2">
               <span className="text-[9px] font-black text-blue-400 uppercase italic">Replying to node {replyTo.user}</span>
               <button onClick={() => setReplyTo(null)} className="text-slate-500 hover:text-white"><X size={12}/></button>
            </div>
          )}

          {showTagSuggestions && (
            <div className="absolute bottom-[calc(100%+8px)] left-4 w-56 bg-slate-900 border border-white/10 rounded-xl shadow-2xl overflow-hidden animate-in fade-in slide-in-from-bottom-2 z-20">
              <div className="p-2 border-b border-white/5 bg-white/5 text-[8px] font-black text-slate-500 uppercase">Available Nodes</div>
              <div className="max-h-40 overflow-y-auto">
                {filteredTags.map(user => (
                  <button key={user} onClick={() => selectTagSuggestion(user)} className="w-full text-left px-4 py-2 text-xs text-slate-300 hover:bg-blue-600 hover:text-white transition-colors">@{user}</button>
                ))}
              </div>
            </div>
          )}

          <div className="flex gap-3">
            <div className="flex-1 relative">
              <input 
                ref={inputRef}
                type="text" 
                value={input}
                onChange={(e) => setInput(e.target.value)}
                onKeyDown={(e) => e.key === 'Enter' && handleSend()}
                placeholder={currentUser ? `Tag with @ or share patterns...` : "Handshake required for interactions."}
                className="w-full bg-white/5 border border-white/10 rounded-2xl px-5 py-3.5 text-xs focus:outline-none focus:border-blue-500/50 transition-all"
              />
              {currentUser && (
                <div className="absolute right-3 top-1/2 -translate-y-1/2 flex items-center gap-1.5 px-2 py-0.5 bg-amber-500/10 border border-amber-500/20 rounded-lg">
                   <Coins size={10} className="text-amber-500" />
                   <span className="text-[9px] font-black text-amber-500">{replyTo ? '15' : '10'}</span>
                </div>
              )}
            </div>
            <button 
              onClick={handleSend} 
              disabled={!input.trim() && currentUser !== null} 
              className={`w-12 h-12 rounded-2xl text-white transition-all flex items-center justify-center shadow-lg active:scale-95 ${(!input.trim() && currentUser !== null) ? 'bg-slate-800' : 'bg-blue-600 hover:bg-blue-500'}`}
            >
              <Send size={18} />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
