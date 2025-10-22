import mongoose from "mongoose";
import dotenv from 'dotenv';

dotenv.config({ path: '../.env' });
console.log('MONGODB_URI=', process.env.MONGODB_URI);

export const connectDB = async () => {
    try {
        const conn = await mongoose.connect(process.env.MONGO_URI)
        console.log(`MongoDB Connected: ${conn.connection.host}`)
    } catch (err) {
        console.log(err)
        process.exit(1)
    }
}
