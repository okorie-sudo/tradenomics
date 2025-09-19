// src/context/authContext.ts
import { createContext } from "react";
import type { User } from "firebase/auth";

export type AuthContextType = {
  user: User | null;
  loading: boolean;
  signOut: () => Promise<void>;
};

// context only — default is null; consumers must check
export const AuthContext = createContext<AuthContextType | null>(null);
