const Conversation = require('../models/Conversation');
const Message = require('../models/Message');

const deleteChatHandler = async (socket, data) => {
    const { userId, otherUserId } = data;
    console.log("Received delete-chat event with data:", data); // Confirm event data

    try {
        // Step 1: Find the conversation between the two users
        const conversation = await Conversation.findOne({
            participants: { $all: [userId, otherUserId] },
        });

        if (!conversation) {
            console.error('Conversation not found');
            socket.emit('delete-chat-failed', { message: 'Conversation not found' });
            return;
        }

        console.log("Found conversation with ID:", conversation._id);

        // Step 2: Delete all messages associated with this conversation
        const deleteMessagesResult = await Message.deleteMessagesByChatId(conversation._id);
        console.log("Deleted messages result:", deleteMessagesResult);

        // Step 3: Delete the conversation itself
        const deleteConversationResult = await Conversation.findByIdAndDelete(conversation._id);
        console.log("Deleted conversation result:", deleteConversationResult);

        // Step 4: Emit success event back to both participants
        socket.emit('delete-chat-success', { message: 'Chat deleted successfully' });
        socket.to(otherUserId).emit('delete-chat-success', { message: 'Chat deleted by other participant' });

    } catch (error) {
        console.error('Error during chat deletion:', error);
        socket.emit('delete-chat-failed', { message: 'Failed to delete chat' });
    }
};

module.exports = deleteChatHandler;
