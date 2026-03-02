import dotenv from "dotenv";

dotenv.config(); // MUST be at the top

const config = {
  port: process.env.PORT || 5000,
  mongoUri: process.env.MONGO_URI,
  cloudinary: {
    cloudName: process.env.CLOUDINARY_CLOUD_NAME || "",
    apiKey: process.env.CLOUDINARY_API_KEY || "",
    apiSecret: process.env.CLOUDINARY_API_SECRET || "",
  },
};

export default config;
