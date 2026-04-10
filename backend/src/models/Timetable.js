import mongoose from 'mongoose';

const timetableEntrySchema = new mongoose.Schema(
    {
        dayOfWeek: {
            type: String,
            enum: ['MONDAY', 'TUESDAY', 'WEDNESDAY', 'THURSDAY', 'FRIDAY', 'SATURDAY', 'SUNDAY'],
            required: true
        },
        periodNumber: {
            type: Number,
            required: true,
            min: 1
        },
        startTime: {
            type: String,
            required: true
        },
        endTime: {
            type: String,
            required: true
        },
        subject: {
            type: String,
            required: true,
            trim: true
        },
        teacherId: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'User',
            required: true
        },
        room: {
            type: String,
            default: '',
            trim: true
        }
    },
    { _id: false }
);

const timetableSchema = new mongoose.Schema(
    {
        classId: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'ClassSection',
            required: true
        },
        academicYear: {
            type: Number,
            required: true
        },
        pdfUrl: {
            type: String,
            default: ''
        },
        entries: {
            type: [timetableEntrySchema],
            default: []
        }
    },
    { timestamps: true }
);

timetableSchema.index({ classId: 1, academicYear: 1 }, { unique: true });

const Timetable = mongoose.model('Timetable', timetableSchema);

export default Timetable;
