import express from 'express';
import {
    getAllTeachers,
    getAllStudents,
    deleteUser,
    getAllCourses,
    createCourse,
    updateCourse,
    deleteCourse,
    getDashboardStats,
    getAllSettings,
    updateSetting
} from '../controllers/admin.controller.js';
import {
    createClassSection,
    getAllClassSections,
    assignStudentToClass,
    upsertClassTimetable,
    getTimetableByClass,
    uploadClassTimetablePdf
} from '../controllers/timetable.controller.js';
import { protect } from '../middleware/auth.js';
import { adminOnly } from '../middleware/roleBasedAuth.js';
import localUpload from '../middleware/localUpload.middleware.js';

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
router.get('/settings', getAllSettings);
router.put('/settings', updateSetting);

router.post('/classes', createClassSection);
router.get('/classes', getAllClassSections);
router.put('/students/:studentId/class', assignStudentToClass);

router.put('/timetables/:classId/:academicYear', upsertClassTimetable);
router.get('/timetables/:classId/:academicYear', getTimetableByClass);
router.post('/timetables/:classId/:academicYear/pdf', localUpload.single('file'), uploadClassTimetablePdf);

export default router;
