const Conversation = require('../models/Conversation');
const Message = require('../models/Message');
const User = require('../models/User');
const {
  updateChatHistory,
  sendNewDirectMessage,
} = require('./notifyConnectedSockets');
const sendPushNotification = require('./notification');

const directMessageHandler = async (socket, data) => {
  try {
    const { receiverUserId, message } = data;
    const senderUserId = socket.user.userId;

    if (!message) {
      console.error('No content provided for the message.');
      return;
    }

    // Check if a conversation between sender and receiver already exists
    let conversation = await Conversation.findOne({
      participants: { $all: [receiverUserId, senderUserId] },
    });

    // If no conversation exists, create a new one
    if (!conversation) {
      console.log('Creating new conversation');
      conversation = await Conversation.create({
        participants: [senderUserId, receiverUserId],
        messages: [], // Initialize with an empty messages array
      });
    }

    // Create the new message with chatId referencing the conversation ID
    const newMessage = await Message.create({
      author: senderUserId,
      content: message,
      type: 'DIRECT',
      chatId: conversation._id, // Set chatId to the conversation's ID
    });

    // Append the new message to the conversation and save
    conversation.messages.push(newMessage._id);
    await conversation.save();

    // Update the chat history of the participants
    updateChatHistory(conversation._id.toString());

    // Notify participants of the new message
    sendNewDirectMessage(conversation._id.toString(), newMessage);

    // Retrieve sender and receiver details
    const receiver = await User.findById(receiverUserId);
    const sender = await User.findById(senderUserId);

    // Send a push notification to the receiver about the new message
    sendPushNotification({
      sender,
      receiver,
      message: newMessage,
    });
  } catch (err) {
    console.error('Error in directMessageHandler:', err);
  }
};

module.exports = directMessageHandler;
