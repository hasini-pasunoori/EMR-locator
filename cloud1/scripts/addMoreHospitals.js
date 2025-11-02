require('dotenv').config();
const mongoose = require('mongoose');
const MedicalFacility = require('../models/MedicalFacility');
const User = require('../models/User');

mongoose.connect(process.env.MONGODB_URI);

async function addMoreHospitals() {
  try {
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

    const moreHospitals = [
      // Additional Vijayawada Hospitals (9 more)
      {
        name: 'Andhra Hospital Vijayawada',
        type: 'hospital',
        owner: adminUser._id,
        location: { type: 'Point', coordinates: [80.6520, 16.5180] },
        address: {
          street: 'Siddartha Nagar',
          city: 'Vijayawada',
          state: 'Andhra Pradesh',
          zipCode: '520010'
        },
        contact: {
          phone: '+91-866-2555-777',
          emergencyPhone: '+91-866-2555-700'
        },
        services: ['emergency', 'icu', 'surgery', 'cardiology'],
        capacity: {
          totalBeds: 180,
          availableBeds: 32,
          icuBeds: 35,
          availableIcuBeds: 7,
          ventilators: 18,
          availableVentilators: 5,
          lastUpdated: new Date()
        },
        isVerified: true,
        status: 'active'
      },
      {
        name: 'Vijaya Hospital Vijayawada',
        type: 'hospital',
        owner: adminUser._id,
        location: { type: 'Point', coordinates: [80.6350, 16.5200] },
        address: {
          street: 'Benz Circle',
          city: 'Vijayawada',
          state: 'Andhra Pradesh',
          zipCode: '520008'
        },
        contact: {
          phone: '+91-866-2466-888',
          emergencyPhone: '+91-866-2466-800'
        },
        services: ['emergency', 'icu', 'neurology', 'orthopedics'],
        capacity: {
          totalBeds: 220,
          availableBeds: 38,
          icuBeds: 45,
          availableIcuBeds: 9,
          ventilators: 22,
          availableVentilators: 6,
          lastUpdated: new Date()
        },
        isVerified: true,
        status: 'active'
      },
      {
        name: 'Krishna Institute of Medical Sciences',
        type: 'hospital',
        owner: adminUser._id,
        location: { type: 'Point', coordinates: [80.6290, 16.5120] },
        address: {
          street: 'Minister Road',
          city: 'Vijayawada',
          state: 'Andhra Pradesh',
          zipCode: '520003'
        },
        contact: {
          phone: '+91-866-2377-999',
          emergencyPhone: '+91-866-2377-900'
        },
        services: ['emergency', 'icu', 'surgery', 'pediatrics'],
        capacity: {
          totalBeds: 300,
          availableBeds: 55,
          icuBeds: 60,
          availableIcuBeds: 12,
          ventilators: 30,
          availableVentilators: 8,
          lastUpdated: new Date()
        },
        isVerified: true,
        status: 'active'
      },
      {
        name: 'Medicover Hospital Vijayawada',
        type: 'hospital',
        owner: adminUser._id,
        location: { type: 'Point', coordinates: [80.6440, 16.5090] },
        address: {
          street: 'Labbipet',
          city: 'Vijayawada',
          state: 'Andhra Pradesh',
          zipCode: '520010'
        },
        contact: {
          phone: '+91-866-2488-777',
          emergencyPhone: '+91-866-2488-700'
        },
        services: ['emergency', 'icu', 'surgery', 'maternity'],
        capacity: {
          totalBeds: 160,
          availableBeds: 28,
          icuBeds: 32,
          availableIcuBeds: 6,
          ventilators: 16,
          availableVentilators: 4,
          lastUpdated: new Date()
        },
        isVerified: false,
        status: 'active'
      },
      {
        name: 'Narayana Medical College Vijayawada',
        type: 'hospital',
        owner: adminUser._id,
        location: { type: 'Point', coordinates: [80.6380, 16.4980] },
        address: {
          street: 'Chintareddy Palem',
          city: 'Vijayawada',
          state: 'Andhra Pradesh',
          zipCode: '521286'
        },
        contact: {
          phone: '+91-866-2499-888',
          emergencyPhone: '+91-866-2499-800'
        },
        services: ['emergency', 'icu', 'surgery', 'cardiology', 'neurology'],
        capacity: {
          totalBeds: 400,
          availableBeds: 72,
          icuBeds: 70,
          availableIcuBeds: 14,
          ventilators: 35,
          availableVentilators: 10,
          lastUpdated: new Date()
        },
        isVerified: true,
        status: 'active'
      },
      {
        name: 'Sterling Hospital Vijayawada',
        type: 'hospital',
        owner: adminUser._id,
        location: { type: 'Point', coordinates: [80.6510, 16.5140] },
        address: {
          street: 'Patamata',
          city: 'Vijayawada',
          state: 'Andhra Pradesh',
          zipCode: '520007'
        },
        contact: {
          phone: '+91-866-2511-777',
          emergencyPhone: '+91-866-2511-700'
        },
        services: ['emergency', 'icu', 'orthopedics', 'surgery'],
        capacity: {
          totalBeds: 140,
          availableBeds: 25,
          icuBeds: 28,
          availableIcuBeds: 5,
          ventilators: 14,
          availableVentilators: 3,
          lastUpdated: new Date()
        },
        isVerified: false,
        status: 'active'
      },
      {
        name: 'Apollo Reach Hospital Vijayawada',
        type: 'hospital',
        owner: adminUser._id,
        location: { type: 'Point', coordinates: [80.6460, 16.5220] },
        address: {
          street: 'PWD Quarters Road',
          city: 'Vijayawada',
          state: 'Andhra Pradesh',
          zipCode: '520015'
        },
        contact: {
          phone: '+91-866-2522-888',
          emergencyPhone: '+91-866-2522-800'
        },
        services: ['emergency', 'icu', 'surgery', 'pediatrics'],
        capacity: {
          totalBeds: 200,
          availableBeds: 35,
          icuBeds: 40,
          availableIcuBeds: 8,
          ventilators: 20,
          availableVentilators: 5,
          lastUpdated: new Date()
        },
        isVerified: true,
        status: 'active'
      },
      {
        name: 'Maxcure Hospital Vijayawada',
        type: 'hospital',
        owner: adminUser._id,
        location: { type: 'Point', coordinates: [80.6330, 16.5160] },
        address: {
          street: 'Kaleswara Rao Road',
          city: 'Vijayawada',
          state: 'Andhra Pradesh',
          zipCode: '520004'
        },
        contact: {
          phone: '+91-866-2533-999',
          emergencyPhone: '+91-866-2533-900'
        },
        services: ['emergency', 'icu', 'cardiology', 'neurology'],
        capacity: {
          totalBeds: 180,
          availableBeds: 0,
          icuBeds: 36,
          availableIcuBeds: 2,
          ventilators: 18,
          availableVentilators: 1,
          lastUpdated: new Date()
        },
        isVerified: true,
        status: 'active'
      },
      {
        name: 'Continental Hospital Vijayawada',
        type: 'hospital',
        owner: adminUser._id,
        location: { type: 'Point', coordinates: [80.6400, 16.5040] },
        address: {
          street: 'Ring Road',
          city: 'Vijayawada',
          state: 'Andhra Pradesh',
          zipCode: '520006'
        },
        contact: {
          phone: '+91-866-2544-777',
          emergencyPhone: '+91-866-2544-700'
        },
        services: ['emergency', 'icu', 'surgery', 'maternity'],
        capacity: {
          totalBeds: 250,
          availableBeds: 45,
          icuBeds: 50,
          availableIcuBeds: 10,
          ventilators: 25,
          availableVentilators: 7,
          lastUpdated: new Date()
        },
        isVerified: true,
        status: 'active'
      },
      // Ongole Hospitals (3)
      {
        name: 'RIMS Hospital Ongole',
        type: 'hospital',
        owner: adminUser._id,
        location: { type: 'Point', coordinates: [80.0499, 15.5057] },
        address: {
          street: 'Nelapadu Road',
          city: 'Ongole',
          state: 'Andhra Pradesh',
          zipCode: '523001'
        },
        contact: {
          phone: '+91-8592-234-777',
          emergencyPhone: '+91-8592-234-108'
        },
        services: ['emergency', 'icu', 'surgery', 'cardiology'],
        capacity: {
          totalBeds: 300,
          availableBeds: 52,
          icuBeds: 60,
          availableIcuBeds: 12,
          ventilators: 30,
          availableVentilators: 8,
          lastUpdated: new Date()
        },
        isVerified: true,
        status: 'active'
      },
      {
        name: 'Government General Hospital Ongole',
        type: 'hospital',
        owner: adminUser._id,
        location: { type: 'Point', coordinates: [80.0445, 15.5035] },
        address: {
          street: 'Hospital Road',
          city: 'Ongole',
          state: 'Andhra Pradesh',
          zipCode: '523002'
        },
        contact: {
          phone: '+91-8592-245-888',
          emergencyPhone: '+91-8592-245-108'
        },
        services: ['emergency', 'icu', 'surgery', 'pediatrics'],
        capacity: {
          totalBeds: 400,
          availableBeds: 68,
          icuBeds: 50,
          availableIcuBeds: 10,
          ventilators: 25,
          availableVentilators: 6,
          lastUpdated: new Date()
        },
        isVerified: true,
        status: 'active'
      },
      {
        name: 'Medicover Hospital Ongole',
        type: 'hospital',
        owner: adminUser._id,
        location: { type: 'Point', coordinates: [80.0520, 15.5080] },
        address: {
          street: 'Trunk Road',
          city: 'Ongole',
          state: 'Andhra Pradesh',
          zipCode: '523003'
        },
        contact: {
          phone: '+91-8592-256-777',
          emergencyPhone: '+91-8592-256-700'
        },
        services: ['emergency', 'icu', 'orthopedics', 'maternity'],
        capacity: {
          totalBeds: 150,
          availableBeds: 28,
          icuBeds: 30,
          availableIcuBeds: 6,
          ventilators: 15,
          availableVentilators: 4,
          lastUpdated: new Date()
        },
        isVerified: false,
        status: 'active'
      }
    ];

    await MedicalFacility.insertMany(moreHospitals);
    
    console.log('✅ Successfully added 12 more hospitals');
    console.log('\nAdditional Vijayawada Hospitals (9):');
    const vijayawadaHospitals = moreHospitals.filter(h => h.address.city === 'Vijayawada');
    vijayawadaHospitals.forEach(h => {
      console.log(`- ${h.name}: ${h.capacity.availableBeds} beds, ${h.capacity.availableIcuBeds} ICU, ${h.capacity.availableVentilators} ventilators`);
    });
    
    console.log('\nOngole Hospitals (3):');
    const ongoleHospitals = moreHospitals.filter(h => h.address.city === 'Ongole');
    ongoleHospitals.forEach(h => {
      console.log(`- ${h.name}: ${h.capacity.availableBeds} beds, ${h.capacity.availableIcuBeds} ICU, ${h.capacity.availableVentilators} ventilators`);
    });
    
  } catch (error) {
    console.error('❌ Error adding hospitals:', error);
  } finally {
    mongoose.connection.close();
  }
}

addMoreHospitals();