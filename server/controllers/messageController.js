const Message = require('../models/Message');
const User = require('../models/User');

// @desc    Get user's messages
// @route   GET /api/messages
// @access  Private
const getMessages = async (req, res) => {
  try {
    const { type, category, isRead, folder } = req.query;
    
    const filter = { 
      recipient: req.user.id,
      isDeleted: false 
    };
    
    if (type) filter.type = type;
    if (category) filter.category = category;
    if (isRead !== undefined) filter.isRead = isRead === 'true';
    if (folder === 'archived') filter.isArchived = true;
    else if (folder !== 'all') filter.isArchived = false;

    const messages = await Message.find(filter)
      .populate('sender', 'username level')
      .populate('relatedData.animal', 'name breed')
      .populate('relatedData.event', 'name category')
      .populate('relatedData.post', 'title')
      .sort({ createdAt: -1 });

    // Group messages by type for better organization
    const groupedMessages = messages.reduce((acc, message) => {
      const key = message.type;
      if (!acc[key]) {
        acc[key] = [];
      }
      acc[key].push(message);
      return acc;
    }, {});

    res.json({
      success: true,
      data: groupedMessages,
      count: messages.length,
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Get single message
// @route   GET /api/messages/:id
// @access  Private
const getMessage = async (req, res) => {
  try {
    const message = await Message.findById(req.params.id)
      .populate('sender', 'username level')
      .populate('relatedData.animal', 'name breed stats')
      .populate('relatedData.event', 'name category startDate')
      .populate('relatedData.post', 'title content');

    if (!message) {
      return res.status(404).json({ message: 'Message not found' });
    }

    // Check if user is the recipient
    if (message.recipient.toString() !== req.user.id) {
      return res.status(403).json({ message: 'Not authorized' });
    }

    // Mark as read if not already
    if (!message.isRead) {
      message.isRead = true;
      message.readAt = new Date();
      await message.save();
    }

    res.json({
      success: true,
      data: message,
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Send message to user
// @route   POST /api/messages
// @access  Private
const sendMessage = async (req, res) => {
  try {
    const { recipientId, subject, content, type, category } = req.body;

    // Check if recipient exists
    const recipient = await User.findById(recipientId);
    if (!recipient) {
      return res.status(404).json({ message: 'Recipient not found' });
    }

    const message = await Message.create({
      sender: req.user.id,
      recipient: recipientId,
      subject,
      content,
      type: type || 'user',
      category: category || 'general',
    });

    await message.populate('sender', 'username level');

    res.status(201).json({
      success: true,
      data: message,
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Mark message as read/unread
// @route   PUT /api/messages/:id/read
// @access  Private
const toggleMessageRead = async (req, res) => {
  try {
    const message = await Message.findById(req.params.id);

    if (!message) {
      return res.status(404).json({ message: 'Message not found' });
    }

    if (message.recipient.toString() !== req.user.id) {
      return res.status(403).json({ message: 'Not authorized' });
    }

    message.isRead = !message.isRead;
    message.readAt = message.isRead ? new Date() : null;
    await message.save();

    res.json({
      success: true,
      data: { isRead: message.isRead },
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Archive/unarchive message
// @route   PUT /api/messages/:id/archive
// @access  Private
const toggleMessageArchive = async (req, res) => {
  try {
    const message = await Message.findById(req.params.id);

    if (!message) {
      return res.status(404).json({ message: 'Message not found' });
    }

    if (message.recipient.toString() !== req.user.id) {
      return res.status(403).json({ message: 'Not authorized' });
    }

    message.isArchived = !message.isArchived;
    await message.save();

    res.json({
      success: true,
      data: { isArchived: message.isArchived },
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Delete message
// @route   DELETE /api/messages/:id
// @access  Private
const deleteMessage = async (req, res) => {
  try {
    const message = await Message.findById(req.params.id);

    if (!message) {
      return res.status(404).json({ message: 'Message not found' });
    }

    if (message.recipient.toString() !== req.user.id) {
      return res.status(403).json({ message: 'Not authorized' });
    }

    message.isDeleted = true;
    await message.save();

    res.json({
      success: true,
      message: 'Message deleted successfully',
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Get unread message count
// @route   GET /api/messages/unread-count
// @access  Private
const getUnreadCount = async (req, res) => {
  try {
    const count = await Message.countDocuments({
      recipient: req.user.id,
      isRead: false,
      isDeleted: false,
    });

    res.json({
      success: true,
      data: { unreadCount: count },
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Send system message (internal use)
const sendSystemMessage = async (recipientId, subject, content, options = {}) => {
  try {
    const message = await Message.create({
      recipient: recipientId,
      subject,
      content,
      type: options.type || 'system',
      category: options.category || 'notification',
      priority: options.priority || 'normal',
      relatedData: options.relatedData || {},
      expiresAt: options.expiresAt || null,
    });

    return message;
  } catch (error) {
    console.error('Error sending system message:', error);
    throw error;
  }
};

// @desc    Send vet result message
// @route   POST /api/messages/vet-result
// @access  Private (internal system use)
const sendVetResult = async (userId, animalId, animalType, results) => {
  try {
    const subject = 'Veterinary Examination Results';
    const content = `Your ${animalType} has completed their veterinary examination. ${results}`;
    
    const message = await sendSystemMessage(userId, subject, content, {
      type: 'vet',
      category: 'result',
      relatedData: {
        animal: animalId,
        animalType: animalType
      }
    });

    return message;
  } catch (error) {
    console.error('Error sending vet result:', error);
    throw error;
  }
};

// @desc    Send training result message
// @route   POST /api/messages/training-result
// @access  Private (internal system use)
const sendTrainingResult = async (userId, animalId, animalType, discipline, improvement) => {
  try {
    const subject = 'Training Session Complete';
    const content = `Your ${animalType} has completed training in ${discipline}. Improvement: ${improvement} points.`;
    
    const message = await sendSystemMessage(userId, subject, content, {
      type: 'trainer',
      category: 'result',
      relatedData: {
        animal: animalId,
        animalType: animalType
      }
    });

    return message;
  } catch (error) {
    console.error('Error sending training result:', error);
    throw error;
  }
};

// @desc    Send event notification
// @route   POST /api/messages/event-notification
// @access  Private (internal system use)
const sendEventNotification = async (userId, eventId, notificationType, details) => {
  try {
    const subjects = {
      'registration_open': 'Event Registration Now Open',
      'registration_closing': 'Event Registration Closing Soon',
      'event_starting': 'Event Starting Soon',
      'results_available': 'Event Results Available'
    };

    const subject = subjects[notificationType] || 'Event Notification';
    const content = details;
    
    const message = await sendSystemMessage(userId, subject, content, {
      type: 'event',
      category: 'notification',
      relatedData: {
        event: eventId
      }
    });

    return message;
  } catch (error) {
    console.error('Error sending event notification:', error);
    throw error;
  }
};

module.exports = {
  getMessages,
  getMessage,
  sendMessage,
  toggleMessageRead,
  toggleMessageArchive,
  deleteMessage,
  getUnreadCount,
  sendSystemMessage,
  sendVetResult,
  sendTrainingResult,
  sendEventNotification,
};
