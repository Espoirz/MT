const mongoose = require('mongoose');

const messageSchema = new mongoose.Schema({
  sender: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: function() {
      return this.type === 'user';
    }
  },
  recipient: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  subject: {
    type: String,
    required: [true, 'Message subject is required'],
    trim: true,
    maxlength: [200, 'Subject cannot exceed 200 characters']
  },
  content: {
    type: String,
    required: [true, 'Message content is required'],
    maxlength: [2000, 'Content cannot exceed 2000 characters']
  },
  type: {
    type: String,
    enum: ['user', 'system', 'vet', 'trainer', 'event', 'marketplace', 'breeding'],
    default: 'user'
  },
  category: {
    type: String,
    enum: ['general', 'alert', 'notification', 'result', 'offer', 'reminder'],
    default: 'general'
  },
  priority: {
    type: String,
    enum: ['low', 'normal', 'high', 'urgent'],
    default: 'normal'
  },
  isRead: {
    type: Boolean,
    default: false
  },
  isArchived: {
    type: Boolean,
    default: false
  },
  isDeleted: {
    type: Boolean,
    default: false
  },
  readAt: Date,
  // For system messages with related data
  relatedData: {
    animal: {
      type: mongoose.Schema.Types.ObjectId,
      refPath: 'relatedData.animalType'
    },
    animalType: {
      type: String,
      enum: ['horse', 'dog']
    },
    event: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Event'
    },
    post: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'ForumPost'
    },
    offer: {
      amount: Number,
      currency: String,
      status: {
        type: String,
        enum: ['pending', 'accepted', 'declined', 'expired'],
        default: 'pending'
      }
    }
  },
  attachments: [String],
  expiresAt: Date
}, {
  timestamps: true
});

// Index for efficient queries
messageSchema.index({ recipient: 1, createdAt: -1 });
messageSchema.index({ sender: 1 });
messageSchema.index({ type: 1, category: 1 });
messageSchema.index({ isRead: 1, isDeleted: 1 });

// TTL index for messages with expiration
messageSchema.index({ expiresAt: 1 }, { expireAfterSeconds: 0 });

module.exports = mongoose.model('Message', messageSchema);
