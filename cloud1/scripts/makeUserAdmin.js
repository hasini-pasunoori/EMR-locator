require('dotenv').config();
const mongoose = require('mongoose');
const User = require('../models/User');

mongoose.connect(process.env.MONGODB_URI);

async function makeUserAdmin() {
  try {
    // Replace with your actual email
    const userEmail = 'manideepgonugunta1802@gmail.com';
    
    // Find user by email
    let user = await User.findOne({ email: userEmail });
    
    if (!user) {
      // Create new admin user if doesn't exist
      user = new User({
        name: 'Manideep Admin',
        email: userEmail,
        password: 'admin123',
        role: 'admin',
        isEmailVerified: true,
        authMethod: 'local'
      });
      await user.save();
      console.log('✅ New admin user created');
    } else {
      // Update existing user to admin
      user.role = 'admin';
      user.isEmailVerified = true;
      await user.save();
      console.log('✅ User updated to admin');
    }
    
    console.log('Admin Details:');
    console.log('Email:', user.email);
    console.log('Role:', user.role);
    console.log('Password: admin123 (if new user)');
    
  } catch (error) {
    console.error('❌ Error:', error.message);
  } finally {
    mongoose.connection.close();
  }
}

makeUserAdmin();