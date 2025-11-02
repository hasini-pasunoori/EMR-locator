require('dotenv').config();
const mongoose = require('mongoose');
const MedicalFacility = require('../models/MedicalFacility');
const BloodDonor = require('../models/BloodDonor');
const EmergencyRequest = require('../models/EmergencyRequest');
const User = require('../models/User');

// Sample data
const sampleFacilities = [
  {
    name: "City General Hospital",
    type: "hospital",
    address: {
      street: "123 Main Street",
      city: "New York",
      state: "NY",
      zipCode: "10001"
    },
    location: {
      type: "Point",
      coordinates: [-74.0060, 40.7128] // NYC coordinates
    },
    contact: {
      phone: "+1-555-0101",
      email: "info@citygeneral.com",
      website: "https://citygeneral.com"
    },
    services: ["emergency", "icu", "surgery", "blood_bank"],
    availability: {
      isOpen24x7: true
    },
    resources: {
      beds: {
        total: 500,
        available: 45,
        icu: 50,
        emergency: 20
      },
      bloodBank: {
        hasBloodBank: true,
        bloodTypes: [
          { type: "O+", units: 25 },
          { type: "O-", units: 15 },
          { type: "A+", units: 20 },
          { type: "A-", units: 10 },
          { type: "B+", units: 18 },
          { type: "B-", units: 8 },
          { type: "AB+", units: 12 },
          { type: "AB-", units: 5 }
        ]
      },
      equipment: {
        ventilators: 25,
        oxygenCylinders: 100,
        ambulances: 8
      }
    },
    verification: {
      isVerified: true,
      verificationDate: new Date()
    },
    rating: {
      average: 4.5,
      totalReviews: 234
    }
  },
  {
    name: "MedPlus Pharmacy",
    type: "pharmacy",
    address: {
      street: "456 Oak Avenue",
      city: "New York",
      state: "NY",
      zipCode: "10002"
    },
    location: {
      type: "Point",
      coordinates: [-74.0070, 40.7138]
    },
    contact: {
      phone: "+1-555-0102",
      email: "contact@medplus.com"
    },
    services: ["pharmacy"],
    availability: {
      isOpen24x7: false,
      operatingHours: {
        monday: { open: "08:00", close: "22:00" },
        tuesday: { open: "08:00", close: "22:00" },
        wednesday: { open: "08:00", close: "22:00" },
        thursday: { open: "08:00", close: "22:00" },
        friday: { open: "08:00", close: "22:00" },
        saturday: { open: "09:00", close: "20:00" },
        sunday: { open: "10:00", close: "18:00" }
      }
    },
    verification: {
      isVerified: true,
      verificationDate: new Date()
    },
    rating: {
      average: 4.2,
      totalReviews: 89
    }
  },
  {
    name: "Emergency Ambulance Services",
    type: "ambulance_service",
    address: {
      street: "789 Emergency Blvd",
      city: "New York",
      state: "NY",
      zipCode: "10003"
    },
    location: {
      type: "Point",
      coordinates: [-74.0080, 40.7148]
    },
    contact: {
      phone: "+1-555-0103",
      email: "dispatch@emergencyambulance.com"
    },
    services: ["ambulance", "emergency"],
    availability: {
      isOpen24x7: true
    },
    resources: {
      equipment: {
        ambulances: 15
      }
    },
    verification: {
      isVerified: true,
      verificationDate: new Date()
    },
    rating: {
      average: 4.8,
      totalReviews: 156
    }
  },
  {
    name: "Central Blood Bank",
    type: "blood_bank",
    address: {
      street: "321 Health Street",
      city: "New York",
      state: "NY",
      zipCode: "10004"
    },
    location: {
      type: "Point",
      coordinates: [-74.0090, 40.7158]
    },
    contact: {
      phone: "+1-555-0104",
      email: "info@centralbloodbank.org"
    },
    services: ["blood_bank"],
    availability: {
      isOpen24x7: false,
      operatingHours: {
        monday: { open: "07:00", close: "19:00" },
        tuesday: { open: "07:00", close: "19:00" },
        wednesday: { open: "07:00", close: "19:00" },
        thursday: { open: "07:00", close: "19:00" },
        friday: { open: "07:00", close: "19:00" },
        saturday: { open: "08:00", close: "16:00" },
        sunday: { open: "08:00", close: "16:00" }
      }
    },
    resources: {
      bloodBank: {
        hasBloodBank: true,
        bloodTypes: [
          { type: "O+", units: 50 },
          { type: "O-", units: 30 },
          { type: "A+", units: 40 },
          { type: "A-", units: 20 },
          { type: "B+", units: 35 },
          { type: "B-", units: 15 },
          { type: "AB+", units: 25 },
          { type: "AB-", units: 10 }
        ]
      }
    },
    verification: {
      isVerified: true,
      verificationDate: new Date()
    },
    rating: {
      average: 4.6,
      totalReviews: 78
    }
  },
  {
    name: "OxyLife Medical Supplies",
    type: "oxygen_supplier",
    address: {
      street: "654 Medical Plaza",
      city: "New York",
      state: "NY",
      zipCode: "10005"
    },
    location: {
      type: "Point",
      coordinates: [-74.0100, 40.7168]
    },
    contact: {
      phone: "+1-555-0105",
      email: "orders@oxylife.com"
    },
    services: ["oxygen"],
    availability: {
      isOpen24x7: true
    },
    resources: {
      equipment: {
        oxygenCylinders: 200
      }
    },
    verification: {
      isVerified: true,
      verificationDate: new Date()
    },
    rating: {
      average: 4.3,
      totalReviews: 45
    }
  }
];

async function seedDatabase() {
  try {
    // Connect to MongoDB
    await mongoose.connect(process.env.MONGODB_URI, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });
    
    console.log('Connected to MongoDB');

    // Create a sample user for facilities
    let sampleUser = await User.findOne({ email: 'admin@emresource.com' });
    if (!sampleUser) {
      sampleUser = new User({
        name: 'System Admin',
        email: 'admin@emresource.com',
        password: 'hashedpassword', // In real app, this would be properly hashed
        isEmailVerified: true,
        role: 'admin'
      });
      await sampleUser.save();
      console.log('Created sample admin user');
    }

    // Clear existing data
    await MedicalFacility.deleteMany({});
    await BloodDonor.deleteMany({});
    await EmergencyRequest.deleteMany({});
    
    console.log('Cleared existing data');

    // Add sample facilities
    const facilitiesWithUser = sampleFacilities.map(facility => ({
      ...facility,
      addedBy: sampleUser._id
    }));

    await MedicalFacility.insertMany(facilitiesWithUser);
    console.log(`Added ${sampleFacilities.length} medical facilities`);

    // Create sample blood donors
    const sampleDonors = [
      {
        user: sampleUser._id,
        bloodType: "O+",
        location: {
          type: "Point",
          coordinates: [-74.0050, 40.7120]
        },
        address: {
          street: "100 Donor Street",
          city: "New York",
          state: "NY",
          zipCode: "10001",
          country: "USA"
        },
        contact: {
          phone: "+1-555-1001",
          preferredContactMethod: "phone"
        },
        availability: {
          isAvailable: true,
          preferredTime: "anytime"
        },
        medicalInfo: {
          age: 28,
          weight: 70,
          isEligible: true
        },
        emergencyContact: {
          name: "Jane Doe",
          phone: "+1-555-1002",
          relationship: "spouse"
        },
        verification: {
          isVerified: true,
          verificationDate: new Date()
        },
        privacy: {
          showFullName: false,
          showPhone: true,
          showExactLocation: false,
          maxDistanceToShow: 10
        }
      },
      {
        user: sampleUser._id,
        bloodType: "A+",
        location: {
          type: "Point",
          coordinates: [-74.0060, 40.7130]
        },
        address: {
          street: "200 Helper Avenue",
          city: "New York",
          state: "NY",
          zipCode: "10002",
          country: "USA"
        },
        contact: {
          phone: "+1-555-1003",
          preferredContactMethod: "sms"
        },
        availability: {
          isAvailable: true,
          preferredTime: "evening"
        },
        medicalInfo: {
          age: 35,
          weight: 65,
          isEligible: true
        },
        emergencyContact: {
          name: "Bob Smith",
          phone: "+1-555-1004",
          relationship: "friend"
        },
        verification: {
          isVerified: true,
          verificationDate: new Date()
        },
        privacy: {
          showFullName: true,
          showPhone: true,
          showExactLocation: false,
          maxDistanceToShow: 25
        }
      }
    ];

    await BloodDonor.insertMany(sampleDonors);
    console.log(`Added ${sampleDonors.length} blood donors`);

    // Create sample emergency requests
    const sampleRequests = [
      {
        requester: sampleUser._id,
        type: "blood",
        urgency: "high",
        title: "Urgent B+ Blood Needed for Surgery",
        description: "Patient requires B+ blood for emergency surgery. Hospital blood bank is running low.",
        location: {
          type: "Point",
          coordinates: [-74.0065, 40.7135]
        },
        address: {
          street: "City General Hospital, 123 Main Street",
          city: "New York",
          state: "NY",
          zipCode: "10001"
        },
        patientInfo: {
          name: "John Patient",
          age: 45,
          gender: "male",
          bloodType: "B+",
          condition: "Emergency surgery required"
        },
        requirements: {
          bloodType: "B+",
          bloodUnits: 3
        },
        contact: {
          primaryPhone: "+1-555-2001",
          contactPerson: "Dr. Smith",
          relationship: "doctor"
        },
        hospital: {
          name: "City General Hospital",
          address: "123 Main Street, New York, NY",
          phone: "+1-555-0101",
          doctorName: "Dr. Smith"
        },
        status: "active",
        timeline: [{
          action: "request_created",
          description: "Emergency blood request created",
          timestamp: new Date(),
          user: sampleUser._id
        }],
        visibility: {
          isPublic: true,
          maxDistance: 50,
          targetAudience: ["donors", "facilities"]
        }
      },
      {
        requester: sampleUser._id,
        type: "oxygen",
        urgency: "critical",
        title: "Critical Oxygen Supply Needed",
        description: "Patient in critical condition requires immediate oxygen supply. Current supply insufficient.",
        location: {
          type: "Point",
          coordinates: [-74.0075, 40.7145]
        },
        address: {
          street: "Emergency Care Center, 456 Health Blvd",
          city: "New York",
          state: "NY",
          zipCode: "10003"
        },
        patientInfo: {
          name: "Mary Emergency",
          age: 67,
          gender: "female",
          condition: "Respiratory distress"
        },
        requirements: {
          oxygenLevel: "High flow oxygen concentrator needed"
        },
        contact: {
          primaryPhone: "+1-555-2002",
          contactPerson: "Nurse Johnson",
          relationship: "nurse"
        },
        status: "active",
        timeline: [{
          action: "request_created",
          description: "Critical oxygen request created",
          timestamp: new Date(),
          user: sampleUser._id
        }],
        visibility: {
          isPublic: true,
          maxDistance: 25,
          targetAudience: ["facilities"]
        }
      }
    ];

    await EmergencyRequest.insertMany(sampleRequests);
    console.log(`Added ${sampleRequests.length} emergency requests`);

    console.log('\n✅ Database seeded successfully!');
    console.log('\nSample data includes:');
    console.log(`- ${sampleFacilities.length} medical facilities`);
    console.log(`- ${sampleDonors.length} blood donors`);
    console.log(`- ${sampleRequests.length} emergency requests`);
    console.log('\nYou can now test the application with this sample data.');

  } catch (error) {
    console.error('Error seeding database:', error);
  } finally {
    await mongoose.connection.close();
    console.log('Database connection closed');
  }
}

// Run the seeder
if (require.main === module) {
  seedDatabase();
}

module.exports = seedDatabase;