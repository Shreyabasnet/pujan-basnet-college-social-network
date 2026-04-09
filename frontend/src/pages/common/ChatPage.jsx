import React, { useState, useEffect, useRef } from 'react';
import { useSearchParams } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import api from '../../services/api';
import io from 'socket.io-client';
import { Send, Search, MoreVertical, File, Paperclip, X, Image as ImageIcon, Smile } from 'lucide-react';
import toast, { Toaster } from 'react-hot-toast';


const ENDPOINT = "http://localhost:5000";
var socket;

const ChatPage = () => {
    const { user } = useAuth();
    const [searchParams] = useSearchParams();
    const [conversations, setConversations] = useState([]);
    const [filteredConversations, setFilteredConversations] = useState([]);
    const [selectedUser, setSelectedUser] = useState(null);
    const [messages, setMessages] = useState([]);
    const [unreadCounts, setUnreadCounts] = useState({});
    const [openDeleteMenuId, setOpenDeleteMenuId] = useState(null);
    const [newMessage, setNewMessage] = useState("");
    const [selectedFile, setSelectedFile] = useState(null);
    const [searchQuery, setSearchQuery] = useState("");
    const fileInputRef = useRef(null);
    const messagesEndRef = useRef(null);
    const conversationsRef = useRef([]);

    const moveConversationToTop = (list, userId) => {
        if (!userId) return list;

        const index = list.findIndex((u) => u._id === userId);
        if (index <= 0) return list;

        const next = [...list];
        const [target] = next.splice(index, 1);
        next.unshift(target);
        return next;
    };

    const getConversationName = (userId) => {
        const userItem = conversationsRef.current.find((u) => u._id === userId);
        return userItem?.username || 'New message';
    };

    useEffect(() => {
        conversationsRef.current = conversations;
    }, [conversations]);

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
            } else {
                setUnreadCounts((prev) => ({
                    ...prev,
                    [data.senderId]: (prev[data.senderId] || 0) + 1,
                }));

                const senderName = data.message?.sender?.username || getConversationName(data.senderId);
                const preview = data.message?.text?.trim() || (data.message?.fileUrl ? 'Sent an attachment' : 'Sent a message');
                toast(`${senderName}: ${preview}`, {
                    icon: '💬',
                    duration: 3000,
                });
            }

            setConversations((prev) => moveConversationToTop(prev, data.senderId));
        });

        socket.on("message_unsent", (data) => {
            setMessages((prev) => prev.filter((msg) => msg._id !== data.messageId));
        });

        socket.on("message_deleted_for_me", (data) => {
            setMessages((prev) => prev.filter((msg) => msg._id !== data.messageId));
        });

        return () => {
            socket.off("receive_message");
            socket.off("message_unsent");
            socket.off("message_deleted_for_me");
        };
    }, []);

    const activeChatRef = useRef(null);
    useEffect(() => {
        activeChatRef.current = selectedUser?._id;
    }, [selectedUser]);

    useEffect(() => {
        fetchConversations();
    }, []);

    useEffect(() => {
        const userFromQuery = searchParams.get('user');
        if (!userFromQuery || conversations.length === 0) return;

        const matchedUser = conversations.find((item) => item._id === userFromQuery);
        if (matchedUser && selectedUser?._id !== matchedUser._id) {
            setSelectedUser(matchedUser);
        }
    }, [searchParams, conversations, selectedUser]);

    useEffect(() => {
        if (selectedUser) {
            fetchMessages(selectedUser._id);
            setUnreadCounts((prev) => {
                if (!prev[selectedUser._id]) return prev;
                return {
                    ...prev,
                    [selectedUser._id]: 0,
                };
            });
        }
    }, [selectedUser]);

    useEffect(() => {
        scrollToBottom();
    }, [messages]);

    useEffect(() => {
        if (searchQuery.trim()) {
            setFilteredConversations(
                conversations.filter(u => 
                    u.username.toLowerCase().includes(searchQuery.toLowerCase())
                )
            );
        } else {
            setFilteredConversations(conversations);
        }
    }, [searchQuery, conversations]);

    const scrollToBottom = () => {
        messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
    };

    const fetchConversations = async () => {
        try {
            const res = await api.get('/messages/conversations');
            setConversations(res.data);
            setFilteredConversations(res.data);
            const initialUnread = {};
            for (const item of res.data) {
                initialUnread[item._id] = item.unreadCount || 0;
            }
            setUnreadCounts(initialUnread);
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
        if ((!newMessage.trim() && !selectedFile) || !selectedUser) return;

        try {
            const formData = new FormData();
            formData.append('text', newMessage);
            if (selectedFile) {
                formData.append('file', selectedFile);
            }

            const res = await api.post(`/messages/send/${selectedUser._id}`, formData, {
                headers: { 'Content-Type': 'multipart/form-data' }
            });

            setMessages((prev) => [...prev, res.data]);
            setConversations((prev) => moveConversationToTop(prev, selectedUser._id));

            setNewMessage("");
            setSelectedFile(null);
            if (fileInputRef.current) fileInputRef.current.value = "";
        } catch (error) {
            console.error(error);
        }
    };

    const handleDeleteMessage = async (messageId, scope) => {
        if (!messageId || !selectedUser) return;

        try {
            await api.delete(`/messages/${messageId}`, {
                params: { scope },
            });
            setMessages((prev) => prev.filter((msg) => msg._id !== messageId));
            setOpenDeleteMenuId(null);
        } catch (error) {
            console.error(error);
            toast.error('Failed to delete message');
        }
    };

    const getMessageReceipt = (msg) => {
        if (!isMessageFromMe(msg)) {
            return null;
        }

        return msg.isRead ? 'Delivered' : 'Sent';
    };

    const groupMessagesByDate = (msgs) => {
        const grouped = {};
        msgs.forEach(msg => {
            const date = new Date(msg.createdAt).toLocaleDateString();
            if (!grouped[date]) grouped[date] = [];
            grouped[date].push(msg);
        });
        return grouped;
    };

    const isMessageFromMe = (msg) => msg.sender === (user.id || user._id) || msg.sender._id === (user.id || user._id);

    return (
        <div className="flex h-[calc(100vh-64px)] bg-white">
            <Toaster position="top-right" />
            {/* Sidebar - Conversations */}
            <div className="w-96 border-r border-gray-200 flex flex-col bg-white">
                {/* Header */}
                <div className="p-4 border-b border-gray-200">
                    <h1 className="text-2xl font-bold mb-4 text-gray-900">Messages</h1>
                    
                    {/* Search */}
                    <div className="relative">
                        <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
                        <input
                            type="text"
                            placeholder="Search conversations..."
                            value={searchQuery}
                            onChange={(e) => setSearchQuery(e.target.value)}
                            className="w-full pl-10 pr-4 py-2 bg-gray-100 rounded-full focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm"
                        />
                    </div>
                </div>

                {/* Conversations List */}
                <div className="flex-1 overflow-y-auto">
                    {filteredConversations.length === 0 ? (
                        <div className="p-4 text-center text-gray-500 text-sm">
                            No conversations found
                        </div>
                    ) : (
                        filteredConversations.map(u => (
                            <div
                                key={u._id}
                                onClick={() => {
                                    setSelectedUser(u);
                                    setOpenDeleteMenuId(null);
                                }}
                                className={`p-3 cursor-pointer transition-colors border-b border-gray-100 hover:bg-gray-50 ${
                                    selectedUser?._id === u._id ? 'bg-blue-50' : ''
                                }`}
                            >
                                <div className="flex items-center">
                                    <div className="relative">
                                        <div className="h-14 w-14 rounded-full bg-gradient-to-br from-blue-400 to-purple-500 flex items-center justify-center text-white font-bold text-lg overflow-hidden flex-shrink-0">
                                            {u.profilePicture ? (
                                                <img src={u.profilePicture} alt={u.username} className="h-full w-full object-cover" />
                                            ) : (
                                                u.username.charAt(0).toUpperCase()
                                            )}
                                        </div>
                                    </div>
                                    <div className="ml-3 flex-1 min-w-0">
                                        <div className="flex items-center justify-between gap-2">
                                            <h3 className="font-500 text-gray-900 text-sm truncate">{u.username}</h3>
                                            {unreadCounts[u._id] > 0 && (
                                                <span className="min-w-5 h-5 px-1.5 rounded-full bg-red-500 text-white text-[10px] font-bold flex items-center justify-center">
                                                    {unreadCounts[u._id] > 99 ? '99+' : unreadCounts[u._id]}
                                                </span>
                                            )}
                                        </div>
                                    </div>
                                </div>
                            </div>
                        ))
                    )}
                </div>
            </div>

            {/* Chat Area */}
            <div className="flex-1 flex flex-col bg-white">
                {selectedUser ? (
                    <>
                        {/* Chat Header */}
                        <div className="h-16 border-b border-gray-200 flex items-center justify-between px-6">
                            <div className="flex items-center">
                                <div className="h-10 w-10 rounded-full bg-gradient-to-br from-blue-400 to-purple-500 flex items-center justify-center text-white font-bold overflow-hidden">
                                    {selectedUser.profilePicture ? (
                                        <img src={selectedUser.profilePicture} alt={selectedUser.username} className="h-full w-full object-cover" />
                                    ) : (
                                        selectedUser.username.charAt(0).toUpperCase()
                                    )}
                                </div>
                                <div className="ml-3">
                                    <h2 className="font-600 text-gray-900">{selectedUser.username}</h2>
                                </div>
                            </div>
                            <div className="flex items-center space-x-4">
                                <button className="p-2 hover:bg-gray-100 rounded-full transition">
                                    <MoreVertical className="h-5 w-5 text-gray-600" />
                                </button>
                            </div>
                        </div>

                        {/* Messages */}
                        <div className="flex-1 overflow-y-auto p-6 space-y-4 bg-gray-50">
                            {messages.length === 0 ? (
                                <div className="flex items-center justify-center h-full">
                                    <div className="text-center">
                                        <div className="h-20 w-20 rounded-full bg-gray-200 flex items-center justify-center mx-auto mb-4 text-gray-600">
                                            {selectedUser.username.charAt(0).toUpperCase()}
                                        </div>
                                        <p className="text-gray-600 font-500">Conversation started</p>
                                        <p className="text-sm text-gray-500 mt-1">Say hi to {selectedUser.username}!</p>
                                    </div>
                                </div>
                            ) : (
                                messages.map((msg, index) => {
                                    const isMe = isMessageFromMe(msg);
                                    const receipt = getMessageReceipt(msg);
                                    const formattedTime = msg.createdAt
                                        ? new Date(msg.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
                                        : '';
                                    return (
                                        <div key={msg._id || index} className={`flex ${isMe ? 'justify-end' : 'justify-start'}`}>
                                            <div className="group relative max-w-xs">
                                                <div className={`rounded-2xl px-4 py-2 ${
                                                    isMe 
                                                        ? 'bg-gradient-to-r from-blue-500 to-purple-600 text-white rounded-br-none' 
                                                        : 'bg-gray-200 text-gray-900 rounded-bl-none'
                                                }`}>
                                                    {msg.text && <p className="text-sm">{msg.text}</p>}

                                                    {msg.fileUrl && (
                                                        <div className={`mt-2 flex items-center p-2 rounded-lg border ${isMe ? 'bg-blue-500/50 border-blue-300' : 'bg-gray-300 border-gray-400'}`}>
                                                            <File className={`h-5 w-5 mr-2 ${isMe ? 'text-white' : 'text-gray-700'}`} />
                                                            <a
                                                                href={msg.fileUrl.startsWith('http') ? msg.fileUrl : `http://localhost:5000${msg.fileUrl}`}
                                                                target="_blank"
                                                                rel="noopener noreferrer"
                                                                className={`text-xs font-bold hover:underline truncate ${isMe ? 'text-white' : 'text-gray-800'}`}
                                                            >
                                                                {msg.fileName || 'Download'}
                                                            </a>
                                                        </div>
                                                    )}

                                                    {receipt && (
                                                        <p className={`mt-1 text-[10px] font-medium ${isMe ? 'text-white/80 text-right' : 'text-gray-500'}`}>
                                                            {receipt}
                                                        </p>
                                                    )}

                                                    {formattedTime && (
                                                        <p className={`mt-1 text-[10px] ${isMe ? 'text-white/75 text-right' : 'text-gray-500 text-left'}`}>
                                                            {formattedTime}
                                                        </p>
                                                    )}
                                                </div>
                                                {isMe && (
                                                    <div className="absolute -top-8 right-0 opacity-0 group-hover:opacity-100 transition-opacity">
                                                        <button
                                                            onClick={() => setOpenDeleteMenuId((prev) => prev === msg._id ? null : msg._id)}
                                                            className="p-1 text-gray-700 hover:text-gray-900"
                                                            title="Message options"
                                                        >
                                                            <MoreVertical className="h-4 w-4" />
                                                        </button>

                                                        {openDeleteMenuId === msg._id && (
                                                            <div className="absolute top-6 right-0 w-44 bg-white border border-gray-200 rounded-lg shadow-lg z-10">
                                                                <button
                                                                    onClick={() => handleDeleteMessage(msg._id, 'everyone')}
                                                                    className="w-full px-3 py-2 text-left text-sm hover:bg-gray-50"
                                                                >
                                                                    Delete for everyone
                                                                </button>
                                                                <button
                                                                    onClick={() => handleDeleteMessage(msg._id, 'me')}
                                                                    className="w-full px-3 py-2 text-left text-sm hover:bg-gray-50"
                                                                >
                                                                    Delete for me
                                                                </button>
                                                            </div>
                                                        )}
                                                    </div>
                                                )}

                                                {!isMe && (
                                                    <div className="absolute -top-8 left-0 opacity-0 group-hover:opacity-100 transition-opacity">
                                                        <button
                                                            onClick={() => setOpenDeleteMenuId((prev) => prev === msg._id ? null : msg._id)}
                                                            className="p-1 text-gray-700 hover:text-gray-900"
                                                            title="Message options"
                                                        >
                                                            <MoreVertical className="h-4 w-4" />
                                                        </button>

                                                        {openDeleteMenuId === msg._id && (
                                                            <div className="absolute top-6 left-0 w-40 bg-white border border-gray-200 rounded-lg shadow-lg z-10">
                                                                <button
                                                                    onClick={() => handleDeleteMessage(msg._id, 'me')}
                                                                    className="w-full px-3 py-2 text-left text-sm hover:bg-gray-50"
                                                                >
                                                                    Delete for me
                                                                </button>
                                                            </div>
                                                        )}
                                                    </div>
                                                )}
                                            </div>
                                        </div>
                                    );
                                })
                            )}
                            <div ref={messagesEndRef} />
                        </div>

                        {/* Input Area */}
                        <div className="p-4 border-t border-gray-200 bg-white">
                            {selectedFile && (
                                <div className="mb-3 flex items-center bg-gray-100 p-2 rounded-lg w-fit">
                                    <File className="h-4 w-4 text-red-500 mr-2" />
                                    <span className="text-xs text-gray-700 max-w-[150px] truncate">{selectedFile.name}</span>
                                    <button 
                                        onClick={() => setSelectedFile(null)} 
                                        className="ml-2 text-gray-500 hover:text-red-500"
                                    >
                                        <X className="h-4 w-4" />
                                    </button>
                                </div>
                            )}
                            <form onSubmit={handleSendMessage} className="flex items-center gap-3">
                                <button
                                    type="button"
                                    onClick={() => fileInputRef.current?.click()}
                                    className="p-2 hover:bg-gray-100 rounded-full transition text-gray-600"
                                >
                                    <Paperclip className="h-5 w-5" />
                                </button>
                                <button type="button" className="p-2 hover:bg-gray-100 rounded-full transition text-gray-600">
                                    <ImageIcon className="h-5 w-5" />
                                </button>
                                <input
                                    type="file"
                                    ref={fileInputRef}
                                    className="hidden"
                                    accept=".pdf,.doc,.docx,application/pdf,application/msword,application/vnd.openxmlformats-officedocument.wordprocessingml.document"
                                    onChange={(e) => setSelectedFile(e.target.files[0])}
                                />
                                <input
                                    type="text"
                                    className="flex-1 bg-gray-100 rounded-full px-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm"
                                    placeholder="Aa"
                                    value={newMessage}
                                    onChange={(e) => setNewMessage(e.target.value)}
                                />
                                <button type="button" className="p-2 hover:bg-gray-100 rounded-full transition text-gray-600">
                                    <Smile className="h-5 w-5" />
                                </button>
                                <button
                                    type="submit"
                                    disabled={!newMessage.trim() && !selectedFile}
                                    className="p-2 bg-gradient-to-r from-blue-500 to-purple-600 hover:from-blue-600 hover:to-purple-700 rounded-full text-white transition disabled:opacity-50"
                                >
                                    <Send className="h-5 w-5" />
                                </button>
                            </form>
                        </div>
                    </>
                ) : (
                    <div className="flex-1 flex items-center justify-center bg-gray-50">
                        <div className="text-center">
                            <div className="h-24 w-24 rounded-full bg-gradient-to-br from-blue-400 to-purple-500 flex items-center justify-center mx-auto mb-4 text-white text-3xl">
                                💬
                            </div>
                            <h2 className="text-2xl font-bold text-gray-900 mb-2">Your Messages</h2>
                            <p className="text-gray-500">Select a conversation to start messaging</p>
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
};

export default ChatPage;
