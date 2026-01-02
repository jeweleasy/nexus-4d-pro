
import React, { useState, useEffect } from 'react';
import { Newspaper, Calendar, Hash, Tag, RefreshCw } from 'lucide-react';
import { predictionService } from '../services/geminiService';
import { MOCK_NEWS } from '../constants';
import { LotteryNews } from '../types';

export const NewsSection: React.FC = () => {
  const [loading, setLoading] = useState(false);
  const [news, setNews] = useState<LotteryNews[]>(MOCK_NEWS);

  const fetchNews = async () => {
    setLoading(true);
    const result = await predictionService.getNewsAggregated();
    if (result && result.news.length > 0) {
      setNews(result.news.map((item: any, idx: number) => ({
        ...item,
        id: `gen-${idx}`
      })));
    }
    setLoading(false);
  };

  return (
    <div className="space-y-8 animate-in fade-in slide-in-from-bottom-6 duration-700">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
          <h2 className="text-3xl font-orbitron font-bold flex items-center gap-3">
            <Newspaper className="text-blue-500" />
            Industry Intelligence
          </h2>
          <p className="text-slate-400 text-sm mt-1">Curated summaries from major regional publications</p>
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

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {news.map((item) => (
          <div key={item.id} className="glass rounded-2xl p-8 relative group hover:border-blue-500/30 transition-all">
            <div className="flex justify-between items-start mb-4">
              <span className={`px-3 py-1 rounded-full text-[10px] font-bold uppercase tracking-widest ${
                item.category === 'Jackpot' ? 'bg-amber-500/20 text-amber-500 border border-amber-500/20' :
                item.category === 'Regulatory' ? 'bg-red-500/20 text-red-500 border border-red-500/20' :
                'bg-blue-500/20 text-blue-500 border border-blue-500/20'
              }`}>
                {item.category}
              </span>
              <div className="flex items-center gap-2 text-slate-500 text-xs">
                <Calendar size={14} />
                <span>{item.date}</span>
              </div>
            </div>

            <h3 className="text-xl md:text-2xl font-orbitron font-bold text-white mb-4 leading-tight group-hover:text-blue-400 transition-colors">
              {item.headline}
            </h3>

            <p className="text-slate-400 text-sm leading-relaxed mb-8 border-l-2 border-white/5 pl-4">
              {item.summary}
            </p>

            <div className="flex flex-wrap items-center gap-6 pt-4 border-t border-white/5">
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
        ))}
      </div>

      <div className="p-6 rounded-2xl bg-gradient-to-br from-slate-900 to-black border border-white/5 text-center">
        <p className="text-slate-500 text-xs italic">
          * Information displayed is aggregated from public newspaper archives. Content is for informational purposes only. No external links are provided to maintain ecosystem security.
        </p>
      </div>
    </div>
  );
};
