import express from 'express';
import multer from 'multer';
import { createEvent, getEvents, deleteEvent, updateEvent, cancelEvent } from '../controllers/event.controller.js';
import { protect } from '../middleware/auth.js';
import { adminOrTeacher } from '../middleware/roleBasedAuth.js';

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

router.post('/', protect, adminOrTeacher, upload.single('image'), createEvent);
router.get('/', protect, getEvents);
router.delete('/:id', protect, adminOrTeacher, deleteEvent);
router.put('/:id', protect, adminOrTeacher, upload.single('image'), updateEvent);
router.patch('/:id/cancel', protect, adminOrTeacher, cancelEvent);

export default router;
