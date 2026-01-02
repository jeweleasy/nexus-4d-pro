
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
    LotteryProvider.MAGNUM, 
    LotteryProvider.TOTO, 
    LotteryProvider.DAMACAI, 
    LotteryProvider.GDLOTTO,
    LotteryProvider.SINGAPORE,
    LotteryProvider.PERDANA4D
  ];
  
  const results: LotteryResult[] = [];
  
  // Create results for Today (as Live/Pending), Yesterday (Final), and the last few draw days (Wed, Sat, Sun)
  [0, 1, 2, 3, 4, 7].forEach(daysAgo => {
    const dateStr = getRelativeDate(daysAgo);
    
    // Most providers draw on Wed, Sat, Sun (and Tue for some)
    // We simulate draws for all for testing purposes so there is no "empty" state
    providers.forEach(p => {
      results.push({
        provider: p,
        drawDate: dateStr,
        drawNumber: `${Math.floor(Math.random() * 1000 + 5000)}/24`,
        first: Math.floor(1000 + Math.random() * 9000).toString(),
        second: Math.floor(1000 + Math.random() * 9000).toString(),
        third: Math.floor(1000 + Math.random() * 9000).toString(),
        specials: Array(10).fill(0).map(() => Math.floor(1000 + Math.random() * 9000).toString()),
        consolations: Array(10).fill(0).map(() => Math.floor(1000 + Math.random() * 9000).toString()),
        status: daysAgo === 0 ? 'Live' : 'Final',
        timestamp: Date.now() - (daysAgo * 86400000)
      });
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
      special: 'Istimewa',
      consolation: 'Saguhati'
    }
  }
};
