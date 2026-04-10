import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { Heart, MessageSquare, Trash2, Share2, Send, X, File, Download, Edit2, Image as ImageIcon } from 'lucide-react';

import { useAuth } from '../../context/AuthContext';
import api from '../../services/api';
import toast from 'react-hot-toast';

const PostCard = ({ post, onDelete, isHighlighted = false }) => {
    const { user } = useAuth();
    const [likes, setLikes] = useState(Array.isArray(post.likes) ? post.likes : []);
    const [comments, setComments] = useState(Array.isArray(post.comments) ? post.comments : []);
    const [showComments, setShowComments] = useState(false);
    const [commentText, setCommentText] = useState('');

    // Editing state
    const [isEditing, setIsEditing] = useState(false);
    const [editText, setEditText] = useState(post.text);
    const [editImage, setEditImage] = useState(null);
    const [editFile, setEditFile] = useState(null);
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [currentPost, setCurrentPost] = useState(post);
    const author = currentPost.author || post.author || {};
    const authorProfilePath = author?._id ? `/profile/${author._id}` : '/profile';


    const isAuthor = user && author._id && (user._id === author._id || user.id === author._id);
    const isLiked = user && (likes.includes(user.id) || likes.includes(user._id));

    const formattedDate = new Date(currentPost.createdAt || post.createdAt).toLocaleDateString('en-US', {
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

    const handleShare = async () => {
        const shareUrl = `${window.location.origin}/feed?post=${currentPost._id}`;
        const shareText = currentPost.text?.trim() ? currentPost.text.slice(0, 120) : 'Check out this post.';

        try {
            if (navigator.share) {
                await navigator.share({
                    title: 'Campus Feed Post',
                    text: shareText,
                    url: shareUrl,
                });
                toast.success('Post shared');
                return;
            }

            await navigator.clipboard.writeText(shareUrl);
            toast.success('Post link copied');
        } catch (error) {
            // User-cancel in native share should not show as an error.
            if (error?.name === 'AbortError') return;
            toast.error('Unable to share this post');
        }
    };


    return (
        <div
            id={`post-${currentPost._id}`}
            className={`overflow-hidden rounded-[1.5rem] border bg-white shadow-[0_20px_60px_-35px_rgba(15,23,42,0.45)] transition ${isHighlighted ? 'border-primary-300 ring-4 ring-primary-100' : 'border-slate-200'}`}
        >
            <div className="h-1 bg-gradient-to-r from-primary-500 via-cyan-400 to-emerald-400" />
            <div className="p-5">
                <div className="flex items-start justify-between gap-4">
                    <div className="flex items-center space-x-3">
                        <Link to={authorProfilePath} className="block h-12 w-12 overflow-hidden rounded-full ring-4 ring-primary-50">
                            {author.profilePicture ? (
                                <img src={author.profilePicture} alt={author.username || 'Post author'} className="h-full w-full object-cover" />
                            ) : (
                                <div className="flex h-full w-full items-center justify-center bg-primary-100 font-bold uppercase text-primary-700">
                                    {author.username?.charAt(0) || '?'}
                                </div>
                            )}
                        </Link>
                        <div>
                            <div className="flex flex-wrap items-center gap-2">
                                <Link to={authorProfilePath} className="font-bold text-slate-900 transition hover:text-primary-700">
                                    {author.username || 'Unknown user'}
                                </Link>
                                {author.role === 'TEACHER' && (
                                    <span className="rounded-full bg-blue-50 px-2.5 py-1 text-xs font-semibold text-blue-700">Teacher</span>
                                )}
                                {author.role === 'ADMIN' && (
                                    <span className="rounded-full bg-violet-50 px-2.5 py-1 text-xs font-semibold text-violet-700">Admin</span>
                                )}
                            </div>
                            <p className="mt-1 text-xs text-slate-500">
                                {author.department || 'General'} • {formattedDate}
                                {currentPost.isEdited && <span className="ml-2 font-normal italic text-slate-400">(Edited)</span>}
                            </p>
                        </div>
                    </div>
                    <div className="flex items-center space-x-2">
                        {isAuthor && (
                            <button
                                onClick={() => setIsEditing(!isEditing)}
                                className="rounded-full border border-slate-200 p-2 text-slate-400 transition hover:border-primary-200 hover:text-primary-600"
                            >
                                <Edit2 className="h-4 w-4" />
                            </button>
                        )}
                        {(isAuthor || user?.role === 'ADMIN') && (
                            <button
                                onClick={() => onDelete(currentPost._id)}
                                className="rounded-full border border-slate-200 p-2 text-slate-400 transition hover:border-rose-200 hover:text-rose-500"
                            >
                                <Trash2 className="h-4 w-4" />
                            </button>
                        )}
                    </div>
                </div>
            </div>

            <div className="px-5 pb-3">
                {isEditing ? (
                    <form onSubmit={handleUpdateSubmit} className="space-y-3">
                        <textarea
                            className="min-h-[120px] w-full rounded-[1.25rem] border border-slate-200 bg-slate-50/70 p-3 text-sm text-slate-800 outline-none transition focus:border-primary-300 focus:bg-white focus:ring-4 focus:ring-primary-100"
                            value={editText}
                            onChange={(e) => setEditText(e.target.value)}
                        />
                        <div className="flex flex-wrap gap-2">
                            <label className="flex cursor-pointer items-center rounded-full border border-slate-200 bg-white px-3 py-2 text-xs font-semibold text-slate-600 shadow-sm transition hover:border-primary-200 hover:text-primary-700">
                                <ImageIcon className="h-4 w-4 mr-1" />
                                Change Photo
                                <input type="file" accept="image/*" className="hidden" onChange={(e) => setEditImage(e.target.files[0])} />
                            </label>
                            <label className="flex cursor-pointer items-center rounded-full border border-slate-200 bg-white px-3 py-2 text-xs font-semibold text-slate-600 shadow-sm transition hover:border-primary-200 hover:text-primary-700">
                                <File className="h-4 w-4 mr-1" />
                                Change Document
                                <input
                                    type="file"
                                    accept=".pdf,.doc,.docx,application/pdf,application/msword,application/vnd.openxmlformats-officedocument.wordprocessingml.document"
                                    className="hidden"
                                    onChange={(e) => setEditFile(e.target.files[0])}
                                />
                            </label>
                        </div>
                        {(editImage || editFile) && (
                            <div className="flex gap-2 text-[11px] font-medium text-primary-600">
                                {editImage && <span>Image: {editImage.name}</span>}
                                {editFile && <span>File: {editFile.name}</span>}
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
                                className="rounded-full bg-primary-600 px-4 py-2 text-xs font-semibold text-white transition hover:bg-primary-700 disabled:cursor-not-allowed disabled:opacity-50"
                            >
                                {isSubmitting ? 'Updating...' : 'Save Changes'}
                            </button>
                        </div>
                    </form>
                ) : (
                    <p className="whitespace-pre-wrap text-base leading-7 text-slate-800">{currentPost.text}</p>
                )}
            </div>

            {
                !isEditing && currentPost.image && (
                    <div className="px-5 pt-2">
                        <img src={currentPost.image.startsWith('http') ? currentPost.image : `http://localhost:5000${currentPost.image}`} alt="Post content" className="max-h-[520px] w-full rounded-[1.25rem] object-cover" />
                    </div>
                )
            }

            {
                !isEditing && currentPost.fileUrl && (
                    <div className="px-5 pt-4">
                        <div className="flex items-center justify-between rounded-[1.25rem] border border-slate-200 bg-slate-50 p-4">
                            <div className="flex items-center space-x-3 overflow-hidden">
                                <div className="rounded-2xl bg-red-50 p-3">
                                    <File className="h-6 w-6 text-red-600" />
                                </div>
                                <div className="overflow-hidden">
                                    <p className="truncate text-sm font-semibold text-slate-900">
                                        {currentPost.fileName || 'Attached file'}
                                    </p>
                                    <p className="text-xs uppercase tracking-[0.18em] text-slate-500">Document</p>
                                </div>
                            </div>
                            <a
                                href={currentPost.fileUrl.startsWith('http') ? currentPost.fileUrl : `http://localhost:5000${currentPost.fileUrl}`}
                                download={currentPost.fileName || 'document.pdf'}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="rounded-full border border-slate-200 bg-white p-3 text-slate-600 shadow-sm transition hover:border-primary-200 hover:text-primary-700"
                            >
                                <Download className="h-4 w-4 text-gray-600" />
                            </a>
                        </div>
                    </div>
                )
            }



            <div className="mx-5 mt-5 flex items-center justify-between rounded-[1.25rem] border border-slate-100 bg-slate-50 px-4 py-3 text-slate-500">
                <button
                    onClick={handleLike}
                    id={`like-btn-${currentPost._id}`}
                    className={`flex items-center space-x-2 transition ${isLiked ? 'text-rose-500' : 'hover:text-rose-500'}`}
                >
                    <Heart className={`h-5 w-5 ${isLiked ? 'fill-current' : ''}`} />
                    <span className="text-sm font-medium">{likes.length > 0 ? likes.length : 'Like'}</span>
                </button>
                <button
                    onClick={() => setShowComments(!showComments)}
                    id={`comment-btn-${currentPost._id}`}
                    className="flex items-center space-x-2 hover:text-primary-600 transition"
                >
                    <MessageSquare className="h-5 w-5" />
                    <span className="text-sm font-medium">{comments.length > 0 ? comments.length : 'Comment'}</span>
                </button>
                <button
                    onClick={handleShare}
                    className="flex items-center space-x-2 hover:text-primary-600 transition"
                >
                    <Share2 className="h-5 w-5" />
                    <span className="text-sm font-medium">Share</span>
                </button>
            </div>

            {/* Comments Section */}
            {
                showComments && (
                    <div className="border-t border-slate-100 bg-slate-50/80 p-5">
                        {/* Comment Input */}
                        <form onSubmit={handleCommentSubmit} className="mb-4 flex gap-2">
                            <input
                                type="text"
                                placeholder="Write a comment..."
                                className="flex-1 rounded-full border border-slate-200 bg-white px-4 py-2.5 text-sm outline-none transition focus:border-primary-300 focus:ring-4 focus:ring-primary-100"
                                value={commentText}
                                onChange={(e) => setCommentText(e.target.value)}
                            />
                            <button
                                type="submit"
                                disabled={!commentText.trim()}
                                className="rounded-full bg-primary-600 p-2.5 text-white transition hover:bg-primary-700 disabled:cursor-not-allowed disabled:opacity-50"
                            >
                                <Send className="h-4 w-4" />
                            </button>
                        </form>

                        {/* Comments List */}
                        <div className="max-h-60 space-y-4 overflow-y-auto pr-2">
                            {comments.length === 0 ? (
                                <div className="rounded-2xl border border-dashed border-slate-200 bg-white px-4 py-5 text-sm text-slate-500">
                                    No comments yet. Start the discussion.
                                </div>
                            ) : comments.map((comment, index) => (
                                <div key={comment._id || index} className="flex gap-3">
                                    <Link to={comment.user?._id ? `/profile/${comment.user._id}` : '/profile'} className="block h-8 w-8 flex-shrink-0 overflow-hidden rounded-full bg-gray-200">
                                        {comment.user?.profilePicture ? (
                                            <img src={comment.user.profilePicture} className="h-full w-full object-cover" />
                                        ) : (
                                            <div className="flex h-full w-full items-center justify-center bg-primary-100 text-xs font-bold uppercase text-primary-700">
                                                {comment.user?.username?.charAt(0) || '?'}
                                            </div>
                                        )}
                                    </Link>
                                    <div className="flex-1 rounded-2xl rounded-tl-none border border-slate-200 bg-white p-3 shadow-sm">
                                        <div className="flex items-start justify-between gap-3">
                                            <Link
                                                to={comment.user?._id ? `/profile/${comment.user._id}` : '/profile'}
                                                className="text-sm font-bold text-slate-900 transition hover:text-primary-700"
                                            >
                                                {comment.user?.username || 'Unknown'}
                                            </Link>
                                            <span className="text-xs text-slate-400">
                                                {new Date(comment.createdAt).toLocaleDateString()}
                                            </span>
                                        </div>
                                        <p className="mt-1 text-sm leading-6 text-slate-700">{comment.text}</p>
                                    </div>
                                    {(user && (user._id === comment.user?._id || user.id === comment.user?._id || isAuthor || user.role === 'ADMIN')) && (
                                        <button onClick={() => handleDeleteComment(comment._id)} className="self-center text-slate-400 transition hover:text-rose-500">
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
