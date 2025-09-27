// src/services/users.ts
import { dummyUsers } from "../data/dummyUsers";

export type User = {
  id: string;
  name: string;
  username?: string;
  bio?: string;
  avatarUrl?: string;
  isVerified?: boolean;
  createAt?: Date;
  lastLogin?: Date;
  pnl?: number;
  winRate?: number;
  sharpeRatio?: number;
  equityCurveData?: { date: string; value: number }[];
  followers?: number;
  following?: number;
  email?: string;
  provider?: string;
  updatedAt?: Date;
};

export const fetchAllUsers = async (): Promise<User[]> => {
  return dummyUsers;
};

export const fetchUserById = async (id: string): Promise<User | undefined> => {
  return dummyUsers.find((u) => u.id === id);
};
