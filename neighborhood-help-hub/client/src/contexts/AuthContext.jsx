import React, { createContext, useContext, useEffect, useState } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { fetchProfile } from '../slices/authSlice';

const AuthContext = createContext(undefined);

export const AuthProvider = ({ children }) => {
  const dispatch = useDispatch();
  const { isAuthenticated, user, isLoading } = useSelector((state) => state.auth);
  const [authChecked, setAuthChecked] = useState(false);

  useEffect(() => {
    const validateAuth = async () => {
      if (isAuthenticated && !user) {
        try {
          await dispatch(fetchProfile()).unwrap();
        } catch (error) {
          console.error('Failed to fetch profile:', error);
        }
      }
      setAuthChecked(true);
    };

    validateAuth();
  }, [isAuthenticated, user, dispatch]);

  const value = {
    isAuthenticated,
    user,
    isLoading,
    authChecked,
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
