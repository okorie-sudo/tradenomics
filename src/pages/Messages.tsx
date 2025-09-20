// src/pages/Messages.tsx
import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { formatDate } from "../utils/normalizeDate";
import { getConversations, subscribe } from "../services/conversationStore";
import type { Conversation } from "../data/dummyConversations";

const Messages: React.FC = () => {
  const [conversations, setConversations] = useState<Conversation[]>(() =>
    getConversations()
  );
  const navigate = useNavigate();

  useEffect(() => {
    const unsub = subscribe((next) => {
      // keep UI state with fresh snapshot
      setConversations(next);
    });
    return unsub;
  }, []);

  return (
    <div className="flex-1 flex flex-col bg-secondary dark:bg-primary min-h-screen pb-20">
      {/* Header */}
      <div className="p-4 border-b border-secondary/30">
        <h1 className="text-xl font-bold text-primary">Messages</h1>
      </div>

      {/* Conversations List (card style) */}
      <div className="p-4 space-y-3">
        {conversations.map((conv) => {
          const partner =
            conv.participants.find((p) => p !== "you") || "Unknown";
          return (
            <button
              key={conv.id}
              onClick={() => navigate(`/messages/${conv.id}`)}
              className="w-full text-left p-4 rounded-lg bg-white dark:bg-gray-800 shadow-sm hover:shadow-md transition flex flex-col"
            >
              <div className="flex justify-between items-center mb-1">
                <span className="font-semibold text-primary">{partner}</span>
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
