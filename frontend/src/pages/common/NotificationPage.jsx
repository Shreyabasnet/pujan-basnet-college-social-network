import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import api from '../../services/api';
import { Heart, MessageSquare, Bell, Check, X } from 'lucide-react';

const NotificationPage = () => {
    const navigate = useNavigate();
    const [notifications, setNotifications] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        fetchNotifications();
    }, []);

    const fetchNotifications = async () => {
        try {
            const res = await api.get('/notifications');
            setNotifications(res.data);
        } catch (error) {
            console.error(error);
        } finally {
            setLoading(false);
        }
    };

    const handleMarkAsRead = async (e, notif) => {
        e.stopPropagation();
        try {
            await api.put(`/notifications/${notif._id}/read`);
            setNotifications((prev) =>
                prev.map((item) => (item._id === notif._id ? { ...item, isRead: true } : item))
            );
            // Trigger navbar refresh
            window.dispatchEvent(new Event('notificationUpdated'));
        } catch (error) {
            console.error(error);
        }
    };

    const handleMarkAsUnread = async (e, notif) => {
        e.stopPropagation();
        try {
            // Note: You may need to add this endpoint to your backend if it doesn't exist
            await api.put(`/notifications/${notif._id}/unread`);
            setNotifications((prev) =>
                prev.map((item) => (item._id === notif._id ? { ...item, isRead: false } : item))
            );
            // Trigger navbar refresh
            window.dispatchEvent(new Event('notificationUpdated'));
        } catch (error) {
            console.error('This feature requires a /unread endpoint on your backend', error);
        }
    };

    const handleNotificationClick = async (notif) => {
        try {
            if (notif.type === 'message') {
                const senderId = notif.sender?._id || notif.sender;
                navigate(senderId ? `/chat?user=${senderId}` : '/chat');
                return;
            }

            if (notif.type === 'like' || notif.type === 'comment') {
                navigate('/feed');
            }
        } catch (error) {
            console.error(error);
        }
    };

    const getIcon = (type) => {
        switch (type) {
            case 'like': return <Heart className="h-5 w-5 text-red-500 fill-current" />;
            case 'comment': return <MessageSquare className="h-5 w-5 text-blue-500 fill-current" />;
            default: return <Bell className="h-5 w-5 text-gray-500" />;
        }
    };

    return (
        <div className="space-y-6">
            <div className="bg-gradient-to-r from-blue-500 to-purple-600 rounded-lg shadow p-6 text-white">
                <h1 className="text-3xl font-bold">Notifications</h1>
                <p className="mt-2 text-blue-100">Stay updated with messages, comments, and activity</p>
            </div>

            <div className="bg-white rounded-lg shadow overflow-hidden">
                <div className="p-4 border-b border-gray-100 flex justify-between items-center">
                    <h2 className="text-lg font-semibold text-gray-900">Recent Notifications</h2>
                    <span className="text-sm text-gray-500">{notifications.length} Total ({notifications.filter(n => !n.isRead).length} Unread)</span>
                </div>

                {loading ? (
                    <div className="p-8 text-center">
                        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mx-auto"></div>
                    </div>
                ) : notifications.length === 0 ? (
                    <div className="p-8 text-center text-gray-500">
                        <Bell className="h-12 w-12 mx-auto mb-3 opacity-20" />
                        <p>No notifications yet</p>
                    </div>
                ) : (
                    <div className="divide-y divide-gray-100">
                        {notifications.map(notif => (
                            <div
                                key={notif._id}
                                onClick={() => handleNotificationClick(notif)}
                                className={`w-full text-left p-4 flex items-center hover:bg-gray-50 transition ${!notif.isRead ? 'bg-blue-50/50' : ''}`}
                            >
                                <div className="mr-4">
                                    <div className="h-10 w-10 rounded-full bg-gray-100 flex items-center justify-center">
                                        {getIcon(notif.type)}
                                    </div>
                                </div>
                                <div className="flex-1">
                                    <p className="text-gray-800 text-sm">
                                        <span className="font-bold">{notif.sender?.username}</span> {notif.text.replace(notif.sender?.username, '')}
                                    </p>
                                    <p className="text-xs text-gray-400 mt-1">
                                        {new Date(notif.createdAt).toLocaleDateString()} at {new Date(notif.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                                    </p>
                                </div>
                                <div className="flex gap-2 ml-4">
                                    {!notif.isRead ? (
                                        <button
                                            onClick={(e) => handleMarkAsRead(e, notif)}
                                            className="inline-flex items-center gap-1 px-3 py-1 text-xs font-semibold text-white bg-blue-500 rounded-lg hover:bg-blue-600 transition"
                                            title="Mark as read"
                                        >
                                            <Check className="h-4 w-4" />
                                            Mark Read
                                        </button>
                                    ) : (
                                        <button
                                            onClick={(e) => handleMarkAsUnread(e, notif)}
                                            className="inline-flex items-center gap-1 px-3 py-1 text-xs font-semibold text-gray-700 bg-gray-200 rounded-lg hover:bg-gray-300 transition"
                                            title="Mark as unread"
                                        >
                                            <X className="h-4 w-4" />
                                            Mark Unread
                                        </button>
                                    )}
                                </div>
                                {!notif.isRead && (
                                    <div className="h-2 w-2 rounded-full bg-blue-500 ml-2"></div>
                                )}
                            </div>
                        ))}
                    </div>
                )}
            </div>
        </div>
    );
};

export default NotificationPage;
