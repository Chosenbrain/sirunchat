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

const app = express();
app.use(express.json());
app.use(cors());

// Redirect HTTP to HTTPS in production
if (process.env.NODE_ENV === 'production') {
  app.use((req, res, next) => {
    if (req.header('x-forwarded-proto') !== 'https') {
      return res.redirect(`https://${req.header('host')}${req.url}`);
    }
    next();
  });
}

// MongoDB Connection URI based on environment
const MONGO_URI =
  process.env.NODE_ENV === 'production' ? process.env.MONGO_URI : process.env.MONGO_URI_DEV;

mongoose
  .connect(MONGO_URI, { useNewUrlParser: true, useUnifiedTopology: true })
  .then(() => console.log('Connected to MongoDB'))
  .catch((err) => {
    console.error('Database connection failed:', err);
  });

// Configure VAPID keys for Web Push
const vapidPublicKey = process.env.PUBLIC_VAPID_KEY;
const vapidPrivateKey = process.env.PRIVATE_VAPID_KEY;

webPush.setVapidDetails('mailto:chosen@goufer.com', vapidPublicKey, vapidPrivateKey);

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

// Routes
app.use('/api/auth', authRoutes); // Public auth routes
app.use('/api/invite-friend', authenticateToken, friendInvitationRoutes); // Protected routes
app.use('/api/group-chat', authenticateToken, groupChatRoutes); // Protected routes

// Serve static files from the React app’s build directory
app.use(express.static(path.join(__dirname, '../client/build')));

// Send all non-API requests to the React app
app.get('*', (req, res) => {
  res.sendFile(path.join(__dirname, '../client/build', 'index.html'));
});

// Create server and initialize socket connection
const server = http.createServer(app);
createSocketServer(server);

server.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
