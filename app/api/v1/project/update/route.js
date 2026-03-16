import { db } from '@/app/lib/db'
import { NextResponse } from 'next/server'
import { verifyAccessToken } from '@/app/lib/auth'

export async function POST(request) {
    try {
        const body = await request.json()
        const { id, project_name, description, status, priority, start_date, due_date, work_day, owner_id } = body
        console.log(body)
        const token = request.cookies.get("access_token")?.value

        if (!token) {
            return NextResponse.json(
                { message: "No token provided" },
                { status: 401 }
            )
        }

        const user = verifyAccessToken(token)

        if (!id) {
            return NextResponse.json({ message: "ไม่พบโปรเจ็ค" }, { status: 400 })
        }

        if (!project_name || !description || !status || !priority || !start_date || !due_date || !work_day || !owner_id) {
            return NextResponse.json({ message: "โปรดกรอกข้อมูลให้ครบถ้วน" }, { status: 400 })
        }

        const [RequestCheckProject] = await db.query(
            "SELECT id FROM projects WHERE id = ?", [id]
        )


        if (!RequestCheckProject[0]) {
            return NextResponse.json({ message: "ไม่พบโปรเจ็คในฐานข้อมูล" }, { status: 400 })
        }

        const [RequestCheckRole] = await db.query(
            "SELECT role FROM project_members WHERE user_id = ? AND project_id = ?",
            [user.userId, id]
        )

        const ResponseCheckRole = await RequestCheckRole[0]
        if (ResponseCheckRole.role !== "owner" && ResponseCheckRole.role !== "co owner"){
            console.log("e")
            return NextResponse.json({message : "ไม่มีสิทธิ์ในการแก้ไข"}, {status : 400})
        }

        await db.query(
            "UPDATE projects SET project_name = ?, description = ?, status = ?, priority = ?, start_date = ?, due_date = ?, work_day = ?, owner_id = ? WHERE id = ?",
            [project_name, description, status, priority, start_date, due_date, work_day, owner_id,id]
        )

        return NextResponse.json({ message: 'ok' }, { status: 200 })
    } catch {
        return NextResponse.json({ message: 'Internal Server Error' }, { status: 500 })
    }
}