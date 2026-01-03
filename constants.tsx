
import React from 'react';
import { LotteryProvider, LotteryResult, StatisticalData, LotteryNews, LeaderboardEntry } from './types';

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

export const MOCK_LEADERBOARD: LeaderboardEntry[] = [
  { rank: 1, username: 'NexusOracle', accuracy: 94.2, points: 12450, badge: 'Grandmaster' },
  { rank: 2, username: 'TotoSensei', accuracy: 89.8, points: 10820, badge: 'Elite' },
  { rank: 3, username: 'QuantumPunter', accuracy: 88.5, points: 9540, badge: 'Expert' },
  { rank: 4, username: 'VectorX', accuracy: 82.1, points: 7200, badge: 'Veteran' },
  { rank: 5, username: 'LottoLlama', accuracy: 79.4, points: 6100, badge: 'Pro' },
  { rank: 6, username: 'DataMiner01', accuracy: 76.8, points: 5400, badge: 'Rising Star' },
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
    nav: {
      dashboard: 'Dashboard',
      stats: 'Deep Analytics',
      archive: 'History Archive',
      favorites: 'My Library',
      community: 'Live Community',
      challenges: 'Oracle Rankings',
      predictions: 'AI Predictions',
      news: 'Industry News',
      widgets: 'Web Widgets',
      premium: 'Nexus Elite',
      admin: 'Admin Ops',
    },
    common: {
      activation: 'Node Activation',
      login: 'Node Login',
      syncActive: 'Global Sync Active',
      jackpotPulse: 'Real-Time Jackpot Pulse',
      officialResults: 'OFFICIAL RESULTS',
      latestResults: 'LATEST RESULTS',
      verifiedNode: 'Verified Node',
      guestPunter: 'Guest Punter',
      elite: 'Nexus Elite',
      welcomeBonus: 'Earn 15 Welcome Points on Sync',
      recalibrate: 'RECALIBRATE ENGINE',
      predictor: 'Neural Predictor',
      luckyNumber: 'Nexus Luck Engine',
      heatmap: 'Digit Distribution',
      hotNumbers: 'Hot Spot',
      coldNumbers: 'Low Trace',
      normalNumbers: 'Normal',
      upgrade: 'UPGRADE TO ELITE',
    },
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
    nav: {
      dashboard: '仪表板',
      stats: '深度分析',
      archive: '历史存档',
      favorites: '我的收藏',
      community: '实时社区',
      challenges: '神谕排行',
      predictions: 'AI 预测',
      news: '行业新闻',
      widgets: '网页组件',
      premium: '精英会员',
      admin: '管理操作',
    },
    common: {
      activation: '节点激活',
      login: '节点登录',
      syncActive: '全局同步中',
      jackpotPulse: '实时奖池脉搏',
      officialResults: '官方开彩结果',
      latestResults: '最新开彩结果',
      verifiedNode: '已验证节点',
      guestPunter: '访客模式',
      elite: 'Nexus 精英',
      welcomeBonus: '注册即领 15 积分',
      recalibrate: '重新校准引擎',
      predictor: '神经预测器',
      luckyNumber: 'Nexus 幸运引擎',
      heatmap: '数字分布图',
      hotNumbers: '热门',
      coldNumbers: '冷门',
      normalNumbers: '正常',
      upgrade: '升级至精英版',
    },
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
    nav: {
      dashboard: 'Papan Pemuka',
      stats: 'Analitik Mendalam',
      archive: 'Arkib Sejarah',
      favorites: 'Perpustakaan Saya',
      community: 'Komuniti Langsung',
      challenges: 'Kedudukan Oracle',
      predictions: 'Ramalan AI',
      news: 'Berita Industri',
      widgets: 'Widget Web',
      premium: 'Elite Nexus',
      admin: 'Operasi Admin',
    },
    common: {
      activation: 'Pengaktifan Node',
      login: 'Log Masuk Node',
      syncActive: 'Sinkronisasi Global Aktif',
      jackpotPulse: 'Nadi Jackpot Masa Nyata',
      officialResults: 'KEPUTUSAN RASMI',
      latestResults: 'KEPUTUSAN TERKINI',
      verifiedNode: 'Node Disahkan',
      guestPunter: 'Pemain Tetamu',
      elite: 'Nexus Elite',
      welcomeBonus: 'Dapatkan 15 Mata Selamat Datang',
      recalibrate: 'KALIBRASI SEMULA',
      predictor: 'Peramal Neural',
      luckyNumber: 'Enjin Tuah Nexus',
      heatmap: 'Taburan Digit',
      hotNumbers: 'Sangat Hangat',
      coldNumbers: 'Jejak Rendah',
      normalNumbers: 'Normal',
      upgrade: 'NAIK TARAF KE ELITE',
    },
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
