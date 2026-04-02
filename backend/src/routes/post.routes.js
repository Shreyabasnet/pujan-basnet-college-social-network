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
        const filetypes = /jpeg|jpg|png|webp|gif|pdf/;
        const mimetype = filetypes.test(file.mimetype);
        const extname = filetypes.test(path.extname(file.originalname).toLowerCase());

        if (mimetype && extname) {
            return cb(null, true);
        } else {
            cb(new Error('Only image and PDF files are allowed!'));
        }
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
