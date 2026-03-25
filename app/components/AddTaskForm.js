"use client"

import { useState } from "react"

export default function AddTaskForm({ project, AllTask }) {

    const startLimit = project?.start_date?.split("T")[0]
    const endLimit = project?.due_date?.split("T")[0]
    const lastTask = AllTask?.[AllTask.length - 1]
    const lastDueDate = lastTask?.due_date?.split("T")[0]
    const [task, setTask] = useState({
        project_id: project?.id,
        title: "",
        description: "",
        start_date: lastDueDate || "",
        due_date: "",
        status: "todo",
        priority: "medium",
    })

    const handleChange = (key, value) => {
        setTask(prev => ({
            ...prev,
            [key]: value
        }))
    }

    const handleSubmit = async (e) => {

        console.log(task)
    }

    return (
        <div
            className="border rounded-lg p-4 mb-6 dark:border-gray-700 bg-white dark:bg-gray-900"
        >
            <h3 className="font-semibold mb-4 text-sm">เพิ่มงาน</h3>

            <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-6 gap-3">

                <input
                    type="text"
                    placeholder="Task title..."
                    className="border rounded px-3 py-2 text-sm dark:bg-gray-800"
                    value={task.title}
                    onChange={(e) => handleChange("title", e.target.value)}
                />

                <textarea
                    placeholder="Description..."
                    rows={3}
                    className="border rounded px-3 py-2 text-sm dark:bg-gray-800 resize-none md:col-span-3 lg:col-span-6"
                    value={task.description}
                    onChange={(e) => handleChange("description", e.target.value)}
                />

                <input
                    type="date"
                    min={startLimit}
                    max={endLimit}
                    className="border rounded px-3 py-2 text-sm dark:bg-gray-800"
                    value={task.start_date}
                    onChange={(e) => handleChange("start_date", e.target.value)}
                />

                <input
                    type="date"
                    min={startLimit}
                    max={endLimit}
                    className="border rounded px-3 py-2 text-sm dark:bg-gray-800"
                    value={task.due_date}
                    onChange={(e) => handleChange("due_date", e.target.value)}
                />

                <select
                    className="border rounded px-3 py-2 text-sm dark:bg-gray-800"
                    value={task.status}
                    onChange={(e) => handleChange("status", e.target.value)}
                >
                    <option value="todo">Todo</option>
                    <option value="in_progress">In Progress</option>
                    <option value="done">Done</option>
                </select>

                <select
                    className="border rounded px-3 py-2 text-sm dark:bg-gray-800"
                    value={task.priority}
                    onChange={(e) => handleChange("priority", e.target.value)}
                >
                    <option value="low">Low</option>
                    <option value="medium">Medium</option>
                    <option value="high">High</option>
                    <option value="urgent">Urgent</option>
                </select>

            </div>

            <div className="mt-4 flex justify-end">
                <button
                    type="button"
                    className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded text-sm"
                    onClick={handleSubmit}
                >
                    เพิ่มงาน
                </button>
            </div>
        </div>
    )
}