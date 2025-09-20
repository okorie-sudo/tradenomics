import { useLocation, Link } from "react-router-dom";
import { Check, Trophy, Plus, MessageSquare, User } from "lucide-react";

export default function BottomNav() {
  const { pathname } = useLocation();

  return (
    <nav className="fixed bottom-0 left-0 right-0 z-10 bg-white dark:bg-gray-900 border-t border-black/10 dark:border-white/10 shadow-md flex justify-around items-center py-2 text-xs">
      <Link
        to="/feed"
        className={`flex flex-col items-center ${
          pathname === "/feed" ? "text-primary" : "text-primary/50"
        }`}
      >
        <Check size={24} />
        <span>Feed</span>
      </Link>
      <Link
        to="/leaderboard"
        className={`flex flex-col items-center ${
          pathname === "/leaderboard" ? "text-primary" : "text-primary/50"
        }`}
      >
        <Trophy size={24} />
        <span>Leaderboard</span>
      </Link>
      <Link
        to="/create"
        className={`flex flex-col items-center ${
          pathname === "/create" ? "text-primary" : "text-primary/50"
        }`}
      >
        <Plus size={24} />
      </Link>
      <Link
        to="/messages"
        className={`flex flex-col items-center ${
          pathname === "/messages" ? "text-primary" : "text-primary/50"
        }`}
      >
        <MessageSquare size={24} />
        <span>Messages</span>
      </Link>
      <Link
        to="/profile"
        className={`flex flex-col items-center ${
          pathname === "/profile" ? "text-primary" : "text-primary/50"
        }`}
      >
        <User size={24} />
        <span>Profile</span>
      </Link>
    </nav>
  );
}
