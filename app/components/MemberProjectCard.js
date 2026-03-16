import { Users } from "lucide-react"
import Link from "next/link"
import Image from "next/image"

export default function MemberProject({memberProject, project, canEdit}) {
    const rolePriority = {
        "owner": 1,
        "co owner": 2,
        "member": 3
    }

    const sortedMembers = memberProject
        ?.slice()
        .sort((a, b) => rolePriority[a.role] - rolePriority[b.role])

    const roleStyle = {
        owner: "bg-blue-100 text-blue-700 dark:bg-blue-900 dark:text-blue-300",
        "co owner": "bg-purple-100 text-purple-700 dark:bg-purple-900 dark:text-purple-300",
        member: "bg-gray-100 text-gray-600 dark:bg-gray-700 dark:text-gray-300"
    }

    const roleLabel = {
        owner: "Owner",
        "co owner": "Co-Owner",
        member: "Member"
    }

   
    
    return (
        <div className="bg-white dark:bg-gray-800 rounded-xl shadow p-6 mt-6 flex flex-col gap-2">

            <div className="flex flex-row justify-between items-center">
                <h2 className="text-lg font-semibold ">
                    สมาชิกโปรเจ็ค
                </h2>
                {
                    canEdit && (
                        <div className="">
                            <Link
                                href={`/dashboard/projects/member/edit/${project.id}`}
                                className="text-sm px-4 py-1 rounded 
                                        bg-blue-500 text-white hover:bg-blue-600 cursor-pointer"
                            >
                                แก้ไข
                            </Link>
                        </div>
                    )
                }
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">

                {sortedMembers?.map((m) => (

                    <div
                        key={m.user_id}
                        className="flex items-center justify-between p-4 rounded-lg border dark:border-gray-700 hover:shadow transition max-md:p-2"
                    >

                        <div className="flex items-center gap-3 max-md:gap-1">

                            {/* Avatar */}

                            <div className="w-10 h-10 rounded-full bg-gray-200 dark:bg-gray-700 flex items-center justify-center overflow-hidden">

                                {m.picture_path ? (
                                    <Image
                                        src={m.picture_path}
                                        alt={`${m.first_name}`}
                                        className="w-full h-full object-cover"
                                        loading="lazy"
                                    />
                                ) : (
                                    <Users className="w-5 h-5 " />
                                )}

                            </div>

                            <div>
                                <div className="font-medium text-sm max-md:text-[12px]">
                                    {m.first_name} {m.last_name}
                                </div>

                                <div className="text-xs  max-md:text-[10px]">
                                    {m.first_name_en} {m.last_name_en}
                                </div>
                            </div>

                        </div>

                        {/* Role */}

                        <div
                            className={`text-xs px-2 py-1 rounded-full 
                                    ${roleStyle[m.role] || roleStyle.member}`}
                        >
                            {roleLabel[m.role] || "Member"}
                        </div>

                    </div>

                ))}

            </div>

        </div>
    )
}