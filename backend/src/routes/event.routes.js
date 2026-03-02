import express from 'express';
import multer from 'multer';
import { createEvent, getEvents, deleteEvent, updateEvent } from '../controllers/event.controller.js';
import { protect } from '../middleware/auth.js';
import { teacherOnly } from '../middleware/roleBasedAuth.js';

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

router.post('/', protect, teacherOnly, upload.single('image'), createEvent);
router.get('/', protect, getEvents);
router.delete('/:id', protect, teacherOnly, deleteEvent);
router.put('/:id', protect, teacherOnly, upload.single('image'), updateEvent);

export default router;
