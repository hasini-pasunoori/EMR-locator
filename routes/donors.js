const express = require('express');
const router = express.Router();
const BloodDonor = require('../models/BloodDonor');

// Get nearby blood donors
router.get('/nearby', async (req, res) => {
  try {
    const { lat, lng, bloodType, maxDistance = 25000 } = req.query;
    
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
      'availability.isAvailable': true,
      isActive: true
    };

    if (bloodType) {
      query.bloodType = bloodType;
    }

    const donors = await BloodDonor.find(query)
      .populate('user', 'name email picture')
      .limit(50)
      .sort({ 'rating.average': -1, 'responseStats.averageResponseTime': 1 });

    // Filter out sensitive information based on privacy settings
    const filteredDonors = donors.map(donor => {
      const donorObj = donor.toObject();
      
      if (!donor.privacy.showFullName && donorObj.user) {
        donorObj.user.name = donorObj.user.name.charAt(0) + '***';
      }
      
      if (!donor.privacy.showPhone) {
        donorObj.contact.phone = donorObj.contact.phone.slice(0, 3) + '***' + donorObj.contact.phone.slice(-2);
      }
      
      if (!donor.privacy.showExactLocation) {
        // Round coordinates to show approximate location
        donorObj.location.coordinates = [
          Math.round(donorObj.location.coordinates[0] * 100) / 100,
          Math.round(donorObj.location.coordinates[1] * 100) / 100
        ];
      }
      
      return donorObj;
    });

    res.json({
      success: true,
      count: filteredDonors.length,
      data: filteredDonors
    });
  } catch (error) {
    console.error('Error fetching nearby donors:', error);
    res.status(500).json({ 
      success: false, 
      message: 'Server error while fetching donors' 
    });
  }
});

// Get all donors with filters
router.get('/', async (req, res) => {
  try {
    const { 
      bloodType, 
      city, 
      state, 
      available, 
      verified,
      page = 1, 
      limit = 20 
    } = req.query;

    const query = { isActive: true };

    if (bloodType) query.bloodType = bloodType;
    if (city) query['address.city'] = new RegExp(city, 'i');
    if (state) query['address.state'] = new RegExp(state, 'i');
    if (available === 'true') query['availability.isAvailable'] = true;
    if (verified === 'true') query['verification.isVerified'] = true;

    const donors = await BloodDonor.find(query)
      .populate('user', 'name email picture')
      .limit(limit * 1)
      .skip((page - 1) * limit)
      .sort({ 'verification.isVerified': -1, 'rating.average': -1 });

    const total = await BloodDonor.countDocuments(query);

    res.json({
      success: true,
      count: donors.length,
      total,
      page: parseInt(page),
      pages: Math.ceil(total / limit),
      data: donors
    });
  } catch (error) {
    console.error('Error fetching donors:', error);
    res.status(500).json({ 
      success: false, 
      message: 'Server error while fetching donors' 
    });
  }
});

// Register as blood donor (requires authentication)
router.post('/register', async (req, res) => {
  try {
    if (!req.user) {
      return res.status(401).json({ 
        success: false, 
        message: 'Authentication required' 
      });
    }

    // Check if user is already registered as donor
    const existingDonor = await BloodDonor.findOne({ user: req.user._id });
    if (existingDonor) {
      return res.status(400).json({ 
        success: false, 
        message: 'User is already registered as a blood donor' 
      });
    }

    const donorData = {
      ...req.body,
      user: req.user._id
    };

    const donor = new BloodDonor(donorData);
    await donor.save();

    await donor.populate('user', 'name email picture');

    res.status(201).json({
      success: true,
      message: 'Successfully registered as blood donor',
      data: donor
    });
  } catch (error) {
    console.error('Error registering donor:', error);
    res.status(500).json({ 
      success: false, 
      message: 'Server error while registering donor' 
    });
  }
});

// Update donor profile (requires authentication)
router.put('/profile', async (req, res) => {
  try {
    if (!req.user) {
      return res.status(401).json({ 
        success: false, 
        message: 'Authentication required' 
      });
    }

    const donor = await BloodDonor.findOne({ user: req.user._id });
    
    if (!donor) {
      return res.status(404).json({ 
        success: false, 
        message: 'Donor profile not found' 
      });
    }

    const updatedDonor = await BloodDonor.findByIdAndUpdate(
      donor._id,
      req.body,
      { new: true, runValidators: true }
    ).populate('user', 'name email picture');

    res.json({
      success: true,
      message: 'Donor profile updated successfully',
      data: updatedDonor
    });
  } catch (error) {
    console.error('Error updating donor profile:', error);
    res.status(500).json({ 
      success: false, 
      message: 'Server error while updating donor profile' 
    });
  }
});

// Get donor profile (requires authentication)
router.get('/profile', async (req, res) => {
  try {
    if (!req.user) {
      return res.status(401).json({ 
        success: false, 
        message: 'Authentication required' 
      });
    }

    const donor = await BloodDonor.findOne({ user: req.user._id })
      .populate('user', 'name email picture');
    
    if (!donor) {
      return res.status(404).json({ 
        success: false, 
        message: 'Donor profile not found' 
      });
    }

    res.json({
      success: true,
      data: donor
    });
  } catch (error) {
    console.error('Error fetching donor profile:', error);
    res.status(500).json({ 
      success: false, 
      message: 'Server error while fetching donor profile' 
    });
  }
});

// Update availability status
router.patch('/availability', async (req, res) => {
  try {
    if (!req.user) {
      return res.status(401).json({ 
        success: false, 
        message: 'Authentication required' 
      });
    }

    const { isAvailable, lastDonationDate } = req.body;

    const donor = await BloodDonor.findOne({ user: req.user._id });
    
    if (!donor) {
      return res.status(404).json({ 
        success: false, 
        message: 'Donor profile not found' 
      });
    }

    donor.availability.isAvailable = isAvailable;
    if (lastDonationDate) {
      donor.availability.lastDonationDate = lastDonationDate;
      donor.availability.nextAvailableDate = donor.calculateNextAvailableDate();
    }
    donor.responseStats.lastActiveDate = new Date();

    await donor.save();

    res.json({
      success: true,
      message: 'Availability status updated successfully',
      data: {
        isAvailable: donor.availability.isAvailable,
        nextAvailableDate: donor.availability.nextAvailableDate
      }
    });
  } catch (error) {
    console.error('Error updating availability:', error);
    res.status(500).json({ 
      success: false, 
      message: 'Server error while updating availability' 
    });
  }
});

// Get blood types
router.get('/meta/blood-types', (req, res) => {
  const bloodTypes = ['A+', 'A-', 'B+', 'B-', 'AB+', 'AB-', 'O+', 'O-'];
  
  res.json({
    success: true,
    data: bloodTypes
  });
});

module.exports = router;