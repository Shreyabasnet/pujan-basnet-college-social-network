import express from 'express';
import {
    getAllTeachers,
    getAllStudents,
    deleteUser,
    getAllCourses,
    createCourse,
    updateCourse,
    deleteCourse,
    getDashboardStats
} from '../controllers/admin.controller.js';
import { protect } from '../middleware/auth.js';
import { adminOnly } from '../middleware/roleBasedAuth.js';

const router = express.Router();

// All routes here are protected and require admin role
router.use(protect);
router.use(adminOnly);

router.get('/teachers', getAllTeachers);
router.get('/students', getAllStudents);
router.delete('/user/:id', deleteUser);

router.get('/courses', getAllCourses);
router.post('/courses', createCourse);
router.put('/courses/:id', updateCourse);
router.delete('/courses/:id', deleteCourse);
router.get('/dashboard/stats', getDashboardStats);

export default router;
