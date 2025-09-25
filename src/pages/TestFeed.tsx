import { useContext, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { AuthContext } from "../context/authContext";
import { toast } from "sonner";
import { useAuth } from "../hooks/useAuth";

export default function Feed() {
  const { user, loading } = useContext(AuthContext);
  const { signOut } = useAuth();
  const navigate = useNavigate();

  console.log(
    "Feed.tsx: user:",
    user ? { id: user.id, email: user.email } : "null or undefined",
    "loading:",
    loading
  );

  useEffect(() => {
    if (!loading && !user) {
      console.log("Feed.tsx: No user, redirecting to /");
      navigate("/auth");
    }
  }, [user, loading, navigate]);

  if (loading) {
    return <div>Loading...</div>;
  }

  if (!user) {
    return null; // Prevent rendering until redirect
  }

  const handleLogout = async () => {
    try {
      console.log("Feed.tsx: Attempting logout");
      await signOut();
      navigate("/");
    } catch (err) {
      console.error("Feed.tsx: Logout failed:", err);
      toast.error("Failed to log out");
    }
  };

  return (
    <div>
      <h1>Feed Page</h1>
      <p>Logged in as {user.email}</p>
      <button
        onClick={handleLogout}
        className="bg-black text-white py-2 px-4 rounded-md font-semibold hover:bg-black/80 transition-colors"
      >
        Log Out
      </button>
    </div>
  );
}
