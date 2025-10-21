import express from "express";
import dotenv from "dotenv";
import todoRoutes from "./routes/todo.route.js"
import { connectDB } from "./config/db.js"

dotenv.config();

const app = express()
const PORT = 5000

app.get("/", (req, res) => {
    res.send("Server is ready")
})

app.use(express.json())

app.use("/api/todos", todoRoutes);

app.listen(PORT, () => {
    connectDB();
    console.log(`Server started at http://localhost:${PORT}`)
})