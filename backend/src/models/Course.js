import mongoose from 'mongoose';

const courseSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true
    },

    code: {
        type: String,
        required: true,
        unique: true
    },

    description: {
        type: String
    },

    teacher: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true
    },

    students: [
        {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'User'
        }
    ],

    schedule: {
        day: String,
        startTime: String,
        endTime: String,
        room: String
    },

    createdAt: {
        type: Date,
        default: Date.now
    }

});

const Course = mongoose.model('Course', courseSchema);

export default Course;