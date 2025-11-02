require('dotenv').config();
const mongoose = require('mongoose');
const MedicalFacility = require('../models/MedicalFacility');
const User = require('../models/User');

mongoose.connect(process.env.MONGODB_URI);

async function addHospitalBeds() {
  try {
    // Create a sample admin user for hospitals
    let adminUser = await User.findOne({ email: 'hospital@admin.com' });
    if (!adminUser) {
      adminUser = new User({
        name: 'Hospital Admin',
        email: 'hospital@admin.com',
        password: 'admin123',
        role: 'admin',
        isEmailVerified: true
      });
      await adminUser.save();
    }

    // Andhra Pradesh hospitals with bed data
    const hospitals = [
      // Vijayawada Hospitals
      {
        name: 'Manipal Hospital Vijayawada',
        type: 'hospital',
        owner: adminUser._id,
        location: { type: 'Point', coordinates: [80.6480, 16.5062] },
        address: {
          street: 'NH-5, Tadepalli',
          city: 'Vijayawada',
          state: 'Andhra Pradesh',
          zipCode: '522501',
          country: 'India'
        },
        contact: {
          phone: '+91-863-2344-777',
          email: 'info@manipalhospitals.com',
          emergencyPhone: '+91-863-2344-700'
        },
        services: ['emergency', 'icu', 'surgery', 'cardiology', 'neurology'],
        capacity: {
          totalBeds: 350,
          availableBeds: 65,
          icuBeds: 80,
          availableIcuBeds: 15,
          ventilators: 40,
          availableVentilators: 12,
          lastUpdated: new Date()
        },
        isVerified: true,
        status: 'active'
      },
      {
        name: 'Ramesh Hospitals Vijayawada',
        type: 'hospital',
        owner: adminUser._id,
        location: { type: 'Point', coordinates: [80.6413, 16.5149] },
        address: {
          street: 'Governorpet',
          city: 'Vijayawada',
          state: 'Andhra Pradesh',
          zipCode: '520002'
        },
        contact: {
          phone: '+91-866-2474-888',
          emergencyPhone: '+91-866-2474-800'
        },
        services: ['emergency', 'icu', 'orthopedics', 'maternity'],
        capacity: {
          totalBeds: 250,
          availableBeds: 42,
          icuBeds: 50,
          availableIcuBeds: 8,
          ventilators: 25,
          availableVentilators: 6,
          lastUpdated: new Date()
        },
        isVerified: true,
        status: 'active'
      },
      {
        name: 'Government General Hospital Vijayawada',
        type: 'hospital',
        owner: adminUser._id,
        location: { type: 'Point', coordinates: [80.6389, 16.5081] },
        address: {
          street: 'Hospital Road',
          city: 'Vijayawada',
          state: 'Andhra Pradesh',
          zipCode: '520001'
        },
        contact: {
          phone: '+91-866-2578-911',
          emergencyPhone: '+91-866-2578-108'
        },
        services: ['emergency', 'icu', 'surgery', 'pediatrics'],
        capacity: {
          totalBeds: 800,
          availableBeds: 120,
          icuBeds: 60,
          availableIcuBeds: 12,
          ventilators: 30,
          availableVentilators: 8,
          lastUpdated: new Date()
        },
        isVerified: true,
        status: 'active'
      },
      // Visakhapatnam Hospitals
      {
        name: 'Apollo Hospital Visakhapatnam',
        type: 'hospital',
        owner: adminUser._id,
        location: { type: 'Point', coordinates: [83.2185, 17.7231] },
        address: {
          street: 'Arilova, Bhimili Road',
          city: 'Visakhapatnam',
          state: 'Andhra Pradesh',
          zipCode: '530040'
        },
        contact: {
          phone: '+91-891-2889-999',
          emergencyPhone: '+91-891-2889-900'
        },
        services: ['emergency', 'icu', 'surgery', 'cardiology', 'neurology'],
        capacity: {
          totalBeds: 400,
          availableBeds: 85,
          icuBeds: 90,
          availableIcuBeds: 20,
          ventilators: 50,
          availableVentilators: 15,
          lastUpdated: new Date()
        },
        isVerified: true,
        status: 'active'
      },
      {
        name: 'KIMS ICON Hospital Visakhapatnam',
        type: 'hospital',
        owner: adminUser._id,
        location: { type: 'Point', coordinates: [83.2042, 17.7068] },
        address: {
          street: 'Visakhapatnam-Vizianagaram Road',
          city: 'Visakhapatnam',
          state: 'Andhra Pradesh',
          zipCode: '530017'
        },
        contact: {
          phone: '+91-891-3989-999',
          emergencyPhone: '+91-891-3989-900'
        },
        services: ['emergency', 'icu', 'surgery', 'orthopedics'],
        capacity: {
          totalBeds: 300,
          availableBeds: 55,
          icuBeds: 70,
          availableIcuBeds: 14,
          ventilators: 35,
          availableVentilators: 10,
          lastUpdated: new Date()
        },
        isVerified: true,
        status: 'active'
      },
      // Guntur Hospitals
      {
        name: 'KIMS Saveera Hospital Guntur',
        type: 'hospital',
        owner: adminUser._id,
        location: { type: 'Point', coordinates: [80.4365, 16.3067] },
        address: {
          street: 'Kothapet Main Road',
          city: 'Guntur',
          state: 'Andhra Pradesh',
          zipCode: '522001'
        },
        contact: {
          phone: '+91-863-2211-777',
          emergencyPhone: '+91-863-2211-700'
        },
        services: ['emergency', 'icu', 'surgery', 'cardiology'],
        capacity: {
          totalBeds: 200,
          availableBeds: 35,
          icuBeds: 40,
          availableIcuBeds: 7,
          ventilators: 20,
          availableVentilators: 5,
          lastUpdated: new Date()
        },
        isVerified: true,
        status: 'active'
      },
      // Tirupati Hospitals
      {
        name: 'SVIMS Tirupati',
        type: 'hospital',
        owner: adminUser._id,
        location: { type: 'Point', coordinates: [79.4192, 13.6288] },
        address: {
          street: 'Alipiri Road',
          city: 'Tirupati',
          state: 'Andhra Pradesh',
          zipCode: '517507'
        },
        contact: {
          phone: '+91-877-2287-777',
          emergencyPhone: '+91-877-2287-108'
        },
        services: ['emergency', 'icu', 'surgery', 'neurology', 'cardiology'],
        capacity: {
          totalBeds: 600,
          availableBeds: 95,
          icuBeds: 100,
          availableIcuBeds: 18,
          ventilators: 60,
          availableVentilators: 16,
          lastUpdated: new Date()
        },
        isVerified: true,
        status: 'active'
      },
      {
        name: 'Apollo BGS Hospital Tirupati',
        type: 'hospital',
        owner: adminUser._id,
        location: { type: 'Point', coordinates: [79.4089, 13.6358] },
        address: {
          street: 'Padmavathi Nagar',
          city: 'Tirupati',
          state: 'Andhra Pradesh',
          zipCode: '517502'
        },
        contact: {
          phone: '+91-877-2248-888',
          emergencyPhone: '+91-877-2248-800'
        },
        services: ['emergency', 'icu', 'surgery', 'maternity'],
        capacity: {
          totalBeds: 180,
          availableBeds: 28,
          icuBeds: 35,
          availableIcuBeds: 6,
          ventilators: 18,
          availableVentilators: 4,
          lastUpdated: new Date()
        },
        isVerified: true,
        status: 'active'
      },
      // Kakinada Hospitals
      {
        name: 'Medicover Hospital Kakinada',
        type: 'hospital',
        owner: adminUser._id,
        location: { type: 'Point', coordinates: [82.2275, 16.9891] },
        address: {
          street: 'NH-214, Ramanayyapeta',
          city: 'Kakinada',
          state: 'Andhra Pradesh',
          zipCode: '533005'
        },
        contact: {
          phone: '+91-884-2340-777',
          emergencyPhone: '+91-884-2340-700'
        },
        services: ['emergency', 'icu', 'surgery', 'orthopedics'],
        capacity: {
          totalBeds: 150,
          availableBeds: 22,
          icuBeds: 30,
          availableIcuBeds: 5,
          ventilators: 15,
          availableVentilators: 3,
          lastUpdated: new Date()
        },
        isVerified: false,
        status: 'active'
      },
      // Nellore Hospitals
      {
        name: 'Narayana Medical College Hospital Nellore',
        type: 'hospital',
        owner: adminUser._id,
        location: { type: 'Point', coordinates: [79.9864, 14.4426] },
        address: {
          street: 'Chinthareddypalem',
          city: 'Nellore',
          state: 'Andhra Pradesh',
          zipCode: '524003'
        },
        contact: {
          phone: '+91-861-2317-777',
          emergencyPhone: '+91-861-2317-108'
        },
        services: ['emergency', 'icu', 'surgery', 'pediatrics', 'cardiology'],
        capacity: {
          totalBeds: 500,
          availableBeds: 78,
          icuBeds: 80,
          availableIcuBeds: 15,
          ventilators: 40,
          availableVentilators: 11,
          lastUpdated: new Date()
        },
        isVerified: true,
        status: 'active'
      }
    ];

    // Clear existing hospitals
    await MedicalFacility.deleteMany({ type: 'hospital' });
    
    // Insert new hospitals
    await MedicalFacility.insertMany(hospitals);
    
    console.log('✅ Successfully added 11 Andhra Pradesh hospitals with bed availability data');
    console.log('Hospitals added:');
    hospitals.forEach(h => {
      console.log(`- ${h.name}: ${h.capacity.availableBeds} beds, ${h.capacity.availableIcuBeds} ICU, ${h.capacity.availableVentilators} ventilators`);
    });
    
  } catch (error) {
    console.error('❌ Error adding hospitals:', error);
  } finally {
    mongoose.connection.close();
  }
}

addHospitalBeds();