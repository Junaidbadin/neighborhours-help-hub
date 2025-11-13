const Post = require('../models/Post');
const User = require('../models/User');
const Notification = require('../models/Notification');

// Create a new post
const createPost = async (req, res) => {
  try {
    const userId = req.user?.userId;
    if (!userId) {
      return res.status(401).json({ success: false, message: 'Unauthorized' });
    }

    const {
      type,
      title,
      description,
      category,
      budget,
      longitude,
      latitude,
      address,
      images = [],
      isUrgent = false,
      tags = [],
      contactMethod = 'chat',
      availableUntil,
      estimatedDuration = '1-2 hours',
      requirements = [],
    } = req.body;

    if (!title || !description || !category) {
      return res.status(400).json({
        success: false,
        message: 'Title, description and category are required',
      });
    }

    const normalizedType =
      type === 'Offering Help' || type === 'Need Help' ? type : 'Need Help';

    const postData = {
      type: normalizedType,
      title: title.trim(),
      description: description.trim(),
      category,
      budget: budget ? Number(budget) : 0,
      images: Array.isArray(images) ? images : [images],
      author: userId,
      isUrgent,
      tags: Array.isArray(tags) ? tags : (typeof tags === 'string' ? tags.split(',').map(tag => tag.trim()) : []),
      contactMethod,
      availableUntil: availableUntil ? new Date(availableUntil) : null,
      estimatedDuration,
      requirements: Array.isArray(requirements)
        ? requirements
        : (typeof requirements === 'string'
          ? requirements.split(',').map(req => req.trim())
          : []),
    };

    if (longitude && latitude) {
      postData.location = {
        type: 'Point',
        coordinates: [parseFloat(longitude), parseFloat(latitude)],
        address: address || 'Address not provided',
      };
    } else if (address) {
      postData.location = {
        type: 'Point',
        coordinates: [0, 0],
        address,
      };
    }

    const post = await Post.create(postData);
    await post.populate('author', 'name profilePic rating city');

    try {
      await Notification.createNotification({
        user: userId,
        title: 'Post Created Successfully',
        message: `Your ${normalizedType.toLowerCase()} post "${post.title}" has been created successfully.`,
        type: 'system',
        relatedPost: post._id,
      });
    } catch (notifError) {
      console.warn('Notification failed:', notifError.message);
    }

    if (req.io) req.io.emit('new-post', post);

    return res.status(201).json({
      success: true,
      message: 'Post created successfully',
      data: post,
    });
  } catch (error) {
    console.error('Create post error:', error);
    return res.status(500).json({
      success: false,
      message: 'Failed to create post',
      error: process.env.NODE_ENV === 'development' ? error.message : undefined,
    });
  }
};


// Get all posts with filtering and pagination
const getPosts = async (req, res) => {
    try {
        const {
            page = 1,
            limit = 10,
            type,
            category,
            longitude,
            latitude,
            maxDistance = 10000,
            search,
            sortBy = 'createdAt',
            sortOrder = 'desc'
        } = req.query;

        const userId = req.user?.userId; // Optional auth for public posts

        // Build query
        let query = { status: 'active', isPublic: true };

        if (type) query.type = type;
        if (category) query.category = category;

        // Add search functionality
        if (search) {
            query.$or = [
                { title: { $regex: search, $options: 'i' } },
                { description: { $regex: search, $options: 'i' } },
                { tags: { $in: [new RegExp(search, 'i')] } }
            ];
        }

        // Location-based filtering
        if (longitude && latitude) {
            query.location = {
                $near: {
                    $geometry: {
                        type: 'Point',
                        coordinates: [parseFloat(longitude), parseFloat(latitude)]
                    },
                    $maxDistance: parseInt(maxDistance)
                }
            };
        }

        // Sort options
        const sortOptions = {};
        sortOptions[sortBy] = sortOrder === 'desc' ? -1 : 1;

        // Execute query with pagination
        const posts = await Post.find(query)
            .populate('author', 'name profilePic rating city')
            .sort(sortOptions)
            .limit(limit * 1)
            .skip((page - 1) * limit)
            .lean();

        // Get total count for pagination
        const total = await Post.countDocuments(query);

        res.json({
            success: true,
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
        console.error('Get posts error:', error);
        res.status(500).json({
            success: false,
            message: 'Failed to fetch posts',
            error: error.message
        });
    }
};

// Get nearby posts
const getNearbyPosts = async (req, res) => {
    try {
        const { longitude, latitude, maxDistance = 5000 } = req.query;

        if (!longitude || !latitude) {
            return res.status(400).json({
                success: false,
                message: 'Longitude and latitude are required'
            });
        }

        const posts = await Post.findNearby(
            parseFloat(longitude),
            parseFloat(latitude),
            parseInt(maxDistance)
        );

        res.json({
            success: true,
            data: posts
        });
    } catch (error) {
        console.error('Get nearby posts error:', error);
        res.status(500).json({
            success: false,
            message: 'Failed to fetch nearby posts',
            error: error.message
        });
    }
};

// Get single post by ID
const getPostById = async (req, res) => {
    try {
        const { id } = req.params;
        const userId = req.user?.userId;

        const post = await Post.findById(id)
            .populate('author', 'name profilePic rating city helpPoints badge')
            .populate('acceptedBy', 'name profilePic rating city');

        if (!post) {
            return res.status(404).json({
                success: false,
                message: 'Post not found'
            });
        }

        // Increment view count (only for non-authors)
        if (userId && post.author._id.toString() !== userId) {
            await post.incrementViews();
        }

        res.json({
            success: true,
            data: post
        });
    } catch (error) {
        console.error('Get post by ID error:', error);
        res.status(500).json({
            success: false,
            message: 'Failed to fetch post',
            error: error.message
        });
    }
};

// Update post
const updatePost = async (req, res) => {
    try {
        const { id } = req.params;
        const userId = req.user.userId;
        const updateData = req.body;

        const post = await Post.findById(id);
        if (!post) {
            return res.status(404).json({
                success: false,
                message: 'Post not found'
            });
        }

        // Check ownership
        if (post.author.toString() !== userId) {
            return res.status(403).json({
                success: false,
                message: 'You can only update your own posts'
            });
        }

        // Prevent updating completed posts
        if (post.status === 'completed') {
            return res.status(400).json({
                success: false,
                message: 'Cannot update completed posts'
            });
        }

        // Update fields
        Object.keys(updateData).forEach(key => {
            if (updateData[key] !== undefined && key !== 'author' && key !== '_id') {
                post[key] = updateData[key];
            }
        });

        // Handle location update
        if (updateData.longitude && updateData.latitude) {
            post.location = {
                type: 'Point',
                coordinates: [updateData.longitude, updateData.latitude],
                address: updateData.address || post.location.address
            };
        }

        await post.save();
        await post.populate('author', 'name profilePic rating city');

        res.json({
            success: true,
            message: 'Post updated successfully',
            data: post
        });
    } catch (error) {
        console.error('Update post error:', error);
        res.status(500).json({
            success: false,
            message: 'Failed to update post',
            error: error.message
        });
    }
};

// Delete post
const deletePost = async (req, res) => {
    try {
        const { id } = req.params;
        const userId = req.user.userId;

        const post = await Post.findById(id);
        if (!post) {
            return res.status(404).json({
                success: false,
                message: 'Post not found'
            });
        }

        // Check ownership
        if (post.author.toString() !== userId) {
            return res.status(403).json({
                success: false,
                message: 'You can only delete your own posts'
            });
        }

        await Post.findByIdAndDelete(id);

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

// Accept help request
const acceptHelp = async (req, res) => {
    try {
        const { id } = req.params;
        const userId = req.user.userId;

        const post = await Post.findById(id);
        if (!post) {
            return res.status(404).json({
                success: false,
                message: 'Post not found'
            });
        }

        // Check if user is the author
        if (post.author.toString() === userId) {
            return res.status(400).json({
                success: false,
                message: 'You cannot accept your own help request'
            });
        }

        // Check if already accepted
        if (post.acceptedBy) {
            return res.status(400).json({
                success: false,
                message: 'This help request has already been accepted'
            });
        }

        // Accept the help request
        post.acceptedBy = userId;
        post.acceptedAt = new Date();
        await post.save();

        // Populate data
        await post.populate('author', 'name profilePic');
        await post.populate('acceptedBy', 'name profilePic');

        // Create notifications
        await Notification.createNotification({
            user: post.author._id,
            title: 'Help Request Accepted',
            message: `Your help request "${post.title}" has been accepted by ${post.acceptedBy.name}.`,
            type: 'post_accepted',
            relatedPost: post._id,
            relatedUser: userId
        });

        await Notification.createNotification({
            user: userId,
            title: 'Help Request Accepted',
            message: `You have successfully accepted the help request "${post.title}". You can now chat with the requester.`,
            type: 'post_accepted',
            relatedPost: post._id,
            relatedUser: post.author._id
        });

        res.json({
            success: true,
            message: 'Help request accepted successfully',
            data: post
        });
    } catch (error) {
        console.error('Accept help error:', error);
        res.status(500).json({
            success: false,
            message: 'Failed to accept help request',
            error: error.message
        });
    }
};

// Mark help as completed
const completeHelp = async (req, res) => {
    try {
        const { id } = req.params;
        const userId = req.user.userId;

        const post = await Post.findById(id);
        if (!post) {
            return res.status(404).json({
                success: false,
                message: 'Post not found'
            });
        }

        // Check if user is involved in this help request
        const isAuthor = post.author.toString() === userId;
        const isHelper = post.acceptedBy && post.acceptedBy.toString() === userId;

        if (!isAuthor && !isHelper) {
            return res.status(403).json({
                success: false,
                message: 'You are not involved in this help request'
            });
        }

        // Mark as completed
        await post.markCompleted(userId);

        // Award help points
        const helper = await User.findById(post.acceptedBy);
        if (helper) {
            helper.helpPoints += 10; // Award 10 points for completing help
            helper.updateBadge();
            await helper.save();
        }

        // Create notifications
        await Notification.createNotification({
            user: post.author._id,
            title: 'Help Completed',
            message: `Your help request "${post.title}" has been marked as completed. You can now rate the helper.`,
            type: 'post_completed',
            relatedPost: post._id,
            relatedUser: post.acceptedBy
        });

        if (post.acceptedBy) {
            await Notification.createNotification({
                user: post.acceptedBy,
                title: 'Help Completed',
                message: `The help request "${post.title}" has been marked as completed. You can now rate the requester.`,
                type: 'post_completed',
                relatedPost: post._id,
                relatedUser: post.author._id
            });
        }

        res.json({
            success: true,
            message: 'Help marked as completed successfully',
            data: post
        });
    } catch (error) {
        console.error('Complete help error:', error);
        res.status(500).json({
            success: false,
            message: 'Failed to complete help request',
            error: error.message
        });
    }
};

// Get user's posts
const getUserPosts = async (req, res) => {
    try {
        const { userId } = req.params;
        const { page = 1, limit = 10, status } = req.query;

        let query = { author: userId };
        if (status) query.status = status;

        const posts = await Post.find(query)
            .populate('acceptedBy', 'name profilePic')
            .sort({ createdAt: -1 })
            .limit(limit * 1)
            .skip((page - 1) * limit);

        const total = await Post.countDocuments(query);

        res.json({
            success: true,
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
        console.error('Get user posts error:', error);
        res.status(500).json({
            success: false,
            message: 'Failed to fetch user posts',
            error: error.message
        });
    }
};

const getMyPosts = async (req, res) => {
    try {
        const userId = req.user.userId;
        const posts = await Post.find({ author: userId }).sort({ createdAt: -1 });
        res.json({ success: true, data: { posts } });
    } catch (error) {
        res.status(500).json({ success: false, message: 'Failed to fetch user posts', error: error.message });
    }
};

// EXPORT ALL DEFINED FUNCTIONS
module.exports = {
    createPost,
    getPosts,
    getNearbyPosts,
    getPostById,
    updatePost,
    deletePost,
    acceptHelp,
    completeHelp,
    getUserPosts,
    getMyPosts,
};