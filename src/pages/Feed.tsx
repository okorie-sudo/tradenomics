// src/pages/Feed.tsx
import React, { useState } from "react";
import {
  Heart,
  MessageCircle,
  Repeat2,
  Bell,
  X,
  Image as ImageIcon,
} from "lucide-react";
import { dummyPosts } from "../data/dummyPosts";
import { formatDate } from "../utils/normalizeDate";

const Feed: React.FC = () => {
  const [posts, setPosts] = useState(dummyPosts);
  const [notifications] = useState([
    { id: "1", text: "Your trade post got 5 new likes" },
    { id: "2", text: "You placed 3rd in April Win Rate Challenge" },
    { id: "3", text: "Alex started following you" },
  ]);
  const [isOpen, setIsOpen] = useState(false);

  // New Post state
  const [newPost, setNewPost] = useState("");
  const [imagePreview, setImagePreview] = useState<string | null>(null);

  const handlePost = () => {
    if (!newPost.trim()) return;

    const newEntry = {
      id: String(Date.now()),
      authorId: "You",
      content: newPost,
      mediaUrl: imagePreview || undefined,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
      likesCount: 0,
      commentsCount: 0,
      repostsCount: 0,
    };

    setPosts([newEntry, ...posts]);
    setNewPost("");
    setImagePreview(null);
  };

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
      const reader = new FileReader();
      reader.onloadend = () => setImagePreview(reader.result as string);
      reader.readAsDataURL(file);
    }
  };

  // Utility to render content with links clickable
  function renderContent(content: string) {
    const urlRegex =
      /((https?:\/\/)?(www\.)?[a-zA-Z0-9.-]+\.[a-z]{2,}(\/\S*)?)/g;
    return content.split(urlRegex).map((part, i) => {
      if (urlRegex.test(part)) {
        const href = part.startsWith("http") ? part : `https://${part}`;
        return (
          <a
            key={i}
            href={href}
            target="_blank"
            rel="noopener noreferrer"
            className="text-accent hover:underline"
          >
            {part}
          </a>
        );
      }
      return part;
    });
  }

  return (
    <div className="flex-1 flex flex-col bg-secondary dark:bg-primary min-h-screen pb-15">
      {/* Feed Header */}
      <div className="p-4 border-b border-secondary/30 flex justify-between items-center">
        <h1 className="text-xl font-bold text-primary">tradenomix</h1>

        {/* Notifications Bell */}
        <button onClick={() => setIsOpen(true)} className="relative">
          <Bell className="w-6 h-6 text-primary" />
          {notifications.length > 0 && (
            <span className="absolute -top-1 -right-1 bg-accent text-white text-xs rounded-full px-1.5 py-0.5">
              {notifications.length}
            </span>
          )}
        </button>
      </div>

      {/* New Post Form */}
      <div className="p-4 border-b border-secondary/30 space-y-2">
        <textarea
          value={newPost}
          onChange={(e) => setNewPost(e.target.value)}
          placeholder="What’s on your mind?"
          className="w-full p-2 rounded-lg border border-secondary/30 text-primary bg-white dark:bg-gray-800 resize-none"
          rows={2}
        />
        {imagePreview && (
          <div className="relative">
            <img
              src={imagePreview}
              alt="Preview"
              className="rounded-lg max-h-60 object-cover"
            />
            <button
              onClick={() => setImagePreview(null)}
              className="absolute top-2 right-2 bg-black/60 text-white px-2 py-1 rounded"
            >
              ✕
            </button>
          </div>
        )}
        <div className="flex justify-between items-center">
          <label className="flex items-center gap-1 text-primary cursor-pointer">
            <ImageIcon size={18} />
            <span className="text-sm">Add image</span>
            <input
              type="file"
              accept="image/*"
              onChange={handleImageChange}
              className="hidden"
            />
          </label>
          <button
            onClick={handlePost}
            className="px-4 py-1.5 bg-accent text-white rounded hover:opacity-90"
          >
            Post
          </button>
        </div>
      </div>

      {/* Posts List */}
      <div className="divide-y divide-secondary/20">
        {posts.map((post) => (
          <div key={post.id} className="p-4 space-y-2">
            {/* Author & Timestamp */}
            <div className="flex justify-between items-center">
              <span className="font-semibold text-primary">
                {post.authorId}
              </span>
              <span className="text-xs text-secondary">
                {formatDate(post.createdAt)}
              </span>
            </div>

            {/* Content */}
            <p className="text-primary">{renderContent(post.content)}</p>

            {/* Media (if exists) */}
            {post.mediaUrl && (
              <img
                src={post.mediaUrl}
                alt="Post media"
                className="rounded-lg w-full max-h-60 object-cover"
              />
            )}

            {/* Actions */}
            <div className="flex justify-between items-center text-primary text-sm mt-2">
              <button className="flex-1 flex items-center justify-center gap-1 hover:text-accent transition-colors">
                <Heart size={16} />
                <span>{post.likesCount}</span>
              </button>
              <button className="flex-1 flex items-center justify-center gap-1 hover:text-accent transition-colors">
                <MessageCircle size={16} />
                <span>{post.commentsCount}</span>
              </button>
              <button className="flex-1 flex items-center justify-center gap-1 hover:text-accent transition-colors">
                <Repeat2 size={16} />
                <span>{post.repostsCount}</span>
              </button>
            </div>
          </div>
        ))}
      </div>

      {/* Notifications Drawer */}
      <div
        className={`fixed inset-0 z-20 flex justify-end transition ${
          isOpen ? "visible bg-black/50" : "invisible bg-transparent"
        }`}
        onClick={() => setIsOpen(false)}
      >
        <div
          className={`w-80 h-full bg-white dark:bg-gray-900 shadow-lg p-4 flex flex-col transform transition-transform duration-300 ease-in-out ${
            isOpen ? "translate-x-0" : "translate-x-full"
          }`}
          onClick={(e) => e.stopPropagation()}
        >
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-lg font-bold text-primary">Notifications</h2>
            <button onClick={() => setIsOpen(false)}>
              <X className="w-5 h-5 text-primary" />
            </button>
          </div>

          <div className="flex-1 space-y-3 overflow-y-auto">
            {notifications.map((n) => (
              <div
                key={n.id}
                className="p-3 bg-secondary dark:bg-gray-800 rounded-lg text-primary text-sm animate-fade-in"
              >
                {n.text}
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Feed;
