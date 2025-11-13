import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import api from '../utils/api';

const initialState = {
  posts: [],
  currentPost: null,
  userPosts: [],
  isLoading: false,
  error: null,
  pagination: {
    currentPage: 1,
    totalPages: 1,
    total: 0,
  },
};

// =============================
// 🚀 Async Thunks
// =============================

// Fetch all posts
export const fetchPosts = createAsyncThunk(
  'posts/fetchPosts',
  async (params = {}, { rejectWithValue, signal }) => {
    try {
      const response = await api.get('/posts', { params, signal });
      return response.data?.data || { posts: [], pagination: { current: 1, pages: 1, total: 0, limit: 10 } };
    } catch (error) {
      if (error.name === 'AbortError') return;
      return rejectWithValue(error.response?.data?.message || 'Failed to fetch posts');
    }
  }
);

// Fetch single post
export const fetchPostById = createAsyncThunk(
  'posts/fetchPostById',
  async (id, { rejectWithValue }) => {
    try {
      const response = await api.get(`/posts/${id}`);
      return response.data?.data;
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || 'Failed to fetch post');
    }
  }
);

// ✅ Create Post (missing earlier)
export const createPost = createAsyncThunk(
  'posts/createPost',
  async (postData, { rejectWithValue }) => {
    try {
      const response = await api.post('/posts', postData);
      return response.data?.data;
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || 'Failed to create post');
    }
  }
);

// Update Post
export const updatePost = createAsyncThunk(
  'posts/updatePost',
  async ({ id, postData }, { rejectWithValue }) => {
    try {
      const response = await api.put(`/posts/${id}`, postData);
      return response.data?.data;
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || 'Failed to update post');
    }
  }
);

// Delete Post
export const deletePost = createAsyncThunk(
  'posts/deletePost',
  async (id, { rejectWithValue }) => {
    try {
      await api.delete(`/posts/${id}`);
      return id;
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || 'Failed to delete post');
    }
  }
);

// Accept Post
export const acceptPost = createAsyncThunk(
  'posts/acceptPost',
  async (id, { rejectWithValue }) => {
    try {
      const response = await api.post(`/posts/${id}/accept`);
      return response.data?.data;
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || 'Failed to accept post');
    }
  }
);

// Complete Post
export const completePost = createAsyncThunk(
  'posts/completePost',
  async (id, { rejectWithValue }) => {
    try {
      const response = await api.post(`/posts/${id}/complete`);
      return response.data?.data;
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || 'Failed to complete post');
    }
  }
);

// Search Posts
export const searchPosts = createAsyncThunk(
  'posts/searchPosts',
  async (params, { rejectWithValue }) => {
    try {
      const response = await api.get('/posts/search', { params });
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || 'Failed to search posts');
    }
  }
);

// Get Nearby Posts
export const getNearbyPosts = createAsyncThunk(
  'posts/getNearbyPosts',
  async (params, { rejectWithValue }) => {
    try {
      const response = await api.get('/posts/nearby', { params });
      return response.data?.data || { posts: [] };
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || 'Failed to get nearby posts');
    }
  }
);

// Fetch User Posts
export const fetchUserPosts = createAsyncThunk(
  'posts/fetchUserPosts',
  async (params = {}, { rejectWithValue, signal }) => {
    try {
      const { userId, ...rest } = params || {};
      if (!userId) return { posts: [] };
      const response = await api.get(`/posts/user/${userId}`, { params: rest, signal });
      return response.data?.data || { posts: [] };
    } catch (error) {
      if (error.name === 'AbortError') return;
      return rejectWithValue(error.response?.data?.message || 'Failed to fetch user posts');
    }
  }
);

// =============================
// 🧠 Slice
// =============================

const postSlice = createSlice({
  name: 'posts',
  initialState,
  reducers: {
    clearError: (state) => {
      state.error = null;
    },
    clearCurrentPost: (state) => {
      state.currentPost = null;
    },
    updatePostInList: (state, action) => {
      const index = state.posts.findIndex(post => post._id === action.payload._id);
      if (index !== -1) {
        state.posts[index] = action.payload;
      }
    },
  },
  extraReducers: (builder) => {
    builder
      // Fetch Posts
      .addCase(fetchPosts.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(fetchPosts.fulfilled, (state, action) => {
        state.isLoading = false;
        state.posts = Array.isArray(action.payload.posts) ? action.payload.posts : [];
        const p = action.payload.pagination || {};
        state.pagination = {
          currentPage: p.current,
          totalPages: p.pages,
          total: p.total,
        };
      })
      .addCase(fetchPosts.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload;
      })

      // Fetch Post by ID
      .addCase(fetchPostById.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(fetchPostById.fulfilled, (state, action) => {
        state.isLoading = false;
        state.currentPost = action.payload;
      })
      .addCase(fetchPostById.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload;
      })

      // ✅ Create Post
      .addCase(createPost.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(createPost.fulfilled, (state, action) => {
        state.isLoading = false;
        state.posts.unshift(action.payload);
      })
      .addCase(createPost.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload;
      })

      // Update Post
      .addCase(updatePost.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(updatePost.fulfilled, (state, action) => {
        state.isLoading = false;
        const index = state.posts.findIndex(post => post._id === action.payload._id);
        if (index !== -1) {
          state.posts[index] = action.payload;
        }
        if (state.currentPost?._id === action.payload._id) {
          state.currentPost = action.payload;
        }
      })
      .addCase(updatePost.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload;
      })

      // Delete Post
      .addCase(deletePost.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(deletePost.fulfilled, (state, action) => {
        state.isLoading = false;
        state.posts = state.posts.filter(post => post._id !== action.payload);
        if (state.currentPost?._id === action.payload) {
          state.currentPost = null;
        }
      })
      .addCase(deletePost.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload;
      })

      // Accept Post
      .addCase(acceptPost.fulfilled, (state, action) => {
        const index = state.posts.findIndex(post => post._id === action.payload._id);
        if (index !== -1) {
          state.posts[index] = action.payload;
        }
        if (state.currentPost?._id === action.payload._id) {
          state.currentPost = action.payload;
        }
      })

      // Complete Post
      .addCase(completePost.fulfilled, (state, action) => {
        const index = state.posts.findIndex(post => post._id === action.payload._id);
        if (index !== -1) {
          state.posts[index] = action.payload;
        }
        if (state.currentPost?._id === action.payload._id) {
          state.currentPost = action.payload;
        }
      })

      // Search Posts
      .addCase(searchPosts.fulfilled, (state, action) => {
        state.isLoading = false;
        state.posts = action.payload.posts;
        state.pagination = {
          currentPage: action.payload.currentPage,
          totalPages: action.payload.totalPages,
          total: action.payload.total,
        };
      })

      // Nearby Posts
      .addCase(getNearbyPosts.fulfilled, (state, action) => {
        state.isLoading = false;
        state.posts = Array.isArray(action.payload) ? action.payload : (action.payload.posts || []);
      })

      // Fetch User Posts
      .addCase(fetchUserPosts.fulfilled, (state, action) => {
        if (action.payload) {
          state.isLoading = false;
          state.userPosts = Array.isArray(action.payload.posts) ? action.payload.posts : [];
        }
      });
  },
});

export const { clearError, clearCurrentPost, updatePostInList } = postSlice.actions;
export default postSlice.reducer;
