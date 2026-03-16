'use client'

import { Users, CheckCircle, XCircle, BarChart3 } from "lucide-react"

export default function SubjectCard({
    subjectName = "รายวิชา",
    totalStudents = 0,
    passedStudents = 0,
    failedStudents = 0
}) {

    const passPercent = totalStudents > 0
        ? ((passedStudents / totalStudents) * 100).toFixed(1)
        : 0

    const failPercent = totalStudents > 0
        ? ((failedStudents / totalStudents) * 100).toFixed(1)
        : 0

    return (
        <div className="bg-white dark:bg-zinc-900 
                        border border-zinc-200 dark:border-zinc-800 
                        rounded-2xl p-6 shadow-sm w-full max-w-md">

            {/* ชื่อรายวิชา */}
            <div className="flex items-center justify-between mb-6">
                <div>
                    <h2 className="text-lg font-semibold text-zinc-900 dark:text-white">
                        {subjectName}
                    </h2>
                    <p className="text-sm text-zinc-500 dark:text-zinc-400">
                        สรุปผลการเรียน
                    </p>
                </div>
                <BarChart3 className="w-5 h-5 text-zinc-500" />
            </div>

            {/* สถิติ */}
            <div className="space-y-4">

                <div className="flex justify-between items-center">
                    <div className="flex items-center gap-2 text-zinc-600 dark:text-zinc-400">
                        <Users className="w-4 h-4" />
                        <span>นักศึกษาทั้งหมด</span>
                    </div>
                    <span className="font-semibold text-zinc-900 dark:text-white">
                        {totalStudents}
                    </span>
                </div>

                <div className="flex justify-between items-center">
                    <div className="flex items-center gap-2 text-zinc-600 dark:text-zinc-400">
                        <CheckCircle className="w-4 h-4" />
                        <span>สอบผ่าน</span>
                    </div>
                    <span className="font-semibold text-zinc-900 dark:text-white">
                        {passedStudents}
                    </span>
                </div>

                <div className="flex justify-between items-center">
                    <div className="flex items-center gap-2 text-zinc-600 dark:text-zinc-400">
                        <XCircle className="w-4 h-4" />
                        <span>ติด 0</span>
                    </div>
                    <span className="font-semibold text-zinc-900 dark:text-white">
                        {failedStudents}
                    </span>
                </div>
            </div>

            {/* Divider */}
            <div className="my-6 border-t border-zinc-200 dark:border-zinc-800"></div>

            {/* เปอร์เซ็นต์ */}
            <div className="space-y-3">
                <p className="text-sm text-zinc-500 dark:text-zinc-400">
                    เปรียบเทียบเปอร์เซ็นต์
                </p>

                <div className="flex justify-between text-sm">
                    <span>ผ่าน</span>
                    <span className="font-medium">{passPercent}%</span>
                </div>

                <div className="flex justify-between text-sm">
                    <span>ไม่ผ่าน</span>
                    <span className="font-medium">{failPercent}%</span>
                </div>

                {/* Progress Bar */}
                <div className="w-full h-2 bg-zinc-200 dark:bg-zinc-800 rounded-full overflow-hidden">
                    <div
                        className="h-2 bg-zinc-700 dark:bg-zinc-300 transition-all duration-500"
                        style={{ width: `${passPercent}%` }}
                    />
                </div>
            </div>
        </div>
    )
}