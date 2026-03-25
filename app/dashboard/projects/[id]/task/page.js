'use client'

import { Pencil } from "lucide-react"
import { useEffect, useState } from "react"
import { useParams } from "next/navigation"
import Link from "next/link"
export default function ProjectTaskPage() {
    const params = useParams()
    const { id } = params

    const [tasks, setTasks] = useState([])
    const [loading, setLoading] = useState(true)

    useEffect(() => {

        async function loadTasks() {

            const res = await fetch(`/api/v1/project_task/${id}`)

            const data = await res.json()

            setTasks(data.tasks)
            setLoading(false)

        }

        loadTasks()

    }, [id])

    if (loading) {
        return <div>กำลังโหลด...</div>
    }

    const getDurationDays = (start, end) => {
        if (!start || !end) return "-"

        const startDate = new Date(start)
        const endDate = new Date(end)

        if (isNaN(startDate) || isNaN(endDate)) return "-"

        const diffTime = endDate.getTime() - startDate.getTime()
        const diffDays = Math.floor(diffTime / (1000 * 60 * 60 * 24)) + 1

        return diffDays
    }
    return (

        <div className="w-full max-w-6xl">

            <h1 className="text-xl font-bold my-2">
                งานของโปรเจ็ค
            </h1>

            {/* Desktop Table */}

            <div className="hidden md:block">

                <table className="w-full border-collapse ">

                    <thead>
                        <tr className="text-left border-b ">
                            <th className="py-3 px-4 max-lg:text-[14px]">งาน</th>
                            <th className="py-3 px-4 max-lg:text-[14px]">สถานะ</th>
                            <th className="py-3 px-4 max-lg:text-[14px]">ความสำเร็จ</th>
                            <th className="py-3 px-4 max-lg:text-[14px]">พนักงานที่รับผิดชอบ</th>
                            <th className="py-3 px-4 max-lg:text-[14px]">วันที่เริ่มต้นงาน</th>
                            <th className="py-3 px-4 max-lg:text-[14px]">กำหนดส่งงาน</th>
                            <th className="py-3 px-4 max-lg:text-[14px]">จำนวนวัน</th>
                            <th className="py-3 px-4 max-lg:text-[14px] text-center">จัดการ</th>
                        </tr>
                    </thead>

                    <tbody>

                        {tasks.map(task => (

                            <tr
                                key={task.id}
                                className="border-b hover:bg-gray-100 dark:hover:bg-gray-700"
                            >

                                <td className="py-3 px-4 max-lg:text-[12px]">
                                    {task.title}
                                </td>

                                <td className="py-3 px-4 max-lg:text-[12px]">
                                    {task.status === "in_progress" ? "In Progress" : task.status}
                                </td>

                                <td className="py-3 px-4 max-lg:text-[12px]">
                                    {task.priority}
                                </td>

                                <td className="py-3 px-4 max-lg:text-[12px]">
                                    {task.first_name} {task.last_name}
                                </td>

                                <td className="py-3 px-4 max-lg:text-[12px]">
                                    {task.start_date
                                        ? new Date(task.start_date).toLocaleDateString("th-TH", {
                                            day: "2-digit",
                                            month: "short",
                                            year: "numeric"
                                        })
                                        : "-"
                                    }
                                </td>
                                <td className="py-3 px-4 max-lg:text-[12px]">
                                    {task.due_date
                                        ? new Date(task.due_date).toLocaleDateString("th-TH", {
                                            day: "2-digit",
                                            month: "short",
                                            year: "numeric"
                                        })
                                        : "-"
                                    }
                                </td>
                                <td className="py-3 px-4 font-medium text-center max-lg:text-[12px]">
                                    {getDurationDays(task.start_date, task.due_date)} วัน
                                </td>
                                <td className="py-3 px-4 text-center">
                                    <Link
                                        href={`/dashboard/project/${id}/tasks/edit/${task.id}`}
                                        className="inline-flex items-center gap-1 px-3 py-1 text-sm bg-blue-500 text-white rounded hover:bg-blue-600"
                                    >
                                        <Pencil size={14} />
                                        Edit
                                    </Link>
                                </td>
                            </tr>

                        ))}

                    </tbody>

                </table>

            </div>


            {/* Mobile Card */}

            <div className="md:hidden space-y-3">

                {tasks.map(task => (

                    <div
                        key={task.id}
                        className="p-4 rounded-lg bg-gray-800"
                    >

                        <div className="font-semibold">
                            {task.title}
                        </div>

                        <div className="text-sm text-gray-400">
                            Status: {task.status}
                        </div>

                        <div className="text-sm text-gray-400">
                            Priority: {task.priority}
                        </div>

                        <div className="text-sm text-gray-400">
                            Assignee: {task.first_name} {task.last_name}
                        </div>

                    </div>

                ))}

            </div>

        </div>

    )
}