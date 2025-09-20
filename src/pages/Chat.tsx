// src/pages/Chat.tsx
import React, { useEffect, useRef, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { ArrowLeft } from "lucide-react";
import {
  getConversationById,
  subscribe,
  sendMessage as storeSendMessage,
} from "../services/conversationStore";
import type { Conversation, Message } from "../data/dummyConversations";
import { formatDate } from "../utils/normalizeDate";

const Chat: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [conversation, setConversation] = useState<Conversation | undefined>(
    () => (id ? getConversationById(id) : undefined)
  );
  const [input, setInput] = useState("");

  const bottomRef = useRef<HTMLDivElement | null>(null);

  // subscribe to store updates so this chat updates when messages are sent elsewhere
  useEffect(() => {
    const unsub = subscribe((next) => {
      if (!id) return;
      const conv = next.find((c) => c.id === id);
      if (conv) setConversation(conv);
    });
    return unsub;
  }, [id]);

  // auto-scroll on mount and whenever messages change
  useEffect(() => {
    if (bottomRef.current) {
      bottomRef.current.scrollIntoView({ behavior: "smooth" });
    }
  }, [conversation?.messages?.length]);

  if (!conversation) {
    return (
      <div className="flex-1 flex items-center justify-center bg-secondary dark:bg-primary min-h-screen">
        <p className="text-primary">Conversation not found.</p>
      </div>
    );
  }

  const handleSend = () => {
    const body = input.trim();
    if (!body) return;

    const newMessage: Message = {
      id: Date.now().toString(),
      senderId: "you",
      content: body,
      createdAt: new Date().toISOString(),
    };

    // send to store (this will notify subscribers and update messages list)
    storeSendMessage(conversation.id, newMessage);

    setInput("");
  };

  return (
    <div className="flex-1 flex flex-col bg-secondary dark:bg-primary min-h-screen">
      {/* Header with back button */}
      <div className="p-4 border-b border-secondary/30 flex items-center justify-between">
        <button
          onClick={() => navigate("/messages")}
          className="p-2 rounded-full hover:bg-secondary/20 dark:hover:bg-gray-700 transition"
        >
          <ArrowLeft className="w-5 h-5 text-primary" />
        </button>
        <h1 className="text-lg font-bold text-primary flex-1 text-center">
          {conversation.participants.find((p) => p !== "you") || "Conversation"}
        </h1>
        <span className="w-5" /> {/* Spacer for symmetry */}
      </div>

      {/* Messages */}
      <div className="flex-1 overflow-y-auto p-4 space-y-3">
        {conversation.messages.map((msg: Message) => {
          const isYou = msg.senderId === "you";
          return (
            <div
              key={msg.id}
              className={`flex ${isYou ? "justify-end" : "justify-start"}`}
            >
              <div
                className={`max-w-xs rounded-2xl px-3 py-2 shadow-md text-sm ${
                  isYou
                    ? "bg-black text-white rounded-br-none"
                    : "bg-white dark:bg-gray-800 text-primary rounded-bl-none"
                }`}
              >
                <p>{msg.content}</p>
                <span
                  className={`block text-[10px] mt-1 ${
                    isYou ? "text-gray-300" : "text-primary"
                  }`}
                >
                  {formatDate(msg.createdAt)}
                </span>
              </div>
            </div>
          );
        })}
        <div ref={bottomRef} />
      </div>

      {/* Input */}
      <div className="p-3 pb-15 border-t border-secondary/30 flex items-center gap-2">
        <input
          type="text"
          placeholder="Type a message..."
          value={input}
          onChange={(e) => setInput(e.target.value)}
          onKeyDown={(e) => e.key === "Enter" && handleSend()}
          className="flex-1 px-3 py-2 rounded-full bg-white dark:bg-gray-800 text-primary border border-secondary/30 focus:outline-none"
        />
        <button
          onClick={handleSend}
          className="px-3 py-2 rounded-full bg-black text-white text-sm hover:scale-105 active:scale-95 transition"
        >
          Send
        </button>
      </div>
    </div>
  );
};

export default Chat;
