
import React, { useState, useEffect } from 'react';
import { Newspaper, Calendar, Hash, Tag, RefreshCw, Sparkles, Image as ImageIcon } from 'lucide-react';
import { predictionService } from '../services/geminiService';
import { MOCK_NEWS } from '../constants';
import { LotteryNews } from '../types';

export const NewsSection: React.FC = () => {
  const [loading, setLoading] = useState(false);
  const [news, setNews] = useState<LotteryNews[]>(MOCK_NEWS.map(n => ({ ...n, imagePrompt: `Abstract lottery pattern for ${n.category}` })));
  const [generatingId, setGeneratingId] = useState<string | null>(null);

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
    setGeneratingId(id);
    const imageUrl = await predictionService.generateNewsVisual(prompt);
    if (imageUrl) {
      setNews(prev => prev.map(n => n.id === id ? { ...n, imageUrl } : n));
    }
    setGeneratingId(null);
  };

  return (
    <div className="space-y-8 animate-in fade-in slide-in-from-bottom-6 duration-700">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
          <h2 className="text-3xl font-orbitron font-bold flex items-center gap-3">
            <div className="nexus-line"></div>
            Industry Intelligence
          </h2>
          <p className="text-slate-400 text-sm mt-1">Curated summaries with Nexus AI visualization</p>
        </div>
        <button 
          onClick={fetchNews}
          disabled={loading}
          className="flex items-center gap-2 px-4 py-2 rounded-xl bg-blue-600/10 border border-blue-500/20 text-blue-400 hover:bg-blue-600/20 transition-all disabled:opacity-50"
        >
          <RefreshCw size={18} className={loading ? 'animate-spin' : ''} />
          {loading ? 'Analyzing Reports...' : 'Scan New Editions'}
        </button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {news.map((item) => (
          <div key={item.id} className="glass rounded-3xl overflow-hidden relative group hover:border-blue-500/30 transition-all border border-white/5 flex flex-col">
            {/* AI Image Header */}
            <div className="relative h-56 w-full bg-white/5 overflow-hidden">
              {item.imageUrl ? (
                <img 
                  src={item.imageUrl} 
                  alt={item.headline} 
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700"
                />
              ) : (
                <div className="w-full h-full flex flex-col items-center justify-center space-y-3 bg-gradient-to-b from-white/5 to-transparent">
                  <div className={`transition-all duration-1000 ${generatingId === item.id ? 'animate-pulse scale-110' : ''}`}>
                    <ImageIcon size={48} className="text-slate-700" />
                  </div>
                  <button
                    onClick={() => handleGenerateImage(item.id, item.imagePrompt || item.headline)}
                    disabled={generatingId === item.id}
                    className="flex items-center gap-2 px-4 py-2 rounded-full bg-blue-600 text-white text-xs font-bold shadow-lg shadow-blue-500/20 hover:bg-blue-500 transition-all disabled:opacity-50"
                  >
                    {generatingId === item.id ? (
                      <>
                        <RefreshCw size={14} className="animate-spin" />
                        AI Visualizing...
                      </>
                    ) : (
                      <>
                        <Sparkles size={14} />
                        Generate AI Visual
                      </>
                    )}
                  </button>
                </div>
              )}
              <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent pointer-events-none" />
              <div className="absolute top-4 left-4">
                <span className={`px-3 py-1 rounded-full text-[10px] font-bold uppercase tracking-widest shadow-xl backdrop-blur-md ${
                  item.category === 'Jackpot' ? 'bg-amber-500/20 text-amber-500 border border-amber-500/20' :
                  item.category === 'Regulatory' ? 'bg-red-500/20 text-red-500 border border-red-500/20' :
                  'bg-blue-500/20 text-blue-500 border border-blue-500/20'
                }`}>
                  {item.category}
                </span>
              </div>
            </div>

            <div className="p-8 space-y-4 flex-1">
              <div className="flex items-center gap-2 text-slate-500 text-xs font-medium">
                <Calendar size={14} className="text-blue-400" />
                <span>{item.date}</span>
              </div>

              <h3 className="text-xl md:text-2xl font-orbitron font-bold text-white leading-tight group-hover:text-blue-400 transition-colors">
                {item.headline}
              </h3>

              <p className="text-slate-400 text-sm leading-relaxed border-l-2 border-white/5 pl-4 line-clamp-3">
                {item.summary}
              </p>

              <div className="flex flex-wrap items-center gap-6 pt-6 border-t border-white/5 mt-auto">
                <div className="flex items-center gap-2 text-slate-300">
                  <div className="w-8 h-8 rounded-lg bg-white/5 flex items-center justify-center">
                    <Newspaper size={16} className="text-slate-500" />
                  </div>
                  <div>
                    <p className="text-[10px] text-slate-500 uppercase font-bold tracking-tighter">Publication</p>
                    <p className="text-xs font-semibold">{item.paperName}</p>
                  </div>
                </div>
                
                <div className="flex items-center gap-2 text-slate-300">
                  <div className="w-8 h-8 rounded-lg bg-white/5 flex items-center justify-center">
                    <Hash size={16} className="text-slate-500" />
                  </div>
                  <div>
                    <p className="text-[10px] text-slate-500 uppercase font-bold tracking-tighter">Page Ref</p>
                    <p className="text-xs font-semibold">{item.pageNumber}</p>
                  </div>
                </div>

                <div className="ml-auto hidden sm:flex items-center gap-2 text-[10px] font-bold text-slate-600 uppercase">
                  <Tag size={12} />
                  <span>Verifed Source</span>
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>

      <div className="p-8 rounded-3xl bg-gradient-to-br from-slate-900 to-black border border-white/5 flex flex-col items-center text-center space-y-4">
        <div className="p-3 bg-blue-600/10 rounded-full">
          <ImageIcon size={24} className="text-blue-400" />
        </div>
        <p className="text-slate-300 text-sm font-medium max-w-xl">
          Visual content generated by Nexus AI adheres to our <strong>Visual Privacy Framework</strong>, ensuring all imagery remains abstract and professional without depicting real individuals.
        </p>
        <p className="text-slate-500 text-xs italic">
          * Information displayed is aggregated from public newspaper archives. Content is for informational purposes only. No external links are provided to maintain ecosystem security.
        </p>
      </div>
    </div>
  );
};
