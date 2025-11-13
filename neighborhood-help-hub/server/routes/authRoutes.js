const express = require("express");
const {
  register,
  login,
  refreshToken,
  getProfile,
  updateProfile,
  updateLocation,
  forgotPassword,
  resetPassword,
  logout,
} = require("../controllers/authController");
const { verifyToken, authRateLimit } = require("../middlewares/auth");

const router = express.Router();

// ✅ Debug middleware to catch all errors in one place
router.use((req, res, next) => {
  console.log(`➡️ [${req.method}] ${req.originalUrl}`);
  next();
});

// 🟢 Public Routes (no token required)
router.post("/register", authRateLimit, register);
router.post("/login", authRateLimit, login);
router.post("/refresh-token", refreshToken);
router.post("/forgot-password", authRateLimit, forgotPassword);
router.post("/reset-password", authRateLimit, resetPassword);

// 🔒 Protected routes (token required)
router.use(verifyToken);

router.get("/profile", getProfile);
router.put("/profile", updateProfile);
router.put("/location", updateLocation);
router.post("/logout", logout);

module.exports = router;
