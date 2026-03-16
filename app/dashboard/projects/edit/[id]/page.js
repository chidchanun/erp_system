'use client';

import Breadcrumb from "@/app/components/Breadcrumb";
import { useParams, useRouter } from "next/navigation";
import { useEffect, useState, useMemo } from "react";
import dynamic from "next/dynamic"

const ReactQuill = dynamic(() => import("react-quill-new"), {
    ssr: false
})
export default function EditProjectPage() {

    const router = useRouter()
    const params = useParams()
    const { id } = params

    const [project, setProject] = useState(null)
    const [loading, setLoading] = useState(true)
    const [holidays, setHolidays] = useState([])
    const [form, setForm] = useState({
        project_name: "",
        description: "",
        status: "Planning",
        priority: "Medium",
        start_date: "",
        due_date: "",
        work_day: ""
    })

    const quillModules = {
        toolbar: [
            [{ header: [1, 2, 3, false] }],
            ["bold", "italic", "underline"],
            [{ size: ["small", false, "large", "huge"] }],
            [{ list: "ordered" }, { list: "bullet" }],
            ["clean"]
        ]
    }
    

    useEffect(() => {
        async function loadDataProject() {

            const res = await fetch(`/api/v1/project/${id}`, {
                credentials: "include"
            })

            const data = await res.json()
            const p = data.RequestProject[0]

            setProject(p)

            setForm({
                id: p.id,
                owner_id: p.owner_id,
                project_name: p.project_name,
                description: p.description,
                status: p.status,
                priority: p.priority,
                start_date: p.start_date?.split("T")[0],
                due_date: p.due_date?.split("T")[0],
                work_day: p.work_day
            })

            setLoading(false)
        }

        async function loadHoliday() {

            const res = await fetch(
                `https://api.iapp.co.th/v3/store/data/thai-holiday`,
                {
                    method: "GET",
                    headers: {
                        apikey: process.env.NEXT_PUBLIC_APIKEY_HOLIDAY
                    }
                }
            )

            const result = await res.json()

            setHolidays(result.holidays.map(h => h.date))
        }

        loadDataProject()
        loadHoliday()
    }, [id])

    const handleChange = (e) => {
        setForm({
            ...form,
            [e.target.name]: e.target.value
        })
    }

    const workingDays = useMemo(() => {

        if (!form.start_date || !form.due_date) return ""

        let start = new Date(form.start_date)
        let end = new Date(form.due_date)

        let count = 0

        while (start <= end) {

            const day = start.getDay()
            const dateStr = start.toISOString().split("T")[0]

            const isWeekend = day === 0 || day === 6
            const isHoliday = holidays.includes(dateStr)

            if (!isWeekend && !isHoliday) {
                count++
            }

            start.setDate(start.getDate() + 1)
        }

        return count

    }, [form.start_date, form.due_date, holidays])

    async function handleSubmit(e) {
        e.preventDefault()
        const payload = {
            ...form,
            work_day: workingDays
        }

        const res = await fetch(`/api/v1/project/update`, {
            method: "POST",
            headers: {
                "Content-Type": "application/json"
            },
            credentials: "include",
            body: JSON.stringify(payload)
        })

        if (res.ok) {
            router.push(`/dashboard/projects/${id}`)
        }
    }
    console.log(form)

    if (loading) {
        return <div className="p-6">กำลังโหลด...</div>
    }

    return (
        <div className="max-w-2xl p-3 max-md:p-1.5">

            <Breadcrumb
                items={[
                    { label: "แดชบอร์ด", href: "/dashboard" },
                    { label: "โปรเจ็ตทั้งหมด", href: "/dashboard/projects" },
                    { label: project?.project_name, href: `/dashboard/projects/${project?.id}` },
                    { label: "แก้ไขโปรเจ็ค" }
                ]}
            />

            <h1 className="text-2xl font-bold mb-6">
                แก้ไขโปรเจ็ค {project?.project_name}
            </h1>

            <form
                onSubmit={handleSubmit}
                className="space-y-4 bg-white dark:bg-gray-800 p-6 rounded-xl shadow"
            >

                {/* Project Name */}

                <div>
                    <label className="text-sm text-gray-500">
                        ชื่อโปรเจ็ค
                    </label>

                    <input
                        type="text"
                        name="project_name"
                        value={form.project_name}
                        onChange={handleChange}
                        className="w-full mt-1 border rounded-lg px-3 py-2 dark:bg-gray-700"
                        required
                    />
                </div>


                {/* Description */}

                <div>
                    <label className="block mb-1 text-sm font-medium">
                        รายละเอียดโปรเจ็ค
                    </label>

                    <div className="rounded-lg ">
                        <ReactQuill
                            theme="snow"
                            value={form.description}
                            onChange={(value) =>
                                setForm({
                                    ...form,
                                    description: value
                                })
                            }
                            modules={quillModules}
                            className="bg-white dark:bg-gray-700"
                        />
                    </div>
                </div>


                {/* Grid Info */}


                <div>
                    <label className="block mb-1 text-sm font-medium">
                        สถานะ
                    </label>
                    <select
                        className="w-full border rounded-lg px-3 py-2 dark:bg-gray-700"
                        name="status"
                        value={form.status}
                        onChange={handleChange}
                    >
                        <option value="Planning">Planning</option>
                        <option value="Active">Active</option>
                        <option value="On_hold">On hold</option>
                        <option value="Completed">Completed</option>
                        <option value="Cancelled">Cancelled</option>
                    </select>
                </div>

                <div>
                    <label className="block mb-1 text-sm font-medium">
                        ความสำคัญ
                    </label>

                    <select
                        name="priority"
                        value={form.priority}
                        onChange={handleChange}
                        className="w-full mt-1 border rounded-lg px-3 py-2 dark:bg-gray-700"
                    >
                        <option value="Low">Low</option>
                        <option value="Medium">Medium</option>
                        <option value="High">High</option>
                        <option value="Urgent">Urgent</option>
                    </select>
                </div>

                <div className="flex flex-row justify-between w-full gap-1.5 max-lg:flex-col">

                    {/* Start Date */}
                    <div>
                        <label className="block mb-1 text-sm font-medium">
                            วันเริ่มโปรเจ็ค
                        </label>

                        <input
                            type="date"
                            className="border rounded-lg px-3 py-2 dark:bg-gray-700 w-full"
                            name="start_date"
                            value={form.start_date}
                            onChange={handleChange}
                            required
                        />
                    </div>

                    {/* Due Date */}
                    <div>
                        <label className="block mb-1 text-sm font-medium">
                            กำหนดส่ง
                        </label>

                        <input
                            type="date"
                            className=" border rounded-lg px-3 py-2 dark:bg-gray-700 w-full"
                            name="due_date"
                            value={form.due_date}
                            onChange={handleChange}
                            min={form.start_date}
                            required

                        />
                    </div>

                    {/* Conut Date (due_date - start_date) */}
                    <div>
                        <label className="block mb-1 text-sm font-medium">
                            จำนวนวันทั้งหมด
                        </label>

                        <input
                            type="text"
                            name="work_day"
                            className="border rounded-lg px-3 py-2 dark:bg-gray-700 w-full"
                            value={workingDays ? `${workingDays} วัน` : ""}
                            disabled
                        />
                    </div>
                </div>



                {/* Buttons */}

                <div className="flex justify-end gap-3 pt-4">

                    <button
                        type="button"
                        onClick={() => router.back()}
                        className="px-4 py-2 rounded-lg border"
                    >
                        ยกเลิก
                    </button>

                    <button
                        type="submit"
                        className="px-4 py-2 rounded-lg bg-blue-500 text-white hover:bg-blue-600 cursor-pointer"
                    >
                        บันทึก
                    </button>

                </div>

            </form>

        </div>
    )
}