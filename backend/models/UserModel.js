const mongoose = require('mongoose');

const chatSchema = new mongoose.Schema({
  userIds: [String],
  messages: [
    {
      message: String,
      timestamp: { type: Date, default: Date.now }
    }
  ]
});

const Chat = mongoose.model('Chat', chatSchema);

module.exports = Chat;
