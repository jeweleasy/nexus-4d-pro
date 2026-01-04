
import React, { useState, useEffect, useMemo } from 'react';
import { 
  Newspaper, 
  Calendar, 
  Tag, 
  RefreshCw, 
  Sparkles, 
  Image as ImageIcon, 
  Loader2, 
  Filter, 
  Search, 
  ChevronRight, 
  Share2, 
  X, 
  Check, 
  Copy, 
  Facebook, 
  Twitter, 
  ExternalLink,
  Send
} from 'lucide-react';
import { predictionService } from '../services/geminiService';
import { MOCK_NEWS } from '../constants';
import { LotteryNews } from '../types';
import { ShadowButton } from './ShadowButton';

const NewsSkeleton = () => (
  <div className="glass rounded-[2.5rem] overflow-hidden border border-white/5 flex flex-col h-full animate-pulse">
    <div className="relative h-64 w-full bg-white/5 overflow-hidden">
      <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/5 to-transparent animate-[shimmer_2s_infinite]" style={{ backgroundSize: '200% 100%' }} />
    </div>
    <div className="p-8 space-y-4 flex-1">
      <div className="h-3 w-24 bg-white/5 rounded-full" />
      <div className="h-8 w-full bg-white/5 rounded-xl" />
      <div className="h-8 w-3/4 bg-white/5 rounded-xl" />
      <div className="space-y-2 pt-4">
        <div className="h-3 w-full bg-white/5 rounded-full" />
        <div className="h-3 w-full bg-white/5 rounded-full" />
        <div className="h-3 w-1/2 bg-white/5 rounded-full" />
      </div>
      <div className="pt-6 mt-auto">
        <div className="h-10 w-32 bg-white/5 rounded-xl" />
      </div>
    </div>
  </div>
);

export const NewsSection: React.FC = () => {
  const [loading, setLoading] = useState(false);
  const [news, setNews] = useState<LotteryNews[]>(MOCK_NEWS.map(n => ({ ...n, imagePrompt: `Futuristic abstract 4D lottery pattern for ${n.category}` })));
  const [generatingId, setGeneratingId] = useState<string | null>(null);
  const [activeFilter, setActiveFilter] = useState<string>('All');
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedNews, setSelectedNews] = useState<LotteryNews | null>(null);
  const [shareItem, setShareItem] = useState<LotteryNews | null>(null);
  const [copied, setCopied] = useState(false);

  const categories = ['All', 'Jackpot', 'Market', 'Regulatory'];

  const filteredNews = useMemo(() => {
    let result = news;
    if (activeFilter !== 'All') {
      result = result.filter(item => item.category === activeFilter);
    }
    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase();
      result = result.filter(item => 
        item.headline.toLowerCase().includes(q) || 
        item.summary.toLowerCase().includes(q)
      );
    }
    return result;
  }, [news, activeFilter, searchQuery]);

  useEffect(() => {
    const autoGenerate = async () => {
      if (generatingId || loading) return;
      const pendingItem = news.find(n => n.imagePrompt && !n.imageUrl);
      if (pendingItem) {
        await handleGenerateImage(pendingItem.id, pendingItem.imagePrompt!);
      }
    };
    autoGenerate();
  }, [news, generatingId, loading]);

  const fetchNews = async () => {
    setLoading(true);
    await new Promise(resolve => setTimeout(resolve, 1500));
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

  const handleShare = async (e: React.MouseEvent, item: LotteryNews) => {
    e.stopPropagation();
    const shareData = {
      title: item.headline,
      text: item.summary,
      url: `${window.location.origin}/news/${item.id}`,
    };

    if (navigator.share && navigator.canShare && navigator.canShare(shareData)) {
      try {
        await navigator.share(shareData);
      } catch (err) {
        console.debug('Native share cancelled or failed', err);
        setShareItem(item);
      }
    } else {
      setShareItem(item);
    }
  };

  const copyLink = () => {
    if (!shareItem) return;
    navigator.clipboard.writeText(`${window.location.origin}/news/${shareItem.id}`);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const socialShare = (platform: 'fb' | 'tw' | 'tg') => {
    if (!shareItem) return;
    const url = encodeURIComponent(`${window.location.origin}/news/${shareItem.id}`);
    const text = encodeURIComponent(shareItem.headline);
    const links = {
      fb: `https://www.facebook.com/sharer/sharer.php?u=${url}`,
      tw: `https://twitter.com/intent/tweet?text=${text}&url=${url}`,
      tg: `https://t.me/share/url?url=${url}&text=${text}`
    };
    window.open(links[platform], '_blank', 'width=600,height=400');
  };

  return (
    <div className="space-y-8 animate-in fade-in slide-in-from-bottom-6 duration-700">
      {/* Detail Modal */}
      {selectedNews && (
        <div className="fixed inset-0 z-[160] flex items-center justify-center p-4">
          <div className="absolute inset-0 bg-black/90 backdrop-blur-xl animate-in fade-in duration-300" onClick={() => setSelectedNews(null)} />
          <div className="relative w-full max-w-3xl glass rounded-[3rem] border border-white/10 overflow-hidden shadow-2xl animate-in zoom-in slide-in-from-bottom-8 duration-500 max-h-[90vh] flex flex-col">
            <div className="relative h-72 shrink-0">
               {selectedNews.imageUrl ? (
                 <img src={selectedNews.imageUrl} className="w-full h-full object-cover" alt={selectedNews.headline} />
               ) : (
                 <div className="w-full h-full bg-slate-900 flex items-center justify-center">
                    <ImageIcon size={48} className="text-slate-700" />
                 </div>
               )}
               <div className="absolute inset-0 bg-gradient-to-t from-[#050505] to-transparent" />
               <button onClick={() => setSelectedNews(null)} className="absolute top-6 right-6 p-2 rounded-full glass border border-white/10 text-white hover:bg-white/20 transition-all">
                  <X size={24} />
               </button>
               <div className="absolute bottom-6 left-10">
                 <span className="px-4 py-1.5 rounded-full text-[10px] font-black uppercase tracking-widest bg-blue-600 text-white border border-blue-500/20">
                   {selectedNews.category}
                 </span>
               </div>
            </div>
            <div className="p-10 md:p-12 space-y-6 overflow-y-auto custom-scrollbar">
              <div className="flex items-center gap-3 text-slate-500 text-[10px] font-black uppercase tracking-widest">
                <Calendar size={14} className="text-blue-500" />
                <span>{selectedNews.date}</span>
                <span className="mx-2 opacity-20">|</span>
                <span>{selectedNews.paperName}</span>
              </div>
              <h2 className="text-3xl md:text-4xl font-orbitron font-bold text-white leading-tight">
                {selectedNews.headline}
              </h2>
              <div className="h-1 w-20 bg-blue-500 rounded-full" />
              <p className="text-slate-300 text-lg leading-relaxed first-letter:text-5xl first-letter:font-bold first-letter:text-blue-500 first-letter:mr-3 first-letter:float-left">
                {selectedNews.summary}
              </p>
              <div className="pt-8 border-t border-white/5 flex flex-wrap gap-4">
                 <ShadowButton onClick={() => setSelectedNews(null)} className="px-8 py-3">
                    CLOSE REPORT
                 </ShadowButton>
                 <button onClick={(e) => handleShare(e, selectedNews)} className="p-3 rounded-xl glass border border-white/10 text-blue-400 hover:text-white transition-all flex items-center gap-2 px-6 font-bold uppercase text-[10px] tracking-widest">
                    <Share2 size={18} /> Share Intelligence
                 </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Share UI fallback */}
      {shareItem && (
        <div className="fixed inset-0 z-[170] flex items-center justify-center p-4">
          <div className="absolute inset-0 bg-black/60 backdrop-blur-sm" onClick={() => setShareItem(null)} />
          <div className="relative w-full max-w-sm glass rounded-[2.5rem] p-8 border border-white/10 shadow-3xl animate-in zoom-in duration-300">
             <div className="flex justify-between items-center mb-6">
                <h3 className="font-orbitron font-bold text-sm tracking-widest">BROADCAST REPORT</h3>
                <button onClick={() => setShareItem(null)} className="p-1 hover:bg-white/5 rounded-full text-slate-500"><X size={18} /></button>
             </div>
             <div className="space-y-4">
                <div className="grid grid-cols-3 gap-2">
                   <button onClick={() => socialShare('fb')} className="p-4 rounded-2xl bg-blue-600/10 border border-blue-500/20 flex flex-col items-center gap-2 hover:bg-blue-600/20 transition-all group">
                      <Facebook className="text-blue-500 group-hover:scale-110 transition-transform" size={24} />
                      <span className="text-[8px] font-black uppercase text-slate-400">FB</span>
                   </button>
                   <button onClick={() => socialShare('tw')} className="p-4 rounded-2xl bg-blue-400/10 border border-blue-400/20 flex flex-col items-center gap-2 hover:bg-blue-400/20 transition-all group">
                      <Twitter className="text-blue-400 group-hover:scale-110 transition-transform" size={24} />
                      <span className="text-[8px] font-black uppercase text-slate-400">Twitter</span>
                   </button>
                   <button onClick={() => socialShare('tg')} className="p-4 rounded-2xl bg-blue-500/10 border border-blue-500/20 flex flex-col items-center gap-2 hover:bg-blue-500/20 transition-all group">
                      <Send className="text-blue-500 group-hover:scale-110 transition-transform" size={24} />
                      <span className="text-[8px] font-black uppercase text-slate-400">Telegram</span>
                   </button>
                </div>
                <div className="relative">
                   <input readOnly value={`${window.location.origin}/news/${shareItem.id}`} className="w-full bg-black/40 border border-white/10 rounded-xl py-4 px-4 text-xs text-slate-400 pr-12 focus:outline-none" />
                   <button onClick={copyLink} className="absolute right-2 top-1/2 -translate-y-1/2 p-2 text-blue-500 hover:text-white transition-colors">
                      {copied ? <Check size={18} /> : <Copy size={18} />}
                   </button>
                </div>
             </div>
          </div>
        </div>
      )}

      <div className="flex flex-col xl:flex-row justify-between items-start xl:items-center gap-6">
        <div>
          <h2 className="text-3xl font-orbitron font-bold flex items-center gap-3">
            <div className="nexus-line"></div>
            Industry Intelligence
          </h2>
          <p className="text-slate-400 text-sm mt-1">AI-curated reports with autonomous neural visualization</p>
        </div>
        
        <div className="flex flex-wrap items-center gap-4 w-full xl:w-auto">
          <div className="relative flex-1 min-w-[200px] xl:max-w-xs group">
            <input 
              type="text" 
              placeholder="Search reports..." 
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full bg-black/40 border border-white/10 rounded-2xl px-10 py-3 text-xs focus:outline-none focus:border-blue-500/50 group-hover:border-white/20 transition-all"
            />
            <Search size={16} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-500 group-hover:text-blue-500 transition-colors" />
          </div>

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
        {loading ? (
          Array(4).fill(0).map((_, i) => <NewsSkeleton key={i} />)
        ) : filteredNews.length > 0 ? filteredNews.map((item) => (
          <div key={item.id} className="glass rounded-[2.5rem] overflow-hidden relative group hover:border-blue-500/30 transition-all border border-white/5 flex flex-col h-full">
            <div className="relative h-64 w-full bg-slate-900/50 overflow-hidden">
              {item.imageUrl ? (
                <img 
                  src={item.imageUrl} 
                  alt={item.headline} 
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-1000 animate-in fade-in duration-1000"
                />
              ) : (
                <div className="w-full h-full flex flex-col items-center justify-center space-y-4">
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
                        onClick={(e) => { e.stopPropagation(); handleGenerateImage(item.id, item.imagePrompt || item.headline); }}
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
              </div>
              <div className="absolute top-6 right-6 opacity-0 group-hover:opacity-100 transition-all scale-90 group-hover:scale-100">
                <button 
                  onClick={(e) => handleShare(e, item)}
                  className="p-3 rounded-2xl glass border border-white/10 text-white hover:bg-blue-600/50 hover:border-blue-500 transition-all shadow-2xl flex items-center gap-2"
                >
                   <Share2 size={18} />
                </button>
              </div>
            </div>

            <div className="p-8 md:p-10 space-y-6 flex-1 bg-gradient-to-b from-transparent to-slate-900/20 flex flex-col">
              <div className="flex items-center gap-3 text-slate-500 text-[10px] font-black uppercase tracking-widest">
                <Calendar size={14} className="text-blue-500" />
                <span>{item.date}</span>
                <span className="mx-2 opacity-20">|</span>
                <span className="text-blue-400">Official Report</span>
              </div>
              <h3 className="text-2xl md:text-3xl font-orbitron font-bold text-white leading-tight group-hover:text-blue-400 transition-colors duration-500">
                {item.headline}
              </h3>
              <p className="text-slate-400 text-sm leading-relaxed border-l-2 border-blue-500/20 pl-6 line-clamp-3">
                {item.summary}
              </p>
              
              <div className="pt-6 mt-auto flex justify-between items-center">
                 <button 
                   onClick={() => setSelectedNews(item)}
                   className="flex items-center gap-2 text-blue-500 hover:text-white transition-all font-bold uppercase text-[10px] tracking-[0.2em] group/btn"
                 >
                   Read More <ChevronRight size={14} className="group-hover/btn:translate-x-1 transition-transform" />
                 </button>
                 <div className="hidden sm:flex items-center gap-2 px-3 py-1 rounded-lg bg-green-500/5 border border-green-500/10 text-[9px] font-black text-green-500 uppercase tracking-widest">
                    <Tag size={12} />
                    <span>Verified Node</span>
                 </div>
              </div>
            </div>
          </div>
        )) : (
          <div className="col-span-full py-20 text-center glass rounded-[2.5rem] border border-white/5">
             <Filter className="mx-auto text-slate-700 mb-4" size={40} />
             <p className="text-slate-500 font-bold uppercase tracking-widest">No intelligence found matching your query</p>
          </div>
        )}
      </div>

      <div className="p-10 rounded-[2.5rem] bg-gradient-to-br from-slate-900 to-black border border-white/5 flex flex-col items-center text-center space-y-6">
        <div className="w-16 h-1 bg-gradient-to-r from-transparent via-blue-500 to-transparent mb-2 opacity-50"></div>
        <div className="p-4 bg-blue-600/10 rounded-3xl border border-blue-500/20 shadow-xl shadow-blue-500/5">
          <ImageIcon size={32} className="text-blue-400" />
        </div>
        <div className="space-y-2 max-w-2xl">
           <h4 className="text-lg font-orbitron font-bold text-white">Autonomous Visualization Framework</h4>
           <p className="text-slate-400 text-sm leading-relaxed">
             Nexus Pro's Industry Intelligence module utilizes Gemini 2.5 Flash Image nodes to interpret text summaries into abstract procedural visuals.
           </p>
        </div>
      </div>

      <style>{`
        @keyframes shimmer {
          0% { transform: translateX(-100%); }
          100% { transform: translateX(100%); }
        }
        .line-clamp-3 {
          display: -webkit-box;
          -webkit-line-clamp: 3;
          -webkit-box-orient: vertical;  
          overflow: hidden;
        }
      `}</style>
    </div>
  );
};
