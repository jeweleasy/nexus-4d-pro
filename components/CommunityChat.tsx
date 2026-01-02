
import React, { useState, useEffect } from 'react';
import { MessageCircle, Send, User, ShieldCheck, Sparkles } from 'lucide-react';

interface Message {
  id: string;
  user: string;
  text: string;
  time: string;
  isPro?: boolean;
}

export const CommunityChat: React.FC = () => {
  const [messages, setMessages] = useState<Message[]>([
    { id: '1', user: 'Lucky_Strike', text: 'Magnum 84xx looks strong for tonight.', time: '14:30', isPro: true },
    { id: '2', user: 'TotoMaster', text: 'Anyone tracking the 1102 cluster?', time: '14:32' },
  ]);
  const [input, setInput] = useState('');

  const handleSend = () => {
    if (!input.trim()) return;
    const newMessage = {
      id: Date.now().toString(),
      user: 'You',
      text: input,
      time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
    };
    setMessages([...messages, newMessage]);
    setInput('');
  };

  return (
    <div className="glass rounded-[2rem] border border-white/10 overflow-hidden flex flex-col h-[500px]">
      <div className="p-5 border-b border-white/5 bg-white/5 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <MessageCircle className="text-blue-400" size={20} />
          <h3 className="font-orbitron font-bold text-sm tracking-wider">NEXUS COMMUNITY</h3>
        </div>
        <div className="flex items-center gap-2">
          <span className="w-2 h-2 rounded-full bg-green-500 animate-pulse"></span>
          <span className="text-[10px] font-black uppercase text-slate-500">1,248 Online</span>
        </div>
      </div>

      <div className="flex-1 overflow-y-auto p-4 space-y-4 scroll-smooth">
        {messages.map((m) => (
          <div key={m.id} className={`flex flex-col ${m.user === 'You' ? 'items-end' : 'items-start'}`}>
            <div className="flex items-center gap-2 mb-1">
              {m.isPro && <ShieldCheck size={12} className="text-blue-500" />}
              <span className="text-[10px] font-black text-slate-500 uppercase">{m.user}</span>
              <span className="text-[8px] text-slate-600">{m.time}</span>
            </div>
            <div className={`max-w-[85%] px-4 py-2 rounded-2xl text-xs leading-relaxed ${
              m.user === 'You' ? 'bg-blue-600 text-white rounded-tr-none' : 'bg-white/5 text-slate-300 rounded-tl-none border border-white/5'
            }`}>
              {m.text}
            </div>
          </div>
        ))}
      </div>

      <div className="p-4 bg-black/20 border-t border-white/5 flex gap-2">
        <input 
          type="text" 
          value={input}
          onChange={(e) => setInput(e.target.value)}
          onKeyDown={(e) => e.key === 'Enter' && handleSend()}
          placeholder="Share your strategy..."
          className="flex-1 bg-white/5 border border-white/10 rounded-xl px-4 py-2 text-xs focus:outline-none focus:border-blue-500/50"
        />
        <button 
          onClick={handleSend}
          className="p-2 bg-blue-600 rounded-xl text-white hover:bg-blue-500 transition-colors"
        >
          <Send size={18} />
        </button>
      </div>
      
      <div className="p-2 bg-blue-600/10 text-center">
        <p className="text-[8px] text-blue-400 font-bold uppercase flex items-center justify-center gap-1">
          <Sparkles size={8}/> AI Moderator Active: Ensuring a healthy environment
        </p>
      </div>
    </div>
  );
};
