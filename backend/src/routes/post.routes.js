import express from 'express';
import multer from 'multer';
import { createPost, getPosts, deletePost, likePost, commentPost, deleteComment } from '../controllers/post.controller.js';
import { protect } from '../middleware/auth.js';

const router = express.Router();

// Multer Setup with memory storage for Cloudinary
const upload = multer({
    storage: multer.memoryStorage(),
    limits: {
        fileSize: 10 * 1024 * 1024, // 10MB limit
    },
    fileFilter: function (req, file, cb) {
        const filetypes = /jpeg|jpg|png|webp|gif/;
        const mimetype = filetypes.test(file.mimetype);

        if (mimetype) {
            return cb(null, true);
        } else {
            cb(new Error('Only image files are allowed!'));
        }
    }
});

router.post('/', protect, upload.single('image'), createPost);
router.get('/', protect, getPosts);
router.delete('/:id', protect, deletePost);

router.put('/:id/like', protect, likePost);
router.post('/:id/comment', protect, commentPost);
router.delete('/:id/comment/:commentId', protect, deleteComment);

export default router;
