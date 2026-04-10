import express from 'express';
import { getUserNotifications, markAsRead, markAsUnread, markAllAsRead } from '../controllers/notification.controller.js';
import { protect } from '../middleware/auth.js';

const router = express.Router();

router.get('/', protect, getUserNotifications);
router.put('/:id/read', protect, markAsRead);
router.put('/:id/unread', protect, markAsUnread);
router.put('/read-all', protect, markAllAsRead);

export default router;
