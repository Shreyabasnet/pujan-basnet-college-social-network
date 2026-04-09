import express from 'express';
import { sendMessage, getMessages, getConversations, deleteMessage } from '../controllers/message.controller.js';
import { protect } from '../middleware/auth.js';
import localUpload from '../middleware/localUpload.middleware.js';


const router = express.Router();

router.get('/conversations', protect, getConversations);
router.get('/:id', protect, getMessages);
router.post('/send/:id', protect, localUpload.single('file'), sendMessage);
router.delete('/:id', protect, deleteMessage);


export default router;
