const express = require('express');
const router = express.Router();
const Chat = require('../models/Chat');

// Get user's chats
router.get('/', async (req, res) => {
  try {
    if (!req.user) {
      return res.status(401).json({ success: false, message: 'Authentication required' });
    }

    const chats = await Chat.find({ 
      participants: req.user._id,
      isActive: true 
    })
    .populate('participants', 'name email')
    .populate('lastMessage.sender', 'name')
    .sort({ 'lastMessage.timestamp': -1 });

    res.json({ success: true, data: chats });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Server error' });
  }
});

// Get chat messages
router.get('/:chatId/messages', async (req, res) => {
  try {
    if (!req.user) {
      return res.status(401).json({ success: false, message: 'Authentication required' });
    }

    const chat = await Chat.findById(req.params.chatId)
      .populate('messages.sender', 'name')
      .populate('participants', 'name email');

    if (!chat || !chat.participants.some(p => p._id.toString() === req.user._id.toString())) {
      return res.status(403).json({ success: false, message: 'Not authorized' });
    }

    res.json({ success: true, data: chat });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Server error' });
  }
});

// Send message
router.post('/:chatId/message', async (req, res) => {
  try {
    if (!req.user) {
      return res.status(401).json({ success: false, message: 'Authentication required' });
    }

    const { message } = req.body;
    const chat = await Chat.findById(req.params.chatId);

    if (!chat || !chat.participants.includes(req.user._id)) {
      return res.status(403).json({ success: false, message: 'Not authorized' });
    }

    const newMessage = {
      sender: req.user._id,
      message: message,
      timestamp: new Date()
    };

    chat.messages.push(newMessage);
    chat.lastMessage = {
      message: message,
      timestamp: new Date(),
      sender: req.user._id
    };

    await chat.save();

    // Emit to socket.io if available
    if (req.app.get('io')) {
      req.app.get('io').to(`chat_${chat._id}`).emit('newMessage', newMessage);
    }

    res.json({ success: true, message: 'Message sent', data: newMessage });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Server error' });
  }
});

// Create new chat
router.post('/create', async (req, res) => {
  try {
    if (!req.user) {
      return res.status(401).json({ success: false, message: 'Authentication required' });
    }

    const { participantId, emergencyRequestId } = req.body;

    // Check if chat already exists
    const existingChat = await Chat.findOne({
      participants: { $all: [req.user._id, participantId] },
      emergencyRequest: emergencyRequestId
    });

    if (existingChat) {
      return res.json({ success: true, data: existingChat });
    }

    const chat = new Chat({
      participants: [req.user._id, participantId],
      emergencyRequest: emergencyRequestId
    });

    await chat.save();
    await chat.populate('participants', 'name email');

    res.json({ success: true, data: chat });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Server error' });
  }
});

module.exports = router;