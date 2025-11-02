const express = require('express');
const router = express.Router();
const multer = require('multer');
const path = require('path');
const fs = require('fs');
const XLSX = require('xlsx');
const { Parser } = require('json2csv');
const PDFDocument = require('pdfkit');
const User = require('../models/User');
const BloodDonor = require('../models/BloodDonor');
const EmergencyRequest = require('../models/EmergencyRequest');
const { sendDataExportEmail } = require('../config/emailService');

// Authentication middleware
const requireAuth = (req, res, next) => {
  if (req.isAuthenticated()) {
    return next();
  }
  res.status(401).json({ success: false, message: 'Authentication required' });
};

// Configure multer for profile picture upload
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, 'public/uploads/profiles/');
  },
  filename: function (req, file, cb) {
    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
    cb(null, 'profile-' + uniqueSuffix + path.extname(file.originalname));
  }
});

const upload = multer({
  storage: storage,
  limits: { fileSize: 5 * 1024 * 1024 }, // 5MB limit
  fileFilter: function (req, file, cb) {
    if (file.mimetype.startsWith('image/')) {
      cb(null, true);
    } else {
      cb(new Error('Only image files are allowed!'), false);
    }
  }
});

// Update user profile
router.put('/profile', requireAuth, async (req, res) => {
  try {
    const { name, phone, address } = req.body;
    
    const updatedUser = await User.findByIdAndUpdate(
      req.user._id,
      { name, phone, address },
      { new: true, runValidators: true }
    ).select('-password');

    res.json({
      success: true,
      message: 'Profile updated successfully',
      data: updatedUser
    });
  } catch (error) {
    console.error('Error updating profile:', error);
    res.status(500).json({ success: false, message: 'Server error' });
  }
});

// Change password
router.put('/change-password', requireAuth, async (req, res) => {
  try {
    const { currentPassword, newPassword } = req.body;

    const user = await User.findById(req.user._id);
    
    if (!user.password) {
      return res.status(400).json({ 
        success: false, 
        message: 'Cannot change password for Google OAuth accounts' 
      });
    }

    const isCurrentPasswordValid = await user.comparePassword(currentPassword);
    if (!isCurrentPasswordValid) {
      return res.status(400).json({ 
        success: false, 
        message: 'Current password is incorrect' 
      });
    }

    user.password = newPassword;
    await user.save();

    res.json({
      success: true,
      message: 'Password changed successfully'
    });
  } catch (error) {
    console.error('Error changing password:', error);
    res.status(500).json({ success: false, message: 'Server error' });
  }
});

// Upload profile picture
router.post('/profile-picture', requireAuth, upload.single('profilePicture'), async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({ success: false, message: 'No file uploaded' });
    }

    const profilePictureUrl = `/uploads/profiles/${req.file.filename}`;
    
    const updatedUser = await User.findByIdAndUpdate(
      req.user._id,
      { profilePicture: profilePictureUrl },
      { new: true }
    ).select('-password');

    res.json({
      success: true,
      message: 'Profile picture updated successfully',
      data: { profilePicture: profilePictureUrl }
    });
  } catch (error) {
    console.error('Error uploading profile picture:', error);
    res.status(500).json({ success: false, message: 'Server error' });
  }
});

// Get user profile
router.get('/profile', requireAuth, async (req, res) => {
  try {
    const user = await User.findById(req.user._id).select('-password');
    
    res.json({
      success: true,
      data: user
    });
  } catch (error) {
    console.error('Error fetching profile:', error);
    res.status(500).json({ success: false, message: 'Server error' });
  }
});

// Export user data
router.post('/export-data', requireAuth, async (req, res) => {
  try {
    console.log('Full request body:', JSON.stringify(req.body, null, 2));
    const { format, dataTypes } = req.body;
    console.log('Extracted format:', format, 'type:', typeof format);
    console.log('Extracted dataTypes:', dataTypes);
    
    const userId = req.user._id;
    const userEmail = req.user.email;
    const userName = req.user.name;
    
    // Collect user data based on selected types
    const exportData = {};
    
    if (dataTypes.profile) {
      const user = await User.findById(userId).select('-password');
      exportData.profile = {
        name: user.name,
        email: user.email,
        phone: user.phone,
        address: user.address,
        role: user.role,
        isVerified: user.isVerified,
        createdAt: user.createdAt,
        updatedAt: user.updatedAt
      };
    }
    
    if (dataTypes.donor) {
      const donor = await BloodDonor.findOne({ user: userId });
      if (donor) {
        exportData.donorInfo = {
          bloodType: donor.bloodType,
          location: donor.location,
          address: donor.address,
          medicalInfo: donor.medicalInfo,
          availability: donor.availability,
          contact: donor.contact,
          emergencyContact: donor.emergencyContact,
          privacy: donor.privacy,
          isVerified: donor.isVerified,
          status: donor.status,
          createdAt: donor.createdAt
        };
      }
    }
    
    if (dataTypes.requests) {
      const requests = await EmergencyRequest.find({ requester: userId })
        .populate('responses.responder', 'name email')
        .lean();
      exportData.emergencyRequests = requests.map(req => ({
        type: req.type,
        urgency: req.urgency,
        bloodType: req.bloodType,
        patient: req.patient,
        location: req.location,
        address: req.address,
        contact: req.contact,
        description: req.description,
        deadline: req.deadline,
        status: req.status,
        responses: req.responses,
        createdAt: req.createdAt
      }));
    }
    
    if (dataTypes.responses) {
      const responses = await EmergencyRequest.find({
        'responses.responder': userId
      }).populate('requester', 'name email').lean();
      
      exportData.myResponses = [];
      responses.forEach(req => {
        const userResponses = req.responses.filter(resp => 
          resp.responder.toString() === userId.toString()
        );
        userResponses.forEach(resp => {
          exportData.myResponses.push({
            requestType: req.type,
            requestUrgency: req.urgency,
            requesterName: req.requester.name,
            message: resp.message,
            status: resp.status,
            respondedAt: resp.respondedAt
          });
        });
      });
    }
    
    if (dataTypes.activity) {
      exportData.activityLog = {
        accountCreated: req.user.createdAt,
        lastLogin: new Date(),
        totalRequests: exportData.emergencyRequests?.length || 0,
        totalResponses: exportData.myResponses?.length || 0,
        isDonor: !!exportData.donorInfo
      };
    }
    
    // Generate file based on format
    const validFormats = ['json', 'csv', 'excel', 'pdf'];
    const exportFormat = validFormats.includes(format) ? format : 'json';
    console.log('Using export format:', exportFormat);
    
    const timestamp = new Date().toISOString().replace(/[:.]/g, '-');
    const filename = `emresource-data-${timestamp}`;
    let filePath;
    let mimeType;
    
    switch (exportFormat) {
      case 'json':
        filePath = `public/exports/${filename}.json`;
        fs.writeFileSync(filePath, JSON.stringify(exportData, null, 2));
        mimeType = 'application/json';
        break;
        
      case 'csv':
        // Flatten data for CSV
        const flatData = [];
        Object.keys(exportData).forEach(key => {
          if (Array.isArray(exportData[key])) {
            exportData[key].forEach((item, index) => {
              flatData.push({ section: key, index, ...item });
            });
          } else if (typeof exportData[key] === 'object') {
            flatData.push({ section: key, ...exportData[key] });
          }
        });
        
        const parser = new Parser();
        const csv = parser.parse(flatData);
        filePath = `public/exports/${filename}.csv`;
        fs.writeFileSync(filePath, csv);
        mimeType = 'text/csv';
        break;
        
      case 'excel':
        const wb = XLSX.utils.book_new();
        Object.keys(exportData).forEach(key => {
          let wsData;
          if (Array.isArray(exportData[key])) {
            wsData = exportData[key];
          } else {
            wsData = [exportData[key]];
          }
          const ws = XLSX.utils.json_to_sheet(wsData);
          XLSX.utils.book_append_sheet(wb, ws, key);
        });
        filePath = `public/exports/${filename}.xlsx`;
        XLSX.writeFile(wb, filePath);
        mimeType = 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet';
        break;
        
      case 'pdf':
        filePath = `public/exports/${filename}.pdf`;
        await generatePDF(exportData, filePath, userName);
        mimeType = 'application/pdf';
        break;
    }
    
    // Send email with attachment
    await sendDataExportEmail(userEmail, userName, filePath, filename, exportFormat);
    
    // Clean up file after 1 hour
    setTimeout(() => {
      if (fs.existsSync(filePath)) {
        fs.unlinkSync(filePath);
      }
    }, 60 * 60 * 1000);
    
    res.json({
      success: true,
      message: `Data export completed in ${exportFormat.toUpperCase()} format. Check your email for the download link.`
    });
  } catch (error) {
    console.error('Error exporting data:', error);
    res.status(500).json({ success: false, message: 'Server error during export' });
  }
});



// PDF generation function
async function generatePDF(data, filePath, userName) {
  return new Promise((resolve, reject) => {
    const doc = new PDFDocument({ margin: 50 });
    const stream = fs.createWriteStream(filePath);
    doc.pipe(stream);

    // Header
    doc.fontSize(20).fillColor('#e63946').text('EMResource Data Export', { align: 'center' });
    doc.fontSize(12).fillColor('#666').text(`Generated for: ${userName}`, { align: 'center' });
    doc.fontSize(10).fillColor('#666').text(`Date: ${new Date().toLocaleString()}`, { align: 'center' });
    doc.moveDown(2);

    // Profile Information
    if (data.profile) {
      doc.fontSize(16).fillColor('#333').text('Profile Information', { underline: true });
      doc.moveDown(0.5);
      doc.fontSize(10).fillColor('#000');
      doc.text(`Name: ${data.profile.name}`);
      doc.text(`Email: ${data.profile.email}`);
      doc.text(`Phone: ${data.profile.phone || 'Not provided'}`);
      doc.text(`Role: ${data.profile.role}`);
      doc.text(`Verified: ${data.profile.isVerified ? 'Yes' : 'No'}`);
      doc.text(`Account Created: ${new Date(data.profile.createdAt).toLocaleDateString()}`);
      doc.moveDown(1);
    }

    // Donor Information
    if (data.donorInfo) {
      doc.fontSize(16).fillColor('#333').text('Blood Donor Information', { underline: true });
      doc.moveDown(0.5);
      doc.fontSize(10).fillColor('#000');
      doc.text(`Blood Type: ${data.donorInfo.bloodType}`);
      doc.text(`Status: ${data.donorInfo.status}`);
      doc.text(`Verified: ${data.donorInfo.isVerified ? 'Yes' : 'No'}`);
      if (data.donorInfo.medicalInfo) {
        doc.text(`Age: ${data.donorInfo.medicalInfo.age}`);
        doc.text(`Weight: ${data.donorInfo.medicalInfo.weight} kg`);
      }
      doc.moveDown(1);
    }

    // Emergency Requests
    if (data.emergencyRequests && data.emergencyRequests.length > 0) {
      doc.fontSize(16).fillColor('#333').text('Emergency Requests', { underline: true });
      doc.moveDown(0.5);
      data.emergencyRequests.forEach((req, index) => {
        doc.fontSize(12).fillColor('#e63946').text(`Request ${index + 1}:`);
        doc.fontSize(10).fillColor('#000');
        doc.text(`Type: ${req.type}`);
        doc.text(`Urgency: ${req.urgency}`);
        doc.text(`Status: ${req.status}`);
        doc.text(`Description: ${req.description}`);
        doc.text(`Created: ${new Date(req.createdAt).toLocaleDateString()}`);
        doc.moveDown(0.5);
      });
      doc.moveDown(1);
    }

    // Responses
    if (data.myResponses && data.myResponses.length > 0) {
      doc.fontSize(16).fillColor('#333').text('My Responses', { underline: true });
      doc.moveDown(0.5);
      data.myResponses.forEach((resp, index) => {
        doc.fontSize(12).fillColor('#e63946').text(`Response ${index + 1}:`);
        doc.fontSize(10).fillColor('#000');
        doc.text(`Request Type: ${resp.requestType}`);
        doc.text(`Status: ${resp.status}`);
        doc.text(`Message: ${resp.message || 'No message'}`);
        doc.text(`Responded: ${new Date(resp.respondedAt).toLocaleDateString()}`);
        doc.moveDown(0.5);
      });
      doc.moveDown(1);
    }

    // Activity Log
    if (data.activityLog) {
      doc.fontSize(16).fillColor('#333').text('Activity Summary', { underline: true });
      doc.moveDown(0.5);
      doc.fontSize(10).fillColor('#000');
      doc.text(`Account Created: ${new Date(data.activityLog.accountCreated).toLocaleDateString()}`);
      doc.text(`Total Requests: ${data.activityLog.totalRequests}`);
      doc.text(`Total Responses: ${data.activityLog.totalResponses}`);
      doc.text(`Blood Donor: ${data.activityLog.isDonor ? 'Yes' : 'No'}`);
    }

    // Footer
    doc.fontSize(8).fillColor('#666').text('Generated by EMResource - Emergency Medical Resource Locator', 50, doc.page.height - 50, { align: 'center' });

    doc.end();
    stream.on('finish', resolve);
    stream.on('error', reject);
  });
}

// PDF generation function
async function generatePDF(data, filePath, userName) {
  return new Promise((resolve, reject) => {
    const doc = new PDFDocument({ margin: 50 });
    const stream = fs.createWriteStream(filePath);
    doc.pipe(stream);

    // Header
    doc.fontSize(20).fillColor('#e63946').text('EMResource Data Export', { align: 'center' });
    doc.fontSize(12).fillColor('#666').text(`Generated for: ${userName}`, { align: 'center' });
    doc.fontSize(10).fillColor('#666').text(`Date: ${new Date().toLocaleString()}`, { align: 'center' });
    doc.moveDown(2);

    // Profile Information
    if (data.profile) {
      doc.fontSize(16).fillColor('#333').text('Profile Information', { underline: true });
      doc.moveDown(0.5);
      doc.fontSize(10).fillColor('#000');
      doc.text(`Name: ${data.profile.name}`);
      doc.text(`Email: ${data.profile.email}`);
      doc.text(`Phone: ${data.profile.phone || 'Not provided'}`);
      doc.text(`Role: ${data.profile.role}`);
      doc.text(`Verified: ${data.profile.isVerified ? 'Yes' : 'No'}`);
      doc.text(`Account Created: ${new Date(data.profile.createdAt).toLocaleDateString()}`);
      doc.moveDown(1);
    }

    // Donor Information
    if (data.donorInfo) {
      doc.fontSize(16).fillColor('#333').text('Blood Donor Information', { underline: true });
      doc.moveDown(0.5);
      doc.fontSize(10).fillColor('#000');
      doc.text(`Blood Type: ${data.donorInfo.bloodType}`);
      doc.text(`Status: ${data.donorInfo.status}`);
      doc.text(`Verified: ${data.donorInfo.isVerified ? 'Yes' : 'No'}`);
      if (data.donorInfo.medicalInfo) {
        doc.text(`Age: ${data.donorInfo.medicalInfo.age}`);
        doc.text(`Weight: ${data.donorInfo.medicalInfo.weight} kg`);
      }
      doc.moveDown(1);
    }

    // Emergency Requests
    if (data.emergencyRequests && data.emergencyRequests.length > 0) {
      doc.fontSize(16).fillColor('#333').text('Emergency Requests', { underline: true });
      doc.moveDown(0.5);
      data.emergencyRequests.forEach((req, index) => {
        doc.fontSize(12).fillColor('#e63946').text(`Request ${index + 1}:`);
        doc.fontSize(10).fillColor('#000');
        doc.text(`Type: ${req.type}`);
        doc.text(`Urgency: ${req.urgency}`);
        doc.text(`Status: ${req.status}`);
        doc.text(`Description: ${req.description}`);
        doc.text(`Created: ${new Date(req.createdAt).toLocaleDateString()}`);
        doc.moveDown(0.5);
      });
    }

    doc.end();
    stream.on('finish', resolve);
    stream.on('error', reject);
  });
}

module.exports = router;