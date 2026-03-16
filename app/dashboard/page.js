'use client'

import { useEffect, useState } from "react"
import { useUser } from "@/app/context/UserContext"
import TimeCard from "../components/TimeCard"
import EmployeeTask from "../components/EmployeeTask"

export default function DashboardPage() {

    const user = useUser()

    const [data, setData] = useState(null)
    const [loading, setLoading] = useState(true)

    useEffect(() => {

        if (!user?.userId) return

        const fetchAttendance = async () => {
            try {

                const res = await fetch(`/api/v1/attendance/${user.userId}`, {
                    credentials: "include"
                })

                if (!res.ok) return
                const result = await res.json()

                setData(result)

            } catch (err) {
                console.error(err)
            } finally {
                setLoading(false)
            }
        }

        fetchAttendance()

    }, [user])

    if (loading) {
        return <div className="p-6">กำลังโหลด...</div>
    }

    return (
        <div className="flex flex-col w-full min-h-screen 
                        bg-gray-100 dark:bg-gray-900 
                        transition-colors duration-300 
                        gap-6 p-4 md:p-6">

            <div>
                <h1 className="text-2xl md:text-3xl font-semibold">
                    โปรไฟล์บุคคล
                </h1>
            </div>

            <TimeCard
                leave={data?.leave}
                absent={data?.absent}
                late={data?.late}
                earlyLeave={data?.earlyLeave}
                present={data?.present}
            />
            <EmployeeTask/>
        </div>
    )
}