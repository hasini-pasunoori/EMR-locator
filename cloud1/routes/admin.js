const express = require('express');
const User = require('../models/User');
const MedicalFacility = require('../models/MedicalFacility');
const BloodDonor = require('../models/BloodDonor');
const EmergencyRequest = require('../models/EmergencyRequest');
const fs = require('fs');
const path = require('path');

const router = express.Router();

// Middleware to check admin role
const requireAdmin = (req, res, next) => {
    if (!req.isAuthenticated() || req.user.role !== 'admin') {
        return res.status(403).json({ success: false, message: 'Admin access required' });
    }
    next();
};

// Admin dashboard route
router.get('/dashboard', requireAdmin, (req, res) => {
    res.render('admin-dashboard', { user: req.user });
});

// Get comprehensive admin statistics
router.get('/stats', requireAdmin, async (req, res) => {
    try {
        const [totalUsers, totalHospitals, totalDonors, activeRequests, totalFacilities, verifiedDonors, pendingVerifications] = await Promise.all([
            User.countDocuments(),
            MedicalFacility.countDocuments({ type: 'hospital' }),
            BloodDonor.countDocuments(),
            EmergencyRequest.countDocuments({ status: 'active' }),
            MedicalFacility.countDocuments(),
            BloodDonor.countDocuments({ 'verification.isVerified': true }),
            MedicalFacility.countDocuments({ isVerified: false })
        ]);

        // Get recent activity
        const recentUsers = await User.find().sort({ createdAt: -1 }).limit(5).select('name email createdAt');
        const recentRequests = await EmergencyRequest.find().sort({ createdAt: -1 }).limit(5).populate('requester', 'name');
        
        // Get blood type distribution
        const bloodTypeStats = await BloodDonor.aggregate([
            { $group: { _id: '$bloodType', count: { $sum: 1 } } },
            { $sort: { count: -1 } }
        ]);

        res.json({
            success: true,
            stats: {
                totalUsers,
                totalHospitals,
                totalDonors,
                activeRequests,
                totalFacilities,
                verifiedDonors,
                pendingVerifications,
                recentUsers,
                recentRequests,
                bloodTypeStats
            }
        });
    } catch (error) {
        console.error('Error fetching admin stats:', error);
        res.status(500).json({ success: false, message: 'Error fetching statistics' });
    }
});

// Dashboard data for admin.ejs
router.get('/dashboard-data', requireAdmin, async (req, res) => {
    try {
        const [activeRequests, totalDonors, totalFacilities, totalUsers] = await Promise.all([
            EmergencyRequest.countDocuments({ status: 'active' }),
            BloodDonor.countDocuments(),
            MedicalFacility.countDocuments(),
            User.countDocuments()
        ]);

        res.json({
            success: true,
            data: { activeRequests, totalDonors, totalFacilities, totalUsers }
        });
    } catch (error) {
        res.status(500).json({ success: false, message: 'Error fetching dashboard data' });
    }
});

// Get all users
router.get('/users', requireAdmin, async (req, res) => {
    try {
        const users = await User.find({}, '-password').sort({ createdAt: -1 });
        res.json({ success: true, users });
    } catch (error) {
        console.error('Error fetching users:', error);
        res.status(500).json({ success: false, message: 'Error fetching users' });
    }
});

// Get all hospitals
router.get('/hospitals', requireAdmin, async (req, res) => {
    try {
        const hospitals = await MedicalFacility.find({ type: 'hospital' })
            .populate('owner', 'name email')
            .sort({ createdAt: -1 });
        res.json({ success: true, hospitals });
    } catch (error) {
        console.error('Error fetching hospitals:', error);
        res.status(500).json({ success: false, message: 'Error fetching hospitals' });
    }
});

// Verify hospital
router.post('/hospitals/:id/verify', requireAdmin, async (req, res) => {
    try {
        const hospital = await MedicalFacility.findByIdAndUpdate(
            req.params.id,
            { isVerified: true },
            { new: true }
        );

        if (!hospital) {
            return res.status(404).json({ success: false, message: 'Hospital not found' });
        }

        res.json({ success: true, message: 'Hospital verified successfully', hospital });
    } catch (error) {
        console.error('Error verifying hospital:', error);
        res.status(500).json({ success: false, message: 'Error verifying hospital' });
    }
});

// Get all emergency requests with filters
router.get('/requests', requireAdmin, async (req, res) => {
    try {
        const { status } = req.query;
        const filter = status ? { status } : {};
        
        const requests = await EmergencyRequest.find(filter)
            .populate('requester', 'name email')
            .sort({ createdAt: -1 });
        
        res.json({ success: true, data: requests });
    } catch (error) {
        res.status(500).json({ success: false, message: 'Error fetching requests' });
    }
});

// Update request status
router.patch('/requests/:id/status', requireAdmin, async (req, res) => {
    try {
        const { status } = req.body;
        const request = await EmergencyRequest.findByIdAndUpdate(
            req.params.id,
            { status },
            { new: true }
        );
        
        res.json({ success: true, data: request });
    } catch (error) {
        res.status(500).json({ success: false, message: 'Error updating request' });
    }
});

// Get all donors with filters
router.get('/donors', requireAdmin, async (req, res) => {
    try {
        const { verified, active } = req.query;
        const filter = {};
        if (verified !== undefined) filter['verification.isVerified'] = verified === 'true';
        if (active !== undefined) filter.isActive = active === 'true';
        
        const donors = await BloodDonor.find(filter)
            .populate('user', 'name email')
            .sort({ createdAt: -1 });
        
        res.json({ success: true, data: donors });
    } catch (error) {
        res.status(500).json({ success: false, message: 'Error fetching donors' });
    }
});

// Update donor verification
router.patch('/donors/:id/verify', requireAdmin, async (req, res) => {
    try {
        const { isVerified } = req.body;
        const donor = await BloodDonor.findByIdAndUpdate(
            req.params.id,
            { 'verification.isVerified': isVerified },
            { new: true }
        );
        
        res.json({ success: true, data: donor });
    } catch (error) {
        res.status(500).json({ success: false, message: 'Error updating donor verification' });
    }
});

// Update donor status
router.patch('/donors/:id/status', requireAdmin, async (req, res) => {
    try {
        const { isActive } = req.body;
        const donor = await BloodDonor.findByIdAndUpdate(
            req.params.id,
            { isActive },
            { new: true }
        );
        
        res.json({ success: true, data: donor });
    } catch (error) {
        res.status(500).json({ success: false, message: 'Error updating donor status' });
    }
});

// Get all facilities with filters
router.get('/facilities', requireAdmin, async (req, res) => {
    try {
        const { type } = req.query;
        const filter = type ? { type } : {};
        
        const facilities = await MedicalFacility.find(filter)
            .populate('owner', 'name email')
            .sort({ createdAt: -1 });
        
        res.json({ success: true, data: facilities });
    } catch (error) {
        res.status(500).json({ success: false, message: 'Error fetching facilities' });
    }
});

// Add new hospital manually
router.post('/hospitals/add', requireAdmin, async (req, res) => {
    try {
        const hospitalData = {
            ...req.body,
            type: 'hospital',
            isVerified: true,
            owner: req.user._id
        };
        
        const hospital = new MedicalFacility(hospitalData);
        await hospital.save();
        
        res.json({ success: true, message: 'Hospital added successfully', data: hospital });
    } catch (error) {
        res.status(500).json({ success: false, message: 'Error adding hospital' });
    }
});

// Delete facility
router.delete('/facilities/:id', requireAdmin, async (req, res) => {
    try {
        await MedicalFacility.findByIdAndDelete(req.params.id);
        res.json({ success: true, message: 'Facility deleted successfully' });
    } catch (error) {
        res.status(500).json({ success: false, message: 'Error deleting facility' });
    }
});

// User management actions
router.patch('/users/:id/suspend', requireAdmin, async (req, res) => {
    try {
        const user = await User.findByIdAndUpdate(
            req.params.id,
            { status: 'suspended' },
            { new: true }
        );
        
        res.json({ success: true, message: 'User suspended successfully', user });
    } catch (error) {
        res.status(500).json({ success: false, message: 'Error suspending user' });
    }
});

router.patch('/users/:id/activate', requireAdmin, async (req, res) => {
    try {
        const user = await User.findByIdAndUpdate(
            req.params.id,
            { status: 'active' },
            { new: true }
        );
        
        res.json({ success: true, message: 'User activated successfully', user });
    } catch (error) {
        res.status(500).json({ success: false, message: 'Error activating user' });
    }
});

router.delete('/users/:id', requireAdmin, async (req, res) => {
    try {
        await User.findByIdAndDelete(req.params.id);
        res.json({ success: true, message: 'User deleted successfully' });
    } catch (error) {
        res.status(500).json({ success: false, message: 'Error deleting user' });
    }
});

// Export data
router.get('/export/:type', requireAdmin, async (req, res) => {
    try {
        const { type } = req.params;
        const { format = 'json' } = req.query;
        
        let data;
        let filename;
        
        switch (type) {
            case 'users':
                data = await User.find({}, '-password').lean();
                filename = `users-${Date.now()}`;
                break;
            case 'donors':
                data = await BloodDonor.find().populate('user', 'name email').lean();
                filename = `donors-${Date.now()}`;
                break;
            case 'facilities':
                data = await MedicalFacility.find().populate('owner', 'name email').lean();
                filename = `facilities-${Date.now()}`;
                break;
            case 'requests':
                data = await EmergencyRequest.find().populate('requester', 'name email').lean();
                filename = `requests-${Date.now()}`;
                break;
            default:
                return res.status(400).json({ success: false, message: 'Invalid export type' });
        }
        
        if (format === 'json') {
            res.setHeader('Content-Type', 'application/json');
            res.setHeader('Content-Disposition', `attachment; filename=${filename}.json`);
            res.json(data);
        } else {
            res.status(400).json({ success: false, message: 'Unsupported format' });
        }
    } catch (error) {
        res.status(500).json({ success: false, message: 'Error exporting data' });
    }
});

module.exports = router;