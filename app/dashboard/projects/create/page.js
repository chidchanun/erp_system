'use client'

import Image from "next/image"
import { useState, useEffect, useMemo } from "react"
import { useUser } from "@/app/context/UserContext"
import { FolderPlus, User, X } from "lucide-react"
import dynamic from "next/dynamic"

const ReactQuill = dynamic(() => import("react-quill-new"), {
    ssr: false
})

export default function CreateProjectPage() {
    const [loading, setLoading] = useState(false)
    const [holidays, setHolidays] = useState([])
    const [showMemberModal, setShowMemberModal] = useState(false)
    const [search, setSearch] = useState("")

    const [members, setMembers] = useState([])
    const [selectedMembers, setSelectedMembers] = useState([])

    const [form, setForm] = useState({
        project_name: "",
        description: "",
        start_date: new Date().toISOString().split("T")[0],
        due_date: "",
        priority: "Medium",
        status: "Planning",
        work_day: 0,
        member: []
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

    const user = useUser()

    // Fetch holiday
    useEffect(() => {


        async function loadHoliday() {

            const res = await fetch(
                `https://api.iapp.co.th/v3/store/data/thai-holiday`, {
                method: "GET",
                headers: {
                    apikey: `${process.env.NEXT_PUBLIC_APIKEY_HOLIDAY}`
                },
            }
            )
            const result = await res.json()
            setHolidays(result.holidays.map(h => h.date))
        }

        loadHoliday()

    }, [])

    useEffect(() => {

        async function loadUsers() {

            try {

                const res = await fetch("/api/v1/user", {
                    method: "GET",
                    credentials: "include"
                })

                const data = await res.json()
                const formatted = data
                    .filter(u => u.id !== user?.userId) // เอาตัวเราออก
                    .map(u => ({
                        id: u.id,
                        name: `${u.first_name} ${u.last_name}`,
                        role: u.role_name,
                        position: u.subrole_name,
                        department: u.department_name,
                        picture_path: u.picture_path
                    }))

                setMembers(formatted)

            } catch (err) {
                console.error("Load user error:", err)
            }

        }

        loadUsers()

    }, [user])

    // Calculate working days
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


    const handleChange = (e) => {
        console.log(e.target.name)
        setForm({
            ...form,
            [e.target.name]: e.target.value
        })
    }

    const handleSubmit = async (e) => {
        e.preventDefault()

        const payload = {
            ...form,
            work_day: workingDays
        }
        const RequestCreateProject = await fetch("/api/v1/project/create", {
            method: "POST",
            credentials: "include",
            body: JSON.stringify(payload)
        })
        const data = await RequestCreateProject.json()
        console.log(data)
    }

    const filteredMembers = useMemo(() => {

        return members
            .filter(user =>
                user.name.toLowerCase().includes(search.toLowerCase()) ||
                user.id.toLowerCase().includes(search.toLowerCase()) ||
                user.role.toLowerCase().includes(search.toLowerCase()) ||
                user.position.toLowerCase().includes(search.toLowerCase())
            )
            .filter(user =>
                !selectedMembers.some(m => m.id === user.id)
            )

    }, [members, search, selectedMembers])

    const addMember = (user) => {

        const exist = selectedMembers.find(m => m.id === user.id)

        if (!exist) {
            setSelectedMembers([...selectedMembers, user])
            setForm({
                ...form,
                member: [...selectedMembers, user]
            })
        }
    }

    const removeMember = (id) => {
        setSelectedMembers(selectedMembers.filter(m => m.id !== id))
        setForm({
            ...form,
            member: selectedMembers.filter(m => m.id !== id)
        })
    }

    return (
        <div className="max-w-2xl mx-auto p-6 max-md:p-3">
            <h1 className="text-2xl font-bold mb-6">
                สร้างโปรเจ็คใหม่
            </h1>
            <form
                onSubmit={handleSubmit}
                className="space-y-4 bg-white dark:bg-gray-800 p-6 rounded-xl shadow"
            >

                {/* Title */}
                <div>
                    <label className="block mb-1 text-sm font-medium">
                        ชื่อโปรเจ็ค
                    </label>
                    <input
                        type="text"
                        className="w-full border rounded-lg px-3 py-2 dark:bg-gray-700"
                        name="project_name"
                        value={form.project_name}
                        onChange={handleChange}
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

                {/* Priority */}
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

                {/* Status */}
                <div>
                    <label className="block mb-1 text-sm font-medium">
                        ความสำคัญ
                    </label>
                    <select
                        className="w-full border rounded-lg px-3 py-2 dark:bg-gray-700"
                        name="priority"
                        value={form.priority}
                        onChange={handleChange}
                    >
                        <option value="Low">Low</option>
                        <option value="Medium">Medium</option>
                        <option value="High">High</option>
                        <option value="Urgent">Urgent</option>
                    </select>
                </div>

                {/* Date Container */}

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



                <div className="flex flex-col gap-2">

                    <label className="block text-sm font-medium">
                        สมาชิกทีม
                    </label>

                    <button
                        type="button"
                        onClick={() => setShowMemberModal(true)}
                        className="px-3 py-2 text-sm rounded-lg 
                            bg-gray-100 dark:bg-gray-700 
                            hover:bg-gray-200 dark:hover:bg-gray-600
                            flex items-center gap-2 cursor-pointer "
                    >
                        <FolderPlus size={16} />
                        เพิ่มสมาชิก
                    </button>

                    <div className="flex flex-wrap gap-2">

                        {selectedMembers.map(member => (

                            <div
                                key={member.id}
                                className="flex items-center gap-3 px-3 py-2 rounded-lg bg-gray-200 dark:bg-gray-700"
                            >
                                {/* Profile */}
                                {member?.picture_path ? (
                                    <Image
                                        src={member.picture_path}
                                        width={32}
                                        height={32}
                                        alt="Profile"
                                        className="rounded-full"
                                    />
                                ) : (
                                    <div className="w-8 h-8 flex items-center justify-center 
                                        rounded-full border border-gray-300 
                                        dark:border-gray-700 bg-gray-100 dark:bg-gray-800">
                                        <User className="w-4 h-4 text-gray-600 dark:text-gray-300" />
                                    </div>
                                )}

                                {/* Name + Position */}
                                <div className="flex flex-col leading-tight">
                                    <span className="text-sm font-medium">
                                        {member.name}
                                    </span>
                                    <span className="text-xs text-gray-500">
                                        {member.position}
                                    </span>
                                </div>

                                {/* Remove */}
                                <button
                                    type="button"
                                    onClick={() => removeMember(member.id)}
                                    className="ml-2 hover:text-red-500 cursor-pointer"
                                >
                                    <X size={14} />
                                </button>

                            </div>

                        ))}

                    </div>

                </div>

                <button
                    type="submit"
                    disabled={loading}
                    className="w-full bg-blue-600 hover:bg-blue-700 text-white py-2 rounded-lg transition cursor-pointer"
                >
                    {loading ? "กำลังบันทึก..." : "สร้างงาน"}
                </button>

            </form>

            {/* Add Member */}

            {showMemberModal && (

                <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50">

                    <div className="bg-white dark:bg-gray-800 w-125 max-md:w-[95%] p-5 rounded-xl shadow-lg">

                        <div className="flex justify-between mb-4">

                            <h2 className="font-semibold text-lg">
                                เลือกสมาชิกทีม
                            </h2>

                            <button
                                onClick={() => setShowMemberModal(false)}
                                className="text-sm text-gray-300 cursor-pointer hover:underline"
                            >
                                ปิด
                            </button>

                        </div>

                        {/* Search */}
                        <input
                            type="text"
                            placeholder="ค้นหา ชื่อ / รหัส / ตำแหน่ง / บทบาท"
                            className="w-full border rounded-lg px-3 py-2 mb-3 dark:bg-gray-700"
                            value={search}
                            onChange={(e) => setSearch(e.target.value)}
                        />

                        {/* Member List */}
                        <div className="max-h-75 overflow-y-auto space-y-2 gap-1.5">

                            {filteredMembers.map(user => (

                                <div
                                    key={user.id}
                                    className="flex justify-between items-center 
                                        p-2 rounded-lg border hover:bg-gray-100 dark:hover:bg-gray-700 gap-1.5"
                                >

                                    <div className="flex flex-row gap-1.5">
                                        {user?.picture_path ? (
                                            <Image
                                                src={user.picture_path}
                                                width={32}
                                                height={32}
                                                alt="Profile"
                                                className="rounded-full"
                                            />
                                        ) : (
                                            <div className="w-10 h-10 flex items-center justify-center 
                                                                    rounded-full border border-gray-300 
                                                                    dark:border-gray-700 
                                                                    bg-gray-100 dark:bg-gray-800">
                                                <User className="w-4 h-4 text-gray-600 dark:text-gray-300" />
                                            </div>
                                        )}

                                        <div>
                                            <div className="font-medium">
                                                {user.name}
                                            </div>

                                            <div className="text-xs text-gray-500">
                                                {user.position} • {user.department}
                                            </div>
                                        </div>
                                    </div>


                                    <button
                                        onClick={() => addMember(user)}
                                        className="text-sm px-2 py-1 rounded 
                                        bg-blue-500 text-white hover:bg-blue-600 cursor-pointer"
                                    >
                                        เพิ่ม
                                    </button>

                                </div>

                            ))}

                        </div>

                    </div>

                </div>

            )}
        </div>
    )
}