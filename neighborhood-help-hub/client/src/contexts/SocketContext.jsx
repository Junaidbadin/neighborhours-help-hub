import React, { createContext, useContext, useEffect } from 'react';
import { io } from 'socket.io-client';
import { useSelector, useDispatch } from 'react-redux';
import { addMessage, setTyping, updateUnreadCount } from '../slices/chatSlice';
import toast from 'react-hot-toast';

const SocketContext = createContext(undefined);

export const SocketProvider = ({ children }) => {
  const dispatch = useDispatch();
  const { isAuthenticated, user } = useSelector((state) => state.auth);
  const [socket, setSocket] = React.useState(null);
  const [isConnected, setIsConnected] = React.useState(false);

  useEffect(() => {
    if (isAuthenticated && user) {
      // Normalize socket URL (strip trailing /api if present)
      const rawUrl = import.meta.env.VITE_API_URL || 'http://localhost:5000';
      const socketUrl = rawUrl.endsWith('/api') ? rawUrl.replace(/\/api$/, '') : rawUrl;
      const newSocket = io(socketUrl, {
        auth: {
          token: localStorage.getItem('accessToken'),
        },
      });

      newSocket.on('connect', () => {
        console.log('Connected to server');
        setIsConnected(true);
        
        // Join user's personal room
        const uid = user?._id || user?.id;
        newSocket.emit('join-user-room', uid);
      });

      newSocket.on('disconnect', () => {
        console.log('Disconnected from server');
        setIsConnected(false);
      });

      newSocket.on('receive-message', (data) => {
        dispatch(addMessage(data));
        
        // Show notification if not in the current chat
        if (window.location.pathname !== `/chat/${data.senderId}`) {
          toast.success(`New message from ${data.senderName}`, {
            duration: 4000,
            onClick: () => {
              window.location.href = `/chat/${data.senderId}`;
            },
          });
        }
      });

      newSocket.on('user-typing', (data) => {
        dispatch(setTyping({
          isTyping: data.isTyping,
          userId: data.senderId,
        }));
      });

      newSocket.on('receive-notification', (notification) => {
        toast.success(notification.title, {
          description: notification.message,
          duration: 5000,
        });
      });

      setSocket(newSocket);

      return () => {
        newSocket.close();
      };
    } else {
      if (socket) {
        socket.close();
        setSocket(null);
        setIsConnected(false);
      }
    }
  }, [isAuthenticated, user, dispatch]);

  const value = {
    socket,
    isConnected,
  };

  return (
    <SocketContext.Provider value={value}>
      {children}
    </SocketContext.Provider>
  );
};

export const useSocket = () => {
  const context = useContext(SocketContext);
  if (context === undefined) {
    throw new Error('useSocket must be used within a SocketProvider');
  }
  return context;
};
