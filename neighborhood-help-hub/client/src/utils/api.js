import axios from 'axios';

const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000/api';

// Create axios instance
const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL || 'http://localhost:5000/api',
  withCredentials: true,
});

// Request interceptor to add auth token
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('accessToken');
    if (token) config.headers.Authorization = `Bearer ${token}`;
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Response interceptor to handle token refresh
api.interceptors.response.use(
  (response) => response,
  async (error) => {
    const originalRequest = error.config;

    if (error.response?.status === 401 && !originalRequest._retry) {
      originalRequest._retry = true;

      try {
        const refreshToken = localStorage.getItem('refreshToken');
        if (refreshToken) {
          const response = await axios.post(`${API_BASE_URL}/auth/refresh-token`, {
            refreshToken,
          });

          const { accessToken, refreshToken: newRefreshToken } = response.data;
          localStorage.setItem('accessToken', accessToken);
          localStorage.setItem('refreshToken', newRefreshToken);

          // Retry original request
          originalRequest.headers.Authorization = `Bearer ${accessToken}`;
          return api(originalRequest);
        }
      } catch (refreshError) {
        // Refresh failed, redirect to login
        localStorage.removeItem('accessToken');
        localStorage.removeItem('refreshToken');
        localStorage.removeItem('user');
        window.location.href = '/login';
      }
    }

    return Promise.reject(error);
  }
);

// API endpoints
export const authAPI = {
  register: (userData) => api.post('/auth/register', userData),
  login: (credentials) => api.post('/auth/login', credentials),
  refreshToken: (refreshToken) => api.post('/auth/refresh-token', { refreshToken }),
  getProfile: () => api.get('/auth/profile'),
  updateProfile: (userData) => api.put('/auth/profile', userData),
  updateLocation: (locationData) => api.put('/auth/location', locationData),
  forgotPassword: (email) => api.post('/auth/forgot-password', { email }),
  resetPassword: (token, password) => api.post('/auth/reset-password', { token, password }),
  logout: () => api.post('/auth/logout'),
};

export const postsAPI = {
  getPosts: (params) => api.get('/posts', { params }),
  getNearbyPosts: (params) => api.get('/posts/nearby', { params }),
  getPostById: (id) => api.get(`/posts/${id}`),
  createPost: (postData) => api.post('/posts', postData),
  updatePost: (id, postData) => api.put(`/posts/${id}`, postData),
  deletePost: (id) => api.delete(`/posts/${id}`),
  acceptHelp: (id) => api.post(`/posts/${id}/accept`),
  completeHelp: (id) => api.post(`/posts/${id}/complete`),
  getUserPosts: (userId, params) => api.get(`/posts/user/${userId}`, { params }),
};

export const usersAPI = {
  getUserProfile: (userId) => api.get(`/users/${userId}`),
  searchUsers: (params) => api.get('/users/search', { params }),
  getLeaderboard: (params) => api.get('/users/leaderboard', { params }),
  rateUser: (userId, ratingData) => api.post(`/users/${userId}/rate`, ratingData),
  getUserRatings: (userId, params) => api.get(`/users/${userId}/ratings`, { params }),
  blockUser: (userId) => api.post(`/users/${userId}/block`),
  reportUser: (userId, reportData) => api.post(`/users/${userId}/report`, reportData),
};

export const chatAPI = {
  sendMessage: (messageData) => api.post('/chat/send', messageData),
  getConversations: () => api.get('/chat/conversations'),
  getConversation: (userId, params) => api.get(`/chat/conversation/${userId}`, { params }),
  markAsRead: (userId) => api.put(`/chat/read/${userId}`),
  getUnreadCount: () => api.get('/chat/unread-count'),
  deleteMessage: (messageId) => api.delete(`/chat/message/${messageId}`),
  searchMessages: (params) => api.get('/chat/search', { params }),
};

export const adminAPI = {
  getDashboardStats: () => api.get('/admin/dashboard'),
  getAllUsers: (params) => api.get('/admin/users', { params }),
  getAllPosts: (params) => api.get('/admin/posts', { params }),
  toggleUserStatus: (userId, statusData) => api.put(`/admin/users/${userId}/status`, statusData),
  deletePost: (postId, reason) => api.delete(`/admin/posts/${postId}`, { data: { reason } }),
  getReports: (params) => api.get('/admin/reports', { params }),
  getAnalytics: (params) => api.get('/admin/analytics', { params }),
};

export default api;
