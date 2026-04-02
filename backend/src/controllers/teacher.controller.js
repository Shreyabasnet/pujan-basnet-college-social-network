import User from '../models/User.js';
import Post from '../models/Post.js';
import Event from '../models/Event.js';
import Course from '../models/Course.js';
import Attendance from '../models/Attendance.js';
import Grade from '../models/Grade.js';
import Assignment from '../models/Assignment.js';
import Material from '../models/Material.js';

// Get teacher dashboard
export const getTeacherDashboard = async (req, res) => {
    try {
        const teacherId = req.user.id;

        // 1. Get my courses
        const myCourses = await Course.find({ teacher: teacherId });
        const courseIds = myCourses.map(c => c._id);

        // 2. Get students in my courses (unique students)
        const myStudentsCount = await User.countDocuments({
            role: 'STUDENT',
            _id: { $in: myCourses.flatMap(c => c.students) }
        });

        // 3. Get upcoming events
        const upcomingEvents = await Event.find({
            createdBy: teacherId,
            date: { $gte: new Date() }
        }).sort('date').limit(5);

        // 4. Pending assignments count
        const pendingAssignmentsCount = await Assignment.countDocuments({
            teacher: teacherId,
            dueDate: { $gte: new Date() }
        });

        // 5. Avg attendance (Calculation)
        const allTeacherCourses = await Course.find({ teacher: teacherId });
        const allCourseIds = allTeacherCourses.map(c => c._id);
        
        const attendanceRecords = await Attendance.find({ 
            course: { $in: allCourseIds } 
        });

        let avgAttendance = 0;
        if (attendanceRecords.length > 0) {
            const presentCount = attendanceRecords.filter(a => a.status === 'present').length;
            avgAttendance = Math.round((presentCount / attendanceRecords.length) * 100);
        }

        res.json({
            success: true,
            data: {
                stats: {
                    totalStudents: myStudentsCount,
                    activeCourses: myCourses.length,
                    pendingAssignments: pendingAssignmentsCount,
                    avgAttendance: avgAttendance
                },
                recentCourses: myCourses.slice(0, 4),
                todaySchedule: myCourses.map(c => ({
                    id: c._id,
                    name: c.name,
                    ...c.schedule
                })),
                recentActivities: upcomingEvents.map(event => ({
                    type: 'event',
                    description: `Upcoming Event: ${event.title}`,
                    time: new Date(event.date).toLocaleDateString()
                }))
            }
        });

    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// Get teacher courses
export const getMyCourses = async (req, res) => {
    try {
        const myCourses = await Course.find({ teacher: req.user.id });
        res.json({
            success: true,
            data: myCourses
        });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// Get course students
export const getCourseStudents = async (req, res) => {
    try {
        const { courseId } = req.params;
        const course = await Course.findById(courseId).populate('students', 'username email profilePicture department year');

        if (!course) {
            return res.status(404).json({ message: "Course not found" });
        }

        res.json({
            success: true,
            data: course.students
        });

    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// Mark attendance
export const markAttendance = async (req, res) => {
    try {
        const { courseId, studentId, date, status } = req.body;

        const newAttendance = await Attendance.create({
            course: courseId,
            student: studentId,
            date: date || new Date(),
            status,
            markedBy: req.user.id
        });

        res.status(201).json({
            success: true,
            data: newAttendance,
            message: "Attendance marked successfully"
        });

    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// Update grades
export const updateGrades = async (req, res) => {
    try {
        const { studentId, courseId, assignment, grade, maxGrade, feedback } = req.body;

        const newGrade = await Grade.create({
            student: studentId,
            course: courseId,
            teacher: req.user.id,
            assignment,
            grade,
            maxGrade,
            feedback
        });

        res.status(201).json({
            success: true,
            data: newGrade,
            message: "Grades updated successfully"
        });

    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// Create assignment
export const createAssignment = async (req, res) => {
    try {
        const { title, description, courseId, dueDate, maxPoints } = req.body;

        const newAssignment = await Assignment.create({
            title,
            description,
            course: courseId,
            teacher: req.user.id,
            dueDate,
            maxPoints
        });

        res.status(201).json({
            success: true,
            data: newAssignment,
            message: "Assignment created successfully"
        });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// Get assignments for a course
export const getAssignments = async (req, res) => {
    try {
        const { courseId } = req.params;
        const assignments = await Assignment.find({ course: courseId });

        res.json({
            success: true,
            data: assignments
        });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// Upload material
export const uploadMaterial = async (req, res) => {
    try {
        const { title, description, courseId } = req.body;
        
        // Handle file upload
        const fileUrl = req.file ? `/uploads/materials/${req.file.filename}` : '';

        const newMaterial = await Material.create({
            title,
            description,
            course: courseId,
            teacher: req.user.id,
            fileUrl,
            fileType: req.file ? req.file.mimetype.split('/')[1].toUpperCase() : 'UNKNOWN'
        });

        res.status(201).json({
            success: true,
            data: newMaterial,
            message: "Material uploaded successfully"
        });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// Get materials for a course
export const getMaterials = async (req, res) => {
    try {
        const { courseId } = req.params;
        const materials = await Material.find({ course: courseId });
        res.json({
            success: true,
            data: materials
        });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};
