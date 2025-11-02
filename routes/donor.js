const express = require('express');
const BloodDonor = require('../models/BloodDonor');

const router = express.Router();

// Middleware to check donor role
const requireDonor = (req, res, next) => {
    if (!req.isAuthenticated() || req.user.role !== 'donor') {
        return res.status(403).json({ success: false, message: 'Donor access required' });
    }
    next();
};

// Donor dashboard route
router.get('/dashboard', requireDonor, (req, res) => {
    res.render('donor-dashboard', { user: req.user });
});

// Get donor statistics
router.get('/stats', requireDonor, async (req, res) => {
    try {
        const donor = await BloodDonor.findOne({ userId: req.user._id });
        
        if (!donor) {
            return res.status(404).json({ success: false, message: 'Donor profile not found' });
        }

        res.json({
            success: true,
            donor,
            stats: {
                totalDonations: donor.donationHistory?.length || 0,
                pendingRequests: 0, // TODO: Count pending requests for this donor
                livesSaved: (donor.donationHistory?.length || 0) * 3 // Estimate 3 lives per donation
            }
        });
    } catch (error) {
        console.error('Error fetching donor stats:', error);
        res.status(500).json({ success: false, message: 'Error fetching statistics' });
    }
});

module.exports = router;