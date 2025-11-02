require('dotenv').config();
const express = require('express');
const mongoose = require('mongoose');
const passport = require('passport');
const session = require('express-session');
const cors = require('cors');
const path = require('path');

const app = express();

// Set EJS as template engine
app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'views'));

// Passport config
require('./config/passport')(passport);

// Import routes
const authRoutes = require('./routes/auth');
const facilitiesRoutes = require('./routes/facilities');
const donorsRoutes = require('./routes/donors');
const emergencyRoutes = require('./routes/emergency');
const userRoutes = require('./routes/user');
const adminRoutes = require('./routes/admin');

// MongoDB Atlas connection
mongoose.connect(process.env.MONGODB_URI, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
})
.then(() => {
  console.log('Connected to MongoDB Atlas successfully');
})
.catch((error) => {
  console.error('MongoDB Atlas connection error:', error);
  process.exit(1);
});

// MongoDB connection event listeners
mongoose.connection.on('connected', () => {
  console.log('Mongoose connected to MongoDB Atlas');
});

mongoose.connection.on('error', (err) => {
  console.error('Mongoose connection error:', err);
});

mongoose.connection.on('disconnected', () => {
  console.log('Mongoose disconnected from MongoDB Atlas');
});

// Middleware
app.use(cors({
  origin: process.env.CLIENT_URL || 'http://localhost:3000',
  credentials: true
}));

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use(session({
  secret: process.env.SESSION_SECRET || 'emergency-medical-resource-secret-key',
  resave: false,
  saveUninitialized: false,
  name: 'emresource.sid',
  cookie: {
    secure: process.env.NODE_ENV === 'production',
    httpOnly: true,
    maxAge: 24 * 60 * 60 * 1000, // 24 hours
    sameSite: 'lax'
  }
}));

app.use(passport.initialize());
app.use(passport.session());

// Serve static files
app.use(express.static(path.join(__dirname, 'public')));

// Routes
app.use('/auth', authRoutes);
app.use('/api/facilities', facilitiesRoutes);
app.use('/api/donors', donorsRoutes);
app.use('/api/emergency', emergencyRoutes);
app.use('/api/user', userRoutes);
app.use('/api/beds', require('./routes/beds'));
app.use('/api/chat', require('./routes/chat'));
app.use('/api/sos', require('./routes/sos'));
app.use('/api/admin', adminRoutes);

// Role-based dashboard routes
app.use('/admin', require('./routes/admin'));
app.use('/hospital', require('./routes/hospital'));
app.use('/api/hospital', require('./routes/hospital'));
app.use('/donor', require('./routes/donor'));
app.use('/api/donor', require('./routes/donor'));

// Serve EJS templates
app.get('/', (req, res) => {
  res.render('index', { 
    user: req.user || null,
    title: 'EMResource - Emergency Medical Resource Locator'
  });
});

app.get('/dashboard', (req, res) => {
  if (req.isAuthenticated()) {
    res.render('dashboard', { 
      user: req.user,
      title: 'Dashboard - EMResource'
    });
  } else {
    res.redirect('/');
  }
});

app.get('/login', (req, res) => {
  res.render('index', { 
    user: req.user || null,
    title: 'Login - EMResource'
  });
});

app.get('/donor', (req, res) => {
  res.render('donor', { 
    user: req.user || null,
    title: 'Donor Registration - EMResource'
  });
});

app.get('/resource', (req, res) => {
  res.render('resource', { 
    user: req.user || null,
    title: 'Find Resources - EMResource'
  });
});

app.get('/settings', (req, res) => {
  if (req.isAuthenticated()) {
    res.render('settings', { 
      user: req.user,
      title: 'Settings - EMResource'
    });
  } else {
    res.redirect('/');
  }
});

app.get('/verify-otp', (req, res) => {
  res.render('otp-verification', { 
    title: 'OTP Verification - EMResource'
  });
});

// Separate pages for dashboard sections
app.get('/requests', (req, res) => {
  if (req.isAuthenticated()) {
    res.render('requests', { 
      user: req.user,
      title: 'My Requests - EMResource'
    });
  } else {
    res.redirect('/');
  }
});

app.get('/analytics', (req, res) => {
  if (req.isAuthenticated()) {
    res.render('analytics', { 
      user: req.user,
      title: 'Analytics - EMResource'
    });
  } else {
    res.redirect('/');
  }
});

app.get('/responses', (req, res) => {
  if (req.isAuthenticated()) {
    res.render('responses', { 
      user: req.user,
      title: 'My Responses - EMResource'
    });
  } else {
    res.redirect('/');
  }
});

app.get('/admin', (req, res) => {
  if (req.isAuthenticated() && req.user.role === 'admin') {
    res.render('admin', { 
      user: req.user,
      title: 'Admin Dashboard - EMResource'
    });
  } else {
    res.redirect('/');
  }
});

app.get('/beds', (req, res) => {
  res.render('beds', { 
    user: req.user || null,
    title: 'Bed Availability - EMResource'
  });
});

app.get('/chat', (req, res) => {
  if (req.isAuthenticated()) {
    res.render('chat', { 
      user: req.user,
      title: 'Messages - EMResource'
    });
  } else {
    res.redirect('/');
  }
});

app.get('/emergency-contacts', (req, res) => {
  if (req.isAuthenticated()) {
    res.render('emergency-contacts', { 
      user: req.user,
      title: 'Emergency Contacts - EMResource'
    });
  } else {
    res.redirect('/');
  }
});

// API route to get user data
app.get('/api/user', (req, res) => {
  if (req.isAuthenticated()) {
    res.json({
      success: true,
      user: {
        id: req.user._id,
        name: req.user.name,
        email: req.user.email,
        isEmailVerified: req.user.isEmailVerified,
        picture: req.user.picture,
        authMethod: req.user.authMethod
      }
    });
  } else {
    res.status(401).json({
      success: false,
      message: 'Not authenticated'
    });
  }
});

app.listen(process.env.PORT, () => {
  console.log(`Server running on port ${process.env.PORT}`);
});