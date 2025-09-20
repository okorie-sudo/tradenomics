// src/services/posts.ts
import {
  addDoc,
  collection,
  serverTimestamp,
  query,
  orderBy,
  limit,
  getDocs,
  doc,
  updateDoc,
  increment,
  FieldValue,
  Timestamp,
} from "firebase/firestore";
import { db } from "./firebase";

// Post type
export type Post = {
  id?: string;
  authorId: string;
  content: string;
  mediaUrl?: string;
  tradeRefId?: string;
  // Accept Timestamp (Firestore read), FieldValue (serverTimestamp), string (dummy), or null
  createdAt?: Timestamp | FieldValue | string | null;
  updatedAt?: Timestamp | FieldValue | string | null;
  likesCount: number;
  commentsCount: number;
  repostsCount: number;
};

// Create a new post
export async function createPost(
  authorId: string,
  content: string,
  mediaUrl?: string
) {
  const post: Omit<Post, "id"> = {
    authorId,
    content,
    mediaUrl,
    tradeRefId: undefined,
    createdAt: serverTimestamp(),
    updatedAt: serverTimestamp(),
    likesCount: 0,
    commentsCount: 0,
    repostsCount: 0,
  };

  const docRef = await addDoc(collection(db, "posts"), post);
  return docRef.id;
}

// Fetch feed (latest posts)
export async function getFeed(limitCount = 20): Promise<Post[]> {
  const q = query(
    collection(db, "posts"),
    orderBy("createdAt", "desc"),
    limit(limitCount)
  );
  const snapshot = await getDocs(q);
  return snapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() } as Post));
}

// Increment like count
export async function likePost(postId: string) {
  const postRef = doc(db, "posts", postId);
  await updateDoc(postRef, {
    likesCount: increment(1),
    updatedAt: serverTimestamp(),
  });
}
