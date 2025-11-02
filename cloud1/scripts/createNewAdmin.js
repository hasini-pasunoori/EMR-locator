require('dotenv').config();
const mongoose = require('mongoose');
const User = require('../models/User');

mongoose.connect(process.env.MONGODB_URI);

async function createNewAdmin() {
  try {
    const newAdmin = new User({
      name: 'System Administrator',
      email: 'admin@emresource.com',
      password: 'admin123456',
      role: 'admin',
      isEmailVerified: true,
      authMethod: 'local'
    });
    
    await newAdmin.save();
    console.log('✅ New admin created:');
    console.log('Email: admin@emresource.com');
    console.log('Password: admin123456');
    
  } catch (error) {
    console.error('❌ Error:', error.message);
  } finally {
    mongoose.connection.close();
  }
}

createNewAdmin();