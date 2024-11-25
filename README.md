# sirunchat

SirunChat is a modern chat application designed to deliver a clean, feature-rich, and secure messaging experience. With a focus on privacy and user-friendliness, SirunChat supports real-time direct and group messaging, calls, file sharing, and customizable chat interfaces. This project is built using React for the frontend, Node.js and Express for the backend, Socket.IO for real-time communication, and MongoDB for data storage. Firebase is also utilized for optional storage and integrations.
Table of Contents

    Features
    Installation
    Environment Variables
    Running Locally
    Deployment
    Usage
    Folder Structure
    Contributing

Features

    Direct Messaging: Chat with friends one-on-one in real time.
    Group Chat: Create and join group chats with multiple users.
    Voice & Video Calls: Make calls with other users, inspired by popular chat apps.
    File & Media Sharing: Share files and media with ease.
    Online Status Indicators: Shows online/offline status of friends.
    Customizable Themes: Switch between dark, light, and custom themes.
    Responsive UI: Optimized for mobile and desktop.
    Emoji Support: Choose from a variety of emojis to enhance chat interactions.
    End-to-End Privacy: Focuses on user privacy with limited chat history retention.
    Push Notifications: Real-time alerts for incoming messages and calls.
    Admin Features: User and group management functionalities.

Installation

To get started, clone the repository and install the dependencies for both the client and server.
Prerequisites

Make sure you have the following installed on your system:

    Node.js (v14 or above)
    MongoDB (if running locally)
    Git

Clone the Repository

git clone https://github.com/your-username/sirunchat.git
cd sirunchat

Install Dependencies

    Install server dependencies:

cd server
npm install

Install client dependencies:

    cd ../client
    npm install

Environment Variables

Before running the app, you’ll need to set up environment variables for both the server and client.
Server

Create a .env file in the server directory and add the following:

MONGO_URI_DEV=your_mongo_dev_uri
JWT_SECRET=your_jwt_secret_key
PUBLIC_VAPID_KEY=your_public_vapid_key
PRIVATE_VAPID_KEY=your_private_vapid_key
PORT=5000
NODE_ENV=development

Client

Create a .env file in the client directory if needed, especially if using Firebase or other integrations that require keys.
Running Locally

    Start MongoDB (if not already running):

mongod

Run the Server:

In the server directory, start the server:

npm start

Run the Client:

In the client directory, start the frontend:

    npm start

The server should be running on http://localhost:5000 and the client on http://localhost:3000.
Deployment

For deployment, we recommend using Heroku for the server and Netlify or Vercel for the client.
Deploying to Heroku

    Push your code to GitHub.
    Go to Heroku Dashboard and create a new app.
    Connect the Heroku app to the GitHub repository.
    Set up the Config Vars in the Heroku settings to match the .env variables in your server.

Deploying the Client

Use Netlify or Vercel for the React frontend:

    Push your code to GitHub.
    Link your GitHub repository to Netlify or Vercel.
    Follow the platform’s instructions to set up any necessary environment variables.

Usage
Authentication

    Sign Up / Sign In: Users can sign up with a valid email and password.
    Token-Based Authentication: JWT is used to authenticate requests after logging in.

Messaging and Calls

    Direct and Group Messages: Choose a friend to start a direct chat or join an existing group.
    Making Calls: Start a voice or video call using the call buttons within a chat.
    Notifications: Get notified of incoming messages and calls in real time.

Customization

    Dark Mode: Switch between light and dark themes.
    Emojis: Access emojis from the message input area.
    Manage Chats: Delete chats or group conversations when needed.

Admin Features

Admins can manage group chats and users, providing a secure environment for all participants.
Folder Structure

The project is divided into client and server directories:

sirunchat/
├── client/                # React Frontend
│   ├── public/
│   ├── src/
│   ├── .env
│   └── package.json
├── server/                # Express Backend
│   ├── controllers/       # Business logic
│   ├── models/            # Mongoose models
│   ├── routes/            # Express routes
│   ├── socketControllers/ # Socket.IO handlers
│   ├── .env
│   └── package.json
├── README.md
└── .gitignore

Contributing

We welcome contributions! Please fork the repository, create a new branch for your feature or bug fix, and open a pull request.

    Fork the repository.
    Create a new branch:

git checkout -b feature-name

Make your changes and commit:

    git commit -m "Add feature-name"

    Push to your fork and submit a pull request.

License

This project is licensed under the MIT License.
