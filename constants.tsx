
import React from 'react';
import { LotteryProvider, LotteryResult, StatisticalData, LotteryNews } from './types';

// Helper to generate dates relative to today
const getRelativeDate = (daysAgo: number) => {
  const d = new Date();
  d.setDate(d.getDate() - daysAgo);
  return d.toISOString().split('T')[0];
};

// Generate a rich set of results for the last 7 days to ensure "near-time" availability
const generateRecentResults = (): LotteryResult[] => {
  const providers = [
    { name: LotteryProvider.MAGNUM, type: '4D' as const },
    { name: LotteryProvider.TOTO, type: '4D' as const },
    { name: LotteryProvider.DAMACAI, type: '4D' as const },
    { name: LotteryProvider.GDLOTTO, type: '4D' as const },
    { name: LotteryProvider.SINGAPORE, type: '4D' as const },
    { name: LotteryProvider.TOTO5D, type: '5D' as const },
    { name: LotteryProvider.TOTO6D, type: '6D' as const },
    { name: LotteryProvider.MAGNUMLIFE, type: 'LIFE' as const }
  ];
  
  const results: LotteryResult[] = [];
  
  [0, 1, 2, 3, 4, 7].forEach(daysAgo => {
    const dateStr = getRelativeDate(daysAgo);
    
    providers.forEach(p => {
      const res: LotteryResult = {
        provider: p.name,
        type: p.type,
        drawDate: dateStr,
        drawNumber: `${Math.floor(Math.random() * 1000 + 5000)}/24`,
        first: p.type === '4D' ? Math.floor(1000 + Math.random() * 9000).toString() :
               p.type === '5D' ? Math.floor(10000 + Math.random() * 89999).toString() :
               p.type === '6D' ? Math.floor(100000 + Math.random() * 899999).toString() :
               "1, 5, 12, 19, 25, 31, 35, 36", // Mock Life numbers
        status: daysAgo === 0 ? 'Live' : 'Final',
        timestamp: Date.now() - (daysAgo * 86400000)
      };

      if (p.type === '4D') {
        res.second = Math.floor(1000 + Math.random() * 9000).toString();
        res.third = Math.floor(1000 + Math.random() * 9000).toString();
        res.specials = Array(10).fill(0).map(() => Math.floor(1000 + Math.random() * 9000).toString());
        res.consolations = Array(10).fill(0).map(() => Math.floor(1000 + Math.random() * 9000).toString());
      } else if (p.type === '5D' || p.type === '6D') {
        res.second = Math.floor(p.type === '5D' ? 10000 : 100000 + Math.random() * 90000).toString();
        res.third = Math.floor(p.type === '5D' ? 1000 : 10000 + Math.random() * 9000).toString();
        res.fourth = Math.floor(p.type === '5D' ? 100 : 1000 + Math.random() * 900).toString();
        res.fifth = Math.floor(p.type === '5D' ? 10 : 100 + Math.random() * 90).toString();
      }

      results.push(res);
    });
  });
  
  return results;
};

export const MOCK_RESULTS: LotteryResult[] = generateRecentResults();

export const HOT_NUMBERS: StatisticalData[] = [
  { number: '8492', frequency: 12, lastDrawn: getRelativeDate(1), gap: 0, status: 'hot' },
  { number: '1102', frequency: 10, lastDrawn: getRelativeDate(1), gap: 0, status: 'hot' },
  { number: '2518', frequency: 9, lastDrawn: getRelativeDate(2), gap: 0, status: 'hot' },
  { number: '0904', frequency: 8, lastDrawn: getRelativeDate(3), gap: 1, status: 'neutral' },
  { number: '7721', frequency: 2, lastDrawn: getRelativeDate(30), gap: 120, status: 'cold' },
];

export const MOCK_NEWS: LotteryNews[] = [
  {
    id: '1',
    headline: 'Nexus AI Predicts Record Jackpot Surge',
    summary: 'Our pattern analysis engines indicate a significant uptick in regional jackpot accumulations.',
    paperName: 'Nexus Finance',
    pageNumber: 'A1',
    date: getRelativeDate(0),
    category: 'Jackpot'
  },
  {
    id: '2',
    headline: 'Real-Time Aggregation Latency Reduced to 0.5ms',
    summary: 'Nexus Pro developers successfully implemented new WebSocket clusters for faster draw broadcasting.',
    paperName: 'Tech Insider',
    pageNumber: 'B4',
    date: getRelativeDate(1),
    category: 'Market'
  }
];

export const LANGUAGES = {
  EN: {
    title: '4D Nexus Pro',
    dashboard: 'Dashboard',
    stats: 'Statistics',
    archive: 'History Archive',
    predictions: 'ML Predictions',
    news: 'Industry News',
    favorites: 'My Favorites',
    live: 'Live Draw',
    prizes: {
      first: '1st Prize',
      second: '2nd Prize',
      third: '3rd Prize',
      fourth: '4th Prize',
      fifth: '5th Prize',
      sixth: '6th Prize',
      special: 'Special',
      consolation: 'Consolation'
    }
  },
  CN: {
    title: '4D 领航 Pro',
    dashboard: '主页',
    stats: '统计数据',
    archive: '历史查询',
    predictions: 'AI 预测',
    news: '行业新闻',
    favorites: '我的收藏',
    live: '即时开彩',
    prizes: {
      first: '头奖',
      second: '二奖',
      third: '三奖',
      fourth: '四奖',
      fifth: '五奖',
      sixth: '六奖',
      special: '特别奖',
      consolation: '安慰奖'
    }
  },
  MY: {
    title: '4D Nexus Pro',
    dashboard: 'Papan Pemuka',
    stats: 'Statistik',
    archive: 'Arkib Sejarah',
    predictions: 'Ramalan AI',
    news: 'Berita Industri',
    favorites: 'Kegemaran Saya',
    live: 'Cabutan Langsung',
    prizes: {
      first: 'Hadiah Pertama',
      second: 'Hadiah Kedua',
      third: 'Hadiah Ketiga',
      fourth: 'Hadiah Ke-4',
      fifth: 'Hadiah Ke-5',
      sixth: 'Hadiah Ke-6',
      special: 'Istimewa',
      consolation: 'Saguhati'
    }
  }
};
