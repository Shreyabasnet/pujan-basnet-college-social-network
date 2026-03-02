import React, { useState, useEffect } from 'react';
import { useLocation, Link } from 'react-router-dom';
import api from '../../services/api';
import { User, FileText, Calendar, Search as SearchIcon } from 'lucide-react';

const SearchPage = () => {
    const location = useLocation();
    const query = new URLSearchParams(location.search).get('q');
    const [results, setResults] = useState({ users: [], posts: [], events: [] });
    const [loading, setLoading] = useState(false);
    const [activeTab, setActiveTab] = useState('all');

    useEffect(() => {
        if (query) {
            handleSearch();
        }
    }, [query]);

    const handleSearch = async () => {
        setLoading(true);
        try {
            const res = await api.get(`/search?q=${query}`);
            setResults(res.data);
        } catch (error) {
            console.error(error);
        } finally {
            setLoading(false);
        }
    };

    const TabButton = ({ id, label, icon: Icon, count }) => (
        <button
            onClick={() => setActiveTab(id)}
            className={`flex items-center space-x-2 px-4 py-2 border-b-2 font-medium transition ${activeTab === id ? 'border-primary-600 text-primary-600' : 'border-transparent text-gray-500 hover:text-gray-700'}`}
        >
            <Icon className="h-4 w-4" />
            <span>{label}</span>
            <span className="bg-gray-100 text-gray-600 py-0.5 px-2 rounded-full text-xs ml-2">{count}</span>
        </button>
    );

    return (
        <div className="min-h-[calc(100vh-64px)] bg-gray-50 py-8 px-4">
            <div className="max-w-4xl mx-auto">
                <h1 className="text-2xl font-bold text-gray-900 mb-6 flex items-center">
                    <SearchIcon className="h-6 w-6 mr-3 text-gray-400" />
                    Search Results for "{query}"
                </h1>

                {/* Tabs */}
                <div className="flex border-b border-gray-200 mb-6 overflow-x-auto">
                    <TabButton id="all" label="All" icon={SearchIcon} count={results.users.length + results.posts.length + results.events.length} />
                    <TabButton id="users" label="People" icon={User} count={results.users.length} />
                    <TabButton id="posts" label="Posts" icon={FileText} count={results.posts.length} />
                    <TabButton id="events" label="Events" icon={Calendar} count={results.events.length} />
                </div>

                {loading ? (
                    <div className="text-center py-10">
                        <div className="animate-spin rounded-full h-10 w-10 border-b-2 border-primary-600 mx-auto"></div>
                    </div>
                ) : (
                    <div className="space-y-8">
                        {/* Users Section */}
                        {(activeTab === 'all' || activeTab === 'users') && results.users.length > 0 && (
                            <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
                                <h2 className="text-lg font-bold text-gray-800 mb-4 flex items-center">
                                    <User className="h-5 w-5 mr-2 text-primary-500" /> People
                                </h2>
                                <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
                                    {results.users.map(user => (
                                        <div key={user._id} className="flex items-center space-x-3 p-3 rounded-lg hover:bg-gray-50 border border-gray-100 transition">
                                            <div className="h-10 w-10 rounded-full bg-gray-200 overflow-hidden flex-shrink-0">
                                                {user.profilePicture ? (
                                                    <img src={user.profilePicture} alt={user.username} className="h-full w-full object-cover" />
                                                ) : (
                                                    <div className="h-full w-full flex items-center justify-center bg-primary-100 text-primary-600 font-bold uppercase">
                                                        {user.username.charAt(0)}
                                                    </div>
                                                )}
                                            </div>
                                            <div>
                                                <p className="font-bold text-gray-900 text-sm">{user.username}</p>
                                                <p className="text-xs text-gray-500">{user.department} • {user.role}</p>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        )}

                        {/* Posts Section */}
                        {(activeTab === 'all' || activeTab === 'posts') && results.posts.length > 0 && (
                            <div className="space-y-4">
                                <h2 className="text-lg font-bold text-gray-800 flex items-center">
                                    <FileText className="h-5 w-5 mr-2 text-primary-500" /> Posts
                                </h2>
                                {results.posts.map(post => (
                                    <div key={post._id} className="bg-white rounded-xl shadow-sm border border-gray-100 p-5">
                                        <div className="flex items-center mb-3">
                                            <div className="font-bold text-gray-900 text-sm mr-2">{post.author?.username || 'Unknown'}</div>
                                            <div className="text-gray-400 text-xs">{new Date(post.createdAt).toLocaleDateString()}</div>
                                        </div>
                                        <p className="text-gray-800 mb-2">{post.text}</p>
                                        {post.image && <img src={post.image.startsWith('http') ? post.image : `http://localhost:5000${post.image}`} className="w-full h-48 object-cover rounded-lg" />}
                                    </div>
                                ))}
                            </div>
                        )}

                        {/* Events Section */}
                        {(activeTab === 'all' || activeTab === 'events') && results.events.length > 0 && (
                            <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
                                <h2 className="text-lg font-bold text-gray-800 mb-4 flex items-center">
                                    <Calendar className="h-5 w-5 mr-2 text-primary-500" /> Events
                                </h2>
                                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                                    {results.events.map(event => (
                                        <div key={event._id} className="border border-gray-200 rounded-lg p-4 hover:shadow-md transition">
                                            <div className="text-primary-600 font-bold text-xs uppercase mb-1">
                                                {new Date(event.date).toLocaleDateString()} @ {event.time}
                                            </div>
                                            <h3 className="font-bold text-gray-900 mb-2">{event.title}</h3>
                                            <p className="text-gray-500 text-sm line-clamp-2">{event.description}</p>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        )}

                        {/* Empty State */}
                        {!loading && results.users.length === 0 && results.posts.length === 0 && results.events.length === 0 && (
                            <div className="text-center py-16 text-gray-500">
                                <SearchIcon className="h-12 w-12 mx-auto mb-3 opacity-20" />
                                <p>No results found for "{query}"</p>
                            </div>
                        )}
                    </div>
                )}
            </div>
        </div>
    );
};

export default SearchPage;
