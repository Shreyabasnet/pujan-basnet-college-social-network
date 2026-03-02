import User from '../models/User.js';
import Course from '../models/Course.js';

// Get all teachers
export const getAllTeachers = async (req, res) => {
    try {
        const teachers = await User.find({ role: 'TEACHER' }).select('-password');
        res.status(200).json(teachers);
    } catch (error) {
        res.status(500).json({ message: 'Server error', error: error.message });
    }
};

// Get all students
export const getAllStudents = async (req, res) => {
    try {
        const students = await User.find({ role: 'STUDENT' }).select('-password');
        res.status(200).json(students);
    } catch (error) {
        res.status(500).json({ message: 'Server error', error: error.message });
    }
};

// Delete a user
export const deleteUser = async (req, res) => {
    try {
        const { id } = req.params;
        const user = await User.findById(id);

        if (!user) {
            return res.status(404).json({ message: 'User not found' });
        }

        // Prevent deleting self (current admin)
        if (id === req.user.id) {
            return res.status(400).json({ message: 'Cannot delete yourself' });
        }

        await User.findByIdAndDelete(id);
        res.status(200).json({ message: 'User deleted successfully' });
    } catch (error) {
        res.status(500).json({ message: 'Server error', error: error.message });
    }
};

// Get all courses
export const getAllCourses = async (req, res) => {
    try {
        const courses = await Course.find().populate('teacher', 'username');
        res.status(200).json(courses);
    } catch (error) {
        res.status(500).json({ message: 'Server error', error: error.message });
    }
};

// Create a course
export const createCourse = async (req, res) => {
    try {
        const { name, code, description, teacher, schedule } = req.body;

        const existingCourse = await Course.findOne({ code });
        if (existingCourse) {
            return res.status(400).json({ message: 'Course with this code already exists' });
        }

        const newCourse = new Course({
            name,
            code,
            description,
            teacher,
            schedule
        });

        await newCourse.save();
        res.status(201).json(newCourse);
    } catch (error) {
        res.status(500).json({ message: 'Server error', error: error.message });
    }
};

// Update a course
export const updateCourse = async (req, res) => {
    try {
        const { id } = req.params;
        const { name, code, description, teacher, schedule } = req.body;

        const course = await Course.findById(id);
        if (!course) {
            return res.status(404).json({ message: 'Course not found' });
        }

        course.name = name || course.name;
        course.code = code || course.code;
        course.description = description || course.description;
        course.teacher = teacher || course.teacher;
        course.schedule = schedule || course.schedule;

        await course.save();
        res.status(200).json(course);
    } catch (error) {
        res.status(500).json({ message: 'Server error', error: error.message });
    }
};

// Delete a course
export const deleteCourse = async (req, res) => {
    try {
        const { id } = req.params;
        const course = await Course.findById(id);

        if (!course) {
            return res.status(404).json({ message: 'Course not found' });
        }

        await Course.findByIdAndDelete(id);
        res.status(200).json({ message: 'Course deleted successfully' });
    } catch (error) {
        res.status(500).json({ message: 'Server error', error: error.message });
    }
};

// Get dashboard statistics
export const getDashboardStats = async (req, res) => {
    try {
        const studentCount = await User.countDocuments({ role: 'STUDENT' });
        const teacherCount = await User.countDocuments({ role: 'TEACHER' });
        const courseCount = await Course.countDocuments();

        res.status(200).json({
            students: studentCount,
            teachers: teacherCount,
            courses: courseCount
        });
    } catch (error) {
        res.status(500).json({ message: 'Server error', error: error.message });
    }
};
