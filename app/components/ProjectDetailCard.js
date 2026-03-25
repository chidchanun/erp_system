import Link from "next/link"

export default function ProjectDetailCard({ project, canEdit }) {

    const startDate = new Date(project.start_date).toLocaleDateString("th-TH")
    const dueDate = new Date(project.due_date).toLocaleDateString("th-TH")

    return (
        <>
            <div className="mb-6">

                <div className="flex flex-row justify-between">

                    <h1 className="text-2xl font-bold">
                        {project.project_name}
                    </h1>

                    {canEdit && (
                        <div>
                            <Link
                                href={`/dashboard/projects/${project.id}/edit/`}
                                className="text-sm px-4 py-1.5 rounded 
                             bg-blue-500 text-white hover:bg-blue-600 cursor-pointer"
                            >
                                แก้ไข
                            </Link>
                        </div>
                    )}

                </div>

                <p className="text-sm ">
                    Owner : {project.first_name} {project.last_name}
                </p>

            </div>


            {/* Card */}

            <div className="bg-white dark:bg-gray-800 rounded-xl shadow p-6 space-y-6">

                {/* Description */}

                <div className="">

                    <h2 className="text-lg font-semibold mb-2">
                        รายละเอียดโปรเจ็ค
                    </h2>

                    <div
                        className="text-gray-700 dark:text-gray-300 leading-relaxed
                            wrap-anywhere
                            [&_ul]:list-disc [&_ul]:ml-6
                            [&_ol]:list-decimal [&_ol]:ml-6"
                        dangerouslySetInnerHTML={{
                            __html: project.description
                        }}
                    />

                </div>


                {/* Project Info */}

                <div className="grid grid-cols-2 gap-4 max-md:grid-cols-2">

                    <div>
                        <div className="text-sm ">
                            สถานะ
                        </div>
                        <div className="font-medium">
                            {project.status}
                        </div>
                    </div>

                    <div>
                        <div className="text-sm ">
                            ความสำคัญ
                        </div>
                        <div className="font-medium">
                            {project.priority}
                        </div>
                    </div>

                    <div>
                        <div className="text-sm ">
                            วันเริ่มโปรเจ็ค
                        </div>
                        <div className="font-medium">
                            {startDate}
                        </div>
                    </div>

                    <div>
                        <div className="text-sm ">
                            กำหนดส่ง
                        </div>
                        <div className="font-medium">
                            {dueDate}
                        </div>
                    </div>
                    <div>
                        <div className="text-sm ">
                            จำนวนวันทั้งหมด
                        </div>
                        <div className="font-medium">
                            {project.work_day}
                        </div>
                    </div>
                </div>

            </div>
        </>
    )
}