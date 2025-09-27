// src/pages/Auth.tsx
import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { toast } from "sonner";
import { useAuth } from "../hooks/useAuth";
import { supabase } from "../services/supabase";

export default function AuthPage() {
  const navigate = useNavigate();
  // const location = useLocation();
  const { user, loading, signIn, signUp, signInWithOAuth } = useAuth();
  const [tab, setTab] = useState<"login" | "signup">("login");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [username, setUsername] = useState("");
  const [showVerificationMessage, setShowVerificationMessage] = useState(false);

  // Handle Google OAuth user initialization
  useEffect(() => {
    if (!user) return;
    const provider =
      user.app_metadata?.provider || user.identities?.[0]?.provider;
    if (provider === "google")
      initUserDoc(
        user.id,
        user.email ?? "",
        username || `user_${user.id.slice(0, 6)}`,
        "google"
      );
  }, [user]);

  // Redirect if already logged in
  useEffect(() => {
    if (!loading && user) navigate("/feed");
  }, [loading, user, navigate]);

  const initUserDoc = async (
    uid: string,
    email: string,
    username: string,
    provider: string
  ) => {
    try {
      const { data: existing, error: fetchError } = await supabase
        .from("users")
        .select("id")
        .eq("id", uid);
      if (fetchError) throw new Error(fetchError.message);

      if (existing && existing.length > 0) {
        await supabase
          .from("users")
          .update({
            lastLogin: new Date().toISOString(),
            updatedAt: new Date().toISOString(),
          })
          .eq("id", uid);
        return;
      }

      const { error: insertError } = await supabase.from("users").insert({
        id: uid,
        email,
        username,
        provider,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
        lastLogin: new Date().toISOString(),
      });
      if (insertError) throw new Error(insertError.message);
      console.log("User inserted:", uid);
    } catch (err: unknown) {
      if (err instanceof Error) {
        console.error("initUserDoc:", err.message);
        toast.error(`Failed to init user: ${err.message}`);
      }
    }
  };

  const isUsernameTaken = async (username: string) => {
    const { data, error } = await supabase
      .from("users")
      .select("username")
      .eq("username", username);
    if (error) throw new Error(error.message);
    return data.length > 0;
  };

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await signIn(email, password);
      toast.success("Welcome back!");
      navigate("/feed");
    } catch (err: unknown) {
      toast.error(err instanceof Error ? err.message : "Failed to log in");
    }
  };

  const handleSignup = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!username.trim()) return toast.error("Username is required");
    if (!email.includes("@")) return toast.error("Invalid email");
    if (password.length < 8) return toast.error("Password too short");
    if (password !== confirmPassword)
      return toast.error("Passwords do not match");

    const taken = await isUsernameTaken(username);
    if (taken) return toast.error("Username is already taken");

    try {
      const { user: newUser } = await signUp(email, password, username);
      if (newUser) {
        setShowVerificationMessage(true);
        toast.success("Check your email to verify");
        await initUserDoc(newUser.id, email, username, "email");

        setTimeout(() => {
          toast.success("Account created!");
          navigate("/auth");
        }, 7000);
        return;
      }
      // if (newUser && session) {
      //   await initUserDoc(newUser.id, email, username, "email");
      //   toast.success("Account created!");
      //   navigate("/feed");
      // }
    } catch (err: unknown) {
      toast.error(err instanceof Error ? err.message : "Signup failed");
    }
  };

  const handleGoogleAuth = async () => {
    try {
      const googleLoginResult = await signInWithOAuth(
        "google",
        `${window.location.origin}/auth/callback`
      );
      toast.success("Redirecting to Google...");
      console.log(googleLoginResult);
    } catch (err: unknown) {
      toast.error(err instanceof Error ? err.message : "Google auth failed");
    }
  };

  if (loading) return <div>Loading...</div>;
  if (showVerificationMessage)
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="max-w-md text-center">
          <h2 className="text-2xl font-semibold">Check your email</h2>
          <p>A verification link has been sent to {email}</p>
        </div>
      </div>
    );

  return (
    <div className="min-h-screen flex items-center justify-center bg-secondary text-primary">
      <div className="w-full max-w-md p-8 bg-secondary rounded-lg shadow-md">
        <div className="flex justify-center mb-6">
          <button
            className={`flex-1 py-2 text-lg font-semibold ${
              tab === "login" ? "border-b-2 border-black" : "opacity-60"
            }`}
            onClick={() => setTab("login")}
          >
            Login
          </button>
          <button
            className={`flex-1 py-2 text-lg font-semibold ${
              tab === "signup" ? "border-b-2 border-black" : "opacity-60"
            }`}
            onClick={() => setTab("signup")}
          >
            Signup
          </button>
        </div>

        {tab === "login" ? (
          <form onSubmit={handleLogin} className="flex flex-col gap-4">
            <input
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="Email"
              type="email"
            />
            <input
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="Password"
              type="password"
            />
            <button
              type="submit"
              className="bg-primary text-secondary py-3 rounded-md"
            >
              Login
            </button>
            <button
              type="button"
              onClick={handleGoogleAuth}
              className="border py-3 rounded-md"
            >
              Continue with Google
            </button>
          </form>
        ) : (
          <form onSubmit={handleSignup} className="flex flex-col gap-4">
            <input
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              placeholder="Username"
            />
            <input
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="Email"
              type="email"
            />
            <input
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="Password"
              type="password"
            />
            <input
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              placeholder="Confirm Password"
              type="password"
            />
            <button
              type="submit"
              className="bg-primary text-secondary py-3 rounded-md"
            >
              Sign Up
            </button>
          </form>
        )}
      </div>
    </div>
  );
}
