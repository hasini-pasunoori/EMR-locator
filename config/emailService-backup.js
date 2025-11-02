const nodemailer = require('nodemailer');

// Alternative email configuration using Ethereal (for testing)
const createTestTransporter = async () => {
  try {
    // Create test account
    const testAccount = await nodemailer.createTestAccount();
    
    return nodemailer.createTransport({
      host: 'smtp.ethereal.email',
      port: 587,
      secure: false,
      auth: {
        user: testAccount.user,
        pass: testAccount.pass,
      },
    });
  } catch (error) {
    console.error('Error creating test transporter:', error);
    return null;
  }
};

// Gmail transporter (your current setup)
const createGmailTransporter = () => {
  return nodemailer.createTransport({
    service: 'gmail',
    host: 'smtp.gmail.com',
    port: 587,
    secure: false,
    auth: {
      user: process.env.EMAIL_USER,
      pass: process.env.EMAIL_PASS
    },
    tls: {
      rejectUnauthorized: false
    }
  });
};

// Test email function
const testEmailConnection = async () => {
  try {
    const transporter = createGmailTransporter();
    await transporter.verify();
    console.log('✅ Gmail SMTP connection successful!');
    return true;
  } catch (error) {
    console.error('❌ Gmail SMTP connection failed:', error.message);
    return false;
  }
};

module.exports = {
  createGmailTransporter,
  createTestTransporter,
  testEmailConnection
};