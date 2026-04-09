import express from 'express';
import { protect } from '../middleware/auth.js';
import { adminOrTeacher } from '../middleware/roleBasedAuth.js';
import {
    createAnnouncement,
    getAnnouncements,
    deleteAnnouncement,
} from '../controllers/announcement.controller.js';

const router = express.Router();

router.get('/', protect, getAnnouncements);
router.post('/', protect, adminOrTeacher, createAnnouncement);
router.delete('/:id', protect, adminOrTeacher, deleteAnnouncement);

export default router;