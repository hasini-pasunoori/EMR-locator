const express = require('express');
const passport = require('passport');
const { body, validationResult } = require('express-validator');
const crypto = require('crypto');
const User = require('../models/User');
const OTP = require('../models/OTP');
const { sendWelcomeEmail, sendOTPEmail } = require('../config/emailService');

const router = express.Router();

// Generate OTP for signup
router.post('/signup/send-otp', [
  body('name').trim().isLength({ min: 2 }).withMessage('Name must be at least 2 characters'),
  body('email').isEmail().normalizeEmail().withMessage('Please provide a valid email'),
  body('password').isLength({ min: 6 }).withMessage('Password must be at least 6 characters')
], async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({
        success: false,
        message: 'Validation errors',
        errors: errors.array()
      });
    }

    const { name, email, password, role } = req.body;

    // Check if user already exists
    const existingUser = await User.findOne({ email: email.toLowerCase() });
    if (existingUser) {
      return res.status(400).json({
        success: false,
        message: 'User already exists with this email'
      });
    }

    // Generate 6-digit OTP
    const otp = Math.floor(100000 + Math.random() * 900000).toString();

    // Delete any existing OTP for this email
    await OTP.deleteMany({ email: email.toLowerCase(), type: 'signup' });

    // Save OTP
    const otpDoc = new OTP({
      email: email.toLowerCase(),
      otp,
      type: 'signup'
    });
    await otpDoc.save();

    // Store user data in session temporarily
    req.session.pendingUser = { name, email: email.toLowerCase(), password, role: role || 'user' };

    // Send OTP email
    await sendOTPEmail(email.toLowerCase(), otp, 'signup');

    res.json({
      success: true,
      message: 'OTP sent to your email. Please verify to complete registration.'
    });

  } catch (error) {
    console.error('Signup OTP error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error during signup'
    });
  }
});

// Verify OTP and complete signup
router.post('/signup/verify-otp', [
  body('otp').isLength({ min: 6, max: 6 }).withMessage('OTP must be 6 digits')
], async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({
        success: false,
        message: 'Invalid OTP format'
      });
    }

    const { otp } = req.body;
    const pendingUser = req.session.pendingUser;

    if (!pendingUser) {
      return res.status(400).json({
        success: false,
        message: 'No pending registration found. Please start signup again.'
      });
    }

    // Verify OTP
    const otpDoc = await OTP.findOne({ 
      email: pendingUser.email, 
      otp, 
      type: 'signup' 
    });

    if (!otpDoc) {
      return res.status(400).json({
        success: false,
        message: 'Invalid or expired OTP'
      });
    }

    // Create user
    const user = new User({
      name: pendingUser.name,
      email: pendingUser.email,
      password: pendingUser.password,
      role: pendingUser.role || 'user',
      isVerified: true
    });

    await user.save();

    // Delete OTP and pending user data
    await OTP.deleteOne({ _id: otpDoc._id });
    delete req.session.pendingUser;

    // Log in the user
    req.logIn(user, (err) => {
      if (err) {
        return res.status(500).json({
          success: false,
          message: 'Account created but login failed'
        });
      }

      // Send welcome email
      sendWelcomeEmail(user.email, user.name).catch(err => 
        console.error('Failed to send welcome email:', err)
      );

      let redirectUrl = '/dashboard';
      if (user.role === 'admin') {
        redirectUrl = '/admin/dashboard';
      } else if (user.role === 'hospital') {
        redirectUrl = '/hospital/dashboard';
      } else if (user.role === 'donor') {
        redirectUrl = '/donor/dashboard';
      }

      res.status(201).json({
        success: true,
        message: 'Account created successfully! Welcome to EMResource!',
        redirect: redirectUrl,
        user: {
          id: user._id,
          name: user.name,
          email: user.email,
          role: user.role,
          isVerified: user.isVerified
        }
      });
    });

  } catch (error) {
    console.error('Signup verify OTP error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error during verification'
    });
  }
});

// Generate OTP for signin
router.post('/signin/send-otp', [
  body('email').isEmail().normalizeEmail().withMessage('Please provide a valid email'),
  body('password').notEmpty().withMessage('Password is required')
], async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({
        success: false,
        message: 'Validation errors',
        errors: errors.array()
      });
    }

    const { email, password, role } = req.body;

    // Find user and verify password and role
    const user = await User.findOne({ email: email.toLowerCase() });
    if (!user || !(await user.comparePassword(password))) {
      return res.status(401).json({
        success: false,
        message: 'Invalid email or password'
      });
    }

    // Verify role matches
    if (user.role !== role) {
      return res.status(401).json({
        success: false,
        message: `Access denied. This account is registered as '${user.role}', not '${role}'.`
      });
    }

    // Generate 6-digit OTP
    const otp = Math.floor(100000 + Math.random() * 900000).toString();

    // Delete any existing OTP for this email
    await OTP.deleteMany({ email: email.toLowerCase(), type: 'signin' });

    // Save OTP
    const otpDoc = new OTP({
      email: email.toLowerCase(),
      otp,
      type: 'signin'
    });
    await otpDoc.save();

    // Store user ID in session temporarily
    req.session.pendingSignin = { userId: user._id };

    // Send OTP email
    await sendOTPEmail(email.toLowerCase(), otp, 'signin');

    res.json({
      success: true,
      message: 'OTP sent to your email. Please verify to complete login.'
    });

  } catch (error) {
    console.error('Signin OTP error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error during signin'
    });
  }
});

// Verify OTP and complete signin
router.post('/signin/verify-otp', [
  body('otp').isLength({ min: 6, max: 6 }).withMessage('OTP must be 6 digits')
], async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({
        success: false,
        message: 'Invalid OTP format'
      });
    }

    const { otp } = req.body;
    const pendingSignin = req.session.pendingSignin;

    if (!pendingSignin) {
      return res.status(400).json({
        success: false,
        message: 'No pending signin found. Please start signin again.'
      });
    }

    const user = await User.findById(pendingSignin.userId);
    if (!user) {
      return res.status(400).json({
        success: false,
        message: 'User not found'
      });
    }

    // Verify OTP
    const otpDoc = await OTP.findOne({ 
      email: user.email, 
      otp, 
      type: 'signin' 
    });

    if (!otpDoc) {
      return res.status(400).json({
        success: false,
        message: 'Invalid or expired OTP'
      });
    }

    // Delete OTP and pending signin data
    await OTP.deleteOne({ _id: otpDoc._id });
    delete req.session.pendingSignin;

    // Log in the user
    req.logIn(user, (err) => {
      if (err) {
        return res.status(500).json({
          success: false,
          message: 'Error logging in user'
        });
      }

      let redirectUrl = '/dashboard';
      if (user.role === 'admin') {
        redirectUrl = '/admin/dashboard';
      } else if (user.role === 'hospital') {
        redirectUrl = '/hospital/dashboard';
      } else if (user.role === 'donor') {
        redirectUrl = '/donor/dashboard';
      }

      res.json({
        success: true,
        message: 'Signed in successfully',
        redirect: redirectUrl,
        user: {
          id: user._id,
          name: user.name,
          email: user.email,
          role: user.role,
          isVerified: user.isVerified
        }
      });
    });

  } catch (error) {
    console.error('Signin verify OTP error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error during verification'
    });
  }
});

// Email verification route
router.get('/verify-email', async (req, res) => {
  try {
    const { token } = req.query;

    if (!token) {
      return res.status(400).json({
        success: false,
        message: 'Verification token is required'
      });
    }

    const user = await User.findOne({ emailVerificationToken: token });

    if (!user) {
      return res.status(400).json({
        success: false,
        message: 'Invalid or expired verification token'
      });
    }

    user.isEmailVerified = true;
    user.emailVerificationToken = undefined;
    await user.save();

    // Send welcome email after verification
    sendWelcomeEmail(user.email, user.name).catch(err => 
      console.error('Failed to send welcome email:', err)
    );

    res.json({
      success: true,
      message: 'Email verified successfully! Welcome to EmResource!'
    });

  } catch (error) {
    console.error('Email verification error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error during email verification'
    });
  }
});

// Google OAuth routes (only if configured)
router.get('/google', (req, res, next) => {
  if (!process.env.GOOGLE_CLIENT_ID || !process.env.GOOGLE_CLIENT_SECRET) {
    return res.status(400).json({
      success: false,
      message: 'Google OAuth is not configured'
    });
  }
  passport.authenticate('google', { scope: ['profile', 'email'] })(req, res, next);
});

router.get('/google/callback', (req, res, next) => {
  if (!process.env.GOOGLE_CLIENT_ID || !process.env.GOOGLE_CLIENT_SECRET) {
    return res.redirect('/?error=oauth_not_configured');
  }
  passport.authenticate('google', { failureRedirect: '/login' })(req, res, next);
}, (req, res) => {
  res.redirect('/dashboard');
});

// Logout route (POST)
router.post('/logout', (req, res) => {
  req.logout((err) => {
    if (err) {
      return res.status(500).json({
        success: false,
        message: 'Error logging out'
      });
    }
    res.json({
      success: true,
      message: 'Logged out successfully'
    });
  });
});

// Logout route (GET) - for direct navigation
router.get('/logout', (req, res) => {
  req.logout((err) => {
    if (err) {
      console.error('Logout error:', err);
    }
    req.session.destroy((err) => {
      if (err) {
        console.error('Session destroy error:', err);
      }
      res.clearCookie('emresource.sid');
      res.redirect('/');
    });
  });
});

// Get current user
router.get('/me', (req, res) => {
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

module.exports = router;