'use client';
import { useState, useEffect } from "react";


export default function HrRegisterPage() {

    const [department, setDepartment] = useState()

    useEffect(() => {
        const RequestDepartment = async () => {
            const res = await fetch('/api/v1/')
        }
    }, [])

    return (
        <div className="text-2xl font-semibold">
            ระบบเพิ่มพนักงาน
            <div className="space-y-4 bg-white dark:bg-gray-800 p-6 rounded-xl shadow">
                <div>
                    <label className="block mb-1 text-sm font-medium">
                        ชื่อโปรเจ็ค
                    </label>
                    <input
                        type="text"
                        className="w-full border rounded-lg px-3 py-2 dark:bg-gray-700"
                        required
                    />
                </div>
            </div>
        </div>
    )
}