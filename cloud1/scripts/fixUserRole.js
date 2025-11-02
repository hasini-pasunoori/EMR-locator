require('dotenv').config();
const mongoose = require('mongoose');
const User = require('../models/User');

async function fixUserRole() {
    try {
        await mongoose.connect(process.env.MONGODB_URI);
        console.log('Connected to MongoDB');

        const email = 'manideep.gonugunta1802@gmail.com';
        
        // Find the user
        const user = await User.findOne({ email });
        
        if (!user) {
            console.log('❌ User not found');
            process.exit(1);
        }

        console.log(`📧 Found user: ${user.email}`);
        console.log(`👤 Current role: ${user.role}`);
        console.log(`✅ Verified: ${user.isVerified}`);

        console.log('\nChoose an option:');
        console.log('1. Change role from admin to user');
        console.log('2. Delete the user completely');
        console.log('3. Keep as admin and create a new user account');

        // For now, let's change to user role
        await User.findOneAndUpdate(
            { email },
            { role: 'user' },
            { new: true }
        );

        console.log('✅ User role changed from admin to user');
        console.log('🎉 You can now register as a regular user or use different roles');
        
        // Also create a new admin user with different email
        const adminExists = await User.findOne({ role: 'admin' });
        if (!adminExists) {
            const newAdmin = new User({
                name: 'Admin User',
                email: 'admin@emresource.com',
                password: 'admin123',
                role: 'admin',
                isVerified: true,
                authMethod: 'local'
            });
            
            await newAdmin.save();
            console.log('✅ Created new admin user: admin@emresource.com (password: admin123)');
        }

        process.exit(0);
    } catch (error) {
        console.error('Error:', error);
        process.exit(1);
    }
}

fixUserRole();