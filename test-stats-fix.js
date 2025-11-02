require('dotenv').config();
const mongoose = require('mongoose');
const EmergencyRequest = require('./models/EmergencyRequest');
const BloodDonor = require('./models/BloodDonor');
const MedicalFacility = require('./models/MedicalFacility');

mongoose.connect(process.env.MONGODB_URI, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
});

async function testStatsQueries() {
  try {
    console.log('Testing updated stats queries...');
    
    const activeRequests = await EmergencyRequest.countDocuments({ 
      status: 'active', 
      $or: [{ isActive: true }, { isActive: { $exists: false } }] 
    });
    
    const availableDonors = await BloodDonor.countDocuments({ 
      'availability.isAvailable': true, 
      $or: [{ isActive: true }, { isActive: { $exists: false } }] 
    });
    
    const activeFacilities = await MedicalFacility.countDocuments({ 
      $or: [{ isActive: true }, { isActive: { $exists: false } }] 
    });
    
    console.log('Results:');
    console.log('- Active Requests:', activeRequests);
    console.log('- Available Donors:', availableDonors);
    console.log('- Active Facilities:', activeFacilities);
    
  } catch (error) {
    console.error('Error:', error);
  } finally {
    mongoose.connection.close();
  }
}

testStatsQueries();