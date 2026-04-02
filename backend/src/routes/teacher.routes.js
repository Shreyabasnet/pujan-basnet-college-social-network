import express from 'express';
import { protect } from '../middleware/auth.js';
import { teacherOnly } from '../middleware/roleBasedAuth.js';
import materialUpload from '../middleware/materialUpload.middleware.js';

import {
    getTeacherDashboard,
    getMyCourses,
    getCourseStudents,
    markAttendance,
    updateGrades,
    createAssignment,
    getAssignments,
    uploadMaterial,
    getMaterials
} from '../controllers/teacher.controller.js';

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


// Grades
router.post("/grades", updateGrades);


// Assignments
router.get("/assignments/:courseId", getAssignments);
router.post("/assignments", createAssignment);


// Materials
router.get("/materials/:courseId", getMaterials);
router.post("/materials", materialUpload.single('file'), uploadMaterial);



export default router;
