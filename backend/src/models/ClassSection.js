import mongoose from 'mongoose';

const classSectionSchema = new mongoose.Schema(
    {
        name: {
            type: String,
            required: true,
            trim: true
        },
        section: {
            type: String,
            required: true,
            trim: true
        },
        academicYear: {
            type: Number,
            required: true
        }
    },
    { timestamps: true }
);

classSectionSchema.index({ name: 1, section: 1, academicYear: 1 }, { unique: true });

const ClassSection = mongoose.model('ClassSection', classSectionSchema);

export default ClassSection;
