import express from 'express';
import { searchAll } from '../controllers/search.controller.js';
import { protect } from '../middleware/auth.js';

const router = express.Router();

router.get('/', protect, searchAll);

export default router;
