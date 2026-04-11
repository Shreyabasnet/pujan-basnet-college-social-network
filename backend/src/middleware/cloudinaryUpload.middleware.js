import multer from 'multer';

// Use memory storage - the file buffer will be uploaded to Cloudinary
const storage = multer.memoryStorage();

const fileFilter = (req, file, cb) => {
    // Allow all file types for now - validation on upload if needed
    cb(null, true);
};

const cloudinaryUpload = multer({
    storage: storage,
    limits: {
        fileSize: 50 * 1024 * 1024 // 50MB limit
    },
    fileFilter: fileFilter
});

export default cloudinaryUpload;
