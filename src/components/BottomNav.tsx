import { useLocation, Link } from "react-router-dom";
import { Check, Trophy, Plus, MessageSquare, User } from "lucide-react";

export default function BottomNav() {
  const { pathname } = useLocation();

  return (
    <nav className="fixed bottom-0 left-0 right-0 z-10 bg-secondary text-primary dark:bg-gray-900 border-t border-black/10 dark:border-white/10 shadow-md flex justify-around items-center py-2 text-xs">
      <Link
        to="/feed"
        className={`flex flex-col items-center ${
          pathname === "/feed"
            ? "text-primary/50 bg-primary/20 px-2 py-1 rounded-lg "
            : "text-primary"
        }`}
      >
        <Check size={24} />
        <span>Feed</span>
      </Link>
      <Link
        to="/leaderboard"
        className={`flex flex-col items-center ${
          pathname === "/leaderboard"
            ? "text-primary/50 bg-primary/20 rounded-lg px-2 py-1"
            : "text-primary"
        }`}
      >
        <Trophy size={24} />
        <span>Leaderboard</span>
      </Link>
      <Link
        to="/create"
        className={`flex flex-col items-center ${
          pathname === "/create"
            ? "text-primary/50 bg-primary/20 rounded-lg px-2 py-1"
            : "text-primary"
        }`}
      >
        <Plus size={24} />
      </Link>
      <Link
        to="/messages"
        className={`flex flex-col items-center ${
          pathname === "/messages"
            ? "text-primary/50 bg-primary/20 rounded-lg px-2 py-1"
            : "text-primary"
        }`}
      >
        <MessageSquare size={24} />
        <span>Messages</span>
      </Link>
      <Link
        to="/profile"
        className={`flex flex-col items-center ${
          pathname === "/profile"
            ? "text-primary/50 bg-primary/20 rounded-lg px-2 py-1"
            : "text-primary"
        }`}
      >
        <User size={24} />
        <span>Profile</span>
      </Link>
    </nav>
  );
}
