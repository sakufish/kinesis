import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import axios from 'axios';
import Cookies from 'js-cookie';
import Logo from './assets/logo.png';
import SendIcon from './assets/send.png';
import UserIcon from './assets/usersvg.svg';
import PlusIcon from './assets/plus.svg';
import home from '../Achievements/assets/home.png';

interface Message {
    message: string;
    timestamp: string;
    sender: string;
}

interface Contact {
    recipientId: string;
    recipientName: string;
}

const ChatPage: React.FC = () => {
    const [userId] = useState<string>(Cookies.get('userId') || '');
    const [recipientId, setRecipientId] = useState<string>(''); 
    const [message, setMessage] = useState<string>('');
    const [messages, setMessages] = useState<Message[]>([]);
    const [contacts, setContacts] = useState<Contact[]>([]);
    const [newContactUUID, setNewContactUUID] = useState<string>('');
    const [senderName, setSenderName] = useState<string>('');
    const [isShrinking, setIsShrinking] = useState<boolean>(false);

    const fetchContacts = async () => {
        try {
            const response = await axios.get(`http://localhost:3000/api/user/${userId}`);
            const user = response.data;
            if (user && user.chats) {
                setContacts(user.chats);
            }
        } catch (error) {
            console.error('Error fetching contacts:', error);
        }
    };

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
        fetchContacts();
    }, [userId]);

    useEffect(() => {
        if (recipientId) {
            fetchMessages();
            const interval = setInterval(fetchMessages, 2000);
            return () => clearInterval(interval);
        }
    }, [recipientId]);

    const selectContact = (contactUUID: string) => {
        setRecipientId(contactUUID);  
    };

    const addContact = async () => {
        if (!newContactUUID.trim()) return;

        try {
            const response = await axios.get(`http://localhost:3000/api/user/${newContactUUID}`);
            const contactName = response.data.name;

            const newContact: Contact = { recipientId: newContactUUID, recipientName: contactName };
            setContacts((prevContacts) => [...prevContacts, newContact]);

            setNewContactUUID('');

            await axios.put(`http://localhost:3000/api/user/${userId}/chats`, {
                recipientName: contactName,
                recipientId: newContactUUID,
                lastMessage: "No messages yet",
            });
        } catch (error) {
            console.error('Error fetching or adding contact:', error);
        }
    };

    return (
        <div className="flex h-screen bg-[#000] font-roboto">
            <div className="flex-1 flex flex-col items-center justify-center p-4">
                <div className='absolute z-10 w-8 h-auto top-6 left-6'>
                    <Link to="/dash">
                        <img src={home} alt="home icon" className='cursor-pointer'/>
                    </Link>
                </div>
                <div className="w-full max-w-md flex flex-col">
                    <input
                        type="text"
                        value={recipientId}
                        placeholder="Recipient ID"
                        disabled
                        className="border-none py-2 bg-[#322727] text-center text-[#515151] placeholder-[#bfbfbf] rounded-md w-full max-w-md mb-4"
                    />
                    <div className="w-full max-w-md border-none p-4 h-64 overflow-y-scroll bg-[#241919] rounded-md no-scrollbar">
                        {messages.length === 0 ? (
                            <p className="text-white">No messages yet.</p>
                        ) : (
                            messages.map((msg, index) => (
                                <div
                                    key={index}
                                    className={`mb-2 flex ${msg.sender === senderName ? 'justify-end' : 'justify-start items-center'}`}
                                >
                                    {msg.sender !== senderName && (
                                        <>
                                            <img src={UserIcon} alt="User Icon" className="w-8 h-8 mr-4" />
                                            <div className="text-white">
                                                <span className="block text-xs text-gray-300">
                                                    {msg.sender} - {new Date(msg.timestamp).toLocaleTimeString()}
                                                </span>
                                                <p>{msg.message}</p>
                                            </div>
                                        </>
                                    )}
                                    {msg.sender === senderName && (
                                        <div
                                            className="p-2 bg-[#150E0E] text-white rounded-[20px] px-4"
                                            style={{ maxWidth: '60%' }}
                                        >
                                            <span className="block text-xs text-gray-500">
                                                {msg.sender} - {new Date(msg.timestamp).toLocaleTimeString()}
                                            </span>
                                            <p>{msg.message}</p>
                                        </div>
                                    )}
                                </div>
                            ))
                        )}
                    </div>
                </div>

                <div className="relative w-full max-w-md mb-4">
                    <input
                        type="text"
                        value={message}
                        onChange={(e) => setMessage(e.target.value)}
                        placeholder="Send an inspirational message..."
                        onKeyDown={handleKeyPress}
                        className="w-full italic p-2 bg-[#241919] text-white placeholder-gray-500 rounded-md border border-[#FF833A] focus:outline-none"
                    />
                    <img
                        src={SendIcon}
                        alt="Send"
                        onClick={sendMessage}
                        className={`absolute right-3 hover:scale-75 top-1/2 transform -translate-y-1/2 h-5 w-auto cursor-pointer transition-all duration-300 ${isShrinking ? 'scale-75' : 'scale-100'}`}
                    />
                </div>

                <p className="text-[#8c8c8c]">User ID: {userId}</p>

                <div className="absolute bottom-20 left-20">
                    <Link to="/dash">
                        <img src={Logo} alt="Logo" />
                    </Link>
                </div>
            </div>

            <div className="w-1/3 bg-[#1a1a1a] p-4 text-white">
                <h2 className="text-xl font-semibold mb-4">Contacts</h2>
                <ul className="space-y-4">
                    {contacts.length === 0 ? (
                        <p>No contacts yet.</p>
                    ) : (
                        contacts.map((contact) => (
                            <li key={contact.recipientId} onClick={() => selectContact(contact.recipientId)} className="cursor-pointer hover:text-[#FF833A] transition">
                                <div className="flex items-center space-x-2">
                                    <img src={UserIcon} alt="User Icon" className="w-6 h-6" />
                                    <span>{contact.recipientName}</span>
                                </div>
                            </li>
                        ))
                    )}
                </ul>

                <div className="mt-8 flex items-center">
                    <input
                        type="text"
                        value={newContactUUID}
                        onChange={(e) => setNewContactUUID(e.target.value)}
                        placeholder="Enter contact UUID"
                        className="flex-1 p-2 bg-[#241919] text-white rounded-md placeholder-gray-500 border border-[#FF833A] focus:outline-none"
                    />
                    <img
                        src={PlusIcon}
                        alt="Add"
                        onClick={addContact}
                        className="w-8 h-8 ml-4 cursor-pointer hover:scale-110 transition-all duration-300"
                    />
                </div>
            </div>
        </div>
    );
};

export default ChatPage;
