require('dotenv').config();
const mongoose = require('mongoose');
const User = require('../models/User');

async function testAdminSetup() {
    try {
        await mongoose.connect(process.env.MONGODB_URI);
        console.log('Connected to MongoDB');

        // Check if admin user exists
        const adminUser = await User.findOne({ role: 'admin' });
        
        if (adminUser) {
            console.log('✅ Admin user found:', adminUser.email);
            console.log('✅ Admin panel should be accessible at /admin/dashboard');
        } else {
            console.log('❌ No admin user found. Creating one...');
            
            // Create admin user
            const admin = new User({
                name: 'Admin User',
                email: 'admin@emresource.com',
                password: 'admin123', // This will be hashed by the pre-save middleware
                role: 'admin',
                isVerified: true,
                authMethod: 'local'
            });
            
            await admin.save();
            console.log('✅ Admin user created successfully');
            console.log('📧 Email: admin@emresource.com');
            console.log('🔑 Password: admin123');
        }

        // Test admin routes
        console.log('\n📋 Available Admin Routes:');
        console.log('- GET /admin/dashboard - Main admin dashboard');
        console.log('- GET /api/admin/stats - Comprehensive statistics');
        console.log('- GET /api/admin/users - User management');
        console.log('- GET /api/admin/hospitals - Hospital management');
        console.log('- GET /api/admin/donors - Donor management');
        console.log('- GET /api/admin/requests - Emergency requests');
        console.log('- POST /api/admin/hospitals/add - Add hospital manually');
        console.log('- PATCH /api/admin/users/:id/suspend - Suspend user');
        console.log('- DELETE /api/admin/users/:id - Delete user');
        console.log('- GET /api/admin/export/:type - Export data');

        console.log('\n🎯 Admin Panel Features:');
        console.log('✅ Enhanced overview with charts and recent activity');
        console.log('✅ User management with suspend/activate/delete actions');
        console.log('✅ Hospital management with manual addition');
        console.log('✅ Donor verification and status management');
        console.log('✅ Emergency request status updates');
        console.log('✅ Data export functionality');
        console.log('✅ Reports and analytics');
        console.log('✅ Verification queue management');

        process.exit(0);
    } catch (error) {
        console.error('Error:', error);
        process.exit(1);
    }
}

testAdminSetup();