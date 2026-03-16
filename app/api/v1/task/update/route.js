import { db } from '@/app/lib/db'
import { NextResponse } from 'next/server'

export async function POST(request) {
    try {
        const body = await request.json()
        const { id, title, description, priority, status, due_date, parent_task_id } = body
        const token = request.cookies.get("access_token")?.value

        if (!token) {
            return NextResponse.json(
                { message: "No token provided" },
                { status: 401 }
            )
        }


        if (!id) {
            return NextResponse.json({ message: "ไม่พบ Task ใน id นี้" }, { status: 400 })
        }

        if (!title || !description || !priority || !status || !due_date) {
            return NextResponse.json(
                {
                    message: "กรอกข้อมูลให้ครบถ้วน"
                },
                {
                    status: 400
                }
            )
        }

        // ตรวจสอบ parent task ว่ามีในระบบไหม
        if (parent_task_id) {
            const [RequestTask] = await db.query(
                "SELECT id FROM tasks WHERE id = ?", [parent_task_id]
            )

            if (RequestTask[0] === 0) {
                return NextResponse.json({ message: "ไม่พบ Task" }, { status: 400 })
            }
        }

        await db.query(
            "UPDATE tasks SET title = ?, description = ?, priority = ?, status = ?, due_date = ? WHERE id = ?", 
            [title, description, priority, status, due_date, id]
        )


        return NextResponse.json({ message: 'บันทึกงานสำเร็จ' }, { status: 200 })
    } catch (e) {
        console.log(e)
        return NextResponse.json({ message: 'Internal Server Error' }, { status: 500 })
    }
}