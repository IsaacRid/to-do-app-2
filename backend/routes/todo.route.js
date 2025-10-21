import express from "express"
import Todo from "../models/todo.model.js"

const router = express.Router()

// Get all todos for a specific user
router.get("/", async (req, res) => {
    try {
        const { userId } = req.query
        if (!userId) return res.status(400).json({ message: "userId is required" })
        const todos = await Todo.find({ userId })
        res.json(todos)
    } catch (err) {
        res.status(500).json({ message: err.message })
    }
})

// Add a new todo
router.post("/", async (req, res) => {
    try {
        const { text, userId } = req.body
        if (!userId) return res.status(400).json({ message: "userId is required" })
        const todo = new Todo({ text, userId })
        const newTodo = await todo.save()
        res.status(201).json(newTodo)
    } catch (err) {
        res.status(400).json({ message: err.message })
    }
})

// Update a todo (text or completed)
router.patch("/:id", async (req, res) => {
    try {
        const { userId } = req.body
        if (!userId) return res.status(400).json({ message: "userId is required" })

        const todo = await Todo.findOne({ _id: req.params.id, userId })
        if (!todo) return res.status(404).json({ message: "Todo not found" })

        if (req.body.text !== undefined) todo.text = req.body.text
        if (req.body.completed !== undefined) todo.completed = req.body.completed

        const updatedTodo = await todo.save()
        res.json(updatedTodo)
    } catch (err) {
        res.status(400).json({ message: err.message })
    }
})

// Delete a todo
router.delete("/:id", async (req, res) => {
    try {
        const { userId } = req.body
        if (!userId) return res.status(400).json({ message: "userId is required" })

        const todo = await Todo.findOneAndDelete({ _id: req.params.id, userId })
        if (!todo) return res.status(404).json({ message: "Todo not found" })

        res.json({ message: "Todo deleted" })
    } catch (err) {
        res.status(500).json({ message: err.message })
    }
})

export default router
