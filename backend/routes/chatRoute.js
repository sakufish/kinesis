const express = require('express');
const router = express.Router();
const Chat = require('../models/ChatModel');
const User = require('../models/UserModel');

router.get('/:userId1/:userId2', async (req, res) => {
    const { userId1, userId2 } = req.params;

    try {
        const participants = [userId1, userId2].sort(); 
        let chat = await Chat.findOne({ userIds: participants });

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

router.post('/:userId1/:userId2/message', async (req, res) => {
    const { userId1, userId2 } = req.params;
    const { message } = req.body;

    try {
        const sender = await User.findOne({ userId: userId1 });
        if (!sender) {
            return res.status(404).json({ error: 'Sender not found' });
        }

        const participants = [userId1, userId2].sort(); 
        let chat = await Chat.findOne({ userIds: participants });

        if (!chat) {
            chat = new Chat({
                userIds: participants,
                messages: [],
            });
        }

        const newMessage = {
            sender: sender.name, 
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
