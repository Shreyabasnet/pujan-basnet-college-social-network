import express from 'express';
import { sendMessage, getMessages, getConversations } from '../controllers/message.controller.js';
import { protect } from '../middleware/auth.js';

const router = express.Router();

router.get('/conversations', protect, getConversations);
router.get('/:id', protect, getMessages);
router.post('/send/:id', protect, sendMessage);

export default router;
