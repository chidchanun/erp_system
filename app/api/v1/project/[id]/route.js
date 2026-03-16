import { db } from '@/app/lib/db'
import { NextResponse } from 'next/server'

export async function GET(request, { params }) {
    try {

        const token = request.cookies.get("access_token")?.value

        if (!token) {
            return NextResponse.json(
                { message: "No token provided" },
                { status: 401 }
            )
        }

        const { id } = await params

        const [RequestProject] = await db.query(
            `
                SELECT
                    p.id,
                    p.project_name,
                    p.description,
                    p.status,
                    p.priority,
                    p.start_date,
                    p.due_date,
                    p.work_day,
                    p.owner_id,
                    u.first_name AS first_name,
                    u.last_name AS last_name
                FROM projects p
                LEFT JOIN users u ON p.owner_id = u.id
                WHERE p.id = ?
            `, [id]
        )

        return NextResponse.json({ message: 'ok', RequestProject }, { status: 200 })
    } catch {
        return NextResponse.json({ message: 'Internal Server Error' }, { status: 500 })
    }
}