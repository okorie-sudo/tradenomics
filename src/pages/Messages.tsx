import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  dummyConversations,
  type Conversation,
} from "../data/dummyConversations";
import { formatDate } from "../utils/normalizeDate";

const Messages: React.FC = () => {
  const [conversations] = useState<Conversation[]>(dummyConversations);
  const navigate = useNavigate();

  return (
    <div className="flex-1 flex flex-col bg-secondary dark:bg-primary min-h-screen pb-15">
      {/* Header */}
      <div className="p-4 border-b border-secondary/30 sticky top-0 bg-white dark:bg-gray-900 z-10 shadow-sm">
        <h1 className="text-xl font-bold text-primary">Messages</h1>
      </div>

      {/* Conversations List */}
      <div className="divide-y divide-secondary/20">
        {conversations.map((conv) => {
          const partner =
            conv.participants.find((p) => p !== "you") || "Unknown";
          return (
            <button
              key={conv.id}
              onClick={() => navigate(`/messages/${conv.id}`)}
              className="w-full text-left p-4 hover:bg-secondary/10 dark:hover:bg-gray-800 transition"
            >
              <div className="flex justify-between items-center mb-1">
                <span
                  onClick={(e) => {
                    e.stopPropagation(); // prevent navigating to chat
                    navigate("/profile/1"); // hardcoded for now
                  }}
                  className="font-semibold text-primary cursor-pointer hover:underline"
                >
                  {partner}
                </span>
                <span className="text-xs text-primary">
                  {formatDate(conv.lastMessageAt)}
                </span>
              </div>
              <p className="text-sm text-primary truncate">
                {conv.lastMessage}
              </p>
            </button>
          );
        })}
      </div>
    </div>
  );
};

export default Messages;
