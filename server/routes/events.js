const express = require('express');
const {
  getEvents,
  getEvent,
  createEvent,
  registerForEvent,
  runEvent,
  getMyEvents,
} = require('../controllers/eventController');
const auth = require('../middleware/auth');

const router = express.Router();

router.use(auth); // All routes require authentication

router.route('/')
  .get(getEvents)
  .post(createEvent);

router.get('/my-events', getMyEvents);

router.route('/:id')
  .get(getEvent);

router.post('/:id/register', registerForEvent);
router.post('/:id/run', runEvent);

module.exports = router;
