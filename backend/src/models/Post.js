import mongoose from 'mongoose';

const postSchema = new mongoose.Schema({
    author: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true,
    },
    text: {
        type: String,
        required: true,
    },
    image: {
        type: String, // Path to the uploaded image
        default: '',
    },
    fileUrl: {
        type: String,
        default: '',
    },
    fileName: {
        type: String,
        default: '',
    },
    isEdited: {
        type: Boolean,
        default: false,
    },

    likes: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
    }],
    comments: [{
        user: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'User',
            required: true,
        },
        text: {
            type: String,
            required: true,
        },
        createdAt: {
            type: Date,
            default: Date.now,
        }
    }]
}, { timestamps: true });

const Post = mongoose.model('Post', postSchema);

export default Post;
