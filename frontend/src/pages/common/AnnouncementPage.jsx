import React, { useEffect, useState } from 'react';
import api from '../../services/api';
import { useAuth } from '../../context/AuthContext';
import { Megaphone, Trash2 } from 'lucide-react';
import toast, { Toaster } from 'react-hot-toast';

const AnnouncementPage = () => {
    const { user } = useAuth();
    const [announcements, setAnnouncements] = useState([]);
    const [loading, setLoading] = useState(true);
    const [title, setTitle] = useState('');
    const [content, setContent] = useState('');

    const canManage = user?.role === 'ADMIN' || user?.role === 'TEACHER';

    const fetchAnnouncements = async () => {
        try {
            const res = await api.get('/announcements');
            setAnnouncements(res.data || []);
        } catch (error) {
            console.error(error);
            toast.error('Failed to load announcements');
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchAnnouncements();
    }, []);

    const handleCreateAnnouncement = async (e) => {
        e.preventDefault();

        if (!title.trim() || !content.trim()) {
            toast.error('Title and content are required');
            return;
        }

        try {
            const res = await api.post('/announcements', {
                title,
                content,
            });

            setAnnouncements((prev) => [res.data, ...prev]);
            setTitle('');
            setContent('');
            toast.success('Announcement created');
        } catch (error) {
            console.error(error);
            toast.error(error.response?.data?.message || 'Failed to create announcement');
        }
    };

    const handleDeleteAnnouncement = async (id) => {
        if (!window.confirm('Delete this announcement?')) return;

        try {
            await api.delete(`/announcements/${id}`);
            setAnnouncements((prev) => prev.filter((item) => item._id !== id));
            toast.success('Announcement deleted');
        } catch (error) {
            console.error(error);
            toast.error(error.response?.data?.message || 'Failed to delete announcement');
        }
    };

    return (
        <div className="min-h-[calc(100vh-64px)] bg-gray-50 py-8 px-4">
            <Toaster position="top-right" />
            <div className="max-w-3xl mx-auto space-y-6">
                <div className="bg-gradient-to-r from-primary-600 to-primary-700 rounded-xl shadow p-6 text-white">
                    <h1 className="text-3xl font-bold">Announcements</h1>
                    <p className="mt-2 text-primary-100">Latest academic and platform updates</p>
                </div>

                {canManage && (
                    <form onSubmit={handleCreateAnnouncement} className="bg-white rounded-xl shadow-sm border border-gray-100 p-5 space-y-4">
                        <h2 className="text-lg font-semibold text-gray-900">Create Announcement</h2>
                        <input
                            type="text"
                            placeholder="Announcement title"
                            value={title}
                            onChange={(e) => setTitle(e.target.value)}
                            className="w-full rounded-lg border border-gray-300 px-3 py-2 focus:outline-none focus:ring-2 focus:ring-primary-500"
                        />
                        <textarea
                            rows="4"
                            placeholder="Write announcement details..."
                            value={content}
                            onChange={(e) => setContent(e.target.value)}
                            className="w-full rounded-lg border border-gray-300 px-3 py-2 focus:outline-none focus:ring-2 focus:ring-primary-500 resize-none"
                        />
                        <div className="flex justify-end">
                            <button
                                type="submit"
                                className="px-4 py-2 bg-primary-600 text-white rounded-lg hover:bg-primary-700"
                            >
                                Publish
                            </button>
                        </div>
                    </form>
                )}

                <div className="space-y-4">
                    {loading ? (
                        <div className="text-center text-gray-500 py-8">Loading announcements...</div>
                    ) : announcements.length === 0 ? (
                        <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-8 text-center text-gray-500">
                            <Megaphone className="h-10 w-10 mx-auto mb-2 opacity-40" />
                            No announcements yet
                        </div>
                    ) : (
                        announcements.map((item) => (
                            <div key={item._id} className="bg-white rounded-xl shadow-sm border border-gray-100 p-5">
                                <div className="flex items-start justify-between gap-3">
                                    <div>
                                        <h3 className="text-xl font-bold text-gray-900">{item.title}</h3>
                                        <p className="text-xs text-gray-500 mt-1">
                                            Posted by {item.createdBy?.username || 'Unknown'} on {new Date(item.createdAt).toLocaleString()}
                                        </p>
                                    </div>
                                    {canManage && (
                                        <button
                                            onClick={() => handleDeleteAnnouncement(item._id)}
                                            className="text-gray-400 hover:text-red-500 p-1"
                                            title="Delete announcement"
                                        >
                                            <Trash2 className="h-5 w-5" />
                                        </button>
                                    )}
                                </div>
                                <p className="text-gray-700 mt-3 whitespace-pre-wrap">{item.content}</p>
                            </div>
                        ))
                    )}
                </div>
            </div>
        </div>
    );
};

export default AnnouncementPage;
