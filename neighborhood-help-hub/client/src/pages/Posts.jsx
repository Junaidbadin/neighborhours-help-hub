import React, { useEffect, useState } from "react";
import api from "../utils/api";

function ErrorBoundary({children}) {
  try { return children } catch (e) { return <div className='text-red-600'>Something went wrong with Posts UI.</div>; }
}

const Posts = () => {
  const [posts, setPosts] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchPosts = async () => {
      try {
        const res = await api.get("/posts");
        // Backend: { success, data: { posts, pagination } }
        const arr = res.data?.data?.posts || [];
        setPosts(Array.isArray(arr) ? arr : []);
      } catch (err) {
        console.error("Error fetching posts:", err);
        setPosts([]);
      } finally {
        setLoading(false);
      }
    };
    fetchPosts();
  }, []);

  if (loading) return <p className="text-center mt-10">Loading posts...</p>;
  const validPosts = Array.isArray(posts) ? posts : [];

  return (
    <ErrorBoundary>
      <div className="max-w-5xl mx-auto p-6">
        <h1 className="text-3xl font-semibold mb-6">Browse Posts</h1>
        {validPosts.length === 0 ? (
          <p>No posts found in your community yet.</p>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {validPosts.map((post) => (
              <div
                key={post._id}
                className="p-5 bg-white rounded-xl shadow hover:shadow-lg transition"
              >
                <h2 className="text-xl font-bold mb-2">{post.title}</h2>
                <p className="text-gray-600 mb-3">{post.description}</p>
                <p className="text-sm text-blue-600">
                  {post.category} • {post.city}
                </p>
              </div>
            ))}
          </div>
        )}
      </div>
    </ErrorBoundary>
  );
};

export default Posts;
