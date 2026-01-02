
import React from 'react';
import { LotteryProvider, LotteryResult, StatisticalData, LotteryNews } from './types';

export const MOCK_RESULTS: LotteryResult[] = [
  {
    provider: LotteryProvider.MAGNUM,
    drawDate: '2024-05-22',
    drawNumber: '567/24',
    first: '8492',
    second: '3011',
    third: '4589',
    specials: ['1234', '5678', '9012', '3456', '7890', '1122', '3344', '5566', '7788', '9900'],
    consolations: ['0987', '6543', '2109', '8765', '4321', '0011', '2233', '4455', '6677', '8899'],
    status: 'Final',
    timestamp: Date.now() - 1000 * 60 * 60 * 2,
  },
  {
    provider: LotteryProvider.TOTO,
    drawDate: '2024-05-22',
    drawNumber: '5892/24',
    first: '1102',
    second: '9948',
    third: '6731',
    specials: ['1001', '2002', '3003', '4004', '5005', '6006', '7007', '8008', '9009', '1111'],
    consolations: ['2222', '3333', '4444', '5555', '6666', '7777', '8888', '9999', '0000', '1212'],
    status: 'Final',
    timestamp: Date.now() - 1000 * 60 * 60 * 1,
  },
  {
    provider: LotteryProvider.DAMACAI,
    drawDate: '2024-05-22',
    drawNumber: '445/24',
    first: '2518',
    second: '7721',
    third: '0904',
    specials: ['4421', '5532', '6643', '7754', '8865', '9976', '0087', '1198', '2209', '3310'],
    consolations: ['4411', '5522', '6633', '7744', '8855', '9966', '0077', '1188', '2299', '3300'],
    status: 'Final',
    timestamp: Date.now() - 500000,
  },
  {
    provider: LotteryProvider.GDLOTTO,
    drawDate: '2024-05-22',
    drawNumber: 'G821/24',
    first: '9922',
    second: '1023',
    third: '4482',
    specials: Array(10).fill('0').map(() => Math.floor(1000 + Math.random() * 9000).toString()),
    consolations: Array(10).fill('0').map(() => Math.floor(1000 + Math.random() * 9000).toString()),
    status: 'Live',
    timestamp: Date.now(),
  },
  {
    provider: LotteryProvider.SINGAPORE,
    drawDate: '2024-05-22',
    drawNumber: '4991',
    first: '3310',
    second: '8821',
    third: '1109',
    specials: Array(10).fill('0').map(() => Math.floor(1000 + Math.random() * 9000).toString()),
    consolations: Array(10).fill('0').map(() => Math.floor(1000 + Math.random() * 9000).toString()),
    status: 'Final',
    timestamp: Date.now() - 800000,
  },
  {
    provider: LotteryProvider.PERDANA4D,
    drawDate: '2024-05-22',
    drawNumber: 'P221',
    first: '7743',
    second: '1102',
    third: '9948',
    specials: Array(10).fill('0').map(() => Math.floor(1000 + Math.random() * 9000).toString()),
    consolations: Array(10).fill('0').map(() => Math.floor(1000 + Math.random() * 9000).toString()),
    status: 'Final',
    timestamp: Date.now() - 1200000,
  },
  {
    provider: LotteryProvider.SABAH88,
    drawDate: '2024-05-22',
    drawNumber: 'S8/24',
    first: '5561',
    second: '2290',
    third: '8872',
    specials: Array(10).fill('0').map(() => Math.floor(1000 + Math.random() * 9000).toString()),
    consolations: Array(10).fill('0').map(() => Math.floor(1000 + Math.random() * 9000).toString()),
    status: 'Final',
    timestamp: Date.now() - 1500000,
  }
];

export const HOT_NUMBERS: StatisticalData[] = [
  { number: '8492', frequency: 12, lastDrawn: '2024-05-22', gap: 0, status: 'hot' },
  { number: '1102', frequency: 10, lastDrawn: '2024-05-22', gap: 0, status: 'hot' },
  { number: '2518', frequency: 9, lastDrawn: '2024-05-22', gap: 0, status: 'hot' },
  { number: '0904', frequency: 8, lastDrawn: '2024-05-21', gap: 1, status: 'neutral' },
  { number: '7721', frequency: 2, lastDrawn: '2024-01-15', gap: 120, status: 'cold' },
];

export const MOCK_NEWS: LotteryNews[] = [
  {
    id: '1',
    headline: 'Supreme Toto 6/58 Jackpot Hits Record RM 97 Million',
    summary: 'A lucky punter from Kuala Lumpur has claimed the largest single jackpot prize in Malaysian history. The winning ticket was purchased at a suburban outlet, marking a massive surge in local participation for the upcoming weekend draws.',
    paperName: 'The Star Business',
    pageNumber: 'B12',
    date: '2024-05-20',
    category: 'Jackpot'
  },
  {
    id: '2',
    headline: 'Digitalization of Traditional 4D Outlets Sees 30% Growth',
    summary: 'The shift towards mobile-integrated verification systems has revitalized the traditional lottery sector. Industry analysts predict a complete transition to paperless auditing by 2026, improving data transparency across all major providers.',
    paperName: 'Malay Mail',
    pageNumber: 'P04',
    date: '2024-05-18',
    category: 'Market'
  },
  {
    id: '3',
    headline: 'New Compliance Standards for Lottery Operators Announced',
    summary: 'The regulatory body has introduced stricter anti-money laundering protocols for high-value prize claims. Operators now require biometric verification for any payouts exceeding RM 100,000 to ensure financial integrity.',
    paperName: 'The Edge Weekly',
    pageNumber: 'A08',
    date: '2024-05-15',
    category: 'Regulatory'
  }
];

export const LANGUAGES = {
  EN: {
    title: '4D Nexus Pro',
    dashboard: 'Dashboard',
    stats: 'Statistics',
    archive: 'Archive',
    predictions: 'ML Predictions',
    news: 'Industry News',
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
    archive: 'Arkib',
    predictions: 'Ramalan AI',
    news: 'Berita Industri',
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
