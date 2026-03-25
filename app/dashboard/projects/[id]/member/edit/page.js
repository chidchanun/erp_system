'use client';

import { useState, useEffect, useMemo } from "react";
import { useParams } from "next/navigation";
import Breadcrumb from "@/app/components/Breadcrumb";
import Image from "next/image";
import { Users } from "lucide-react";
import Link from "next/link";
import { useUser } from "@/app/context/UserContext";
import SuccessCard from "@/app/components/SuccessCard";

export default function EditMemberProjectPage() {

    const [memberProjects, setMemberProjects] = useState([])
    const params = useParams()
    const { id } = params
    const [showMemberModal, setShowMemberModal] = useState(false)
    const [members, setMembers] = useState([])
    const [search, setSearch] = useState("")
    const [showSuccess, setShowSuccess] = useState(false)

    const user = useUser()
    useEffect(() => {
        async function loadProject() {

            const res = await fetch(`/api/v1/project_member/${id}`, {
                credentials: "include"
            })

            const data = await res.json()

            setMemberProjects(data.RequestMemberProject)
        }

        loadProject()

    }, [id])

    useEffect(() => {
        async function loadUsers() {

            const res = await fetch("/api/v1/user", {
                credentials: "include"
            })

            const data = await res.json()
            const formatted = data
                .filter(u => u.id !== user?.userId) // เอาตัวเราออก
            setMembers(formatted || [])
        }

        loadUsers()

    }, [user?.userId])

    const filteredMembers = useMemo(() => {

        return members
            .filter(user =>
                user.first_name.toLowerCase().includes(search.toLowerCase()) ||
                user.last_name.toLowerCase().includes(search.toLowerCase()) ||
                user.id.toLowerCase().includes(search.toLowerCase()) ||
                user.role_name.toLowerCase().includes(search.toLowerCase()) ||
                user.subrole_name.toLowerCase().includes(search.toLowerCase())
            )
            .filter(user =>
                !memberProjects.some(m => m.id === user.id)
            )

    }, [members, search, memberProjects])

    function addMember(user) {

        const newMember = {
            user_id: user.id,
            first_name: user.first_name,
            last_name: user.last_name,
            first_name_en: user.first_name_en,
            last_name_en: user.last_name_en,
            picture_path: user.picture_path,
            role: "member"
        }

        setMemberProjects(prev => [...prev, newMember])
    }

    function handleRoleChange(userId, role) {

        setMemberProjects(prev =>
            prev.map(m =>
                m.user_id === userId
                    ? { ...m, role }
                    : m
            )
        )
    }

    function handleRemove(userId) {

        setMemberProjects(prev =>
            prev.filter(m => m.user_id !== userId)
        )
    }



    async function handleSave() {
        const res = await fetch(`/api/v1/project_member/member`, {
            method: "POST",
            headers: {
                "Content-Type": "application/json"
            },
            credentials: "include",
            body: JSON.stringify({
                project_id: id,
                memberProjects: memberProjects
            })
        })

        setShowSuccess(true)


    }

    const rolePriority = {
        owner: 1,
        "co owner": 2,
        member: 3
    }

    const sortedMembers = memberProjects
        ?.slice()
        .sort((a, b) => rolePriority[a.role] - rolePriority[b.role])


    return (

        <div className="max-w-6xl p-3 max-md:p-1.5 w-full">
            {showSuccess && (
                <SuccessCard
                    message="บันทึกสำเร็จ"
                    onClose={() => {
                        setShowSuccess(false)
                    }}
                />
            )}
            <Breadcrumb
                items={[
                    { label: "แดชบอร์ด", href: "/dashboard" },
                    { label: "โปรเจ็คทั้งหมด", href: "/dashboard/projects" },
                    { label: memberProjects?.[0]?.project_name, href: `/dashboard/projects/${memberProjects?.[0]?.project_id}` },
                    { label: "แก้ไขสมาชิกโปรเจ็ค" }
                ]}
            />

            <div className="flex justify-between items-center mb-4">

                <h1 className="text-2xl font-bold max-md:text-[20px]">
                    แก้ไขสมาชิกโปรเจ็ค {memberProjects?.[0]?.project_name}
                </h1>

                <button
                    onClick={() => setShowMemberModal(true)}
                    className="bg-green-500 text-white px-3 py-2 rounded-lg hover:bg-green-600 cursor-pointer"
                >
                    + เพิ่มสมาชิก
                </button>

            </div>



            {/* TABLE DESKTOP */}

            <div className="hidden md:block bg-white dark:bg-gray-800 rounded-xl shadow overflow-hidden">

                <table className="w-full">

                    <thead className="bg-gray-100 dark:bg-gray-700 text-left">

                        <tr>

                            <th className="p-3">สมาชิก</th>
                            <th className="p-3">Role</th>
                            <th className="p-3">Action</th>

                        </tr>

                    </thead>

                    <tbody>

                        {sortedMembers.map(m => (

                            <tr key={m.user_id} className="border-t">

                                {/* USER */}

                                <td className="p-3">

                                    <div className="flex items-center gap-3">

                                        <div className="w-10 h-10 rounded-full bg-gray-200 flex items-center justify-center overflow-hidden">

                                            {m.picture_path ? (

                                                <Image
                                                    src={m.picture_path}
                                                    alt=""
                                                    width={40}
                                                    height={40}
                                                />

                                            ) : (

                                                <Users className="w-5 h-5 text-gray-500" />

                                            )}

                                        </div>

                                        <div>

                                            <div className="font-medium">
                                                {m.first_name} {m.last_name}
                                            </div>

                                            <div className="text-xs text-gray-500">
                                                {m.first_name_en} {m.last_name_en}
                                            </div>

                                        </div>

                                    </div>

                                </td>



                                {/* ROLE */}

                                <td className="p-3">

                                    {m.role === "owner" ? (

                                        <span className="text-blue-600 font-medium">
                                            Owner
                                        </span>

                                    ) : (

                                        <select
                                            value={m.role}
                                            onChange={(e) =>
                                                handleRoleChange(m.user_id, e.target.value)
                                            }
                                            className="border rounded px-2 py-1 dark:bg-gray-700"
                                        >

                                            <option value="co owner">
                                                Co Owner
                                            </option>

                                            <option value="member">
                                                Member
                                            </option>

                                        </select>

                                    )}

                                </td>



                                {/* ACTION */}

                                <td className="p-3">

                                    {m.role !== "owner" && (

                                        <button
                                            onClick={() => handleRemove(m.user_id)}
                                            className="text-red-500 text-sm"
                                        >
                                            ลบ
                                        </button>

                                    )}

                                </td>

                            </tr>

                        ))}

                    </tbody>

                </table>

            </div>



            {/* MOBILE CARD */}

            <div className="md:hidden space-y-3">

                {sortedMembers.map(m => (

                    <div
                        key={m.user_id}
                        className="bg-white dark:bg-gray-800 p-4 rounded-xl shadow"
                    >

                        <div className="flex items-center gap-3 mb-3">

                            <div className="w-10 h-10 rounded-full bg-gray-200 flex items-center justify-center">

                                <Users className="w-5 h-5 text-gray-500" />

                            </div>

                            <div>

                                <div className="font-medium">
                                    {m.first_name} {m.last_name}
                                </div>

                                <div className="text-xs text-gray-500">
                                    {m.first_name_en} {m.last_name_en}
                                </div>

                            </div>

                        </div>



                        {m.role === "owner" ? (

                            <div className="text-blue-600 font-medium">
                                Owner
                            </div>

                        ) : (

                            <select
                                value={m.role}
                                onChange={(e) =>
                                    handleRoleChange(m.user_id, e.target.value)
                                }
                                className="border rounded px-2 py-1 w-full dark:bg-gray-700"
                            >

                                <option value="co owner">
                                    Co Owner
                                </option>

                                <option value="member">
                                    Member
                                </option>

                            </select>

                        )}

                        {m.role !== "owner" && (

                            <button
                                onClick={() => handleRemove(m.user_id)}
                                className="text-red-500 text-sm mt-2"
                            >
                                ลบสมาชิก
                            </button>

                        )}

                    </div>

                ))}

            </div>



            {/* SAVE BUTTON */}

            <div className="flex justify-end mt-6 gap-2">
                <Link
                    href={`/dashboard/projects/${memberProjects?.[0]?.project_id}`}
                    className="bg-gray-500 text-white px-5 py-2 rounded-lg hover:bg-gray-600 cursor-pointer"
                >
                    กลับ
                </Link>

                <button
                    onClick={handleSave}
                    className="bg-blue-500 text-white px-5 py-2 rounded-lg hover:bg-blue-600 cursor-pointer"
                >
                    บันทึก
                </button>
            </div>
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
                                                <Users className="w-4 h-4 text-gray-600 dark:text-gray-300" />
                                            </div>
                                        )}

                                        <div>
                                            <div className="font-medium">
                                                {user.first_name} {user.last_name}
                                            </div>

                                            <div className="text-xs text-gray-500">
                                                {user.role_name} • {user.subrole_name}
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