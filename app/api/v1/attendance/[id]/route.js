import { db } from '@/app/lib/db'
import { NextResponse } from "next/server"

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

        const [rows] = await db.query(
            `
            SELECT 
                SUM(status = 'leave') AS leave_count,
                SUM(status = 'absent') AS absent_count,
                SUM(status = 'late') AS late_count,
                SUM(status = 'early_leave') AS early_leave_count,
                SUM(status IN ('present','late','early_leave')) AS present_count
            FROM attendance
            WHERE user_id = ?
            AND MONTH(work_date) = MONTH(CURRENT_DATE())
            AND YEAR(work_date) = YEAR(CURRENT_DATE())
            
            `,
            [id]
        )

        return NextResponse.json({
            present: rows[0].present_count ?? 0,
            leave: rows[0].leave_count ?? 0,
            absent: rows[0].absent_count ?? 0,
            late: rows[0].late_count ?? 0,
            earlyLeave: rows[0].early_leave_count ?? 0
        })

    } catch (err) {

        console.error(err)

        return NextResponse.json(
            { message: "Server error" },
            { status: 500 }
        )

    }

}