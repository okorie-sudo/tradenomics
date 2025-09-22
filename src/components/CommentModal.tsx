import React, { useState } from "react";
import { X } from "lucide-react";
import { dummyComments } from "../data/dummyComments";
import { type Post, type Comment } from "../services/posts";
import { formatDate } from "../utils/normalizeDate";

type CommentModalProps = {
  post: Post | null;
  onClose: () => void;
};

const CommentModal: React.FC<CommentModalProps> = ({ post, onClose }) => {
  const [comments, setComments] = useState<Comment[]>(dummyComments);
  const [newComment, setNewComment] = useState("");

  if (!post) return null;

  const handleAddComment = () => {
    if (!newComment.trim()) return;

    const newEntry: Comment = {
      id: Date.now().toString(),
      postId: post.id,
      authorId: "You",
      content: newComment.trim(),
      createdAt: new Date().toISOString(),
    };

    setComments((prev) => [...prev, newEntry]);
    setNewComment("");
  };

  return (
    <div className="fixed inset-0 z-30 bg-black/50 flex items-end sm:items-center justify-center">
      <div className="bg-white dark:bg-gray-900 w-full sm:max-w-md sm:rounded-lg flex flex-col max-h-[90vh]">
        {/* Header */}
        <div className="flex justify-between items-center p-4 border-b border-secondary/30">
          <h2 className="text-lg font-bold text-primary">Comments</h2>
          <button onClick={onClose}>
            <X className="w-5 h-5 text-primary" />
          </button>
        </div>

        {/* Comments list */}
        <div className="flex-1 overflow-y-auto p-4 space-y-3">
          {comments.map((c) => (
            <div
              key={c.id}
              className="p-3 rounded-lg bg-secondary dark:bg-gray-800 text-primary shadow-sm"
            >
              <div className="flex justify-between items-center mb-1">
                <span className="font-semibold">{c.authorId}</span>
                <span className="text-xs text-secondary">
                  {formatDate(c.createdAt)}
                </span>
              </div>
              <p className="text-sm">{c.content}</p>
            </div>
          ))}
          {comments.length === 0 && (
            <p className="text-sm text-secondary text-center">
              No comments yet
            </p>
          )}
        </div>

        {/* Input */}
        <div className="p-3 border-t border-secondary/30 flex items-center gap-2">
          <input
            type="text"
            value={newComment}
            onChange={(e) => setNewComment(e.target.value)}
            placeholder="Write a comment..."
            className="flex-1 px-3 py-2 rounded-full bg-white dark:bg-gray-800 text-primary border border-secondary/30 focus:outline-none"
            onKeyDown={(e) => e.key === "Enter" && handleAddComment()}
          />
          <button
            onClick={handleAddComment}
            className="px-3 py-2 rounded-full bg-primary text-secondary text-sm hover:scale-105 active:scale-95 transition"
          >
            Post
          </button>
        </div>
      </div>
    </div>
  );
};

export default CommentModal;
