// src/pages/Leaderboard.tsx
import React, { useEffect, useState } from "react";
import { fetchLeaderboard } from "../services/leaderboard";
import type { Trader } from "../data/dummyLeaderboard";
import { Check, BarChart3, Clock } from "lucide-react";
// import { useNavigate } from "react-router-dom";

type Metric = "pnl" | "winRate" | "sharpeRatio";
type TimeRange = "all" | "30d" | "7d";

const Leaderboard: React.FC = () => {
  const [traders, setTraders] = useState<Trader[]>([]);
  const [metric, setMetric] = useState<Metric>("pnl");
  const [timeRange, setTimeRange] = useState<TimeRange>("all");
  const [scrolled, setScrolled] = useState(false);

  // const navigate = useNavigate();

  useEffect(() => {
    const loadData = async () => {
      const data = await fetchLeaderboard();
      setTraders(data);
    };
    loadData();
  }, []);

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 5);
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  // mock time filtering
  const filtered = traders.map((t) => {
    if (timeRange === "30d")
      return { ...t, pnl: t.pnl * 0.7, winRate: t.winRate * 0.9 };
    if (timeRange === "7d")
      return { ...t, pnl: t.pnl * 0.3, winRate: t.winRate * 0.8 };
    return t;
  });

  const sorted = [...filtered].sort((a, b) => b[metric] - a[metric]);

  return (
    <div className="flex-1 flex flex-col bg-secondary dark:bg-primary min-h-screen pb-20">
      {/* Fixed Header */}
      <div
        className={`sticky top-0 z-20 p-4 bg-white dark:bg-gray-900 transition-shadow ${
          scrolled ? "shadow-md" : ""
        }`}
      >
        <h1 className="text-xl font-bold text-primary mb-3">Leaderboard</h1>

        {/* Filters */}
        <div className="flex justify-between gap-3">
          {/* Metric toggle */}
          <div className="flex flex-1 gap-1 bg-secondary/20 dark:bg-gray-800 rounded-lg p-1">
            <button
              onClick={() => setMetric("pnl")}
              className={`flex-1 flex items-center justify-center gap-1 py-1 rounded-md text-sm transition-all duration-200 ${
                metric === "pnl"
                  ? "bg-black text-white scale-105 shadow-sm"
                  : "text-primary hover:scale-105"
              }`}
            >
              <BarChart3 className="w-4 h-4" /> PnL
            </button>
            <button
              onClick={() => setMetric("winRate")}
              className={`flex-1 py-1 rounded-md text-sm transition-all duration-200 ${
                metric === "winRate"
                  ? "bg-black text-white scale-105 shadow-sm"
                  : "text-primary hover:scale-105"
              }`}
            >
              Win%
            </button>
            <button
              onClick={() => setMetric("sharpeRatio")}
              className={`flex-1 py-1 rounded-md text-sm transition-all duration-200 ${
                metric === "sharpeRatio"
                  ? "bg-black text-white scale-105 shadow-sm"
                  : "text-primary hover:scale-105"
              }`}
            >
              Sharpe
            </button>
          </div>

          {/* Time toggle */}
          <div className="flex flex-1 gap-1 bg-secondary/20 dark:bg-gray-800 rounded-lg p-1">
            <button
              onClick={() => setTimeRange("all")}
              className={`flex-1 flex items-center justify-center gap-1 py-1 rounded-md text-sm transition-all duration-200 ${
                timeRange === "all"
                  ? "bg-black text-white scale-105 shadow-sm"
                  : "text-primary hover:scale-105"
              }`}
            >
              <Clock className="w-4 h-4" /> All
            </button>
            <button
              onClick={() => setTimeRange("30d")}
              className={`flex-1 py-1 rounded-md text-sm transition-all duration-200 ${
                timeRange === "30d"
                  ? "bg-black text-white scale-105 shadow-sm"
                  : "text-primary hover:scale-105"
              }`}
            >
              30d
            </button>
            <button
              onClick={() => setTimeRange("7d")}
              className={`flex-1 py-1 rounded-md text-sm transition-all duration-200 ${
                timeRange === "7d"
                  ? "bg-black text-white scale-105 shadow-sm"
                  : "text-primary hover:scale-105"
              }`}
            >
              7d
            </button>
          </div>
        </div>
      </div>

      {/* Leaderboard List */}
      <div className="p-4 space-y-3">
        {sorted.map((trader, index) => {
          const rank = index + 1;
          const rankStyle =
            rank === 1
              ? "text-yellow-500 font-bold"
              : rank === 2
              ? "text-gray-400 font-bold"
              : rank === 3
              ? "text-amber-600 font-bold"
              : "text-primary";

          return (
            <div
              key={trader.id}
              className="flex items-center justify-between p-3 bg-white dark:bg-gray-800 rounded-lg shadow-sm hover:shadow-md transition"
            >
              {/* Left */}
              <div className="flex items-center gap-3">
                <span className={`w-6 text-center ${rankStyle}`}>#{rank}</span>
                <img
                  src={trader.avatarUrl}
                  alt={trader.name}
                  className="w-10 h-10 rounded-full object-cover"
                />
                <div>
                  <div className="flex items-center gap-1">
                    <span className="font-semibold text-primary">
                      {trader.name}
                    </span>
                    {trader.isVerified && (
                      <Check className="w-4 h-4 text-green-500" />
                    )}
                  </div>
                  <p className="text-xs text-primary/70">{trader.handle}</p>
                </div>
              </div>

              {/* Right: metric value */}
              <div>
                {metric === "pnl" && (
                  <p
                    className={`font-bold ${
                      trader.pnl >= 0 ? "text-green-600" : "text-red-600"
                    }`}
                  >
                    {trader.pnl >= 0 ? "+" : ""}
                    {trader.pnl.toFixed(2)}%
                  </p>
                )}
                {metric === "winRate" && (
                  <p className="font-bold text-blue-600">
                    {trader.winRate.toFixed(1)}%
                  </p>
                )}
                {metric === "sharpeRatio" && (
                  <p className="font-bold text-purple-600">
                    {trader.sharpeRatio.toFixed(2)}
                  </p>
                )}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default Leaderboard;
