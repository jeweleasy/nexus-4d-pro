
import React from 'react';
import { LotteryProvider, LotteryResult, StatisticalData, LotteryNews, LeaderboardEntry, Seller } from './types';

// Helper to generate dates relative to today
const getRelativeDate = (daysAgo: number) => {
  const d = new Date();
  d.setDate(d.getDate() - daysAgo);
  return d.toISOString().split('T')[0];
};

export const MOCK_SELLERS: Seller[] = [
  {
    id: 's1',
    name: 'Nexus KL Sentral Terminal',
    address: 'Level 1, KL Sentral, 50470 Kuala Lumpur',
    country: 'Malaysia',
    zipCode: '50470',
    contactPerson: 'Mr. Wong',
    contactNumber: '+60 12-345 6789',
    coordinates: { lat: 3.1344, lng: 101.6865 }
  },
  {
    id: 's2',
    name: 'Bukit Bintang Digital Node',
    address: 'Lot 10, Jalan Sultan Ismail, 50250 Kuala Lumpur',
    country: 'Malaysia',
    zipCode: '50250',
    contactPerson: 'Ms. Sarah Lee',
    contactNumber: '+60 17-988 2211',
    coordinates: { lat: 3.1472, lng: 101.7101 }
  },
  {
    id: 's3',
    name: 'Orchard Plaza Hub',
    address: '150 Orchard Road, Singapore 238841',
    country: 'Singapore',
    zipCode: '238841',
    contactPerson: 'David Chen',
    contactNumber: '+65 6734 1122',
    coordinates: { lat: 1.3008, lng: 103.8407 }
  },
  {
    id: 's4',
    name: 'Johor Bahru Gateway',
    address: 'JB Sentral, Bukit Chagar, 80300 Johor Bahru',
    country: 'Malaysia',
    zipCode: '80300',
    contactPerson: 'Raju Krishnan',
    contactNumber: '+60 11-2233 4455',
    coordinates: { lat: 1.4622, lng: 103.7644 }
  }
];

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
    headline: 'The Edge: Malaysia Gaming Sector Poised for Recovery in Q4 2024.',
    summary: 'The Edge Financial analysis suggests that the relaxation of tourism barriers and increased consumer confidence in urban Malaysia are driving significant traffic back to legal 4D outlets. National treasury contributions are projected to rise by 4.2% YoY.',
    paperName: 'The Edge',
    pageNumber: 'B12',
    date: getRelativeDate(0),
    category: 'Market',
    sourceLink: 'https://www.theedgemarkets.com/article/gaming'
  },
  {
    id: '2',
    headline: 'Berita Harian: Pemenang Jackpot RM15 Juta Dari Ipoh Tuntut Hadiah.',
    summary: 'Seorang pesara dari Ipoh telah menuntut hadiah utama Magnum Jackpot bernilai RM15 juta. Beliau menyatakan bahawa nombor pilihannya adalah berdasarkan tarikh perkahwinan anak-anaknya. Beliau berhasrat untuk menyumbang sebahagian daripada kemenangan tersebut kepada rumah kebajikan tempatan.',
    paperName: 'Berita Harian',
    pageNumber: 'MS 4',
    date: getRelativeDate(1),
    category: 'Jackpot',
    sourceLink: 'https://www.bharian.com.my/berita/nasional'
  },
  {
    id: '3',
    headline: 'Sin Chew Daily: 数字化如何改变马来西亚博彩体验？',
    summary: '随着智能手机的普及，马来西亚各大博彩公司正加速其APP的功能升级。专家在《星洲日报》专访中指出，实时开奖结果与大数据分析功能的集成，已成为吸引年轻一代玩家的关键因素。Nexus Pro被评为年度最佳数据同步引擎。',
    paperName: 'Sin Chew Daily',
    pageNumber: 'A18',
    date: getRelativeDate(2),
    category: 'Regulatory',
    sourceLink: 'https://www.sinchew.com.my/category/business'
  }
];

export const LANGUAGES = {
  EN: {
    nav: {
      dashboard: 'Dashboard',
      stats: 'Deep Analytics',
      archive: 'History Archive',
      sellers: 'Seller Network',
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
      guestRestriction: 'please node activation-register then reply and link share',
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
      sellers: '销售网络',
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
      guestRestriction: '请激活节点注册后，再进行回复和链接分享',
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
      sellers: 'Rangkaian Penjual',
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
      guestRestriction: 'Sila lakukan pendaftaran pengaktifan node untuk membalas dan berkongsi pautan',
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
