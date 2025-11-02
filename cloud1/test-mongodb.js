require('dotenv').config();
const mongoose = require('mongoose');

async function testMongoConnection() {
  console.log('🧪 Testing MongoDB Atlas connection...');
  console.log('URI:', process.env.MONGODB_URI ? 'Set' : 'Not set');
  
  if (!process.env.MONGODB_URI) {
    console.log('❌ MONGODB_URI not found in .env file');
    return;
  }
  
  if (process.env.MONGODB_URI.includes('your-username') || process.env.MONGODB_URI.includes('your-password')) {
    console.log('❌ MongoDB URI contains placeholder values');
    console.log('Please replace with your actual MongoDB Atlas connection string');
    return;
  }
  
  try {
    await mongoose.connect(process.env.MONGODB_URI, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });
    
    console.log('✅ MongoDB Atlas connection successful!');
    
    // Test a simple operation
    const collections = await mongoose.connection.db.listCollections().toArray();
    console.log(`📊 Database has ${collections.length} collections`);
    
    await mongoose.connection.close();
    console.log('🔌 Connection closed');
    
  } catch (error) {
    console.error('❌ MongoDB connection failed:', error.message);
    
    if (error.message.includes('authentication failed')) {
      console.log('🔧 Check your username and password');
    } else if (error.message.includes('ENOTFOUND')) {
      console.log('🔧 Check your cluster URL');
    } else if (error.message.includes('IP')) {
      console.log('🔧 Check your IP whitelist in MongoDB Atlas');
    }
  }
}

testMongoConnection();