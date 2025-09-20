// src/services/messages.ts
import { db } from "./firebase";
import {
  collection,
  addDoc,
  getDocs,
  query,
  orderBy,
  where,
  doc,
  getDoc,
  Timestamp,
} from "firebase/firestore";
import { type Conversation } from "../data/dummyConversations";

const conversationsRef = collection(db, "conversations");
const messagesRef = collection(db, "messages");

// Fetch all conversations for a user
export async function fetchConversations(
  userId: string
): Promise<Conversation[]> {
  const q = query(
    conversationsRef,
    where("participants", "array-contains", userId)
  );
  const snapshot = await getDocs(q);
  return snapshot.docs.map((doc) => ({
    id: doc.id,
    ...doc.data(),
  })) as Conversation[];
}

// Fetch single conversation by id
export async function fetchConversationById(
  conversationId: string
): Promise<Conversation | null> {
  const ref = doc(conversationsRef, conversationId);
  const snapshot = await getDoc(ref);
  if (!snapshot.exists()) return null;
  return { id: snapshot.id, ...snapshot.data() } as Conversation;
}

// Create new conversation
export async function createConversation(
  participants: string[],
  lastMessage: string
) {
  return await addDoc(conversationsRef, {
    participants,
    lastMessage,
    lastMessageAt: Timestamp.now(),
  });
}

// Fetch messages in a conversation
export async function fetchMessages(conversationId: string) {
  const q = query(
    collection(messagesRef, conversationId, "chat"),
    orderBy("createdAt", "asc")
  );
  const snapshot = await getDocs(q);
  return snapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() }));
}

// Send message
export async function sendMessage(
  conversationId: string,
  senderId: string,
  content: string
) {
  return await addDoc(collection(messagesRef, conversationId, "chat"), {
    senderId,
    content,
    createdAt: Timestamp.now(),
    read: false,
  });
}
