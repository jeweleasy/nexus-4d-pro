
export enum LotteryProvider {
  MAGNUM = 'Magnum 4D',
  DAMACAI = 'Da Ma Cai 1+3D',
  TOTO = 'Sports Toto 4D',
  SINGAPORE = 'Singapore 4D',
  SABAH88 = 'Sabah 88 4D',
  STC = 'STC 4D',
  SWEEP = 'Special CashSweep',
  GDLOTTO = 'GD Lotto',
  LUCKYHARIHARI = 'Lucky Hari Hari',
  KINGDOM4D = 'Kingdom 4D',
  PERDANA4D = 'Perdana 4D',
  DRAGON4D = 'Dragon 4D',
  NEWWIN4D = 'NewWin 4D',
  PMP4D = 'PMP 4D',
  LUCKY4D = 'Lucky 4D',
  TOTO5D = 'Sports Toto 5D',
  TOTO6D = 'Sports Toto 6D',
  MAGNUMLIFE = 'Magnum Life'
}

export type ResultType = '4D' | '5D' | '6D' | 'JACKPOT' | 'LIFE';

export interface LotteryResult {
  provider: LotteryProvider;
  type: ResultType;
  drawDate: string;
  drawNumber: string;
  first: string;
  second?: string;
  third?: string;
  fourth?: string;
  fifth?: string;
  sixth?: string;
  specials?: string[];
  consolations?: string[];
  jackpot1?: string;
  jackpot2?: string;
  status: 'Live' | 'Final' | 'Pending';
  timestamp: number;
}

export interface User {
  id: string;
  nexusId: string;
  email: string;
  points: number;
  isPremium: boolean;
  registrationDate: string;
  avatarId: number;
}

export interface Seller {
  id: string;
  name: string;
  address: string;
  country: string;
  zipCode: string;
  contactPerson: string;
  contactNumber: string;
  coordinates: { lat: number; lng: number };
}

export interface StatisticalData {
  number: string;
  frequency: number;
  lastDrawn: string;
  gap: number;
  status: 'hot' | 'cold' | 'neutral';
}

export interface PredictionResult {
  number: string;
  probability: number;
  reasoning: string;
}

export interface LeaderboardEntry {
  rank: number;
  username: string;
  accuracy: number;
  points: number;
  badge: string;
}

export interface ChatMessage {
  role: 'user' | 'model';
  text: string;
  timestamp: number;
}

export interface JackpotData {
  provider: LotteryProvider;
  amount: number;
  label: string;
  isHot: boolean;
  currency: string;
}

export interface LotteryNews {
  id: string;
  headline: string;
  summary: string;
  paperName: string;
  pageNumber: string;
  date: string;
  category: string;
  sourceLink?: string;
  imagePrompt?: string;
  imageUrl?: string;
}
