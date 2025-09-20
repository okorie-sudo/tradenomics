// src/services/conversationStore.ts
import type { Conversation, Message } from "../data/dummyConversations";
import { dummyConversations } from "../data/dummyConversations";

/**
 * Simple in-memory store for MVP. Initialized from dummyConversations.
 * Exposes subscribe/get/send helpers so UI can stay in sync without a global state lib.
 */

// clone initial data so we don't mutate the imported constant
const conversations: Conversation[] = JSON.parse(
  JSON.stringify(dummyConversations)
);

type Listener = (conversationsSnapshot: Conversation[]) => void;
const listeners: Listener[] = [];

export function getConversations(): Conversation[] {
  // return shallow clone to avoid accidental mutation
  return conversations.map((c) => ({ ...c }));
}

export function getConversationById(id: string): Conversation | undefined {
  return conversations.find((c) => c.id === id);
}

export function sendMessage(conversationId: string, message: Message) {
  const conv = conversations.find((c) => c.id === conversationId);
  if (!conv) return null;

  conv.messages.push(message);
  conv.lastMessage = message.content;
  conv.lastMessageAt = message.createdAt;

  notifyListeners();
  return message;
}

export function subscribe(listener: Listener) {
  listeners.push(listener);
  // emit initial snapshot (deep clone)
  listener(JSON.parse(JSON.stringify(conversations)));

  return () => {
    const idx = listeners.indexOf(listener);
    if (idx !== -1) listeners.splice(idx, 1);
  };
}

function notifyListeners() {
  // shallow/deep clone so listeners don't accidentally mutate store
  const snapshot = JSON.parse(JSON.stringify(conversations));
  listeners.forEach((l) => l(snapshot));
}
