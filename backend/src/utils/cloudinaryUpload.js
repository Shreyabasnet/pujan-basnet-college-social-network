import { v2 as cloudinary } from "cloudinary";

/**
 * Upload image to Cloudinary
 * @param {Buffer} fileBuffer - The file buffer
 * @param {string} folder - The folder name in Cloudinary
 * @returns {Promise<{url: string, public_id: string}>}
 */
export const uploadToCloudinary = (fileBuffer, folder = "collegesocial") => {
    return new Promise((resolve, reject) => {
        const uploadStream = cloudinary.uploader.upload_stream(
            {
                folder: folder,
                resource_type: "auto",
            },
            (error, result) => {
                if (error) {
                    reject(error);
                } else {
                    resolve({
                        url: result.secure_url,
                        public_id: result.public_id
                    });
                }
            }
        );
        uploadStream.end(fileBuffer);
    });
};

/**
 * Upload profile picture to Cloudinary with specific transformations
 * @param {Buffer} fileBuffer - The file buffer
 * @returns {Promise<{url: string, public_id: string}>}
 */
export const uploadProfilePicture = (fileBuffer) => {
    return new Promise((resolve, reject) => {
        const uploadStream = cloudinary.uploader.upload_stream(
            {
                folder: "collegesocial/profiles",
                resource_type: "image",
                transformation: [
                    { width: 400, height: 400, crop: "fill", gravity: "face" },
                    { quality: "auto" },
                    { fetch_format: "auto" }
                ]
            },
            (error, result) => {
                if (error) {
                    reject(error);
                } else {
                    resolve({
                        url: result.secure_url,
                        public_id: result.public_id
                    });
                }
            }
        );
        uploadStream.end(fileBuffer);
    });
};

/**
 * Delete image from Cloudinary
 * @param {string} publicId - The public_id of the image
 * @returns {Promise}
 */
export const deleteFromCloudinary = async (publicId) => {
    try {
        await cloudinary.uploader.destroy(publicId);
    } catch (error) {
        console.error("Error deleting from Cloudinary:", error);
    }
};

export default { uploadToCloudinary, uploadProfilePicture, deleteFromCloudinary };
