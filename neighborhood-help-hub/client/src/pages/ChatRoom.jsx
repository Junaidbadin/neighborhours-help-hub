import React, { useEffect, useState, useRef } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useParams, Link } from 'react-router-dom';
import { useSocket } from '../contexts/SocketContext';
import { fetchConversation, sendMessage as sendMessageAction, addMessage } from '../slices/chatSlice';
import { FiSend, FiArrowLeft, FiMoreVertical } from 'react-icons/fi';

const ChatRoom = () => {
  const dispatch = useDispatch();
  const { socket } = useSocket();
  const { userId } = useParams();
  
  const { currentConversation, currentChatUser, isLoading } = useSelector((state) => state.chat);
  const { user } = useSelector((state) => state.auth);
  
  const [message, setMessage] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const messagesEndRef = useRef(null);

  useEffect(() => {
    // Fetch conversation messages
    dispatch(fetchConversation({ userId, page: 1, limit: 50 }));

    // Join chat room
    if (socket && userId) {
      socket.emit('join-chat', {
        senderId: user?.id,
        receiverId: userId,
      });

      // Listen for new messages
      const handleReceiveMessage = (data) => {
        if (data.senderId === userId || data.receiverId === userId) {
          dispatch(addMessage(data));
        }
      };

      const handleUserTyping = (data) => {
        if (data.senderId === userId) {
          setIsTyping(data.isTyping);
        }
      };

      socket.on('receive-message', handleReceiveMessage);
      socket.on('user-typing', handleUserTyping);

      return () => {
        socket.off('receive-message', handleReceiveMessage);
        socket.off('user-typing', handleUserTyping);
      };
    }
  }, [dispatch, socket, userId, user]);

  // Scroll to bottom when messages change
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [currentConversation]);

  const handleSendMessage = async (e) => {
    e.preventDefault();
    
    if (!message.trim() || !socket) return;

    const messageData = {
      receiverId: userId,
      content: message.trim(),
    };

    // Send via socket for real-time
    socket.emit('send-message', {
      senderId: user?.id,
      receiverId: userId,
      senderName: `${user?.firstName} ${user?.lastName}`,
      content: message.trim(),
    });

    // Also save to backend
    try {
      await dispatch(sendMessageAction(messageData)).unwrap();
    } catch (error) {
      console.error('Failed to send message:', error);
    }

    setMessage('');
    
    // Stop typing indicator
    if (socket) {
      socket.emit('stop-typing', {
        senderId: user?.id,
        receiverId: userId,
      });
    }
  };

  const handleTyping = () => {
    if (socket && message.trim()) {
      socket.emit('typing', {
        senderId: user?.id,
        receiverId: userId,
        isTyping: true,
      });
    }
  };

  const formatTime = (date) => {
    return new Date(date).toLocaleTimeString('en-US', {
      hour: 'numeric',
      minute: '2-digit',
    });
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gray-50 py-8">
        <div className="max-w-4xl mx-auto px-4">
          <div className="text-center">Loading conversation...</div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col">
      {/* Header */}
      <div className="bg-white shadow-sm border-b">
        <div className="max-w-4xl mx-auto px-4 py-4">
          <div className="flex items-center gap-4">
            <Link
              to="/chat"
              className="p-2 hover:bg-gray-100 rounded-lg transition"
            >
              <FiArrowLeft className="text-xl" />
            </Link>
            <div className="flex-shrink-0">
              <div className="w-10 h-10 rounded-full bg-blue-600 flex items-center justify-center text-white font-semibold">
                {currentChatUser?.firstName?.[0] || 'U'}
              </div>
            </div>
            <div className="flex-1 min-w-0">
              <h2 className="font-semibold text-gray-900">
                {currentChatUser?.firstName} {currentChatUser?.lastName}
              </h2>
              <p className="text-sm text-gray-500 truncate">{currentChatUser?.email}</p>
            </div>
            <button className="p-2 hover:bg-gray-100 rounded-lg transition">
              <FiMoreVertical />
            </button>
          </div>
        </div>
      </div>

      {/* Messages */}
      <div className="flex-1 overflow-y-auto">
        <div className="max-w-4xl mx-auto px-4 py-6">
          <div className="space-y-4">
            {currentConversation.length === 0 ? (
              <div className="text-center py-12">
                <p className="text-gray-500">No messages yet. Start the conversation!</p>
              </div>
            ) : (
              currentConversation.map((msg, index) => {
                const isOwnMessage = msg.sender?.id === user?.id || msg.sender?._id === user?.id;
                
                return (
                  <div
                    key={msg._id || index}
                    className={`flex ${isOwnMessage ? 'justify-end' : 'justify-start'}`}
                  >
                    <div
                      className={`max-w-xs lg:max-w-md px-4 py-2 rounded-lg ${
                        isOwnMessage
                          ? 'bg-blue-600 text-white'
                          : 'bg-white text-gray-900 border border-gray-200'
                      }`}
                    >
                      <p className="text-sm whitespace-pre-wrap break-words">{msg.content}</p>
                      <p
                        className={`text-xs mt-1 ${
                          isOwnMessage ? 'text-blue-100' : 'text-gray-500'
                        }`}
                      >
                        {formatTime(msg.createdAt)}
                      </p>
                    </div>
                  </div>
                );
              })
            )}

            {isTyping && (
              <div className="flex justify-start">
                <div className="bg-white text-gray-900 border border-gray-200 px-4 py-2 rounded-lg">
                  <span className="text-sm">Typing...</span>
                </div>
              </div>
            )}

            <div ref={messagesEndRef} />
          </div>
        </div>
      </div>

      {/* Input */}
      <div className="bg-white border-t">
        <div className="max-w-4xl mx-auto px-4 py-4">
          <form onSubmit={handleSendMessage} className="flex items-center gap-2">
            <input
              type="text"
              value={message}
              onChange={(e) => {
                setMessage(e.target.value);
                handleTyping();
              }}
              placeholder="Type a message..."
              className="flex-1 px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
            <button
              type="submit"
              disabled={!message.trim()}
              className="p-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:bg-gray-300 disabled:cursor-not-allowed transition"
            >
              <FiSend />
            </button>
          </form>
        </div>
      </div>
    </div>
  );
};

export default ChatRoom;
