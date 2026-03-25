"use client"

export default function GanttFilters({
    filters,
    setFilters,
    project
}) {

    const start = project?.start_date?.split("T")[0]
    const end = project?.due_date?.split("T")[0]
    const toggleStatus = (value) => {
        const current = filters.status || []

        if (current.includes(value)) {
            setFilters({
                ...filters,
                status: current.filter(s => s !== value)
            })
        } else {
            setFilters({
                ...filters,
                status: [...current, value]
            })
        }
    }
    return (
        <>
            <div className="flex flex-wrap gap-4 mb-4">

                {/* start date */}
                <div className="flex gap-2 items-center">
                    <label className="text-sm">Start :</label>
                    <input
                        type="date"
                        min={start}
                        max={end}
                        className="border rounded px-2 py-1 dark:bg-gray-800"
                        value={filters.start}
                        onChange={(e) =>
                            setFilters({ ...filters, start: e.target.value })
                        }
                    />
                </div>

                {/* end date */}
                <div className="flex gap-2 items-center">
                    <label className="text-sm">End :</label>
                    <input
                        type="date"
                        min={start}
                        max={end}
                        className="border rounded px-2 py-1 dark:bg-gray-800"
                        value={filters.end}
                        onChange={(e) =>
                            setFilters({ ...filters, end: e.target.value })
                        }
                    />
                </div>

                {/* status */}
                <div className="flex gap-2 items-center">
                    <label className="text-sm">Status :</label>
                    <select
                        value={filters.status}
                        className="border rounded px-2 py-1 dark:bg-gray-800"
                        onChange={(e) =>
                            setFilters({ ...filters, status: e.target.value })
                        }
                    >
                        <option value="">All</option>
                        <option value="todo">Todo</option>
                        <option value="in_progress">In Progress</option>
                        <option value="done">Done</option>
                    </select>
                </div>

                {/* priority */}
                <div className="flex gap-2 items-center">
                    <label className="text-sm">Priority :</label>
                    <select
                        value={filters.priority}
                        className="border rounded px-2 py-1 dark:bg-gray-800"
                        onChange={(e) =>
                            setFilters({ ...filters, priority: e.target.value })
                        }
                    >
                        <option value="">All</option>
                        <option value="low">Low</option>
                        <option value="medium">Medium</option>
                        <option value="high">High</option>
                        <option value="urgent">Urgent</option>
                    </select>
                </div>

                {/* view */}
                <div className="flex gap-2 items-center">
                    <label className="text-sm">View :</label>
                    <select
                        value={filters.view}
                        className="border rounded px-2 py-1 dark:bg-gray-800"
                        onChange={(e) =>
                            setFilters({ ...filters, view: e.target.value })
                        }
                    >
                        <option value="day">Day</option>
                        <option value="month">Month</option>
                        <option value="year">Year</option>
                    </select>
                </div>

            </div>

            {/* legend */}
            <div className="flex flex-wrap gap-6 mb-6 text-sm">

                <div className="flex items-center gap-2">
                    <div className="w-4 h-4 rounded bg-gray-400"></div>
                    <span>Todo</span>
                </div>

                <div className="flex items-center gap-2">
                    <div className="w-4 h-4 rounded bg-blue-500"></div>
                    <span>In Progress</span>
                </div>

                <div className="flex items-center gap-2">
                    <div className="w-4 h-4 rounded bg-green-500"></div>
                    <span>Done</span>
                </div>

            </div>
        </>
    )
}