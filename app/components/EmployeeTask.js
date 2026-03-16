'use client'

import { useState } from "react"
import {
    DndContext,
    useDraggable,
    useDroppable,
    useSensor,
    useSensors,
    PointerSensor,
    TouchSensor
} from "@dnd-kit/core"
import { CSS } from "@dnd-kit/utilities"
import { Clock } from "lucide-react"

function DraggableTask({ task }) {



    const { attributes, listeners, setNodeRef, transform } = useDraggable({
        id: task.id
    })

    const style = {
        transform: CSS.Translate.toString(transform)
    }

    const today = new Date().toISOString().split("T")[0]
    const overdue = task.dueDate < today && task.status !== "Completed"

    const priorityColor = (priority) => {
        if (priority === "High") return "bg-red-500"
        if (priority === "Medium") return "bg-yellow-500"
        return "bg-green-500"
    }

    return (

        <div
            ref={setNodeRef}
            style={style}
            {...listeners}
            {...attributes}
            className={`
            p-3 rounded-lg
            cursor-grab active:cursor-grabbing
            touch-none
            border
            ${overdue
                    ? "border-red-400 bg-red-50 dark:bg-red-900/30"
                    : "border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-900"
                }
            `}
        >

            <div className="flex justify-between">

                <h3 className="font-semibold text-sm text-gray-800 dark:text-gray-100">
                    {task.title}
                </h3>

                <span className={`text-xs text-white px-2 py-1 rounded ${priorityColor(task.priority)}`}>
                    {task.priority}
                </span>

            </div>

            {/* description */}
            <p className="text-xs text-gray-600 dark:text-gray-400 mt-1">
                {task.description}
            </p>

            <div className="flex items-center gap-1 text-xs mt-2 text-gray-500">

                <Clock size={14} />
                {task.dueDate}

                {overdue && (
                    <span className="text-red-500 ml-2">
                        Overdue
                    </span>
                )}

            </div>

        </div>

    )
}

function Column({ id, title, tasks }) {

    const { setNodeRef } = useDroppable({
        id
    })

    return (

        <div
            ref={setNodeRef}
            className="
            p-4 rounded-xl
            border border-gray-200 dark:border-gray-700
             dark:bg-gray-800 bg-white shadow-xl
            "
        >

            <div className="flex justify-between mb-4">

                <h2 className="font-semibold text-gray-800 dark:text-gray-200">
                    {title}
                </h2>

                <span className="text-md text-gray-500">
                    {tasks.length}
                </span>

            </div>

            <div className="space-y-3">

                {tasks.map(task => (
                    <DraggableTask key={task.id} task={task} />
                ))}

            </div>

        </div>

    )
}

export default function TaskBoard() {

    const [tasks, setTasks] = useState([
        {
            id: 1,
            title: "Develop Login API",
            description: "Create authentication API using JWT",
            priority: "High",
            status: "Pending",
            dueDate: "2026-03-05"
        },
        {
            id: 2,
            title: "Fix Dashboard Bug",
            description: "Resolve sidebar responsive issue",
            priority: "Medium",
            status: "In Progress",
            dueDate: "2026-03-08"
        },
        {
            id: 3,
            title: "Update Documentation",
            description: "Update API docs",
            priority: "Low",
            status: "Completed",
            dueDate: "2026-03-10"
        }
    ])

    const columns = ["Pending", "In Progress", "Completed"]

    const handleDragEnd = (event) => {

        const { active, over } = event

        if (!over) return

        setTasks(tasks.map(task =>
            task.id === active.id
                ? { ...task, status: over.id }
                : task
        ))
    }

    const sensors = useSensors(
        useSensor(PointerSensor, {
            activationConstraint: {
                distance: 8
            }
        }),
        useSensor(TouchSensor, {
            activationConstraint: {
                delay: 200,
                tolerance: 8
            }
        })
    )

    return (

        <div className="p-1.5">

            <h1 className="text-2xl font-bold mb-6 text-gray-800 dark:text-gray-100">
                My Tasks
            </h1>

            <DndContext
                sensors={sensors}
                onDragEnd={handleDragEnd}
            >

                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">

                    {columns.map(column => (

                        <Column
                            key={column}
                            id={column}
                            title={column}
                            tasks={tasks.filter(t => t.status === column)}
                        />

                    ))}

                </div>

            </DndContext>

        </div>

    )
}