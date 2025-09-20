// src/data/dummyLeaderboard.ts
export type Trader = {
  id: string;
  name: string;
  handle: string;
  avatarUrl: string;
  isVerified: boolean;
  pnl: number; // PnL %
  winRate: number; // %
  sharpeRatio: number;
};

export const dummyLeaderboard: Trader[] = [
  {
    id: "1",
    name: "Alex 'The Algo' Turner",
    handle: "@TheAlgoTrader",
    avatarUrl:
      "https://images.unsplash.com/photo-1607746882042-944635dfe10e?w=500&q=80",
    isVerified: true,
    pnl: 27.34,
    winRate: 72.1,
    sharpeRatio: 2.15,
  },
  {
    id: "2",
    name: "MariaFX",
    handle: "@pipsqueen",
    avatarUrl:
      "https://images.unsplash.com/photo-1502685104226-ee32379fefbe?w=500&q=80",
    isVerified: true,
    pnl: 22.1,
    winRate: 68.5,
    sharpeRatio: 1.9,
  },
  {
    id: "3",
    name: "J. Rivers",
    handle: "@quantRivers",
    avatarUrl:
      "https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=500&q=80",
    isVerified: false,
    pnl: 18.9,
    winRate: 66.4,
    sharpeRatio: 1.7,
  },
  {
    id: "4",
    name: "Daniel Kim",
    handle: "@macro_dan",
    avatarUrl:
      "https://images.unsplash.com/photo-1527980965255-d3b416303d12?w=500&q=80",
    isVerified: false,
    pnl: 15.7,
    winRate: 64.2,
    sharpeRatio: 1.5,
  },
  {
    id: "5",
    name: "Elena Li",
    handle: "@elli_trade",
    avatarUrl:
      "https://images.unsplash.com/photo-1552374196-c4e7ffc6e126?w=500&q=80",
    isVerified: true,
    pnl: 12.5,
    winRate: 70.0,
    sharpeRatio: 1.8,
  },
  {
    id: "6",
    name: "Omar Patel",
    handle: "@scalper_omar",
    avatarUrl:
      "https://images.unsplash.com/photo-1544723795-3fb6469f5b39?w=500&q=80",
    isVerified: false,
    pnl: 10.9,
    winRate: 62.3,
    sharpeRatio: 1.4,
  },
  {
    id: "7",
    name: "Sophia Grant",
    handle: "@grantsignals",
    avatarUrl:
      "https://images.unsplash.com/photo-1529626455594-4ff0802cfb7e?w=500&q=80",
    isVerified: true,
    pnl: 9.6,
    winRate: 65.1,
    sharpeRatio: 1.3,
  },
  {
    id: "8",
    name: "Liam Chen",
    handle: "@liam_fx",
    avatarUrl:
      "https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?w=500&q=80",
    isVerified: false,
    pnl: 8.2,
    winRate: 60.4,
    sharpeRatio: 1.2,
  },
  {
    id: "9",
    name: "Nina Rossi",
    handle: "@rossi_quant",
    avatarUrl:
      "https://images.unsplash.com/photo-1544723795-3fb6469f5b39?w=500&q=80",
    isVerified: true,
    pnl: 7.1,
    winRate: 59.8,
    sharpeRatio: 1.1,
  },
  {
    id: "10",
    name: "Victor Hugo",
    handle: "@victortrades",
    avatarUrl:
      "https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=500&q=80",
    isVerified: false,
    pnl: 5.3,
    winRate: 55.2,
    sharpeRatio: 1.0,
  },
];
