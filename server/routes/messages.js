const express = require('express');
const {
  getMessages,
  getMessage,
  sendMessage,
  toggleMessageRead,
  toggleMessageArchive,
  deleteMessage,
  getUnreadCount,
} = require('../controllers/messageController');
const auth = require('../middleware/auth');

const router = express.Router();

router.use(auth); // All routes require authentication

router.route('/')
  .get(getMessages)
  .post(sendMessage);

router.get('/unread-count', getUnreadCount);

router.route('/:id')
  .get(getMessage)
  .delete(deleteMessage);

router.put('/:id/read', toggleMessageRead);
router.put('/:id/archive', toggleMessageArchive);

module.exports = router;
