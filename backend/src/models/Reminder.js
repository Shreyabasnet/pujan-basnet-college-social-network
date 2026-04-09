import mongoose from 'mongoose';

const reminderSchema = new mongoose.Schema(
    {
        student: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'User',
            required: true,
        },
        title: {
            type: String,
            required: true,
            trim: true,
        },
        date: {
            type: String,
            required: true,
        },
        time: {
            type: String,
            required: true,
        },
        description: {
            type: String,
            default: '',
            trim: true,
        },
    },
    { timestamps: true }
);

const Reminder = mongoose.model('Reminder', reminderSchema);

export default Reminder;