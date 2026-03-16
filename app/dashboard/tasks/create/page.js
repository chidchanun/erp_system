'use client'

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import SuccessCard from "@/app/components/SuccessCard"

export default function TaskCreatePage() {

    const router = useRouter()

    const [title, setTitle] = useState("")
    const [description, setDescription] = useState("")
    const [priority, setPriority] = useState("Medium")
    const [status, setStatus] = useState("Draft")
    const [dueDate, setDueDate] = useState("")
    const [parentTaskId, setParentTaskId] = useState("")

    const [tasks, setTasks] = useState([])

    const [loading, setLoading] = useState(false)
    const [error, setError] = useState("")
    const [success, setSuccess] = useState("")
    const [showSuccess, setShowSuccess] = useState(false)


    // โหลด task
    useEffect(() => {

        const fetchTasks = async () => {
            try {
                const res = await fetch("/api/v1/task", {
                    credentials: "include"
                })
                const data = await res.json()
                if (res.ok) {
                    setTasks(data.data || [])
                }
            } catch (error) {
                console.log("โหลด task ไม่สำเร็จ", error)
            }
        }
        fetchTasks()
    }, [])

    const handleSubmit = async (e) => {

        e.preventDefault()

        setLoading(true)
        setError("")
        setSuccess("")

        try {

            const res = await fetch("/api/v1/task/create", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json"
                },
                credentials: "include",
                body: JSON.stringify({
                    title,
                    description,
                    priority,
                    status,
                    due_date: dueDate,
                    parent_task_id: parentTaskId || null
                })
            })

            const data = await res.json()

            if (!res.ok) {
                setError(data.message)
                setLoading(false)
                return
            }

            setShowSuccess(true)
            

        } catch {
            setError("เกิดข้อผิดพลาด")
        }

        setLoading(false)

    }

    return (
        <div className="max-w-2xl mx-auto p-6 max-md:p-3">
            {showSuccess && (
                <SuccessCard
                    message="บันทึกงานสำเร็จ"
                    onClose={() => {
                        setShowSuccess(false)
                        router.push("/dashboard/tasks/my-task")
                    }}
                />
            )}
            <h1 className="text-2xl font-bold mb-6">
                สร้างงานใหม่
            </h1>

            <form
                onSubmit={handleSubmit}
                className="space-y-4 bg-white dark:bg-gray-800 p-6 rounded-xl shadow"
            >

                {/* Title */}
                <div>
                    <label className="block mb-1 text-sm font-medium">
                        ชื่องาน
                    </label>
                    <input
                        type="text"
                        className="w-full border rounded-lg px-3 py-2 dark:bg-gray-700"
                        value={title}
                        onChange={(e) => setTitle(e.target.value)}
                        required
                    />
                </div>

                {/* Description */}
                <div>
                    <label className="block mb-1 text-sm font-medium">
                        รายละเอียด
                    </label>
                    <textarea
                        className="w-full border rounded-lg px-3 py-2 dark:bg-gray-700"
                        rows="4"
                        value={description}
                        onChange={(e) => setDescription(e.target.value)}
                        required
                    />
                </div>

                {/* Priority */}
                <div>
                    <label className="block mb-1 text-sm font-medium">
                        ความสำคัญ
                    </label>
                    <select
                        className="w-full border rounded-lg px-3 py-2 dark:bg-gray-700"
                        value={priority}
                        onChange={(e) => setPriority(e.target.value)}
                    >
                        <option value="Low">Low</option>
                        <option value="Medium">Medium</option>
                        <option value="High">High</option>
                    </select>
                </div>

                {/* Status */}
                <div>
                    <label className="block mb-1 text-sm font-medium">
                        สถานะ
                    </label>
                    <select
                        className="w-full border rounded-lg px-3 py-2 dark:bg-gray-700"
                        value={status}
                        onChange={(e) => setStatus(e.target.value)}
                    >
                        <option value="Draft">Draft</option>
                        <option value="Pending">Pending</option>
                        <option value="In Progress">In Progress</option>
                        <option value="Completed">Completed</option>
                    </select>
                </div>

                {/* Due Date */}
                <div>
                    <label className="block mb-1 text-sm font-medium">
                        กำหนดส่ง
                    </label>

                    <input
                        type="datetime-local"
                        className="w-full border rounded-lg px-3 py-2 dark:bg-gray-700"
                        value={dueDate}
                        onChange={(e) => setDueDate(e.target.value)}
                        required
                    />
                </div>

                {/* Parent Task */}
                <div>
                    <label className="block mb-1 text-sm font-medium">
                        Parent Task
                    </label>

                    <select
                        className="w-full border rounded-lg px-3 py-2 dark:bg-gray-700"
                        value={parentTaskId}
                        onChange={(e) => setParentTaskId(e.target.value)}
                    >

                        <option value="">
                            ไม่มี Parent Task
                        </option>

                        {tasks.map((task) => (
                            <option
                                key={task.id}
                                value={task.id}
                            >
                                {task.title}
                            </option>
                        ))}

                    </select>

                </div>

                {error && (
                    <div className="text-red-500 text-sm">
                        {error}
                    </div>
                )}

                {success && (
                    <div className="text-green-500 text-sm">
                        {success}
                    </div>
                )}

                <button
                    type="submit"
                    disabled={loading}
                    className="w-full bg-blue-600 hover:bg-blue-700 text-white py-2 rounded-lg transition"
                >
                    {loading ? "กำลังบันทึก..." : "สร้างงาน"}
                </button>

            </form>

        </div>
    )
}