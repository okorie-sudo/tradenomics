import { useEffect } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { toast } from "sonner";
import { supabase } from "../services/supabase";

const AuthCallback = () => {
  const navigate = useNavigate();
  const location = useLocation();

  useEffect(() => {
    const handleCallback = async () => {
      const urlParams = new URLSearchParams(location.search);
      const type = urlParams.get("type");

      if (type === "signup") {
        console.log("AuthCallback: Handling email verification callback");
        const { data, error } = await supabase.auth.getSession();
        if (error || !data.session) {
          console.error(
            "AuthCallback: No session after verification:",
            error?.message
          );
          toast.error("Email verification failed. Please log in.");
          navigate("/auth");
          return;
        }
        console.log("AuthCallback: Session after verification:", {
          userId: data.session.user.id,
        });
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
          console.error(
            "AuthCallback: Error creating user profile:",
            userDocError
          );
          toast.error("Failed to create user profile: " + userDocError.message);
          navigate("/auth");
          return;
        }
        toast.success("Email verified! Logging you in...");
        navigate("/feed");
      } else {
        // Handle Google OAuth or other callbacks
        const { data, error } = await supabase.auth.getSession();
        if (error || !data.session) {
          console.error("AuthCallback: Error getting session:", error?.message);
          toast.error("Authentication failed. Please try again.");
          navigate("/auth");
          return;
        }
        console.log("AuthCallback: Session retrieved:", data.session.user.id);
        navigate("/feed");
      }
    };
    handleCallback();
  }, [navigate, location]);

  return <div>Loading...</div>;
};

export default AuthCallback;
