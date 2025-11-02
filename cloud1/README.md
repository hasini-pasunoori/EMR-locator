# EMResource - Emergency Medical Resource Locator

A comprehensive emergency medical directory platform that connects people with life-saving medical resources during emergencies. Built with Node.js, Express, MongoDB, and modern web technologies.

## 🚀 Features

### Core Functionality
- **Real-time Medical Resource Locator**: Find hospitals, pharmacies, blood banks, and oxygen suppliers near you
- **Blood Donor Network**: Connect with verified blood donors by blood type and location
- **Emergency Request System**: Create and respond to emergency medical requests
- **Interactive Maps**: Google Maps integration for location-based searches
- **User Authentication**: Secure login with Google OAuth and local authentication

### Key Features
- **Geospatial Search**: Find resources within specified radius using MongoDB geospatial queries
- **Real-time Updates**: Live availability status for medical facilities and donors
- **Emergency Alerts**: Urgent request notifications to nearby donors and facilities
- **Verification System**: Verified facilities and donors for trusted information
- **Privacy Controls**: Granular privacy settings for donor information
- **Mobile Responsive**: Fully responsive design for all devices

## 🛠 Technology Stack

### Backend
- **Node.js** - Runtime environment
- **Express.js** - Web framework
- **MongoDB** - Database with geospatial indexing
- **Mongoose** - ODM for MongoDB
- **Passport.js** - Authentication middleware
- **Express Session** - Session management

### Frontend
- **EJS** - Template engine
- **Bootstrap 5** - CSS framework
- **JavaScript ES6+** - Client-side scripting
- **Google Maps API** - Interactive maps and location services
- **Chart.js** - Data visualization
- **FontAwesome** - Icons

### APIs & Services
- **Google Maps Platform** - Maps, Places, Geocoding
- **Google OAuth 2.0** - Social authentication
- **Nodemailer** - Email services
- **MongoDB Atlas** - Cloud database

## 📋 Prerequisites

Before running this application, make sure you have:

- Node.js (v14 or higher)
- MongoDB Atlas account or local MongoDB installation
- Google Cloud Platform account for Maps API
- Git

## 🔧 Installation & Setup

### 1. Clone the Repository
```bash
git clone <repository-url>
cd emresource-auth
```

### 2. Install Dependencies
```bash
npm install
```

### 3. Environment Configuration
Create a `.env` file in the root directory:

```env
# Database
MONGODB_URI=your_mongodb_connection_string

# Authentication
SESSION_SECRET=your_session_secret_key
GOOGLE_CLIENT_ID=your_google_oauth_client_id
GOOGLE_CLIENT_SECRET=your_google_oauth_client_secret

# Google Maps API
GOOGLE_MAPS_API_KEY=your_google_maps_api_key

# Application Settings
NODE_ENV=development
PORT=3000
CLIENT_URL=http://localhost:3000

# Email Configuration (Optional)
EMAIL_USER=your_email@gmail.com
EMAIL_PASS=your_email_password
```

### 4. Database Setup

#### Option A: MongoDB Atlas (Recommended)
1. Create a MongoDB Atlas account at https://www.mongodb.com/atlas
2. Create a new cluster
3. Get your connection string and add it to `.env`

#### Option B: Local MongoDB
1. Install MongoDB locally
2. Start MongoDB service
3. Use local connection string: `mongodb://localhost:27017/emresource`

### 5. Google Cloud Platform Setup

1. Go to [Google Cloud Console](https://console.cloud.google.com/)
2. Create a new project or select existing one
3. Enable the following APIs:
   - Maps JavaScript API
   - Places API
   - Geocoding API
   - Directions API (optional)
4. Create credentials (API Key) and add to `.env`
5. Set up OAuth 2.0 credentials for Google Sign-In

### 6. Seed Sample Data (Optional)
```bash
node scripts/seedData.js
```

### 7. Start the Application
```bash
# Development mode
npm run dev

# Production mode
npm start
```

The application will be available at `http://localhost:3000`

## 📱 Usage

### For General Users
1. **Find Resources**: Use the resource finder to locate nearby medical facilities
2. **Emergency Requests**: Create emergency requests for immediate help
3. **View Maps**: Interactive maps show exact locations and directions

### For Blood Donors
1. **Register**: Complete the donor registration with medical information
2. **Set Availability**: Toggle availability status for emergency requests
3. **Respond to Requests**: Receive and respond to blood donation requests

### For Medical Facilities
1. **Add Facility**: Register your medical facility with services offered
2. **Update Resources**: Keep bed availability and resource status updated
3. **Verification**: Get verified for trusted status

## 🗂 Project Structure

```
emresource-auth/
├── config/
│   ├── passport.js          # Passport authentication config
│   └── gcp-apis.js         # GCP services configuration
├── models/
│   ├── User.js             # User model
│   ├── MedicalFacility.js  # Medical facility model
│   ├── BloodDonor.js       # Blood donor model
│   └── EmergencyRequest.js # Emergency request model
├── routes/
│   ├── auth.js             # Authentication routes
│   ├── facilities.js       # Medical facilities API
│   ├── donors.js           # Blood donors API
│   └── emergency.js        # Emergency requests API
├── views/
│   ├── index.ejs           # Landing page
│   ├── dashboard.ejs       # User dashboard
│   ├── resource.ejs        # Resource finder
│   └── donor.ejs           # Donor registration
├── public/
│   ├── css/               # Stylesheets
│   ├── js/                # Client-side JavaScript
│   └── images/            # Static images
├── scripts/
│   └── seedData.js        # Database seeder
├── server.js              # Main application file
└── package.json           # Dependencies and scripts
```

## 🔌 API Endpoints

### Authentication
- `POST /auth/register` - User registration
- `POST /auth/login` - User login
- `GET /auth/google` - Google OAuth login
- `GET /auth/logout` - User logout

### Medical Facilities
- `GET /api/facilities/nearby` - Find nearby facilities
- `GET /api/facilities` - Get all facilities with filters
- `POST /api/facilities` - Add new facility
- `PUT /api/facilities/:id` - Update facility

### Blood Donors
- `GET /api/donors/nearby` - Find nearby donors
- `POST /api/donors/register` - Register as donor
- `GET /api/donors/profile` - Get donor profile
- `PATCH /api/donors/availability` - Update availability

### Emergency Requests
- `POST /api/emergency/request` - Create emergency request
- `GET /api/emergency/nearby` - Find nearby requests
- `POST /api/emergency/:id/respond` - Respond to request
- `GET /api/emergency/stats/overview` - Get statistics

## 🚀 Deployment

### Heroku Deployment
1. Create Heroku app: `heroku create your-app-name`
2. Set environment variables: `heroku config:set MONGODB_URI=your_uri`
3. Deploy: `git push heroku main`

### Docker Deployment
```bash
# Build image
docker build -t emresource .

# Run container
docker run -p 3000:3000 --env-file .env emresource
```

## 🧪 Testing

```bash
# Run tests
npm test

# Run with coverage
npm run test:coverage
```

## 🤝 Contributing

1. Fork the repository
2. Create feature branch: `git checkout -b feature/new-feature`
3. Commit changes: `git commit -am 'Add new feature'`
4. Push to branch: `git push origin feature/new-feature`
5. Submit pull request

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 🆘 Support

For support and questions:
- Create an issue on GitHub
- Email: support@emresource.com
- Documentation: [Wiki](https://github.com/your-repo/wiki)

## 🙏 Acknowledgments

- Google Maps Platform for location services
- MongoDB for geospatial database capabilities
- Bootstrap for responsive UI components
- FontAwesome for icons
- Chart.js for data visualization

## 🔮 Future Enhancements

- [ ] Real-time chat between donors and requesters
- [ ] Push notifications for emergency alerts
- [ ] AI-powered triage system
- [ ] Mobile app (React Native)
- [ ] Multi-language support
- [ ] Integration with hospital management systems
- [ ] Telemedicine consultation features
- [ ] Advanced analytics dashboard
- [ ] SMS notifications via Twilio
- [ ] Payment integration for services

---

**EMResource** - Connecting people with life-saving medical resources when every second counts. 🏥❤️