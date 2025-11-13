const express = require('express');
const multer = require('multer');
const {
  getUserProfile,
  searchUsers,
  getLeaderboard,
  rateUser,
  getUserRatings,
  blockUser,
  reportUser,
  updateUserProfile, // 👈 New controller
} = require('../controllers/userController');
const { getMyPosts } = require('../controllers/postController');
const { verifyToken, optionalAuth } = require('../middlewares/auth');

const router = express.Router();
const upload = multer({ dest: 'uploads/' });

// 🌍 Public routes
router.get('/search', optionalAuth, searchUsers);
router.get('/leaderboard', optionalAuth, getLeaderboard);
router.get('/:userId', optionalAuth, getUserProfile);
router.get('/:userId/ratings', optionalAuth, getUserRatings);
router.get('/posts', verifyToken, getMyPosts);

// 🔒 Protected routes
router.use(verifyToken);

router.post('/:userId/rate', rateUser);
router.post('/:userId/block', blockUser);
router.post('/:userId/report', reportUser);

// ✏️ Update Profile route
router.put('/update', upload.single('profilePic'), updateUserProfile);

module.exports = router;
