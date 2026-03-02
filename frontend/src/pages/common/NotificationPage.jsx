import React, { useState, useEffect } from 'react';
import api from '../../services/api';
import { Heart, MessageSquare, Bell } from 'lucide-react';

const NotificationPage = () => {
    const [notifications, setNotifications] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        fetchNotifications();
    }, []);

    const fetchNotifications = async () => {
        try {
            const res = await api.get('/notifications');
            setNotifications(res.data);
            // Mark all as read when page loads (only if there are unread notifications)
            const hasUnread = res.data.some(n => !n.isRead);
            if (hasUnread) {
                await api.put('/notifications/read-all');
            }
        } catch (error) {
            console.error(error);
        } finally {
            setLoading(false);
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
        <div className="min-h-[calc(100vh-64px)] bg-gray-50 py-8 px-4">
            <div className="max-w-2xl mx-auto">
                <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
                    <div className="p-4 border-b border-gray-100 flex justify-between items-center">
                        <h1 className="text-xl font-bold text-gray-900">Notifications</h1>
                        <span className="text-xs text-gray-500">{notifications.length} Total</span>
                    </div>

                    {loading ? (
                        <div className="p-8 text-center">
                            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary-600 mx-auto"></div>
                        </div>
                    ) : notifications.length === 0 ? (
                        <div className="p-8 text-center text-gray-500">
                            <Bell className="h-12 w-12 mx-auto mb-3 opacity-20" />
                            <p>No notifications yet</p>
                        </div>
                    ) : (
                        <div className="divide-y divide-gray-50">
                            {notifications.map(notif => (
                                <div key={notif._id} className={`p-4 flex items-center hover:bg-gray-50 transition ${!notif.isRead ? 'bg-blue-50/50' : ''}`}>
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
                                    {!notif.isRead && (
                                        <div className="h-2 w-2 rounded-full bg-blue-500 ml-2"></div>
                                    )}
                                </div>
                            ))}
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
};

export default NotificationPage;
