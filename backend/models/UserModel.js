const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
  name: { type: String, required: true },
  userId: { type: String, unique: true, required: true }, // Unique ID
});

module.exports = mongoose.model('User', userSchema);
