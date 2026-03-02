import Message from '../models/Message.js';
import User from '../models/User.js';

export const sendMessage = async (req, res) => {
    try {
        const { text } = req.body;
        const { id: receiverId } = req.params;
        const senderId = req.user.id;

        const newMessage = new Message({
            sender: senderId,
            receiver: receiverId,
            text,
        });

        await newMessage.save();

        // Populate for socket emission if needed, but usually raw data is fine
        // await newMessage.populate('sender', 'username profilePicture');
        // await newMessage.populate('receiver', 'username profilePicture');

        res.status(201).json(newMessage);
    } catch (error) {
        res.status(500).json({ message: 'Server error', error: error.message });
    }
};

export const getMessages = async (req, res) => {
    try {
        const { id: userToChatId } = req.params;
        const senderId = req.user.id;

        const messages = await Message.find({
            $or: [
                { sender: senderId, receiver: userToChatId },
                { sender: userToChatId, receiver: senderId },
            ],
        }).sort({ createdAt: 1 }); // Oldest first for chat history

        res.json(messages);
    } catch (error) {
        res.status(500).json({ message: 'Server error', error: error.message });
    }
};

export const getConversations = async (req, res) => {
    try {
        const currentUserId = req.user.id;

        // Find all messages where current user is sender or receiver
        const messages = await Message.find({
            $or: [{ sender: currentUserId }, { receiver: currentUserId }]
        });

        // Extract unique user IDs involved
        const userIds = new Set();
        messages.forEach(msg => {
            if (msg.sender.toString() !== currentUserId) userIds.add(msg.sender.toString());
            if (msg.receiver.toString() !== currentUserId) userIds.add(msg.receiver.toString());
        });

        // Allow fetching all users to start new chats too, 
        // effectively getting a contact list. 
        // For now, let's just return all users except self to make it easy to start a chat.
        const users = await User.find({ _id: { $ne: currentUserId } }).select('-password');

        res.json(users);
    } catch (error) {
        res.status(500).json({ message: 'Server error', error: error.message });
    }
}
export const deleteMessage = async (req, res) => {
    try {
        const { id } = req.params;
        const message = await Message.findById(id);

        if (!message) {
            return res.status(404).json({ message: 'Message not found' });
        }

        // Only sender or receiver can delete (or Admin)
        if (message.sender.toString() !== req.user.id && message.receiver.toString() !== req.user.id && req.user.role !== 'ADMIN') {
            return res.status(401).json({ message: 'User not authorized' });
        }

        await message.deleteOne();
        res.json({ message: 'Message removed' });
    } catch (error) {
        res.status(500).json({ message: 'Server error', error: error.message });
    }
};
