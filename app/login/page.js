'use client'
import { useState } from "react"
import { Eye, EyeOff } from "lucide-react"
import { redirect } from 'next/navigation';


export default function LoginPage() {
    const [id, setId] = useState("")
    const [password, setPassword] = useState("")
    const [showPassword, setShowPassword] = useState(false)

    const handleSubmit = async () => {
        const reqLogin = await fetch(
            '/api/v1/auth/login',
            {
                method : "POST",
                headers: { "Content-Type": "application/json" },
                body : JSON.stringify({
                    id : id,
                    password : password
                })
            }
        )

        if (!reqLogin.ok) {
            return
        }

        redirect('/dashboard')

    }

    return (
        <div className="flex w-screen h-screen justify-center items-center 
                        bg-gray-100 dark:bg-gray-900 transition-colors duration-300 px-2">

            <div className="w-100 p-8 rounded-2xl shadow-2xl
                            bg-white dark:bg-gray-800
                            text-gray-800 dark:text-gray-100
                            transition-colors duration-300">

                <h1 className="text-2xl font-bold text-center mb-6">
                    เข้าสู่ระบบ
                </h1>

                <div className="flex flex-col gap-4">

                    {/* รหัสประจำตัว */}
                    <div>
                        <label className="text-sm font-medium">
                            รหัสประจำตัว
                        </label>
                        <input
                            type="text"
                            value={id}
                            onChange={(e) => setId(e.target.value)}
                            required
                            className="w-full mt-1 border rounded-lg px-3 py-2
                                       bg-white dark:bg-gray-700
                                       border-gray-300 dark:border-gray-600
                                       focus:outline-none focus:ring-2 focus:ring-blue-500"
                        />
                    </div>

                    {/* รหัสผ่าน */}
                    <div>
                        <label className="text-sm font-medium">
                            รหัสผ่าน
                        </label>

                        <div className="relative mt-1">
                            <input
                                type={showPassword ? "text" : "password"}
                                value={password}
                                onChange={(e) => setPassword(e.target.value)}
                                required
                                className="w-full border rounded-lg px-3 py-2 pr-10
                                           bg-white dark:bg-gray-700
                                           border-gray-300 dark:border-gray-600
                                           focus:outline-none focus:ring-2 focus:ring-blue-500"
                            />

                            <button
                                type="button"
                                onClick={() => setShowPassword(!showPassword)}
                                className="absolute right-3 top-1/2 -translate-y-1/2
                                           text-gray-500 dark:text-gray-300 cursor-pointer"
                            >
                                {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                            </button>
                        </div>
                    </div>

                    <button
                        type="button"
                        className="bg-blue-600 hover:bg-blue-700 
                                   text-white py-2 rounded-lg font-semibold transition cursor-pointer"
                        onClick={handleSubmit}
                    >
                        เข้าสู่ระบบ
                    </button>

                </div>
            </div>
        </div>
    )
}
