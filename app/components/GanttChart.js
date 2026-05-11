"use client"

import { useMemo, useState, useEffect } from "react"

export default function GanttChart({ tasks, view = "day" }) {
    const [screen, setScreen] = useState("desktop")

    useEffect(() => {
        const handleResize = () => {
            if (window.innerWidth < 640) setScreen("mobile")
            else if (window.innerWidth < 1024) setScreen("tablet")
            else setScreen("desktop")
        }

        handleResize()
        window.addEventListener("resize", handleResize)
        return () => window.removeEventListener("resize", handleResize)
    }, [])
    const DAY = 1000 * 60 * 60 * 24

    // eslint-disable-next-line react-hooks/exhaustive-deps
    const startProject = tasks.length
        ? new Date(Math.min(...tasks.map(t => new Date(t.start_date))))
        : new Date()

    // eslint-disable-next-line react-hooks/exhaustive-deps
    const endProject = tasks.length
        ? new Date(Math.max(...tasks.map(t => new Date(t.due_date))))
        : new Date()

    const units = useMemo(() => {

        if (!tasks.length) return []

        const arr = []
        const d = new Date(startProject)

        while (d <= endProject) {

            arr.push(new Date(d))

            if (view === "year") d.setFullYear(d.getFullYear() + 1)
            else if (view === "month") d.setMonth(d.getMonth() + 1)
            else d.setDate(d.getDate() + 1)

        }

        return arr

    }, [tasks, view, startProject, endProject])

    if (!tasks.length) {
        return (
            <div className="text-center text-gray-400 py-10">
                No tasks
            </div>
        )
    }

    if (!tasks || tasks.length === 0) {
        return (
            <div className="text-center text-gray-400 py-10">
                No tasks
            </div>
        )
    }

    const totalUnits = units.length
    const columnWidth =
        screen === "mobile" ? 28 :
            screen === "tablet" ? 34 :
                40

    const taskWidth =
        screen === "mobile" ? 0 :
            screen === "tablet" ? 200 :
                260
    const timelineWidth = taskWidth + totalUnits * columnWidth
    const startColumn = screen === "mobile" ? 1 : 2
    const today = new Date()

    const getOffset = (date) => {

        const d = new Date(date)

        if (view === "year") {
            return d.getFullYear() - startProject.getFullYear()
        }

        if (view === "month") {
            return (
                (d.getFullYear() - startProject.getFullYear()) * 12 +
                (d.getMonth() - startProject.getMonth())
            )
        }

        return Math.floor((d - startProject) / DAY)
    }

    const getDuration = (start, end) => {

        const s = new Date(start)
        const e = new Date(end)

        if (view === "year") {
            return e.getFullYear() - s.getFullYear() + 1
        }

        if (view === "month") {
            return (
                (e.getFullYear() - s.getFullYear()) * 12 +
                (e.getMonth() - s.getMonth()) + 1
            )
        }

        return Math.ceil((e - s) / DAY) + 1
    }

    const getColor = (status) => {

        if (status === "done") return "bg-green-500"
        if (status === "in_progress") return "bg-blue-500"

        return "bg-gray-400"
    }


    const isWeekend = (date) => {
        const day = date.getDay()
        return day === 0 || day === 6
    }

    const todayOffset = getOffset(today)

    return (
        <div className="border rounded-lg overflow-x-auto dark:border-gray-700">

            <div
                className="relative"
                style={{ minWidth: timelineWidth }}
            >

                {/* TODAY LINE */}
                {todayOffset >= 0 && todayOffset <= totalUnits && (
                    <div
                        className="absolute top-0 bottom-0 w-0.5 bg-red-500 z-20"
                        style={{
                            left: (screen === "mobile" ? 0 : taskWidth) + todayOffset * columnWidth
                        }}
                    />
                )}

                {/* MONTH HEADER */}
                <div
                    className="grid text-xs text-center border-b dark:border-gray-700"
                    style={{
                        gridTemplateColumns: `${taskWidth}px repeat(${totalUnits}, ${columnWidth}px)`
                    }}
                >

                    <div className="sticky left-0 bg-white dark:bg-gray-900 z-10 border-r dark:border-gray-700"></div>

                    {(() => {

                        const months = []
                        let startIndex = 0

                        for (let i = 0; i < units.length; i++) {

                            const current = units[i]
                            const next = units[i + 1]

                            if (!next || current.getMonth() !== next.getMonth()) {

                                const span = i - startIndex + 1

                                months.push(
                                    <div
                                        key={i}
                                        className="border-r py-1 font-semibold dark:border-gray-700"
                                        style={{
                                            gridColumn: `${startIndex + 2} / span ${span}`
                                        }}
                                    >
                                        {current.toLocaleDateString("en", { month: "short" })}
                                    </div>
                                )

                                startIndex = i + 1
                            }
                        }

                        return months

                    })()}

                </div>

                {/* DAY HEADER */}
                <div
                    className="grid text-xs text-center border-b dark:border-gray-700"
                    style={{
                        gridTemplateColumns: `${taskWidth}px repeat(${totalUnits}, ${columnWidth}px)`
                    }}
                >

                    <div className="sticky left-0 bg-white dark:bg-gray-900 z-10 border-r dark:border-gray-700"></div>

                    {units.map((d, i) => (
                        <div
                            key={i}
                            className={`border-r py-2 dark:border-gray-700
                            ${view === "day" && isWeekend(d)
                                    ? "bg-gray-100 dark:bg-gray-800"
                                    : ""
                                }`}
                        >
                            {d.getDate()}
                        </div>
                    ))}

                </div>

                {/* TASK HEADER */}
                <div
                    className="grid text-sm border-b dark:border-gray-700"
                    style={{
                        gridTemplateColumns: `${taskWidth}px repeat(${totalUnits}, ${columnWidth}px)`
                    }}
                >

                    {screen !== "mobile" && (
                        <div className="sticky left-0 bg-white dark:bg-gray-900 z-10 border-r p-2 font-semibold dark:border-gray-700">
                            Task
                        </div>
                    )}

                    {units.map((d, i) => (

                        <div
                            key={i}
                            className={`border-r h-8 dark:border-gray-700
                            ${view === "day" && isWeekend(d)
                                    ? "bg-gray-100 dark:bg-gray-800"
                                    : ""
                                }`}
                        />

                    ))}

                </div>

                {/* TASK ROWS */}
                {tasks.map(task => {

                    const offset = getOffset(task.start_date)
                    const duration = getDuration(task.start_date, task.due_date)

                    return (

                        <div
                            key={task.id}
                            className="grid items-center border-b hover:bg-gray-50 dark:hover:bg-gray-800 dark:border-gray-700"
                            style={{
                                gridTemplateColumns: `${taskWidth}px repeat(${totalUnits}, ${columnWidth}px)`
                            }}
                        >

                            {/* TASK NAME */}
                            {screen !== "mobile" && (
                                <div className="sticky left-0 bg-white dark:bg-gray-900 border-r p-2 text-sm z-10 dark:border-gray-700">
                                    {task.title}
                                </div>
                            )}

                            {/* BAR */}
                            <div
                                className={`h-7 rounded text-white text-[11px] flex items-center px-2 overflow-hidden ${getColor(task.status)}`}
                                style={{
                                    gridColumn: `${offset + startColumn} / span ${duration}`
                                }}
                            >
                                {screen === "mobile" && (
                                    <span className="truncate w-full">
                                        {task.title}
                                    </span>
                                )}
                            </div>

                        </div>

                    )
                })}

            </div>

        </div>
    )
}