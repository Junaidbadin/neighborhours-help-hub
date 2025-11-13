const mongoose = require('mongoose');

const postSchema = new mongoose.Schema({
  type: {
    type: String,
    enum: ['Need Help', 'Offering Help'],
    required: [true, 'Post type is required']
  },
  title: {
    type: String,
    required: [true, 'Title is required'],
    trim: true,
    minlength: [5, 'Title must be at least 5 characters'],
    maxlength: [100, 'Title cannot exceed 100 characters']
  },
  description: {
    type: String,
    required: [true, 'Description is required'],
    trim: true,
    minlength: [20, 'Description must be at least 20 characters'],
    maxlength: [1000, 'Description cannot exceed 1000 characters']
  },
  category: {
    type: String,
    required: [true, 'Category is required'],
    enum: [
      'Tools & Equipment',
      'Tutoring & Education',
      'Household Chores',
      'Errands & Shopping',
      'Pet Care',
      'Garden & Landscaping',
      'Technology Help',
      'Transportation',
      'Home Repairs',
      'Childcare',
      'Elderly Care',
      'Other'
    ]
  },
  budget: {
    type: Number,
    min: [0, 'Budget cannot be negative'],
    max: [10000, 'Budget cannot exceed $10,000']
  },
  location: {
    type: {
      type: String,
      enum: ['Point'],
      default: 'Point'
    },
    coordinates: {
      type: [Number],
      default: [0, 0]
    },
    address: {
      type: String,
      default: 'Address not provided'
    }
  },
  images: [{
    type: String, // Cloudinary URLs
    validate: {
      validator: function(v) {
        return /^https:\/\/res\.cloudinary\.com\//.test(v);
      },
      message: 'Invalid image URL'
    }
  }],
  author: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: [true, 'Author is required']
  },
  status: {
    type: String,
    enum: ['active', 'completed', 'cancelled'],
    default: 'active'
  },
  acceptedBy: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User'
  },
  acceptedAt: Date,
  completedAt: Date,
  views: {
    type: Number,
    default: 0
  },
  isUrgent: {
    type: Boolean,
    default: false
  },
  tags: [{
    type: String,
    trim: true,
    lowercase: true
  }],
  contactMethod: {
    type: String,
    enum: ['chat', 'phone', 'email', 'any'],
    default: 'chat'
  },
  availableUntil: Date,
  estimatedDuration: {
    type: String,
    enum: ['< 1 hour', '1-2 hours', '2-4 hours', '4-8 hours', '1+ days'],
    default: '1-2 hours'
  },
  requirements: [{
    type: String,
    trim: true
  }],
  isPublic: {
    type: Boolean,
    default: true
  }
}, {
  timestamps: true
});

// Create geospatial index for location-based queries
postSchema.index({ location: '2dsphere' });
postSchema.index({ author: 1 });
postSchema.index({ status: 1 });
postSchema.index({ category: 1 });
postSchema.index({ createdAt: -1 });

// Virtual for time since creation
postSchema.virtual('timeSinceCreated').get(function() {
  const now = new Date();
  const diffInHours = Math.floor((now - this.createdAt) / (1000 * 60 * 60));
  
  if (diffInHours < 1) return 'Just now';
  if (diffInHours < 24) return `${diffInHours} hours ago`;
  
  const diffInDays = Math.floor(diffInHours / 24);
  if (diffInDays < 7) return `${diffInDays} days ago`;
  
  const diffInWeeks = Math.floor(diffInDays / 7);
  return `${diffInWeeks} weeks ago`;
});

// Method to increment views
postSchema.methods.incrementViews = function() {
  this.views += 1;
  return this.save();
};

// Method to mark as completed
postSchema.methods.markCompleted = function(completedBy) {
  this.status = 'completed';
  this.completedAt = new Date();
  this.acceptedBy = completedBy;
  return this.save();
};

// Static method to find nearby posts
postSchema.statics.findNearby = function(longitude, latitude, maxDistance = 10000) {
  return this.find({
    location: {
      $near: {
        $geometry: {
          type: 'Point',
          coordinates: [longitude, latitude]
        },
        $maxDistance: maxDistance // in meters
      }
    },
    status: 'active'
  }).populate('author', 'name profilePic rating city');
};

module.exports = mongoose.model('Post', postSchema);