// src/data/dummyUsers.ts
export type User = {
  id: string;
  name: string;
  handle: string;
  bio: string;
  avatarUrl: string;
  isVerified: boolean;
  pnl: number;
  winRate: number;
  sharpeRatio: number;
  equityCurveData: { date: string; value: number }[];
  followers: number;
  following: number;
};

export const dummyUsers: User[] = [
  {
    id: "1",
    name: "Alex 'The Algo' Turner",
    handle: "@TheAlgoTrader",
    bio: "Quant analyst and prop trader. Specializing in high-frequency algorithmic strategies. Sharing insights and performance.",
    avatarUrl:
      "https://images.unsplash.com/photo-1758205763784-403107e86826?q=80&w=1170&auto=format&fit=crop",
    isVerified: true,
    pnl: 27.34,
    winRate: 72.1,
    sharpeRatio: 2.15,
    equityCurveData: [
      { date: "Jan 7", value: 900 },
      { date: "Jan 21", value: 950 },
      { date: "Feb 4", value: 1050 },
      { date: "Feb 18", value: 1150 },
      { date: "Mar 11", value: 1273.4 },
    ],
    followers: 1200,
    following: 150,
  },
  {
    id: "2",
    name: "Sophia Quant",
    handle: "@SQTrades",
    bio: "Options trader focusing on volatility strategies. Sharing charts & alpha.",
    avatarUrl:
      "https://images.unsplash.com/photo-1580489944761-15a19d654956?q=80&w=1170&auto=format&fit=crop",
    isVerified: false,
    pnl: 18.7,
    winRate: 65.3,
    sharpeRatio: 1.72,
    equityCurveData: [
      { date: "Jan 7", value: 1000 },
      { date: "Feb 1", value: 1100 },
      { date: "Mar 1", value: 1187 },
    ],
    followers: 890,
    following: 200,
  },
  {
    id: "3",
    name: "Marcus 'Pips' Lee",
    handle: "@PipHunter",
    bio: "Forex day trader. Scalping EUR/USD since 2016.",
    avatarUrl:
      "https://images.unsplash.com/photo-1544723795-3fb6469f5b39?q=80&w=1170&auto=format&fit=crop",
    isVerified: true,
    pnl: 45.2,
    winRate: 78.9,
    sharpeRatio: 2.83,
    equityCurveData: [
      { date: "Jan 7", value: 800 },
      { date: "Feb 7", value: 970 },
      { date: "Mar 7", value: 1160 },
    ],
    followers: 2500,
    following: 310,
  },
];
