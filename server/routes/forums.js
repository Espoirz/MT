const express = require('express');
const {
  getForums,
  getForum,
  createForum,
  createPost,
  getPost,
  replyToPost,
  togglePostLike,
  getBreedForums,
  getMarketplacePosts,
  getStudServicePosts,
} = require('../controllers/forumController');
const auth = require('../middleware/auth');

const router = express.Router();

router.use(auth); // All routes require authentication

// Forum routes
router.route('/')
  .get(getForums)
  .post(createForum);

router.get('/breeds', getBreedForums);
router.get('/marketplace', getMarketplacePosts);
router.get('/stud-services', getStudServicePosts);

router.route('/:id')
  .get(getForum);

router.post('/:id/posts', createPost);

// Post routes
router.get('/posts/:id', getPost);
router.post('/posts/:id/reply', replyToPost);
router.post('/posts/:id/like', togglePostLike);

module.exports = router;
