
import React, { useState, useEffect, useMemo } from 'react';
import { Newspaper, Calendar, Hash, Tag, RefreshCw, Sparkles, Image as ImageIcon, Loader2, Filter } from 'lucide-react';
import { predictionService } from '../services/geminiService';
import { MOCK_NEWS } from '../constants';
import { LotteryNews } from '../types';

export const NewsSection: React.FC = () => {
  const [loading, setLoading] = useState(false);
  const [news, setNews] = useState<LotteryNews[]>(MOCK_NEWS.map(n => ({ ...n, imagePrompt: `Futuristic abstract 4D lottery pattern for ${n.category}` })));
  const [generatingId, setGeneratingId] = useState<string | null>(null);
  const [activeFilter, setActiveFilter] = useState<string>('All');

  const categories = ['All', 'Jackpot', 'Market', 'Regulatory'];

  const filteredNews = useMemo(() => {
    if (activeFilter === 'All') return news;
    return news.filter(item => item.category === activeFilter);
  }, [news, activeFilter]);

  // Automatically trigger image generation for items that have a prompt but no URL, sequentially
  useEffect(() => {
    const autoGenerate = async () => {
      // If we are already generating something, wait
      if (generatingId) return;

      // Find the first news item that needs an image
      const pendingItem = news.find(n => n.imagePrompt && !n.imageUrl);
      
      if (pendingItem) {
        await handleGenerateImage(pendingItem.id, pendingItem.imagePrompt!);
      }
    };

    autoGenerate();
  }, [news, generatingId]);

  const fetchNews = async () => {
    setLoading(true);
    const result = await predictionService.getNewsAggregated();
    if (result && result.news.length > 0) {
      setNews(result.news.map((item: any, idx: number) => ({
        ...item,
        id: `gen-${idx}-${Date.now()}`
      })));
    }
    setLoading(false);
  };

  const handleGenerateImage = async (id: string, prompt: string) => {
    if (generatingId === id) return;
    setGeneratingId(id);
    try {
      const imageUrl = await predictionService.generateNewsVisual(prompt);
      if (imageUrl) {
        setNews(prev => prev.map(n => n.id === id ? { ...n, imageUrl } : n));
      }
    } catch (error) {
      console.error("Failed to generate image", error);
    } finally {
      setGeneratingId(null);
    }
  };

  return (
    <div className="space-y-8 animate-in fade-in slide-in-from-bottom-6 duration-700">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6">
        <div>
          <h2 className="text-3xl font-orbitron font-bold flex items-center gap-3">
            <div className="nexus-line"></div>
            Industry Intelligence
          </h2>
          <p className="text-slate-400 text-sm mt-1">AI-curated reports with autonomous neural visualization</p>
        </div>
        <div className="flex flex-wrap items-center gap-4">
          <div className="flex items-center gap-2 glass p-1.5 rounded-2xl border border-white/10">
            {categories.map((cat) => (
              <button
                key={cat}
                onClick={() => setActiveFilter(cat)}
                className={`px-4 py-1.5 rounded-xl text-[10px] font-black uppercase tracking-widest transition-all ${
                  activeFilter === cat 
                    ? 'bg-blue-600 text-white shadow-lg shadow-blue-500/20' 
                    : 'text-slate-500 hover:text-slate-300 hover:bg-white/5'
                }`}
              >
                {cat}
              </button>
            ))}
          </div>
          <button 
            onClick={fetchNews}
            disabled={loading}
            className="flex items-center gap-2 px-6 py-3 rounded-2xl bg-blue-600/10 border border-blue-500/20 text-blue-400 hover:bg-blue-600/20 transition-all disabled:opacity-50 font-bold uppercase tracking-widest text-xs"
          >
            <RefreshCw size={16} className={loading ? 'animate-spin' : ''} />
            {loading ? 'Scanning...' : 'Sync News'}
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {filteredNews.length > 0 ? filteredNews.map((item) => (
          <div key={item.id} className="glass rounded-[2.5rem] overflow-hidden relative group hover:border-blue-500/30 transition-all border border-white/5 flex flex-col">
            {/* AI Image Header */}
            <div className="relative h-64 w-full bg-slate-900/50 overflow-hidden">
              {item.imageUrl ? (
                <img 
                  src={item.imageUrl} 
                  alt={item.headline} 
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-1000 animate-in fade-in duration-1000"
                />
              ) : (
                <div className="w-full h-full flex flex-col items-center justify-center space-y-4">
                  {/* Shimmer Effect */}
                  <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/5 to-transparent animate-[shimmer_2s_infinite] pointer-events-none" 
                       style={{ backgroundSize: '200% 100%' }} />
                  
                  <div className={`transition-all duration-700 ${generatingId === item.id ? 'animate-pulse scale-110' : 'opacity-40'}`}>
                    <div className="p-4 rounded-3xl bg-blue-500/10 border border-blue-500/20">
                        {generatingId === item.id ? <Loader2 size={40} className="text-blue-500 animate-spin" /> : <ImageIcon size={40} className="text-slate-600" />}
                    </div>
                  </div>
                  
                  <div className="text-center px-6">
                    <p className={`text-[10px] font-black uppercase tracking-[0.2em] ${generatingId === item.id ? 'text-blue-500' : 'text-slate-600'}`}>
                      {generatingId === item.id ? 'Nexus AI: Generating Neural Visual...' : 'Visual Node Offline'}
                    </p>
                    {generatingId !== item.id && (
                      <button 
                        onClick={() => handleGenerateImage(item.id, item.imagePrompt || item.headline)}
                        className="mt-3 flex items-center gap-2 px-4 py-1.5 rounded-full bg-white/5 border border-white/10 text-slate-400 hover:text-white hover:bg-white/10 transition-all text-[10px] font-bold"
                      >
                        <Sparkles size={12} /> Force Render
                      </button>
                    )}
                  </div>
                </div>
              )}
              
              <div className="absolute inset-0 bg-gradient-to-t from-[#050505] via-transparent to-transparent pointer-events-none" />
              
              <div className="absolute top-6 left-6 flex gap-2">
                <span className={`px-4 py-1.5 rounded-full text-[10px] font-black uppercase tracking-widest shadow-2xl backdrop-blur-xl border ${
                  item.category === 'Jackpot' ? 'bg-amber-500/20 text-amber-500 border-amber-500/20' :
                  item.category === 'Regulatory' ? 'bg-red-500/20 text-red-500 border-red-500/20' :
                  'bg-blue-500/20 text-blue-500 border-blue-500/20'
                }`}>
                  {item.category}
                </span>
                {item.imageUrl && (
                  <span className="px-4 py-1.5 rounded-full text-[10px] font-black uppercase tracking-widest shadow-2xl backdrop-blur-xl bg-white/5 border border-white/10 text-slate-400 flex items-center gap-2">
                    <Sparkles size={10} className="text-amber-500" /> AI Visual
                  </span>
                )}
              </div>
            </div>

            <div className="p-8 md:p-10 space-y-6 flex-1 bg-gradient-to-b from-transparent to-slate-900/20">
              <div className="flex items-center gap-3 text-slate-500 text-[10px] font-black uppercase tracking-widest">
                <Calendar size={14} className="text-blue-500" />
                <span>{item.date}</span>
                <span className="mx-2 opacity-20">|</span>
                <span className="text-blue-400">Official Report</span>
              </div>

              <h3 className="text-2xl md:text-3xl font-orbitron font-bold text-white leading-tight group-hover:text-blue-400 transition-colors duration-500">
                {item.headline}
              </h3>

              <p className="text-slate-400 text-sm leading-relaxed border-l-2 border-blue-500/20 pl-6">
                {item.summary}
              </p>

              <div className="flex flex-wrap items-center gap-8 pt-8 border-t border-white/5 mt-auto">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-xl bg-white/5 border border-white/10 flex items-center justify-center">
                    <Newspaper size={18} className="text-blue-400" />
                  </div>
                  <div>
                    <p className="text-[9px] text-slate-500 uppercase font-black tracking-tighter">Publication</p>
                    <p className="text-xs font-bold text-slate-200">{item.paperName}</p>
                  </div>
                </div>
                
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-xl bg-white/5 border border-white/10 flex items-center justify-center">
                    <Hash size={18} className="text-blue-400" />
                  </div>
                  <div>
                    <p className="text-[9px] text-slate-500 uppercase font-black tracking-tighter">Page Ref</p>
                    <p className="text-xs font-bold text-slate-200">{item.pageNumber}</p>
                  </div>
                </div>

                <div className="ml-auto hidden sm:flex items-center gap-2 px-3 py-1 rounded-lg bg-green-500/5 border border-green-500/10 text-[9px] font-black text-green-500 uppercase tracking-widest">
                  <Tag size={12} />
                  <span>Verified Node</span>
                </div>
              </div>
            </div>
          </div>
        )) : (
          <div className="col-span-full py-20 text-center glass rounded-[2.5rem] border border-white/5">
             <Filter className="mx-auto text-slate-700 mb-4" size={40} />
             <p className="text-slate-500 font-bold">No reports found in the "{activeFilter}" category.</p>
          </div>
        )}
      </div>

      {/* Aesthetic Footer Info */}
      <div className="p-10 rounded-[2.5rem] bg-gradient-to-br from-slate-900 to-black border border-white/5 flex flex-col items-center text-center space-y-6">
        <div className="w-16 h-1 bg-gradient-to-r from-transparent via-blue-500 to-transparent mb-2 opacity-50"></div>
        <div className="p-4 bg-blue-600/10 rounded-3xl border border-blue-500/20 shadow-xl shadow-blue-500/5">
          <ImageIcon size={32} className="text-blue-400" />
        </div>
        <div className="space-y-2 max-w-2xl">
           <h4 className="text-lg font-orbitron font-bold text-white">Autonomous Visualization Framework</h4>
           <p className="text-slate-400 text-sm leading-relaxed">
             Nexus Pro's Industry Intelligence module utilizes Gemini 2.5 Flash Image nodes to interpret text summaries into abstract procedural visuals. This process is fully autonomous and adheres to strict privacy standards.
           </p>
        </div>
        <div className="flex items-center gap-6 text-[10px] font-black text-slate-600 uppercase tracking-[0.4em]">
           <span>Secured by Nexus Chain</span>
           <span className="w-1.5 h-1.5 rounded-full bg-slate-800"></span>
           <span>Neural Scan 2.4.0</span>
        </div>
      </div>

      <style>{`
        @keyframes shimmer {
          0% { transform: translateX(-100%); }
          100% { transform: translateX(100%); }
        }
      `}</style>
    </div>
  );
};
