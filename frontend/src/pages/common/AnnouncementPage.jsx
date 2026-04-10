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
        <div className="space-y-6">
            {/* Header Section */}
            <section className="relative overflow-hidden rounded-[2rem] border border-white/70 bg-gradient-to-br from-primary-600 via-cyan-600 to-sky-700 p-6 text-white shadow-[0_30px_90px_-45px_rgba(15,23,42,0.5)]">
                <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_right,rgba(255,255,255,0.18),transparent_28%)]" />
                <div className="relative space-y-2">
                    <span className="inline-flex items-center gap-2 rounded-full border border-white/20 bg-white/10 px-4 py-2 text-xs font-semibold uppercase tracking-[0.24em] text-white/80">
                        <Megaphone className="h-4 w-4" />
                        Announcements
                    </span>
                    <h1 className="text-3xl font-black tracking-tight sm:text-4xl">Latest Updates</h1>
                    <p className="max-w-2xl text-sm leading-7 text-white/80 sm:text-base">
                        Stay informed with the latest academic and platform updates from your institution.
                    </p>
                </div>
            </section>

            <Toaster position="top-right" />

            {/* Create Announcement Form */}
            {canManage && (
                <form onSubmit={handleCreateAnnouncement} className="rounded-[1.75rem] border border-slate-200 bg-white p-6 shadow-[0_20px_60px_-35px_rgba(15,23,42,0.35)]">
                    <div className="mb-5">
                        <p className="text-xs font-semibold uppercase tracking-[0.24em] text-slate-400">Create</p>
                        <h2 className="mt-1 text-2xl font-black text-slate-900">New Announcement</h2>
                    </div>
                    <div className="space-y-4">
                        <input
                            type="text"
                            placeholder="Announcement title"
                            value={title}
                            onChange={(e) => setTitle(e.target.value)}
                            className="w-full rounded-xl border border-slate-200 bg-slate-50 px-4 py-3 text-sm font-medium text-slate-900 placeholder-slate-400 transition focus:border-primary-500 focus:bg-white focus:outline-none focus:ring-2 focus:ring-primary-500/10"
                        />
                        <textarea
                            rows="5"
                            placeholder="Write announcement details..."
                            value={content}
                            onChange={(e) => setContent(e.target.value)}
                            className="w-full rounded-xl border border-slate-200 bg-slate-50 px-4 py-3 text-sm font-medium text-slate-900 placeholder-slate-400 transition focus:border-primary-500 focus:bg-white focus:outline-none focus:ring-2 focus:ring-primary-500/10 resize-none"
                        />
                        <div className="flex justify-end">
                            <button
                                type="submit"
                                className="inline-flex items-center justify-center rounded-full bg-primary-600 px-6 py-3 text-sm font-semibold text-white shadow-lg shadow-primary-600/40 transition hover:bg-primary-700 hover:-translate-y-0.5"
                            >
                                Publish
                            </button>
                        </div>
                    </div>
                </form>
            )}

            {/* Announcements List */}
            <section className="rounded-[1.75rem] border border-slate-200 bg-white p-6 shadow-[0_20px_60px_-35px_rgba(15,23,42,0.35)]">
                <div className="mb-6">
                    <p className="text-xs font-semibold uppercase tracking-[0.24em] text-slate-400">Feed</p>
                    <h2 className="mt-1 text-2xl font-black text-slate-900">All Announcements</h2>
                </div>

                {loading ? (
                    <div className="flex items-center justify-center py-12">
                        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary-600"></div>
                    </div>
                ) : announcements.length === 0 ? (
                    <div className="rounded-2xl border border-dashed border-slate-200 bg-slate-50 p-8 text-center">
                        <Megaphone className="h-12 w-12 mx-auto mb-3 opacity-30 text-slate-400" />
                        <p className="text-slate-500 font-medium">No announcements yet</p>
                    </div>
                ) : (
                    <div className="space-y-4">
                        {announcements.map((item) => (
                            <div key={item._id} className="rounded-2xl border border-slate-100 bg-slate-50 p-5 transition hover:border-slate-200 hover:bg-slate-100/50">
                                <div className="flex items-start justify-between gap-3">
                                    <div className="flex-1">
                                        <h3 className="text-lg font-bold text-slate-900">{item.title}</h3>
                                        <p className="text-xs font-medium text-slate-500 mt-2">
                                            Posted by <span className="font-semibold text-slate-700">{item.createdBy?.username || 'Admin'}</span> on {new Date(item.createdAt).toLocaleDateString()} at {new Date(item.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                                        </p>
                                    </div>
                                    {canManage && (
                                        <button
                                            onClick={() => handleDeleteAnnouncement(item._id)}
                                            className="rounded-full p-2 text-slate-400 transition hover:bg-red-50 hover:text-red-500"
                                            title="Delete announcement"
                                        >
                                            <Trash2 className="h-5 w-5" />
                                        </button>
                                    )}
                                </div>
                                <p className="text-sm text-slate-700 mt-4 leading-relaxed whitespace-pre-wrap">{item.content}</p>
                            </div>
                        ))}
                    </div>
                )}
            </section>
        </div>
    );
};

export default AnnouncementPage;
