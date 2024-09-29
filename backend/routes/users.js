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
      res.json(user);
    } else {
      res.status(404).json({ error: 'User not found' });
    }
  } catch (error) {
    res.status(500).json({ error: 'Server error' });
  }
});

router.put('/user/:userId/preferences', async (req, res) => {
  const { injuries, difficulty, details } = req.body;
  try {
    const user = await User.findOneAndUpdate(
      { userId: req.params.userId },
      { injuries, difficulty, details },
      { new: true }
    );
    if (user) {
      res.json(user);
    } else {
      res.status(404).json({ error: 'User not found' });
    }
  } catch (error) {
    res.status(500).json({ error: 'Server error' });
  }
});

router.put('/user/:userId/chats', async (req, res) => {
  const { recipientName, recipientId, lastMessage } = req.body;

  if (!recipientName || !recipientId || !lastMessage) {
      return res.status(400).json({ error: 'Recipient name, ID, and last message are required' });
  }

  try {
      const user = await User.findOne({ userId: req.params.userId });

      if (!user) {
          return res.status(404).json({ error: 'User not found' });
      }

      const chatIndex = user.chats.findIndex(chat => chat.recipientId === recipientId);

      if (chatIndex !== -1) {
          user.chats[chatIndex].lastMessage = lastMessage;
          user.chats[chatIndex].lastMessageTime = Date.now();
      } else {
          user.chats.push({
              recipientName,
              recipientId,
              lastMessage,
              lastMessageTime: Date.now()
          });
      }

      await user.save();
      res.status(200).json({ message: 'Chat updated or added successfully', chats: user.chats });
  } catch (error) {
      res.status(500).json({ error: 'Server error' });
  }
});

router.get('/user/:userId/chats', async (req, res) => {
  try {
      const user = await User.findOne({ userId: req.params.userId });

      if (!user) {
          return res.status(404).json({ error: 'User not found' });
      }

      res.status(200).json(user.chats);
  } catch (error) {
      res.status(500).json({ error: 'Server error' });
  }
});

module.exports = router;
