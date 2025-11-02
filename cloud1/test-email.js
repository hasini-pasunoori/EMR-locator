require('dotenv').config();
const nodemailer = require('nodemailer');

// Test Gmail connection
async function testGmailConnection() {
  console.log('🧪 Testing Gmail SMTP connection...');
  console.log('Email:', process.env.EMAIL_USER);
  console.log('Password length:', process.env.EMAIL_PASS ? process.env.EMAIL_PASS.length : 'Not set');
  
  const transporter = nodemailer.createTransport({
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

  try {
    // Verify connection
    await transporter.verify();
    console.log('✅ Gmail SMTP connection successful!');
    
    // Send test email
    const info = await transporter.sendMail({
      from: process.env.EMAIL_USER,
      to: process.env.EMAIL_USER, // Send to yourself
      subject: '🧪 EMResource Email Test',
      html: `
        <h2>✅ Email Test Successful!</h2>
        <p>Your EMResource email service is working correctly.</p>
        <p><strong>Timestamp:</strong> ${new Date().toISOString()}</p>
      `
    });
    
    console.log('✅ Test email sent successfully!');
    console.log('Message ID:', info.messageId);
    
  } catch (error) {
    console.error('❌ Email test failed:', error.message);
    
    if (error.code === 'EAUTH') {
      console.log('\n🔧 Troubleshooting steps:');
      console.log('1. Verify 2-Factor Authentication is enabled');
      console.log('2. Generate a new App Password');
      console.log('3. Check email and password in .env file');
      console.log('4. Visit: https://myaccount.google.com/apppasswords');
    }
  }
}

// Run the test
testGmailConnection();