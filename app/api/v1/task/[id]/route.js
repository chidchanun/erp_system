import { db } from '@/app/lib/db'
import { NextResponse } from 'next/server'
import { verifyAccessToken } from '@/app/lib/auth'

export async function GET(request, { params }) {
    try {

        const token = request.cookies.get("access_token")?.value

        if (!token) {
            return NextResponse.json(
                { message: "No token provided" },
                { status: 401 }
            )
        }

        const decodeId = verifyAccessToken(token)

        const { id } = await params

        const [RequestTaskId] = await db.query(
            "SELECT * FROM tasks WHERE id = ? AND createdByUser_id = ?",
            [id, decodeId.userId]
        )

        if (!RequestTaskId[0]) {
            return NextResponse.json({ message: "ไม่พบ Task ใน id นี้" }, { status: 400 })
        }

        return NextResponse.json({ message: 'ok', data: RequestTaskId }, { status: 200 })
    } catch {
        return NextResponse.json({ message: 'Internal Server Error' }, { status: 500 })
    }
}