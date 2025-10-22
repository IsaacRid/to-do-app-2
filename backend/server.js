import express from "express";
import dotenv from "dotenv";
import cors from "cors";
import todoRoutes from "./routes/todo.route.js"
import { connectDB } from "./config/db.js"

dotenv.config();

const app = express()
const PORT = 5000

app.get("/", (req, res) => {
    res.send("Server is ready")
})

app.use(cors());

app.use(express.json())

app.use("/api/todos", todoRoutes);

const startServer = async () => {
    try {
        await connectDB();
        app.listen(PORT, () => {
            console.log(`Server started at http://localhost:${PORT}`);
        });
    } catch (err) {
        console.error("Failed to connect to MongoDB:", err);
        process.exit(1);
    }
};

startServer();
