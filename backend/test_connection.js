import dotenv from 'dotenv';
import mongoose from 'mongoose';
dotenv.config();

const uri = process.env.MONGO_URI;
console.log('Testing MONGO_URI...');

const testConnection = async () => {
    try {
        await mongoose.connect(uri, {
            serverSelectionTimeoutMS: 5000,
        });
        console.log('SUCCESS: Connected to MongoDB.');
        await mongoose.disconnect();
        process.exit(0);
    } catch (err) {
        console.error('FAILURE: Connection failed.');
        console.error('Message:', err.message);
        process.exit(1);
    }
};

testConnection();
