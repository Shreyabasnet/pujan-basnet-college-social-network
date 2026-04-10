import React, { useEffect, useMemo, useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import CreatePost from '../../components/teacher/CreatePost.jsx';
import PostCard from '../../components/teacher/PostCard.jsx';
import api from '../../services/api';
import { useAuth } from '../../context/AuthContext';
import toast, { Toaster } from 'react-hot-toast';
import {
    ArrowRight,
    CalendarDays,
    FileText,
    MessageSquare,
    Sparkles,
    TrendingUp,
    Users,
} from 'lucide-react';

const FeedPage = () => {
    const [posts, setPosts] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');
    const { user } = useAuth();
    const location = useLocation();

    const selectedPostId = useMemo(() => {
        const params = new URLSearchParams(location.search);
        return params.get('post');
    }, [location.search]);

    const feedStats = useMemo(() => {
        const authorIds = new Set();
        let imagePosts = 0;
        let documentPosts = 0;
        let commentTotal = 0;

        posts.forEach((post) => {
            const authorId = post?.author?._id || post?.author?.id;
            if (authorId) {
                authorIds.add(authorId);
            }

            if (post?.image) imagePosts += 1;
            if (post?.fileUrl) documentPosts += 1;
            if (Array.isArray(post?.comments)) commentTotal += post.comments.length;
        });

        return [
            {
                label: 'Posts today',
                value: posts.length,
                helper: 'Fresh updates in the feed',
                icon: Sparkles,
            },
            {
                label: 'Active authors',
                value: authorIds.size,
                helper: 'Students, teachers, and admins',
                icon: Users,
            },
            {
                label: 'Media shares',
                value: imagePosts + documentPosts,
                helper: 'Images and resources attached',
                icon: FileText,
            },
            {
                label: 'Comments',
                value: commentTotal,
                helper: 'Ongoing discussions',
                icon: MessageSquare,
            },
        ];
    }, [posts]);

    const quickLinks = [
        { to: '/events', label: 'Upcoming events', helper: 'See what is happening next', icon: CalendarDays },
        { to: '/announcements', label: 'Announcements', helper: 'Catch important notices', icon: TrendingUp },
        { to: '/search', label: 'Find people', helper: 'Search classmates and staff', icon: Users },
        { to: '/chat', label: 'Open chat', helper: 'Continue a conversation', icon: MessageSquare },
    ];

    const fetchPosts = async () => {
        setLoading(true);
        setError('');
        try {
            const res = await api.get('/posts');
            const nextPosts = Array.isArray(res.data) ? res.data : res.data?.posts;
            setPosts(Array.isArray(nextPosts) ? nextPosts : []);
        } catch (error) {
            console.error(error);
            setError('Unable to load the feed right now.');
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchPosts();
    }, []);

    useEffect(() => {
        if (!selectedPostId || loading || posts.length === 0) return;

        const node = document.getElementById(`post-${selectedPostId}`);
        if (node) {
            node.scrollIntoView({ behavior: 'smooth', block: 'center' });
        } else {
            toast.error('Shared post not found');
        }
    }, [selectedPostId, loading, posts]);

    const handleDelete = async (postId) => {
        if (!window.confirm("Are you sure you want to delete this post?")) return;
        try {
            await api.delete(`/posts/${postId}`);
            setPosts((currentPosts) => currentPosts.filter((post) => post._id !== postId));
            toast.success("Post deleted");
        } catch (error) {
            toast.error("Failed to delete post");
        }
    }

    const highlightText = user?.role === 'TEACHER'
        ? 'Share class updates, resources, and guidance from one polished space.'
        : 'Share campus moments, resources, and conversations in one place.';

    return (
        <div className="relative min-h-[calc(100vh-64px)] overflow-hidden bg-slate-50 py-8 px-4">
            <Toaster position="top-right" />
            <div className="absolute inset-x-0 top-0 -z-10 h-80 bg-[radial-gradient(circle_at_top_left,rgba(59,130,246,0.22),transparent_35%),radial-gradient(circle_at_top_right,rgba(14,165,233,0.18),transparent_28%)]" />
            <div className="absolute left-8 top-20 -z-10 h-56 w-56 rounded-full bg-primary-200/30 blur-3xl" />
            <div className="absolute right-8 top-40 -z-10 h-72 w-72 rounded-full bg-cyan-200/30 blur-3xl" />

            <div className="mx-auto max-w-7xl">
                <section className="relative overflow-hidden rounded-[2rem] border border-white/70 bg-white/80 p-6 shadow-[0_30px_90px_-45px_rgba(15,23,42,0.45)] backdrop-blur">
                    <div className="absolute inset-0 bg-gradient-to-br from-primary-50 via-white to-cyan-50 opacity-90" />
                    <div className="relative grid gap-8 lg:grid-cols-[minmax(0,1.2fr)_minmax(280px,0.8fr)] lg:items-center">
                        <div className="space-y-6">
                            <span className="inline-flex items-center gap-2 rounded-full border border-primary-100 bg-white px-4 py-2 text-xs font-semibold uppercase tracking-[0.24em] text-primary-700 shadow-sm">
                                <Sparkles className="h-4 w-4" />
                                Campus feed
                            </span>
                            <div className="space-y-3">
                                <h1 className="max-w-2xl text-3xl font-black tracking-tight text-slate-900 sm:text-4xl lg:text-5xl">
                                    Hello {user?.username || 'there'}, your campus network is ready to look premium.
                                </h1>
                                <p className="max-w-2xl text-base leading-7 text-slate-600 sm:text-lg">
                                    {highlightText}
                                </p>
                            </div>
                            <div className="flex flex-wrap gap-3">
                                <Link
                                    to="/search"
                                    className="inline-flex items-center gap-2 rounded-full bg-slate-900 px-5 py-3 text-sm font-semibold text-white shadow-lg shadow-slate-900/10 transition hover:-translate-y-0.5 hover:bg-slate-800"
                                >
                                    Discover people
                                    <ArrowRight className="h-4 w-4" />
                                </Link>
                                <Link
                                    to="/events"
                                    className="inline-flex items-center gap-2 rounded-full border border-slate-200 bg-white px-5 py-3 text-sm font-semibold text-slate-700 transition hover:-translate-y-0.5 hover:border-primary-200 hover:text-primary-700"
                                >
                                    View events
                                </Link>
                            </div>
                        </div>

                        <div className="grid grid-cols-2 gap-3">
                            {feedStats.map((stat) => {
                                const StatIcon = stat.icon;

                                return (
                                    <div key={stat.label} className="rounded-3xl border border-white/70 bg-white/90 p-4 shadow-sm">
                                        <div className="mb-4 flex h-11 w-11 items-center justify-center rounded-2xl bg-primary-50 text-primary-600">
                                            <StatIcon className="h-5 w-5" />
                                        </div>
                                        <p className="text-2xl font-black text-slate-900">{stat.value}</p>
                                        <p className="mt-1 text-sm font-semibold text-slate-700">{stat.label}</p>
                                        <p className="mt-1 text-xs leading-5 text-slate-500">{stat.helper}</p>
                                    </div>
                                );
                            })}
                        </div>
                    </div>
                </section>

                <div className="mt-8 grid gap-8 lg:grid-cols-[minmax(0,1fr)_320px]">
                    <main className="space-y-6">
                        <CreatePost onPostCreated={fetchPosts} />

                        {error && (
                            <div className="rounded-2xl border border-rose-200 bg-rose-50 px-4 py-3 text-sm text-rose-700 shadow-sm">
                                {error}
                            </div>
                        )}

                        {loading ? (
                            <div className="space-y-4">
                                {[0, 1, 2].map((index) => (
                                    <div key={index} className="rounded-[1.5rem] border border-slate-200 bg-white p-5 shadow-sm">
                                        <div className="flex items-center gap-4">
                                            <div className="h-12 w-12 animate-pulse rounded-full bg-slate-200" />
                                            <div className="flex-1 space-y-2">
                                                <div className="h-4 w-40 animate-pulse rounded-full bg-slate-200" />
                                                <div className="h-3 w-24 animate-pulse rounded-full bg-slate-100" />
                                            </div>
                                        </div>
                                        <div className="mt-5 space-y-3">
                                            <div className="h-4 w-full animate-pulse rounded-full bg-slate-100" />
                                            <div className="h-4 w-5/6 animate-pulse rounded-full bg-slate-100" />
                                            <div className="h-48 rounded-3xl bg-slate-100" />
                                        </div>
                                    </div>
                                ))}
                            </div>
                        ) : posts.length === 0 ? (
                            <div className="rounded-[1.75rem] border border-dashed border-primary-200 bg-white p-10 text-center shadow-sm">
                                <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-2xl bg-primary-50 text-primary-600">
                                    <Sparkles className="h-7 w-7" />
                                </div>
                                <h2 className="mt-5 text-2xl font-bold text-slate-900">No posts yet</h2>
                                <p className="mt-2 text-sm leading-6 text-slate-600">Be the first to share a resource, question, or campus update.</p>
                                <div className="mt-6 flex flex-wrap justify-center gap-3">
                                    <Link to="/announcements" className="rounded-full border border-slate-200 bg-white px-4 py-2 text-sm font-semibold text-slate-700 transition hover:border-primary-200 hover:text-primary-700">
                                        Browse announcements
                                    </Link>
                                    <Link to="/chat" className="rounded-full bg-primary-600 px-4 py-2 text-sm font-semibold text-white transition hover:bg-primary-700">
                                        Start a conversation
                                    </Link>
                                </div>
                            </div>
                        ) : (
                            <div className="space-y-6">
                                {posts.map((post) => (
                                    <PostCard
                                        key={post._id}
                                        post={post}
                                        onDelete={handleDelete}
                                        isHighlighted={selectedPostId === post._id}
                                    />
                                ))}
                            </div>
                        )}
                    </main>

                    <aside className="hidden lg:block">
                        <div className="sticky top-24 space-y-6">
                            <section className="rounded-[1.5rem] border border-slate-200 bg-white p-5 shadow-sm">
                                <div className="mb-4 flex items-center justify-between">
                                    <div>
                                        <p className="text-xs font-semibold uppercase tracking-[0.22em] text-slate-400">Quick links</p>
                                        <h2 className="mt-1 text-lg font-bold text-slate-900">Move faster</h2>
                                    </div>
                                </div>
                                <div className="space-y-3">
                                    {quickLinks.map((link) => {
                                        const QuickIcon = link.icon;

                                        return (
                                            <Link
                                                key={link.to}
                                                to={link.to}
                                                className="group flex items-start gap-3 rounded-2xl border border-slate-100 bg-slate-50/80 p-3 transition hover:-translate-y-0.5 hover:border-primary-100 hover:bg-primary-50/60"
                                            >
                                                <div className="mt-0.5 flex h-10 w-10 items-center justify-center rounded-xl bg-white text-primary-600 shadow-sm">
                                                    <QuickIcon className="h-4 w-4" />
                                                </div>
                                                <div className="flex-1">
                                                    <p className="font-semibold text-slate-900 group-hover:text-primary-700">{link.label}</p>
                                                    <p className="text-xs leading-5 text-slate-500">{link.helper}</p>
                                                </div>
                                                <ArrowRight className="mt-2 h-4 w-4 text-slate-300 transition group-hover:translate-x-0.5 group-hover:text-primary-500" />
                                            </Link>
                                        );
                                    })}
                                </div>
                            </section>

                            <section className="rounded-[1.5rem] border border-slate-200 bg-white p-5 shadow-sm">
                                <p className="text-xs font-semibold uppercase tracking-[0.22em] text-slate-400">Posting tips</p>
                                <h2 className="mt-1 text-lg font-bold text-slate-900">Make every post count</h2>
                                <div className="mt-4 space-y-3 text-sm text-slate-600">
                                    <div className="rounded-2xl bg-slate-50 p-3">Lead with the key message so readers understand the value immediately.</div>
                                    <div className="rounded-2xl bg-slate-50 p-3">Attach a file or image when a resource needs context or proof.</div>
                                    <div className="rounded-2xl bg-slate-50 p-3">Keep discussions active by following up in the comments.</div>
                                </div>
                            </section>

                            <section className="rounded-[1.5rem] border border-primary-100 bg-gradient-to-br from-primary-600 to-cyan-600 p-5 text-white shadow-lg shadow-primary-600/20">
                                <p className="text-xs font-semibold uppercase tracking-[0.22em] text-white/70">Spotlight</p>
                                <h2 className="mt-1 text-xl font-black">A feed that feels alive</h2>
                                <p className="mt-2 text-sm leading-6 text-white/80">
                                    Every post, comment, and resource now sits in a more editorial layout to make the app feel closer to a modern campus network.
                                </p>
                            </section>
                        </div>
                    </aside>
                </div>
            </div>
        </div>
    );
};

export default FeedPage;
