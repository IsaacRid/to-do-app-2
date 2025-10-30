import express from "express";
import dotenv from "dotenv";
import todoRoutes from "./routes/todo.route.js"
import { connectDB } from "./config/db.js"
import { fileURLToPath } from 'url';
import { dirname, join } from 'path';
import cors from 'cors';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

dotenv.config();

const app = express()
const PORT = process.env.PORT || 5000

app.use(cors());
app.use(express.json());

app.use("/api/todos", todoRoutes);

if (process.env.NODE_ENV === 'production') {
    app.use(express.static(join(__dirname, '../frontend/dist')));

    app.get('/*', (req, res) => {
        if (!req.path.startsWith('/api')) {
            res.sendFile(join(__dirname, '../frontend/dist/index.html'));
        }
    });
}

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
