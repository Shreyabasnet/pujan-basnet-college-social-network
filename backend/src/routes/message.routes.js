import express from 'express';
import { sendMessage, getMessages, getConversations, deleteMessage } from '../controllers/message.controller.js';
import { protect } from '../middleware/auth.js';
import cloudinaryUpload from '../middleware/cloudinaryUpload.middleware.js';


const router = express.Router();

router.get('/conversations', protect, getConversations);
router.get('/:id', protect, getMessages);
router.post('/send/:id', protect, cloudinaryUpload.single('file'), sendMessage);
router.delete('/:id', protect, deleteMessage);


export default router;
