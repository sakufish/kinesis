const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
  name: { type: String, required: true },
  userId: { type: String, unique: true, required: true }, 
  injuries: { type: [String], default: [] },
  difficulty: { type: String, default:"Easy"}, 
  details: { type: String, default:"" }, 
});

module.exports = mongoose.model('User', userSchema);
