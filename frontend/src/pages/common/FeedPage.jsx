import React, { useState, useEffect, useMemo } from 'react';
import { useLocation } from 'react-router-dom';
import CreatePost from '../../components/teacher/CreatePost.jsx';
import PostCard from '../../components/teacher/PostCard.jsx';
import api from '../../services/api';
import { useAuth } from '../../context/AuthContext';
import toast, { Toaster } from 'react-hot-toast';

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
            setPosts(posts.filter(p => p._id !== postId));
            toast.success("Post deleted");
        } catch (error) {
            toast.error("Failed to delete post");
        }
    }

    return (
        <div className="min-h-[calc(100vh-64px)] bg-gray-50 py-8 px-4">
            <Toaster position="top-right" />
            <div className="max-w-2xl mx-auto">
                <CreatePost onPostCreated={fetchPosts} />

                {error && (
                    <div className="mb-6 rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">
                        {error}
                    </div>
                )}

                {loading ? (
                    <div className="text-center py-10">Loading posts...</div>
                ) : posts.length === 0 ? (
                    <div className="text-center py-10 text-gray-500">No posts yet. Be the first to share!</div>
                ) : (
                    <div className="space-y-6">
                        {posts.map(post => (
                            <PostCard
                                key={post._id}
                                post={post}
                                onDelete={handleDelete}
                                isHighlighted={selectedPostId === post._id}
                            />
                        ))}
                    </div>
                )}
            </div>
        </div>
    );
};

export default FeedPage;
