// src/pages/Create.tsx
import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { ArrowLeft, Image as ImageIcon, X } from "lucide-react";
import { dummyPosts } from "../data/dummyPosts";
import { type Post } from "../services/posts";

const Create: React.FC = () => {
  const navigate = useNavigate();
  const [content, setContent] = useState("");
  const [image, setImage] = useState<string | null>(null);

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
      const reader = new FileReader();
      reader.onloadend = () => setImage(reader.result as string);
      reader.readAsDataURL(file);
    }
  };

  const handlePost = () => {
    if (!content.trim() && !image) return;

    const newPost: Post = {
      id: Date.now().toString(),
      authorId: "you",
      content: content.trim(),
      mediaUrl: image || undefined,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
      likesCount: 0,
      commentsCount: 0,
      repostsCount: 0,
    };

    // Push into dummyPosts (for now)
    dummyPosts.unshift(newPost);

    // Reset form + go back to feed
    setContent("");
    setImage(null);
    navigate("/feed");
  };

  return (
    <div className="flex-1 flex flex-col bg-secondary dark:bg-primary min-h-screen">
      {/* Header */}
      <div className="flex justify-between items-center p-4 border-b border-secondary/30 shadow-sm">
        <button
          onClick={() => navigate(-1)}
          className="p-2 rounded-full hover:bg-secondary/20 dark:hover:bg-gray-700 transition"
        >
          <ArrowLeft className="w-5 h-5 text-primary" />
        </button>
        <button
          onClick={handlePost}
          disabled={!content.trim() && !image}
          className={`px-4 py-2 rounded-full text-sm font-medium transition ${
            !content.trim() && !image
              ? "bg-secondary text-primary/50 cursor-not-allowed"
              : "bg-primary text-secondary hover:scale-105 active:scale-95"
          }`}
        >
          Post
        </button>
      </div>

      {/* Content */}
      <div className="p-4 space-y-4">
        {/* Textarea */}
        <textarea
          value={content}
          onChange={(e) => setContent(e.target.value)}
          placeholder="What's on your mind?"
          className="w-full bg-transparent border-none focus:ring-0 resize-none text-primary text-lg min-h-[120px] placeholder:text-primary"
        />

        {/* Image Preview */}
        {image && (
          <div className="relative">
            <img
              src={image}
              alt="Preview"
              className="rounded-lg w-full max-h-80 object-cover"
            />
            <button
              onClick={() => setImage(null)}
              className="absolute top-2 right-2 bg-black/60 text-white rounded-full p-1"
            >
              <X className="w-4 h-4" />
            </button>
          </div>
        )}

        {/* Image Upload */}
        <div>
          <label className="flex items-center gap-2 cursor-pointer text-primary hover:text-accent transition">
            <ImageIcon className="w-5 h-5" />
            <span>Add image</span>
            <input
              type="file"
              accept="image/*"
              className="hidden"
              onChange={handleImageUpload}
            />
          </label>
        </div>
      </div>
    </div>
  );
};

export default Create;
