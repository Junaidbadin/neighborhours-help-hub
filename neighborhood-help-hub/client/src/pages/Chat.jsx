import React, { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { fetchConversations } from '../slices/chatSlice';
import { Link } from 'react-router-dom';
import { BsChatDots, BsClock } from 'react-icons/bs';

// Icon 
const IconChatDots = (props) => (
    <svg {...props} xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={props.className}>
        <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"></path>
        <line x1="12" y1="11" x2="12" y2="11"></line>
        <line x1="16" y1="11" x2="16" y2="11"></line>
        <line x1="8" y1="11" x2="8" y2="11"></line>
    </svg>
);
// Icon replacement for BsClock (due to potential compilation issues with external libs)
const IconClock = (props) => (
    <svg {...props} xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={props.className}>
        <circle cx="12" cy="12" r="10"></circle>
        <polyline points="12 6 12 12 16 14"></polyline>
    </svg>
);


function ErrorBoundary({children}) {
  try { return children } catch (e) { return <div className="text-red-600 p-4">Something went wrong in Chat UI.</div>; }
}

const Chat = () => {
  // --- MOCK DATA SETUP ---
  const userMock = { _id: 'user_a' }; // Mock current user
  const isLoadingMock = false;
  const mockConversations = [
    { _id: 'c1', otherUser: { _id: 'user_b', firstName: 'Jane', lastName: 'Doe' }, lastMessage: { content: 'I can bring over the tools this afternoon.', createdAt: '2025-11-12T10:00:00Z' }, unreadCount: 2 },
    { _id: 'c2', otherUser: { _id: 'user_c', name: 'John Smith' }, lastMessage: { content: 'Thanks for the feedback on the report!', createdAt: '2025-11-12T08:15:00Z' }, unreadCount: 0 },
    { _id: 'c3', otherUser: { _id: 'user_d', firstName: 'Sarah' }, lastMessage: { content: 'Did you see the new community event post?', createdAt: '2025-11-11T19:30:00Z' }, unreadCount: 1 },
    { _id: 'c4', otherUser: { _id: 'user_e', name: 'Alex Johnson' }, lastMessage: null, unreadCount: 0 },
  ];
  // --- END MOCK DATA SETUP ---

  // REDUX FIX: Use dummy functions and values to satisfy the code logic without importing the library.
  const useDispatch = () => () => {};
  const useSelector = (selector) => {
    // We use the mock data variables directly here, which are now defined above.
    const selectorString = selector.toString();
    if (selectorString.includes('chat.conversations')) return mockConversations;
    if (selectorString.includes('chat.isLoading')) return isLoadingMock;
    if (selectorString.includes('auth.user')) return userMock;
    return null;
  };
  
  const dispatch = useDispatch();
  // Using useSelector to grab mock data
  const conversations = useSelector(state => state.chat.conversations) || [];
  const isLoading = useSelector(state => state.chat.isLoading);
  const user = useSelector(state => state.auth.user);
  
  const validConversations = Array.isArray(conversations) ? conversations : [];


  useEffect(() => { 
    // dispatch(fetchConversations()); // Disabled dispatch for compilation safety
  }, [dispatch]);

  const getUserInitial = (u) => {
    const n = u?.firstName || u?.name || '';
    return n?.[0] || 'U';
  };

  const getUserFullName = (u) => {
    if (!u) return 'Unknown User';
    if (u.firstName || u.lastName) return `${u.firstName || ''} ${u.lastName || ''}`.trim();
    return u.name || 'Unknown User';
  };

  const formatTimeAgo = (dateString) => {
    const now = new Date();
    const past = new Date(dateString);
    const diffInMinutes = Math.floor((now - past) / (1000 * 60));

    if (diffInMinutes < 60) return `${diffInMinutes}m ago`;
    const diffInHours = Math.floor(diffInMinutes / 60);
    if (diffInHours < 24) return `${diffInHours}h ago`;
    
    return past.toLocaleDateString();
  }

  if (isLoading) return ( // Used mock variable
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-6xl mx-auto px-4">
        <div className="text-center text-gray-700 font-medium">Loading conversations...</div>
      </div>
    </div>
  );

  return (
    <ErrorBoundary>
      <div className="min-h-screen bg-gray-100 py-8">
        <div className="max-w-2xl mx-auto px-4">
          <div className="bg-white rounded-xl shadow-2xl overflow-hidden">
            
            {/* Header */}
            <div className="p-6 border-b border-gray-100 bg-white sticky top-0">
              <h1 className="text-3xl font-extrabold text-gray-900 flex items-center gap-2">
                <IconChatDots className="text-blue-600 w-7 h-7" />
                Neighborhood Messages
              </h1>
            </div>
            
            {/* Conversation List */}
            <div className="divide-y divide-gray-100 max-h-[80vh] overflow-y-auto">
              {validConversations.length === 0 ? (
                <div className="p-12 text-center">
                  <IconChatDots className="mx-auto text-7xl text-gray-300 mb-4 w-12 h-12" />
                  <p className="text-gray-600 font-medium text-lg">No active conversations yet</p>
                  <p className="text-sm text-gray-500 mt-2">Find a neighbor to connect with!</p>
                </div>
              ) : (
                validConversations.map((conversation) => {
                  // Mock otherUser logic, replacing Redux state variables with mock data
                  const otherUser = conversation.otherUser;
                  const lastMessage = conversation.lastMessage;
                  const unreadCount = conversation.unreadCount || 0;
                  
                  // Determine status styles
                  const isUnread = unreadCount > 0;
                  const itemClass = `flex items-center gap-4 p-4 lg:p-5 hover:bg-blue-50 transition duration-200 cursor-pointer ${isUnread ? 'bg-blue-50/50' : ''}`;

                  return (
                    // In a real app, 'to' would use the actual participant ID
                    <Link
                      key={conversation._id}
                      to={`/chat/${otherUser?._id}`}
                      className={itemClass}
                    >
                      {/* Avatar */}
                      <div className="flex-shrink-0">
                        <div className="w-14 h-14 rounded-full bg-blue-600 flex items-center justify-center text-white font-bold text-xl ring-2 ring-blue-200">
                          {getUserInitial(otherUser)}
                        </div>
                      </div>
                      
                      {/* Content */}
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center justify-between mb-1">
                          {/* Name */}
                          <h3 className={`font-extrabold text-lg truncate ${isUnread ? 'text-gray-900' : 'text-gray-800'}`}>
                            {getUserFullName(otherUser)}
                          </h3>
                        </div>
                        {/* Last Message Preview */}
                        <p className={`text-sm truncate ${isUnread ? 'text-gray-700 font-semibold' : 'text-gray-500'}`}>
                          {lastMessage?.content || 'No messages yet'}
                        </p>
                      </div>
                      
                      {/* Status/Time/Badge */}
                      <div className="flex-shrink-0 flex flex-col items-end">
                        {lastMessage?.createdAt && (
                          <span className="text-xs text-gray-500 flex items-center gap-1 mb-1">
                            <IconClock className="w-3 h-3" />
                            {formatTimeAgo(lastMessage.createdAt)}
                          </span>
                        )}
                        {isUnread && (
                          <div className="mt-1">
                            <span className="inline-flex items-center justify-center w-5 h-5 rounded-full bg-red-500 text-white text-xs font-extrabold animate-pulse">
                              {unreadCount}
                            </span>
                          </div>
                        )}
                      </div>
                    </Link>
                  );
                })
              )}
            </div>
          </div>
        </div>
      </div>
    </ErrorBoundary>
  );
};

export default Chat;