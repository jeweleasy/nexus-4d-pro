
import React, { useState, useEffect, useMemo } from 'react';
import { 
  Newspaper, 
  Calendar, 
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
  Send,
  Globe,
  BookOpen,
  Link2
} from 'lucide-react';
import { predictionService } from '../services/geminiService';
import { MOCK_NEWS } from '../constants';
import { LotteryNews } from '../types';
import { ShadowButton } from './ShadowButton';

interface NewsSectionProps {
  isLoggedIn?: boolean;
  onGuestAttempt?: () => void;
}

const NewsSkeleton = () => (
  <div className="glass rounded-[2.5rem] overflow-hidden border border-white/5 flex flex-col h-full animate-pulse">
    <div className="relative h-64 w-full bg-white/5 overflow-hidden">
      <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/5 to-transparent animate-[shimmer_2s_infinite]" style={{ backgroundSize: '200% 100%' }} />
    </div>
    <div className="p-8 space-y-4 flex-1">
      <div className="h-3 w-24 bg-white/5 rounded-full" />
      <div className="h-8 w-full bg-white/5 rounded-xl" />
      <div className="space-y-2 pt-4">
        <div className="h-3 w-full bg-white/5 rounded-full" />
        <div className="h-3 w-full bg-white/5 rounded-full" />
      </div>
      <div className="pt-6 mt-auto">
        <div className="h-10 w-32 bg-white/5 rounded-xl" />
      </div>
    </div>
  </div>
);

export const NewsSection: React.FC<NewsSectionProps> = ({ isLoggedIn = false, onGuestAttempt }) => {
  const [loading, setLoading] = useState(false);
  const [news, setNews] = useState<LotteryNews[]>(MOCK_NEWS.map(n => ({ ...n, imagePrompt: `Abstract high-quality editorial visual for news about ${n.headline} in ${n.paperName}` })));
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
        item.summary.toLowerCase().includes(q) ||
        item.paperName.toLowerCase().includes(q)
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

  const handleShare = (e: React.MouseEvent, item: LotteryNews) => {
    e.stopPropagation();
    if (!isLoggedIn && onGuestAttempt) {
      onGuestAttempt();
      return;
    }
    setShareItem(item);
  };

  const copyLink = () => {
    if (!shareItem) return;
    navigator.clipboard.writeText(shareItem.sourceLink || `${window.location.origin}/news/${shareItem.id}`);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const socialShare = (platform: 'fb' | 'tw' | 'tg') => {
    if (!shareItem) return;
    const url = encodeURIComponent(shareItem.sourceLink || `${window.location.origin}/news/${shareItem.id}`);
    const text = encodeURIComponent(shareItem.headline);
    const links = {
      fb: `https://www.facebook.com/sharer/sharer.php?u=${url}`,
      tw: `https://twitter.com/intent/tweet?text=${text}&url=${url}`,
      tg: `https://t.me/share/url?url=${url}&text=${text}`
    };
    window.open(links[platform], '_blank', 'width=600,height=400');
  };

  return (
    <div className="space-y-12 animate-in fade-in slide-in-from-bottom-6 duration-700">
      {/* Newspaper Detail Modal */}
      {selectedNews && (
        <div className="fixed inset-0 z-[160] flex items-center justify-center p-4">
          <div className="absolute inset-0 bg-black/95 backdrop-blur-2xl animate-in fade-in duration-300" onClick={() => setSelectedNews(null)} />
          <div className="relative w-full max-w-4xl glass rounded-[3rem] border border-white/10 overflow-hidden shadow-2xl animate-in zoom-in slide-in-from-bottom-8 duration-500 max-h-[95vh] flex flex-col">
            <div className="relative h-80 md:h-96 shrink-0">
               {selectedNews.imageUrl ? (
                 <img src={selectedNews.imageUrl} className="w-full h-full object-cover" alt={selectedNews.headline} />
               ) : (
                 <div className="w-full h-full bg-[#0a0a0a] flex items-center justify-center">
                    <Loader2 size={48} className="text-blue-500 animate-spin" />
                 </div>
               )}
               <div className="absolute inset-0 bg-gradient-to-t from-[#050505] via-[#050505]/20 to-transparent" />
               <button onClick={() => setSelectedNews(null)} className="absolute top-8 right-8 p-3 rounded-full glass border border-white/20 text-white hover:bg-white/20 transition-all z-20">
                  <X size={24} />
               </button>
               <div className="absolute bottom-8 left-12 flex items-center gap-4">
                 <div className="px-5 py-2 rounded-full text-[10px] font-black uppercase tracking-[0.2em] bg-blue-600 text-white shadow-xl shadow-blue-500/20">
                   {selectedNews.paperName}
                 </div>
                 <span className="text-white/40 font-orbitron font-bold text-xs uppercase tracking-widest">Digital Index #{selectedNews.id.slice(-4)}</span>
               </div>
            </div>
            
            <div className="p-12 md:p-16 space-y-8 overflow-y-auto custom-scrollbar flex-1 bg-[#050505]">
              <div className="flex items-center gap-4 text-slate-500 text-[10px] font-black uppercase tracking-[0.3em]">
                <Calendar size={14} className="text-blue-500" />
                <span>{selectedNews.date}</span>
                <span className="w-1.5 h-1.5 rounded-full bg-slate-800"></span>
                <span className="text-blue-400">{selectedNews.category} Exclusive</span>
              </div>
              
              <h2 className="text-4xl md:text-5xl font-orbitron font-bold text-white leading-[1.2] tracking-tight">
                {selectedNews.headline}
              </h2>
              
              <div className="flex gap-2">
                 <div className="h-1.5 w-16 bg-blue-600 rounded-full"></div>
                 <div className="h-1.5 w-4 bg-blue-600/30 rounded-full"></div>
              </div>
              
              <p className="text-slate-300 text-xl leading-[1.8] font-medium selection:bg-blue-500/30 selection:text-white">
                {selectedNews.summary}
              </p>
              
              <div className="pt-12 border-t border-white/10 flex flex-wrap items-center justify-between gap-6">
                 <div className="flex flex-col gap-1">
                    <p className="text-[9px] font-black text-slate-500 uppercase tracking-[0.3em] mb-1">ORIGINAL SOURCE LEDGER</p>
                    <div className="flex items-center gap-3">
                       <span className="text-[10px] font-bold text-slate-300">{selectedNews.paperName}</span>
                       <span className="text-slate-600">/</span>
                       <span className="text-[10px] font-bold text-slate-300">Page {selectedNews.pageNumber}</span>
                       <a href={selectedNews.sourceLink} target="_blank" rel="noreferrer" className="ml-4 text-blue-500 hover:text-blue-400 flex items-center gap-1.5 text-[10px] font-black uppercase tracking-widest">
                          <ExternalLink size={12} /> Digital Vault
                       </a>
                    </div>
                 </div>
                 <div className="flex items-center gap-3 px-5 py-2.5 rounded-2xl bg-white/5 border border-white/5">
                    <Globe size={16} className="text-slate-500" />
                    <span className="text-[10px] font-black text-slate-500 uppercase tracking-widest">MALAYSIAN NATIONAL ARCHIVE</span>
                 </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Sharing Fallback */}
      {shareItem && (
        <div className="fixed inset-0 z-[170] flex items-center justify-center p-4">
          <div className="absolute inset-0 bg-black/80 backdrop-blur-sm" onClick={() => setShareItem(null)} />
          <div className="relative w-full max-w-sm glass rounded-[2.5rem] p-10 border border-white/10 shadow-3xl animate-in zoom-in duration-300">
             <div className="flex justify-between items-center mb-8">
                <h3 className="font-orbitron font-bold text-sm tracking-[0.2em] text-blue-500">RELAY INTELLIGENCE</h3>
                <button onClick={() => setShareItem(null)} className="p-1 hover:bg-white/5 rounded-full text-slate-500"><X size={20} /></button>
             </div>
             <div className="space-y-6">
                <div className="grid grid-cols-3 gap-3">
                   {[
                     { id: 'fb' as const, icon: Facebook, label: 'FB' },
                     { id: 'tw' as const, icon: Twitter, label: 'X' },
                     { id: 'tg' as const, icon: Send, label: 'TG' }
                   ].map(plat => (
                     <button key={plat.id} onClick={() => socialShare(plat.id)} className="p-5 rounded-2xl bg-white/5 border border-white/10 flex flex-col items-center gap-3 hover:bg-blue-600/10 hover:border-blue-500/30 transition-all group">
                        <plat.icon className="text-slate-500 group-hover:text-blue-500 group-hover:scale-110 transition-all" size={28} />
                        <span className="text-[8px] font-black uppercase text-slate-600 group-hover:text-slate-300 tracking-widest">{plat.label}</span>
                     </button>
                   ))}
                </div>
                <div className="relative group">
                   <input readOnly value={shareItem.sourceLink || `${window.location.origin}/news/${shareItem.id}`} className="w-full bg-black border border-white/10 rounded-xl py-4 px-5 text-[10px] text-slate-500 pr-14 focus:outline-none" />
                   <button onClick={copyLink} className="absolute right-3 top-1/2 -translate-y-1/2 p-2.5 text-blue-500 hover:bg-blue-500/10 rounded-lg transition-all">
                      {copied ? <Check size={18} /> : <Copy size={18} />}
                   </button>
                </div>
             </div>
          </div>
        </div>
      )}

      {/* Header Controls */}
      <div className="flex flex-col xl:flex-row justify-between items-start xl:items-center gap-8">
        <div>
          <h2 className="text-4xl font-orbitron font-bold flex items-center gap-4 text-white">
            <div className="nexus-line h-10 w-1 bg-blue-600 shadow-[0_0_15px_rgba(59,130,246,0.8)]"></div>
            Intelligence Matrix
          </h2>
          <p className="text-slate-500 text-sm mt-2 font-medium tracking-wide">Syncing archives from Malaysia's primary national news desks.</p>
        </div>
        
        <div className="flex flex-wrap items-center gap-6 w-full xl:w-auto">
          <div className="relative flex-1 min-w-[250px] xl:max-w-md group">
            <input 
              type="text" 
              placeholder="Search source (e.g. 'The Star', 'NST')..." 
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full bg-black/60 border border-white/10 rounded-2xl px-12 py-4 text-xs font-medium focus:outline-none focus:border-blue-500/50 group-hover:border-white/20 transition-all text-white placeholder:text-slate-700"
            />
            <Search size={18} className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-600 group-hover:text-blue-500 transition-colors" />
          </div>

          <div className="flex items-center gap-2 glass p-2 rounded-2xl border border-white/10">
            {categories.map((cat) => (
              <button
                key={cat}
                onClick={() => setActiveFilter(cat)}
                className={`px-5 py-2 rounded-xl text-[10px] font-black uppercase tracking-[0.2em] transition-all ${
                  activeFilter === cat 
                    ? 'bg-blue-600 text-white shadow-xl shadow-blue-500/30 border border-blue-400' 
                    : 'text-slate-500 hover:text-slate-300 hover:bg-white/5'
                }`}
              >
                {cat}
              </button>
            ))}
          </div>
          
          <ShadowButton 
            onClick={fetchNews}
            disabled={loading}
            className="flex items-center gap-3 px-8 py-4 text-xs font-black uppercase tracking-[0.2em]"
          >
            {loading ? <RefreshCw size={18} className="animate-spin" /> : <RefreshCw size={18} />}
            {loading ? 'CALIBRATING...' : 'FORCE SYNC'}
          </ShadowButton>
        </div>
      </div>

      {/* News Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-10">
        {loading ? (
          Array(4).fill(0).map((_, i) => <NewsSkeleton key={i} />)
        ) : filteredNews.length > 0 ? filteredNews.map((item) => (
          <div key={item.id} className="glass rounded-[3rem] overflow-hidden relative group hover:border-blue-500/30 transition-all duration-700 border border-white/5 flex flex-col h-full shadow-2xl">
            <div className="relative h-72 w-full bg-[#0a0a0a] overflow-hidden">
              {item.imageUrl ? (
                <img 
                  src={item.imageUrl} 
                  alt={item.headline} 
                  className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-[2000ms] animate-in fade-in duration-1000"
                />
              ) : (
                <div className="w-full h-full flex flex-col items-center justify-center space-y-4">
                  <div className="absolute inset-0 bg-gradient-to-r from-transparent via-blue-500/5 to-transparent animate-[shimmer_3s_infinite] pointer-events-none" 
                       style={{ backgroundSize: '200% 100%' }} />
                  <div className={`transition-all duration-1000 ${generatingId === item.id ? 'animate-pulse scale-110' : 'opacity-20 scale-90'}`}>
                    <div className="p-6 rounded-[2.5rem] bg-blue-500/10 border border-blue-500/20 shadow-2xl">
                        {generatingId === item.id ? <Loader2 size={48} className="text-blue-500 animate-spin" /> : <ImageIcon size={48} className="text-slate-600" />}
                    </div>
                  </div>
                  <div className="text-center px-10 relative z-10">
                    <p className={`text-[10px] font-black uppercase tracking-[0.4em] mb-4 ${generatingId === item.id ? 'text-blue-500' : 'text-slate-700'}`}>
                      {generatingId === item.id ? 'Establishing Visual Link...' : 'Archival Visual Required'}
                    </p>
                    {generatingId !== item.id && (
                      <button 
                        onClick={(e) => { e.stopPropagation(); handleGenerateImage(item.id, item.headline); }}
                        className="px-6 py-2.5 rounded-full glass border border-white/10 text-slate-500 hover:text-white hover:border-blue-500/50 transition-all text-[10px] font-black uppercase tracking-widest"
                      >
                        <Sparkles size={14} className="inline mr-2" /> REPRODUCE
                      </button>
                    )}
                  </div>
                </div>
              )}
              <div className="absolute inset-0 bg-gradient-to-t from-[#050505] via-[#050505]/40 to-transparent pointer-events-none" />
              
              <div className="absolute top-8 left-8 flex gap-3">
                <span className={`px-5 py-2 rounded-full text-[10px] font-black uppercase tracking-[0.2em] shadow-2xl backdrop-blur-3xl border ${
                  item.category === 'Jackpot' ? 'bg-amber-500/20 text-amber-500 border-amber-500/20' :
                  item.category === 'Regulatory' ? 'bg-red-500/20 text-red-500 border-red-500/20' :
                  'bg-blue-500/20 text-blue-500 border-blue-500/20'
                }`}>
                  {item.category}
                </span>
              </div>
              
              <div className="absolute top-8 right-8 opacity-0 group-hover:opacity-100 transition-all translate-x-4 group-hover:translate-x-0">
                <button 
                  onClick={(e) => handleShare(e, item)}
                  className="p-4 rounded-2xl glass border border-white/10 text-white hover:bg-blue-600/50 hover:border-blue-500 transition-all shadow-3xl"
                >
                   <Share2 size={20} />
                </button>
              </div>
            </div>

            <div className="p-10 md:p-12 space-y-6 flex-1 bg-gradient-to-b from-[#050505]/50 to-[#050505] flex flex-col">
              <div className="flex items-center gap-3 text-slate-600 text-[10px] font-black uppercase tracking-[0.3em]">
                <Calendar size={14} className="text-blue-500/50" />
                <span>{item.date}</span>
                <span className="opacity-20 font-light">|</span>
                <span className="text-slate-500">Official Report</span>
              </div>
              
              <h3 className="text-2xl md:text-3xl font-orbitron font-bold text-white leading-[1.3] group-hover:text-blue-400 transition-colors duration-500 tracking-tight line-clamp-2">
                {item.headline}
              </h3>
              
              <div className="relative">
                <p className="text-slate-500 text-base leading-[1.8] font-medium line-clamp-3">
                  {item.summary}
                </p>
                <div className="absolute bottom-0 left-0 right-0 h-10 bg-gradient-to-t from-[#050505] to-transparent pointer-events-none" />
              </div>
              
              <div className="pt-8 mt-auto flex flex-col gap-6">
                 <div className="flex justify-between items-center">
                    <button 
                      onClick={() => setSelectedNews(item)}
                      className="flex items-center gap-3 text-blue-500 hover:text-white transition-all font-black uppercase text-[10px] tracking-[0.3em] group/btn"
                    >
                      READ FULL REPORT <ChevronRight size={16} className="group-hover/btn:translate-x-2 transition-transform" />
                    </button>
                    <div className="flex items-center gap-2.5 px-4 py-2 rounded-xl bg-blue-500/5 border border-blue-500/10 text-[9px] font-black text-blue-500/60 uppercase tracking-[0.2em]">
                        <BookOpen size={12} />
                        <span>VERIFIED RECORD</span>
                    </div>
                 </div>

                 {/* Small Size Reference Text (Name, Page, Link) */}
                 <div className="pt-4 border-t border-white/5 flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-[8px] font-black text-slate-600 uppercase tracking-[0.4em]">
                    <div className="flex items-center gap-3">
                       <span className="text-slate-400">{item.paperName}</span>
                       <span className="opacity-30">|</span>
                       <span>Pg. {item.pageNumber}</span>
                       <span className="opacity-30">|</span>
                       <a href={item.sourceLink} target="_blank" rel="noreferrer" className="flex items-center gap-1 text-blue-500/60 hover:text-blue-500 transition-colors">
                          <Link2 size={10} /> nexus.link/{item.id.slice(-5)}
                       </a>
                    </div>
                    <button onClick={(e) => handleShare(e, item)} className="hover:text-blue-500 transition-colors flex items-center gap-1 self-start sm:self-auto">
                       <Share2 size={10} /> BROADCAST LINK
                    </button>
                 </div>
              </div>
            </div>
          </div>
        )) : (
          <div className="col-span-full py-40 text-center glass rounded-[3rem] border-2 border-dashed border-white/5">
             <div className="w-20 h-20 rounded-full bg-white/5 flex items-center justify-center mx-auto mb-6">
                <Filter className="text-slate-800" size={40} />
             </div>
             <h4 className="text-2xl font-orbitron font-bold text-slate-600 uppercase tracking-widest">No Intelligence Matching Query</h4>
             <p className="text-slate-700 text-sm mt-2 max-w-sm mx-auto">Adjust your filters or verify the node connection.</p>
          </div>
        )}
      </div>

      <style>{`
        @keyframes shimmer {
          0% { transform: translateX(-100%); }
          100% { transform: translateX(100%); }
        }
        .line-clamp-2 {
          display: -webkit-box;
          -webkit-line-clamp: 2;
          -webkit-box-orient: vertical;  
          overflow: hidden;
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
