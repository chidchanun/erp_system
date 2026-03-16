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

        const [RequestMyProject] = await db.query(
            `
                SELECT 
                    u.first_name AS member_first_name,
                    u.last_name AS member_last_name,
                    pm.role,
                    pm.project_id,
                    p.project_name,
                    p.owner_id,

                    owner.first_name AS owner_first_name,
                    owner.last_name AS owner_last_name

                FROM project_members pm

                LEFT JOIN projects p 
                    ON pm.project_id = p.id

                LEFT JOIN users u 
                    ON pm.user_id = u.id

                LEFT JOIN users owner 
                    ON p.owner_id = owner.id

                WHERE pm.user_id = ?
            `, [id]
        )

        return NextResponse.json({ message: 'ok', RequestMyProject }, { status: 200 })
    } catch {
        return NextResponse.json({ message: 'Internal Server Error' }, { status: 500 })
    }
}