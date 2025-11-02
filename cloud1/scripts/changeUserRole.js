require('dotenv').config();
const mongoose = require('mongoose');
const User = require('../models/User');

async function changeUserRole() {
    try {
        await mongoose.connect(process.env.MONGODB_URI);
        console.log('Connected to MongoDB');

        const email = 'manideepgonugunta1802@gmail.com';
        
        // Update the user role from admin to user
        const updatedUser = await User.findOneAndUpdate(
            { email },
            { 
                role: 'user',
                isVerified: true  // Also verify the user
            },
            { new: true }
        );

        if (updatedUser) {
            console.log('✅ Successfully updated user:');
            console.log(`   Email: ${updatedUser.email}`);
            console.log(`   Role: ${updatedUser.role} (changed from admin)`);
            console.log(`   Verified: ${updatedUser.isVerified}`);
            console.log('\n🎉 You can now register this email as any role or use it as a regular user!');
        } else {
            console.log('❌ User not found');
        }

        process.exit(0);
    } catch (error) {
        console.error('Error:', error);
        process.exit(1);
    }
}

changeUserRole();