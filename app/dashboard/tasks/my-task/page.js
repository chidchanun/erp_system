'use client'

import { useEffect, useState, Fragment } from "react"
import { useUser } from "@/app/context/UserContext"
import { useRouter } from "next/navigation"

export default function MyTaskPage() {

    const [tasks, setTasks] = useState([])
    const [loading, setLoading] = useState(true)
    const [expandedTasks, setExpandedTasks] = useState({})

    const router = useRouter()
    const user = useUser()

    const toggleTask = (taskId) => {
        setExpandedTasks((prev) => ({
            ...prev,
            [taskId]: !prev[taskId]
        }))
    }

    useEffect(() => {

        const fetchTasks = async () => {

            try {

                const res = await fetch("/api/v1/task", {
                    credentials: "include"
                })

                const data = await res.json()

                if (res.ok) {

                    const filterData = data.data.filter(
                        (task) => task.createdByUser_id === user.userId
                    )

                    setTasks(filterData)

                }

            } catch (error) {
                console.log("โหลด task ไม่สำเร็จ", error)
            }

            setLoading(false)

        }

        if (user?.userId) {
            fetchTasks()
        }

    }, [user])

    const formatDate = (date) => {
        return new Date(date).toLocaleString("th-TH")
    }

    const priorityColor = {
        Low: "text-green-500",
        Medium: "text-yellow-500",
        High: "text-red-500"
    }

    const renderTasks = (parentId = null, level = 0) => {

        return tasks
            .filter(task => task.parent_task_id === parentId)
            .map(task => {

                const isExpanded = expandedTasks[task.id]

                const hasChildren = tasks.some(
                    t => t.parent_task_id === task.id
                )

                return (
                    <Fragment key={task.id}>

                        <tr
                            className="border-b dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-700 cursor-pointer"
                            onClick={() => toggleTask(task.id)}
                        >

                            <td className="p-3">

                                <div
                                    className="flex items-center gap-2"
                                    style={{ paddingLeft: `${level * 20}px` }}
                                >

                                    {hasChildren
                                        ? (isExpanded ? "▼" : "▶")
                                        : "•"}

                                    <span className="whitespace-nowrap">
                                        {task.title}
                                    </span>

                                </div>

                            </td>

                            <td className={`p-3 ${priorityColor[task.priority]}`}>
                                {task.priority}
                            </td>

                            <td className="p-3">
                                {task.status}
                            </td>

                            <td className="p-3">
                                {formatDate(task.due_date)}
                            </td>

                            <td className="p-3">

                                <button
                                    onClick={(e) => {
                                        e.stopPropagation()
                                        router.push(`/dashboard/tasks/edit/${task.id}`)
                                    }}
                                    className="text-blue-600 hover:text-blue-800 cursor-pointer"
                                >
                                    Edit
                                </button>

                            </td>

                        </tr>

                        {isExpanded && renderTasks(task.id, level + 1)}

                    </Fragment>
                )

            })
    }

    const renderTaskCards = (parentId = null, level = 0) => {

        return tasks
            .filter(task => task.parent_task_id === parentId)
            .map(task => {

                const isExpanded = expandedTasks[task.id]

                const hasChildren = tasks.some(
                    t => t.parent_task_id === task.id
                )

                return (

                    <div key={task.id} className="flex flex-col gap-1.5">

                        <div
                            className="bg-white dark:bg-gray-800 p-4 rounded-xl shadow cursor-pointer gap-1.5"
                            style={{ marginLeft: `${level * 16}px` }}
                            onClick={() => toggleTask(task.id)}
                        >

                            <div className="flex justify-between items-start gap-1.5">

                                <div className="flex items-center gap-2">

                                    {hasChildren
                                        ? (isExpanded ? "▼" : "▶")
                                        : "•"}

                                    <h3 className="font-semibold text-base">
                                        {task.title}
                                    </h3>

                                </div>

                                <button
                                    onClick={(e) => {
                                        e.stopPropagation()
                                        router.push(`/dashboard/tasks/edit/${task.id}`)
                                    }}
                                    className="text-blue-600 text-sm cursor-pointer hover:underline"
                                >
                                    Edit
                                </button>

                            </div>

                            <div className="mt-2 text-sm text-gray-600 dark:text-gray-300 space-y-1">

                                <div>
                                    Priority :
                                    <span className={`ml-1 font-medium ${priorityColor[task.priority]}`}>
                                        {task.priority}
                                    </span>
                                </div>

                                <div>
                                    Status :
                                    <span className="ml-1">
                                        {task.status}
                                    </span>
                                </div>

                                <div>
                                    Due :
                                    <span className="ml-1">
                                        {formatDate(task.due_date)}
                                    </span>
                                </div>

                            </div>

                        </div>

                        {isExpanded && renderTaskCards(task.id, level + 1)}

                    </div>

                )

            })

    }

    return (

        <div className="p-6">

            <h1 className="text-2xl font-bold mb-6">
                งานของฉัน
            </h1>

            {loading ? (

                <div>กำลังโหลด...</div>

            ) : tasks.length === 0 ? (

                <div>ยังไม่มีงาน</div>

            ) : (

                <>
                    {/* Desktop / Tablet Table */}

                    <div className="hidden md:block overflow-x-auto bg-white dark:bg-gray-800 rounded-xl shadow">

                        <table className="w-full text-sm">

                            <thead className="border-b dark:border-gray-700">

                                <tr className="text-left">

                                    <th className="p-3">ชื่องาน</th>
                                    <th className="p-3">Priority</th>
                                    <th className="p-3">Status</th>
                                    <th className="p-3">Due Date</th>
                                    <th className="p-3">Action</th>

                                </tr>

                            </thead>

                            <tbody>

                                {renderTasks()}

                            </tbody>

                        </table>

                    </div>

                    {/* Mobile Card Layout */}

                    <div className="md:hidden space-y-3">
                        {renderTaskCards()}
                    </div>
                </>
            )}

        </div>

    )

}