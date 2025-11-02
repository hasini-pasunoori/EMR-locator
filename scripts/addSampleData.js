require('dotenv').config();
const mongoose = require('mongoose');
const MedicalFacility = require('../models/MedicalFacility');
const BloodDonor = require('../models/BloodDonor');
const User = require('../models/User');

async function addSampleData() {
  try {
    await mongoose.connect(process.env.MONGODB_URI);
    console.log('Connected to MongoDB');

    // Create or find sample user for facilities
    let sampleUser = await User.findOne({ email: 'admin@emresource.com' });
    if (!sampleUser) {
      sampleUser = new User({
        name: 'System Admin',
        email: 'admin@emresource.com',
        password: 'temppassword123',
        authMethod: 'local',
        isEmailVerified: true
      });
      await sampleUser.save();
    }

    // Sample medical facilities
    const facilities = [
      {
        name: 'City General Hospital',
        type: 'hospital',
        owner: sampleUser._id,
        address: {
          street: '123 Main Street',
          city: 'Mumbai',
          state: 'Maharashtra',
          zipCode: '400001',
          country: 'India'
        },
        location: {
          type: 'Point',
          coordinates: [72.8777, 19.0760]
        },
        contact: {
          phone: '+91-22-12345678',
          email: 'info@citygeneral.com'
        },
        services: ['emergency', 'icu', 'surgery'],
        capacity: {
          totalBeds: 200,
          availableBeds: 50
        },
        isVerified: true
      },
      {
        name: 'MedPlus Pharmacy',
        type: 'pharmacy',
        owner: sampleUser._id,
        address: {
          street: '456 Health Street',
          city: 'Delhi',
          state: 'Delhi',
          zipCode: '110001',
          country: 'India'
        },
        location: {
          type: 'Point',
          coordinates: [77.2090, 28.6139]
        },
        contact: {
          phone: '+91-11-87654321',
          email: 'info@medplus.com'
        },
        services: ['pharmacy'],
        isVerified: true
      },
      {
        name: 'Red Cross Blood Bank',
        type: 'blood_bank',
        owner: sampleUser._id,
        address: {
          street: '789 Care Avenue',
          city: 'Bangalore',
          state: 'Karnataka',
          zipCode: '560001',
          country: 'India'
        },
        location: {
          type: 'Point',
          coordinates: [77.5946, 12.9716]
        },
        contact: {
          phone: '+91-80-11223344',
          email: 'info@redcrossblood.org'
        },
        services: ['blood_bank', 'emergency'],
        resources: {
          bloodBank: true,
          emergencyService: true
        },
        isVerified: true
      }
    ];

    await MedicalFacility.insertMany(facilities);
    console.log('Sample facilities added successfully');

    // Create or find sample donor user
    let donorUser = await User.findOne({ email: 'donor@example.com' });
    if (!donorUser) {
      donorUser = new User({
        name: 'John Donor',
        email: 'donor@example.com',
        password: 'temppassword123',
        authMethod: 'local',
        isEmailVerified: true
      });
      await donorUser.save();
    }

    // Sample blood donors
    const donors = [
      {
        user: donorUser._id,
        bloodType: 'O+',
        location: {
          type: 'Point',
          coordinates: [72.8777, 19.0760]
        },
        address: {
          city: 'Mumbai',
          state: 'Maharashtra',
          country: 'India'
        },
        contact: {
          phone: '+91-98765-43210'
        },
        medicalInfo: {
          age: 28,
          weight: 70,
          lastHealthCheckup: new Date()
        },
        availability: {
          isAvailable: true,
          lastDonationDate: new Date('2024-01-01')
        },
        verification: { isVerified: true }
      }
    ];

    await BloodDonor.insertMany(donors);
    console.log('Sample donors added successfully');

    console.log('All sample data added successfully!');
    process.exit(0);
  } catch (error) {
    console.error('Error adding sample data:', error);
    process.exit(1);
  }
}

addSampleData();