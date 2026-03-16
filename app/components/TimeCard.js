'use client'

import { CalendarCheck, UserX, Clock, LogOut, Briefcase } from "lucide-react"

export default function TimeCard({
    present = 0,
    leave = 0,
    absent = 0,
    late = 0,
    earlyLeave = 0
}) {

    const items = [
        {
            key: "present",
            title: "วันมาทำงาน",
            value: present ?? 0,
            icon: Briefcase
        },
        {
            key: "leave",
            title: "วันลา",
            value: leave ?? 0,
            icon: CalendarCheck
        },
        {
            key: "absent",
            title: "วันที่ขาด",
            value: absent ?? 0,
            icon: UserX
        },
        {
            key: "late",
            title: "เข้างานสาย",
            value: late ?? 0,
            icon: Clock
        },
        {
            key: "earlyLeave",
            title: "ออกก่อนเวลา",
            value: earlyLeave ?? 0,
            icon: LogOut
        }
    ]

    return (
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-4">
            {items.map((item) => {
                const Icon = item.icon

                return (
                    <div
                        key={item.key}
                        className="bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 rounded-2xl p-6 shadow-sm hover:shadow-md transition"
                    >
                        <div className="flex items-center justify-between">
                            <p className=" text-zinc-500 dark:text-zinc-400 xl:text-sm lg:text-xs">
                                {item.title}
                            </p>

                            <Icon className="w-5 h-5 text-zinc-400" />
                        </div>

                        <p className=" font-semibold mt-4 text-zinc-900 dark:text-white xl:text-3xl lg:text-2xl md:text-xl">
                            {item.value}
                        </p>
                    </div>
                )
            })}
        </div>
    )
}