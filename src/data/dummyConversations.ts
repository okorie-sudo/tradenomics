// src/data/dummyConversations.ts
import { Timestamp } from "firebase/firestore";

export type Message = {
  id: string;
  senderId: string;
  content: string;
  createdAt: string | Timestamp;
};

export type Conversation = {
  id: string;
  participants: string[];
  lastMessage: string;
  lastMessageAt: string | Timestamp;
  messages: Message[]; // ✅ new field
};

export const dummyConversations: Conversation[] = [
  {
    id: "1",
    participants: ["you", "Alex"],
    lastMessage: "Catch you later!",
    lastMessageAt: new Date().toISOString(),
    messages: [
      {
        id: "m1",
        senderId: "Alex",
        content: "Hey! How’s the algo trading going?",
        createdAt: new Date().toISOString(),
      },
      {
        id: "m2",
        senderId: "you",
        content: "Pretty solid. Backtested a new strategy today.",
        createdAt: new Date().toISOString(),
      },
      {
        id: "m3",
        senderId: "Alex",
        content: "Catch you later!",
        createdAt: new Date().toISOString(),
      },
    ],
  },
  {
    id: "2",
    participants: ["you", "Samantha"],
    lastMessage: "That’s exciting 🚀",
    lastMessageAt: new Date().toISOString(),
    messages: [
      {
        id: "m1",
        senderId: "you",
        content: "Just entered a trade on BTC/USD",
        createdAt: new Date().toISOString(),
      },
      {
        id: "m2",
        senderId: "Samantha",
        content: "Nice! What’s your target?",
        createdAt: new Date().toISOString(),
      },
      {
        id: "m3",
        senderId: "you",
        content: "Looking at 5% gain if it runs well.",
        createdAt: new Date().toISOString(),
      },
      {
        id: "m4",
        senderId: "Samantha",
        content: "That’s exciting 🚀",
        createdAt: new Date().toISOString(),
      },
    ],
  },
  {
    id: "3",
    participants: ["you", "Marcus"],
    lastMessage: "Yep, risk/reward matters most.",
    lastMessageAt: new Date().toISOString(),
    messages: [
      {
        id: "m1",
        senderId: "Marcus",
        content: "Bro, did you see the NASDAQ today?",
        createdAt: new Date().toISOString(),
      },
      {
        id: "m2",
        senderId: "you",
        content: "Yeah, insane volatility. Perfect for scalps.",
        createdAt: new Date().toISOString(),
      },
      {
        id: "m3",
        senderId: "Marcus",
        content: "Yep, risk/reward matters most.",
        createdAt: new Date().toISOString(),
      },
    ],
  },
  {
    id: "4",
    participants: ["you", "Elena"],
    lastMessage: "Let’s compare notes tomorrow.",
    lastMessageAt: new Date().toISOString(),
    messages: [
      {
        id: "m1",
        senderId: "Elena",
        content: "How’s your gold position holding up?",
        createdAt: new Date().toISOString(),
      },
      {
        id: "m2",
        senderId: "you",
        content: "Stopped out earlier, small loss tho.",
        createdAt: new Date().toISOString(),
      },
      {
        id: "m3",
        senderId: "Elena",
        content: "Good discipline 👌",
        createdAt: new Date().toISOString(),
      },
      {
        id: "m4",
        senderId: "you",
        content: "Let’s compare notes tomorrow.",
        createdAt: new Date().toISOString(),
      },
    ],
  },
  {
    id: "5",
    participants: ["you", "Daniel"],
    lastMessage: "Alright, goodnight!",
    lastMessageAt: new Date().toISOString(),
    messages: [
      {
        id: "m1",
        senderId: "Daniel",
        content: "Think ETH will breakout soon?",
        createdAt: new Date().toISOString(),
      },
      {
        id: "m2",
        senderId: "you",
        content: "Possibly, but I’m waiting for confirmation.",
        createdAt: new Date().toISOString(),
      },
      {
        id: "m3",
        senderId: "Daniel",
        content: "Alright, goodnight!",
        createdAt: new Date().toISOString(),
      },
    ],
  },
];
