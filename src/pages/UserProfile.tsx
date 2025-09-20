// src/pages/UserProfile.tsx
import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { Check, TrendingUp, Target, Award } from "lucide-react";
import { fetchUserById } from "../services/users";
import type { User } from "../data/dummyUsers";
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from "recharts";

const UserProfile: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const [user, setUser] = useState<User | undefined>(undefined);
  const [activeTab, setActiveTab] = useState<
    "overview" | "trades" | "competitions"
  >("overview");
  const [isFollowing, setIsFollowing] = useState(false);

  useEffect(() => {
    const loadUser = async () => {
      if (id) {
        const data = await fetchUserById(id);
        setUser(data);
      }
    };
    loadUser();
  }, [id]);

  if (!user) {
    return (
      <div className="flex-1 flex items-center justify-center bg-secondary dark:bg-primary min-h-screen">
        <p className="text-primary">User not found.</p>
      </div>
    );
  }

  return (
    <div className="flex-1 flex flex-col bg-secondary dark:bg-primary min-h-screen">
      {/* Header */}
      <div className="p-4 border-b border-secondary/30 text-center">
        <h1 className="text-xl font-bold text-primary">Profile</h1>
      </div>

      {/* Profile Header */}
      <div className="p-4">
        <div className="flex items-center flex-col gap-4 mb-4">
          <img
            src={user.avatarUrl}
            alt={user.name}
            className="w-20 h-20 rounded-full object-cover"
          />
          <div>
            <div className="flex items-center justify-center gap-2 mb-1">
              <h2 className="text-xl font-bold text-primary">{user.name}</h2>
              {user.isVerified && (
                <span className="inline-flex items-center px-2 py-1 bg-green-100 text-green-800 text-xs font-medium rounded-full">
                  <Check size={12} className="mr-1" /> Verified
                </span>
              )}
            </div>
            <p className="text-gray-500 text-center mb-2">{user.handle}</p>
            <p className="text-primary text-center">{user.bio}</p>
          </div>
        </div>

        {/* Followers/Following */}
        <div className="flex justify-around text-sm text-primary mb-4">
          <div>
            <p className="font-bold">{user.following}</p>
            <p>Following</p>
          </div>
          <div>
            <p className="font-bold">{user.followers}</p>
            <p>Followers</p>
          </div>
        </div>

        {/* Follow/Unfollow button */}
        <button
          onClick={() => setIsFollowing(!isFollowing)}
          className={`w-full py-2 rounded mb-4 ${
            isFollowing ? "bg-black text-white" : "bg-gray-200 text-black"
          }`}
        >
          {isFollowing ? "Following" : "Follow"}
        </button>
      </div>

      {/* Tabs */}
      <div className="flex border-b border-secondary/30 mb-4">
        <button
          className={`flex-1 py-3 ${
            activeTab === "overview"
              ? "border-b-2 border-black dark:border-white text-primary font-semibold"
              : "text-secondary"
          }`}
          onClick={() => setActiveTab("overview")}
        >
          Overview
        </button>
        <button
          className={`flex-1 py-3 ${
            activeTab === "trades"
              ? "border-b-2 border-black dark:border-white text-primary font-semibold"
              : "text-secondary"
          }`}
          onClick={() => setActiveTab("trades")}
        >
          Trades
        </button>
        <button
          className={`flex-1 py-3 ${
            activeTab === "competitions"
              ? "border-b-2 border-black dark:border-white text-primary font-semibold"
              : "text-secondary"
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
            {/* Stats */}
            <div className="grid grid-cols-3 gap-4 text-center">
              <div>
                <p className="text-2xl font-bold text-green-600">
                  +{user.pnl}%
                </p>
                <p className="text-gray-500 text-sm">PnL %</p>
                <TrendingUp size={16} className="mx-auto text-green-500" />
              </div>
              <div>
                <p className="text-2xl font-bold">{user.winRate}%</p>
                <p className="text-gray-500 text-sm">Win Rate</p>
                <Target size={16} className="mx-auto" />
              </div>
              <div>
                <p className="text-2xl font-bold">{user.sharpeRatio}</p>
                <p className="text-gray-500 text-sm">Sharpe</p>
                <Award size={16} className="mx-auto" />
              </div>
            </div>

            {/* Equity Curve */}
            <div className="bg-gray-50 dark:bg-gray-800 rounded-lg p-4">
              <div className="flex justify-between items-center mb-4">
                <h3 className="font-semibold">Equity Curve</h3>
                <span className="text-xs text-secondary">All Time</span>
              </div>
              <ResponsiveContainer width="100%" height={200}>
                <LineChart data={user.equityCurveData}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
                  <XAxis dataKey="date" stroke="#9ca3af" fontSize={10} />
                  <YAxis stroke="#9ca3af" fontSize={10} />
                  <Tooltip />
                  <Line
                    type="monotone"
                    dataKey="value"
                    stroke="#10b981"
                    strokeWidth={2}
                    dot={false}
                  />
                </LineChart>
              </ResponsiveContainer>
            </div>
          </>
        )}

        {activeTab === "trades" && (
          <div className="text-center text-secondary">
            Trades coming soon...
          </div>
        )}

        {activeTab === "competitions" && (
          <div className="text-center text-secondary">
            Competitions coming soon...
          </div>
        )}
      </div>
    </div>
  );
};

export default UserProfile;
