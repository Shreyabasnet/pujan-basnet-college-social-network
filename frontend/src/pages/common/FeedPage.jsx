import React, { useState, useEffect } from 'react';
import CreatePost from '../../components/teacher/CreatePost.jsx';
import PostCard from '../../components/teacher/PostCard.jsx';
import api from '../../services/api';
import { useAuth } from '../../context/AuthContext';
import toast, { Toaster } from 'react-hot-toast';

const FeedPage = () => {
    const [posts, setPosts] = useState([]);
    const [loading, setLoading] = useState(true);
    const { user } = useAuth();

    const fetchPosts = async () => {
        try {
            const res = await api.get('/posts');
            setPosts(res.data);
            setLoading(false);
        } catch (error) {
            console.error(error);
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchPosts();
    }, []);

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

                {loading ? (
                    <div className="text-center py-10">Loading posts...</div>
                ) : posts.length === 0 ? (
                    <div className="text-center py-10 text-gray-500">No posts yet. Be the first to share!</div>
                ) : (
                    <div className="space-y-6">
                        {posts.map(post => (
                            <PostCard key={post._id} post={post} onDelete={handleDelete} />
                        ))}
                    </div>
                )}
            </div>
        </div>
    );
};

export default FeedPage;
