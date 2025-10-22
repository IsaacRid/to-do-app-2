import mongoose from "mongoose";
import dotenv from "dotenv";
import path from "path";

const envPath = path.resolve(process.cwd(), "../.env");
dotenv.config({ path: envPath });

export const connectDB = async () => {
    try {
        if (!process.env.MONGO_URI) {
            console.error(`MONGO_URI is not defined. Loaded .env path: ${envPath}`);
            throw new Error("MONGO_URI is not defined in .env");
        }

        const conn = await mongoose.connect(process.env.MONGO_URI, {
            useNewUrlParser: true,
            useUnifiedTopology: true,
        });

        console.log(`MongoDB Connected: ${conn.connection.host}`);
    } catch (err) {
        console.error("Failed to connect to MongoDB:", err);
        process.exit(1);
    }
};
