require('dotenv').config();

const express = require('express');
const http = require('http');
const cors = require('cors');
const mongoose = require('mongoose');
const jwt = require('jsonwebtoken'); // Import jsonwebtoken
var webPush = require('web-push');

const authRoutes = require('./routes/authRoutes');
const friendInvitationRoutes = require('./routes/friendInvitationRoutes');
const groupChatRoutes = require('./routes/groupChatRoutes');

const { createSocketServer } = require('./socket/socketServer');

const PORT = process.env.PORT || 5000;

// Set Mongoose strictQuery option to true or false as needed
mongoose.set('strictQuery', false); // Set to true or false to suppress the deprecation warning

// Set up web push with VAPID details
webPush.setVapidDetails(
  'mailto:chosen@goufer.com', // Use your contact email
  process.env.PUBLIC_VAPID_KEY,
  process.env.PRIVATE_VAPID_KEY
);

const app = express();
app.use(express.json());
app.use(cors());

// Middleware to verify JWT
function authenticateToken(req, res, next) {
  const token = req.headers['authorization'];
  if (!token) return res.sendStatus(401); // Unauthorized

  const tokenString = token.split(' ')[1]; // Extract token from "Bearer <token>"

  jwt.verify(tokenString, process.env.JWT_SECRET, (err, user) => {
    if (err) return res.sendStatus(403); // Forbidden
    req.user = user; // Attach user info to the request
    next();
  });
}

// Register the routes with JWT authentication where necessary
app.use('/api/auth', authRoutes); // No JWT required for login/signup routes
app.use('/api/invite-friend', authenticateToken, friendInvitationRoutes); // JWT required
app.use('/api/group-chat', authenticateToken, groupChatRoutes); // JWT required

const server = http.createServer(app);

// Socket connection
createSocketServer(server);

// MongoDB connection URI based on environment
const MONGO_URI =
  process.env.NODE_ENV === 'production'
    ? process.env.MONGO_URI
    : process.env.MONGO_URI_DEV;

mongoose
  .connect(MONGO_URI)
  .then(() => {
    server.listen(PORT, () => {
      console.log(`SERVER STARTED ON ${PORT}.....!`);
    });
  })
  .catch((err) => {
    console.log('Database connection failed. Server not started');
    console.error(err);
  });

// Function to generate JWT (you can place this in your authRoutes if desired)
function generateToken(user) {
  return jwt.sign({ id: user._id }, process.env.JWT_SECRET, { expiresIn: '1h' });
}


module.exports = { generateToken }; // Export the function if you want to use it in authRoutes
