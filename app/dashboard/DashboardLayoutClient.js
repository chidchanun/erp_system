'use client'

import Sidebar from "@/app/components/SideBar"
import { useEffect, useState } from "react"
import Image from "next/image"
import { User } from "lucide-react"
import { UserContext } from "@/app/context/UserContext"

export default function DashboardLayoutClient({ children }) {

    const [user, setUser] = useState(null)
    const [loading, setLoading] = useState(true)

    useEffect(() => {

        const init = async () => {
            try {

                const res = await fetch("/api/v1/user/me", {
                    method: "POST",
                    credentials: "include"
                })

                if (!res.ok) {
                    window.location.href = "/login"
                    return
                }

                const data = await res.json()
                setUser(data)

            } catch {
                window.location.href = "/login"
            } finally {
                setLoading(false)
            }
        }

        init()

    }, [])

    if (loading) return null

    return (
        <UserContext.Provider value={user}>
            <div className="flex h-screen w-screen overflow-hidden 
            bg-gray-100 dark:bg-gray-900
            transition-colors duration-300">

                <Sidebar />

                <main className="flex-1 overflow-y-auto p-6
                text-gray-800 dark:text-gray-100
                transition-colors duration-300
                custom-scrollbar">

                    <div className="flex justify-end lg:text-xl items-center gap-2 mb-6">

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
                        <div className="flex flex-col ">
                            <div className="text-lg max-md:text-sm duration-300">
                                {user?.first_name} {user?.last_name}
                            </div>
                            <div className="text-sm text-gray-400 max-md:text-xs duration-300">
                                {user?.first_name_en} {user?.last_name_en}
                            </div>
                        </div>

                    </div>

                    {children}

                </main>
            </div>
        </UserContext.Provider>
    )
}