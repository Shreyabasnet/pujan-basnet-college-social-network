import express from 'express';
import multer from 'multer';
import path from 'path';

import { createPost, getPosts, deletePost, likePost, commentPost, deleteComment, updatePost } from '../controllers/post.controller.js';
import { protect } from '../middleware/auth.js';

const router = express.Router();


// Multer Setup with memory storage for Cloudinary
const upload = multer({
    storage: multer.memoryStorage(),
    limits: {
        fileSize: 10 * 1024 * 1024, // 10MB limit
    },
    fileFilter: function (req, file, cb) {
        const ext = path.extname(file.originalname).toLowerCase();

        const imageMimes = ['image/jpeg', 'image/jpg', 'image/png', 'image/webp', 'image/gif'];
        const imageExts = ['.jpg', '.jpeg', '.png', '.webp', '.gif'];

        const documentMimes = [
            'application/pdf',
            'application/msword',
            'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
        ];
        const documentExts = ['.pdf', '.doc', '.docx'];

        if (file.fieldname === 'image') {
            if (imageMimes.includes(file.mimetype) && imageExts.includes(ext)) {
                return cb(null, true);
            }
            return cb(new Error('Only image files are allowed for image upload.'));
        }

        if (file.fieldname === 'file') {
            if (documentMimes.includes(file.mimetype) && documentExts.includes(ext)) {
                return cb(null, true);
            }
            return cb(new Error('Only PDF, DOC, and DOCX files are allowed for attachment upload.'));
        }

        return cb(new Error('Unexpected file field.'));
    }
});

router.post('/', protect, upload.fields([{ name: 'image', maxCount: 1 }, { name: 'file', maxCount: 1 }]), createPost);

router.get('/', protect, getPosts);
router.put('/:id', protect, upload.fields([{ name: 'image', maxCount: 1 }, { name: 'file', maxCount: 1 }]), updatePost);
router.delete('/:id', protect, deletePost);


router.put('/:id/like', protect, likePost);
router.post('/:id/comment', protect, commentPost);
router.delete('/:id/comment/:commentId', protect, deleteComment);

export default router;
