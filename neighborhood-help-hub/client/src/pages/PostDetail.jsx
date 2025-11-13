import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import axios from "axios";

const PostDetail = () => {
  const { id } = useParams(); // Get post ID from URL
  const [post, setPost] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const fetchPost = async () => {
      try {
        setLoading(true);
        const res = await axios.get(`http://localhost:5000/api/posts/${id}`);
        setPost(res.data);
      } catch (err) {
        console.error(err);
        setError("Failed to load post details.");
      } finally {
        setLoading(false);
      }
    };

    fetchPost();
  }, [id]);

  if (loading) {
    return (
      <div className="min-h-screen flex justify-center items-center text-gray-600">
        Loading post details...
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen flex justify-center items-center text-red-500">
        {error}
      </div>
    );
  }

  if (!post) {
    return (
      <div className="min-h-screen flex justify-center items-center text-gray-500">
        No post found.
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-4xl mx-auto px-4">
        <h1 className="text-3xl font-bold text-gray-900 mb-8">{post.title}</h1>

        <div className="bg-white rounded-lg shadow p-6">
          {/* Post Image */}
          {post.images && post.images.length > 0 && (
            <img
              src={post.images[0]}
              alt="Post"
              className="w-full h-64 object-cover rounded-lg mb-6"
            />
          )}

          {/* Post Info */}
          <p className="text-gray-700 mb-4">{post.description}</p>

          <div className="flex flex-wrap gap-4 text-sm text-gray-600 mb-4">
            <span>📂 Category: <strong>{post.category}</strong></span>
            <span>💰 Budget: <strong>${post.budget || "N/A"}</strong></span>
            <span>📅 Posted: {new Date(post.createdAt).toLocaleDateString()}</span>
          </div>

          {/* Location Info */}
          {post.location && (
            <p className="text-gray-600 mb-2">
              📍 Location: {post.location?.coordinates?.join(", ")}
            </p>
          )}

          {/* Author Info */}
          {post.author && (
            <p className="text-gray-600 mb-2">
              👤 Posted by: <strong>{post.author.name}</strong>
            </p>
          )}

          {/* Status */}
          <p
            className={`mt-4 inline-block px-3 py-1 rounded-full text-sm font-medium ${
              post.status === "completed"
                ? "bg-green-100 text-green-700"
                : "bg-yellow-100 text-yellow-700"
            }`}
          >
            {post.status?.toUpperCase()}
          </p>
        </div>
      </div>
    </div>
  );
};

export default PostDetail;
