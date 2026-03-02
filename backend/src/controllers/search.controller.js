import User from '../models/User.js';
import Post from '../models/Post.js';
import Event from '../models/Event.js';

export const searchAll = async (req, res) => {
    try {
        const { q } = req.query;

        if (!q) {
            return res.json({ users: [], posts: [], events: [] });
        }

        const regex = new RegExp(q, 'i'); // Case-insensitive regex

        const users = await User.find({
            $or: [{ username: regex }, { department: regex }]
        }).select('-password');

        const posts = await Post.find({
            text: regex
        }).populate('author', 'username profilePicture').sort({ createdAt: -1 });

        const events = await Event.find({
            $or: [{ title: regex }, { description: regex }, { location: regex }]
        }).sort({ date: 1 });

        res.json({ users, posts, events });
    } catch (error) {
        res.status(500).json({ message: 'Server error', error: error.message });
    }
};
