const mongoose = require('mongoose');

const forumSchema = new mongoose.Schema({
  name: {
    type: String,
    required: [true, 'Forum name is required'],
    trim: true
  },
  description: {
    type: String,
    required: [true, 'Forum description is required']
  },
  category: {
    type: String,
    enum: ['breed', 'general', 'marketplace', 'announcements', 'clubs', 'events'],
    required: true
  },
  breed: {
    type: String,
    required: function() {
      return this.category === 'breed';
    }
  },
  animalType: {
    type: String,
    enum: ['horse', 'dog', 'both'],
    default: 'both'
  },
  isLocked: {
    type: Boolean,
    default: false
  },
  moderators: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User'
  }],
  posts: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: 'ForumPost'
  }],
  lastPost: {
    user: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
    date: Date,
    title: String
  },
  postCount: {
    type: Number,
    default: 0
  },
  viewCount: {
    type: Number,
    default: 0
  }
}, {
  timestamps: true
});

// Index for efficient queries
forumSchema.index({ category: 1, breed: 1 });
forumSchema.index({ animalType: 1 });

module.exports = mongoose.model('Forum', forumSchema);
