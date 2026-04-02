import mongoose from 'mongoose';
import User from './backend/src/models/User.js';
import Course from './backend/src/models/Course.js';
import dotenv from 'dotenv';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

dotenv.config({ path: path.join(__dirname, 'backend', '.env') });

const checkData = async () => {
    try {
        const uri = process.env.MONGO_URI || 'mongodb://localhost:27017/college-social';
        console.log('Connecting to:', uri);
        await mongoose.connect(uri);
        console.log('Connected to MongoDB');

        const students = await User.find({ role: 'STUDENT' });
        console.log('\n--- Students ---');
        students.forEach(s => {
            console.log(`- ${s.username} (ID: ${s._id}): Department: "${s.department}"`);
        });

        const courses = await Course.find();
        console.log('\n--- Courses ---');
        courses.forEach(c => {
            console.log(`- ${c.name} (Code: ${c.code}): Department: "${c.department}"`);
        });

        await mongoose.connection.close();
        process.exit();
    } catch (err) {
        console.error(err);
        process.exit(1);
    }
};

checkData();
