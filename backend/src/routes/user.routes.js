import express from 'express';
import multer from 'multer';
import { getProfile, getUserById, updateProfile, uploadProfilePictureHandler, getAllUsers } from '../controllers/user.controller.js';
import { protect } from '../middleware/auth.js';

const router = express.Router();

// Multer Setup with memory storage for Cloudinary
const upload = multer({
    storage: multer.memoryStorage(),
    limits: {
        fileSize: 5 * 1024 * 1024, // 5MB limit for profile pictures
    },
    fileFilter: function (req, file, cb) {
        const filetypes = /jpeg|jpg|png|webp/;
        const mimetype = filetypes.test(file.mimetype);

        if (mimetype) {
            return cb(null, true);
        } else {
            cb(new Error('Only image files are allowed!'));
        }
    }
});

router.get('/all', protect, getAllUsers);
router.get('/profile', protect, getProfile);
router.get('/:id', protect, getUserById);
router.put('/profile', protect, updateProfile);
router.post('/profile/picture', protect, upload.single('profilePicture'), uploadProfilePictureHandler);

export default router;
