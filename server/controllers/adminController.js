const User = require('../models/User');
const Dog = require('../models/Dog');
const Horse = require('../models/Horse');

// @desc    Get admin dashboard stats
// @route   GET /api/admin/dashboard
// @access  Private (Admin)
const getDashboardStats = async (req, res) => {
  try {
    const stats = {
      users: {
        total: await User.countDocuments(),
        basic: await User.countDocuments({ membershipTier: 'basic' }),
        premium: await User.countDocuments({ membershipTier: 'premium' }),
        admins: await User.countDocuments({ role: 'admin' })
      },
      dogs: {
        total: await Dog.countDocuments(),
        wild: await Dog.countDocuments({ isWild: true }),
        inShelter: await Dog.countDocuments({ shelterEntry: { $exists: true }, owner: null }),
        adopted: await Dog.countDocuments({ owner: { $exists: true } })
      },
      horses: {
        total: await Horse.countDocuments(),
        wild: await Horse.countDocuments({ isWild: true }),
        owned: await Horse.countDocuments({ owner: { $exists: true } })
      }
    };

    res.json({
      success: true,
      data: stats
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Get all users
// @route   GET /api/admin/users
// @access  Private (Admin)
const getUsers = async (req, res) => {
  try {
    const { page = 1, limit = 20, search = '', role = '' } = req.query;
    
    const query = {};
    
    if (search) {
      query.$or = [
        { username: { $regex: search, $options: 'i' } },
        { email: { $regex: search, $options: 'i' } }
      ];
    }
    
    if (role) {
      query.role = role;
    }
    
    const users = await User.find(query)
      .select('-password')
      .sort({ createdAt: -1 })
      .limit(limit * 1)
      .skip((page - 1) * limit);
    
    const totalUsers = await User.countDocuments(query);
    
    res.json({
      success: true,
      data: users,
      pagination: {
        current: page,
        total: Math.ceil(totalUsers / limit),
        totalUsers: totalUsers
      }
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Update user role or membership
// @route   PUT /api/admin/users/:id
// @access  Private (Admin)
const updateUser = async (req, res) => {
  try {
    const { role, membershipTier, coins, gems } = req.body;
    
    const user = await User.findById(req.params.id);
    
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }
    
    // Update fields if provided
    if (role !== undefined) user.role = role;
    if (membershipTier !== undefined) user.membershipTier = membershipTier;
    if (coins !== undefined) user.coins = coins;
    if (gems !== undefined) user.gems = gems;
    
    await user.save();
    
    res.json({
      success: true,
      message: 'User updated successfully',
      data: user
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Delete user
// @route   DELETE /api/admin/users/:id
// @access  Private (Admin)
const deleteUser = async (req, res) => {
  try {
    const user = await User.findById(req.params.id);
    
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }
    
    // Don't allow deleting other admins
    if (user.role === 'admin' && user._id.toString() !== req.user.id) {
      return res.status(403).json({ message: 'Cannot delete other admin users' });
    }
    
    await User.findByIdAndDelete(req.params.id);
    
    res.json({
      success: true,
      message: 'User deleted successfully'
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Get all animals (dogs and horses)
// @route   GET /api/admin/animals
// @access  Private (Admin)
const getAnimals = async (req, res) => {
  try {
    const { page = 1, limit = 20, type = '', search = '' } = req.query;
    
    let animals = [];
    let totalAnimals = 0;
    
    if (type === 'dogs' || type === '') {
      const dogQuery = search ? { 
        $or: [
          { name: { $regex: search, $options: 'i' } },
          { breed: { $regex: search, $options: 'i' } }
        ]
      } : {};
      
      const dogs = await Dog.find(dogQuery)
        .populate('owner', 'username email')
        .sort({ createdAt: -1 })
        .limit(type === 'dogs' ? limit * 1 : limit / 2)
        .skip(type === 'dogs' ? (page - 1) * limit : 0);
      
      animals = animals.concat(dogs.map(dog => ({ ...dog.toObject(), animalType: 'dog' })));
      totalAnimals += await Dog.countDocuments(dogQuery);
    }
    
    if (type === 'horses' || type === '') {
      const horseQuery = search ? { 
        $or: [
          { name: { $regex: search, $options: 'i' } },
          { breed: { $regex: search, $options: 'i' } }
        ]
      } : {};
      
      const horses = await Horse.find(horseQuery)
        .populate('owner', 'username email')
        .sort({ createdAt: -1 })
        .limit(type === 'horses' ? limit * 1 : limit / 2)
        .skip(type === 'horses' ? (page - 1) * limit : 0);
      
      animals = animals.concat(horses.map(horse => ({ ...horse.toObject(), animalType: 'horse' })));
      totalAnimals += await Horse.countDocuments(horseQuery);
    }
    
    res.json({
      success: true,
      data: animals,
      pagination: {
        current: page,
        total: Math.ceil(totalAnimals / limit),
        totalAnimals: totalAnimals
      }
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Move dog to shelter
// @route   POST /api/admin/dogs/:id/shelter
// @access  Private (Admin)
const moveDogToShelter = async (req, res) => {
  try {
    const dog = await Dog.findById(req.params.id);
    
    if (!dog) {
      return res.status(404).json({ message: 'Dog not found' });
    }
    
    // Set dog as shelter animal
    dog.owner = null;
    dog.shelterEntry = new Date();
    dog.quarantineUntil = new Date(Date.now() + 7 * 24 * 60 * 60 * 1000); // 7 days quarantine
    
    await dog.save();
    
    res.json({
      success: true,
      message: 'Dog moved to shelter successfully',
      data: dog
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Create admin user
// @route   POST /api/admin/create-admin
// @access  Private (Admin)
const createAdmin = async (req, res) => {
  try {
    const { username, email, password } = req.body;
    
    // Check if user exists
    const existingUser = await User.findOne({ 
      $or: [{ email }, { username }] 
    });

    if (existingUser) {
      return res.status(400).json({ 
        message: 'User already exists with this email or username' 
      });
    }

    // Create admin user
    const admin = await User.create({
      username,
      email,
      password,
      role: 'admin',
      membershipTier: 'premium',
      coins: 100000,
      gems: 10000
    });

    res.status(201).json({
      success: true,
      message: 'Admin user created successfully',
      data: {
        id: admin._id,
        username: admin.username,
        email: admin.email,
        role: admin.role
      }
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

module.exports = {
  getDashboardStats,
  getUsers,
  updateUser,
  deleteUser,
  getAnimals,
  moveDogToShelter,
  createAdmin
};
