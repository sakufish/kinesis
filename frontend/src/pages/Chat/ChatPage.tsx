import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import axios from 'axios';
import Cookies from 'js-cookie';
import Logo from './assets/logo.png';
import SendIcon from './assets/send.png'; // Assuming you have the send.png icon here
import UserIcon from './assets/usersvg.svg'; // Assuming you have the user icon here
import home from '../Achievements/assets/home.png';

interface Message {
    message: string;
    timestamp: string;
    sender: string;
}

const ChatPage: React.FC = () => {
    const [userId] = useState<string>(Cookies.get('userId') || '');
    const [recipientId, setRecipientId] = useState<string>('');
    const [message, setMessage] = useState<string>('');
    const [messages, setMessages] = useState<Message[]>([]);
    const [senderName, setSenderName] = useState<string>('');
    const [isShrinking, setIsShrinking] = useState<boolean>(false);

    const fetchMessages = async () => {
        if (!recipientId) return;
        try {
            const response = await axios.get(`http://localhost:3000/api/chat/${userId}/${recipientId}`);
            setMessages(response.data);
        } catch (error) {
            console.error('Error fetching messages:', error);
        }
    };

    const sendMessage = async () => {
        if (!message.trim() || !recipientId) return;
        try {
            await axios.post(`http://localhost:3000/api/chat/${userId}/${recipientId}/message`, { message });
            setMessage('');
            fetchMessages();
        } catch (error) {
            console.error('Error sending message:', error);
        }
    };

    const handleKeyPress = (e: React.KeyboardEvent<HTMLInputElement>) => {
        if (e.key === 'Enter') {
            setIsShrinking(true);
            sendMessage();
            setTimeout(() => {
                setIsShrinking(false);
            }, 200);
        }
    };

    const fetchSenderName = async () => {
        try {
            const response = await axios.get(`http://localhost:3000/api/user/${userId}`);
            setSenderName(response.data.name);
        } catch (error) {
            console.error('Error fetching sender name:', error);
        }
    };

    useEffect(() => {
        fetchSenderName();
    }, [userId]);

    useEffect(() => {
        if (recipientId) {
            fetchMessages();
            const interval = setInterval(fetchMessages, 2000);
            return () => clearInterval(interval);
        }
    }, [recipientId]);

    return (
        <div className="flex flex-col items-center justify-center p-4 h-screen bg-[#000] font-roboto">
            <div className='absolute z-10 w-8 h-auto top-6 left-6'>
                <Link to="/dash">
                    <img src={home} alt="home icon" className='cursor-pointer'/>
                </Link>
            </div>
            <h1 className="text-4xl italic font-bold text-white mb-4 p-2 rounded-lg w-full text-center font-roboto">
                CHAT
            </h1>
            <input
                type="text"
                value={recipientId}
                onChange={(e) => setRecipientId(e.target.value)}
                placeholder="Enter recipient UUID"
                className="border-none py-2 bg-[#322727] text-center text-white placeholder-gray-500 rounded-md w-full max-w-md font-roboto"
            />
            <div className="w-full max-w-md border-none p-4 h-64 overflow-y-scroll bg-[#241919] rounded-md font-roboto no-scrollbar">
                {messages.length === 0 ? (
                    <p className="text-white font-roboto">No messages yet.</p>
                ) : (
                    messages.map((msg, index) => (
                        <div
                            key={index}
                            className={`mb-2 flex ${msg.sender === senderName ? 'justify-end' : 'justify-start items-center'} font-roboto`}
                        >
                            {msg.sender !== senderName && (
                                <>
                                    <img src={UserIcon} alt="User Icon" className="w-8 h-8 mr-4" />
                                    <div className="text-white font-roboto">
                                        <span className="block text-xs text-gray-300 font-roboto">
                                            {msg.sender} - {new Date(msg.timestamp).toLocaleTimeString()}
                                        </span>
                                        <p className="font-roboto">{msg.message}</p>
                                    </div>
                                </>
                            )}
                            {msg.sender === senderName && (
                                <div
                                    className="p-2 bg-[#150E0E] text-white rounded-[20px] px-4 font-roboto"
                                    style={{ maxWidth: '60%' }}
                                >
                                    <span className="block text-xs text-gray-500 font-roboto">
                                        {msg.sender} - {new Date(msg.timestamp).toLocaleTimeString()}
                                    </span>
                                    <p className="font-roboto">{msg.message}</p>
                                </div>
                            )}
                        </div>
                    ))
                )}
            </div>

            <div className="relative w-full max-w-md mb-4 font-roboto">
                <input
                    type="text"
                    value={message}
                    onChange={(e) => setMessage(e.target.value)}
                    placeholder="Send an inspirational message..."
                    onKeyDown={handleKeyPress}
                    className="w-full italic p-2 bg-[#241919] text-white placeholder-gray-500 rounded-md border border-[#FF833A] focus:outline-none font-roboto"
                />
                <img
                    src={SendIcon}
                    alt="Send"
                    onClick={sendMessage}
                    className={`absolute right-3 hover:scale-75 top-1/2 transform -translate-y-1/2 h-5 w-auto cursor-pointer transition-all duration-300 ${
                        isShrinking ? 'scale-75' : 'scale-100'
                    }`}
                />
            </div>

            <p className="text-white font-roboto mt-2">User ID: {userId}</p>

            <div className="absolute bottom-20 left-20 font-roboto">
                <Link to="/dash">
                    <img src={Logo} alt="Logo" className="bottom-10 left-10" />
                </Link>
            </div>
        </div>
    );
};

export default ChatPage;
