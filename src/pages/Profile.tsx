// src/pages/Profile.tsx
import React, { useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { Check, TrendingUp, Target, Award, Settings } from "lucide-react";
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from "recharts";
import ThemeToggle from "../components/ThemeToggle";

const Profile: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState<
    "overview" | "trades" | "competitions"
  >("overview");
  const [isFollowing, setIsFollowing] = useState(true);

  // Dummy data
  const profileData = {
    id: id || "1",
    name: "Alex 'The Algo' Turner",
    handle: "@TheAlgoTrader",
    bio: "Quant analyst and prop trader. Specializing in high-frequency algorithmic strategies. Sharing insights and performance.",
    avatarUrl:
      "https://images.unsplash.com/photo-1758205763784-403107e86826?q=80&w=1170&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
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
    following: 150,
    followers: 1200,
  };

  return (
    <div className="flex-1 flex flex-col bg-secondary dark:bg-primary min-h-screen">
      {/* Header with Settings + Theme Toggle */}
      <div className="flex justify-end items-center p-4 gap-2">
        <button
          onClick={() => navigate("/settings")}
          className="w-10 h-10 flex items-center justify-center rounded-full
                     bg-secondary dark:bg-primary
                     hover:scale-105 active:scale-95 transition-all duration-200"
        >
          <Settings className="w-5 h-5 text-primary" />
        </button>
        <ThemeToggle />
      </div>

      {/* Profile Header */}
      <div className="p-4">
        <div className="flex items-center flex-col gap-4 mb-4">
          <img
            src={profileData.avatarUrl}
            alt={profileData.name}
            className="w-20 h-20 rounded-full"
          />
          <div className="flex-1">
            <div className="flex items-center justify-center gap-2 mb-1">
              <h2 className="text-xl font-bold text-primary">
                {profileData.name}
              </h2>
              {profileData.isVerified && (
                <span className="inline-flex items-center px-2 py-1 bg-accent/20 text-accent text-xs font-medium rounded-full">
                  <Check size={12} className="mr-1" /> Verified
                </span>
              )}
            </div>
            <p className="text-primary text-center mb-2">
              {profileData.handle}
            </p>
            <p className="text-primary text-center">{profileData.bio}</p>
          </div>
        </div>

        {/* Followers/Following */}
        <div className="flex justify-around text-sm text-primary mb-4">
          <div>
            <p className="font-bold text-primary">{profileData.following}</p>
            <p>Following</p>
          </div>
          <div>
            <p className="font-bold text-primary">{profileData.followers}</p>
            <p>Followers</p>
          </div>
        </div>

        {/* Follow/Unfollow button */}
        <button
          onClick={() => setIsFollowing(!isFollowing)}
          className={`w-full py-2 rounded mb-4 ${
            isFollowing
              ? "bg-primary text-secondary"
              : "bg-secondary text-primary border border-primary"
          }`}
        >
          {isFollowing ? "Following" : "Follow"}
        </button>

        {/* Achievements / Badges */}
        <div className="flex gap-2 justify-center mt-2">
          <span className="px-2 py-1 bg-accent/20 text-accent text-xs rounded-full">
            🏆 Top Sharpe
          </span>
          <span className="px-2 py-1 bg-accent/20 text-accent text-xs rounded-full">
            🔥 10+ Trades
          </span>
        </div>
      </div>

      {/* Tabs */}
      <div className="flex border-b text-primary border-secondary/30 mb-4">
        <button
          className={`flex-1 py-3 ${
            activeTab === "overview"
              ? "border-b-2 border-primary font-semibold"
              : ""
          }`}
          onClick={() => setActiveTab("overview")}
        >
          Overview
        </button>
        <button
          className={`flex-1 py-3 ${
            activeTab === "trades"
              ? "border-b-2 border-primary font-semibold"
              : ""
          }`}
          onClick={() => setActiveTab("trades")}
        >
          Trades
        </button>
        <button
          className={`flex-1 py-3 ${
            activeTab === "competitions"
              ? "border-b-2 border-primary font-semibold"
              : ""
          }`}
          onClick={() => setActiveTab("competitions")}
        >
          Competitions
        </button>
      </div>

      {/* Content */}
      <div className="p-4 space-y-4">
        {activeTab === "overview" && (
          <>
            {/* Stats Grid */}
            <div className="grid grid-cols-3 gap-4 text-center">
              <div>
                <p className="text-2xl font-bold text-accent">
                  +{profileData.pnl}%
                </p>
                <p className="text-primary text-sm">PnL %</p>
                <TrendingUp size={16} className="mx-auto text-accent" />
              </div>
              <div>
                <p className="text-2xl font-bold text-primary">
                  {profileData.winRate}%
                </p>
                <p className="text-primary text-sm">Win Rate</p>
                <Target size={16} className="mx-auto text-primary" />
              </div>
              <div>
                <p className="text-2xl font-bold text-primary">
                  {profileData.sharpeRatio}
                </p>
                <p className="text-primary text-sm">Sharpe Ratio</p>
                <Award size={16} className="mx-auto text-primary" />
              </div>
            </div>

            {/* Equity Curve */}
            <div className="bg-secondary dark:bg-primary rounded-lg p-4">
              <div className="flex justify-between items-center mb-4">
                <h3 className="font-semibold text-primary">Equity Curve</h3>
                <span className="text-xs text-primary">All Time</span>
              </div>
              <ResponsiveContainer width="100%" height={200}>
                <LineChart data={profileData.equityCurveData}>
                  <CartesianGrid
                    strokeDasharray="3 3"
                    stroke="currentColor"
                    className="opacity-20 text-primary"
                  />
                  <XAxis dataKey="date" stroke="currentColor" fontSize={10} />
                  <YAxis stroke="currentColor" fontSize={10} />
                  <Tooltip />
                  <Line
                    type="monotone"
                    dataKey="value"
                    stroke="var(--color-accent)"
                    strokeWidth={2}
                    dot={false}
                  />
                </LineChart>
              </ResponsiveContainer>
            </div>
          </>
        )}

        {activeTab === "trades" && (
          <div className="space-y-3 text-sm text-primary">
            <div className="flex justify-between">
              <span>EUR/USD Long</span>
              <span className="text-accent">+2.3%</span>
            </div>
            <div className="flex justify-between">
              <span>BTC/USD Short</span>
              <span className="text-danger">-1.1%</span>
            </div>
            <div className="flex justify-between">
              <span>Gold Long</span>
              <span className="text-accent">+5.4%</span>
            </div>
          </div>
        )}

        {activeTab === "competitions" && (
          <div className="space-y-3 text-sm text-primary">
            <div className="flex justify-between">
              <span>March PnL Battle</span>
              <span className="text-accent">🥇 1st Place</span>
            </div>
            <div className="flex justify-between">
              <span>April Win Rate Challenge</span>
              <span className="text-danger">6th Place</span>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default Profile;
