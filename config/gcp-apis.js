// GCP APIs Configuration for Emergency Medical Directory

const GCP_APIS = {
  // Core Infrastructure
  PROJECT_ID: process.env.GCP_PROJECT_ID,
  
  // Firebase Configuration
  FIREBASE: {
    apiKey: process.env.FIREBASE_API_KEY,
    authDomain: process.env.FIREBASE_AUTH_DOMAIN,
    projectId: process.env.GCP_PROJECT_ID,
    storageBucket: process.env.FIREBASE_STORAGE_BUCKET,
    messagingSenderId: process.env.FIREBASE_MESSAGING_SENDER_ID,
    appId: process.env.FIREBASE_APP_ID,
    measurementId: process.env.FIREBASE_MEASUREMENT_ID
  },

  // Google Maps Platform APIs
  MAPS: {
    API_KEY: process.env.GOOGLE_MAPS_API_KEY,
    ENDPOINTS: {
      MAPS_JS: 'https://maps.googleapis.com/maps/api/js',
      PLACES: 'https://maps.googleapis.com/maps/api/place',
      GEOCODING: 'https://maps.googleapis.com/maps/api/geocode',
      DIRECTIONS: 'https://maps.googleapis.com/maps/api/directions',
      DISTANCE_MATRIX: 'https://maps.googleapis.com/maps/api/distancematrix'
    },
    PLACE_TYPES: [
      'hospital',
      'pharmacy',
      'doctor',
      'health',
      'ambulance_service',
      'blood_bank'
    ]
  },

  // Cloud Firestore
  FIRESTORE: {
    COLLECTIONS: {
      USERS: 'users',
      MEDICAL_FACILITIES: 'medical_facilities',
      EMERGENCY_REQUESTS: 'emergency_requests',
      BLOOD_DONORS: 'blood_donors',
      RESOURCES: 'resources',
      NOTIFICATIONS: 'notifications',
      ADMIN_VERIFICATIONS: 'admin_verifications'
    }
  },

  // Cloud Storage
  STORAGE: {
    BUCKETS: {
      FACILITY_DOCS: `${process.env.GCP_PROJECT_ID}-facility-docs`,
      USER_UPLOADS: `${process.env.GCP_PROJECT_ID}-user-uploads`,
      EMERGENCY_PHOTOS: `${process.env.GCP_PROJECT_ID}-emergency-photos`
    }
  },

  // Cloud Functions
  FUNCTIONS: {
    REGION: 'us-central1',
    ENDPOINTS: {
      SEND_NOTIFICATION: 'sendEmergencyNotification',
      VERIFY_FACILITY: 'verifyMedicalFacility',
      PROCESS_EMERGENCY_REQUEST: 'processEmergencyRequest',
      UPDATE_RESOURCE_STATUS: 'updateResourceStatus'
    }
  },

  // AI/ML APIs
  AI_ML: {
    NATURAL_LANGUAGE: {
      ENDPOINT: 'https://language.googleapis.com/v1/documents:analyzeSentiment',
      FEATURES: ['sentiment', 'entities', 'classification']
    },
    TRANSLATION: {
      ENDPOINT: 'https://translation.googleapis.com/language/translate/v2',
      SUPPORTED_LANGUAGES: ['en', 'es', 'fr', 'de', 'hi', 'ar']
    }
  },

  // Pub/Sub Topics
  PUBSUB: {
    TOPICS: {
      EMERGENCY_ALERTS: 'emergency-alerts',
      RESOURCE_UPDATES: 'resource-updates',
      USER_NOTIFICATIONS: 'user-notifications',
      FACILITY_VERIFICATIONS: 'facility-verifications'
    }
  },

  // Cloud Monitoring
  MONITORING: {
    METRICS: {
      EMERGENCY_REQUESTS: 'custom.googleapis.com/emergency_requests',
      RESPONSE_TIME: 'custom.googleapis.com/response_time',
      FACILITY_AVAILABILITY: 'custom.googleapis.com/facility_availability'
    }
  }
};

// API Rate Limits and Quotas
const API_LIMITS = {
  MAPS_JS: {
    FREE_TIER: 25000, // requests per day
    COST_PER_1000: 7 // USD
  },
  PLACES_API: {
    FREE_TIER: 0,
    COST_PER_1000: 17 // USD
  },
  GEOCODING: {
    FREE_TIER: 0,
    COST_PER_1000: 5 // USD
  },
  FIRESTORE: {
    FREE_TIER: {
      READS: 50000, // per day
      WRITES: 20000, // per day
      DELETES: 20000 // per day
    }
  },
  CLOUD_FUNCTIONS: {
    FREE_TIER: 2000000 // invocations per month
  }
};

// Emergency Priority Levels
const EMERGENCY_LEVELS = {
  CRITICAL: {
    level: 1,
    response_time: 300, // 5 minutes
    notification_radius: 50 // km
  },
  HIGH: {
    level: 2,
    response_time: 900, // 15 minutes
    notification_radius: 25 // km
  },
  MEDIUM: {
    level: 3,
    response_time: 1800, // 30 minutes
    notification_radius: 10 // km
  },
  LOW: {
    level: 4,
    response_time: 3600, // 1 hour
    notification_radius: 5 // km
  }
};

// Medical Facility Types
const FACILITY_TYPES = {
  HOSPITAL: {
    type: 'hospital',
    services: ['emergency', 'icu', 'surgery', 'blood_bank'],
    verification_required: true
  },
  CLINIC: {
    type: 'clinic',
    services: ['consultation', 'basic_treatment'],
    verification_required: true
  },
  PHARMACY: {
    type: 'pharmacy',
    services: ['medications', 'medical_supplies'],
    verification_required: false
  },
  BLOOD_BANK: {
    type: 'blood_bank',
    services: ['blood_donation', 'blood_storage'],
    verification_required: true
  },
  AMBULANCE: {
    type: 'ambulance_service',
    services: ['emergency_transport', 'medical_assistance'],
    verification_required: true
  }
};

module.exports = {
  GCP_APIS,
  API_LIMITS,
  EMERGENCY_LEVELS,
  FACILITY_TYPES
};