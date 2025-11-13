import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import {
  fetchDashboardStats,
  fetchAllUsers,
  fetchAllPosts,
  fetchReports,
  fetchAnalytics,
  toggleUserStatus,
  deleteUserPost,
} from '../../slices/adminSlice';
import {
  FiUsers,
  FiFileText,
  FiMessageSquare,
  FiAlertCircle,
  FiTrendingUp,
  FiShield,
  FiSearch,
  FiCheckCircle,
  FiX,
  FiMoreVertical,
} from 'react-icons/fi';
import { formatDistanceToNow } from 'date-fns';
import toast from 'react-hot-toast';

const AdminDashboard = () => {
  const dispatch = useDispatch();
  const { dashboardStats, users, posts, reports, analytics, isLoading } = useSelector(
    (state) => state.admin
  );

  const [activeTab, setActiveTab] = useState('dashboard');
  const [searchQuery, setSearchQuery] = useState('');
  const [filteredUsers, setFilteredUsers] = useState([]);
  const [filteredPosts, setFilteredPosts] = useState([]);
  const [reportModal, setReportModal] = useState({ open: false, report: null });

  useEffect(() => {
    dispatch(fetchDashboardStats());
    dispatch(fetchAnalytics());
  }, [dispatch]);

  useEffect(() => {
    if (activeTab === 'users' && users.length > 0) {
      dispatch(fetchAllUsers({ page: 1, limit: 50 }));
    }
  }, [activeTab, dispatch]);

  useEffect(() => {
    if (activeTab === 'posts' && posts.length > 0) {
      dispatch(fetchAllPosts({ page: 1, limit: 50 }));
    }
  }, [activeTab, dispatch]);

  useEffect(() => {
    if (searchQuery && users) {
      const filtered = users.filter((user) =>
        `${user.firstName} ${user.lastName}`.toLowerCase().includes(searchQuery.toLowerCase()) ||
        user.email.toLowerCase().includes(searchQuery.toLowerCase())
      );
      setFilteredUsers(filtered);
    } else {
      setFilteredUsers(users);
    }
  }, [searchQuery, users]);

  useEffect(() => {
    if (searchQuery && posts) {
      const filtered = posts.filter(
        (post) =>
          post.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
          post.description?.toLowerCase().includes(searchQuery.toLowerCase())
      );
      setFilteredPosts(filtered);
    } else {
      setFilteredPosts(posts);
    }
  }, [searchQuery, posts]);

  const handleToggleUserStatus = async (userId, isActive, reason = '') => {
    try {
      await dispatch(
        toggleUserStatus({
          userId,
          statusData: { isActive, reason },
        })
      ).unwrap();
      toast.success(`User ${isActive ? 'activated' : 'deactivated'} successfully`);
    } catch (error) {
      toast.error(error || 'Failed to update user status');
    }
  };

  const handleDeletePost = async (postId, reason) => {
    if (!reason || reason.trim() === '') {
      toast.error('Please provide a reason for deletion');
      return;
    }

    if (!window.confirm('Are you sure you want to delete this post?')) {
      return;
    }

    try {
      await dispatch(deleteUserPost({ postId, reason })).unwrap();
      toast.success('Post deleted successfully');
    } catch (error) {
      toast.error(error || 'Failed to delete post');
    }
  };

  const handleViewReport = (report) => {
    setReportModal({ open: true, report });
  };

  useEffect(() => {
    if (activeTab === 'reports') {
      dispatch(fetchReports());
    }
  }, [activeTab, dispatch]);

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900">Admin Dashboard</h1>
          <p className="text-gray-600 mt-2">Manage the neighborhood help hub community</p>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
          <div className="bg-white rounded-lg shadow p-6">
            <div className="flex items-center">
              <div className="p-3 bg-blue-100 rounded-lg">
                <FiUsers className="text-blue-600 text-2xl" />
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600">Total Users</p>
                <p className="text-2xl font-bold text-gray-900">{dashboardStats?.totalUsers || 0}</p>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-lg shadow p-6">
            <div className="flex items-center">
              <div className="p-3 bg-green-100 rounded-lg">
                <FiFileText className="text-green-600 text-2xl" />
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600">Total Posts</p>
                <p className="text-2xl font-bold text-gray-900">{dashboardStats?.totalPosts || 0}</p>
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
                <p className="text-2xl font-bold text-gray-900">{dashboardStats?.totalMessages || 0}</p>
              </div>
            </div>
          </div>

        <div className="bg-white rounded-lg shadow p-6">
            <div className="flex items-center">
              <div className="p-3 bg-red-100 rounded-lg">
                <FiAlertCircle className="text-red-600 text-2xl" />
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600">Reports</p>
                <p className="text-2xl font-bold text-gray-900">{dashboardStats?.totalReports || 0}</p>
              </div>
            </div>
          </div>
        </div>

        {/* Tabs */}
        <div className="bg-white rounded-lg shadow mb-8">
          <div className="border-b border-gray-200">
            <div className="flex -mb-px">
              {['dashboard', 'users', 'posts', 'reports'].map((tab) => (
                <button
                  key={tab}
                  onClick={() => setActiveTab(tab)}
                  className={`px-6 py-3 font-medium capitalize ${
                    activeTab === tab
                      ? 'border-b-2 border-blue-600 text-blue-600'
                      : 'text-gray-500 hover:text-gray-700 hover:border-gray-300'
                  }`}
                >
                  {tab}
                </button>
              ))}
            </div>
          </div>

          <div className="p-6">
            {/* Dashboard Tab */}
            {activeTab === 'dashboard' && (
              <div className="space-y-6">
                <h2 className="text-2xl font-bold text-gray-900">Overview</h2>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                  <div className="bg-gradient-to-br from-blue-500 to-blue-600 rounded-lg p-6 text-white">
                    <FiShield className="text-3xl mb-2" />
                    <p className="text-sm opacity-90">Active Users</p>
                    <p className="text-3xl font-bold">{dashboardStats?.activeUsers || 0}</p>
                  </div>
                  <div className="bg-gradient-to-br from-green-500 to-green-600 rounded-lg p-6 text-white">
                    <FiTrendingUp className="text-3xl mb-2" />
                    <p className="text-sm opacity-90">Posts Today</p>
                    <p className="text-3xl font-bold">{dashboardStats?.postsToday || 0}</p>
                  </div>
                  <div className="bg-gradient-to-br from-purple-500 to-purple-600 rounded-lg p-6 text-white">
                    <FiUsers className="text-3xl mb-2" />
                    <p className="text-sm opacity-90">New Users</p>
                    <p className="text-3xl font-bold">{dashboardStats?.newUsersToday || 0}</p>
                  </div>
                </div>

                {analytics && (
                  <div className="bg-gray-50 rounded-lg p-6">
                    <h3 className="text-lg font-semibold mb-4">Analytics</h3>
                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <p className="text-sm text-gray-600">Avg Posts per User</p>
                        <p className="text-2xl font-bold">{analytics.avgPostsPerUser?.toFixed(2)}</p>
                      </div>
                      <div>
                        <p className="text-sm text-gray-600">Completion Rate</p>
                        <p className="text-2xl font-bold">
                          {analytics.completionRate ? `${analytics.completionRate}%` : '0%'}
                        </p>
                      </div>
                    </div>
                  </div>
                )}
              </div>
            )}

            {/* Users Tab */}
            {activeTab === 'users' && (
              <div>
                <div className="mb-4">
                  <div className="relative">
                    <FiSearch className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
                    <input
                      type="text"
                      placeholder="Search users..."
                      value={searchQuery}
                      onChange={(e) => setSearchQuery(e.target.value)}
                      className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />
                  </div>
                </div>

                <div className="overflow-x-auto">
                  <table className="min-w-full divide-y divide-gray-200">
                    <thead className="bg-gray-50">
                      <tr>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          User
                        </th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          Email
                        </th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          Status
                        </th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          Joined
                        </th>
                        <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                          Actions
                        </th>
                      </tr>
                    </thead>
                    <tbody className="bg-white divide-y divide-gray-200">
                      {filteredUsers.map((user) => (
                        <tr key={user._id}>
                          <td className="px-6 py-4 whitespace-nowrap">
                            <div className="flex items-center">
                              <div className="w-10 h-10 rounded-full bg-blue-600 flex items-center justify-center text-white font-semibold">
                                {user.firstName?.[0] || 'U'}
                              </div>
                              <div className="ml-4">
                                <div className="text-sm font-medium text-gray-900">
                                  {user.firstName} {user.lastName}
                                </div>
                                <div className="text-sm text-gray-500">@{user.username}</div>
                              </div>
                            </div>
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap">
                            <div className="text-sm text-gray-900">{user.email}</div>
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap">
                            {user.isActive ? (
                              <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800">
                                Active
                              </span>
                            ) : (
                              <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-red-100 text-red-800">
                                Inactive
                              </span>
                            )}
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                            {new Date(user.createdAt).toLocaleDateString()}
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                            <button
                              onClick={() =>
                                handleToggleUserStatus(user._id, !user.isActive, 'Admin action')
                              }
                              className={`${
                                user.isActive ? 'text-red-600 hover:text-red-900' : 'text-green-600 hover:text-green-900'
                              }`}
                            >
                              {user.isActive ? 'Deactivate' : 'Activate'}
                            </button>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            )}

            {/* Posts Tab */}
            {activeTab === 'posts' && (
              <div>
                <div className="mb-4">
                  <div className="relative">
                    <FiSearch className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
                    <input
                      type="text"
                      placeholder="Search posts..."
                      value={searchQuery}
                      onChange={(e) => setSearchQuery(e.target.value)}
                      className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />
                  </div>
                </div>

                <div className="space-y-4">
                  {filteredPosts.map((post) => (
                    <div key={post._id} className="border border-gray-200 rounded-lg p-4">
                      <div className="flex items-start justify-between mb-2">
                        <div className="flex-1">
                          <h3 className="font-semibold text-gray-900">{post.title}</h3>
                          <p className="text-sm text-gray-600 mt-1 line-clamp-2">{post.description}</p>
                          <div className="flex items-center gap-3 mt-2 text-sm text-gray-500">
                            <span>{post.category}</span>
                            <span>•</span>
                            <span>{post.address}</span>
                            <span>•</span>
                            <span>{formatDistanceToNow(new Date(post.createdAt), { addSuffix: true })}</span>
                          </div>
                        </div>
                        <button
                          onClick={() => {
                            const reason = prompt('Enter reason for deletion:');
                            if (reason) {
                              handleDeletePost(post._id, reason);
                            }
                          }}
                          className="text-red-600 hover:text-red-800"
                        >
                          <FiX className="text-xl" />
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Reports Tab */}
            {activeTab === 'reports' && (
              <div>
                <div className="space-y-4">
                  {reports.length === 0 ? (
                    <p className="text-center text-gray-500 py-8">No reports found</p>
                  ) : (
                    reports.map((report) => (
                      <div key={report._id} className="border border-gray-200 rounded-lg p-4 hover:bg-gray-50">
                        <div className="flex items-start justify-between mb-2">
                          <div className="flex-1">
                            <h3 className="font-semibold text-gray-900">
                              {report.type} - Reported by {report.reporter?.firstName || 'Unknown'}
                            </h3>
                            <p className="text-sm text-gray-600 mt-1">{report.description}</p>
                            <div className="flex items-center gap-3 mt-2 text-sm text-gray-500">
                              <span>{formatDistanceToNow(new Date(report.createdAt), { addSuffix: true })}</span>
                              <span>•</span>
                              <span className={`px-2 py-1 rounded ${
                                report.status === 'resolved' ? 'bg-green-100 text-green-800' :
                                report.status === 'reviewing' ? 'bg-yellow-100 text-yellow-800' :
                                'bg-red-100 text-red-800'
                              }`}>
                                {report.status}
                              </span>
                            </div>
                          </div>
                          <button
                            onClick={() => handleViewReport(report)}
                            className="text-blue-600 hover:text-blue-800"
                          >
                            <FiMoreVertical className="text-xl" />
                          </button>
                        </div>
                      </div>
                    ))
                  )}
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Report Modal */}
        {reportModal.open && reportModal.report && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
            <div className="bg-white rounded-lg max-w-2xl w-full p-6">
              <h2 className="text-2xl font-bold mb-4">Report Details</h2>
              <div className="space-y-4">
                <div>
                  <h3 className="font-semibold">Type</h3>
                  <p className="text-gray-600">{reportModal.report.type}</p>
                </div>
                <div>
                  <h3 className="font-semibold">Description</h3>
                  <p className="text-gray-600">{reportModal.report.description}</p>
                </div>
                <div>
                  <h3 className="font-semibold">Status</h3>
                  <p className="text-gray-600">{reportModal.report.status}</p>
                </div>
              </div>
              <div className="mt-6 flex justify-end">
                <button
                  onClick={() => setReportModal({ open: false, report: null })}
                  className="px-4 py-2 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200"
                >
                  Close
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default AdminDashboard;
