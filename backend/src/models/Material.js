import mongoose from 'mongoose';

const materialSchema = new mongoose.Schema({
    title: {
        type: String,
        required: true
    },
    description: {
        type: String
    },
    course: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Course',
        required: true
    },
    teacher: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true
    },
    fileUrl: {
        type: String,
        required: true
    },
    fileType: {
        type: String // (e.g. PDF, DOCX, ZIP)
    },
    createdAt: {
        type: Date,
        default: Date.now
    }
});

const Material = mongoose.model('Material', materialSchema);

export default Material;
