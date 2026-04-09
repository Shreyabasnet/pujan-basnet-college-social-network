import Message from '../models/Message.js';
import Notification from '../models/Notification.js';
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
            fileUrl: req.file ? `/uploads/pdfs/${req.file.filename}` : '',
            fileName: req.file ? req.file.originalname : '',
        });


        await newMessage.save();

        await newMessage.populate('sender', 'username profilePicture department role');

        // Create a notification for the receiver when a new message arrives.
        if (senderId !== receiverId) {
            const newNotification = new Notification({
                recipient: receiverId,
                sender: senderId,
                type: 'message',
                relatedId: newMessage._id,
                text: `${req.user.username} sent you a message.`,
            });
            await newNotification.save();

            if (req.io) {
                req.io.to(receiverId).emit('notification', newNotification);
            }
        }

        if (req.io) {
            req.io.to(receiverId).emit('receive_message', {
                senderId,
                message: newMessage,
            });
        }

        res.status(201).json(newMessage);
    } catch (error) {
        res.status(500).json({ message: 'Server error', error: error.message });
    }
};

export const getMessages = async (req, res) => {
    try {
        const { id: userToChatId } = req.params;
        const senderId = req.user.id;

        await Message.updateMany(
            {
                sender: userToChatId,
                receiver: senderId,
                isRead: false,
            },
            { $set: { isRead: true } }
        );

        const messages = await Message.find({
            $and: [
                {
                    $or: [
                        { sender: senderId, receiver: userToChatId },
                        { sender: userToChatId, receiver: senderId },
                    ],
                },
                { deletedFor: { $ne: senderId } },
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

        const messages = await Message.find({
            $and: [
                { $or: [{ sender: currentUserId }, { receiver: currentUserId }] },
                { deletedFor: { $ne: currentUserId } },
            ]
        })
            .sort({ createdAt: -1 })
            .select('sender receiver createdAt')
            .lean();

        const latestByUser = new Map();
        for (const msg of messages) {
            const otherUserId = msg.sender.toString() === currentUserId
                ? msg.receiver.toString()
                : msg.sender.toString();

            if (!latestByUser.has(otherUserId)) {
                latestByUser.set(otherUserId, msg.createdAt);
            }
        }

        const users = await User.find({ _id: { $ne: currentUserId } })
            .select('-password')
            .lean();

        const unreadAgg = await Message.aggregate([
            {
                $match: {
                    receiver: req.user._id,
                    isRead: false,
                    deletedFor: { $ne: req.user._id },
                },
            },
            {
                $group: {
                    _id: '$sender',
                    count: { $sum: 1 },
                },
            },
        ]);

        const unreadBySender = new Map(
            unreadAgg.map((item) => [item._id.toString(), item.count])
        );

        users.sort((a, b) => {
            const aTime = latestByUser.get(a._id.toString());
            const bTime = latestByUser.get(b._id.toString());

            if (aTime && bTime) {
                return new Date(bTime) - new Date(aTime);
            }
            if (aTime) return -1;
            if (bTime) return 1;
            return a.username.localeCompare(b.username);
        });

        const usersWithUnread = users.map((u) => ({
            ...u,
            unreadCount: unreadBySender.get(u._id.toString()) || 0,
        }));

        res.json(usersWithUnread);
    } catch (error) {
        res.status(500).json({ message: 'Server error', error: error.message });
    }
}
export const deleteMessage = async (req, res) => {
    try {
        const { id } = req.params;
        const { scope = 'auto' } = req.query;
        const message = await Message.findById(id);

        if (!message) {
            return res.status(404).json({ message: 'Message not found' });
        }

        const currentUserId = req.user.id;
        const senderId = message.sender.toString();
        const receiverId = message.receiver.toString();
        const isAdmin = (req.user.role || '').toUpperCase() === 'ADMIN';
        const isSender = senderId === currentUserId;
        const isReceiver = receiverId === currentUserId;

        // Only sender/receiver/admin can act on the message.
        if (!isSender && !isReceiver && !isAdmin) {
            return res.status(401).json({ message: 'User not authorized' });
        }

        const deleteForCurrentUser = async () => {
            if (!message.deletedFor.some((userId) => userId.toString() === currentUserId)) {
                message.deletedFor.push(currentUserId);
                await message.save();
            }

            if (req.io) {
                req.io.to(currentUserId).emit('message_deleted_for_me', {
                    messageId: id,
                });
            }

            return res.json({ message: 'Message deleted for you' });
        };

        const unsendForEveryone = async () => {
            await message.deleteOne();

            if (req.io) {
                req.io.to(receiverId).emit('message_unsent', {
                    senderId,
                    messageId: id,
                });

                req.io.to(senderId).emit('message_unsent', {
                    senderId,
                    messageId: id,
                });
            }

            return res.json({ message: 'Message unsent for everyone' });
        };

        if (scope === 'everyone') {
            if (!isSender && !isAdmin) {
                return res.status(403).json({ message: 'Only sender can delete for everyone' });
            }
            return unsendForEveryone();
        }

        if (scope === 'me') {
            return deleteForCurrentUser();
        }

        // Backward-compatible default behavior.
        if (isSender || isAdmin) {
            return unsendForEveryone();
        }

        return deleteForCurrentUser();
    } catch (error) {
        res.status(500).json({ message: 'Server error', error: error.message });
    }
};
