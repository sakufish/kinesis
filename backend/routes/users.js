const express = require('express');
const router = express.Router();
const User = require('../models/UserModel'); // Assuming UserModel.js is your User schema
const { v4: uuidv4 } = require('uuid'); // For generating unique user IDs

// Sign-up route
router.post('/signup', async (req, res) => {
  const { name } = req.body;

  if (!name) {
    return res.status(400).json({ error: 'Name is required' });
  }

  try {
    // Generate a unique ID for the user
    const userId = uuidv4();

    // Create a new user in the database
    const newUser = new User({ name, userId });
    await newUser.save();

    // Send back the userId
    res.json({ userId });
  } catch (error) {
    console.error('Error during user creation:', error);
    res.status(500).json({ error: 'Server error' });
  }
});

module.exports = router;
