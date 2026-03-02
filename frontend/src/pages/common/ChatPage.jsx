import React, { useState, useEffect, useRef } from 'react';
import { useAuth } from '../../context/AuthContext';
import api from '../../services/api';
import io from 'socket.io-client';
import { Send, User as UserIcon } from 'lucide-react';

const ENDPOINT = "http://localhost:5000";
var socket;

const ChatPage = () => {
    const { user } = useAuth();
    const [conversations, setConversations] = useState([]);
    const [selectedUser, setSelectedUser] = useState(null);
    const [messages, setMessages] = useState([]);
    const [newMessage, setNewMessage] = useState("");
    const messagesEndRef = useRef(null);

    useEffect(() => {
        socket = io(ENDPOINT);
        if (user) {
            socket.emit("join_room", user.id || user._id);
        }
        return () => socket.disconnect();
    }, [user]);

    useEffect(() => {
        socket.on("receive_message", (data) => {
            if (activeChatRef.current && activeChatRef.current === data.senderId) {
                setMessages((prev) => [...prev, data.message]);
            }
            // Ideally we should also update the conversation list to show unread or latest message
        });
        return () => socket.off("receive_message");
    }, []);

    // Ref to keep track of current chat for socket updates
    const activeChatRef = useRef(null);
    useEffect(() => {
        activeChatRef.current = selectedUser?._id;
    }, [selectedUser]);


    useEffect(() => {
        fetchConversations();
    }, []);

    useEffect(() => {
        if (selectedUser) {
            fetchMessages(selectedUser._id);
        }
    }, [selectedUser]);

    useEffect(() => {
        scrollToBottom();
    }, [messages]);

    const scrollToBottom = () => {
        messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
    };

    const fetchConversations = async () => {
        try {
            const res = await api.get('/messages/conversations');
            setConversations(res.data);
        } catch (error) {
            console.error(error);
        }
    };

    const fetchMessages = async (userId) => {
        try {
            const res = await api.get(`/messages/${userId}`);
            setMessages(res.data);
        } catch (error) {
            console.error(error);
        }
    };

    const handleSendMessage = async (e) => {
        e.preventDefault();
        if (!newMessage.trim() || !selectedUser) return;

        try {
            const res = await api.post(`/messages/send/${selectedUser._id}`, { text: newMessage });

            // Add to local state
            setMessages([...messages, res.data]);

            // Emit to socket
            socket.emit("send_message", {
                receiverId: selectedUser._id,
                senderId: user.id || user._id,
                message: res.data
            });

            setNewMessage("");
        } catch (error) {
            console.error(error);
        }
    };

    return (
        <div className="min-h-[calc(100vh-64px)] bg-gray-50 flex">
            {/* Sidebar */}
            <div className="w-1/3 border-r border-gray-200 bg-white overflow-y-auto">
                <div className="p-4 border-b border-gray-100">
                    <h2 className="text-xl font-bold text-gray-800">Messages</h2>
                </div>
                <div className="divide-y divide-gray-100">
                    {conversations.map(u => (
                        <div
                            key={u._id}
                            onClick={() => setSelectedUser(u)}
                            className={`p-4 flex items-center cursor-pointer hover:bg-gray-50 transition ${selectedUser?._id === u._id ? 'bg-primary-50' : ''}`}
                        >
                            <div className="h-12 w-12 rounded-full bg-gray-200 overflow-hidden mr-4">
                                {u.profilePicture ? (
                                    <img src={u.profilePicture} alt={u.username} className="h-full w-full object-cover" />
                                ) : (
                                    <div className="h-full w-full flex items-center justify-center bg-primary-100 text-primary-600 font-bold uppercase">
                                        {u.username.charAt(0)}
                                    </div>
                                )}
                            </div>
                            <div>
                                <h3 className="font-medium text-gray-900">{u.username}</h3>
                                <p className="text-sm text-gray-500">{u.department}</p>
                            </div>
                        </div>
                    ))}
                </div>
            </div>

            {/* Chat Area */}
            <div className="w-2/3 flex flex-col bg-gray-50">
                {selectedUser ? (
                    <>
                        {/* Header */}
                        <div className="p-4 bg-white border-b border-gray-200 shadow-sm flex items-center">
                            <div className="h-10 w-10 rounded-full bg-gray-200 overflow-hidden mr-3">
                                {selectedUser.profilePicture ? (
                                    <img src={selectedUser.profilePicture} alt={selectedUser.username} className="h-full w-full object-cover" />
                                ) : (
                                    <div className="h-full w-full flex items-center justify-center bg-primary-100 text-primary-600 font-bold uppercase">
                                        {selectedUser.username.charAt(0)}
                                    </div>
                                )}
                            </div>
                            <h3 className="font-bold text-gray-900">{selectedUser.username}</h3>
                        </div>

                        {/* Messages */}
                        <div className="flex-1 overflow-y-auto p-4 space-y-4">
                            {messages.map((msg, index) => {
                                const isMe = msg.sender === (user.id || user._id) || msg.sender._id === (user.id || user._id);
                                return (
                                    <div key={index} className={`flex ${isMe ? 'justify-end' : 'justify-start'}`}>
                                        <div className={`max-w-[70%] rounded-2xl px-4 py-2 ${isMe ? 'bg-primary-600 text-white rounded-br-none' : 'bg-white text-gray-800 rounded-bl-none shadow-sm'}`}>
                                            <p>{msg.text}</p>
                                            <p className={`text-xs mt-1 ${isMe ? 'text-primary-100' : 'text-gray-400'}`}>
                                                {new Date(msg.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                                            </p>
                                        </div>
                                    </div>
                                )
                            })}
                            <div ref={messagesEndRef} />
                        </div>

                        {/* Input */}
                        <div className="p-4 bg-white border-t border-gray-200">
                            <form onSubmit={handleSendMessage} className="flex gap-2">
                                <input
                                    type="text"
                                    className="flex-1 rounded-full border border-gray-300 px-4 py-2 focus:outline-none focus:border-primary-500"
                                    placeholder="Type a message..."
                                    value={newMessage}
                                    onChange={(e) => setNewMessage(e.target.value)}
                                />
                                <button
                                    type="submit"
                                    className="bg-primary-600 text-white p-3 rounded-full hover:bg-primary-700 transition"
                                >
                                    <Send className="h-5 w-5" />
                                </button>
                            </form>
                        </div>
                    </>
                ) : (
                    <div className="flex-1 flex flex-col items-center justify-center text-gray-400">
                        <UserIcon className="h-16 w-16 mb-4 opacity-50" />
                        <p className="text-lg">Select a user to start chatting</p>
                    </div>
                )}
            </div>
        </div>
    );
};

export default ChatPage;
