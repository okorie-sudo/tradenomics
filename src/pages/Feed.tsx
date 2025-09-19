// src/pages/Feed.tsx
import { useAuth } from "../hooks/useAuth";

export default function Feed() {
  const { user, signOut } = useAuth();

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-secondary text-primary">
      <h1 className="text-2xl font-bold mb-4">
        Welcome, {user?.email || user?.uid}
      </h1>
      <button
        onClick={signOut}
        className="bg-accent text-secondary py-2 px-4 rounded"
      >
        Sign Out
      </button>
    </div>
  );
}
