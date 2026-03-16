import { db } from '@/app/lib/db'
import { NextResponse } from 'next/server'
import { verifyAccessToken } from '@/app/lib/auth'

export async function POST(request) {
    try {
        const body = await request.json()
        const { project_name, description, status, priority, start_date, due_date, work_day ,member } = body
        const token = request.cookies.get("access_token")?.value

        if (!token) {
            return NextResponse.json(
                { message: "No token provided" },
                { status: 401 }
            )
        }


        if (!project_name || !description || !status || !priority || !start_date || !due_date || !work_day) {
            return NextResponse.json({ message: "โปรดกรอกข้อมูลให้ครบถ้วน" }, { status: 400 })
        }

        const user = verifyAccessToken(token)

        const [RequestCreateProject] = await db.query(
            "INSERT INTO projects (project_name, description, status, priority, start_date, due_date, owner_id, work_day) VALUES (?, ?, ?, ?, ?, ?, ?, ?)",
            [project_name, description, status, priority, start_date, due_date, user.userId, work_day]
        )

        if (RequestCreateProject.affectedRows === 0) {
            return NextResponse.json({ message: "บันทึกไม่สำเร็จ โปรดลองใหม่อีกครั้ง" }, { status: 500 })
        }
        const projectId = await RequestCreateProject.insertId

        if (member) {
            for (const m of member) {
                await db.query(
                    "INSERT INTO project_members (project_id, user_id) VALUES (?, ?)",
                    [projectId, m.id]
                )
            }
        }

        await db.query(
            "INSERT INTO project_members (project_id, user_id, role) VALUES (?, ?, ?)",
            [projectId, user.userId, "owner"]
        )

        return NextResponse.json({ message: 'บันทึกสำเร็จ' }, { status: 200 })
    } catch (e) {
        console.log(e)
        return NextResponse.json({ message: 'Internal Server Error' }, { status: 500 })
    }
}