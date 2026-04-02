import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { Search, Bell } from 'lucide-react';
import io from 'socket.io-client';
import api from '../../services/api';

import { SOCKET_ENDPOINT } from '../../config/constants.js';

const Navbar = () => {
    const { user, logout } = useAuth();
    const navigate = useNavigate();
    const [searchTerm, setSearchTerm] = useState('');
    const [unreadCount, setUnreadCount] = useState(0);

    useEffect(() => {
        if (user) {
            const socket = io(SOCKET_ENDPOINT);
            socket.emit("join_room", user.id || user._id);

            socket.on("notification", () => {
                setUnreadCount(prev => prev + 1);
            });

            // Initial fetch
            fetchUnreadCount();

            return () => socket.disconnect();
        }
    }, [user]);

    const fetchUnreadCount = async () => {
        try {
            const res = await api.get('/notifications');
            const unread = res.data.filter(n => !n.isRead).length;
            setUnreadCount(unread);
        } catch (error) {
            console.error(error);
        }
    };

    const handleSearch = (e) => {
        e.preventDefault();
        if (searchTerm.trim()) {
            navigate(`/search?q=${searchTerm.trim()}`);
            setSearchTerm('');
        }
    };

    return (
        <nav className="bg-white shadow-sm border-b border-gray-200 sticky top-0 z-50">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="flex justify-between h-16">
                    <div className="flex items-center">
                        <Link 
                            to={user ? (user.role === 'ADMIN' ? '/admin/dashboard' : user.role === 'TEACHER' ? '/teacher/dashboard' : '/student/dashboard') : "/"} 
                            className="flex-shrink-0 flex items-center"
                        >
                            <div className="h-8 w-8 bg-primary-600 rounded-lg flex items-center justify-center mr-2">
                                <span className="text-white font-bold text-lg">C</span>
                            </div>
                            <span className="font-bold text-xl text-gray-900">CollegeSocial</span>
                        </Link>

                        {/* Search Bar */}
                        {user && (
                            <form onSubmit={handleSearch} className="ml-8 hidden md:block">
                                <div className="relative">
                                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                                        <Search className="h-4 w-4 text-gray-400" />
                                    </div>
                                    <input
                                        type="text"
                                        placeholder="Search..."
                                        className="pl-10 pr-4 py-1.5 bg-gray-100 border-none rounded-full text-sm focus:ring-2 focus:ring-primary-500 w-64 transition focus:w-72"
                                        value={searchTerm}
                                        onChange={(e) => setSearchTerm(e.target.value)}
                                    />
                                </div>
                            </form>
                        )}
                    </div>
                    <div className="flex items-center space-x-4">
                        <Link to="/feed" className="text-gray-600 hover:text-primary-600 font-medium transition">Feed</Link>
                        {user && (
                            <Link
                                to={user.role === 'ADMIN' ? '/admin/dashboard' : user.role === 'TEACHER' ? '/teacher/dashboard' : '/student/dashboard'}
                                className="text-gray-600 hover:text-primary-600 font-medium transition"
                            >
                                Dashboard
                            </Link>
                        )}
                        <Link to="/events" className="text-gray-600 hover:text-primary-600 font-medium transition">Events</Link>
                        <Link to="/chat" className="text-gray-600 hover:text-primary-600 font-medium transition">Chat</Link>
                        {user ? (
                            <div className="flex items-center space-x-4">
                                <Link to="/notifications" className="relative text-gray-500 hover:text-primary-600 transition">
                                    <Bell className="h-6 w-6" />
                                    {unreadCount > 0 && (
                                        <span className="absolute -top-1 -right-1 bg-red-500 text-white text-[10px] h-4 w-4 flex items-center justify-center rounded-full font-bold">
                                            {unreadCount > 9 ? '9+' : unreadCount}
                                        </span>
                                    )}
                                </Link>

                                <Link to="/profile" className="flex items-center space-x-2 text-gray-700 hover:text-primary-600 transition">
                                    <img
                                        src={user.profilePicture || `https://ui-avatars.com/api/?name=${user.username}&background=0D8ABC&color=fff`}
                                        alt="Profile"
                                        className="h-8 w-8 rounded-full object-cover border border-gray-200"
                                    />
                                    <span className="font-medium hidden sm:block">{user.username}</span>
                                </Link>

                                <button
                                    onClick={logout}
                                    className="text-gray-500 hover:text-red-600 font-medium transition"
                                >
                                    Logout
                                </button>
                            </div>
                        ) : (
                            <>
                                <Link to="/login" className="text-gray-600 hover:text-primary-600 font-medium transition">Login</Link>
                                <Link to="/register" className="bg-primary-600 text-white px-4 py-2 rounded-md hover:bg-primary-700 transition font-medium shadow-sm">
                                    Sign Up
                                </Link>
                            </>
                        )}
                    </div>
                </div>
            </div>
        </nav>
    );
};

export default Navbar;
