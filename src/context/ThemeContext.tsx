import { useState, useEffect, type ReactNode } from "react";
import { ThemeContext, type Theme } from "./themeContext";

export const ThemeProvider = ({ children }: { children: ReactNode }) => {
  const [theme, setTheme] = useState<Theme>(() => {
    // Load saved theme from localStorage only
    const saved = localStorage.getItem("theme") as Theme | null;
    return saved ?? "light"; // default to light if nothing saved
  });

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
