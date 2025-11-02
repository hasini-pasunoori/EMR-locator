// Simple test script to verify authentication flow
const express = require('express');
const session = require('express-session');

const app = express();

// Test session configuration
app.use(session({
  secret: 'test-secret',
  resave: false,
  saveUninitialized: false,
  cookie: {
    secure: false,
    httpOnly: true,
    maxAge: 24 * 60 * 60 * 1000
  }
}));

app.use(express.json());

// Test route to set session
app.post('/test-login', (req, res) => {
  req.session.user = { id: 1, name: 'Test User', email: 'test@example.com' };
  res.json({ success: true, message: 'Session set' });
});

// Test route to check session
app.get('/test-session', (req, res) => {
  if (req.session.user) {
    res.json({ success: true, user: req.session.user });
  } else {
    res.json({ success: false, message: 'No session found' });
  }
});

// Test route to clear session
app.post('/test-logout', (req, res) => {
  req.session.destroy((err) => {
    if (err) {
      res.json({ success: false, error: err.message });
    } else {
      res.json({ success: true, message: 'Session cleared' });
    }
  });
});

const PORT = 3001;
app.listen(PORT, () => {
  console.log(`Test server running on http://localhost:${PORT}`);
  console.log('Test endpoints:');
  console.log('POST /test-login - Set session');
  console.log('GET /test-session - Check session');
  console.log('POST /test-logout - Clear session');
});

module.exports = app;