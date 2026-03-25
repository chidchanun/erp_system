'use client'

import { useState, useEffect } from "react"
import Link from "next/link"
import { useUser } from "@/app/context/UserContext"
import Breadcrumb from "@/app/components/Breadcrumb"

export default function MyProjectPage() {

    const [projects, setProjects] = useState([])
    const [loading, setLoading] = useState(true)
    const user = useUser()

    useEffect(() => {

        async function loadProjects() {

            try {

                const res = await fetch(`/api/v1/project_member/user/${user.userId}`, {
                    credentials: "include"
                })

                const data = await res.json()
                setProjects(data.RequestMyProject || [])

            } catch (err) {
                console.error(err)
            } finally {
                setLoading(false)
            }

        }

        loadProjects()

    }, [user.userId])

    

    const roleStyle = {
        owner: "bg-blue-100 text-blue-700 dark:bg-blue-900 dark:text-blue-300",
        "co owner": "bg-purple-100 text-purple-700 dark:bg-purple-900 dark:text-purple-300",
        member: "bg-gray-100 text-gray-600 dark:bg-gray-700 dark:text-gray-300"
    }

    const roleLabel = {
        owner: "Owner",
        "co owner": "Co-Owner",
        member: "Member"
    }

    if (loading) {
        return <div className="p-6">กำลังโหลดโปรเจ็ค...</div>
    }

    return (

        <div className="max-w-6xl p-4 w-full">
            <Breadcrumb
                items={[
                    { label: "แดชบอร์ด", href: "/dashboard" },
                    { label: "โปรเจ็คทั้งหมด" }
                ]}
            />
            <h1 className="text-2xl font-bold mb-6">
                โปรเจ็คของฉัน
            </h1>

            {projects.length === 0 && (
                <div className="text-gray-500">
                    ยังไม่มีโปรเจ็ค
                </div>
            )}

            {/* TABLE (Desktop) */}

            <div className="hidden md:block bg-white dark:bg-gray-800 rounded-xl shadow overflow-hidden">

                <table className="w-full text-sm">

                    <thead className="bg-gray-100 dark:bg-gray-700 text-left">

                        <tr>
                            <th className="p-3">โปรเจ็ค</th>
                            <th className="p-3">เจ้าของ</th>
                            <th className="p-3">ตำแหน่ง</th>
                            <th className="p-3 text-right">Action</th>
                        </tr>

                    </thead>

                    <tbody>

                        {projects.map((p) => (

                            <tr
                                key={p.project_id}
                                className="border-t dark:border-gray-700"
                            >

                                <td className="p-3 font-medium">
                                    {p.project_name}
                                </td>

                                <td className="p-3">
                                    {p.owner_first_name} {p.owner_last_name}
                                </td>

                                <td className="p-3">

                                    <span
                                        className={`text-xs px-2 py-1 rounded-full 
                                        ${roleStyle[p.role] || roleStyle.member}`}
                                    >
                                        {roleLabel[p.role] || "Member"}
                                    </span>

                                </td>

                                <td className="p-3 text-right">

                                    <Link
                                        href={`/dashboard/projects/${p.project_id}`}
                                        className="text-sm px-3 py-1.5 rounded bg-blue-500 text-white hover:bg-blue-600"
                                    >
                                        View
                                    </Link>

                                </td>

                            </tr>

                        ))}

                    </tbody>

                </table>

            </div>

            {/* CARD (Mobile) */}

            <div className="md:hidden flex flex-col gap-4">

                {projects.map((p) => (

                    <div
                        key={p.project_id}
                        className="bg-white dark:bg-gray-800 rounded-xl shadow p-4 border dark:border-gray-700"
                    >

                        <div className="flex justify-between items-start">

                            <h2 className="font-semibold text-lg">
                                {p.project_name}
                            </h2>

                            <span
                                className={`text-xs px-2 py-1 rounded-full 
                                ${roleStyle[p.role] || roleStyle.member}`}
                            >
                                {roleLabel[p.role] || "Member"}
                            </span>

                        </div>

                        <p className="text-sm text-gray-500 mt-1">
                            owner : {p.owner_first_name} {p.owner_last_name}
                        </p>

                        <div className="mt-3">

                            <Link
                                href={`/dashboard/projects/${p.project_id}`}
                                className="text-sm px-3 py-1.5 rounded bg-blue-500 text-white hover:bg-blue-600 inline-block"
                            >
                                View
                            </Link>

                        </div>

                    </div>

                ))}

            </div>

        </div>

    )
}