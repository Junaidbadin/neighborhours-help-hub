import React, { useEffect, useState, useRef } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Link } from 'react-router-dom';
import { fetchUserPosts, fetchPosts } from '../slices/postSlice';
import { fetchConversations, getUnreadCount } from '../slices/chatSlice';
import { FiEdit2, FiPlus, FiSearch, FiMessageSquare, FiBell, FiCheckCircle, FiClock } from 'react-icons/fi';
import { formatDistanceToNow } from 'date-fns';

function ErrorBoundary({ children }) {
  try {
    return children;
  } catch (e) {
    console.error('Dashboard Error:', e);
    return (
      <div className="text-red-600 text-center py-10">
        Something went wrong on the Dashboard.
      </div>
    );
  }
}

const Dashboard = () => {
  const dispatch = useDispatch();
  const { user } = useSelector((state) => state.auth);
  const { userPosts = [], isLoading: postsLoading, error: postsError } = useSelector((state) => state.posts);
  const { conversations = [], unreadCount } = useSelector((state) => state.chat);

  const [searchQuery, setSearchQuery] = useState('');
  const [activeTab, setActiveTab] = useState('myPosts');
  const [filteredPosts, setFilteredPosts] = useState([]);
  const [recentPosts, setRecentPosts] = useState([]);

  const userId = user?._id || user?.id;

  // ✅ FIX: Prevent unnecessary re-renders and invalid abort controller usage
  useEffect(() => {
    if (!userId || postsLoading) return;

    const fetchData = async () => {
      try {
        await dispatch(fetchUserPosts({ userId }));
        const postsAction = await dispatch(fetchPosts({ limit: 5 }));
        if (postsAction.payload?.posts) {
          setRecentPosts(postsAction.payload.posts);
        }
        await dispatch(fetchConversations());
        await dispatch(getUnreadCount());
      } catch (error) {
        console.error('Dashboard fetch error:', error);
      }
    };

    fetchData();
  }, [dispatch, userId]);

  useEffect(() => {
    if (searchQuery.trim() && Array.isArray(userPosts)) {
      const filtered = userPosts.filter((post) =>
        post?.title?.toLowerCase().includes(searchQuery.toLowerCase()) ||
        post?.description?.toLowerCase().includes(searchQuery.toLowerCase()) ||
        post?.category?.toLowerCase().includes(searchQuery.toLowerCase())
      );
      setFilteredPosts(filtered);
    } else {
      setFilteredPosts(userPosts || []);
    }
  }, [searchQuery, userPosts]);

  const getPostStatusBadge = (post) => {
    if (!post) return null;
    if (post.isCompleted) {
      return (
        <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800">
          <FiCheckCircle className="mr-1" /> Completed
        </span>
      );
    }
    if (post.helperId) {
      return (
        <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800">
          <FiClock className="mr-1" /> In Progress
        </span>
      );
    }
    return (
      <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-yellow-100 text-yellow-800">
        <FiClock className="mr-1" /> Open
      </span>
    );
  };

  if (!userId) {
    return (
      <div className="min-h-screen bg-gray-50 py-8 flex items-center justify-center">
        <div className="text-center">Loading your dashboard...</div>
      </div>
    );
  }

  if (postsError) {
    return (
      <div className="min-h-screen bg-gray-50 py-8 flex items-center justify-center">
        <div className="text-center">
          <p className="text-red-600">Error loading dashboard: {postsError}</p>
          <button
            onClick={() => window.location.reload()}
            className="mt-4 px-4 py-2 bg-blue-600 text-white rounded"
          >
            Retry
          </button>
        </div>
      </div>
    );
  }

  return (
    <ErrorBoundary>
      <div className="min-h-screen bg-gray-50 py-8">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          {/* Header */}
          <div className="mb-8">
            <h1 className="text-3xl font-bold text-gray-900">Dashboard</h1>
            <p className="mt-2 text-gray-600">
              Welcome back, {user?.firstName || user?.name || 'User'}!
            </p>
          </div>

          {/* Stats Cards */}
          <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
            <div className="bg-white rounded-lg shadow p-6">
              <div className="flex items-center">
                <div className="p-3 bg-blue-100 rounded-lg">
                  <FiEdit2 className="text-blue-600 text-2xl" />
                </div>
                <div className="ml-4">
                  <p className="text-sm font-medium text-gray-600">My Posts</p>
                  <p className="text-2xl font-bold text-gray-900">
                    {Array.isArray(userPosts) ? userPosts.length : 0}
                  </p>
                </div>
              </div>
            </div>

            <div className="bg-white rounded-lg shadow p-6">
              <div className="flex items-center">
                <div className="p-3 bg-green-100 rounded-lg">
                  <FiCheckCircle className="text-green-600 text-2xl" />
                </div>
                <div className="ml-4">
                  <p className="text-sm font-medium text-gray-600">Completed</p>
                  <p className="text-2xl font-bold text-gray-900">
                    {Array.isArray(userPosts)
                      ? userPosts.filter((p) => p?.isCompleted).length
                      : 0}
                  </p>
                </div>
              </div>
            </div>

            <div className="bg-white rounded-lg shadow p-6">
              <div className="flex items-center">
                <div className="p-3 bg-purple-100 rounded-lg">
                  <FiMessageSquare className="text-purple-600 text-2xl" />
                </div>
                <div className="ml-4">
                  <p className="text-sm font-medium text-gray-600">Messages</p>
                  <p className="text-2xl font-bold text-gray-900">
                    {Array.isArray(conversations) ? conversations.length : 0}
                  </p>
                </div>
              </div>
            </div>

            <div className="bg-white rounded-lg shadow p-6">
              <div className="flex items-center">
                <div className="p-3 bg-red-100 rounded-lg">
                  <FiBell className="text-red-600 text-2xl" />
                </div>
                <div className="ml-4">
                  <p className="text-sm font-medium text-gray-600">Unread</p>
                  <p className="text-2xl font-bold text-gray-900">
                    {unreadCount || 0}
                  </p>
                </div>
              </div>
            </div>
          </div>

          {/* Quick Actions */}
          <div className="bg-white rounded-lg shadow mb-8 p-6">
            <h2 className="text-xl font-bold text-gray-900 mb-4">Quick Actions</h2>
            <div className="flex flex-wrap gap-4">
              <Link
                to="/create-post"
                className="inline-flex items-center px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition"
              >
                <FiPlus className="mr-2" />
                Create New Post
              </Link>
              <Link
                to="/chat"
                className="inline-flex items-center px-4 py-2 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition"
              >
                <FiMessageSquare className="mr-2" />
                View Messages
              </Link>
              <Link
                to="/posts"
                className="inline-flex items-center px-4 py-2 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition"
              >
                <FiSearch className="mr-2" />
                Browse Posts
              </Link>
            </div>
          </div>

          {/* Main + Sidebar */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* Main */}
            <div className="lg:col-span-2">
              <div className="bg-white rounded-lg shadow">
                <div className="p-6 border-b">
                  <div className="flex items-center justify-between mb-4">
                    <h2 className="text-xl font-bold text-gray-900">My Posts</h2>
                  </div>

                  {/* Search */}
                  <div className="relative mb-4">
                    <FiSearch className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
                    <input
                      type="text"
                      placeholder="Search my posts..."
                      value={searchQuery}
                      onChange={(e) => setSearchQuery(e.target.value)}
                      className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />
                  </div>
                </div>

                <div className="divide-y">
                  {postsLoading ? (
                    <div className="p-8 text-center">Loading...</div>
                  ) : Array.isArray(filteredPosts) && filteredPosts.length === 0 ? (
                    <div className="p-8 text-center">
                      <FiEdit2 className="mx-auto text-4xl text-gray-300 mb-4" />
                      <p className="text-gray-600">No posts found</p>
                      <Link
                        to="/create-post"
                        className="mt-4 inline-flex items-center text-blue-600 hover:underline"
                      >
                        <FiPlus className="mr-1" />
                        Create your first post
                      </Link>
                    </div>
                  ) : (
                    filteredPosts.map((post) => (
                      <Link
                        key={post?._id}
                        to={`/posts/${post?._id}`}
                        className="block p-6 hover:bg-gray-50 transition"
                      >
                        <div className="flex items-start justify-between mb-2">
                          <h3 className="text-lg font-semibold text-gray-900">
                            {post?.title || 'Untitled'}
                          </h3>
                          {getPostStatusBadge(post)}
                        </div>
                        <p className="text-gray-600 mb-3 line-clamp-2">
                          {post?.description || ''}
                        </p>
                        <div className="flex items-center text-sm text-gray-500">
                          <span className="mr-4">{post?.category || ''}</span>
                          <span>
                            {post?.createdAt
                              ? formatDistanceToNow(new Date(post.createdAt), { addSuffix: true })
                              : ''}
                          </span>
                        </div>
                      </Link>
                    ))
                  )}
                </div>
              </div>
            </div>

            {/* Sidebar */}
            <div className="space-y-6">
              <div className="bg-white rounded-lg shadow p-6">
                <h3 className="text-lg font-bold text-gray-900 mb-4">Recent Posts</h3>
                <div className="space-y-3">
                  {(Array.isArray(recentPosts) ? recentPosts.slice(0, 5) : []).map((post) => (
                    <Link
                      key={post?._id}
                      to={`/posts/${post?._id}`}
                      className="block p-3 rounded-lg hover:bg-gray-50 transition"
                    >
                      <h4 className="font-medium text-gray-900 text-sm mb-1">
                        {post?.title || 'Untitled'}
                      </h4>
                      <p className="text-xs text-gray-500">
                        {post?.createdAt
                          ? formatDistanceToNow(new Date(post.createdAt), { addSuffix: true })
                          : ''}
                      </p>
                    </Link>
                  ))}
                </div>
                <Link
                  to="/posts"
                  className="mt-4 block text-sm text-blue-600 hover:underline text-center"
                >
                  View all posts →
                </Link>
              </div>
            </div>
          </div>
        </div>
      </div>
    </ErrorBoundary>
  );
};

export default Dashboard;
