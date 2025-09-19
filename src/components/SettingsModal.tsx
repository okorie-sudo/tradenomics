// src/components/SettingsModal.tsx
import { X } from "lucide-react";

type SettingsModalProps = {
  isOpen: boolean;
  onClose: () => void;
};

export default function SettingsModal({ isOpen, onClose }: SettingsModalProps) {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-40 flex items-center justify-center z-50">
      <div className="bg-white dark:bg-gray-900 rounded-lg w-80 p-4 shadow-lg relative">
        {/* Close button */}
        <button
          onClick={onClose}
          className="absolute top-2 right-2 text-gray-600 hover:text-black dark:hover:text-white"
        >
          <X className="w-5 h-5" />
        </button>

        <h2 className="text-lg font-bold mb-4 text-center">Settings</h2>
        <ul className="space-y-3">
          <li className="hover:bg-gray-100 dark:hover:bg-gray-800 p-2 rounded cursor-pointer">
            Edit Profile
          </li>
          <li className="hover:bg-gray-100 dark:hover:bg-gray-800 p-2 rounded cursor-pointer">
            Privacy
          </li>
          <li className="hover:bg-gray-100 dark:hover:bg-gray-800 p-2 rounded cursor-pointer">
            Notifications
          </li>
          <li className="hover:bg-gray-100 dark:hover:bg-gray-800 p-2 rounded cursor-pointer text-red-600">
            Logout
          </li>
        </ul>
      </div>
    </div>
  );
}
