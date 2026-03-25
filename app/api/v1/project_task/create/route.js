import { db } from '@/app/lib/db'
import { NextResponse } from 'next/server'
import { verifyAccessToken } from '@/app/lib/auth'

export async function POST(request) {
    try {
        const body = await request.json()
        const { project_id, parent_task_id, title, description, status, priority, assignee_id, start_date, due_date } = body
        const token = request.cookies.get("access_token")?.value

        if (!token) {
            return NextResponse.json(
                { message: "No token provided" },
                { status: 401 }
            )
        }

        if (!project_id || !title || !description || !status || !priority || !assignee_id || !start_date || !due_date) {
            return NextResponse.json({ message: "โปรดกรอกข้อมูลให้ครบถ้วน" }, { status: 400 })
        }

        const UserData = verifyAccessToken(token)

        const [CheckOwnerProject] = await db.query(
            "SELECT user_id, role, project_id FROM project_members WHERE user_id = ? AND project_id = ?", [UserData.userId, project_id]
        )

        const OwnerProjcet = CheckOwnerProject[0]

        if (OwnerProjcet.role !== "owner" && OwnerProjcet.role !== "co owner") {
            return NextResponse.json({ mssage: "ไม่มีสิทธิ์ในการแก้ไข" }, { status: 400 })
        }

        if (parent_task_id) {
            const [CheckParentTask] = await db.query(
                `
                    SELECT id FROM project_tasks WHERE id = ?
                `, [parent_task_id]
            )

            if (CheckParentTask.affectedRows === 0) {
                return NextResponse.json({message : "ไม่พบ Parent Task"}, {status : 400})
            }
        }

        await db.query(
            `INSERT INTO 
                project_task 
                (
                    project_id, 
                    parent_task_id, 
                    title, 
                    description, 
                    status, 
                    priority, 
                    assignee_id, 
                    start_date, 
                    due_date    
                )
            VALUES (?,?,?,?,?,?,?,?,?)`,
            [project_id, parent_task_id, title, description, status, priority, assignee_id, start_date, due_date]
        )


        return NextResponse.json({ message: 'บันทึกสำเร็จ' }, { status: 200 })
    } catch {
        return NextResponse.json({ message: 'Internal Server Error' }, { status: 500 })
    }
}