import User from '../models/User.js';
import Course from '../models/Course.js';
import Event from '../models/Event.js';
import Grade from '../models/Grade.js';
import Attendance from '../models/Attendance.js';
import Material from '../models/Material.js';
import Assignment from '../models/Assignment.js';

// Get student dashboard
export const getStudentDashboard = async (req, res) => {
    try {
        const studentId = req.user.id;

        // Get enrolled courses + department courses
        const currentUser = await User.findById(studentId);
        console.log(`Checking courses for student ${studentId}, department: "${currentUser?.department}"`);
        
        const query = {
            $or: [{ students: studentId }]
        };

        if (currentUser.department) {
            query.$or.push({ 
                department: { $regex: new RegExp(`^${currentUser.department.trim()}$`, 'i') } 
            });
        }

        const myCourses = await Course.find(query).populate('teacher', 'username email');

        // Get recent grades
        const recentGrades = await Grade.find({ student: studentId })
            .sort({ createdAt: -1 })
            .limit(3)
            .populate('course', 'name code');

        // Get attendance summary
        const allAttendance = await Attendance.find({ student: studentId });
        const presentCount = allAttendance.filter(a => a.status === 'present').length;
        const attendancePercentage = allAttendance.length > 0
            ? Math.round((presentCount / allAttendance.length) * 100)
            : 0;

        // Get upcoming events
        const upcomingEvents = await Event.find({
            date: { $gte: new Date() }
        }).sort('date').limit(5);

        res.json({
            success: true,
            data: {
                enrolledCourses: myCourses,
                recentGrades: [],
                todayClasses: [],
                attendance: {
                    percentage: 0
                },
                upcomingDeadlines: upcomingEvents.map(event => ({
                    title: event.title,
                    date: new Date(event.date).toLocaleDateString()
                }))
            }
        });

    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};


// Get student's courses
export const getMyCourses = async (req, res) => {
    try {

        const currentUser = await User.findById(req.user.id);
        console.log(`Getting courses for student ${req.user.id}, department: "${currentUser?.department}"`);

        const query = {
            $or: [{ students: req.user.id }]
        };

        if (currentUser.department) {
            query.$or.push({ 
                department: { $regex: new RegExp(`^${currentUser.department.trim()}$`, 'i') } 
            });
        }

        const courses = await Course.find(query).populate('teacher', 'username email');

        res.json({
            success: true,
            data: courses
        });

    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};


// Get student's grades (dummy for now)
export const getMyGrades = async (req, res) => {
    try {

        res.json({
            success: true,
            data: []
        });

    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};


// Get student's attendance (dummy)
export const getMyAttendance = async (req, res) => {
    try {

        res.json({
            success: true,
            data: []
        });

    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};


// Get student's timetable (dummy)
export const getMyTimetable = async (req, res) => {
    try {

        res.json({
            success: true,
            data: []
        });

    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// Get study materials for student's enrolled/department courses
export const getMyMaterials = async (req, res) => {
    try {
        const currentUser = await User.findById(req.user.id);

        const courseQuery = {
            $or: [{ students: req.user.id }]
        };

        if (currentUser?.department) {
            courseQuery.$or.push({
                department: { $regex: new RegExp(`^${currentUser.department.trim()}$`, 'i') }
            });
        }

        const courses = await Course.find(courseQuery).select('_id');
        const courseIds = courses.map(course => course._id);

        const materials = await Material.find({ course: { $in: courseIds } })
            .populate('course', 'name code')
            .populate('teacher', 'username')
            .sort({ createdAt: -1 });

        res.json({
            success: true,
            data: materials
        });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// Get downloadable material URL if material belongs to student's course list
export const downloadMaterial = async (req, res) => {
    try {
        const { materialId } = req.params;

        const currentUser = await User.findById(req.user.id);
        const courseQuery = {
            $or: [{ students: req.user.id }]
        };

        if (currentUser?.department) {
            courseQuery.$or.push({
                department: { $regex: new RegExp(`^${currentUser.department.trim()}$`, 'i') }
            });
        }

        const courses = await Course.find(courseQuery).select('_id');
        const courseIds = courses.map(course => course._id.toString());

        const material = await Material.findById(materialId).populate('course', 'name code');

        if (!material || !courseIds.includes(material.course?._id?.toString())) {
            return res.status(404).json({ message: 'Material not found' });
        }

        return res.json({
            success: true,
            data: {
                fileUrl: material.fileUrl,
                title: material.title,
                fileType: material.fileType
            }
        });
    } catch (error) {
        return res.status(500).json({ message: error.message });
    }
};

// Get assignments for student's enrolled/department courses
export const getMyAssignments = async (req, res) => {
    try {
        const currentUser = await User.findById(req.user.id);

        const courseQuery = {
            $or: [{ students: req.user.id }]
        };

        if (currentUser?.department) {
            courseQuery.$or.push({
                department: { $regex: new RegExp(`^${currentUser.department.trim()}$`, 'i') }
            });
        }

        const courses = await Course.find(courseQuery).select('_id');
        const courseIds = courses.map(course => course._id);

        const assignments = await Assignment.find({ course: { $in: courseIds } })
            .populate('course', 'name code')
            .populate('teacher', 'username')
            .sort({ dueDate: 1 });

        return res.json({
            success: true,
            data: assignments
        });
    } catch (error) {
        return res.status(500).json({ message: error.message });
    }
};