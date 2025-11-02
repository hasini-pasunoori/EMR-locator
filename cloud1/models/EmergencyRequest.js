const mongoose = require('mongoose');

const emergencyRequestSchema = new mongoose.Schema({
  requester: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  type: {
    type: String,
    required: true,
    enum: ['blood', 'oxygen', 'ambulance', 'bed', 'medicine', 'plasma', 'platelets']
  },
  urgency: {
    type: String,
    required: true,
    enum: ['critical', 'high', 'medium', 'low'],
    default: 'medium'
  },
  bloodType: {
    type: String,
    enum: ['A+', 'A-', 'B+', 'B-', 'AB+', 'AB-', 'O+', 'O-'],
    required: false
  },
  patient: {
    name: { type: String, required: false },
    age: { type: Number, required: false },
    gender: { type: String, enum: ['male', 'female', 'other'] },
    condition: String,
    hospital: String
  },
  location: {
    type: {
      type: String,
      enum: ['Point'],
      required: true
    },
    coordinates: {
      type: [Number],
      required: true
    }
  },
  address: {
    street: String,
    city: { type: String, required: true },
    state: { type: String, required: true },
    zipCode: String,
    country: { type: String, default: 'India' }
  },
  contact: {
    phone: { type: String, required: false },
    alternatePhone: String,
    email: String
  },
  description: {
    type: String,
    required: true,
    maxlength: 500
  },
  quantity: {
    units: Number,
    description: String
  },
  deadline: {
    type: Date,
    required: false
  },
  responses: [{
    responder: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true
    },
    message: String,
    contactInfo: {
      phone: String,
      email: String
    },
    availability: {
      date: Date,
      time: String
    },
    status: {
      type: String,
      enum: ['pending', 'accepted', 'declined'],
      default: 'pending'
    },
    respondedAt: {
      type: Date,
      default: Date.now
    }
  }],
  status: {
    type: String,
    enum: ['active', 'fulfilled', 'cancelled', 'expired'],
    default: 'active'
  },
  fulfillment: {
    fulfilledBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User'
    },
    fulfilledAt: Date,
    notes: String
  },
  visibility: {
    type: String,
    enum: ['public', 'donors_only', 'facilities_only'],
    default: 'public'
  }
}, {
  timestamps: true
});

emergencyRequestSchema.index({ location: '2dsphere' });
emergencyRequestSchema.index({ type: 1, status: 1, urgency: 1 });
emergencyRequestSchema.index({ bloodType: 1, status: 1 });
emergencyRequestSchema.index({ deadline: 1, status: 1 });

module.exports = mongoose.model('EmergencyRequest', emergencyRequestSchema);