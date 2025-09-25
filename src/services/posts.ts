import {
  addDoc,
  collection,
  doc,
  FieldValue,
  getDocs,
  increment,
  limit,
  orderBy,
  query,
  serverTimestamp,
  Timestamp,
  updateDoc,
} from "firebase/firestore";
import { db } from "./firebase";
import ImageKit from "imagekit-javascript";

// Initialize ImageKit
const imagekit = new ImageKit({
  publicKey: import.meta.env.VITE_IMAGEKIT_PUBLIC_KEY as string,
  urlEndpoint: import.meta.env.VITE_IMAGEKIT_URL_ENDPOINT as string,
});

// Post type
export type Post = {
  id: string;
  authorId: string;
  content: string;
  mediaUrl?: string;
  tradeRefId?: string;
  createdAt?: Timestamp | FieldValue | string | null;
  updatedAt?: Timestamp | FieldValue | string | null;
  likesCount: number;
  commentsCount: number;
  repostsCount: number;
  isLiked?: boolean;
  isReposted?: boolean;
};

// Comment type
export type Comment = {
  id: string;
  postId: string;
  authorId: string;
  content: string;
  createdAt: string;
};

// Fetch authentication parameters from Supabase
async function getImageKitAuthParams(): Promise<{
  token: string;
  expire: number;
  signature: string;
}> {
  console.log("Supabase Anon Key:", import.meta.env.VITE_SUPABASE_ANON_KEY);
  console.log("Auth Endpoint:", import.meta.env.VITE_IMAGEKIT_AUTH_ENDPOINT);
  const response = await fetch(
    import.meta.env.VITE_IMAGEKIT_AUTH_ENDPOINT as string,
    {
      headers: {
        Authorization: `Bearer ${import.meta.env.VITE_SUPABASE_ANON_KEY}`,
      },
    },
  );
  console.log("Fetch Response:", response.status, response.statusText);
  if (!response.ok) {
    throw new Error(`Failed to fetch auth params: ${response.statusText}`);
  }
  return response.json();
}

// Upload image to ImageKit
export async function uploadImage(
  file: File,
  authorId: string,
): Promise<string> {
  if (file.size > 5 * 1024 * 1024) {
    throw new Error("File too big! Max 5MB.");
  }
  if (!file.type.startsWith("image/")) {
    throw new Error("Only images allowed!");
  }

  try {
    const { token, expire, signature } = await getImageKitAuthParams();
    console.log("ImageKit Auth Params:", { token, expire, signature });

    const response = await imagekit.upload({
      file,
      fileName: file.name,
      folder: `/users/${authorId}`,
      tags: ["post-image"],
      token,
      expire,
      signature,
    });
    console.log("ImageKit Upload Response:", response.url);
    return response.url;
  } catch (err) {
    console.error("Upload error:", err);
    throw new Error(`Upload failed: ${(err as Error).message}`);
  }
}

// Create post
export async function createPost(
  authorId: string,
  content: string,
  mediaFile?: File,
): Promise<string> {
  let mediaUrl: string | undefined;
  if (mediaFile) {
    mediaUrl = await uploadImage(mediaFile, authorId);
  }

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
  console.log("Post created with ID:", docRef.id);
  return docRef.id;
}

// Fetch feed
export async function getFeed(limitCount = 20): Promise<Post[]> {
  const q = query(
    collection(db, "posts"),
    orderBy("createdAt", "desc"),
    limit(limitCount),
  );
  const snapshot = await getDocs(q);
  return snapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() } as Post));
}

// Like post
export async function likePost(postId: string) {
  const postRef = doc(db, "posts", postId);
  await updateDoc(postRef, {
    likesCount: increment(1),
    updatedAt: serverTimestamp(),
  });
}
