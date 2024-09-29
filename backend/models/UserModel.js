const mongoose = require('mongoose');

const chatSchema = new mongoose.Schema({
  recipientName: { type: String, required: true },
  recipientId: { type: String, required: true },
  lastMessage: { type: String, default: '' },
  lastMessageTime: { type: Date, default: Date.now }
});

const userSchema = new mongoose.Schema({
  name: { type: String, required: true },
  userId: { type: String, unique: true, required: true }, 
  injuries: { type: [String], default: [] },
  difficulty: { type: String, default:"Easy"}, 
  details: { type: String, default:"" }, 
  chats: [chatSchema],
});

module.exports = mongoose.model('User', userSchema);
