const express = require('express');
const router = express.Router();
const Chat = require('../models/ChatModel');

// Fetch chat between two users
router.get('/:userId1/:userId2', async (req, res) => {
    const { userId1, userId2 } = req.params;
    
    try {
        const participants = [userId1, userId2].sort(); // Sort the userIds for consistent query
        let chat = await Chat.findOne({ userIds: participants });

        // If no chat exists, create one with the participants
        if (!chat) {
            chat = new Chat({
                userIds: participants,
                messages: [],
            });
            await chat.save();
        }

        res.status(200).json(chat.messages);
    } catch (error) {
        res.status(500).json({ error: 'Internal server error' });
    }
});

// Post a message to the chat
router.post('/:userId1/:userId2/message', async (req, res) => {
    const { userId1, userId2 } = req.params;
    const { message } = req.body;

    try {
        const participants = [userId1, userId2].sort(); // Sort the userIds for consistent query
        let chat = await Chat.findOne({ userIds: participants });

        if (!chat) {
            // If no chat exists, create a new one with the participants
            chat = new Chat({
                userIds: participants,
                messages: [],
            });
        }

        // Add the new message to the chat
        const newMessage = {
            message,
            timestamp: new Date(),
        };

        chat.messages.push(newMessage);
        await chat.save();

        res.status(200).json(chat);
    } catch (error) {
        res.status(500).json({ error: 'Internal server error' });
    }
});

module.exports = router;
