import Announcement from '../models/Announcement.js';

export const createAnnouncement = async (req, res) => {
    try {
        const { title, content } = req.body;

        if (!title || !content) {
            return res.status(400).json({ message: 'Title and content are required' });
        }

        const announcement = await Announcement.create({
            title,
            content,
            createdBy: req.user.id,
        });

        await announcement.populate('createdBy', 'username role');

        return res.status(201).json(announcement);
    } catch (error) {
        return res.status(500).json({ message: 'Server error', error: error.message });
    }
};

export const getAnnouncements = async (req, res) => {
    try {
        const announcements = await Announcement.find()
            .sort({ createdAt: -1 })
            .populate('createdBy', 'username role');

        return res.json(announcements);
    } catch (error) {
        return res.status(500).json({ message: 'Server error', error: error.message });
    }
};

export const deleteAnnouncement = async (req, res) => {
    try {
        const announcement = await Announcement.findById(req.params.id);

        if (!announcement) {
            return res.status(404).json({ message: 'Announcement not found' });
        }

        const isAdmin = req.user.role === 'ADMIN';
        const isCreator = announcement.createdBy.toString() === req.user.id;

        if (!isAdmin && !isCreator) {
            return res.status(403).json({ message: 'Not authorized to delete this announcement' });
        }

        await announcement.deleteOne();
        return res.json({ message: 'Announcement deleted' });
    } catch (error) {
        return res.status(500).json({ message: 'Server error', error: error.message });
    }
};