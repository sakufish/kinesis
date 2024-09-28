const express = require('express');
const router = express.Router();
const User = require('../models/UserModel');
const { v4: uuidv4 } = require('uuid');

router.post('/signup', async (req, res) => {
  const { name } = req.body;

  if (!name) {
    return res.status(400).json({ error: 'Name is required' });
  }

  try {
    const userId = uuidv4();
    const newUser = new User({ name, userId });
    await newUser.save();
    res.json({ userId });
  } catch (error) {
    res.status(500).json({ error: 'Server error' });
  }
});

router.get('/user/:userId', async (req, res) => {
  try {
    const user = await User.findOne({ userId: req.params.userId });
    if (user) {
      res.json({ name: user.name });
    } else {
      res.status(404).json({ error: 'User not found' });
    }
  } catch (error) {
    res.status(500).json({ error: 'Server error' });
  }
});

module.exports = router;
