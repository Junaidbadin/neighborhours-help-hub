const express = require('express');
const {
  sendMessage,
  getConversation,
  getConversations,
  markAsRead,
  getUnreadCount,
  deleteMessage,
  searchMessages
} = require('../controllers/chatController');
const { verifyToken } = require('../middlewares/auth');

const router = express.Router();

// All chat routes require authentication
router.use(verifyToken);

router.post('/send', sendMessage);
router.get('/conversations', getConversations);
router.get('/conversation/:userId', getConversation);
router.put('/read/:userId', markAsRead);
router.get('/unread-count', getUnreadCount);
router.delete('/message/:messageId', deleteMessage);
router.get('/search', searchMessages);

module.exports = router;