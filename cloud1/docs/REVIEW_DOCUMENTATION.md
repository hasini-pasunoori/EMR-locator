# EMResource - Project Review Documentation

## 📋 Project Overview
- **Name:** emresource-auth
- **Version:** 1.0.0
- **Description:** Emergency Medical Resource Locator - Authentication System
- **Main Entry:** server.js

## 🚀 Quick Start Commands
```bash
# Install dependencies
npm install

# Start development server
npm run dev

# Start production server
npm start

# Seed database with sample data
npm run seed
```

## 🏗️ Architecture Summary
EMResource is a full-stack emergency medical resource locator built with:
- **Backend:** Node.js + Express.js + MongoDB
- **Frontend:** EJS templates + Bootstrap 5 + Google Maps API
- **Authentication:** Passport.js with OTP-based 2FA
- **Database:** MongoDB Atlas with geospatial indexing

## 🔑 Key Features
1. **Multi-role Authentication** (User, Donor, Hospital, Admin)
2. **Geospatial Resource Discovery** (Hospitals, Blood Banks, Pharmacies)
3. **Emergency Request System** (Blood donation requests)
4. **Real-time Communication** (Chat system)
5. **Admin Panel** (User management, analytics)
6. **Hospital Dashboard** (Bed management, facility updates)

## 📊 Database Collections
- **Users** - User accounts with role-based access
- **MedicalFacilities** - Hospitals, clinics, pharmacies
- **BloodDonors** - Registered blood donors
- **EmergencyRequests** - Blood donation requests
- **Chats** - Messaging between users
- **OTPs** - Two-factor authentication codes

## 🛡️ Security Features
- Password hashing with bcrypt
- OTP-based two-factor authentication
- Session-based authentication
- Role-based access control
- Input validation with express-validator
- CORS protection
- Secure cookie configuration


## 📁 Project Structure

```
emresource-auth/
├── ADMIN_PANEL_UPDATE.md
├── AUTHENTICATION_FIX.md
├── GCP_IMPLEMENTATION_GUIDE.md
├── README.md
├── auth-test.html
├── config
│   ├── emailService-backup.js
│   ├── emailService.js
│   ├── gcp-apis.js
│   └── passport.js
├── dashboard.html.backup
├── docs
│   ├── ARCHITECTURE_OVERVIEW.md
│   ├── data-flow-visualizer.js
│   ├── generate-review-docs.js
│   └── route-analyzer.js
├── donor.html.backup
├── index.html.backup
├── models
│   ├── BloodDonor.js
│   ├── Chat.js
│   ├── EmergencyContact.js
│   ├── EmergencyRequest.js
│   ├── MedicalFacility.js
│   ├── OTP.js
│   └── User.js
├── package.json
├── public
│   ├── css
│   │   └── main.css
│   ├── exports
│   │   ├── emresource-data-2025-09-23T17-51-29-202Z.json
│   │   ├── emresource-data-2025-09-23T17-51-48-758Z.xlsx
│   │   ├── emresource-data-2025-09-23T17-51-51-565Z.json
│   │   ├── emresource-data-2025-09-23T17-51-54-795Z.csv
│   │   ├── emresource-data-2025-09-23T17-52-07-814Z.json
│   │   ├── emresource-data-2025-09-23T17-57-39-992Z.json
│   │   ├── emresource-data-2025-09-23T18-02-03-488Z.pdf
│   │   ├── emresource-data-2025-09-23T18-02-06-745Z.pdf
│   │   ├── emresource-data-2025-09-25T10-07-53-107Z.pdf
│   │   ├── emresource-data-2025-09-25T10-07-56-762Z.pdf
│   │   └── emresource-data-2025-10-21T12-55-57-972Z.pdf
│   ├── images
│   ├── js
│   │   └── auth.js
│   └── uploads
│       └── profiles
├── resource.html.backup
├── routes
│   ├── admin.js
│   ├── auth.js
│   ├── beds.js
│   ├── chat.js
│   ├── donor.js
│   ├── donors.js
│   ├── emergency.js
│   ├── facilities.js
│   ├── hospital.js
│   ├── sos.js
│   └── user.js
├── scripts
│   ├── addHospitalBeds.js
│   ├── addMoreHospitals.js
│   ├── addSampleData.js
│   ├── changeUserRole.js
│   ├── checkUsers.js
│   ├── createAdmin.js
│   ├── createNewAdmin.js
│   ├── ensureAdmin.js
│   ├── fixUserRole.js
│   ├── makeUserAdmin.js
│   ├── seedData.js
│   └── testAdmin.js
├── server.js
├── services
├── settings.html.backup
├── src
│   ├── App.js
│   ├── components
│   │   └── ResourceFinder.js
│   └── index.js
├── test-auth.js
├── test-email.js
├── test-mongodb.js
├── views
│   ├── admin-dashboard.ejs
│   ├── admin.ejs
│   ├── analytics.ejs
│   ├── beds.ejs
│   ├── chat.ejs
│   ├── dashboard.ejs
│   ├── donor-dashboard.ejs
│   ├── donor.ejs
│   ├── emergency-contacts.ejs
│   ├── hospital-dashboard.ejs
│   ├── index.ejs
│   ├── layout.ejs
│   ├── otp-verification.ejs
│   ├── partials
│   │   ├── auth-modals.ejs
│   │   ├── head.ejs
│   │   ├── navbar.ejs
│   │   └── scripts.ejs
│   ├── requests.ejs
│   ├── resource.ejs
│   ├── responses.ejs
│   └── settings.ejs
└── webpack.config.js

```

### Key Directories Explained

- **📁 config/** - Configuration files for authentication, APIs, and services
- **📁 models/** - MongoDB schemas and data models
- **📁 routes/** - Express.js route handlers and API endpoints
- **📁 views/** - EJS templates for server-side rendering
- **📁 public/** - Static assets (CSS, JS, images, uploads)
- **📁 scripts/** - Utility scripts for database seeding and admin tasks
- **📁 docs/** - Documentation and analysis files


## 🛠️ Technology Stack

### Backend Dependencies
- **bcryptjs** ^2.4.3
- **connect-mongo** ^5.0.0
- **dotenv** ^16.3.1
- **ejs** ^3.1.9
- **express** ^4.18.2
- **express-flash** ^0.0.2
- **express-session** ^1.17.3
- **express-validator** ^7.2.1
- **json2csv** ^6.0.0-alpha.2
- **method-override** ^3.0.0
- **mongoose** ^7.5.0
- **multer** ^2.0.2
- **nodemailer** ^6.10.1
- **passport** ^0.6.0
- **passport-google-oauth20** ^2.0.0
- **passport-local** ^1.0.0
- **pdfkit** ^0.17.2
- **xlsx** ^0.18.5

### Development Dependencies
- **jest** ^29.6.2
- **nodemon** ^3.0.1

### External Services
- **MongoDB Atlas** - Cloud database with geospatial indexing
- **Google Maps Platform** - Maps, Places, Geocoding APIs
- **Google OAuth 2.0** - Social authentication
- **Nodemailer** - Email service for OTP delivery

### Frontend Technologies
- **EJS** - Server-side templating engine
- **Bootstrap 5** - CSS framework for responsive design
- **Google Maps JavaScript API** - Interactive maps
- **Chart.js** - Data visualization for analytics
- **FontAwesome** - Icon library


## 🔌 API Endpoints

### Authentication Routes (`/auth`)
- **POST** `/auth/signup/send-otp` - Send OTP for user registration
- **POST** `/auth/signup/verify-otp` - Verify OTP and create account
- **POST** `/auth/signin/send-otp` - Send OTP for user login
- **POST** `/auth/signin/verify-otp` - Verify OTP and authenticate
- **GET** `/auth/google` - Initiate Google OAuth login
- **GET** `/auth/google/callback` - Handle OAuth callback
- **POST** `/auth/logout` - Logout user
- **GET** `/auth/me` - Get current user information

### Medical Facilities API (`/api/facilities`)
- **GET** `/api/facilities/nearby` - Find nearby medical facilities
- **GET** `/api/facilities` - Get all facilities with filters
- **POST** `/api/facilities` - Add new medical facility
- **PUT** `/api/facilities/:id` - Update facility information
- **DELETE** `/api/facilities/:id` - Remove facility

### Blood Donors API (`/api/donors`)
- **GET** `/api/donors/nearby` - Find nearby blood donors
- **POST** `/api/donors/register` - Register as blood donor
- **GET** `/api/donors/profile` - Get donor profile
- **PATCH** `/api/donors/availability` - Update availability status

### Emergency Requests API (`/api/emergency`)
- **POST** `/api/emergency/request` - Create emergency blood request
- **GET** `/api/emergency/nearby` - Find nearby emergency requests
- **POST** `/api/emergency/:id/respond` - Respond to emergency request
- **GET** `/api/emergency/stats/overview` - Get emergency statistics

### Hospital Management (`/api/hospital`)
- **GET** `/api/hospital/dashboard` - Hospital dashboard data
- **PUT** `/api/hospital/facility` - Update facility information
- **GET** `/api/hospital/analytics` - Hospital analytics data

### Bed Management (`/api/beds`)
- **GET** `/api/beds/availability` - Check bed availability
- **PUT** `/api/beds/update` - Update bed counts
- **GET** `/api/beds/hospitals` - Get hospitals with bed info

### Chat System (`/api/chat`)
- **POST** `/api/chat/send` - Send message
- **GET** `/api/chat/conversations` - Get user conversations
- **PUT** `/api/chat/read` - Mark messages as read

### Admin Panel (`/api/admin`)
- **GET** `/api/admin/users` - Get all users (admin only)
- **PUT** `/api/admin/users/:id/role` - Update user role
- **GET** `/api/admin/analytics` - System analytics
- **POST** `/api/admin/verify-facility` - Verify medical facility


## 🛡️ Security Implementation

### Authentication Security
- **Multi-Factor Authentication:** OTP-based 2FA via email
- **Password Security:** bcrypt hashing with salt rounds
- **Session Management:** Secure cookies with httpOnly and sameSite flags
- **OAuth Integration:** Google OAuth 2.0 for social login

### Input Validation & Sanitization
- **Email Validation:** express-validator with email format checking
- **Password Requirements:** Minimum 6 characters (configurable)
- **Data Sanitization:** Input cleaning to prevent XSS attacks
- **SQL Injection Protection:** Mongoose ODM with parameterized queries

### Authorization & Access Control
- **Role-Based Access Control (RBAC):** Four user roles with specific permissions
  - **User:** Basic access to resources and emergency requests
  - **Donor:** Blood donation management and response capabilities
  - **Hospital:** Facility management and bed updates
  - **Admin:** Full system access and user management
- **Route Protection:** Authentication middleware on protected routes
- **Resource Ownership:** Users can only access their own data

### Data Protection
- **Environment Variables:** Sensitive data stored in .env files
- **CORS Configuration:** Controlled cross-origin access
- **Session Security:** Configurable session timeout and secure storage
- **API Rate Limiting:** (Recommended for production)

### Security Headers & Best Practices
- **Helmet.js:** (Recommended) Security headers middleware
- **HTTPS Enforcement:** (Production requirement)
- **Input Length Limits:** Prevent buffer overflow attacks
- **Error Handling:** Secure error messages without sensitive data exposure


## 🚀 Deployment Guide

### Environment Configuration
Create a `.env` file with the following variables:

```env
# Database Configuration
MONGODB_URI=mongodb+srv://username:password@cluster.mongodb.net/emresource

# Authentication
SESSION_SECRET=your-super-secret-session-key
GOOGLE_CLIENT_ID=your-google-oauth-client-id
GOOGLE_CLIENT_SECRET=your-google-oauth-client-secret

# Google Maps API
GOOGLE_MAPS_API_KEY=your-google-maps-api-key

# Application Settings
NODE_ENV=production
PORT=3000
CLIENT_URL=https://your-domain.com

# Email Configuration (for OTP)
EMAIL_USER=your-email@gmail.com
EMAIL_PASS=your-app-specific-password
```

### Database Setup
1. **MongoDB Atlas Setup:**
   - Create MongoDB Atlas account
   - Create new cluster
   - Configure network access (IP whitelist)
   - Create database user
   - Get connection string

2. **Geospatial Indexing:**
   - Indexes are automatically created by Mongoose schemas
   - Verify 2dsphere indexes on location fields

### Google Cloud Platform Setup
1. **Enable APIs:**
   - Maps JavaScript API
   - Places API
   - Geocoding API
   - Directions API (optional)

2. **OAuth Configuration:**
   - Create OAuth 2.0 credentials
   - Configure authorized redirect URIs
   - Set up consent screen

### Production Deployment Options

#### Option 1: Heroku
```bash
# Install Heroku CLI
npm install -g heroku

# Login and create app
heroku login
heroku create your-app-name

# Set environment variables
heroku config:set MONGODB_URI=your-mongodb-uri
heroku config:set SESSION_SECRET=your-session-secret
# ... set all other env vars

# Deploy
git push heroku main
```

#### Option 2: Docker
```dockerfile
FROM node:16-alpine
WORKDIR /app
COPY package*.json ./
RUN npm ci --only=production
COPY . .
EXPOSE 3000
CMD ["npm", "start"]
```

#### Option 3: AWS/DigitalOcean
- Use PM2 for process management
- Configure Nginx as reverse proxy
- Set up SSL certificates
- Configure environment variables

### Post-Deployment Steps
1. **Database Seeding:**
   ```bash
   npm run seed
   ```

2. **Create Admin User:**
   ```bash
   node scripts/createAdmin.js
   ```

3. **Verify Functionality:**
   - Test user registration/login
   - Verify Google Maps integration
   - Check email delivery (OTP)
   - Test geospatial queries


## 🧪 Testing Guide

### Manual Testing Checklist

#### Authentication Flow
- [ ] User registration with OTP verification
- [ ] User login with OTP verification
- [ ] Google OAuth login
- [ ] Role-based dashboard redirection
- [ ] Session persistence and logout

#### Resource Discovery
- [ ] Location-based facility search
- [ ] Google Maps integration
- [ ] Distance calculation accuracy
- [ ] Filter functionality (facility type, services)
- [ ] Mobile responsiveness

#### Emergency Requests
- [ ] Blood request creation
- [ ] Donor notification system
- [ ] Response tracking
- [ ] Chat system functionality

#### Admin Panel
- [ ] User management
- [ ] Facility verification
- [ ] Analytics dashboard
- [ ] Data export functionality

#### Hospital Dashboard
- [ ] Bed availability updates
- [ ] Facility information management
- [ ] Analytics and reporting

### API Testing
Use tools like Postman or curl to test API endpoints:

```bash
# Test facility search
curl -X GET "http://localhost:3000/api/facilities/nearby?lat=12.9716&lng=77.5946&radius=5000"

# Test authentication
curl -X POST "http://localhost:3000/auth/signin/send-otp" \
  -H "Content-Type: application/json" \
  -d '{"email":"test@example.com","password":"password123","role":"user"}'
```

### Performance Testing
- Load testing with tools like Artillery or JMeter
- Database query performance monitoring
- Google Maps API usage tracking
- Memory and CPU usage monitoring

### Security Testing
- Input validation testing
- Authentication bypass attempts
- SQL injection testing (though Mongoose provides protection)
- XSS vulnerability testing
- Session security testing
