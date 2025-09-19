import { useState } from "react";
import { auth, db } from "../services/firebase";
import { FirebaseError } from "firebase/app";
import {
  signInWithEmailAndPassword,
  createUserWithEmailAndPassword,
  GoogleAuthProvider,
  signInWithPopup,
} from "firebase/auth";
import {
  doc,
  setDoc,
  getDoc,
  serverTimestamp,
  collection,
  query,
  where,
  getDocs,
} from "firebase/firestore";
import { isValidEmail, isStrongPassword } from "../utils/validators";
import PasswordStrength from "../components/PasswordStrength";
import { toast } from "sonner";

export default function AuthPage() {
  const [tab, setTab] = useState<"login" | "signup">("login");

  // shared state
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [username, setUsername] = useState("");

  const initUserDoc = async (
    uid: string,
    email: string,
    username: string,
    provider: string
  ) => {
    const userRef = doc(db, "users", uid);
    const snapshot = await getDoc(userRef);

    if (!snapshot.exists()) {
      await setDoc(userRef, {
        uid,
        email,
        username,
        createdAt: serverTimestamp(),
        updatedAt: serverTimestamp(),
        avatarUrl: "",
        bio: "",
        location: "",
        totalTrades: 0,
        winRate: 0,
        avgReturn: 0,
        sharpeRatio: null,
        maxDrawdown: null,
        followers: 0,
        following: 0,
        theme: "light",
        notificationsEnabled: true,
        provider,
        lastLogin: serverTimestamp(),
        isVerified: false,
      });
    } else {
      await setDoc(
        userRef,
        { lastLogin: serverTimestamp(), updatedAt: serverTimestamp() },
        { merge: true }
      );
    }
  };

  const isUsernameTaken = async (username: string) => {
    const q = query(collection(db, "users"), where("username", "==", username));
    const snapshot = await getDocs(q);
    return !snapshot.empty;
  };

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const { user } = await signInWithEmailAndPassword(auth, email, password);
      await initUserDoc(
        user.uid,
        user.email || "",
        user.displayName || "",
        "email"
      );
      toast.success("Welcome back!");
    } catch (err: unknown) {
      if (err instanceof FirebaseError) {
        toast.error(err.message);
      } else {
        toast.error("Unexpected error");
      }
    }
  };

  const handleSignup = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!username.trim()) {
      toast.error("Username is required");
      return;
    }
    if (!isValidEmail(email)) {
      toast.error("Please enter a valid email address");
      return;
    }
    if (!isStrongPassword(password)) {
      toast.error("Password is too weak");
      return;
    }
    if (password !== confirmPassword) {
      toast.error("Passwords do not match");
      return;
    }

    const taken = await isUsernameTaken(username);
    if (taken) {
      toast.error("Username is already taken");
      return;
    }

    try {
      const { user } = await createUserWithEmailAndPassword(
        auth,
        email,
        password
      );
      await initUserDoc(user.uid, user.email || "", username, "email");
      toast.success("Account created successfully!");
    } catch (err: unknown) {
      if (err instanceof FirebaseError) {
        toast.error(err.message);
      } else {
        toast.error("Unexpected error");
      }
    }
  };

  const handleGoogleAuth = async () => {
    const provider = new GoogleAuthProvider();
    try {
      const result = await signInWithPopup(auth, provider);
      const user = result.user;
      await initUserDoc(
        user.uid,
        user.email || "",
        user.displayName || "",
        "google"
      );
      toast.success("Signed in with Google");
    } catch (err: unknown) {
      if (err instanceof FirebaseError) {
        toast.error(err.message);
      } else {
        toast.error("Unexpected error");
      }
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-white text-black">
      <div className="w-full max-w-md p-8 bg-white border border-black/10 rounded-lg shadow-md">
        {/* Tabs */}
        <div className="flex justify-center mb-6">
          <button
            className={`flex-1 py-2 text-lg font-semibold transition-colors ${
              tab === "login"
                ? "border-b-2 border-black text-black"
                : "text-black/50 hover:text-black"
            }`}
            onClick={() => setTab("login")}
          >
            Login
          </button>
          <button
            className={`flex-1 py-2 text-lg font-semibold transition-colors ${
              tab === "signup"
                ? "border-b-2 border-black text-black"
                : "text-black/50 hover:text-black"
            }`}
            onClick={() => setTab("signup")}
          >
            Signup
          </button>
        </div>

        {/* Login Form */}
        {tab === "login" && (
          <form onSubmit={handleLogin} className="flex flex-col gap-4">
            <input
              type="email"
              placeholder="Email"
              className="bg-white border border-black/10 p-3 rounded-md text-black placeholder-black/50 focus:outline-none focus:border-black"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            />
            <input
              type="password"
              placeholder="Password"
              className="bg-white border border-black/10 p-3 rounded-md text-black placeholder-black/50 focus:outline-none focus:border-black"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
            />
            <button
              type="submit"
              className="bg-black text-white py-3 rounded-md font-semibold hover:bg-black/80 transition-colors"
            >
              Login
            </button>
            <button
              type="button"
              onClick={handleGoogleAuth}
              className="bg-white border border-black/10 py-3 rounded-md text-black font-semibold hover:bg-black/5 transition-colors"
            >
              Continue with Google
            </button>
          </form>
        )}

        {/* Signup Form */}
        {tab === "signup" && (
          <form onSubmit={handleSignup} className="flex flex-col gap-4">
            <input
              type="text"
              placeholder="Username"
              className="bg-white border border-black/10 p-3 rounded-md text-black placeholder-black/50 focus:outline-none focus:border-black"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
            />
            <input
              type="email"
              placeholder="Email"
              className="bg-white border border-black/10 p-3 rounded-md text-black placeholder-black/50 focus:outline-none focus:border-black"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            />
            <div>
              <input
                type="password"
                placeholder="Password"
                className="bg-white border border-black/10 p-3 rounded-md text-black placeholder-black/50 focus:outline-none focus:border-black w-full"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
              />
              <PasswordStrength password={password} />
            </div>
            <input
              type="password"
              placeholder="Confirm Password"
              className="bg-white border border-black/10 p-3 rounded-md text-black placeholder-black/50 focus:outline-none focus:border-black"
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
            />
            <button
              type="submit"
              className="bg-black text-white py-3 rounded-md font-semibold hover:bg-black/80 transition-colors"
            >
              Sign Up
            </button>
          </form>
        )}
      </div>
    </div>
  );
}
