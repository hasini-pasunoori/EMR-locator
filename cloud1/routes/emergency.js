const express = require('express');
const router = express.Router();
const EmergencyRequest = require('../models/EmergencyRequest');
const BloodDonor = require('../models/BloodDonor');
const MedicalFacility = require('../models/MedicalFacility');

// Create emergency request (requires authentication)
router.post('/request', async (req, res) => {
  try {
    if (!req.user) {
      return res.status(401).json({ 
        success: false, 
        message: 'Authentication required' 
      });
    }

    const requestData = {
      ...req.body,
      requester: req.user._id
    };

    const emergencyRequest = new EmergencyRequest(requestData);
    await emergencyRequest.save();

    await emergencyRequest.populate('requester', 'name email phone');

    // TODO: Send notifications to nearby donors/facilities
    // This would integrate with push notification service

    res.status(201).json({
      success: true,
      message: 'Emergency request created successfully',
      data: emergencyRequest
    });
  } catch (error) {
    console.error('Error creating emergency request:', error);
    res.status(500).json({ 
      success: false, 
      message: 'Server error while creating emergency request' 
    });
  }
});

// Get nearby emergency requests
router.get('/nearby', async (req, res) => {
  try {
    const { lat, lng, type, maxDistance = 50000, urgency } = req.query;
    
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
      status: 'active'
    };

    if (type) query.type = type;
    if (urgency) query.urgency = urgency;

    const requests = await EmergencyRequest.find(query)
      .populate('requester', 'name email')
      .populate('responses.responder', 'name email')
      .limit(50)
      .sort({ urgency: 1, createdAt: -1 }); // Critical first, then by time

    res.json({
      success: true,
      count: requests.length,
      data: requests
    });
  } catch (error) {
    console.error('Error fetching nearby requests:', error);
    res.status(500).json({ 
      success: false, 
      message: 'Server error while fetching emergency requests' 
    });
  }
});

// Get all emergency requests with filters
router.get('/', async (req, res) => {
  try {
    const { 
      type, 
      urgency, 
      status = 'active',
      bloodType,
      city,
      state,
      page = 1, 
      limit = 20 
    } = req.query;

    const query = {};

    if (type) query.type = type;
    if (urgency) query.urgency = urgency;
    if (status) query.status = status;
    if (bloodType) query.bloodType = bloodType;
    if (city) query['address.city'] = new RegExp(city, 'i');
    if (state) query['address.state'] = new RegExp(state, 'i');

    const requests = await EmergencyRequest.find(query)
      .populate('requester', 'name email')
      .populate('responses.responder', 'name email')
      .limit(limit * 1)
      .skip((page - 1) * limit)
      .sort({ urgency: 1, createdAt: -1 });

    const total = await EmergencyRequest.countDocuments(query);

    res.json({
      success: true,
      count: requests.length,
      total,
      page: parseInt(page),
      pages: Math.ceil(total / limit),
      data: requests
    });
  } catch (error) {
    console.error('Error fetching emergency requests:', error);
    res.status(500).json({ 
      success: false, 
      message: 'Server error while fetching emergency requests' 
    });
  }
});

// Get emergency request by ID
router.get('/:id', async (req, res) => {
  try {
    const request = await EmergencyRequest.findById(req.params.id)
      .populate('requester', 'name email phone')
      .populate('responses.responder', 'name email phone');

    if (!request) {
      return res.status(404).json({ 
        success: false, 
        message: 'Emergency request not found' 
      });
    }

    res.json({
      success: true,
      data: request
    });
  } catch (error) {
    console.error('Error fetching emergency request:', error);
    res.status(500).json({ 
      success: false, 
      message: 'Server error while fetching emergency request' 
    });
  }
});

// Respond to emergency request (requires authentication)
router.post('/:id/respond', async (req, res) => {
  try {
    if (!req.user) {
      return res.status(401).json({ 
        success: false, 
        message: 'Authentication required' 
      });
    }

    const request = await EmergencyRequest.findById(req.params.id);
    
    if (!request) {
      return res.status(404).json({ 
        success: false, 
        message: 'Emergency request not found' 
      });
    }

    if (request.status !== 'active') {
      return res.status(400).json({ 
        success: false, 
        message: 'This emergency request is no longer active' 
      });
    }

    // Check if user already responded
    const existingResponse = request.responses.find(
      response => response.responder.toString() === req.user._id.toString()
    );

    if (existingResponse) {
      return res.status(400).json({ 
        success: false, 
        message: 'You have already responded to this request' 
      });
    }

    const responseData = {
      responder: req.user._id,
      responderType: req.body.responderType || 'volunteer',
      message: req.body.message,
      contactInfo: req.body.contactInfo,
      availability: req.body.availability
    };

    request.responses.push(responseData);
    await request.save();

    res.json({
      success: true,
      message: 'Response submitted successfully',
      data: request
    });
  } catch (error) {
    console.error('Error responding to emergency request:', error);
    res.status(500).json({ 
      success: false, 
      message: 'Server error while responding to emergency request' 
    });
  }
});

// Update emergency request status (requires authentication and ownership)
router.patch('/:id/status', async (req, res) => {
  try {
    if (!req.user) {
      return res.status(401).json({ 
        success: false, 
        message: 'Authentication required' 
      });
    }

    const { status, notes } = req.body;
    const request = await EmergencyRequest.findById(req.params.id);
    
    if (!request) {
      return res.status(404).json({ 
        success: false, 
        message: 'Emergency request not found' 
      });
    }

    // Check if user owns the request or is admin
    if (request.requester.toString() !== req.user._id.toString() && req.user.role !== 'admin') {
      return res.status(403).json({ 
        success: false, 
        message: 'Not authorized to update this request' 
      });
    }

    request.status = status;
    if (notes) {
      if (!request.fulfillment) request.fulfillment = {};
      request.fulfillment.notes = notes;
    }
    await request.save();

    res.json({
      success: true,
      message: 'Request status updated successfully',
      data: request
    });
  } catch (error) {
    console.error('Error updating request status:', error);
    res.status(500).json({ 
      success: false, 
      message: 'Server error while updating request status' 
    });
  }
});

// Get user's emergency requests (requires authentication)
router.get('/user/requests', async (req, res) => {
  try {
    if (!req.user) {
      return res.status(401).json({ 
        success: false, 
        message: 'Authentication required' 
      });
    }

    const requests = await EmergencyRequest.find({ requester: req.user._id })
      .populate('responses.responder', 'name email phone')
      .sort({ createdAt: -1 });

    res.json({
      success: true,
      count: requests.length,
      data: requests
    });
  } catch (error) {
    console.error('Error fetching user requests:', error);
    res.status(500).json({ 
      success: false, 
      message: 'Server error while fetching user requests' 
    });
  }
});

// Update emergency request (requires authentication and ownership)
router.put('/:id', async (req, res) => {
  try {
    if (!req.user) {
      return res.status(401).json({ success: false, message: 'Authentication required' });
    }

    const request = await EmergencyRequest.findById(req.params.id);
    if (!request) {
      return res.status(404).json({ success: false, message: 'Request not found' });
    }

    if (request.requester.toString() !== req.user._id.toString()) {
      return res.status(403).json({ success: false, message: 'Not authorized' });
    }

    Object.assign(request, req.body);
    await request.save();

    res.json({ success: true, message: 'Request updated successfully', data: request });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Server error' });
  }
});

// Delete emergency request (requires authentication and ownership)
router.delete('/:id', async (req, res) => {
  try {
    if (!req.user) {
      return res.status(401).json({ success: false, message: 'Authentication required' });
    }

    const request = await EmergencyRequest.findById(req.params.id);
    if (!request) {
      return res.status(404).json({ success: false, message: 'Request not found' });
    }

    if (request.requester.toString() !== req.user._id.toString()) {
      return res.status(403).json({ success: false, message: 'Not authorized' });
    }

    request.isActive = false;
    request.status = 'deleted';
    await request.save();

    res.json({ success: true, message: 'Request deleted successfully' });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Server error' });
  }
});

// Get incoming responses for user (responses to their requests)
router.get('/user/incoming-responses', async (req, res) => {
  try {
    if (!req.user) {
      return res.status(401).json({ success: false, message: 'Authentication required' });
    }

    const requests = await EmergencyRequest.find({ 
      requester: req.user._id,
      'responses.0': { $exists: true }
    })
    .populate('responses.responder', 'name email phone')
    .sort({ createdAt: -1 });

    res.json({ success: true, data: requests });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Server error' });
  }
});

// Get outgoing responses for user (their responses to others' requests)
router.get('/user/outgoing-responses', async (req, res) => {
  try {
    if (!req.user) {
      return res.status(401).json({ success: false, message: 'Authentication required' });
    }

    const requests = await EmergencyRequest.find({ 
      'responses.responder': req.user._id
    })
    .populate('requester', 'name email phone')
    .sort({ createdAt: -1 });

    // Add user's specific response to each request
    const requestsWithMyResponse = requests.map(req => {
      const myResponse = req.responses.find(r => r.responder.toString() === req.user._id.toString());
      return {
        ...req.toObject(),
        myResponse
      };
    });

    res.json({ success: true, data: requestsWithMyResponse });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Server error' });
  }
});

// Get emergency statistics
router.get('/stats/overview', async (req, res) => {
  try {
    const stats = await Promise.all([
      EmergencyRequest.countDocuments({ status: 'active', isActive: true }),
      EmergencyRequest.countDocuments({ status: 'fulfilled' }),
      EmergencyRequest.countDocuments({ urgency: 'critical', status: 'active' }),
      BloodDonor.countDocuments({ 'availability.isAvailable': true, isActive: true }),
      MedicalFacility.countDocuments({ isActive: true })
    ]);

    res.json({
      success: true,
      data: {
        activeRequests: stats[0],
        fulfilledRequests: stats[1],
        criticalRequests: stats[2],
        availableDonors: stats[3],
        activeFacilities: stats[4]
      }
    });
  } catch (error) {
    console.error('Error fetching emergency stats:', error);
    res.status(500).json({ 
      success: false, 
      message: 'Server error while fetching emergency statistics' 
    });
  }
});

module.exports = router;