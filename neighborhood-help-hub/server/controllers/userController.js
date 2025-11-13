const User = require('../models/User'); // Make sure this path is correct

// 🧍 Get a user's profile
const getUserProfile = async (req, res) => {
  try {
    const user = await User.findById(req.params.userId).select('-password');
    if (!user) {
      return res.status(404).json({ success: false, message: 'User not found' });
    }
    res.json({ success: true, data: user });
  } catch (error) {
    console.error('Get user profile error:', error);
    res.status(500).json({ success: false, message: 'Server error' });
  }
};

// 🔍 Search users
const searchUsers = async (req, res) => {
  try {
    const query = req.query.q || '';
    const users = await User.find({
      name: { $regex: query, $options: 'i' },
    }).select('-password');
    res.json({ success: true, data: users });
  } catch (error) {
    console.error('Search users error:', error);
    res.status(500).json({ success: false, message: 'Failed to search users' });
  }
};

// 🏆 Get leaderboard
const getLeaderboard = async (req, res) => {
  try {
    const users = await User.find().sort({ rating: -1 }).limit(10);
    res.json({ success: true, data: users });
  } catch (error) {
    console.error('Leaderboard error:', error);
    res.status(500).json({ success: false, message: 'Failed to fetch leaderboard' });
  }
};

// ⭐ Rate a user
const rateUser = async (req, res) => {
  try {
    res.json({ success: true, message: 'User rated successfully (stub)' });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Failed to rate user' });
  }
};

// 🧾 Get user ratings
const getUserRatings = async (req, res) => {
  try {
    res.json({ success: true, message: 'User ratings fetched successfully (stub)' });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Failed to get user ratings' });
  }
};

// 🚫 Block a user
const blockUser = async (req, res) => {
  try {
    res.json({ success: true, message: 'User blocked successfully (stub)' });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Failed to block user' });
  }
};

// ⚠️ Report a user
const reportUser = async (req, res) => {
  try {
    res.json({ success: true, message: 'User reported successfully (stub)' });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Failed to report user' });
  }
};

// 📝 Update user profile
const updateUserProfile = async (req, res) => {
  try {
    const userId = req.user.userId; // from verifyToken middleware
    const { name, city, address, skills, age, gender, bio } = req.body;

    const updates = {};

    if (name) updates.name = name;
    if (city) updates.city = city;
    if (address) updates.address = address;
    if (skills) updates.skills = skills.split(',').map(s => s.trim());
    if (age) updates.age = age;
    if (gender) updates.gender = gender;
    if (bio !== undefined) updates.bio = bio;

    if (req.file) {
      updates.profilePic = req.file.path || req.file.secure_url;
    }

    const updatedUser = await User.findByIdAndUpdate(
      userId,
      { $set: updates },
      { new: true, select: '-password -verificationToken -passwordResetToken' }
    );

    if (!updatedUser) {
      return res.status(404).json({
        success: false,
        message: 'User not found',
      });
    }

    res.json({
      success: true,
      message: 'Profile updated successfully',
      data: updatedUser,
    });
  } catch (error) {
    console.error('Update profile error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to update profile',
      error: error.message,
    });
  }
};

// ✅ Export everything properly
module.exports = {
  getUserProfile,
  searchUsers,
  getLeaderboard,
  rateUser,
  getUserRatings,
  blockUser,
  reportUser,
  updateUserProfile,
};
