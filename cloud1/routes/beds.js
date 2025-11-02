const express = require('express');
const router = express.Router();
const MedicalFacility = require('../models/MedicalFacility');

// Get bed availability for all facilities
router.get('/availability', async (req, res) => {
  try {
    const { lat, lng, maxDistance = 50000 } = req.query;
    
    let query = { type: 'hospital', status: 'active' };
    
    if (lat && lng) {
      query.location = {
        $near: {
          $geometry: { type: 'Point', coordinates: [parseFloat(lng), parseFloat(lat)] },
          $maxDistance: parseInt(maxDistance)
        }
      };
    }

    const facilities = await MedicalFacility.find(query)
      .select('name address contact capacity location isVerified services')
      .limit(50);

    console.log(`Found ${facilities.length} hospitals for bed availability`);
    res.json({ success: true, data: facilities, count: facilities.length });
  } catch (error) {
    console.error('Bed availability error:', error);
    res.status(500).json({ success: false, message: 'Server error: ' + error.message });
  }
});

// Update bed availability (for hospital staff)
router.patch('/:facilityId/update', async (req, res) => {
  try {
    if (!req.user) {
      return res.status(401).json({ success: false, message: 'Authentication required' });
    }

    const { availableBeds, availableIcuBeds, availableVentilators } = req.body;
    
    const facility = await MedicalFacility.findById(req.params.facilityId);
    if (!facility) {
      return res.status(404).json({ success: false, message: 'Facility not found' });
    }

    // Check if user owns this facility or is admin
    if (facility.owner.toString() !== req.user._id.toString() && req.user.role !== 'admin') {
      return res.status(403).json({ success: false, message: 'Not authorized' });
    }

    facility.capacity.availableBeds = availableBeds;
    facility.capacity.availableIcuBeds = availableIcuBeds;
    facility.capacity.availableVentilators = availableVentilators;
    facility.capacity.lastUpdated = new Date();
    
    await facility.save();

    res.json({ success: true, message: 'Bed availability updated', data: facility });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Server error' });
  }
});

module.exports = router;