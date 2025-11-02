require('dotenv').config();
const mongoose = require('mongoose');
const User = require('../models/User');

async function checkUsers() {
    try {
        await mongoose.connect(process.env.MONGODB_URI);
        console.log('Connected to MongoDB');

        const users = await User.find({}).select('name email role isVerified createdAt');
        
        console.log(`\n📊 Total users found: ${users.length}\n`);
        
        users.forEach((user, index) => {
            console.log(`${index + 1}. Name: ${user.name}`);
            console.log(`   Email: ${user.email}`);
            console.log(`   Role: ${user.role}`);
            console.log(`   Verified: ${user.isVerified}`);
            console.log(`   Created: ${user.createdAt}`);
            console.log('   ---');
        });

        // Check for the specific email
        const specificUser = await User.findOne({ 
            email: { $regex: /manideep/i } 
        });
        
        if (specificUser) {
            console.log('\n🎯 Found user with "manideep" in email:');
            console.log(`   Email: ${specificUser.email}`);
            console.log(`   Role: ${specificUser.role}`);
        }

        process.exit(0);
    } catch (error) {
        console.error('Error:', error);
        process.exit(1);
    }
}

checkUsers();