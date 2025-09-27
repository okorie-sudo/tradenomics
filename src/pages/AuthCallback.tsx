// src/pages/AuthCallback.tsx
import { useEffect } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { toast } from "sonner";
import { supabase } from "../services/supabase";

const AuthCallback = () => {
  const navigate = useNavigate();
  const location = useLocation();

  useEffect(() => {
    const handleCallback = async () => {
      const { data, error } = await supabase.auth.getSession();
      if (error || !data.session) {
        toast.error("Authentication failed. Try again.");
        return navigate("/auth");
      }

      const user = data.session.user;
      const { data: existing, error: fetchError } = await supabase
        .from("users")
        .select("id")
        .eq("id", user.id);

      if (fetchError) {
        toast.error(fetchError.message);
        return navigate("/auth");
      }

      if (!existing.length) {
        const username =
          user.user_metadata?.username || `user_${user.id.slice(0, 8)}`;
        const { error: insertError } = await supabase.from("users").insert({
          id: user.id,
          email: user.email,
          username,
          provider: user.app_metadata?.provider ?? "email",
          createdAt: new Date().toISOString(),
          updatedAt: new Date().toISOString(),
          lastLogin: new Date().toISOString(),
        });
        if (insertError) toast.error(insertError.message);
      }

      toast.success("Welcome!");
      navigate("/feed");
    };

    handleCallback();
  }, [navigate, location]);

  return <div>Loading...</div>;
};

export default AuthCallback;
