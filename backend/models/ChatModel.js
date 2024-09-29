const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const chatSchema = new Schema({
    userIds: [{ type: String, required: true }],
    messages: [
        {
            sender: { type: String, required: true },
            message: { type: String, required: true },
            timestamp: { type: Date, default: Date.now },
        },
    ],
});

module.exports = mongoose.models.Chat || mongoose.model('Chat', chatSchema);