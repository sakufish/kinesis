const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const chatSchema = new Schema({
    userIds: [{ type: String, required: true }], // Array to store both user IDs
    messages: [
        {
            message: { type: String, required: true },
            timestamp: { type: Date, default: Date.now },
        },
    ],
});

module.exports = mongoose.models.Chat || mongoose.model('Chat', chatSchema);
