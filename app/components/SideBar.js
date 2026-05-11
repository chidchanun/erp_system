'use client'

import Link from "next/link"
import { usePathname, useRouter } from "next/navigation"
import { useUser } from "../context/UserContext"
import { useState, useEffect } from "react"
import {
    LayoutDashboard,
    Users,
    LogOut,
    ChevronDown,
    Menu,
    X,
    ListTodo,
    Folder
} from "lucide-react"
import { useParams } from "next/navigation"



export default function SideBar() {
    const params = useParams()
    const projectId = params?.id
    const pathname = usePathname()
    const router = useRouter()
    const user = useUser()

    const [collapsed, setCollapsed] = useState(false)
    const [manualOpen, setManualOpen] = useState(false)
    const [mobileOpen, setMobileOpen] = useState(false)
    const [manualProjectOpen, setManualProjectOpen] = useState(false)
    const [manualTaskOpen, setManualTaskOpen] = useState(false)
    const [manualHROpen, setManualHROpen] = useState(false)
    const [myProject, setMyProject] = useState([])

    const autoHROpen = pathname.startsWith(`/dashboard/hr`)
    const openHRMenu = autoHROpen || manualHROpen

    const autoProjectOpen = pathname.startsWith(`/dashboard/projects`)
    const openProjectMenu = autoProjectOpen || manualProjectOpen

    const autoTaskOpen = pathname.startsWith("/dashboard/tasks")
    const openTaskMenu = autoTaskOpen || manualTaskOpen

    const autoOpen = pathname.startsWith("/dashboard/users")
    const openUserMenu = autoOpen || manualOpen

    const isActive = (path) => pathname === path

    const handleLogout = async () => {
        const reqLogout = await fetch("/api/v1/auth/logout", {
            method: "POST",
            credentials: "include"
        })

        if (reqLogout.ok) {
            router.push("/login")
        }
    }



    useEffect(() => {
        const RequestMyProject = async () => {
            const fetchData = await fetch(`/api/v1/project_member/user/${user.userId}`, {
                method: "GET",
                credentials: "include"
            })

            if (!fetchData.ok) {
                return
            }

            const data = await fetchData.json()
            setMyProject(data.RequestMyProject)
        }
        RequestMyProject()
    }, [user.userId])

    return (
        <div>
            {/* Mobile Menu Button */}
            <button
                onClick={() => setMobileOpen(true)}
                className="md:hidden fixed top-4 left-4 z-50 p-2 bg-white dark:bg-gray-800 rounded-lg shadow"
                aria-label="Menu SideBar"
                id="Menu Sidebar"
            >
                <Menu size={20} />
            </button>

            {/* Overlay */}
            {mobileOpen && (
                <div
                    onClick={() => setMobileOpen(false)}
                    className="fixed inset-0 bg-black/40 z-40 md:hidden"
                />
            )}

            <aside
                className={`
                ${collapsed ? "w-20 items-center" : "xl:w-72 max-lg:w-60"}
                fixed md:sticky
                top-0 left-0
                h-screen
                z-50
                transform
                ${mobileOpen ? "translate-x-0" : "-translate-x-full"}
                md:translate-x-0
                bg-white dark:bg-gray-800
                border-r border-gray-200 dark:border-gray-700
                text-gray-800 dark:text-gray-100
                transition-all duration-300
                flex flex-col
                px-2
            `}
            >

                {/* Header */}
                <div className="flex items-center justify-between p-4 border-b border-gray-200 dark:border-gray-700">

                    {!collapsed && (
                        <div className="text-xl font-bold">
                            My System
                        </div>
                    )}

                    <div className="flex gap-2">

                        {/* Collapse Desktop */}
                        <button
                            onClick={() => setCollapsed(!collapsed)}
                            className="hidden md:block p-2 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700 cursor-pointer"
                        >
                            <Menu size={20} />
                        </button>

                        {/* Close Mobile */}
                        <button
                            onClick={() => setMobileOpen(false)}
                            className="md:hidden p-2 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700 cursor-pointer"
                        >
                            <X size={20} />
                        </button>

                    </div>

                </div>

                <nav className="flex-1 lg:p-4 space-y-2 md:p-2 sm:p-1 max-md:space-y-3">

                    {/* Dashboard */}
                    <Link
                        href="/dashboard"
                        className={`
                            flex items-center max-md:mx-1 max-md:my-0.5 gap-3 px-3 py-2 rounded-lg transition
                            ${isActive("/dashboard")
                                ? "bg-blue-600 text-white"
                                : "hover:bg-gray-100 dark:hover:bg-gray-700"}
                        `}
                        onClick={() => setMobileOpen(false)}
                    >
                        <LayoutDashboard size={18} />
                        {!collapsed && "แดชบอร์ด"}
                    </Link>




                    {/* Projects */}
                    {!collapsed && <div className="flex pl-4 my-3 items-center text-[12px] text-[#969696]">
                        ระบบโปรเจ็กและงาน
                    </div>}

                    <div>
                        <button
                            onClick={() => setManualProjectOpen(!manualProjectOpen)}
                            className="flex items-center justify-between w-full max-md:mx-1 max-md:my-0.5 px-3 py-2 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700 cursor-pointer"
                        >
                            <div className="flex items-center gap-3">
                                <Folder size={18} />
                                {!collapsed && "โปรเจ็ค"}
                            </div>

                            {!collapsed && (
                                <ChevronDown
                                    size={16}
                                    className={`transition-transform ${openProjectMenu ? "rotate-180" : ""}`}
                                />
                            )}
                        </button>

                        {/* Project Menu UI */}
                        {!collapsed && openProjectMenu && (
                            <div className="flex flex-col gap-1.5 ml-8 mt-2 space-y-1 max-md:ml-4">


                                {
                                    user.role_name == "Super Admin" && (
                                        <Link
                                            href="/dashboard/projects/create"
                                            className={`
                                                block px-3 py-2 rounded-lg text-sm transition mx-2
                                                ${isActive("/dashboard/projects/create")
                                                    ? "bg-blue-500 text-white"
                                                    : "hover:bg-gray-100 dark:hover:bg-gray-700"}
                                            `}
                                            onClick={() => setMobileOpen(false)}
                                        >
                                            สร้างโปรเจ็ค
                                        </Link>
                                    )
                                }

                                <Link
                                    href="/dashboard/projects"
                                    className={`
                                                block px-3 py-2 rounded-lg text-sm transition mx-2
                                                ${isActive("/dashboard/projects")
                                            ? "bg-blue-500 text-white"
                                            : "hover:bg-gray-100 dark:hover:bg-gray-700"}
                                            `}
                                    onClick={() => setMobileOpen(false)}
                                >
                                    โปรเจ็คทั้งหมด
                                </Link>


                                {myProject.length > 0 &&
                                    myProject.map((project, index) => (
                                        <Link
                                            key={index}
                                            href={`/dashboard/projects/${project.project_id}`}
                                            className={`
                                                    block px-3 py-2 rounded-lg text-sm transition mx-2
                                                    ${String(project.project_id) === String(projectId)
                                                    ? "bg-blue-500 text-white"
                                                    : "hover:bg-gray-100 dark:hover:bg-gray-700"}
                                            `}
                                        >
                                            {project.project_name}
                                        </Link>
                                    ))
                                }

                            </div>
                        )}
                    </div>

                    {/* Tasks */}
                    <div>
                        <button
                            onClick={() => setManualTaskOpen(!manualTaskOpen)}
                            className="flex items-center justify-between w-full max-md:mx-1 max-md:my-0.5 px-3 py-2 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700 cursor-pointer"
                        >
                            <div className="flex items-center gap-3">
                                <ListTodo size={18} />
                                {!collapsed && "งาน"}
                            </div>

                            {!collapsed && (
                                <ChevronDown
                                    size={16}
                                    className={`transition-transform ${openTaskMenu ? "rotate-180" : ""}`}
                                />
                            )}
                        </button>

                        {!collapsed && openTaskMenu && (
                            <div className="flex flex-col gap-1.5 ml-8 mt-2 space-y-1 max-md:ml-4">

                                <Link
                                    href="/dashboard/tasks"
                                    className={`
                                        block px-3 py-2 rounded-lg text-sm transition mx-2
                                        ${isActive("/dashboard/tasks")
                                            ? "bg-blue-500 text-white"
                                            : "hover:bg-gray-100 dark:hover:bg-gray-700"}
                                    `}
                                    onClick={() => setMobileOpen(false)}
                                >
                                    รายการงาน
                                </Link>

                                <Link
                                    href="/dashboard/tasks/create"
                                    className={`
                                        block px-3 py-2 rounded-lg text-sm transition mx-2
                                        ${isActive("/dashboard/tasks/create")
                                            ? "bg-blue-500 text-white"
                                            : "hover:bg-gray-100 dark:hover:bg-gray-700"}
                                    `}
                                    onClick={() => setMobileOpen(false)}
                                >
                                    สร้างงานใหม่
                                </Link>

                                <Link
                                    href="/dashboard/tasks/my-task"
                                    className={`
                                        block px-3 py-2 rounded-lg text-sm transition mx-2
                                        ${isActive("/dashboard/tasks/my-task")
                                            ? "bg-blue-500 text-white"
                                            : "hover:bg-gray-100 dark:hover:bg-gray-700"}
                                    `}
                                    onClick={() => setMobileOpen(false)}
                                >
                                    งานของฉัน
                                </Link>

                            </div>
                        )}
                    </div>


                    {/* HR */}
                    {!collapsed && <div className="flex pl-4 my-3 items-center text-[12px] text-[#969696]">
                        ระบบงานฝ่ายทรัพยากรบุคคล HR
                    </div>}

                    <div>

                        <button
                            onClick={() => setManualHROpen(!manualHROpen)}
                            className="flex items-center justify-between w-full max-md:m-1.5 px-3 py-2 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700 cursor-pointer"
                        >
                            <div className="flex items-center gap-3">
                                <Users size={18} />
                                {!collapsed && "ฝ่ายทรัพยากรบุคคล"}
                            </div>

                            {!collapsed && (
                                <ChevronDown
                                    size={16}
                                    className={`transition-transform ${manualHROpen ? "rotate-180" : ""}`}
                                />
                            )}
                        </button>

                        {!collapsed && manualHROpen && (
                            <div className="ml-8 mt-2 space-y-1 max-md:ml-4">

                                <Link
                                    href="/dashboard/hr"
                                    className={`
                                        block px-3 py-2 rounded-lg text-sm transition max-md:mx-1 max-md:my-0.5
                                        ${isActive("/dashboard/hr")
                                            ? "bg-blue-500 text-white"
                                            : "hover:bg-gray-100 dark:hover:bg-gray-700"}
                                    `}
                                    onClick={() => setMobileOpen(false)}
                                >
                                    ระบบฝ่ายทรัพยากรบุคคล
                                </Link>
                                <Link
                                    href="/dashboard/hr/register"
                                    className={`
                                        block px-3 py-2 rounded-lg text-sm transition max-md:mx-1 max-md:my-0.5
                                        ${isActive("/dashboard/hr/register")
                                            ? "bg-blue-500 text-white"
                                            : "hover:bg-gray-100 dark:hover:bg-gray-700"}
                                    `}
                                    onClick={() => setMobileOpen(false)}
                                >
                                    ระบบเพิ่มพนักงาน
                                </Link>

                            </div>
                        )}

                    </div>

                    {/* Users */}
                    <div>

                        <button
                            onClick={() => setManualOpen(!manualOpen)}
                            className="flex items-center justify-between w-full max-md:m-1.5 px-3 py-2 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700 cursor-pointer"
                        >
                            <div className="flex items-center gap-3">
                                <Users size={18} />
                                {!collapsed && "ข้อมูลส่วนตัว"}
                            </div>

                            {!collapsed && (
                                <ChevronDown
                                    size={16}
                                    className={`transition-transform ${openUserMenu ? "rotate-180" : ""}`}
                                />
                            )}
                        </button>

                        {!collapsed && openUserMenu && (
                            <div className="ml-8 mt-2 space-y-1 max-md:ml-4">

                                <Link
                                    href="/dashboard/users/profile"
                                    className={`
                                        block px-3 py-2 rounded-lg text-sm transition max-md:mx-1 max-md:my-0.5
                                        ${isActive("/dashboard/users/profile")
                                            ? "bg-blue-500 text-white"
                                            : "hover:bg-gray-100 dark:hover:bg-gray-700"}
                                    `}
                                    onClick={() => setMobileOpen(false)}
                                >
                                    ประวัติส่วนตัว
                                </Link>

                                <Link
                                    href="/dashboard/users/edit"
                                    className={`
                                        block px-3 py-2 rounded-lg text-sm transition max-md:mx-1 max-md:my-0.5
                                        ${isActive("/dashboard/users/edit")
                                            ? "bg-blue-500 text-white"
                                            : "hover:bg-gray-100 dark:hover:bg-gray-700"}
                                    `}
                                    onClick={() => setMobileOpen(false)}
                                >
                                    แก้ไขประวัติส่วนตัว
                                </Link>

                            </div>
                        )}

                    </div>
                </nav>

                {/* Logout */}
                <div className="p-4 border-t border-gray-200 dark:border-gray-700">

                    <button
                        onClick={handleLogout}
                        className="
                        flex items-center gap-2 w-full px-3 py-2 rounded-lg
                        hover:bg-red-100 dark:hover:bg-red-900
                        text-red-600 dark:text-red-400
                        transition cursor-pointer
                    "
                    >
                        <LogOut size={18} />
                        {!collapsed && "ออกจากระบบ"}
                    </button>

                </div>

            </aside>
        </div>
    )
}