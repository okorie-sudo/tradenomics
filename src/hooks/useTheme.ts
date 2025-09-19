// src/hooks/useTheme.ts
import { useContext } from "react";
import { ThemeContext } from "../context/themeContext";

export const useTheme = () => {
  const ctx = useContext(ThemeContext);
  if (!ctx) throw new Error("useTheme must be inside ThemeProvider");
  return ctx;
};
