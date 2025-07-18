const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');

const userSchema = new mongoose.Schema({
  username: {
    type: String,
    required: [true, 'Username is required'],
    unique: true,
    trim: true,
    minlength: [3, 'Username must be at least 3 characters'],
    maxlength: [20, 'Username cannot exceed 20 characters']
  },
  email: {
    type: String,
    required: [true, 'Email is required'],
    unique: true,
    lowercase: true,
    match: [/^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/, 'Please enter a valid email']
  },
  password: {
    type: String,
    required: [true, 'Password is required'],
    minlength: [6, 'Password must be at least 6 characters']
  },
  avatar: {
    type: String,
    default: ''
  },
  coins: {
    type: Number,
    default: 1000
  },
  gems: {
    type: Number,
    default: 50
  },
  experience: {
    type: Number,
    default: 0
  },
  level: {
    type: Number,
    default: 1
  },
  achievements: [{
    name: String,
    description: String,
    unlockedAt: Date
  }],
  stables: [{
    name: String,
    capacity: Number,
    level: Number
  }],
  kennels: [{
    name: String,
    capacity: Number,
    level: Number
  }],
  inventory: [{
    itemType: String,
    itemId: String,
    quantity: Number
  }],
  lassos: {
    rope: { type: Number, default: 1 },
    cotton: { type: Number, default: 0 },
    nylon: { type: Number, default: 0 },
    leather: { type: Number, default: 0 },
    wool: { type: Number, default: 0 },
    gold: { type: Number, default: 0 }
  },
  leashes: {
    nylon: { type: Number, default: 1 },
    leather: { type: Number, default: 0 },
    slip: { type: Number, default: 0 }
  },
  shelterReputation: {
    type: Number,
    default: 0
  },
  breederPoints: {
    type: Number,
    default: 0
  },
  membershipTier: {
    type: String,
    enum: ['basic', 'premium'],
    default: 'basic'
  },
  role: {
    type: String,
    enum: ['user', 'admin'],
    default: 'user'
  },
  sponsoredAnimals: [{
    animalId: { type: mongoose.Schema.Types.ObjectId, refPath: 'sponsoredAnimals.animalType' },
    animalType: { type: String, enum: ['Dog', 'Horse'] },
    sponsorDate: { type: Date, default: Date.now }
  }],
  settings: {
    notifications: {
      type: Boolean,
      default: true
    },
    privacy: {
      type: String,
      enum: ['public', 'friends', 'private'],
      default: 'public'
    }
  }
}, {
  timestamps: true
});

// Hash password before saving
userSchema.pre('save', async function(next) {
  if (!this.isModified('password')) return next();
  
  const salt = await bcrypt.genSalt(10);
  this.password = await bcrypt.hash(this.password, salt);
  next();
});

// Compare password method
userSchema.methods.comparePassword = async function(candidatePassword) {
  return await bcrypt.compare(candidatePassword, this.password);
};

module.exports = mongoose.model('User', userSchema);
