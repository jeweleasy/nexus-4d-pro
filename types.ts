
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
  LUCKY4D = 'Lucky 4D'
}

export interface LotteryResult {
  provider: LotteryProvider;
  drawDate: string;
  drawNumber: string;
  first: string;
  second: string;
  third: string;
  specials: string[];
  consolations: string[];
  status: 'Live' | 'Final' | 'Pending';
  timestamp: number;
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

export interface LuckyNumberResult {
  number: string;
  fortune: string;
}

export interface LotteryNews {
  id: string;
  headline: string;
  summary: string;
  paperName: string;
  pageNumber: string;
  date: string;
  category: 'Market' | 'Regulatory' | 'Jackpot' | 'Analysis';
  imagePrompt?: string;
  imageUrl?: string;
}
