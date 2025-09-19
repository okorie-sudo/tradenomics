import { useState, useEffect, type ReactNode } from "react";
import { ThemeContext, type Theme } from "./themeContext";

export const ThemeProvider = ({ children }: { children: ReactNode }) => {
  const [theme, setTheme] = useState<Theme>("light");

  useEffect(() => {
    // 1. Load saved theme from localStorage
    const saved = localStorage.getItem("theme") as Theme | null;

    if (saved) {
      setTheme(saved);
      document.documentElement.setAttribute("data-theme", saved);
      return;
    }

    // 2. Fallback: detect system preference
    const prefersDark = window.matchMedia(
      "(prefers-color-scheme: dark)"
    ).matches;
    const defaultTheme: Theme = prefersDark ? "dark" : "light";

    setTheme(defaultTheme);
    document.documentElement.setAttribute("data-theme", defaultTheme);
  }, []);

  useEffect(() => {
    document.documentElement.setAttribute("data-theme", theme);
    localStorage.setItem("theme", theme);
  }, [theme]);

  const toggleTheme = () =>
    setTheme((prev) => (prev === "light" ? "dark" : "light"));

  return (
    <ThemeContext.Provider value={{ theme, toggleTheme }}>
      {children}
    </ThemeContext.Provider>
  );
};
