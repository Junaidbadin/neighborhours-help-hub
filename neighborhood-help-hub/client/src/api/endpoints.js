const BASE_URL = "http://localhost:5000/api";

export const API = {
  auth: {
    register: `${BASE_URL}/auth/register`,
    login: `${BASE_URL}/auth/login`,
    logout: `${BASE_URL}/auth/logout`,
    refresh: `${BASE_URL}/auth/refresh`,
  },
  posts: {
    create: `${BASE_URL}/posts`,
    getAll: `${BASE_URL}/posts`,
    getById: (id) => `${BASE_URL}/posts/${id}`,
    delete: (id) => `${BASE_URL}/posts/${id}`,
    update: (id) => `${BASE_URL}/posts/${id}`,
  },
  messages: {
    send: `${BASE_URL}/messages/send`,
    fetch: `${BASE_URL}/messages`,
  },
  notifications: {
    fetch: `${BASE_URL}/notifications`,
    markRead: (id) => `${BASE_URL}/notifications/${id}/read`,
  },
  ratings: {
    add: `${BASE_URL}/ratings/add`,
    getAll: `${BASE_URL}/ratings`,
  },
  users: {
    getProfile: `${BASE_URL}/users/profile`,
    updateProfile: `${BASE_URL}/users/update`,
  },
};
export default API;



