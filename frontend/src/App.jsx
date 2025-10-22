import { useState, useEffect } from 'react'
import { MdOutlineDone, MdModeEditOutline } from "react-icons/md"
import { IoClose, IoClipboardOutline } from "react-icons/io5"
import { FaTrash } from "react-icons/fa6"
import axios from 'axios'

export default function App() {


  const [newTodo, setNewTodo] = useState("")
  const [todos, setTodos] = useState([])
  const [editingTodo, setEditingTodo] = useState(null)
  const [editedText, setEditedText] = useState("")
  const [userId, setUserId] = useState(null)

  useEffect(() => {
    let id = localStorage.getItem("userId")
    if (!id) {
      if (typeof window !== "undefined" && window.crypto?.randomUUID) {
        id = window.crypto.randomUUID()
      } else {
        id = 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, c => {
          const r = Math.random() * 16 | 0
          const v = c === 'x' ? r : (r & 0x3 | 0x8)
          return v.toString(16)
        })
      }
      localStorage.setItem("userId", id)
    }
    setUserId(id)

    const fetchTodos = async () => {
      try {
        const res = await axios.get(`/api/todos?userId=${id}`)
        setTodos(res.data)
      } catch (err) {
        console.error("Error fetching todos:", err)
      }
    }
    fetchTodos()
  }, [])

  const addTodo = async (e) => {
    e.preventDefault()
    if (!newTodo.trim()) return
    try {
      const res = await axios.post("/api/todos", { text: newTodo, userId })
      setTodos([...todos, res.data])
      setNewTodo("")
    } catch (err) {
      console.error("Error adding todo:", err)
    }
  }

  const startEditing = (todo) => {
    setEditingTodo(todo._id)
    setEditedText(todo.text)
  }

  const saveEdit = async (id) => {
    try {
      const res = await axios.patch(`/api/todos/${id}`, { text: editedText, userId })
      setTodos(todos.map((t) => (t._id === id ? res.data : t)))
      setEditingTodo(null)
      setEditedText("")
    } catch (err) {
      console.error("Error updating todo:", err)
    }
  }

  const deleteTodo = async (id) => {
    try {
      await axios.delete(`/api/todos/${id}`, { data: { userId } })
      setTodos(todos.filter((t) => t._id !== id))
    } catch (err) {
      console.error("Error deleting todo:", err)
    }
  }

  const toggleComplete = async (todo) => {
    try {
      const res = await axios.patch(`/api/todos/${todo._id}`, { completed: !todo.completed, userId })
      setTodos(todos.map((t) => (t._id === todo._id ? res.data : t)))
    } catch (err) {
      console.error("Error toggling completion:", err)
    }
  }

  return (
    <div className='min-h-screen bg-gradient-to-br from-gray-50 to-gray-200 flex items-center justify-center p-4'>
      <div className='bg-white rounded-2xl shadow-xl w-full max-w-lg p-8'>
        <h1 className='text-4xl font-bold text-gray-800 mb-8 flex items-center gap-2'>
          <IoClipboardOutline className='text-blue-500' /> Todo List
        </h1>

        <form
          onSubmit={addTodo}
          className='flex flex-col sm:flex-row items-center gap-2 shadow-sm border border-gray-200 p-2 rounded-lg'
        >
          <input
            type='text'
            value={newTodo}
            onChange={(e) => setNewTodo(e.target.value)}
            placeholder='What needs to be done?'
            className='flex-1 outline-none px-3 py-2 text-gray-700 placeholder-gray-400 w-full'
          />
          <button
            type='submit'
            className='bg-blue-500 hover:bg-blue-600 text-white px-5 py-2 rounded-md font-medium w-full sm:w-auto mt-2 sm:mt-0'
          >
            Add Task
          </button>
        </form>

        <div className='mt-6 space-y-3'>
          {todos.length === 0 ? (
            <p className='text-gray-400 text-center'>No tasks yet</p>
          ) : (
            todos.map((todo) => (
              <div key={todo._id} className='flex items-center justify-between p-3 bg-gray-50 border border-gray-200 rounded-lg'>
                {editingTodo === todo._id ? (
                  <div className='flex items-center gap-x-3 w-full'>
                    <input
                      className='flex-1 p-2 border border-gray-200 rounded-lg outline-none focus:ring-2 focus:ring-blue-300 text-gray-700 shadow-inner'
                      type='text'
                      value={editedText}
                      onChange={(e) => setEditedText(e.target.value)}
                    />
                    <button
                      className='px-3 py-2 bg-green-500 text-white rounded-lg hover:bg-green-600 cursor-pointer'
                      onClick={() => saveEdit(todo._id)}
                    >
                      <MdOutlineDone />
                    </button>
                    <button
                      className='px-3 py-2 bg-red-500 text-white rounded-lg hover:bg-red-600 cursor-pointer'
                      onClick={() => setEditingTodo(null)}
                    >
                      <IoClose />
                    </button>
                  </div>
                ) : (
                  <div className='flex items-center justify-between w-full'>
                    <div className='flex items-center gap-x-4'>
                      <button
                        onClick={() => toggleComplete(todo)}
                        className={`h-6 w-6 border rounded-full flex items-center justify-center ${todo.completed
                          ? 'bg-green-500 border-green-500'
                          : 'border-gray-300 hover:border-blue-400'
                          }`}
                      >
                        {todo.completed && <MdOutlineDone className='text-white text-sm' />}
                      </button>
                      <span
                        className={`text-gray-800 font-medium ${todo.completed ? 'line-through text-gray-400' : ''}`}
                      >
                        {todo.text}
                      </span>
                    </div>
                    <div className='flex gap-x-2'>
                      <button
                        className='p-2 text-blue-500 hover:text-blue-700 rounded-lg hover:bg-blue-50 duration-200'
                        onClick={() => startEditing(todo)}
                      >
                        <MdModeEditOutline />
                      </button>
                      <button
                        className='p-2 text-red-500 hover:text-red-700 rounded-lg hover:bg-red-50 duration-200'
                        onClick={() => deleteTodo(todo._id)}
                      >
                        <FaTrash />
                      </button>
                    </div>
                  </div>
                )}
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  )
}
