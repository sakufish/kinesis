import React, { useState, useEffect } from 'react';
import axios from 'axios';
import Cookies from 'js-cookie';

interface Message {
    message: string;
    timestamp: string;
}

const ChatPage: React.FC = () => {
    const [userId] = useState<string>(Cookies.get('userId') || '');
    const [recipientId, setRecipientId] = useState<string>('');
    const [message, setMessage] = useState<string>('');
    const [messages, setMessages] = useState<Message[]>([]);

    const fetchMessages = async () => {
        try {
            const response = await axios.get(`http://localhost:3000/api/chat/${userId}/${recipientId}`);
            setMessages(response.data);
        } catch (error) {
            console.error('Error fetching messages:', error);
        }
    };

    const sendMessage = async () => {
        if (!message.trim()) return;
        try {
            await axios.post(`http://localhost:3000/api/chat/${userId}/${recipientId}/message`, { message });
            setMessage('');
            fetchMessages(); // Refresh the messages after sending
        } catch (error) {
            console.error('Error sending message:', error);
        }
    };

    useEffect(() => {
        if (recipientId) {
            fetchMessages();
        }
    }, [recipientId]);

    return (
        <div className="flex flex-col items-center justify-center p-4">
            <h1 className="text-2xl font-bold mb-4">Chat with User</h1>
            <input
                type="text"
                value={recipientId}
                onChange={(e) => setRecipientId(e.target.value)}
                placeholder="Enter recipient UUID"
                className="border p-2 mb-4"
            />
            <div className="w-full max-w-md border p-4 mb-4 h-64 overflow-y-scroll bg-gray-100">
                {messages.length === 0 ? (
                    <p>No messages yet.</p>
                ) : (
                    messages.map((msg, index) => (
                        <div key={index} className="mb-2">
                            <span className="text-sm">{new Date(msg.timestamp).toLocaleString()}</span>
                            <p>{msg.message}</p>
                        </div>
                    ))
                )}
            </div>
            <input
                type="text"
                value={message}
                onChange={(e) => setMessage(e.target.value)}
                placeholder="Type a message"
                className="border p-2 mb-4"
            />
            <button onClick={sendMessage} className="bg-blue-500 text-white px-4 py-2 rounded">
                Send
            </button>
        </div>
    );
};

export default ChatPage;
