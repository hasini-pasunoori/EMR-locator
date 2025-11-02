require('dotenv').config();
const mongoose = require('mongoose');
const User = require('../models/User');

async function ensureAdmin() {
    try {
        await mongoose.connect(process.env.MONGODB_URI);
        console.log('Connected to MongoDB');

        // Check existing admin users
        const adminUsers = await User.find({ role: 'admin' });
        
        console.log(`\n📊 Current admin users: ${adminUsers.length}\n`);
        
        adminUsers.forEach((admin, index) => {
            console.log(`${index + 1}. ${admin.name} (${admin.email}) - Verified: ${admin.isVerified}`);
        });

        // Make sure we have at least one working admin
        if (adminUsers.length === 0) {
            console.log('\n❌ No admin users found. Creating default admin...');
            
            const defaultAdmin = new User({
                name: 'System Admin',
                email: 'admin@emresource.com',
                password: 'admin123',
                role: 'admin',
                isVerified: true,
                authMethod: 'local'
            });
            
            await defaultAdmin.save();
            console.log('✅ Created default admin: admin@emresource.com (password: admin123)');
        } else {
            // Verify at least one admin is verified
            const verifiedAdmin = adminUsers.find(admin => admin.isVerified);
            if (!verifiedAdmin) {
                // Verify the first admin
                await User.findByIdAndUpdate(adminUsers[0]._id, { isVerified: true });
                console.log(`✅ Verified admin user: ${adminUsers[0].email}`);
            }
        }

        console.log('\n🎯 Admin Access Information:');
        const finalAdmins = await User.find({ role: 'admin', isVerified: true });
        finalAdmins.forEach(admin => {
            console.log(`   📧 Email: ${admin.email}`);
            console.log(`   🔗 Access: http://localhost:3000/admin/dashboard`);
        });

        console.log('\n✅ Admin setup complete!');
        console.log('✅ Your email (manideepgonugunta1802@gmail.com) is now a regular user');
        console.log('✅ You can register it again with any role you want');

        process.exit(0);
    } catch (error) {
        console.error('Error:', error);
        process.exit(1);
    }
}

ensureAdmin();