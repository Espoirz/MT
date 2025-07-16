const Forum = require('../models/Forum');
const ForumPost = require('../models/ForumPost');
const ForumReply = require('../models/ForumReply');
const GeneticsCalculator = require('../utils/genetics');

// @desc    Get all forums
// @route   GET /api/forums
// @access  Private
const getForums = async (req, res) => {
  try {
    const { category, animalType } = req.query;
    
    const filter = {};
    if (category) filter.category = category;
    if (animalType) filter.animalType = animalType;

    const forums = await Forum.find(filter)
      .populate('lastPost.user', 'username')
      .sort({ category: 1, name: 1 });

    // Group forums by category
    const groupedForums = forums.reduce((acc, forum) => {
      if (!acc[forum.category]) {
        acc[forum.category] = [];
      }
      acc[forum.category].push(forum);
      return acc;
    }, {});

    res.json({
      success: true,
      data: groupedForums,
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Get single forum with posts
// @route   GET /api/forums/:id
// @access  Private
const getForum = async (req, res) => {
  try {
    const forum = await Forum.findById(req.params.id)
      .populate('moderators', 'username')
      .populate('lastPost.user', 'username');

    if (!forum) {
      return res.status(404).json({ message: 'Forum not found' });
    }

    // Get posts for this forum
    const posts = await ForumPost.find({ forum: req.params.id })
      .populate('author', 'username level')
      .populate('lastReply.user', 'username')
      .populate('marketplace.animal', 'name breed')
      .populate('studService.animal', 'name breed')
      .populate('showResult.animal', 'name breed')
      .populate('showResult.event', 'name')
      .sort({ isSticky: -1, updatedAt: -1 });

    // Increment view count
    forum.viewCount += 1;
    await forum.save();

    res.json({
      success: true,
      data: {
        forum,
        posts,
      },
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Create new forum (Admin only)
// @route   POST /api/forums
// @access  Private
const createForum = async (req, res) => {
  try {
    const forum = await Forum.create(req.body);

    res.status(201).json({
      success: true,
      data: forum,
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Create new forum post
// @route   POST /api/forums/:id/posts
// @access  Private
const createPost = async (req, res) => {
  try {
    const forum = await Forum.findById(req.params.id);
    
    if (!forum) {
      return res.status(404).json({ message: 'Forum not found' });
    }

    if (forum.isLocked) {
      return res.status(403).json({ message: 'Forum is locked' });
    }

    const post = await ForumPost.create({
      ...req.body,
      author: req.user.id,
      forum: req.params.id,
    });

    // Update forum stats
    forum.postCount += 1;
    forum.lastPost = {
      user: req.user.id,
      date: new Date(),
      title: post.title
    };
    await forum.save();

    // Populate the post for response
    await post.populate('author', 'username level');

    res.status(201).json({
      success: true,
      data: post,
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Get single post with replies
// @route   GET /api/forums/posts/:id
// @access  Private
const getPost = async (req, res) => {
  try {
    const post = await ForumPost.findById(req.params.id)
      .populate('author', 'username level')
      .populate('forum', 'name')
      .populate('marketplace.animal', 'name breed stats')
      .populate('studService.animal', 'name breed stats')
      .populate('showResult.animal', 'name breed')
      .populate('showResult.event', 'name category');

    if (!post) {
      return res.status(404).json({ message: 'Post not found' });
    }

    // Get replies
    const replies = await ForumReply.find({ post: req.params.id })
      .populate('author', 'username level')
      .sort({ createdAt: 1 });

    // Increment view count
    post.viewCount += 1;
    await post.save();

    res.json({
      success: true,
      data: {
        post,
        replies,
      },
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Reply to a post
// @route   POST /api/forums/posts/:id/reply
// @access  Private
const replyToPost = async (req, res) => {
  try {
    const post = await ForumPost.findById(req.params.id);
    
    if (!post) {
      return res.status(404).json({ message: 'Post not found' });
    }

    if (post.isLocked) {
      return res.status(403).json({ message: 'Post is locked' });
    }

    const reply = await ForumReply.create({
      content: req.body.content,
      author: req.user.id,
      post: req.params.id,
      parentReply: req.body.parentReply || null,
    });

    // Update post stats
    post.replyCount += 1;
    post.lastReply = {
      user: req.user.id,
      date: new Date()
    };
    await post.save();

    // Populate the reply for response
    await reply.populate('author', 'username level');

    res.status(201).json({
      success: true,
      data: reply,
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Like/unlike a post
// @route   POST /api/forums/posts/:id/like
// @access  Private
const togglePostLike = async (req, res) => {
  try {
    const post = await ForumPost.findById(req.params.id);
    
    if (!post) {
      return res.status(404).json({ message: 'Post not found' });
    }

    const existingLike = post.likes.find(like => like.user.toString() === req.user.id);
    
    if (existingLike) {
      // Remove like
      post.likes = post.likes.filter(like => like.user.toString() !== req.user.id);
      post.likeCount -= 1;
    } else {
      // Add like
      post.likes.push({ user: req.user.id });
      post.likeCount += 1;
    }

    await post.save();

    res.json({
      success: true,
      data: {
        liked: !existingLike,
        likeCount: post.likeCount
      },
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Get breed-specific forums
// @route   GET /api/forums/breeds
// @access  Private
const getBreedForums = async (req, res) => {
  try {
    const { animalType } = req.query;
    
    // Get all breed names
    const horseBreeds = Object.keys(GeneticsCalculator.HORSE_BREED_STATS);
    const dogBreeds = Object.keys(GeneticsCalculator.DOG_BREED_STATS);
    
    let breeds = [];
    if (animalType === 'horse') {
      breeds = horseBreeds;
    } else if (animalType === 'dog') {
      breeds = dogBreeds;
    } else {
      breeds = [...horseBreeds, ...dogBreeds];
    }

    // Find or create breed forums
    const breedForums = [];
    for (const breed of breeds) {
      let forum = await Forum.findOne({ category: 'breed', breed });
      
      if (!forum) {
        // Create breed forum if it doesn't exist
        forum = await Forum.create({
          name: `${breed} Breed Forum`,
          description: `Discussion and registry for ${breed} breed`,
          category: 'breed',
          breed,
          animalType: horseBreeds.includes(breed) ? 'horse' : 'dog'
        });
      }
      
      breedForums.push(forum);
    }

    res.json({
      success: true,
      data: breedForums,
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Get marketplace posts
// @route   GET /api/forums/marketplace
// @access  Private
const getMarketplacePosts = async (req, res) => {
  try {
    const { animalType, status, breed } = req.query;
    
    const filter = { 
      type: 'marketplace',
      'marketplace.status': status || 'active'
    };
    
    if (animalType) filter['marketplace.animalType'] = animalType;

    const posts = await ForumPost.find(filter)
      .populate('author', 'username level')
      .populate('marketplace.animal', 'name breed stats rarity')
      .sort({ createdAt: -1 });

    // Filter by breed if specified
    let filteredPosts = posts;
    if (breed) {
      filteredPosts = posts.filter(post => post.marketplace.animal?.breed === breed);
    }

    res.json({
      success: true,
      data: filteredPosts,
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Get stud service posts
// @route   GET /api/forums/stud-services
// @access  Private
const getStudServicePosts = async (req, res) => {
  try {
    const { animalType, breed } = req.query;
    
    const filter = { 
      type: 'stud_service',
      'studService.availability': { $ne: 'unavailable' }
    };
    
    if (animalType) filter['studService.animalType'] = animalType;

    const posts = await ForumPost.find(filter)
      .populate('author', 'username level')
      .populate('studService.animal', 'name breed stats genetics achievements')
      .sort({ createdAt: -1 });

    // Filter by breed if specified
    let filteredPosts = posts;
    if (breed) {
      filteredPosts = posts.filter(post => post.studService.animal?.breed === breed);
    }

    res.json({
      success: true,
      data: filteredPosts,
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

module.exports = {
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
};
