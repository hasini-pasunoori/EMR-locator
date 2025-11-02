const express = require('express');
const MedicalFacility = require('../models/MedicalFacility');

const router = express.Router();

// Middleware to check hospital role
const requireHospital = (req, res, next) => {
    if (!req.isAuthenticated() || req.user.role !== 'hospital') {
        return res.status(403).json({ success: false, message: 'Hospital access required' });
    }
    next();
};

// Hospital dashboard route
router.get('/dashboard', requireHospital, (req, res) => {
    res.render('hospital-dashboard', { user: req.user });
});

// Get hospital statistics
router.get('/stats', requireHospital, async (req, res) => {
    try {
        const hospital = await MedicalFacility.findOne({ owner: req.user._id, type: 'hospital' });
        
        if (!hospital) {
            return res.status(404).json({ success: false, message: 'Hospital profile not found' });
        }

        res.json({
            success: true,
            hospital,
            stats: {
                totalBeds: hospital.capacity?.totalBeds || 0,
                availableBeds: hospital.capacity?.availableBeds || 0,
                occupancyRate: hospital.capacity?.totalBeds ? 
                    Math.round(((hospital.capacity.totalBeds - hospital.capacity.availableBeds) / hospital.capacity.totalBeds) * 100) : 0
            }
        });
    } catch (error) {
        console.error('Error fetching hospital stats:', error);
        res.status(500).json({ success: false, message: 'Error fetching statistics' });
    }
});

module.exports = router;