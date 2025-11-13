const User = require('../models/User');
const Post = require('../models/Post');
const Message = require('../models/Message');
const Rating = require('../models/Rating');
const Notification = require('../models/Notification');

// Get admin dashboard stats
const getDashboardStats = async (req, res) => {
  try {
    const [
      totalUsers,
      activeUsers,
      totalPosts,
      activePosts,
      completedPosts,
      totalMessages,
      totalRatings,
      recentUsers,
      recentPosts
    ] = await Promise.all([
      User.countDocuments(),
      User.countDocuments({ isActive: true }),
      Post.countDocuments(),
      Post.countDocuments({ status: 'active' }),
      Post.countDocuments({ status: 'completed' }),
      Message.countDocuments(),
      Rating.countDocuments(),
      User.find({ isActive: true })
        .select('name email city createdAt')
        .sort({ createdAt: -1 })
        .limit(5),
      Post.find({ status: 'active' })
        .populate('author', 'name')
        .sort({ createdAt: -1 })
        .limit(5)
    ]);

    // Calculate growth metrics (last 30 days)
    const thirtyDaysAgo = new Date(Date.now() - 30 * 24 * 60 * 60 * 1000);
    
    const [
      newUsersThisMonth,
      newPostsThisMonth,
      completedPostsThisMonth
    ] = await Promise.all([
      User.countDocuments({ createdAt: { $gte: thirtyDaysAgo } }),
      Post.countDocuments({ createdAt: { $gte: thirtyDaysAgo } }),
      Post.countDocuments({ 
        status: 'completed',
        completedAt: { $gte: thirtyDaysAgo }
      })
    ]);

    res.json({
      success: true,
      stats: {
        totalUsers,
        activeUsers,
        totalPosts,
        activePosts,
        completedPosts,
        totalMessages,
        totalReports: 0, // Add total reports for UI consistency
        postsToday: newPostsThisMonth,
        newUsersToday: newUsersThisMonth,
        overview: {
          totalUsers,
          activeUsers,
          totalPosts,
          activePosts,
          completedPosts,
          totalMessages,
          totalRatings
        },
        growth: {
          newUsersThisMonth,
          newPostsThisMonth,
          completedPostsThisMonth
        },
        recent: {
          users: recentUsers,
          posts: recentPosts
        }
      }
    });
  } catch (error) {
    console.error('Get dashboard stats error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to fetch dashboard stats',
      error: error.message
    });
  }
};

// Get all users with pagination
const getAllUsers = async (req, res) => {
  try {
    const { page = 1, limit = 20, search, status, sortBy = 'createdAt', sortOrder = 'desc' } = req.query;

    let query = {};
    
    if (search) {
      query.$or = [
        { name: { $regex: search, $options: 'i' } },
        { email: { $regex: search, $options: 'i' } },
        { city: { $regex: search, $options: 'i' } }
      ];
    }

    if (status) {
      query.isActive = status === 'active';
    }

    const sortOptions = {};
    sortOptions[sortBy] = sortOrder === 'desc' ? -1 : 1;

    const users = await User.find(query)
      .select('-password -verificationToken -passwordResetToken')
      .sort(sortOptions)
      .limit(limit * 1)
      .skip((page - 1) * limit);

    const total = await User.countDocuments(query);

    res.json({
      success: true,
      users,
      data: {
        users,
        pagination: {
          current: parseInt(page),
          pages: Math.ceil(total / limit),
          total,
          limit: parseInt(limit)
        }
      }
    });
  } catch (error) {
    console.error('Get all users error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to fetch users',
      error: error.message
    });
  }
};

// Get all posts with pagination
const getAllPosts = async (req, res) => {
  try {
    const { page = 1, limit = 20, search, status, type, category } = req.query;

    let query = {};
    
    if (search) {
      query.$or = [
        { title: { $regex: search, $options: 'i' } },
        { description: { $regex: search, $options: 'i' } }
      ];
    }

    if (status) query.status = status;
    if (type) query.type = type;
    if (category) query.category = category;

    const posts = await Post.find(query)
      .populate('author', 'name email city')
      .populate('acceptedBy', 'name email')
      .sort({ createdAt: -1 })
      .limit(limit * 1)
      .skip((page - 1) * limit);

    const total = await Post.countDocuments(query);

    res.json({
      success: true,
      posts,
      data: {
        posts,
        pagination: {
          current: parseInt(page),
          pages: Math.ceil(total / limit),
          total,
          limit: parseInt(limit)
        }
      }
    });
  } catch (error) {
    console.error('Get all posts error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to fetch posts',
      error: error.message
    });
  }
};

// Suspend/activate user
const toggleUserStatus = async (req, res) => {
  try {
    const { userId } = req.params;
    const { isActive, reason } = req.body;

    const user = await User.findById(userId);
    if (!user) {
      return res.status(404).json({
        success: false,
        message: 'User not found'
      });
    }

    user.isActive = isActive;
    await user.save();

    // Create notification for user
    await Notification.createNotification({
      user: userId,
      title: isActive ? 'Account Reactivated' : 'Account Suspended',
      message: isActive 
        ? 'Your account has been reactivated by an administrator.'
        : `Your account has been suspended. Reason: ${reason || 'Violation of terms of service'}`,
      type: 'admin',
      priority: 'high'
    });

    res.json({
      success: true,
      message: `User ${isActive ? 'activated' : 'suspended'} successfully`,
      data: user
    });
  } catch (error) {
    console.error('Toggle user status error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to update user status',
      error: error.message
    });
  }
};

// Delete post
const deletePost = async (req, res) => {
  try {
    const { postId } = req.params;
    const { reason } = req.body;

    const post = await Post.findById(postId);
    if (!post) {
      return res.status(404).json({
        success: false,
        message: 'Post not found'
      });
    }

    await Post.findByIdAndDelete(postId);

    // Notify post author
    await Notification.createNotification({
      user: post.author,
      title: 'Post Removed',
      message: `Your post "${post.title}" has been removed by an administrator. Reason: ${reason || 'Violation of terms of service'}`,
      type: 'admin',
      priority: 'high'
    });

    res.json({
      success: true,
      message: 'Post deleted successfully'
    });
  } catch (error) {
    console.error('Delete post error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to delete post',
      error: error.message
    });
  }
};

// Get reports
const getReports = async (req, res) => {
  try {
    const { page = 1, limit = 20, status = 'pending' } = req.query;

    const reports = await Notification.find({
      type: 'admin',
      'metadata.reportedUser': { $exists: true }
    })
    .populate('user', 'name email')
    .sort({ createdAt: -1 })
    .limit(limit * 1)
    .skip((page - 1) * limit);

    const total = await Notification.countDocuments({
      type: 'admin',
      'metadata.reportedUser': { $exists: true }
    });

    res.json({
      success: true,
      data: {
        reports,
        pagination: {
          current: parseInt(page),
          pages: Math.ceil(total / limit),
          total,
          limit: parseInt(limit)
        }
      }
    });
  } catch (error) {
    console.error('Get reports error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to fetch reports',
      error: error.message
    });
  }
};

// Get analytics
const getAnalytics = async (req, res) => {
  try {
    const { period = '30d' } = req.query;
    
    let startDate;
    switch (period) {
      case '7d':
        startDate = new Date(Date.now() - 7 * 24 * 60 * 60 * 1000);
        break;
      case '30d':
        startDate = new Date(Date.now() - 30 * 24 * 60 * 60 * 1000);
        break;
      case '90d':
        startDate = new Date(Date.now() - 90 * 24 * 60 * 60 * 1000);
        break;
      default:
        startDate = new Date(Date.now() - 30 * 24 * 60 * 60 * 1000);
    }

    // Get daily stats
    const dailyStats = await Post.aggregate([
      {
        $match: {
          createdAt: { $gte: startDate }
        }
      },
      {
        $group: {
          _id: {
            $dateToString: {
              format: '%Y-%m-%d',
              date: '$createdAt'
            }
          },
          posts: { $sum: 1 },
          completed: {
            $sum: {
              $cond: [{ $eq: ['$status', 'completed'] }, 1, 0]
            }
          }
        }
      },
      {
        $sort: { _id: 1 }
      }
    ]);

    // Get category distribution
    const categoryStats = await Post.aggregate([
      {
        $match: {
          createdAt: { $gte: startDate }
        }
      },
      {
        $group: {
          _id: '$category',
          count: { $sum: 1 }
        }
      },
      {
        $sort: { count: -1 }
      }
    ]);

    // Get user growth
    const userGrowth = await User.aggregate([
      {
        $match: {
          createdAt: { $gte: startDate }
        }
      },
      {
        $group: {
          _id: {
            $dateToString: {
              format: '%Y-%m-%d',
              date: '$createdAt'
            }
          },
          users: { $sum: 1 }
        }
      },
      {
        $sort: { _id: 1 }
      }
    ]);

    res.json({
      success: true,
      data: {
        dailyStats,
        categoryStats,
        userGrowth,
        period
      }
    });
  } catch (error) {
    console.error('Get analytics error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to fetch analytics',
      error: error.message
    });
  }
};

module.exports = {
  getDashboardStats,
  getAllUsers,
  getAllPosts,
  toggleUserStatus,
  deletePost,
  getReports,
  getAnalytics
};