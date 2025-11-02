require('dotenv').config();
const mongoose = require('mongoose');
const User = require('../models/User');

async function createAdmin() {
  try {
    await mongoose.connect(process.env.MONGODB_URI);
    console.log('Connected to MongoDB');

    // Check if admin already exists
    const existingAdmin = await User.findOne({ email: 'admin@emresource.com' });
    
    if (existingAdmin) {
      // Update existing user to admin
      existingAdmin.role = 'admin';
      await existingAdmin.save();
      console.log('Updated existing user to admin role');
    } else {
      // Create new admin user
      const admin = new User({
        name: 'System Administrator',
        email: 'admin@emresource.com',
        password: 'admin123',
        role: 'admin',
        isEmailVerified: true
      });
      
      await admin.save();
      console.log('Admin user created successfully');
    }

    console.log('Admin credentials:');
    console.log('Email: admin@emresource.com');
    console.log('Password: admin123');
    
    process.exit(0);
  } catch (error) {
    console.error('Error creating admin:', error);
    process.exit(1);
  }
}

createAdmin();