import { db } from '@/app/lib/db'
import { NextResponse } from 'next/server'

export async function GET(request, { params }) {
    try {

        const { id } = await params

        const [RequestMemberProject] = await db.query(
            `
                SELECT
                    pm.role,
                    pm.user_id,
                    pm.project_id,
                    u.first_name AS first_name,
                    u.last_name AS last_name,
                    u.first_name_en AS first_name_en,
                    u.last_name_en AS last_name_en,
                    u.picture_path AS picture_path,
                    p.project_name AS project_name
                FROM project_members pm
                LEFT JOIN projects p ON p.id = pm.project_id
                LEFT JOIN users u ON u.id = pm.user_id
                WHERE pm.project_id = ?
            `, [id]
        )

        return NextResponse.json({ message: 'ok', RequestMemberProject }, { status: 200 })
    } catch (e) {
        console.log(e)
        return NextResponse.json({ message: 'Internal Server Error' }, { status: 500 })
    }
}