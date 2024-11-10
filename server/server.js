const path = require('path');
require('dotenv').config({ path: path.resolve(__dirname, '../.env') });

const express = require('express');
const http = require('http');
const cors = require('cors');
const mongoose = require('mongoose');
const jwt = require('jsonwebtoken');
const webPush = require('web-push');

const authRoutes = require('./routes/authRoutes');
const friendInvitationRoutes = require('./routes/friendInvitationRoutes');
const groupChatRoutes = require('./routes/groupChatRoutes');

const { createSocketServer } = require('./socket/socketServer');

const PORT = process.env.PORT || 5000;

// Debug statements to log environment values
console.log('NODE_ENV:', process.env.NODE_ENV);
console.log('MONGO_URI (production):', process.env.MONGO_URI);
console.log('MONGO_URI_DEV (development):', process.env.MONGO_URI_DEV);
console.log('JWT_SECRET:', process.env.JWT_SECRET);

// MongoDB connection URI based on environment
const MONGO_URI =
  process.env.NODE_ENV === 'production'
    ? process.env.MONGO_URI
    : process.env.MONGO_URI_DEV;

console.log('Final MONGO_URI:', MONGO_URI);

// Set Mongoose strictQuery option to avoid deprecation warnings
mongoose.set('strictQuery', false);

// Set up web push with VAPID details
const vapidPublicKey =
  process.env.PUBLIC_VAPID_KEY ||
  'BGrAVlYHBTbM0uLz0Gsqzi7VMTU1yWnwxZ7lWRFV2O1RYpE9hAwcVlhLn5bjqWSjRn6z2or0AYZJsEk65qBUmAo';
const vapidPrivateKey =
  process.env.PRIVATE_VAPID_KEY ||
  'jhTlTMt1rtVtE2Xn3-kNL-yDlhnnckMwkJLU0rU04is';

webPush.setVapidDetails('mailto:chosen@goufer.com', vapidPublicKey, vapidPrivateKey);

const app = express();
app.use(express.json());
app.use(cors());

// Serve static files from the React app in production
if (process.env.NODE_ENV === 'production') {
  app.use(express.static(path.join(__dirname, '../client/build')));

  // Catch-all route to serve index.html for any other request
  app.get('*', (req, res) => {
    res.sendFile(path.join(__dirname, '../client/build', 'index.html'));
  });
}

// Middleware to verify JWT
function authenticateToken(req, res, next) {
  const token = req.headers['authorization'];
  if (!token) return res.sendStatus(401);

  const tokenString = token.split(' ')[1];
  jwt.verify(tokenString, process.env.JWT_SECRET, (err, user) => {
    if (err) return res.sendStatus(403);
    req.user = user;
    next();
  });
}

// Register routes with JWT authentication where necessary
app.use('/api/auth', authRoutes); // Public routes for auth
app.use('/api/invite-friend', authenticateToken, friendInvitationRoutes); // Protected routes
app.use('/api/group-chat', authenticateToken, groupChatRoutes);

const server = http.createServer(app);

// Socket connection
createSocketServer(server);

// MongoDB connection
mongoose
  .connect(MONGO_URI)
  .then(() => {
    server.listen(PORT, () => {
      console.log(`SERVER STARTED ON PORT ${PORT}`);
    });
  })
  .catch((err) => {
    console.log('Database connection failed. Server not started');
    console.error(err);
  });

// Function to generate JWT
function generateToken(user) {
  return jwt.sign({ id: user._id }, process.env.JWT_SECRET, { expiresIn: '1h' });
}

module.exports = { generateToken };
