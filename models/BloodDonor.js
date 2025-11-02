const mongoose = require('mongoose');

const bloodDonorSchema = new mongoose.Schema({
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true,
    unique: true
  },
  bloodType: {
    type: String,
    required: true,
    enum: ['A+', 'A-', 'B+', 'B-', 'AB+', 'AB-', 'O+', 'O-']
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
  medicalInfo: {
    age: { type: Number, required: false, min: 18, max: 65 },
    weight: { type: Number, required: false, min: 50 },
    lastDonation: Date,
    lastHealthCheckup: Date,
    medicalConditions: [String],
    medications: [String],
    allergies: [String],
    isEligible: { type: Boolean, default: true }
  },
  availability: {
    isAvailable: { type: Boolean, default: true },
    lastDonationDate: Date,
    availableDays: [{
      type: String,
      enum: ['monday', 'tuesday', 'wednesday', 'thursday', 'friday', 'saturday', 'sunday']
    }],
    preferredTime: {
      type: String,
      enum: ['morning', 'afternoon', 'evening', 'anytime']
    }
  },
  donationHistory: [{
    date: { type: Date, required: true },
    location: String,
    recipient: String,
    units: { type: Number, default: 1 },
    notes: String
  }],
  contact: {
    phone: String,
    alternatePhone: String,
    preferredContactMethod: {
      type: String,
      enum: ['phone', 'sms', 'email'],
      default: 'phone'
    }
  },
  emergencyContact: {
    name: String,
    phone: String,
    relationship: String
  },
  privacy: {
    showFullName: { type: Boolean, default: true },
    showPhone: { type: Boolean, default: false },
    showEmail: { type: Boolean, default: true },
    showLocation: { type: Boolean, default: true },
    showExactLocation: { type: Boolean, default: false },
    maxDistanceToShow: { type: Number, default: 10 }
  },
  isVerified: {
    type: Boolean,
    default: false
  },
  rating: {
    average: { type: Number, default: 0 },
    count: { type: Number, default: 0 }
  },
  status: {
    type: String,
    enum: ['active', 'inactive', 'suspended'],
    default: 'active'
  }
}, {
  timestamps: true
});

bloodDonorSchema.index({ location: '2dsphere' });
bloodDonorSchema.index({ bloodType: 1, 'availability.isAvailable': 1 });
bloodDonorSchema.index({ 'address.city': 1, bloodType: 1 });

module.exports = mongoose.model('BloodDonor', bloodDonorSchema);