import { db } from '@/app/lib/db'
import { NextResponse } from 'next/server'

export async function GET(request, { params }) {

    const { id } = await params

    const [tasks] = await db.query(
        `
        SELECT 
            t.*,
            u.first_name,
            u.last_name
        FROM project_tasks t
        LEFT JOIN users u 
            ON t.assignee_id = u.id
        WHERE t.project_id = ?
        ORDER BY t.created_at DESC
        `,
        [id]
    )

    return NextResponse.json({
        message: "ok",
        tasks
    })
}