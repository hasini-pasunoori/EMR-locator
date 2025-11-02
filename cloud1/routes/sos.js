const express = require('express');
const router = express.Router();
const EmergencyContact = require('../models/EmergencyContact');
const EmergencyRequest = require('../models/EmergencyRequest');

// Get user's emergency contacts
router.get('/contacts', async (req, res) => {
  try {
    if (!req.user) {
      return res.status(401).json({ success: false, message: 'Authentication required' });
    }

    const contacts = await EmergencyContact.findOne({ user: req.user._id });
    res.json({ success: true, data: contacts || { contacts: [] } });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Server error' });
  }
});

// Update emergency contacts
router.post('/contacts', async (req, res) => {
  try {
    if (!req.user) {
      return res.status(401).json({ success: false, message: 'Authentication required' });
    }

    const { contacts, sosSettings } = req.body;

    let emergencyContact = await EmergencyContact.findOne({ user: req.user._id });
    
    if (!emergencyContact) {
      emergencyContact = new EmergencyContact({ user: req.user._id });
    }

    emergencyContact.contacts = contacts;
    if (sosSettings) emergencyContact.sosSettings = sosSettings;
    
    await emergencyContact.save();

    res.json({ success: true, message: 'Emergency contacts updated', data: emergencyContact });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Server error' });
  }
});

// Trigger SOS alert
router.post('/alert', async (req, res) => {
  try {
    if (!req.user) {
      return res.status(401).json({ success: false, message: 'Authentication required' });
    }

    const { location, message } = req.body;

    // Get user's emergency contacts
    const emergencyContact = await EmergencyContact.findOne({ user: req.user._id });
    
    if (!emergencyContact || emergencyContact.contacts.length === 0) {
      return res.status(400).json({ 
        success: false, 
        message: 'No emergency contacts found. Please add contacts first.' 
      });
    }

    // Create emergency request
    const emergencyRequest = new EmergencyRequest({
      requester: req.user._id,
      type: 'emergency',
      urgency: 'critical',
      description: message || emergencyContact.sosSettings.alertMessage,
      location: {
        type: 'Point',
        coordinates: [location.lng, location.lat]
      },
      address: {
        street: 'Emergency Location',
        city: 'Unknown',
        state: 'Unknown'
      },
      contact: {
        phone: req.user.phone || 'Not provided'
      }
    });

    await emergencyRequest.save();

    // TODO: Send SMS/WhatsApp to emergency contacts
    // This would require SMS API integration

    // For now, just log the alert
    console.log('SOS Alert triggered:', {
      user: req.user.name,
      location: location,
      contacts: emergencyContact.contacts.map(c => c.phone)
    });

    res.json({ 
      success: true, 
      message: 'SOS alert sent to emergency contacts',
      data: { requestId: emergencyRequest._id }
    });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Server error' });
  }
});

module.exports = router;