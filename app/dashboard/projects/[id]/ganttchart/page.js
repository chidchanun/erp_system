'use client'

import { useEffect, useState } from "react"
import { useParams } from "next/navigation"
import GanttChart from "@/app/components/GanttChart"
import GanttFilters from "@/app/components/GanttFilters"
import AddTaskForm from "@/app/components/AddTaskForm"

export default function GanttChartPage() {

    const params = useParams()
    const { id } = params

    const [tasks, setTasks] = useState([])
    const [loading, setLoading] = useState(true)

    const [filters, setFilters] = useState({
        start: "",
        end: "",
        status: "",
        priority: "",
        view: "day"
    })

    const [project, setProject] = useState(null)

    function toThaiDate(date) {
        return new Date(date).toLocaleDateString("en-CA", {
            timeZone: "Asia/Bangkok"
        })
    }

    useEffect(() => {

        async function loadProject() {

            const res = await fetch(`/api/v1/project/${id}`)
            const data = await res.json()

            const project = data.RequestProject[0]

            setProject(project)

            setFilters(f => ({
                ...f,
                start: toThaiDate(project?.start_date),
                end: toThaiDate(project?.due_date)
            }))

        }

        loadProject()

    }, [id])

    useEffect(() => {

        async function loadTasks() {

            try {

                const res = await fetch(`/api/v1/project_task/${id}`)

                const data = await res.json()

                setTasks(data.tasks || [])

            } catch (err) {
                console.error(err)
            }

            setLoading(false)
        }

        if (id) loadTasks()

    }, [id])

    if (loading) {

        return (
            <div className="p-10 text-center">
                Loading...
            </div>
        )
    }

    const filteredTasks = tasks.filter(t => {

        if (filters.status && t.status !== filters.status)
            return false

        if (filters.priority && t.priority !== filters.priority)
            return false

        if (filters.start && new Date(t.start_date) < new Date(filters.start))
            return false

        if (filters.end && new Date(t.due_date) > new Date(filters.end))
            return false

        return true
    })

    return (
        <div className="w-full min-h-screen bg-white dark:bg-gray-900">

            <div className="w-full max-w-full px-3 sm:px-5 md:px-8">

                <h1 className="text-lg sm:text-xl md:text-2xl font-bold mb-4">
                    Project Gantt Chart
                </h1>

                <GanttFilters
                    filters={filters}
                    setFilters={setFilters}
                    project={project}
                />

                <div className="mt-4 w-full">
                    <GanttChart
                        tasks={filteredTasks}
                        view={filters.view}
                    />
                </div>

                <div className="mt-6">
                    <AddTaskForm
                        project={project}
                        AllTask={tasks}
                        setTasks={setTasks}
                    />
                </div>

            </div>

        </div>
    )
}