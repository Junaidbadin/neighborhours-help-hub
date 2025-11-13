import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import api from '../utils/api';

const initialState = {
  conversations: [],
  currentConversation: [],
  currentChatUser: null,
  isLoading: false,
  error: null,
  unreadCount: 0,
  isTyping: false,
  typingUser: null,
};

// Async thunks
export const fetchConversations = createAsyncThunk(
  'chat/fetchConversations',
  async (_, { rejectWithValue }) => {
    try {
      const response = await api.get('/chat/conversations');
      // Backend shape: { success, data: [ ... ] }
      return response.data?.data || [];
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || 'Failed to fetch conversations');
    }
  }
);

export const fetchConversation = createAsyncThunk(
  'chat/fetchConversation',
  async (params, { rejectWithValue }) => {
    try {
      const response = await api.get(`/chat/conversation/${params.userId}`, {
        params: { page: params.page, limit: params.limit }
      });
      // Backend shape: { success, data: { messages, otherUser } }
      return response.data?.data || { messages: [], otherUser: null };
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || 'Failed to fetch conversation');
    }
  }
);

export const sendMessage = createAsyncThunk(
  'chat/sendMessage',
  async (data, { rejectWithValue }) => {
    try {
      const response = await api.post('/chat/send', data);
      return response.data?.data;
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || 'Failed to send message');
    }
  }
);

export const markConversationAsRead = createAsyncThunk(
  'chat/markConversationAsRead',
  async (userId, { rejectWithValue }) => {
    try {
      await api.put(`/chat/read/${userId}`);
      return userId;
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || 'Failed to mark messages as read');
    }
  }
);

export const getUnreadCount = createAsyncThunk(
  'chat/getUnreadCount',
  async (_, { rejectWithValue }) => {
    try {
      const response = await api.get('/chat/unread-count');
      return response.data?.data?.unreadCount || 0;
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || 'Failed to get unread count');
    }
  }
);

export const blockUser = createAsyncThunk(
  'chat/blockUser',
  async (userId, { rejectWithValue }) => {
    try {
      const response = await api.post(`/chat/block/${userId}`);
      return { userId, message: response.data.message };
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || 'Failed to block user');
    }
  }
);

export const reportUser = createAsyncThunk(
  'chat/reportUser',
  async (data, { rejectWithValue }) => {
    try {
      const response = await api.post(`/chat/report/${data.userId}`, {
        reason: data.reason,
        description: data.description
      });
      return response.data.message;
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || 'Failed to report user');
    }
  }
);

const chatSlice = createSlice({
  name: 'chat',
  initialState,
  reducers: {
    clearError: (state) => {
      state.error = null;
    },
    setCurrentChatUser: (state, action) => {
      state.currentChatUser = action.payload;
    },
    addMessage: (state, action) => {
      // Add message to current conversation if it matches
      if (state.currentChatUser && 
          (action.payload.sender._id === state.currentChatUser._id || 
           action.payload.receiver._id === state.currentChatUser._id)) {
        state.currentConversation.push(action.payload);
      }
      
      // Update conversations list
      const conversationId = action.payload.conversationId;
      const conversationIndex = state.conversations.findIndex(conv => conv._id === conversationId);
      
      if (conversationIndex !== -1) {
        state.conversations[conversationIndex].lastMessage = action.payload;
        // Move to top
        const conversation = state.conversations.splice(conversationIndex, 1)[0];
        state.conversations.unshift(conversation);
      }
    },
    setTyping: (state, action) => {
      state.isTyping = action.payload.isTyping;
      state.typingUser = action.payload.isTyping ? action.payload.userId : null;
    },
    clearCurrentConversation: (state) => {
      state.currentConversation = [];
      state.currentChatUser = null;
    },
    updateUnreadCount: (state, action) => {
      state.unreadCount = action.payload;
    },
  },
  extraReducers: (builder) => {
    builder
      // Fetch Conversations
      .addCase(fetchConversations.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(fetchConversations.fulfilled, (state, action) => {
        state.isLoading = false;
        state.conversations = Array.isArray(action.payload) ? action.payload : [];
      })
      .addCase(fetchConversations.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload;
      })
      // Fetch Conversation
      .addCase(fetchConversation.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(fetchConversation.fulfilled, (state, action) => {
        state.isLoading = false;
        state.currentConversation = Array.isArray(action.payload.messages) ? action.payload.messages : [];
        state.currentChatUser = action.payload.otherUser;
      })
      .addCase(fetchConversation.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload;
      })
      // Send Message
      .addCase(sendMessage.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(sendMessage.fulfilled, (state, action) => {
        state.isLoading = false;
        state.currentConversation.push(action.payload);
      })
      .addCase(sendMessage.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload;
      })
      // Mark Message as Read
      .addCase(markConversationAsRead.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(markConversationAsRead.fulfilled, (state, action) => {
        state.isLoading = false;
        // Clear unread locally when marking conversation as read
        state.unreadCount = 0;
      })
      .addCase(markConversationAsRead.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload;
      })
      // Get Unread Count
      .addCase(getUnreadCount.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(getUnreadCount.fulfilled, (state, action) => {
        state.isLoading = false;
        state.unreadCount = action.payload;
      })
      .addCase(getUnreadCount.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload;
      })
      // Block User
      .addCase(blockUser.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(blockUser.fulfilled, (state, action) => {
        state.isLoading = false;
        // Remove conversation with blocked user
        state.conversations = state.conversations.filter(conv => 
          conv.sender._id !== action.payload.userId && conv.receiver._id !== action.payload.userId
        );
        if (state.currentChatUser?._id === action.payload.userId) {
          state.currentChatUser = null;
          state.currentConversation = [];
        }
      })
      .addCase(blockUser.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload;
      })
      // Report User
      .addCase(reportUser.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(reportUser.fulfilled, (state) => {
        state.isLoading = false;
      })
      .addCase(reportUser.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload;
      });
  },
});

export const { 
  clearError, 
  setCurrentChatUser, 
  addMessage, 
  setTyping, 
  clearCurrentConversation,
  updateUnreadCount 
} = chatSlice.actions;
export default chatSlice.reducer;
