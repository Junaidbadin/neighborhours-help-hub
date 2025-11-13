const mongoose = require('mongoose');

const ratingSchema = new mongoose.Schema({
  from: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: [true, 'Rating giver is required']
  },
  to: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: [true, 'Rating receiver is required']
  },
  stars: {
    type: Number,
    required: [true, 'Rating stars are required'],
    min: [1, 'Rating must be at least 1 star'],
    max: [5, 'Rating cannot exceed 5 stars']
  },
  comment: {
    type: String,
    trim: true,
    maxlength: [500, 'Comment cannot exceed 500 characters']
  },
  post: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Post',
    required: [true, 'Related post is required']
  },
  category: {
    type: String,
    enum: ['help_provider', 'help_seeker'],
    required: [true, 'Rating category is required']
  },
  isPublic: {
    type: Boolean,
    default: true
  },
  helpful: {
    type: Boolean,
    default: true
  },
  punctual: {
    type: Boolean,
    default: true
  },
  communication: {
    type: Boolean,
    default: true
  }
}, {
  timestamps: true
});

// Create indexes
ratingSchema.index({ to: 1, createdAt: -1 });
ratingSchema.index({ from: 1, to: 1 }, { unique: true }); // Prevent duplicate ratings
ratingSchema.index({ post: 1 });

// Pre-save middleware to prevent duplicate ratings
ratingSchema.pre('save', async function(next) {
  const existingRating = await this.constructor.findOne({
    from: this.from,
    to: this.to,
    post: this.post
  });
  
  if (existingRating && existingRating._id.toString() !== this._id.toString()) {
    const error = new Error('You have already rated this user for this help request');
    error.statusCode = 400;
    return next(error);
  }
  
  next();
});

// Static method to calculate average rating
ratingSchema.statics.calculateAverageRating = async function(userId) {
  const result = await this.aggregate([
    { $match: { to: new mongoose.Types.ObjectId(userId) } },
    {
      $group: {
        _id: null,
        averageRating: { $avg: '$stars' },
        totalRatings: { $sum: 1 }
      }
    }
  ]);
  
  if (result.length === 0) {
    return { averageRating: 0, totalRatings: 0 };
  }
  
  return {
    averageRating: Math.round(result[0].averageRating * 10) / 10,
    totalRatings: result[0].totalRatings
  };
};

// Static method to get user ratings
ratingSchema.statics.getUserRatings = function(userId, page = 1, limit = 10) {
  return this.find({ to: userId })
    .populate('from', 'name profilePic')
    .populate('post', 'title type')
    .sort({ createdAt: -1 })
    .limit(limit * 1)
    .skip((page - 1) * limit);
};

module.exports = mongoose.model('Rating', ratingSchema);