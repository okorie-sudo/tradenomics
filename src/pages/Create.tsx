import React, { useState, useContext } from "react";
import { useNavigate } from "react-router-dom";
import { ArrowLeft, Image as ImageIcon, X } from "lucide-react";
import { createPost } from "../services/posts";
import { AuthContext } from "../context/authContext";

const Create: React.FC = () => {
  const navigate = useNavigate();
  const { user } = useContext(AuthContext);
  const [content, setContent] = useState("");
  const [file, setFile] = useState<File | null>(null);
  const [preview, setPreview] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const selectedFile = e.target.files[0];
      setFile(selectedFile);
      const reader = new FileReader();
      reader.onloadend = () => setPreview(reader.result as string);
      reader.readAsDataURL(selectedFile);
    }
  };

  const handlePost = async () => {
    if (!user) {
      setError("Please log in to post!");
      return;
    }
    if (!content.trim() && !file) {
      setError("Please add some content or an image!");
      return;
    }

    setLoading(true);
    setError("");
    try {
      await createPost(user.id, content.trim(), file || undefined);
      console.log("Post created successfully!");
      setContent("");
      setFile(null);
      setPreview(null);
      navigate("/feed");
    } catch (err) {
      console.error("Create post error:", err);
      setError((err as Error).message || "Failed to create post");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex-1 flex flex-col bg-secondary dark:bg-primary min-h-screen">
      <div className="flex justify-between items-center p-4 border-b border-secondary/30 shadow-sm">
        <button
          onClick={() => navigate(-1)}
          className="p-2 rounded-full hover:bg-secondary/20 dark:hover:bg-gray-700 transition"
          disabled={loading}
        >
          <ArrowLeft className="w-5 h-5 text-primary" />
        </button>
        <button
          onClick={handlePost}
          disabled={loading || (!content.trim() && !file)}
          className={`px-4 py-2 rounded-full text-sm font-medium transition ${
            loading || (!content.trim() && !file)
              ? "bg-secondary text-primary/50 cursor-not-allowed"
              : "bg-primary text-secondary hover:scale-105 active:scale-95"
          }`}
        >
          {loading ? "Posting..." : "Post"}
        </button>
      </div>
      <div className="p-4 space-y-4">
        <textarea
          value={content}
          onChange={(e) => setContent(e.target.value)}
          placeholder="What's on your mind?"
          className="w-full bg-transparent border-none focus:ring-0 resize-none text-primary text-lg min-h-[120px] placeholder:text-primary"
          disabled={loading}
        />
        {preview && (
          <div className="relative">
            <img
              src={preview}
              alt="Preview"
              className="rounded-lg w-full max-h-80 object-cover"
            />
            <button
              onClick={() => {
                setFile(null);
                setPreview(null);
              }}
              className="absolute top-2 right-2 bg-black/60 text-white rounded-full p-1"
              disabled={loading}
            >
              <X className="w-4 h-4" />
            </button>
          </div>
        )}
        <div>
          <label className="flex items-center gap-2 cursor-pointer text-primary hover:text-accent transition">
            <ImageIcon className="w-5 h-5" />
            <span>Add image</span>
            <input
              type="file"
              accept="image/*"
              className="hidden"
              onChange={handleImageUpload}
              disabled={loading}
            />
          </label>
        </div>
        {error && <p className="text-red-500 text-sm">{error}</p>}
      </div>
    </div>
  );
};

export default Create;
