import React, { useState } from 'react';
import { Heart, MessageSquare, Trash2, Share2, Send, X } from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import api from '../../services/api';
import toast from 'react-hot-toast';

const PostCard = ({ post, onDelete }) => {
    const { user } = useAuth();
    const [likes, setLikes] = useState(post.likes);
    const [comments, setComments] = useState(post.comments);
    const [showComments, setShowComments] = useState(false);
    const [commentText, setCommentText] = useState('');

    const isAuthor = user && (user._id === post.author._id || user.id === post.author._id);
    const isLiked = user && (likes.includes(user.id) || likes.includes(user._id));

    const formattedDate = new Date(post.createdAt).toLocaleDateString('en-US', {
        month: 'short',
        day: 'numeric',
        hour: '2-digit',
        minute: '2-digit'
    });

    const handleLike = async () => {
        try {
            const res = await api.put(`/posts/${post._id}/like`);
            setLikes(res.data);
        } catch (error) {
            console.error(error);
            toast.error("Failed to like post");
        }
    };

    const handleCommentSubmit = async (e) => {
        e.preventDefault();
        if (!commentText.trim()) return;

        try {
            const res = await api.post(`/posts/${post._id}/comment`, { text: commentText });
            setComments(res.data);
            setCommentText('');
        } catch (error) {
            toast.error('Failed to post comment');
        }
    };

    const handleDeleteComment = async (commentId) => {
        if (!window.confirm('Delete comment?')) return;
        try {
            const res = await api.delete(`/posts/${post._id}/comment/${commentId}`);
            setComments(res.data);
        } catch (error) {
            toast.error('Failed to delete comment');
        }
    };

    return (
        <div className="bg-white rounded-xl shadow-sm border border-gray-100 mb-6 overflow-hidden">
            <div className="p-4 flex justify-between items-start">
                <div className="flex items-center space-x-3">
                    <div className="h-10 w-10 rounded-full bg-gray-200 overflow-hidden">
                        {post.author.profilePicture ? (
                            <img src={post.author.profilePicture} alt={post.author.username} className="h-full w-full object-cover" />
                        ) : (
                            <div className="h-full w-full flex items-center justify-center bg-primary-100 text-primary-600 font-bold uppercase">
                                {post.author.username.charAt(0)}
                            </div>
                        )}
                    </div>
                    <div>
                        <div className="flex items-center space-x-2">
                            <h3 className="font-bold text-gray-900">{post.author.username}</h3>
                            {post.author.role === 'TEACHER' && (
                                <span className="bg-blue-100 text-blue-800 text-xs px-2 py-0.5 rounded-full font-medium">Teacher</span>
                            )}
                            {post.author.role === 'ADMIN' && (
                                <span className="bg-purple-100 text-purple-800 text-xs px-2 py-0.5 rounded-full font-medium">Admin</span>
                            )}
                        </div>
                        <p className="text-xs text-gray-500">{post.author.department} • {formattedDate}</p>
                    </div>
                </div>
                {(isAuthor || user?.role === 'ADMIN') && (
                    <button
                        onClick={() => onDelete(post._id)}
                        className="text-gray-400 hover:text-red-500 transition"
                    >
                        <Trash2 className="h-5 w-5" />
                    </button>
                )}
            </div>

            <div className="px-4 pb-2">
                <p className="text-gray-800 whitespace-pre-wrap">{post.text}</p>
            </div>

            {
                post.image && (
                    <div className="mt-2">
                        <img src={post.image.startsWith('http') ? post.image : `http://localhost:5000${post.image}`} alt="Post content" className="w-full object-cover max-h-[500px]" />
                    </div>
                )
            }

            <div className="px-4 py-3 border-t border-gray-50 flex justify-between items-center text-gray-500">
                <button
                    onClick={handleLike}
                    className={`flex items-center space-x-2 transition ${isLiked ? 'text-red-500' : 'hover:text-red-500'}`}
                >
                    <Heart className={`h-5 w-5 ${isLiked ? 'fill-current' : ''}`} />
                    <span>{likes.length > 0 ? likes.length : 'Like'}</span>
                </button>
                <button
                    onClick={() => setShowComments(!showComments)}
                    className="flex items-center space-x-2 hover:text-primary-600 transition"
                >
                    <MessageSquare className="h-5 w-5" />
                    <span>{comments.length > 0 ? comments.length : 'Comment'}</span>
                </button>
                <button className="flex items-center space-x-2 hover:text-primary-600 transition">
                    <Share2 className="h-5 w-5" />
                    <span>Share</span>
                </button>
            </div>

            {/* Comments Section */}
            {
                showComments && (
                    <div className="bg-gray-50 p-4 border-t border-gray-100">
                        {/* Comment Input */}
                        <form onSubmit={handleCommentSubmit} className="flex gap-2 mb-4">
                            <input
                                type="text"
                                placeholder="Write a comment..."
                                className="flex-1 rounded-full border border-gray-300 px-4 py-2 text-sm focus:outline-none focus:border-primary-500"
                                value={commentText}
                                onChange={(e) => setCommentText(e.target.value)}
                            />
                            <button
                                type="submit"
                                disabled={!commentText.trim()}
                                className="bg-primary-600 text-white p-2 rounded-full hover:bg-primary-700 disabled:opacity-50"
                            >
                                <Send className="h-4 w-4" />
                            </button>
                        </form>

                        {/* Comments List */}
                        <div className="space-y-4 max-h-60 overflow-y-auto pr-2">
                            {comments.map((comment, index) => (
                                <div key={comment._id || index} className="flex gap-3">
                                    <div className="h-8 w-8 rounded-full bg-gray-200 overflow-hidden flex-shrink-0">
                                        {comment.user?.profilePicture ? (
                                            <img src={comment.user.profilePicture} className="h-full w-full object-cover" />
                                        ) : (
                                            <div className="h-full w-full flex items-center justify-center bg-primary-100 text-primary-600 text-xs font-bold uppercase">
                                                {comment.user?.username?.charAt(0) || '?'}
                                            </div>
                                        )}
                                    </div>
                                    <div className="flex-1 bg-white p-3 rounded-2xl rounded-tl-none shadow-sm">
                                        <div className="flex justify-between items-start">
                                            <span className="font-bold text-sm text-gray-900">{comment.user?.username || 'Unknown'}</span>
                                            <span className="text-xs text-gray-400">
                                                {new Date(comment.createdAt).toLocaleDateString()}
                                            </span>
                                        </div>
                                        <p className="text-sm text-gray-700 mt-1">{comment.text}</p>
                                    </div>
                                    {(user && (user._id === comment.user?._id || user.id === comment.user?._id || isAuthor || user.role === 'ADMIN')) && (
                                        <button onClick={() => handleDeleteComment(comment._id)} className="text-gray-400 hover:text-red-500 self-center">
                                            <X className="h-4 w-4" />
                                        </button>
                                    )}
                                </div>
                            ))}
                        </div>
                    </div>
                )
            }
        </div >
    );
};

export default PostCard;
