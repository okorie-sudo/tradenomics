import { type Comment } from "../services/posts";

export const dummyComments: Comment[] = [
  {
    id: "c1",
    postId: "1",
    authorId: "Alice",
    content: "This trade setup looks solid 🔥",
    createdAt: new Date(Date.now() - 1000 * 60 * 60).toISOString(), // 1h ago
  },
  {
    id: "c2",
    postId: "1",
    authorId: "Bob",
    content: "I tried something similar yesterday!",
    createdAt: new Date(Date.now() - 1000 * 60 * 30).toISOString(), // 30m ago
  },
  {
    id: "c3",
    postId: "2",
    authorId: "Charlie",
    content: "Interesting risk management approach.",
    createdAt: new Date(Date.now() - 1000 * 60 * 5).toISOString(), // 5m ago
  },
];
