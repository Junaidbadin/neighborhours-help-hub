import { configureStore } from '@reduxjs/toolkit';
import authReducer from '../slices/authSlice';
import postReducer from '../slices/postSlice';
import chatReducer from '../slices/chatSlice';
import userReducer from '../slices/userSlice';
import adminReducer from '../slices/adminSlice';
import globalLoadingReducer from './globalLoadingSlice';

export const store = configureStore({
  reducer: {
    auth: authReducer,
    posts: postReducer,
    chat: chatReducer,
    user: userReducer,
    admin: adminReducer,
    globalLoading: globalLoadingReducer,
  },
  devTools: process.env.NODE_ENV !== 'production',
});