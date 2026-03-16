'use client'

import { useEffect, useState } from "react"
import { useParams, useRouter } from "next/navigation"
import SuccessCard from "@/app/components/SuccessCard"

export default function EditTaskPage() {

    const { id } = useParams()
    const router = useRouter()

    const [loading, setLoading] = useState(true)
    const [showSuccess, setShowSuccess] = useState(false)

    const [task, setTask] = useState({
        id: null,
        title: "",
        description: "",
        priority: "Medium",
        status: "Pending",
        due_date: ""
    })
    const formatDateTime = (date) => {

        if (!date) return ""

        const d = new Date(date)
        return d.toISOString().slice(0, 16)

    }
    useEffect(() => {

        const fetchTask = async () => {

            try {

                const res = await fetch(`/api/v1/task/${id}`, {
                    credentials: "include"
                })

                const data = await res.json()


                if (res.ok) {

                    const t = data.data[0]

                    setTask({
                        id: t.id,
                        title: t.title || "",
                        description: t.description || "",
                        priority: t.priority || "Medium",
                        status: t.status || "Pending",
                        due_date: formatDateTime(t.due_date)
                    })

                }

            } catch (err) {
                console.log("โหลด task ไม่สำเร็จ", err)
            }

            setLoading(false)

        }

        if (id) fetchTask()

    }, [id])



    const handleChange = (e) => {

        const { name, value } = e.target

        setTask(prev => ({
            ...prev,
            [name]: value
        }))

    }

    const handleSubmit = async (e) => {

        e.preventDefault()

        try {

            const res = await fetch(`/api/v1/task/update`, {

                method: "POST",
                headers: {
                    "Content-Type": "application/json"
                },
                credentials: "include",
                body: JSON.stringify(task)

            })

            if (res.ok) {
                setShowSuccess(true)
            }

        } catch (err) {
            console.log("แก้ไข task ไม่สำเร็จ", err)
        }

    }

    if (loading) {
        return <div className="p-6">กำลังโหลด...</div>
    }

    return (

        <div className="p-6 max-w-xl mx-auto max-md:p-3">
            {showSuccess && (
                <SuccessCard
                    message="แก้ไข Task สำเร็จ"
                    onClose={() => {
                        setShowSuccess(false)
                        router.push("/dashboard/tasks/my-task")
                    }}
                />
            )}
            <h1 className="text-2xl font-bold mb-6">
                แก้ไข Task
            </h1>

            <form
                onSubmit={handleSubmit}
                className="space-y-4 bg-white dark:bg-gray-800 p-6 rounded-xl shadow"
            >

                <div>
                    <label className="block mb-1 text-sm font-medium">
                        ชื่องาน
                    </label>
                    <input
                        name="title"
                        type="text"
                        className="w-full border rounded-lg px-3 py-2 dark:bg-gray-700"
                        value={task.title}
                        onChange={handleChange}
                        required
                    />
                </div>

                <div>
                    <label className="block mb-1 text-sm font-medium">
                        รายละเอียด
                    </label>
                    <textarea
                        name="description"
                        className="w-full border rounded-lg px-3 py-2 dark:bg-gray-700"
                        rows="4"
                        value={task.description}
                        onChange={handleChange}
                        required
                    />
                </div>

                <div>
                    <label className="block mb-1 text-sm font-medium">
                        ความสำคัญ
                    </label>
                    <select
                        name="priority"
                        className="w-full border rounded-lg px-3 py-2 dark:bg-gray-700"
                        value={task.priority}
                        onChange={handleChange}
                    >
                        <option value="Low">Low</option>
                        <option value="Medium">Medium</option>
                        <option value="High">High</option>
                    </select>
                </div>

                <div>
                    <label className="block mb-1 text-sm font-medium">
                        สถานะ
                    </label>
                    <select
                        name="status"
                        className="w-full border rounded-lg px-3 py-2 dark:bg-gray-700"
                        value={task.status}
                        onChange={handleChange}
                    >
                        <option value="Draft">Draft</option>
                        <option value="Pending">Pending</option>
                        <option value="In Progress">In Progress</option>
                        <option value="Completed">Completed</option>
                    </select>
                </div>



                <div>
                    <label className="block mb-1 text-sm font-medium">
                        กำหนดส่ง
                    </label>

                    <input
                        name="due_date"
                        type="datetime-local"
                        className="w-full border rounded-lg px-3 py-2 dark:bg-gray-700"
                        value={task.due_date}
                        onChange={handleChange}
                        required
                    />
                </div>

                <div className="flex gap-3 pt-2">

                    <button
                        type="submit"
                        className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700 cursor-pointer"
                    >
                        Save
                    </button>

                    <button
                        type="button"
                        onClick={() => router.back()}
                        className="bg-gray-600 px-4 py-2 rounded cursor-pointer text-white"
                    >
                        Cancel
                    </button>

                </div>

            </form>

        </div>

    )
}