import React, { useState } from 'react';
import { Heart, MessageSquare, Trash2, Share2, Send, X, File, Download, Edit2, Image as ImageIcon } from 'lucide-react';

import { useAuth } from '../../context/AuthContext';
import api from '../../services/api';
import toast from 'react-hot-toast';

const PostCard = ({ post, onDelete }) => {
    const { user } = useAuth();
    const [likes, setLikes] = useState(post.likes);
    const [comments, setComments] = useState(post.comments);
    const [showComments, setShowComments] = useState(false);
    const [commentText, setCommentText] = useState('');

    // Editing state
    const [isEditing, setIsEditing] = useState(false);
    const [editText, setEditText] = useState(post.text);
    const [editImage, setEditImage] = useState(null);
    const [editFile, setEditFile] = useState(null);
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [currentPost, setCurrentPost] = useState(post);


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

    const handleUpdateSubmit = async (e) => {
        e.preventDefault();
        setIsSubmitting(true);
        const formData = new FormData();
        formData.append('text', editText);
        if (editImage) formData.append('image', editImage);
        if (editFile) formData.append('file', editFile);

        try {
            const res = await api.put(`/posts/${post._id}`, formData, {
                headers: { 'Content-Type': 'multipart/form-data' }
            });
            setCurrentPost(res.data);
            setIsEditing(false);
            toast.success('Post updated!');
        } catch (error) {
            toast.error('Failed to update post');
        } finally {
            setIsSubmitting(false);
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
                            <h3 className="font-bold text-gray-900">{currentPost.author.username}</h3>
                            {currentPost.author.role === 'TEACHER' && (
                                <span className="bg-blue-100 text-blue-800 text-xs px-2 py-0.5 rounded-full font-medium">Teacher</span>
                            )}
                            {currentPost.author.role === 'ADMIN' && (
                                <span className="bg-purple-100 text-purple-800 text-xs px-2 py-0.5 rounded-full font-medium">Admin</span>
                            )}
                        </div>
                        <p className="text-xs text-gray-500">
                            {currentPost.author.department} • {formattedDate}
                            {currentPost.isEdited && <span className="ml-2 italic text-gray-400 font-normal">(Edited)</span>}
                        </p>
                    </div>
                </div>
                <div className="flex items-center space-x-2">
                    {isAuthor && (
                        <button
                            onClick={() => setIsEditing(!isEditing)}
                            className="text-gray-400 hover:text-primary-600 transition"
                        >
                            <Edit2 className="h-5 w-5" />
                        </button>
                    )}
                    {(isAuthor || user?.role === 'ADMIN') && (
                        <button
                            onClick={() => onDelete(currentPost._id)}
                            className="text-gray-400 hover:text-red-500 transition"
                        >
                            <Trash2 className="h-5 w-5" />
                        </button>
                    )}
                </div>
            </div>

            <div className="px-4 pb-2">
                {isEditing ? (
                    <form onSubmit={handleUpdateSubmit} className="space-y-3">
                        <textarea
                            className="w-full rounded-lg border-gray-200 border p-2 focus:ring-primary-500 focus:border-primary-500 text-sm"
                            value={editText}
                            onChange={(e) => setEditText(e.target.value)}
                        />
                        <div className="flex flex-wrap gap-2">
                            <label className="flex items-center text-xs text-gray-500 cursor-pointer hover:text-primary-600 bg-gray-50 px-2 py-1 rounded border border-gray-200">
                                <ImageIcon className="h-4 w-4 mr-1" />
                                Change Photo
                                <input type="file" accept="image/*" className="hidden" onChange={(e) => setEditImage(e.target.files[0])} />
                            </label>
                            <label className="flex items-center text-xs text-gray-500 cursor-pointer hover:text-primary-600 bg-gray-50 px-2 py-1 rounded border border-gray-200">
                                <File className="h-4 w-4 mr-1" />
                                Change PDF
                                <input type="file" accept=".pdf" className="hidden" onChange={(e) => setEditFile(e.target.files[0])} />
                            </label>
                        </div>
                        {(editImage || editFile) && (
                            <div className="text-[10px] text-primary-600 flex gap-2">
                                {editImage && <span>Image: {editImage.name}</span>}
                                {editFile && <span>PDF: {editFile.name}</span>}
                            </div>
                        )}
                        <div className="flex gap-2 justify-end">
                            <button
                                type="button"
                                onClick={() => setIsEditing(false)}
                                className="text-xs text-gray-500 hover:text-gray-700 font-medium"
                            >
                                Cancel
                            </button>
                            <button
                                type="submit"
                                disabled={isSubmitting}
                                className="bg-primary-600 text-white px-3 py-1 rounded text-xs font-medium hover:bg-primary-700 disabled:opacity-50"
                            >
                                {isSubmitting ? 'Updating...' : 'Save Changes'}
                            </button>
                        </div>
                    </form>
                ) : (
                    <p className="text-gray-800 whitespace-pre-wrap">{currentPost.text}</p>
                )}
            </div>

            {
                !isEditing && currentPost.image && (
                    <div className="mt-2">
                        <img src={currentPost.image.startsWith('http') ? currentPost.image : `http://localhost:5000${currentPost.image}`} alt="Post content" className="w-full object-cover max-h-[500px]" />
                    </div>
                )
            }

            {
                !isEditing && currentPost.fileUrl && (
                    <div className="px-4 py-2 mt-2">
                        <div className="flex items-center justify-between bg-gray-50 border border-gray-100 rounded-lg p-3">
                            <div className="flex items-center space-x-3 overflow-hidden">
                                <div className="bg-red-100 p-2 rounded-lg">
                                    <File className="h-6 w-6 text-red-600" />
                                </div>
                                <div className="overflow-hidden">
                                    <p className="text-sm font-medium text-gray-900 truncate">
                                        {currentPost.fileName || 'Attached PDF'}
                                    </p>
                                    <p className="text-xs text-gray-500 uppercase">PDF Document</p>
                                </div>
                            </div>
                            <a
                                href={currentPost.fileUrl.startsWith('http') ? currentPost.fileUrl : `http://localhost:5000${currentPost.fileUrl}`}
                                download={currentPost.fileName || 'document.pdf'}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="bg-white border border-gray-200 p-2 rounded-full hover:bg-gray-50 transition shadow-sm"
                            >
                                <Download className="h-4 w-4 text-gray-600" />
                            </a>
                        </div>
                    </div>
                )
            }



            <div className="px-4 py-3 border-t border-gray-50 flex justify-between items-center text-gray-500">
                <button
                    onClick={handleLike}
                    id={`like-btn-${currentPost._id}`}
                    className={`flex items-center space-x-2 transition ${isLiked ? 'text-red-500' : 'hover:text-red-500'}`}
                >
                    <Heart className={`h-5 w-5 ${isLiked ? 'fill-current' : ''}`} />
                    <span>{likes.length > 0 ? likes.length : 'Like'}</span>
                </button>
                <button
                    onClick={() => setShowComments(!showComments)}
                    id={`comment-btn-${currentPost._id}`}
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
