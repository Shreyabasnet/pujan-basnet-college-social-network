import Post from '../models/Post.js';
import Notification from '../models/Notification.js';
import { uploadToCloudinary } from '../utils/cloudinaryUpload.js';

export const createPost = async (req, res) => {
    try {
        const { text } = req.body;
        let image = '';

        if (req.file) {
            try {
                const result = await uploadToCloudinary(req.file.buffer, 'collegesocial/posts');
                image = result.url;
            } catch (uploadError) {
                console.error('Cloudinary upload failed:', uploadError);
                return res.status(500).json({ message: 'Image upload failed' });
            }
        }

        const newPost = new Post({
            author: req.user.id,
            text,
            image,
        });

        await newPost.save();

        // Populate author info for the response
        await newPost.populate('author', 'username profilePicture department role');

        res.status(201).json(newPost);
    } catch (error) {
        res.status(500).json({ message: 'Server error', error: error.message });
    }
};

export const getPosts = async (req, res) => {
    try {
        const posts = await Post.find()
            .sort({ createdAt: -1 })
            .populate('author', 'username profilePicture department role')
            .populate('comments.user', 'username profilePicture role');

        res.json(posts);
    } catch (error) {
        res.status(500).json({ message: 'Server error', error: error.message });
    }
};

export const deletePost = async (req, res) => {
    try {
        const post = await Post.findById(req.params.id);

        if (!post) {
            return res.status(404).json({ message: 'Post not found' });
        }

        // Check user
        if (post.author.toString() !== req.user.id && req.user.role !== 'Admin') {
            return res.status(401).json({ message: 'User not authorized' });
        }

        await post.deleteOne();

        res.json({ message: 'Post removed' });
    } catch (error) {
        res.status(500).json({ message: 'Server error', error: error.message });
    }
};

export const likePost = async (req, res) => {
    try {
        const post = await Post.findById(req.params.id);
        if (!post) {
            return res.status(404).json({ message: 'Post not found' });
        }

        // Check if the post has already been liked
        if (post.likes.includes(req.user.id)) {
            // Unlike
            post.likes = post.likes.filter(id => id.toString() !== req.user.id);
        } else {
            // Like
            post.likes.push(req.user.id);

            // Create Notification if not self-like
            if (post.author._id.toString() !== req.user.id) {
                const newNotification = new Notification({
                    recipient: post.author._id,
                    sender: req.user.id,
                    type: 'like',
                    relatedId: post._id,
                    text: `${req.user.username} liked your post.`
                });
                await newNotification.save();

                // Real-time emission
                if (req.io) {
                    req.io.to(post.author._id.toString()).emit('notification', newNotification);
                }
            }
        }

        await post.save();
        res.json(post.likes);
    } catch (error) {
        res.status(500).json({ message: 'Server error', error: error.message });
    }
};

export const commentPost = async (req, res) => {
    try {
        const post = await Post.findById(req.params.id);
        if (!post) {
            return res.status(404).json({ message: 'Post not found' });
        }

        const { text } = req.body;
        const newComment = {
            user: req.user.id,
            text,
            createdAt: new Date()
        };

        post.comments.unshift(newComment);

        await post.save();

        // We need to fetch the post again to populate the new comment's user, 
        // or manually structure the response if we want performance.
        // For simplicity, let's just populate the user of the first comment (the new one).
        await post.populate('comments.user', 'username profilePicture role');

        // Create Notification if not their own post
        if (post.author._id.toString() !== req.user.id) {
            const newNotification = new Notification({
                recipient: post.author._id,
                sender: req.user.id,
                type: 'comment',
                relatedId: post._id,
                text: `${req.user.username} commented on your post.`
            });
            await newNotification.save();

            if (req.io) {
                req.io.to(post.author._id.toString()).emit('notification', newNotification);
            }
        }

        res.json(post.comments);
    } catch (error) {
        res.status(500).json({ message: 'Server error', error: error.message });
    }
};

export const updatePost = async (req, res) => {
    try {
        const { text } = req.body;
        const post = await Post.findById(req.params.id);

        if (!post) {
            return res.status(404).json({ message: 'Post not found' });
        }

        // Check user
        if (post.author.toString() !== req.user.id && req.user.role !== 'ADMIN') {
            return res.status(401).json({ message: 'User not authorized' });
        }

        post.text = text || post.text;

        if (req.file) {
            const result = await uploadToCloudinary(req.file.buffer, 'collegesocial/posts');
            post.image = result.url;
        }

        await post.save();
        await post.populate('author', 'username profilePicture department role');

        res.json(post);
    } catch (error) {
        res.status(500).json({ message: 'Server error', error: error.message });
    }
};

export const deleteComment = async (req, res) => {
    try {
        const post = await Post.findById(req.params.id);
        if (!post) {
            return res.status(404).json({ message: 'Post not found' });
        }

        // Pull out comment
        const comment = post.comments.find(comment => comment._id.toString() === req.params.commentId);

        if (!comment) {
            return res.status(404).json({ message: 'Comment not found' });
        }

        // Check user: Allow if user is comment author OR post author OR Admin
        if (comment.user.toString() !== req.user.id && post.author.toString() !== req.user.id && req.user.role !== 'Admin') {
            return res.status(401).json({ message: 'User not authorized' });
        }

        post.comments = post.comments.filter(({ id }) => id !== req.params.commentId);

        await post.save();
        res.json(post.comments);
    } catch (error) {
        res.status(500).json({ message: 'Server error', error: error.message });
    }
};
