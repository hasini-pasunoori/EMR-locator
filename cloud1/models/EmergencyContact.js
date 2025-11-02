const mongoose = require('mongoose');

const emergencyContactSchema = new mongoose.Schema({
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  contacts: [{
    name: {
      type: String,
      required: true
    },
    phone: {
      type: String,
      required: true
    },
    relationship: {
      type: String,
      enum: ['family', 'friend', 'doctor', 'other'],
      default: 'family'
    },
    isPrimary: {
      type: Boolean,
      default: false
    }
  }],
  sosSettings: {
    autoAlert: { type: Boolean, default: true },
    alertRadius: { type: Number, default: 5000 }, // 5km
    includeLocation: { type: Boolean, default: true },
    alertMessage: { 
      type: String, 
      default: 'Emergency! I need immediate help. Please contact me or call emergency services.' 
    }
  }
}, {
  timestamps: true
});

emergencyContactSchema.index({ user: 1 });

module.exports = mongoose.model('EmergencyContact', emergencyContactSchema);