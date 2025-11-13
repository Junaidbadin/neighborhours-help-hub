const express = require('express');
const Post = require('../models/Post');
const multer = require('multer'); // 1. Import Multer
const path = require('path'); // Recommended for cleaner path handling
const {
  createPost,
  getPosts,
  getNearbyPosts,
  getPostById,
  updatePost,
  deletePost,
  acceptHelp,
  completeHelp,
  getUserPosts
} = require('../controllers/postController');
const { verifyToken, optionalAuth, validateOwnership } = require('../middlewares/auth');

const router = express.Router();

// --- MULTER SETUP FOR FILE UPLOADS ---
// 2. Define storage settings
const storage = multer.diskStorage({
  // Specify where to save the files
  destination: (req, file, cb) => {
    // 'uploads/' should be relative to your server root
    cb(null, 'uploads/'); 
  },
  // Define the file naming convention
  filename: (req, file, cb) => {
    // Using originalname and timestamp to ensure unique names
    cb(null, Date.now() + '-' + file.originalname);
  }
});

// 3. Initialize multer with storage settings
const upload = multer({ 
    storage: storage,
    // Optional: Add a file filter for security (e.g., only accept images)
    fileFilter: (req, file, cb) => {
      if (file.mimetype.startsWith('image/')) {
        cb(null, true);
      } else {
        cb(new Error('Invalid file type, only images are allowed!'), false);
      }
    }
});

// Public routes (with optional auth)
router.get('/', optionalAuth, getPosts);
router.get('/nearby', optionalAuth, getNearbyPosts);
router.get('/:id', optionalAuth, getPostById);

// Protected routes
router.use(verifyToken);

// 4. Apply Multer middleware here!
// `upload.single('image')` tells Multer to expect a single file in the 
// 'image' field (which matches your client's form.append("image", ...))
router.post('/', upload.single('image'), createPost); // <-- UPDATED ROUTE

router.put('/:id', validateOwnership(Post), updatePost);
router.delete('/:id', validateOwnership(Post), deletePost);
router.post('/:id/accept', acceptHelp);
router.post('/:id/complete', completeHelp);
router.get('/user/:userId', getUserPosts);

module.exports = router;