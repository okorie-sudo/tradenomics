// src/pages/Settings.tsx
import React from "react";
import { useAuth } from "../hooks/useAuth";
import { LogOut, User, Shield } from "lucide-react";
import ThemeToggle from "../components/ThemeToggle";

const Settings: React.FC = () => {
  const { signOut } = useAuth();

  return (
    <div className="flex-1 flex flex-col bg-secondary dark:bg-primary min-h-screen">
      {/* Header */}
      <div className="p-4 border-b border-secondary/30 flex justify-between items-center shadow-sm">
        <h1 className="text-xl font-bold text-primary">Settings</h1>
        <ThemeToggle />
      </div>

      {/* Content */}
      <div className="p-4 space-y-6">
        {/* Profile Settings */}
        <div className="bg-white dark:bg-gray-800 rounded-lg shadow p-4">
          <h2 className="text-lg font-semibold text-primary mb-3 flex items-center gap-2">
            <User className="w-5 h-5" /> Profile
          </h2>
          <button className="w-full py-2 px-3 text-left rounded bg-secondary/20 dark:bg-gray-700 hover:bg-secondary/30 dark:hover:bg-gray-600 transition">
            Edit Profile (username, bio, avatar)
          </button>
        </div>

        {/* Security Settings */}
        <div className="bg-white dark:bg-gray-800 rounded-lg shadow p-4">
          <h2 className="text-lg font-semibold text-primary mb-3 flex items-center gap-2">
            <Shield className="w-5 h-5" /> Security
          </h2>
          <button className="w-full py-2 px-3 text-left rounded bg-secondary/20 dark:bg-gray-700 hover:bg-secondary/30 dark:hover:bg-gray-600 transition">
            Two-Factor Authentication (Coming Soon)
          </button>
        </div>

        {/* Logout */}
        <div className="bg-white dark:bg-gray-800 rounded-lg shadow p-4">
          <button
            onClick={signOut}
            className="w-full py-2 px-3 text-left rounded bg-red-500 text-white flex items-center gap-2 hover:bg-red-600 transition"
          >
            <LogOut className="w-5 h-5" /> Logout
          </button>
        </div>
      </div>
    </div>
  );
};

export default Settings;
