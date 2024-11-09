const mongoose = require("mongoose");

const messageSchema = new mongoose.Schema(
    {
        // sender of the message
        author: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "User",
            required: true,
        },
        content: {
            type: String,
            required: [true, "can't be blank"],
        },
        type: {
            type: String,
        },
        chatId: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "Chat", // Assuming you have a Chat model to associate messages with chats
            required: true,
        }
    },
    { timestamps: true }
);

// Method to delete a message by its ID
messageSchema.statics.deleteMessageById = async function (messageId) {
    try {
        const result = await this.findByIdAndDelete(messageId);
        return result;
    } catch (error) {
        throw new Error('Error deleting message: ' + error.message);
    }
};

// Method to delete all messages in a chat
messageSchema.statics.deleteMessagesByChatId = async function (chatId) {
    try {
        const result = await this.deleteMany({ chatId: chatId });
        return result;
    } catch (error) {
        throw new Error('Error deleting messages: ' + error.message);
    }
};

module.exports = mongoose.model("Message", messageSchema);
