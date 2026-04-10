import express from 'express';
import { protect } from '../middleware/auth.js';
import { studentOnly } from '../middleware/roleBasedAuth.js';
import {
    getStudentDashboard,
    getMyCourses,
    getMyAttendance,
    enrollCourse,
    getMyReminders,
    createReminder,
    deleteReminder
} from '../controllers/student.controller.js';
import { getMyClassTimetable } from '../controllers/timetable.controller.js';

const router = express.Router();

// All student routes require authentication and student role
router.use(protect);
router.use(studentOnly);

// Dashboard
router.get('/dashboard', getStudentDashboard);

// Courses
router.get('/courses', getMyCourses);
router.post('/courses/:courseId/enroll', enrollCourse);

// Academic
router.get('/attendance', getMyAttendance);
router.get('/timetable', getMyClassTimetable);
router.get('/timetable/me', getMyClassTimetable);

// Reminders
router.get('/reminders', getMyReminders);
router.post('/reminders', createReminder);
router.delete('/reminders/:reminderId', deleteReminder);

export default router;
