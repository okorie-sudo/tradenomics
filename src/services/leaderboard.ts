// src/services/leaderboard.ts
import { dummyLeaderboard, type Trader } from "../data/dummyLeaderboard";

// For now: return dummy data sorted by PnL (descending)
export async function fetchLeaderboard(): Promise<Trader[]> {
  return dummyLeaderboard.sort((a, b) => b.pnl - a.pnl);
}

// (MVP placeholder for future expansions)
// e.g. fetchLeaderboardByMetric("sharpeRatio") etc.
