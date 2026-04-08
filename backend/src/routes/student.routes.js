import express from 'express';
import { protect } from '../middleware/auth.js';
import { studentOnly } from '../middleware/roleBasedAuth.js';
import {
    getStudentDashboard,
    getMyCourses,
    getMyGrades,
    getMyAttendance,
    getMyTimetable,
    getMyMaterials,
    downloadMaterial,
    getMyAssignments
} from '../controllers/student.controller.js';

const router = express.Router();

// All student routes require authentication and student role
router.use(protect);
router.use(studentOnly);

// Dashboard
router.get('/dashboard', getStudentDashboard);

// Courses
router.get('/courses', getMyCourses);

// Academic
router.get('/grades', getMyGrades);
router.get('/attendance', getMyAttendance);
router.get('/timetable', getMyTimetable);

// Materials
router.get('/materials', getMyMaterials);
router.get('/materials/:materialId/download', downloadMaterial);

// Assignments
router.get('/assignments', getMyAssignments);

export default router;
