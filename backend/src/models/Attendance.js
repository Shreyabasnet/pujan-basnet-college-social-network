import mongoose from 'mongoose';

const attendanceSchema = new mongoose.Schema({
    student: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    course: { type: mongoose.Schema.Types.ObjectId, ref: 'Course', required: true },
    date: { type: Date, required: true },
    status: { type: String, enum: ['present', 'absent', 'late'], required: true },
    markedBy: { type: mongoose.Schema.Types.ObjectId, ref: 'User' }
});

export default mongoose.model('Attendance', attendanceSchema);
