import mongoose from 'mongoose';
import dotenv from 'dotenv';
dotenv.config();

const baseUri = "mongodb+srv://basnets349_db_user:PASSWORD@cluster0.qtmjdx5.mongodb.net/Cluster0";
const passwordsToTest = [
    "basnets349_db_user",
    "admin@123",
    "secret",
    "password",
    "123456"
];

const testPasswords = async () => {
    for (const pwd of passwordsToTest) {
        const uri = baseUri.replace("PASSWORD", encodeURIComponent(pwd));
        console.log(`Testing password: ${pwd}`);
        try {
            await mongoose.connect(uri, { serverSelectionTimeoutMS: 5000 });
            console.log(`SUCCESS! The correct password is: ${pwd}`);
            await mongoose.disconnect();
            process.exit(0);
        } catch (err) {
            console.log(`Failed with password: ${pwd} - ${err.message}`);
        }
    }
    console.log("None of the common passwords worked.");
    process.exit(1);
};

testPasswords();
