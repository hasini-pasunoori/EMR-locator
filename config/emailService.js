const nodemailer = require('nodemailer');

// Create transporter
const transporter = nodemailer.createTransport({
  service: 'gmail',
  host: 'smtp.gmail.com',
  port: 587,
  secure: false, // true for 465, false for other ports
  auth: {
    user: process.env.EMAIL_USER || 'test@gmail.com',
    pass: process.env.EMAIL_PASS || 'test-password'
  },
  tls: {
    rejectUnauthorized: false
  }
});

// Send welcome email
const sendWelcomeEmail = async (email, name) => {
  try {
    // Skip email sending if no email configuration
    if (!process.env.EMAIL_USER || process.env.EMAIL_USER === 'test@gmail.com') {
      console.log(`Welcome email would be sent to ${email} (email service not configured)`);
      return;
    }

    const mailOptions = {
      from: process.env.EMAIL_USER || 'noreply@emresource.com',
      to: email,
      subject: '🏥 Welcome to EMResource - Your Emergency Medical Network!',
      html: `
        <!DOCTYPE html>
        <html>
        <head>
          <style>
            body { font-family: 'Arial', sans-serif; line-height: 1.6; color: #333; }
            .container { max-width: 600px; margin: 0 auto; padding: 20px; }
            .header { background: linear-gradient(135deg, #e63946, #d32f2f); color: white; padding: 30px; text-align: center; border-radius: 10px 10px 0 0; }
            .content { background: #f8f9fa; padding: 30px; border-radius: 0 0 10px 10px; }
            .button { display: inline-block; background: #e63946; color: white; padding: 12px 30px; text-decoration: none; border-radius: 25px; margin: 20px 0; }
            .features { display: grid; grid-template-columns: 1fr 1fr; gap: 20px; margin: 20px 0; }
            .feature { background: white; padding: 20px; border-radius: 8px; text-align: center; }
            .icon { font-size: 2rem; margin-bottom: 10px; color: #e63946; }
          </style>
        </head>
        <body>
          <div class="container">
            <div class="header">
              <h1>🏥 Welcome to EMResource!</h1>
              <p>Your Emergency Medical Network is Ready</p>
            </div>
            
            <div class="content">
              <h2>Hello ${name}! 👋</h2>
              
              <p>Welcome to <strong>EMResource</strong> - the emergency medical directory that connects people with life-saving resources when every second counts.</p>
              
              <div class="features">
                <div class="feature">
                  <div class="icon">🏥</div>
                  <h3>Find Medical Facilities</h3>
                  <p>Locate nearby hospitals, clinics, and pharmacies instantly</p>
                </div>
                
                <div class="feature">
                  <div class="icon">🩸</div>
                  <h3>Blood Donor Network</h3>
                  <p>Connect with verified blood donors in your area</p>
                </div>
                
                <div class="feature">
                  <div class="icon">🚨</div>
                  <h3>Emergency Requests</h3>
                  <p>Create urgent requests for medical assistance</p>
                </div>
                
                <div class="feature">
                  <div class="icon">📍</div>
                  <h3>Location-Based Search</h3>
                  <p>Find resources near you with interactive maps</p>
                </div>
              </div>
              
              <h3>🚀 Get Started:</h3>
              <ul>
                <li><strong>Explore Resources:</strong> Use our resource finder to locate medical facilities</li>
                <li><strong>Join as Donor:</strong> Register as a blood donor to help save lives</li>
                <li><strong>Emergency Ready:</strong> Create emergency requests when you need help</li>
                <li><strong>Stay Connected:</strong> Keep your profile updated for better assistance</li>
              </ul>
              
              <div style="text-align: center; margin: 30px 0;">
                <a href="${process.env.CLIENT_URL || ''}/dashboard" class="button">
                  Go to Dashboard
                </a>
              </div>
              
              <div style="background: #e3f2fd; padding: 20px; border-radius: 8px; margin: 20px 0;">
                <h4>🆘 Emergency Tip:</h4>
                <p><strong>In a real emergency, always call 911 first!</strong> EMResource is designed to help you find additional resources and support during medical emergencies.</p>
              </div>
              
              <p>Thank you for joining our mission to make emergency medical care more accessible to everyone.</p>
              
              <p>Stay safe and healthy! ❤️<br>
              <strong>The EMResource Team</strong></p>
              
              <hr style="margin: 30px 0; border: none; border-top: 1px solid #ddd;">
              
              <p style="font-size: 12px; color: #666; text-align: center;">
                This email was sent to ${email}. If you didn't create an account with EMResource, please ignore this email.<br>
                <a href="${process.env.CLIENT_URL || ''}">EMResource</a> | Emergency Medical Resource Locator
              </p>
            </div>
          </div>
        </body>
        </html>
      `
    };

    await transporter.sendMail(mailOptions);
    console.log(`Welcome email sent to ${email}`);
  } catch (error) {
    console.error('Error sending welcome email:', error);
    throw error;
  }
};

// Send verification email
const sendVerificationEmail = async (email, name, token) => {
  try {
    // Skip email sending if no email configuration
    if (!process.env.EMAIL_USER || process.env.EMAIL_USER === 'test@gmail.com') {
      console.log(`Verification email would be sent to ${email} (email service not configured)`);
      return;
    }

    const verificationUrl = `${process.env.CLIENT_URL || 'http://localhost:3000'}/auth/verify-email?token=${token}`;
    
    const mailOptions = {
      from: process.env.EMAIL_USER || 'noreply@emresource.com',
      to: email,
      subject: '📧 Verify Your EMResource Account',
      html: `
        <!DOCTYPE html>
        <html>
        <head>
          <style>
            body { font-family: 'Arial', sans-serif; line-height: 1.6; color: #333; }
            .container { max-width: 600px; margin: 0 auto; padding: 20px; }
            .header { background: linear-gradient(135deg, #457b9d, #1976d2); color: white; padding: 30px; text-align: center; border-radius: 10px 10px 0 0; }
            .content { background: #f8f9fa; padding: 30px; border-radius: 0 0 10px 10px; }
            .button { display: inline-block; background: #e63946; color: white; padding: 15px 30px; text-decoration: none; border-radius: 25px; margin: 20px 0; font-weight: bold; }
            .code { background: #fff; padding: 15px; border-radius: 8px; font-family: monospace; font-size: 18px; text-align: center; margin: 20px 0; border: 2px dashed #e63946; }
          </style>
        </head>
        <body>
          <div class="container">
            <div class="header">
              <h1>📧 Verify Your Email</h1>
              <p>Complete Your EMResource Registration</p>
            </div>
            
            <div class="content">
              <h2>Hello ${name}!</h2>
              
              <p>Thank you for signing up for <strong>EMResource</strong>! To complete your registration and access all features, please verify your email address.</p>
              
              <div style="text-align: center; margin: 30px 0;">
                <a href="${verificationUrl}" class="button">
                  Verify Email Address
                </a>
              </div>
              
              <p>Or copy and paste this link into your browser:</p>
              <div class="code">${verificationUrl}</div>
              
              <div style="background: #fff3cd; padding: 15px; border-radius: 8px; margin: 20px 0; border-left: 4px solid #ffc107;">
                <p><strong>⏰ This verification link will expire in 24 hours.</strong></p>
              </div>
              
              <p>Once verified, you'll be able to:</p>
              <ul>
                <li>🏥 Find medical facilities near you</li>
                <li>🩸 Register as a blood donor</li>
                <li>🚨 Create emergency medical requests</li>
                <li>📱 Access your personalized dashboard</li>
              </ul>
              
              <p>If you didn't create this account, please ignore this email.</p>
              
              <p>Best regards,<br>
              <strong>The EMResource Team</strong></p>
              
              <hr style="margin: 30px 0; border: none; border-top: 1px solid #ddd;">
              
              <p style="font-size: 12px; color: #666; text-align: center;">
                This email was sent to ${email}.<br>
                <a href="${process.env.CLIENT_URL || 'http://localhost:3000'}">EMResource</a> | Emergency Medical Resource Locator
              </p>
            </div>
          </div>
        </body>
        </html>
      `
    };

    await transporter.sendMail(mailOptions);
    console.log(`Verification email sent to ${email}`);
  } catch (error) {
    console.error('Error sending verification email:', error);
    throw error;
  }
};

// Send emergency notification email
const sendEmergencyNotification = async (email, name, requestDetails) => {
  try {
    const mailOptions = {
      from: process.env.EMAIL_USER || 'noreply@emresource.com',
      to: email,
      subject: `🚨 URGENT: Emergency Medical Request - ${requestDetails.type.toUpperCase()}`,
      html: `
        <!DOCTYPE html>
        <html>
        <head>
          <style>
            body { font-family: 'Arial', sans-serif; line-height: 1.6; color: #333; }
            .container { max-width: 600px; margin: 0 auto; padding: 20px; }
            .header { background: linear-gradient(135deg, #e63946, #d32f2f); color: white; padding: 30px; text-align: center; border-radius: 10px 10px 0 0; }
            .content { background: #f8f9fa; padding: 30px; border-radius: 0 0 10px 10px; }
            .urgent { background: #ffebee; border: 2px solid #e63946; padding: 20px; border-radius: 8px; margin: 20px 0; }
            .button { display: inline-block; background: #e63946; color: white; padding: 15px 30px; text-decoration: none; border-radius: 25px; margin: 20px 0; font-weight: bold; }
            .details { background: white; padding: 20px; border-radius: 8px; margin: 20px 0; }
          </style>
        </head>
        <body>
          <div class="container">
            <div class="header">
              <h1>🚨 EMERGENCY REQUEST</h1>
              <p>Immediate Medical Assistance Needed</p>
            </div>
            
            <div class="content">
              <div class="urgent">
                <h2>🆘 ${requestDetails.title}</h2>
                <p><strong>Urgency:</strong> ${requestDetails.urgency.toUpperCase()}</p>
                <p><strong>Type:</strong> ${requestDetails.type.toUpperCase()}</p>
              </div>
              
              <p>Hello ${name},</p>
              
              <p>An emergency medical request has been created in your area that matches your profile. Your help could save a life!</p>
              
              <div class="details">
                <h3>Request Details:</h3>
                <p><strong>Description:</strong> ${requestDetails.description}</p>
                <p><strong>Location:</strong> ${requestDetails.address.city}, ${requestDetails.address.state}</p>
                <p><strong>Contact:</strong> ${requestDetails.contact.primaryPhone}</p>
                ${requestDetails.requirements.bloodType ? `<p><strong>Blood Type Needed:</strong> ${requestDetails.requirements.bloodType}</p>` : ''}
              </div>
              
              <div style="text-align: center; margin: 30px 0;">
                <a href="${process.env.CLIENT_URL || 'http://localhost:3000'}/dashboard" class="button">
                  Respond to Request
                </a>
              </div>
              
              <div style="background: #e3f2fd; padding: 15px; border-radius: 8px; margin: 20px 0;">
                <p><strong>⚠️ Important:</strong> Please respond only if you can genuinely help. In life-threatening emergencies, always call 911 first.</p>
              </div>
              
              <p>Thank you for being part of our life-saving network.</p>
              
              <p>Emergency Response Team<br>
              <strong>EMResource</strong></p>
            </div>
          </div>
        </body>
        </html>
      `
    };

    await transporter.sendMail(mailOptions);
    console.log(`Emergency notification sent to ${email}`);
  } catch (error) {
    console.error('Error sending emergency notification:', error);
    throw error;
  }
};

// Send data export email
const sendDataExportEmail = async (email, name, filePath, filename, format) => {
  try {
    const mailOptions = {
      from: process.env.EMAIL_USER || 'noreply@emresource.com',
      to: email,
      subject: '📊 EMResource - Your Data Export is Ready',
      html: `
        <!DOCTYPE html>
        <html>
        <head>
          <style>
            body { font-family: 'Arial', sans-serif; line-height: 1.6; color: #333; }
            .container { max-width: 600px; margin: 0 auto; padding: 20px; }
            .header { background: linear-gradient(135deg, #e63946, #d32f2f); color: white; padding: 30px; text-align: center; border-radius: 10px 10px 0 0; }
            .content { background: #f8f9fa; padding: 30px; border-radius: 0 0 10px 10px; }
            .export-details { background: white; padding: 20px; border-radius: 8px; margin: 20px 0; }
            .security-notice { background: #fff3cd; padding: 15px; border-radius: 8px; margin: 20px 0; border-left: 4px solid #ffc107; }
          </style>
        </head>
        <body>
          <div class="container">
            <div class="header">
              <h1>📊 Your Data Export is Ready</h1>
              <p>EMResource Data Export Service</p>
            </div>
            
            <div class="content">
              <h2>Hello ${name}!</h2>
              
              <p>Your requested data export from <strong>EMResource</strong> has been completed successfully and is attached to this email.</p>
              
              <div class="export-details">
                <h3>📋 Export Details:</h3>
                <ul>
                  <li><strong>Format:</strong> ${format.toUpperCase()}</li>
                  <li><strong>Generated:</strong> ${new Date().toLocaleString()}</li>
                  <li><strong>Filename:</strong> ${filename}.${format}</li>
                  <li><strong>File Size:</strong> Available in attachment</li>
                </ul>
              </div>
              
              <div class="security-notice">
                <h4>🔒 Security & Privacy Notice:</h4>
                <ul>
                  <li>This file contains your personal information - handle with care</li>
                  <li>Store the file securely and delete when no longer needed</li>
                  <li>Do not share this file with unauthorized persons</li>
                  <li>The download link expires after 24 hours for security</li>
                </ul>
              </div>
              
              <h3>📁 What's Included:</h3>
              <ul>
                <li>🏥 Your profile information and account details</li>
                <li>🩸 Blood donor registration data (if applicable)</li>
                <li>🚨 Emergency requests you've created</li>
                <li>💬 Your responses to emergency requests</li>
                <li>📊 Account activity and usage statistics</li>
              </ul>
              
              <p>If you have any questions about your data export or need assistance, please contact our support team.</p>
              
              <p>Thank you for using EMResource!</p>
              
              <p>Best regards,<br>
              <strong>The EMResource Team</strong></p>
              
              <hr style="margin: 30px 0; border: none; border-top: 1px solid #ddd;">
              
              <p style="font-size: 12px; color: #666; text-align: center;">
                This email was sent to ${email}. If you did not request this data export, please contact our support team immediately.<br>
                <a href="${process.env.CLIENT_URL || 'http://localhost:3000'}">EMResource</a> | Emergency Medical Resource Locator
              </p>
            </div>
          </div>
        </body>
        </html>
      `,
      attachments: [
        {
          filename: `${filename}.${format}`,
          path: filePath
        }
      ]
    };

    await transporter.sendMail(mailOptions);
    console.log(`Data export email sent to ${email}`);
  } catch (error) {
    console.error('Error sending data export email:', error);
    throw error;
  }
};

// Send OTP email
const sendOTPEmail = async (email, otp, type) => {
  try {
    const mailOptions = {
      from: process.env.EMAIL_USER || 'noreply@emresource.com',
      to: email,
      subject: `🔐 EMResource - Your ${type === 'signin' ? 'Login' : 'Signup'} OTP`,
      html: `
        <!DOCTYPE html>
        <html>
        <head>
          <style>
            body { font-family: 'Arial', sans-serif; line-height: 1.6; color: #333; }
            .container { max-width: 600px; margin: 0 auto; padding: 20px; }
            .header { background: linear-gradient(135deg, #e63946, #d32f2f); color: white; padding: 30px; text-align: center; border-radius: 10px 10px 0 0; }
            .content { background: #f8f9fa; padding: 30px; border-radius: 0 0 10px 10px; }
            .otp-code { background: white; padding: 20px; border-radius: 8px; margin: 20px 0; text-align: center; border: 2px solid #e63946; }
            .security-notice { background: #fff3cd; padding: 15px; border-radius: 8px; margin: 20px 0; border-left: 4px solid #ffc107; }
          </style>
        </head>
        <body>
          <div class="container">
            <div class="header">
              <h1>🔐 Your ${type === 'signin' ? 'Login' : 'Signup'} OTP</h1>
              <p>EMResource Security Code</p>
            </div>
            
            <div class="content">
              <p>Your One-Time Password (OTP) for EMResource ${type} is:</p>
              
              <div class="otp-code">
                <h1 style="color: #e63946; font-size: 2.5rem; margin: 0; letter-spacing: 0.2em;">${otp}</h1>
              </div>
              
              <div class="security-notice">
                <h4>🔒 Security Information:</h4>
                <ul>
                  <li>This OTP is valid for 10 minutes only</li>
                  <li>Do not share this code with anyone</li>
                  <li>If you didn't request this, please ignore this email</li>
                </ul>
              </div>
              
              <p>Enter this code on the EMResource ${type} page to continue.</p>
              
              <p>Best regards,<br>
              <strong>The EMResource Team</strong></p>
              
              <hr style="margin: 30px 0; border: none; border-top: 1px solid #ddd;">
              
              <p style="font-size: 12px; color: #666; text-align: center;">
                This email was sent to ${email}.<br>
                <a href="${process.env.CLIENT_URL || 'http://localhost:3000'}">EMResource</a> | Emergency Medical Resource Locator
              </p>
            </div>
          </div>
        </body>
        </html>
      `
    };

    await transporter.sendMail(mailOptions);
    console.log(`${type} OTP email sent successfully to: ${email}`);
  } catch (error) {
    console.error('Error sending OTP email:', error);
    throw error;
  }
};

module.exports = {
  sendWelcomeEmail,
  sendVerificationEmail,
  sendEmergencyNotification,
  sendDataExportEmail,
  sendOTPEmail
};