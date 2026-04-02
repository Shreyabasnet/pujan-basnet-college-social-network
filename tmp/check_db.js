import mongoose from 'mongoose';
import User from '../backend/src/models/User.js';
import Course from '../backend/src/models/Course.js';
import dotenv from 'dotenv';
dotenv.config({ path: '../backend/.env' });

const checkData = async () => {
    try {
        await mongoose.connect(process.env.MONGO_URI || 'mongodb://localhost:27017/college-social');
        console.log('Connected to MongoDB');

        const students = await User.find({ role: 'STUDENT' });
        console.log('--- Students ---');
        students.forEach(s => {
            console.log(`- ${s.username} (ID: ${s._id}): Department: "${s.department}"`);
        });

        const courses = await Course.find();
        console.log('--- Courses ---');
        courses.forEach(c => {
            console.log(`- ${c.name} (Code: ${c.code}): Department: "${c.department}"`);
        });

        process.exit();
    } catch (err) {
        console.error(err);
        process.exit(1);
    }
};

checkData();
