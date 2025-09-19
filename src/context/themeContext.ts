import { createContext } from "react";

export type Theme = "light" | "dark";

export interface ThemeContextType {
  theme: Theme;
  toggleTheme: () => void;
}

// just the context
export const ThemeContext = createContext<ThemeContextType | null>(null);
