import React, { useState } from "react";
import axios from "axios";

const Search = () => {
  const [query, setQuery] = useState("");
  const [results, setResults] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleSearch = async (e) => {
    e.preventDefault();

    if (!query.trim()) {
      setError("Please enter a search term.");
      return;
    }

    try {
      setLoading(true);
      setError("");

      // ✅ Call your backend API (update URL as needed)
      const res = await axios.get(`http://localhost:5000/api/posts/search?query=${query}`);

      setResults(res.data);
    } catch (err) {
      console.error(err);
      setError("Failed to fetch results. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-4xl mx-auto px-4">
        <h1 className="text-3xl font-bold text-gray-900 mb-8 text-center">🔍 Search Posts</h1>

        {/* Search Bar */}
        <form onSubmit={handleSearch} className="flex gap-2 mb-6">
          <input
            type="text"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Search for help offers, tools, tuition..."
            className="flex-1 p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none"
          />
          <button
            type="submit"
            className="bg-blue-600 text-white px-5 py-3 rounded-lg hover:bg-blue-700 transition"
          >
            Search
          </button>
        </form>

        {/* Error or Loading */}
        {error && <p className="text-red-500 mb-4">{error}</p>}
        {loading && <p className="text-gray-500 mb-4">Searching...</p>}

        {/* Results */}
        <div className="bg-white rounded-lg shadow p-6">
          {results.length > 0 ? (
            <ul className="space-y-4">
              {results.map((post) => (
                <li key={post._id} className="border-b pb-4 last:border-none">
                  <h3 className="text-lg font-semibold text-gray-800">{post.title}</h3>
                  <p className="text-gray-600 text-sm">{post.description}</p>
                  <span className="text-sm text-blue-600">{post.category}</span>
                </li>
              ))}
            </ul>
          ) : (
            !loading && <p className="text-gray-500">No results found.</p>
          )}
        </div>
      </div>
    </div>
  );
};

export default Search;

















