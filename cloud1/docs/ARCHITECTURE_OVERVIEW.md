# EMResource - Architecture Overview

## 🏗️ System Architecture

### High-Level Architecture
```
┌─────────────────┐    ┌─────────────────┐    ┌─────────────────┐
│   Frontend      │    │   Backend       │    │   Database      │
│   (EJS Views)   │◄──►│   (Express.js)  │◄──►│   (MongoDB)     │
└─────────────────┘    └─────────────────┘    └─────────────────┘
         │                       │                       │
         │                       │                       │
         ▼                       ▼                       ▼
┌─────────────────┐    ┌─────────────────┐    ┌─────────────────┐
│  Google Maps    │    │  Authentication │    │  Geospatial     │
│  Integration    │    │  (Passport.js)  │    │  Indexing       │
└─────────────────┘    └─────────────────┘    └─────────────────┘
```

## 📁 Folder Structure & Interconnections

### Core Directories
```
emresource-auth/
├── 📁 config/           # Configuration files
│   ├── passport.js      # Authentication strategies
│   ├── gcp-apis.js      # Google Cloud Platform APIs
│   └── emailService.js  # Email service configuration
│
├── 📁 models/           # Database schemas
│   ├── User.js          # User model with roles
│   ├── MedicalFacility.js # Hospital/clinic data
│   ├── BloodDonor.js    # Blood donor profiles
│   ├── EmergencyRequest.js # Emergency requests
│   ├── Chat.js          # Messaging system
│   └── OTP.js           # OTP verification
│
├── 📁 routes/           # API endpoints & page routes
│   ├── auth.js          # Authentication routes
│   ├── facilities.js    # Medical facility APIs
│   ├── donors.js        # Blood donor APIs
│   ├── emergency.js     # Emergency request APIs
│   ├── admin.js         # Admin panel routes
│   ├── hospital.js      # Hospital dashboard
│   ├── beds.js          # Bed availability
│   ├── chat.js          # Messaging routes
│   └── user.js          # User profile management
│
├── 📁 views/            # EJS templates
│   ├── partials/        # Reusable components
│   ├── index.ejs        # Landing page
│   ├── dashboard.ejs    # User dashboard
│   ├── resource.ejs     # Resource finder
│   ├── donor.ejs        # Donor registration
│   ├── admin.ejs        # Admin panel
│   └── hospital-dashboard.ejs # Hospital interface
│
├── 📁 public/           # Static assets
│   ├── css/             # Stylesheets
│   ├── js/              # Client-side JavaScript
│   ├── images/          # Static images
│   └── uploads/         # User uploaded files
│
└── 📁 scripts/          # Utility scripts
    ├── seedData.js      # Database seeding
    └── createAdmin.js   # Admin user creation
```

## 🔄 Data Flow Architecture

### 1. Authentication Flow
```
User Request → Auth Middleware → Passport.js → Database → Session Store
     ↓              ↓              ↓           ↓           ↓
Landing Page → Login Form → Strategy → User Model → Session Cookie
```

### 2. Resource Discovery Flow
```
User Location → Geospatial Query → MongoDB → Results → Google Maps
     ↓               ↓               ↓         ↓         ↓
GPS/Address → Distance Calculation → Index → Facilities → Markers
```

### 3. Emergency Request Flow
```
Emergency → Request Creation → Notification → Response → Communication
    ↓            ↓               ↓           ↓         ↓
User Input → Database Save → Email/SMS → Donors → Chat System
```

## 🛣️ Route Architecture

### Authentication Routes (`/auth`)
- `POST /auth/signup/send-otp` - Send OTP for registration
- `POST /auth/signup/verify-otp` - Verify OTP and create account
- `POST /auth/signin/send-otp` - Send OTP for login
- `POST /auth/signin/verify-otp` - Verify OTP and login
- `GET /auth/google` - Google OAuth login
- `GET /auth/google/callback` - OAuth callback
- `POST /auth/logout` - User logout

### API Routes
- `GET /api/facilities/nearby` - Find nearby medical facilities
- `GET /api/donors/nearby` - Find nearby blood donors
- `POST /api/emergency/request` - Create emergency request
- `GET /api/beds/availability` - Check bed availability
- `POST /api/chat/send` - Send message

### Page Routes
- `GET /` - Landing page
- `GET /dashboard` - User dashboard (role-based)
- `GET /resource` - Resource finder
- `GET /donor` - Donor registration
- `GET /admin` - Admin panel (admin only)
- `GET /hospital` - Hospital dashboard (hospital only)

## 🔐 Authentication Pipeline

### Multi-Factor Authentication Flow
```
1. User Input (Email + Password + Role)
   ↓
2. Validation (express-validator)
   ↓
3. User Lookup (MongoDB)
   ↓
4. Password Verification (bcrypt)
   ↓
5. Role Verification
   ↓
6. OTP Generation & Email
   ↓
7. OTP Verification
   ↓
8. Session Creation (express-session)
   ↓
9. Role-based Redirect
```

### Role-Based Access Control
```
User Roles:
├── 👤 user (default)     → /dashboard
├── 🩸 donor             → /donor/dashboard
├── 🏥 hospital          → /hospital/dashboard
└── 👑 admin             → /admin/dashboard
```

## 📊 Database Schema Relationships

### User-Centric Design
```
User (Central Entity)
├── 1:1 → BloodDonor (if role = 'donor')
├── 1:N → MedicalFacility (if role = 'hospital')
├── 1:N → EmergencyRequest (as requester)
├── 1:N → EmergencyRequest (as responder)
└── 1:N → Chat (messaging)
```

### Geospatial Indexing
```
Collections with Location Data:
├── User.location (2dsphere index)
├── MedicalFacility.location (2dsphere index)
└── BloodDonor.location (2dsphere index)
```

## 🔧 Technology Stack Integration

### Backend Stack
```
Node.js Runtime
├── Express.js (Web Framework)
├── Passport.js (Authentication)
├── Mongoose (MongoDB ODM)
├── Express-Session (Session Management)
└── Nodemailer (Email Service)
```

### Frontend Stack
```
EJS Template Engine
├── Bootstrap 5 (UI Framework)
├── Google Maps API (Mapping)
├── Chart.js (Analytics)
└── FontAwesome (Icons)
```

### External Services
```
Google Cloud Platform
├── Maps JavaScript API
├── Places API
├── Geocoding API
└── OAuth 2.0

MongoDB Atlas
├── Geospatial Queries
├── Text Search
└── Aggregation Pipeline
```

## 🚀 Deployment Pipeline

### Development → Production
```
Local Development
├── Environment Variables (.env)
├── MongoDB Atlas Connection
├── Google APIs Configuration
└── Session Secret Setup
     ↓
Production Deployment
├── Heroku/AWS/Docker
├── Environment Configuration
├── Database Migration
└── SSL Certificate
```

## 📈 Performance Optimizations

### Database Optimizations
- Geospatial indexing for location-based queries
- Compound indexes for filtered searches
- Connection pooling with Mongoose

### Caching Strategy
- Session-based caching
- Static asset caching
- API response caching (future enhancement)

### Security Measures
- Password hashing with bcrypt
- Session-based authentication
- CORS configuration
- Input validation with express-validator
- OTP-based two-factor authentication