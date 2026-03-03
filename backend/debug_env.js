import dotenv from 'dotenv';
dotenv.config();
console.log('MONGO_URI raw:', process.env.MONGO_URI);
console.log('MONGO_URI length:', process.env.MONGO_URI ? process.env.MONGO_URI.length : 0);
console.log('Starts with space:', process.env.MONGO_URI && process.env.MONGO_URI.startsWith(' '));
console.log('Starts with quote:', process.env.MONGO_URI && process.env.MONGO_URI.startsWith('"'));
