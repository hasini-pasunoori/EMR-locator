const express = require('express');
const router = express.Router();
const MedicalFacility = require('../models/MedicalFacility');

// Get nearby medical facilities
router.get('/nearby', async (req, res) => {
  try {
    const { lat, lng, type, maxDistance = 10000, services } = req.query;
    
    if (!lat || !lng) {
      return res.status(400).json({ 
        success: false, 
        message: 'Latitude and longitude are required' 
      });
    }

    const query = {
      location: {
        $near: {
          $geometry: {
            type: 'Point',
            coordinates: [parseFloat(lng), parseFloat(lat)]
          },
          $maxDistance: parseInt(maxDistance)
        }
      },
      isActive: true
    };

    if (type) {
      query.type = type;
    }

    if (services) {
      const serviceArray = services.split(',');
      query.services = { $in: serviceArray };
    }

    const facilities = await MedicalFacility.find(query)
      .populate('addedBy', 'name email')
      .limit(50)
      .sort({ 'verification.isVerified': -1, 'rating.average': -1 });

    res.json({
      success: true,
      count: facilities.length,
      data: facilities
    });
  } catch (error) {
    console.error('Error fetching nearby facilities:', error);
    res.status(500).json({ 
      success: false, 
      message: 'Server error while fetching facilities' 
    });
  }
});

// Get all facilities with filters
router.get('/', async (req, res) => {
  try {
    const { 
      type, 
      city, 
      state, 
      services, 
      verified, 
      page = 1, 
      limit = 20,
      search 
    } = req.query;

    const query = { isActive: true };

    if (type) query.type = type;
    if (city) query['address.city'] = new RegExp(city, 'i');
    if (state) query['address.state'] = new RegExp(state, 'i');
    if (services) {
      const serviceArray = services.split(',');
      query.services = { $in: serviceArray };
    }
    if (verified === 'true') query['verification.isVerified'] = true;
    if (search) {
      query.$or = [
        { name: new RegExp(search, 'i') },
        { 'address.city': new RegExp(search, 'i') },
        { 'address.state': new RegExp(search, 'i') }
      ];
    }

    const facilities = await MedicalFacility.find(query)
      .populate('addedBy', 'name email')
      .limit(limit * 1)
      .skip((page - 1) * limit)
      .sort({ 'verification.isVerified': -1, 'rating.average': -1 });

    const total = await MedicalFacility.countDocuments(query);

    res.json({
      success: true,
      count: facilities.length,
      total,
      page: parseInt(page),
      pages: Math.ceil(total / limit),
      data: facilities
    });
  } catch (error) {
    console.error('Error fetching facilities:', error);
    res.status(500).json({ 
      success: false, 
      message: 'Server error while fetching facilities' 
    });
  }
});

// Get facility by ID
router.get('/:id', async (req, res) => {
  try {
    const facility = await MedicalFacility.findById(req.params.id)
      .populate('addedBy', 'name email');

    if (!facility) {
      return res.status(404).json({ 
        success: false, 
        message: 'Facility not found' 
      });
    }

    res.json({
      success: true,
      data: facility
    });
  } catch (error) {
    console.error('Error fetching facility:', error);
    res.status(500).json({ 
      success: false, 
      message: 'Server error while fetching facility' 
    });
  }
});

// Add new medical facility (requires authentication)
router.post('/', async (req, res) => {
  try {
    if (!req.user) {
      return res.status(401).json({ 
        success: false, 
        message: 'Authentication required' 
      });
    }

    const facilityData = {
      ...req.body,
      addedBy: req.user._id
    };

    const facility = new MedicalFacility(facilityData);
    await facility.save();

    res.status(201).json({
      success: true,
      message: 'Medical facility added successfully',
      data: facility
    });
  } catch (error) {
    console.error('Error adding facility:', error);
    res.status(500).json({ 
      success: false, 
      message: 'Server error while adding facility' 
    });
  }
});

// Update facility (requires authentication and ownership)
router.put('/:id', async (req, res) => {
  try {
    if (!req.user) {
      return res.status(401).json({ 
        success: false, 
        message: 'Authentication required' 
      });
    }

    const facility = await MedicalFacility.findById(req.params.id);
    
    if (!facility) {
      return res.status(404).json({ 
        success: false, 
        message: 'Facility not found' 
      });
    }

    // Check if user owns the facility or is admin
    if (facility.addedBy.toString() !== req.user._id.toString() && req.user.role !== 'admin') {
      return res.status(403).json({ 
        success: false, 
        message: 'Not authorized to update this facility' 
      });
    }

    const updatedFacility = await MedicalFacility.findByIdAndUpdate(
      req.params.id,
      { ...req.body, lastUpdated: Date.now() },
      { new: true, runValidators: true }
    );

    res.json({
      success: true,
      message: 'Facility updated successfully',
      data: updatedFacility
    });
  } catch (error) {
    console.error('Error updating facility:', error);
    res.status(500).json({ 
      success: false, 
      message: 'Server error while updating facility' 
    });
  }
});

// Get facility types and services
router.get('/meta/types-services', (req, res) => {
  const facilityTypes = [
    'hospital',
    'clinic', 
    'pharmacy',
    'blood_bank',
    'ambulance_service',
    'oxygen_supplier'
  ];

  const services = [
    'emergency',
    'icu',
    'surgery',
    'blood_bank',
    'pharmacy',
    'ambulance',
    'oxygen',
    'dialysis',
    'cardiology',
    'neurology'
  ];

  res.json({
    success: true,
    data: {
      facilityTypes,
      services
    }
  });
});

module.exports = router;