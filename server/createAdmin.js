const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
require('dotenv').config();

const User = require('./models/User');

// Connect to MongoDB
const connectDB = async () => {
  try {
    await mongoose.connect(process.env.MONGODB_URI || 'mongodb://localhost:27017/mt-breeding-game');
    console.log('MongoDB connected successfully');
  } catch (error) {
    console.error('MongoDB connection error:', error);
    process.exit(1);
  }
};

// Create admin user
const createAdminUser = async () => {
  try {
    await connectDB();
    
    // Check if admin already exists
    const existingAdmin = await User.findOne({ role: 'admin' });
    
    if (existingAdmin) {
      console.log('Admin user already exists:');
      console.log('Email:', existingAdmin.email);
      console.log('Username:', existingAdmin.username);
      return;
    }
    
    // Create admin user
    const adminData = {
      username: 'admin',
      email: 'admin@mtgame.com',
      password: 'admin123',
      role: 'admin',
      membershipTier: 'premium',
      coins: 100000,
      gems: 10000
    };
    
    const admin = await User.create(adminData);
    
    console.log('✅ Admin user created successfully!');
    console.log('📧 Email: admin@mtgame.com');
    console.log('👤 Username: admin');
    console.log('🔑 Password: admin123');
    console.log('');
    console.log('⚠️  Please change the password after first login!');
    console.log('');
    console.log('Admin user details:');
    console.log('- ID:', admin._id);
    console.log('- Role:', admin.role);
    console.log('- Membership:', admin.membershipTier);
    console.log('- Coins:', admin.coins);
    console.log('- Gems:', admin.gems);
    
  } catch (error) {
    console.error('Error creating admin user:', error);
  } finally {
    await mongoose.connection.close();
    process.exit(0);
  }
};

// Run the script
createAdminUser();
