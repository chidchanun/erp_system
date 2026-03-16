import { db } from '@/app/lib/db'
import { NextResponse } from 'next/server'

export async function GET() {
    try {

        const [RequestAllTask] = await db.query(
            `
                SELECT 
                    t.id,
                    t.title,
                    t.description,
                    t.priority,
                    t.status,
                    t.due_date,
                    t.createdByUser_id,
                    t.parent_task_id,
                    p.title AS parent_task
                FROM tasks t
                LEFT JOIN tasks p 
                    ON t.parent_task_id = p.id
                LEFT JOIN users u
                    ON t.createdByUser_id = u.id;
            `
        )

        return NextResponse.json({ message: 'ok', data: RequestAllTask }, { status: 200 })
    } catch (e) {
        console.log(e)
        return NextResponse.json({ message: 'Internal Server Error' }, { status: 500 })
    }
}