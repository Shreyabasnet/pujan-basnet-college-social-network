import mongoose from 'mongoose';

const gradeSchema = new mongoose.Schema({
    student: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    course: { type: mongoose.Schema.Types.ObjectId, ref: 'Course', required: true },
    teacher: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    assignment: String,
    grade: Number,
    maxGrade: Number,
    feedback: String,
    semester: String,
    year: Number,
    createdAt: { type: Date, default: Date.now }
});

export default mongoose.model('Grade', gradeSchema);
