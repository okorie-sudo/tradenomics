import { useState, useEffect } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { toast } from "sonner";
import { useAuth } from "../hooks/useAuth";
import { supabase } from "../services/supabase";

export default function AuthPage() {
  const navigate = useNavigate();
  const location = useLocation();
  const { user, loading, signIn, signUp, signInWithOAuth } = useAuth();
  const [tab, setTab] = useState<"login" | "signup">("login");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [username, setUsername] = useState("");
  const [showVerificationMessage, setShowVerificationMessage] = useState(false);

  console.log(
    "Auth.tsx: user:",
    user ? { id: user.id, email: user.email } : "null or undefined",
    "loading:",
    loading
  );

  // Handle email verification callback
  useEffect(() => {
    const handleEmailVerification = async () => {
      const urlParams = new URLSearchParams(location.search);
      const type = urlParams.get("type");
      if (type === "signup") {
        console.log("Auth.tsx: Handling email verification callback");
        const { data, error } = await supabase.auth.getSession();
        if (error || !data.session) {
          console.error(
            "Auth.tsx: No session after verification:",
            error?.message
          );
          toast.error("Email verification failed. Please log in.");
          setTab("login");
          return;
        }
        console.log("Auth.tsx: Session after verification:", {
          userId: data.session.user.id,
        });
        toast.success("Email verified! Logging you in...");
        const { error: userDocError } = await supabase.from("users").insert({
          id: data.session.user.id,
          email: data.session.user.email || "",
          username:
            data.session.user.user_metadata.username ||
            `user_${data.session.user.id.slice(0, 8)}`,
          createdAt: new Date().toISOString(),
          updatedAt: new Date().toISOString(),
          provider: "email",
          lastLogin: new Date().toISOString(),
        });
        if (userDocError) {
          console.error("Auth.tsx: Error creating user profile:", userDocError);
          toast.error("Failed to create user profile: " + userDocError.message);
          return;
        }
        navigate("/feed");
      }
    };
    if (location.search.includes("type=signup")) {
      handleEmailVerification();
    }
  }, [location, navigate]);

  // Handle Google OAuth user initialization
  useEffect(() => {
    if (user && user.app_metadata.provider === "google") {
      const initGoogleUser = async () => {
        try {
          console.log("Auth.tsx: Checking session for Google user:", user.id);
          const { data: sessionData, error: sessionError } =
            await supabase.auth.getSession();
          if (sessionError || !sessionData.session) {
            console.error(
              "Auth.tsx: No session for Google user:",
              sessionError?.message
            );
            toast.error("No active session for Google user");
            return;
          }
          console.log("Auth.tsx: Session for Google user:", {
            userId: sessionData.session.user.id,
          });
          const { data: existingUsers, error: fetchError } = await supabase
            .from("users")
            .select("id")
            .eq("id", user.id);
          if (fetchError) {
            console.error("Auth.tsx: Error fetching user:", fetchError);
            toast.error(
              "Failed to check Google user profile: " + fetchError.message
            );
            return;
          }
          if (!existingUsers?.length) {
            const googleUsername =
              user.user_metadata.preferred_username ||
              `user_${user.id.slice(0, 8)}`;
            console.log("Auth.tsx: Creating Google user profile:", {
              id: user.id,
              email: user.email,
              username: googleUsername,
            });
            await initUserDoc(
              user.id,
              user.email || "",
              googleUsername,
              "google"
            );
            toast.success("Google user profile created!");
          } else {
            console.log("Auth.tsx: Google user already exists:", user.id);
          }
        } catch (err) {
          console.error("Auth.tsx: Error initializing Google user:", err);
          toast.error(
            "Failed to initialize Google user profile: " +
              (err instanceof Error ? err.message : "Unknown error")
          );
        }
      };
      initGoogleUser();
    }
  }, [user]);

  // Redirect if already logged in
  if (!loading && user) {
    console.log("Auth.tsx: Redirecting to /feed because user exists:", user.id);
    navigate("/feed");
    return null;
  }

  // Show loading state
  if (loading) {
    return <div>Loading...</div>;
  }

  // Show verification message
  if (showVerificationMessage) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-secondary text-primary">
        <div className="w-full max-w-md p-8 bg-secondary text-primary border-black/10 rounded-lg shadow-md">
          <h2 className="text-2xl font-semibold text-center mb-6">
            Check Your Email
          </h2>
          <p className="text-center text-black/70">
            A verification link has been sent to {email}. Please verify your
            email to continue.
          </p>
          <button
            className="mt-4 w-full bg-black text-white py-3 rounded-md font-semibold hover:bg-black/80 transition-colors"
            onClick={() => {
              setShowVerificationMessage(false);
              setTab("login");
            }}
          >
            Go to Login
          </button>
        </div>
      </div>
    );
  }

  const initUserDoc = async (
    uid: string,
    email: string,
    username: string,
    provider: string
  ) => {
    console.log("Auth.tsx: Initializing user doc for:", {
      uid,
      email,
      username,
      provider,
    });
    try {
      const { data: sessionData, error: sessionError } =
        await supabase.auth.getSession();
      if (sessionError || !sessionData.session) {
        console.error(
          "Auth.tsx: No session for user:",
          uid,
          sessionError?.message
        );
        throw new Error("No active session for user document creation");
      }
      console.log("Auth.tsx: Session confirmed for user:", {
        userId: sessionData.session.user.id,
      });

      const { data: existingUsers, error: fetchError } = await supabase
        .from("users")
        .select("id")
        .eq("id", uid);
      if (fetchError) {
        console.error("Auth.tsx: Error fetching user:", fetchError);
        throw new Error(
          `Failed to check user existence: ${fetchError.message}`
        );
      }

      if (!existingUsers?.length) {
        console.log("Auth.tsx: Inserting new user profile:", {
          uid,
          email,
          username,
          provider,
        });
        const { error } = await supabase.from("users").insert({
          id: uid,
          email,
          username,
          createdAt: new Date().toISOString(),
          updatedAt: new Date().toISOString(),
          provider,
          lastLogin: new Date().toISOString(),
        });
        if (error) {
          console.error("Auth.tsx: Error inserting user:", error);
          throw new Error(`Failed to insert user: ${error.message}`);
        }
        console.log("Auth.tsx: User profile inserted successfully:", uid);
      } else {
        console.log("Auth.tsx: Updating existing user:", uid);
        const { error } = await supabase
          .from("users")
          .update({
            lastLogin: new Date().toISOString(),
            updatedAt: new Date().toISOString(),
          })
          .eq("id", uid);
        if (error) {
          console.error("Auth.tsx: Error updating user:", error);
          throw new Error(`Failed to update user: ${error.message}`);
        }
        console.log("Auth.tsx: User profile updated successfully:", uid);
      }
    } catch (err: unknown) {
      console.error("Auth.tsx: Error in initUserDoc:", err);
      throw err instanceof Error
        ? err
        : new Error("Unknown error in initUserDoc");
    }
  };

  const isUsernameTaken = async (username: string) => {
    console.log("Auth.tsx: Checking if username is taken:", username);
    try {
      const { data, error } = await supabase
        .from("users")
        .select("username")
        .eq("username", username);
      if (error) {
        console.error("Auth.tsx: Error checking username:", error);
        throw new Error(`Failed to check username: ${error.message}`);
      }
      console.log(
        "Auth.tsx: Username check result:",
        data.length > 0 ? "Taken" : "Available"
      );
      return data.length > 0;
    } catch (err: unknown) {
      console.error("Auth.tsx: Error in isUsernameTaken:", err);
      throw err;
    }
  };

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      console.log("Auth.tsx: Attempting login with email:", email);
      await signIn(email, password);
      console.log("Auth.tsx: Login successful");
      toast.success("Welcome back!");
      navigate("/feed");
    } catch (err: unknown) {
      console.error(
        "Auth.tsx: Login error:",
        err instanceof Error ? err.message : "Unknown error"
      );
      toast.error(err instanceof Error ? err.message : "Failed to log in");
    }
  };

  const handleSignup = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!username.trim()) {
      toast.error("Username is required");
      return;
    }
    if (!email.includes("@") || !email.includes(".")) {
      toast.error("Please enter a valid email address");
      return;
    }
    if (password.length < 6) {
      toast.error("Password must be at least 6 characters");
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
      console.log(
        "Auth.tsx: Attempting signup with email:",
        email,
        "username:",
        username
      );
      const { user: newUser, session } = await signUp(
        email,
        password,
        username
      );
      console.log(
        "Auth.tsx: Signup response:",
        newUser ? { userId: newUser.id } : "No user"
      );
      if (newUser && !session) {
        setShowVerificationMessage(true);
        toast.success("Please check your email to verify your account");
        return;
      }
      if (newUser && session) {
        await initUserDoc(newUser.id, email, username, "email");
        toast.success("Account created successfully!");
        navigate("/feed");
      } else {
        throw new Error("No user returned after signup");
      }
    } catch (err: unknown) {
      console.error(
        "Auth.tsx: Signup error:",
        err instanceof Error ? err.message : "Unknown error"
      );
      toast.error(err instanceof Error ? err.message : "Failed to sign up");
    }
  };

  const handleGoogleAuth = async () => {
    try {
      console.log("Auth.tsx: Initiating Google OAuth");
      await signInWithOAuth(
        "google",
        `${window.location.origin}/auth/callback`
      );
      toast.success("Redirecting to Google login...");
      console.log("Auth.tsx: Google OAuth initiated, redirecting...");
    } catch (err: unknown) {
      console.error(
        "Auth.tsx: Google OAuth error:",
        err instanceof Error ? err.message : "Unknown error"
      );
      toast.error(
        err instanceof Error ? err.message : "Failed to log in with Google"
      );
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-secondary text-primary">
      <div className="w-full max-w-md p-8 bg-secondary text-primary border-black/10 rounded-lg shadow-md">
        <div className="flex justify-center mb-6">
          <button
            className={`flex-1 py-2 text-lg font-semibold transition-colors ${
              tab === "login"
                ? "border-b-2 border-black text-primary"
                : "text-primary/50 hover:text-primary"
            }`}
            onClick={() => setTab("login")}
          >
            Login
          </button>
          <button
            className={`flex-1 py-2 text-lg font-semibold transition-colors ${
              tab === "signup"
                ? "border-b-2 border-black text-primary"
                : "text-primary/50 hover:text-primary"
            }`}
            onClick={() => setTab("signup")}
          >
            Signup
          </button>
        </div>

        {tab === "login" && (
          <form onSubmit={handleLogin} className="flex flex-col gap-4">
            <input
              type="email"
              placeholder="Email"
              className="bg-secondary border border-black/10 p-3 rounded-md text-primary placeholder-black/50 focus:outline-none focus:border-black"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            />
            <input
              type="password"
              placeholder="Password"
              className="bg-secondary border border-black/10 p-3 rounded-md text-primary placeholder-black/50 focus:outline-none focus:border-black"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
            />
            <button
              type="submit"
              className="bg-primary text-secondary py-3 rounded-md font-semibold hover:bg-primary/50 transition-colors"
            >
              Login
            </button>
            <button
              type="button"
              onClick={handleGoogleAuth}
              className="bg-primary border border-black/10 py-3 rounded-md text-black font-semibold hover:bg-black/5 transition-colors"
            >
              Continue with Google
            </button>
          </form>
        )}

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
            <input
              type="password"
              placeholder="Password"
              className="bg-white border border-black/10 p-3 rounded-md text-black placeholder-black/50 focus:outline-none focus:border-black"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
            />
            <input
              type="password"
              placeholder="Confirm Password"
              className="bg-white border border-black/10 p-3 rounded-md text-black placeholder-black/50 focus:outline-none focus:border-black"
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
            />
            <button
              type="submit"
              className="bg-primary text-secondary py-3 rounded-md font-semibold hover:bg-black/80 transition-colors"
            >
              Sign Up
            </button>
          </form>
        )}
      </div>
    </div>
  );
}
