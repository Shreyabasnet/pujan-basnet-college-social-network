import express from 'express';
import { protect } from '../middleware/auth.js';
import { teacherOnly } from '../middleware/roleBasedAuth.js';

import {
    getTeacherDashboard,
    getMyCourses,
    getCourseStudents,
    markAttendance
} from '../controllers/teacher.controller.js';
import { getMyTeacherTimetable } from '../controllers/timetable.controller.js';

const router = express.Router();


// Apply middleware to ALL routes
router.use(protect);
router.use(teacherOnly);


// Dashboard
router.get("/dashboard", getTeacherDashboard);


// Courses
router.get("/courses", getMyCourses);


// Course students
router.get("/courses/:courseId/students", getCourseStudents);


// Attendance
router.post("/attendance", markAttendance);

// Timetable
router.get('/timetable/me', getMyTeacherTimetable);


// Grades
// Removed from active coursework flow

// Assignments
// Removed from active coursework flow

// Materials
// Removed from active coursework flow



export default router;
