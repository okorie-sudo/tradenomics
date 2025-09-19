import { useTheme } from "../hooks/useTheme";
import { Moon, Sun } from "lucide-react";

export default function ThemeToggle() {
  const { theme, toggleTheme } = useTheme();

  return (
    <button onClick={toggleTheme} className="">
      {theme === "light" ? (
        <Moon className="w-10 h-10" />
      ) : (
        <Sun className="w-10 h-10" />
      )}
    </button>
  );
}
