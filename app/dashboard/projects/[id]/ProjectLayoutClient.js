'use client';
import Breadcrumb from "@/app/components/Breadcrumb";
import Link from "next/link"
import { useParams, usePathname } from "next/navigation";
import { useState, useEffect } from "react";


export default function ProjectLayoutClient({ children }) {
    const pathname = usePathname()
    const params = useParams()
    const [project, setProject] = useState()

    const { id } = params

    useEffect(() => {

        async function loadData() {

            try {

                const projectRes = await fetch(`/api/v1/project/${id}`, {
                    method: "GET",
                    credentials: "include"
                })

                const projectData = await projectRes.json()
                setProject(projectData.RequestProject[0])

            } catch (err) {
                console.error(err)
            }

        }

        loadData()
    }, [id])


    return (
        <div className="flex-1 overflow-y-auto p-3
                text-gray-800 dark:text-gray-100
                transition-colors duration-300
                custom-scrollbar w-full flex flex-col items-center"
        >

            <div className="max-w-6xl p-1 flex flex-col gap-4 items-center">

                <div className="flex justify-start w-full ">
                    <Breadcrumb
                        items={[
                            { label: "แดชบอร์ด", href: "/dashboard" },
                            { label: "โปรเจ็ค", href: "/dashboard/projects" },
                            { label: project?.project_name }
                        ]}
                    />
                </div>


                <div className="w-full border-b overflow-x-auto">
                    <div className="flex gap-6 min-w-max">

                        <Link
                            href={`/dashboard/projects/${id}`}
                            className={`pb-2 border-b-2 whitespace-nowrap ${pathname === `/dashboard/projects/${id}`
                                ? "border-blue-500 "
                                : "border-transparent text-gray-500 hover:text-white"
                                }`}
                        >
                            Overview
                        </Link>

                        <Link
                            href={`/dashboard/projects/${id}/task`}
                            className={`pb-2 border-b-2 whitespace-nowrap ${pathname.startsWith(`/dashboard/projects/${id}/task`)
                                ? "border-blue-500 "
                                : "border-transparent text-gray-500 hover:text-white"
                                }`}
                        >
                            Tasks
                        </Link>

                        <Link
                            href={`/dashboard/projects/${id}/ganttchart`}
                            className={`pb-2 border-b-2 whitespace-nowrap ${pathname.startsWith(`/dashboard/projects/${id}/member`)
                                ? "border-blue-500 "
                                : "border-transparent text-gray-500 hover:text-white"
                                }`}
                        >
                            Gantt Chart
                        </Link>

                        <Link
                            href={`/dashboard/projects/${id}/activity`}
                            className={`pb-2 border-b-2 whitespace-nowrap ${pathname.startsWith(`/dashboard/projects/${id}/activity`)
                                ? "border-blue-500"
                                : "border-transparent text-gray-500 hover:text-white"
                                }`}
                        >
                            Activity
                        </Link>

                    </div>
                </div>

                {children}

            </div>


        </div>
    )
}