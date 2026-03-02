import User from '../models/User.js';
import Course from '../models/Course.js';
import Event from '../models/Event.js';

// Get student dashboard
export const getStudentDashboard = async (req, res) => {
    try {
        const studentId = req.user.id;

        // Get enrolled courses
        const myCourses = await Course.find({ students: studentId })
            .populate('teacher', 'username email');

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

        const courses = await Course.find({ students: req.user.id })
            .populate('teacher', 'username email');

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