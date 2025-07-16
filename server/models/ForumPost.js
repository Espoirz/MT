const mongoose = require('mongoose');

const forumPostSchema = new mongoose.Schema({
  title: {
    type: String,
    required: [true, 'Post title is required'],
    trim: true,
    maxlength: [200, 'Title cannot exceed 200 characters']
  },
  content: {
    type: String,
    required: [true, 'Post content is required'],
    maxlength: [5000, 'Content cannot exceed 5000 characters']
  },
  author: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  forum: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Forum',
    required: true
  },
  type: {
    type: String,
    enum: ['discussion', 'marketplace', 'stud_service', 'show_result', 'announcement', 'registry'],
    default: 'discussion'
  },
  tags: [String],
  isSticky: {
    type: Boolean,
    default: false
  },
  isLocked: {
    type: Boolean,
    default: false
  },
  replies: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: 'ForumReply'
  }],
  replyCount: {
    type: Number,
    default: 0
  },
  viewCount: {
    type: Number,
    default: 0
  },
  lastReply: {
    user: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
    date: Date
  },
  // For marketplace posts
  marketplace: {
    animalType: {
      type: String,
      enum: ['horse', 'dog']
    },
    animal: {
      type: mongoose.Schema.Types.ObjectId,
      refPath: 'marketplace.animalType'
    },
    price: Number,
    currency: {
      type: String,
      enum: ['coins', 'gems'],
      default: 'coins'
    },
    status: {
      type: String,
      enum: ['active', 'sold', 'expired'],
      default: 'active'
    },
    expires: Date
  },
  // For stud service posts
  studService: {
    animalType: {
      type: String,
      enum: ['horse', 'dog']
    },
    animal: {
      type: mongoose.Schema.Types.ObjectId,
      refPath: 'studService.animalType'
    },
    fee: Number,
    currency: {
      type: String,
      enum: ['coins', 'gems'],
      default: 'coins'
    },
    requirements: String,
    availability: {
      type: String,
      enum: ['available', 'limited', 'unavailable'],
      default: 'available'
    }
  },
  // For show result posts
  showResult: {
    event: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Event'
    },
    placement: Number,
    animal: {
      type: mongoose.Schema.Types.ObjectId,
      refPath: 'showResult.animalType'
    },
    animalType: {
      type: String,
      enum: ['horse', 'dog']
    },
    score: Number
  },
  images: [String],
  likes: [{
    user: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
    date: { type: Date, default: Date.now }
  }],
  likeCount: {
    type: Number,
    default: 0
  }
}, {
  timestamps: true
});

// Index for efficient queries
forumPostSchema.index({ forum: 1, createdAt: -1 });
forumPostSchema.index({ author: 1 });
forumPostSchema.index({ type: 1 });
forumPostSchema.index({ 'marketplace.status': 1 });

module.exports = mongoose.model('ForumPost', forumPostSchema);
