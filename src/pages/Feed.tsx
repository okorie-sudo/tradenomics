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
import { useNavigate } from "react-router-dom";
import { dummyPosts } from "../data/dummyPosts";
import { formatDate } from "../utils/normalizeDate";
import { type Post } from "../services/posts";
import CommentModal from "../components/CommentModal";

type Notification = { id: string; text: string };

const Feed: React.FC = () => {
  const navigate = useNavigate();
  const [posts, setPosts] = useState(dummyPosts);
  const [notifications, setNotifications] = useState<Notification[]>([
    { id: "1", text: "Your trade post got 5 new likes" },
    { id: "2", text: "You placed 3rd in April Win Rate Challenge" },
    { id: "3", text: "Alex started following you" },
  ]);
  const [isOpen, setIsOpen] = useState(false);

  // New Post state
  const [newPost, setNewPost] = useState("");
  const [imagePreview, setImagePreview] = useState<string | null>(null);

  // Comment modal state
  const [selectedPost, setSelectedPost] = useState<Post | null>(null);
  // Share modal state
  const [sharePost, setSharePost] = useState<Post | null>(null);

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
      isLiked: false,
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

  // Toggle like
  const toggleLike = (id: string) => {
    setPosts((prev) =>
      prev.map((p) =>
        p.id === id
          ? {
              ...p,
              likesCount: p.isLiked ? p.likesCount - 1 : p.likesCount + 1,
              isLiked: !p.isLiked,
            }
          : p
      )
    );
  };

  //Handle Repost;

  const handleRepost = (postId: string) => {
    setPosts((prev) =>
      prev.map((p) =>
        p.id === postId
          ? {
              ...p,
              isReposted: !p.isReposted,
              repostsCount: p.isReposted
                ? p.repostsCount - 1
                : p.repostsCount + 1,
            }
          : p
      )
    );
  };

  //handlePost sharing...
  const handleShare = (post: Post) => {
    handleRepost(post.id);
    setSharePost(post);
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
          className="w-full p-2 rounded-lg border border-secondary/30 text-primary bg-secondary/20 dark:bg-gray-800 resize-none"
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
              <button
                onClick={() => navigate("/profile/1")}
                className="font-semibold text-primary hover:underline"
              >
                {post.authorId}
              </button>
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
              <button
                onClick={() => toggleLike(post.id)}
                className={`flex-1 flex items-center justify-center gap-1 transition-colors ${
                  post.isLiked ? "text-accent" : "hover:text-accent"
                }`}
              >
                <Heart
                  size={16}
                  fill={post.isLiked ? "currentColor" : "none"}
                />
                <span>{post.likesCount}</span>
              </button>
              <button
                onClick={() => setSelectedPost(post)}
                className="flex-1 flex items-center justify-center gap-1 hover:text-accent transition-colors"
              >
                <MessageCircle size={16} />
                <span>{post.commentsCount}</span>
              </button>
              <button
                onClick={() => handleShare(post)}
                className={`flex-1 flex items-center justify-center gap-1 transition-colors ${
                  post.isReposted
                    ? "text-accent"
                    : "text-primary hover:text-accent"
                }`}
              >
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
          className={`w-80 h-full bg-secondary  shadow-lg p-4 flex flex-col transform transition-transform duration-300 ease-in-out ${
            isOpen ? "translate-x-0" : "translate-x-full"
          }`}
          onClick={(e) => e.stopPropagation()}
        >
          {/* Header */}
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-lg font-bold text-primary">Notifications</h2>
            <div className="flex gap-2">
              {notifications.length > 0 && (
                <button
                  onClick={() => setNotifications([])}
                  className="text-xs text-accent hover:underline"
                >
                  Clear All
                </button>
              )}
              <button onClick={() => setIsOpen(false)}>
                <X className="w-5 h-5 text-primary" />
              </button>
            </div>
          </div>

          {/* Notifications List */}
          <div className="flex-1 space-y-3 overflow-y-auto">
            {notifications.length === 0 ? (
              <p className="text-sm text-secondary">No new notifications</p>
            ) : (
              notifications.map((n) => (
                <div
                  key={n.id}
                  className="relative p-3 bg-secondary dark:bg-gray-800 rounded-lg text-primary text-sm animate-fade-in"
                >
                  {n.text}
                  <button
                    onClick={() =>
                      setNotifications((prev) =>
                        prev.filter((item) => item.id !== n.id)
                      )
                    }
                    className="absolute top-2 right-2 text-xs text-primary hover:text-danger"
                  >
                    ✕
                  </button>
                </div>
              ))
            )}
          </div>
        </div>
      </div>

      {/* Comment Modal */}
      {selectedPost && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-30">
          <div className="bg-white dark:bg-gray-900 rounded-lg p-4 w-11/12 max-w-md shadow-lg">
            <div className="flex justify-between items-center mb-2">
              <h2 className="font-bold text-primary">Comments</h2>
              <button onClick={() => setSelectedPost(null)}>
                <X className="w-5 h-5 text-primary" />
              </button>
            </div>
            <p className="text-sm text-primary mb-4">{selectedPost.content}</p>

            {/* Placeholder comments */}
            <div className="text-primary text-sm mb-4">
              No comments yet. Be the first!
            </div>
          </div>
        </div>
      )}
      <CommentModal post={selectedPost} onClose={() => setSelectedPost(null)} />

      {/* Share Modal */}
      {sharePost && (
        <div className="fixed inset-0 z-30 flex items-center justify-center bg-black/50">
          <div className="bg-white dark:bg-gray-900 rounded-lg shadow-lg w-96 p-4">
            {/* Header */}
            <div className="flex justify-between items-center mb-4">
              <h2 className="font-semibold text-primary">Share Post</h2>
              <button
                onClick={() => setSharePost(null)}
                className="p-1 hover:bg-secondary/30 rounded-full"
              >
                <X className="w-5 h-5 text-primary" />
              </button>
            </div>

            {/* Post Preview */}
            <div className="p-2 border rounded-md border-secondary/30 mb-3">
              <p className="text-sm text-primary">{sharePost.content}</p>
              {sharePost.mediaUrl && (
                <img
                  src={sharePost.mediaUrl}
                  alt="shared preview"
                  className="rounded-lg mt-2 max-h-40 object-cover"
                />
              )}
            </div>

            {/* Caption box */}
            <textarea
              placeholder="Add a caption..."
              className="w-full bg-transparent border border-secondary/30 rounded-md p-2 text-primary text-sm resize-none mb-3"
              rows={3}
            />

            {/* Share button */}
            <button
              onClick={() => setSharePost(null)}
              className="w-full bg-primary text-secondary rounded-md py-2 hover:opacity-90"
            >
              Share
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default Feed;
