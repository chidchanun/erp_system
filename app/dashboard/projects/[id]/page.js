'use client'

import { useEffect, useState } from "react"
import { useUser } from "@/app/context/UserContext"
import { Users } from "lucide-react"
import { useParams } from "next/navigation"
import Link from "next/link"
import Breadcrumb from "@/app/components/Breadcrumb"

import Image from "next/image"
import MemberProject from "@/app/components/MemberProjectCard"
import ProjectDetailCard from "@/app/components/ProjectDetailCard"

export default function ProjectDetailPage() {
    const params = useParams()
    const { id } = params
    const [project, setProject] = useState(null)
    const [memberProject, setMemberProject] = useState()
    const [loading, setLoading] = useState(true)
    const user = useUser()
    
    useEffect(() => {

        async function loadData() {

            try {

                const [projectRes, memberRes] = await Promise.all([
                    fetch(`/api/v1/project/${id}`, {
                        credentials: "include"
                    }),
                    fetch(`/api/v1/project_member/${id}`)
                ])

                const projectData = await projectRes.json()
                const memberData = await memberRes.json()

                setProject(projectData.RequestProject[0])
                setMemberProject(memberData.RequestMemberProject)

            } catch (err) {
                console.error(err)
            } finally {
                setLoading(false)
            }

        }

        loadData()
    }, [id])


    if (loading) {
        return (
            <div className="p-6">
                กำลังโหลดข้อมูล...
            </div>
        )
    }

    if (!project) {
        return (
            <div className="p-6">
                ไม่พบข้อมูลโปรเจ็ค
            </div>
        )
    }


    const canEdit =
        user.userId === project.owner_id ||
        memberProject?.some(m => m.role === "co owner" && m.user_id === user.userId)

    const startDate = new Date(project.start_date).toLocaleDateString("th-TH")
    const dueDate = new Date(project.due_date).toLocaleDateString("th-TH")

    return (

        <div className="max-w-5xl p-3 max-md:p-1.5 ">

            {/* Header */}
            <Breadcrumb
                items={[
                    { label: "แดชบอร์ด", href: "/dashboard" },
                    { label: "โปรเจ็ค", href: "/dashboard/projects" },
                    { label: project.project_name }
                ]}
            />
            <ProjectDetailCard project={project} canEdit={canEdit}/>

            {/* Members */}
            <MemberProject memberProject={memberProject} project={project} canEdit={canEdit}/>
        </div>

    )
}