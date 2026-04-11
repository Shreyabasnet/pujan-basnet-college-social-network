import React, { useEffect, useMemo, useRef, useState } from 'react';
import { useSearchParams } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import api from '../../services/api';
import io from 'socket.io-client';
import { SOCKET_ENDPOINT } from '../../config/constants';
import { Send, Search, MoreVertical, File, Paperclip, X, Image as ImageIcon, Smile, Sparkles, MessageSquare, Users, ChevronRight } from 'lucide-react';
import toast, { Toaster } from 'react-hot-toast';

const ChatPage = () => {
    const { user } = useAuth();
    const [searchParams] = useSearchParams();
    const [conversations, setConversations] = useState([]);
    const [filteredConversations, setFilteredConversations] = useState([]);
    const [selectedUser, setSelectedUser] = useState(null);
    const [messages, setMessages] = useState([]);
    const [unreadCounts, setUnreadCounts] = useState({});
    const [openDeleteMenuId, setOpenDeleteMenuId] = useState(null);
    const [newMessage, setNewMessage] = useState('');
    const [selectedFile, setSelectedFile] = useState(null);
    const [searchQuery, setSearchQuery] = useState('');

    const fileInputRef = useRef(null);
    const messagesEndRef = useRef(null);
    const conversationsRef = useRef([]);
    const activeChatRef = useRef(null);
    let socket;

    const moveConversationToTop = (list, userId) => {
        if (!userId) return list;
        const index = list.findIndex((item) => item._id === userId);
        if (index <= 0) return list;
        const next = [...list];
        const [target] = next.splice(index, 1);
        next.unshift(target);
        return next;
    };

    const getConversationName = (userId) => {
        const userItem = conversationsRef.current.find((item) => item._id === userId);
        return userItem?.username || 'New message';
    };

    const conversationStats = useMemo(() => {
        const totalUnread = Object.values(unreadCounts).reduce((sum, count) => sum + (count || 0), 0);
        return {
            total: conversations.length,
            unread: totalUnread,
            activeName: selectedUser?.username || 'No conversation selected',
        };
    }, [conversations.length, unreadCounts, selectedUser]);

    const scrollToBottom = () => {
        messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
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
            console.log('Sending message:', {
                text: newMessage,
                file: selectedFile?.name,
                receiverId: selectedUser._id
            });

            const formData = new FormData();
            formData.append('text', newMessage || '');
            if (selectedFile) {
                console.log('Appending file to FormData:', selectedFile.name, selectedFile.size);
                formData.append('file', selectedFile);
                console.log('FormData keys:', Array.from(formData.keys()));
            }

            const res = await api.post(`/messages/send/${selectedUser._id}`, formData);

            console.log('Message sent successfully:', res.data);
            
            // Only clear after successful response
            setMessages((prev) => [...prev, res.data]);
            setConversations((prev) => moveConversationToTop(prev, selectedUser._id));
            setNewMessage('');
            setSelectedFile(null);
            if (fileInputRef.current) fileInputRef.current.value = '';
            toast.success('Message sent!');
        } catch (error) {
            console.error('Send message error:', error);
            const errorMsg = error.response?.data?.message || error.message || 'Failed to send message';
            toast.error(errorMsg);
        }
    };

    const handleDeleteMessage = async (messageId, scope) => {
        if (!messageId || !selectedUser) return;

        try {
            await api.delete(`/messages/${messageId}`, { params: { scope } });
            setMessages((prev) => prev.filter((msg) => msg._id !== messageId));
            setOpenDeleteMenuId(null);
        } catch (error) {
            console.error(error);
            toast.error('Failed to delete message');
        }
    };

    const getMessageReceipt = (msg) => {
        if (!isMessageFromMe(msg)) return null;
        return msg.isRead ? 'Delivered' : 'Sent';
    };

    const groupMessagesByDate = (msgs) => {
        const grouped = {};
        msgs.forEach((msg) => {
            const date = new Date(msg.createdAt).toLocaleDateString();
            if (!grouped[date]) grouped[date] = [];
            grouped[date].push(msg);
        });
        return grouped;
    };

    const formatDayLabel = (dateLabel) => {
        const today = new Date();
        const date = new Date(dateLabel);
        if (Number.isNaN(date.getTime())) return dateLabel;

        const todayText = today.toLocaleDateString();
        const yesterday = new Date(today);
        yesterday.setDate(today.getDate() - 1);

        if (date.toLocaleDateString() === todayText) return 'Today';
        if (date.toLocaleDateString() === yesterday.toLocaleDateString()) return 'Yesterday';
        return date.toLocaleDateString([], { month: 'short', day: 'numeric', year: 'numeric' });
    };

    const isMessageFromMe = (msg) => msg.sender === (user.id || user._id) || msg.sender?._id === (user.id || user._id);

    useEffect(() => {
        conversationsRef.current = conversations;
    }, [conversations]);

    useEffect(() => {
        socket = io(SOCKET_ENDPOINT);
        if (user) {
            socket.emit('join_room', user.id || user._id);
        }
        return () => socket.disconnect();
    }, [user]);

    useEffect(() => {
        const handleReceiveMessage = (data) => {
            if (activeChatRef.current && activeChatRef.current === data.senderId) {
                setMessages((prev) => [...prev, data.message]);
            } else {
                setUnreadCounts((prev) => ({
                    ...prev,
                    [data.senderId]: (prev[data.senderId] || 0) + 1,
                }));

                const senderName = data.message?.sender?.username || getConversationName(data.senderId);
                const preview = data.message?.text?.trim() || (data.message?.fileUrl ? 'Sent an attachment' : 'Sent a message');
                toast(`${senderName}: ${preview}`, { icon: '💬', duration: 3000 });
            }

            setConversations((prev) => moveConversationToTop(prev, data.senderId));
        };

        const handleMessageRemoved = (data) => {
            setMessages((prev) => prev.filter((msg) => msg._id !== data.messageId));
        };

        socket.on('receive_message', handleReceiveMessage);
        socket.on('message_unsent', handleMessageRemoved);
        socket.on('message_deleted_for_me', handleMessageRemoved);

        return () => {
            socket.off('receive_message', handleReceiveMessage);
            socket.off('message_unsent', handleMessageRemoved);
            socket.off('message_deleted_for_me', handleMessageRemoved);
        };
    }, []);

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
                conversations.filter((item) => item.username.toLowerCase().includes(searchQuery.toLowerCase()))
            );
        } else {
            setFilteredConversations(conversations);
        }
    }, [searchQuery, conversations]);

    const groupedMessages = useMemo(() => groupMessagesByDate(messages), [messages]);

    return (
        <div className="space-y-6">
            <Toaster position="top-right" />

            <section className="relative overflow-hidden rounded-[2rem] border border-white/70 bg-gradient-to-br from-slate-900 via-primary-800 to-cyan-700 p-6 text-white shadow-[0_30px_90px_-45px_rgba(15,23,42,0.6)]">
                <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_right,rgba(255,255,255,0.16),transparent_28%)]" />
                <div className="relative flex flex-col gap-6 lg:flex-row lg:items-end lg:justify-between">
                    <div className="space-y-4">
                        <span className="inline-flex items-center gap-2 rounded-full border border-white/15 bg-white/10 px-4 py-2 text-xs font-semibold uppercase tracking-[0.24em] text-white/80">
                            <Sparkles className="h-4 w-4" />
                            Messages
                        </span>
                        <h1 className="text-3xl font-black tracking-tight sm:text-4xl">Your messages</h1>
                        <p className="max-w-2xl text-sm leading-7 text-white/80 sm:text-base">
                            A dashboard-style inbox for campus conversations, files, and replies.
                        </p>
                        <div className="inline-flex max-w-full items-center gap-2 rounded-full border border-white/20 bg-white/10 px-4 py-2 text-xs font-semibold text-white/85">
                            <span className="text-white/65">Active chat</span>
                            <span className="truncate">{conversationStats.activeName}</span>
                        </div>
                    </div>
                    <div className="grid grid-cols-2 gap-3">
                        <MiniStat icon={<MessageSquare className="h-4 w-4" />} label="Conversations" value={conversationStats.total} />
                        <MiniStat icon={<Users className="h-4 w-4" />} label="Unread" value={conversationStats.unread} />
                    </div>
                </div>
            </section>

            <div className="grid grid-cols-1 gap-6 xl:grid-cols-[minmax(320px,380px)_minmax(0,1fr)]">
                <aside className="overflow-hidden rounded-[1.75rem] border border-slate-200 bg-white shadow-[0_20px_60px_-35px_rgba(15,23,42,0.35)]">
                    <div className="border-b border-slate-100 p-5">
                        <div className="mb-4 flex items-center justify-between gap-3">
                            <div>
                                <p className="text-xs font-semibold uppercase tracking-[0.24em] text-slate-400">Inbox</p>
                                <h2 className="mt-1 text-2xl font-black text-slate-900">Messages</h2>
                            </div>
                            <div className="rounded-full bg-primary-50 px-3 py-1 text-xs font-semibold text-primary-700 shadow-sm">
                                {conversationStats.total} chats
                            </div>
                        </div>

                        <div className="relative">
                            <Search className="absolute left-3 top-1/2 h-5 w-5 -translate-y-1/2 text-slate-400" />
                            <input
                                type="text"
                                placeholder="Search conversations..."
                                value={searchQuery}
                                onChange={(e) => setSearchQuery(e.target.value)}
                                className="w-full rounded-full border border-slate-200 bg-slate-50 py-2.5 pl-10 pr-4 text-sm text-slate-900 outline-none transition focus:border-primary-300 focus:ring-4 focus:ring-primary-100"
                            />
                        </div>
                    </div>

                    <div className="max-h-[calc(100vh-320px)] overflow-y-auto">
                        {filteredConversations.length === 0 ? (
                            <div className="p-8 text-center text-sm text-slate-500">No conversations found</div>
                        ) : (
                            filteredConversations.map((u) => {
                                const unread = unreadCounts[u._id] || 0;
                                const isActive = selectedUser?._id === u._id;

                                return (
                                    <button
                                        key={u._id}
                                        onClick={() => {
                                            setSelectedUser(u);
                                            setOpenDeleteMenuId(null);
                                        }}
                                        className={`flex w-full items-center gap-3 border-b border-slate-100 px-5 py-4 text-left transition hover:bg-slate-50 ${isActive ? 'bg-primary-50/70 shadow-[inset_3px_0_0_0_rgb(14_116_144)]' : ''}`}
                                    >
                                        <div className="h-14 w-14 flex-shrink-0 overflow-hidden rounded-full bg-gradient-to-br from-primary-500 to-cyan-500 text-lg font-bold text-white shadow-sm">
                                            {u.profilePicture ? (
                                                <img src={u.profilePicture} alt={u.username} className="h-full w-full object-cover" />
                                            ) : (
                                                <div className="flex h-full w-full items-center justify-center uppercase">{u.username.charAt(0).toUpperCase()}</div>
                                            )}
                                        </div>
                                        <div className="min-w-0 flex-1">
                                            <div className="flex items-center justify-between gap-2">
                                                <h3 className="truncate text-sm font-semibold text-slate-900">{u.username}</h3>
                                                {unread > 0 && (
                                                    <span className="inline-flex min-w-5 items-center justify-center rounded-full bg-rose-500 px-1.5 py-0.5 text-[10px] font-bold text-white">
                                                        {unread > 99 ? '99+' : unread}
                                                    </span>
                                                )}
                                            </div>
                                            <p className="mt-1 truncate text-xs text-slate-500">Tap to open conversation</p>
                                        </div>
                                        <ChevronRight className={`h-4 w-4 flex-shrink-0 ${isActive ? 'text-primary-500' : 'text-slate-300'}`} />
                                    </button>
                                );
                            })
                        )}
                    </div>
                </aside>

                <section className="flex min-h-[calc(100vh-260px)] flex-col overflow-hidden rounded-[1.75rem] border border-slate-200 bg-white shadow-[0_20px_60px_-35px_rgba(15,23,42,0.35)]">
                    {selectedUser ? (
                        <>
                            <div className="border-b border-slate-100 p-5">
                                <div className="flex items-center justify-between gap-4">
                                    <div className="flex items-center gap-3">
                                        <div className="h-12 w-12 overflow-hidden rounded-full bg-gradient-to-br from-primary-500 to-cyan-500 text-white shadow-sm">
                                            {selectedUser.profilePicture ? (
                                                <img src={selectedUser.profilePicture} alt={selectedUser.username} className="h-full w-full object-cover" />
                                            ) : (
                                                <div className="flex h-full w-full items-center justify-center font-bold uppercase">{selectedUser.username.charAt(0).toUpperCase()}</div>
                                            )}
                                        </div>
                                        <div>
                                            <h2 className="text-lg font-bold text-slate-900">{selectedUser.username}</h2>
                                            <p className="text-xs uppercase tracking-[0.18em] text-slate-400">Conversation active</p>
                                        </div>
                                    </div>
                                    <button className="rounded-full border border-slate-200 p-2 text-slate-400 transition hover:border-primary-200 hover:text-primary-700">
                                        <MoreVertical className="h-5 w-5" />
                                    </button>
                                </div>
                            </div>

                            <div className="flex-1 overflow-y-auto bg-slate-50/70 p-6">
                                {messages.length === 0 ? (
                                    <div className="flex h-full items-center justify-center">
                                        <div className="text-center">
                                            <div className="mx-auto mb-4 flex h-20 w-20 items-center justify-center rounded-full bg-gradient-to-br from-primary-500 to-cyan-500 text-3xl text-white shadow-sm">
                                                💬
                                            </div>
                                            <h3 className="text-2xl font-black text-slate-900">Conversation started</h3>
                                            <p className="mt-2 text-sm text-slate-500">Say hi to {selectedUser.username}!</p>
                                        </div>
                                    </div>
                                ) : (
                                    <div className="space-y-4">
                                        {Object.entries(groupedMessages).map(([date, groupedMessagesForDay]) => (
                                            <div key={date} className="space-y-4">
                                                <div className="flex justify-center">
                                                    <span className="rounded-full border border-slate-200 bg-white px-4 py-1 text-xs font-semibold uppercase tracking-[0.18em] text-slate-400 shadow-sm">
                                                        {formatDayLabel(date)}
                                                    </span>
                                                </div>
                                                {groupedMessagesForDay.map((msg, index) => {
                                                    const isMe = isMessageFromMe(msg);
                                                    const receipt = getMessageReceipt(msg);
                                                    const formattedTime = msg.createdAt
                                                        ? new Date(msg.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
                                                        : '';

                                                    return (
                                                        <div key={msg._id || index} className={`flex ${isMe ? 'justify-end' : 'justify-start'}`}>
                                                            <div className="group relative max-w-[min(38rem,calc(100vw-2rem))]">
                                                                <div className={`rounded-[1.5rem] px-4 py-3 shadow-sm ${isMe ? 'rounded-br-none bg-gradient-to-r from-primary-600 to-cyan-600 text-white' : 'rounded-bl-none border border-slate-200 bg-white text-slate-900'}`}>
                                                                    {msg.text && <p className="whitespace-pre-wrap text-sm leading-6">{msg.text}</p>}

                                                                    {msg.fileUrl && (
                                                                        <div className={`mt-3 flex items-center gap-2 rounded-2xl border px-3 py-2 ${isMe ? 'border-white/20 bg-white/10' : 'border-slate-200 bg-slate-50'}`}>
                                                                            <File className={`h-5 w-5 ${isMe ? 'text-white' : 'text-rose-500'}`} />
                                                                            <a
                                                                                href={msg.fileUrl.startsWith('http') ? msg.fileUrl : `${SOCKET_ENDPOINT}${msg.fileUrl}`}
                                                                                target="_blank"
                                                                                rel="noopener noreferrer"
                                                                                className={`truncate text-xs font-semibold hover:underline ${isMe ? 'text-white' : 'text-slate-700'}`}
                                                                            >
                                                                                {msg.fileName || 'Download'}
                                                                            </a>
                                                                        </div>
                                                                    )}

                                                                    <div className={`mt-2 flex items-center justify-between gap-3 text-[10px] ${isMe ? 'text-white/80' : 'text-slate-500'}`}>
                                                                        <span>{formattedTime}</span>
                                                                        {receipt && <span>{receipt}</span>}
                                                                    </div>
                                                                </div>

                                                                {isMe && (
                                                                    <div className="absolute -top-8 right-0 opacity-0 transition-opacity group-hover:opacity-100">
                                                                        <button
                                                                            onClick={() => setOpenDeleteMenuId((prev) => (prev === msg._id ? null : msg._id))}
                                                                            className="rounded-full border border-slate-200 bg-white p-1 text-slate-600 shadow-sm hover:border-primary-200 hover:text-primary-700"
                                                                            title="Message options"
                                                                        >
                                                                            <MoreVertical className="h-4 w-4" />
                                                                        </button>

                                                                        {openDeleteMenuId === msg._id && (
                                                                            <div className="absolute right-0 top-7 w-44 overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-lg">
                                                                                <button
                                                                                    onClick={() => handleDeleteMessage(msg._id, 'everyone')}
                                                                                    className="block w-full px-4 py-3 text-left text-sm text-slate-700 transition hover:bg-slate-50"
                                                                                >
                                                                                    Delete for everyone
                                                                                </button>
                                                                                <button
                                                                                    onClick={() => handleDeleteMessage(msg._id, 'me')}
                                                                                    className="block w-full px-4 py-3 text-left text-sm text-slate-700 transition hover:bg-slate-50"
                                                                                >
                                                                                    Delete for me
                                                                                </button>
                                                                            </div>
                                                                        )}
                                                                    </div>
                                                                )}

                                                                {!isMe && (
                                                                    <div className="absolute -top-8 left-0 opacity-0 transition-opacity group-hover:opacity-100">
                                                                        <button
                                                                            onClick={() => setOpenDeleteMenuId((prev) => (prev === msg._id ? null : msg._id))}
                                                                            className="rounded-full border border-slate-200 bg-white p-1 text-slate-600 shadow-sm hover:border-primary-200 hover:text-primary-700"
                                                                            title="Message options"
                                                                        >
                                                                            <MoreVertical className="h-4 w-4" />
                                                                        </button>

                                                                        {openDeleteMenuId === msg._id && (
                                                                            <div className="absolute left-0 top-7 w-40 overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-lg">
                                                                                <button
                                                                                    onClick={() => handleDeleteMessage(msg._id, 'me')}
                                                                                    className="block w-full px-4 py-3 text-left text-sm text-slate-700 transition hover:bg-slate-50"
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
                                                })}
                                            </div>
                                        ))}
                                        <div ref={messagesEndRef} />
                                    </div>
                                )}
                            </div>

                            <div className="border-t border-slate-100 bg-white p-4">
                                {selectedFile && (
                                    <div className="mb-3 flex w-fit items-center rounded-2xl border border-slate-200 bg-slate-50 px-3 py-2 shadow-sm">
                                        <File className="mr-2 h-4 w-4 text-rose-500" />
                                        <span className="max-w-[220px] truncate text-xs font-medium text-slate-700">{selectedFile.name}</span>
                                        <button onClick={() => setSelectedFile(null)} className="ml-2 text-slate-400 transition hover:text-rose-500">
                                            <X className="h-4 w-4" />
                                        </button>
                                    </div>
                                )}

                                <form onSubmit={handleSendMessage} className="flex flex-wrap items-center gap-3">
                                    <button
                                        type="button"
                                        onClick={() => fileInputRef.current?.click()}
                                        className="rounded-full border border-slate-200 p-2 text-slate-600 transition hover:border-primary-200 hover:text-primary-700"
                                    >
                                        <Paperclip className="h-5 w-5" />
                                    </button>
                                    <button type="button" className="rounded-full border border-slate-200 p-2 text-slate-600 transition hover:border-primary-200 hover:text-primary-700">
                                        <ImageIcon className="h-5 w-5" />
                                    </button>
                                    <input
                                        type="file"
                                        ref={fileInputRef}
                                        className="hidden"
                                        accept=".pdf,.doc,.docx,.jpg,.jpeg,.png,application/pdf,application/msword,application/vnd.openxmlformats-officedocument.wordprocessingml.document,image/jpeg,image/png,image/jpg"
                                        onChange={(e) => setSelectedFile(e.target.files[0])}
                                    />
                                    <input
                                        type="text"
                                        className="min-w-0 flex-1 rounded-full border border-slate-200 bg-slate-50 px-4 py-2.5 text-sm text-slate-900 outline-none transition focus:border-primary-300 focus:ring-4 focus:ring-primary-100"
                                        placeholder="Aa"
                                        value={newMessage}
                                        onChange={(e) => setNewMessage(e.target.value)}
                                    />
                                    <button type="button" className="rounded-full border border-slate-200 p-2 text-slate-600 transition hover:border-primary-200 hover:text-primary-700">
                                        <Smile className="h-5 w-5" />
                                    </button>
                                    <button
                                        type="submit"
                                        disabled={!newMessage.trim() && !selectedFile}
                                        className="inline-flex items-center justify-center rounded-full bg-gradient-to-r from-primary-600 to-cyan-600 p-3 text-white shadow-lg shadow-primary-600/20 transition hover:-translate-y-0.5 disabled:cursor-not-allowed disabled:opacity-50"
                                    >
                                        <Send className="h-5 w-5" />
                                    </button>
                                </form>
                            </div>
                        </>
                    ) : (
                        <div className="flex flex-1 items-center justify-center bg-slate-50/70 p-10">
                            <div className="text-center">
                                <div className="mx-auto mb-4 flex h-24 w-24 items-center justify-center rounded-full bg-gradient-to-br from-primary-500 to-cyan-500 text-4xl text-white shadow-sm">
                                    💬
                                </div>
                                <h2 className="text-2xl font-black text-slate-900">Your Messages</h2>
                                <p className="mt-2 text-sm text-slate-500">Select a conversation to start messaging</p>
                            </div>
                        </div>
                    )}
                </section>
            </div>
        </div>
    );
};

const MiniStat = ({ icon, label, value }) => (
    <div className="rounded-2xl border border-white/15 bg-white/10 p-4 backdrop-blur">
        <div className="flex items-center gap-2 text-white/70">
            {icon}
            <span className="text-xs font-semibold uppercase tracking-[0.18em]">{label}</span>
        </div>
        <p className="mt-3 text-2xl font-black">{value}</p>
    </div>
);

export default ChatPage;
