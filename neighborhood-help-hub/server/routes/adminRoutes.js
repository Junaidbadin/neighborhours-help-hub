const express = require('express');
const {
  getDashboardStats,
  getAllUsers,
  getAllPosts,
  toggleUserStatus,
  deletePost,
  getReports,
  getAnalytics
} = require('../controllers/adminController');
const { verifyToken, requireAdmin } = require('../middlewares/auth');

const router = express.Router();

// All admin routes require authentication and admin role
router.use(verifyToken);
router.use(requireAdmin);

router.get('/dashboard', getDashboardStats);
router.get('/users', getAllUsers);
router.get('/posts', getAllPosts);
router.get('/reports', getReports);
router.get('/analytics', getAnalytics);

router.put('/users/:userId/status', toggleUserStatus);
router.delete('/posts/:postId', deletePost);

module.exports = router;