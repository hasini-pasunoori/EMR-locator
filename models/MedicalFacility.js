const mongoose = require('mongoose');

const medicalFacilitySchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
    trim: true
  },
  type: {
    type: String,
    required: true,
    enum: ['hospital', 'clinic', 'pharmacy', 'diagnostic', 'blood_bank', 'oxygen_supplier']
  },
  owner: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
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
    street: { type: String, required: true },
    city: { type: String, required: true },
    state: { type: String, required: true },
    zipCode: { type: String, required: true },
    country: { type: String, default: 'India' }
  },
  contact: {
    phone: { type: String, required: true },
    email: String,
    website: String,
    emergencyPhone: String
  },
  services: [{
    type: String,
    enum: ['emergency', 'icu', 'surgery', 'cardiology', 'neurology', 'orthopedics', 'pediatrics', 'maternity', 'pharmacy', 'lab', 'radiology', 'blood_bank', 'oxygen']
  }],
  capacity: {
    totalBeds: { type: Number, default: 0 },
    availableBeds: { type: Number, default: 0 },
    icuBeds: { type: Number, default: 0 },
    availableIcuBeds: { type: Number, default: 0 },
    ventilators: { type: Number, default: 0 },
    availableVentilators: { type: Number, default: 0 },
    lastUpdated: { type: Date, default: Date.now }
  },
  resources: {
    oxygenSupply: { type: Boolean, default: false },
    bloodBank: { type: Boolean, default: false },
    ambulanceService: { type: Boolean, default: false },
    emergencyService: { type: Boolean, default: false }
  },
  operatingHours: {
    monday: { open: String, close: String, is24Hours: Boolean },
    tuesday: { open: String, close: String, is24Hours: Boolean },
    wednesday: { open: String, close: String, is24Hours: Boolean },
    thursday: { open: String, close: String, is24Hours: Boolean },
    friday: { open: String, close: String, is24Hours: Boolean },
    saturday: { open: String, close: String, is24Hours: Boolean },
    sunday: { open: String, close: String, is24Hours: Boolean }
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
    enum: ['active', 'inactive', 'maintenance'],
    default: 'active'
  }
}, {
  timestamps: true
});

medicalFacilitySchema.index({ location: '2dsphere' });
medicalFacilitySchema.index({ type: 1, 'address.city': 1 });

module.exports = mongoose.model('MedicalFacility', medicalFacilitySchema);