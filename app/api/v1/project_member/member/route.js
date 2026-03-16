import { verifyAccessToken } from '@/app/lib/auth'
import { db } from '@/app/lib/db'
import { NextResponse } from 'next/server'

export async function POST(request) {
    try {
        const body = await request.json()
        const { memberProjects, project_id } = body

        const token = request.cookies.get("access_token")?.value

        if (!token) {
            return NextResponse.json(
                { message: "No token provided" },
                { status: 401 }
            )
        }

        if (!memberProjects || !project_id) {
            return NextResponse.json({ message: "ไม่พบข้อมูล" }, { status: 400 })
        }

        const user = verifyAccessToken(token)
        const [RequestCheckOwner] = await db.query(
            `
                SELECT user_id, project_id, role FROM project_members WHERE user_id = ? AND project_id = ? 
            `, [user.userId, project_id]
        )

        const ResponseCheckOwner = await RequestCheckOwner[0]

        if (ResponseCheckOwner.role !== "owner" && ResponseCheckOwner.role !== "co owner") {
            return NextResponse.json({ message: "ไม่มีสิทธิ์ในการแก้ไขข้อมูล" }, { status: 401 })
        }

        // 1. ดึงสมาชิกทั้งหมดใน DB
        const [dbMembers] = await db.query(
            "SELECT user_id FROM project_members WHERE project_id = ?",
            [project_id]
        )

        // user_id ที่อยู่ใน DB
        const dbUserIds = dbMembers.map(m => m.user_id)

        // user_id ที่ client ส่งมา
        const clientUserIds = memberProjects.map(m => m.user_id)


        // 2. หา user ที่ต้องลบ (มีใน DB แต่ไม่มีใน client)
        const usersToDelete = dbUserIds.filter(
            id => !clientUserIds.includes(id)
        )


        // 3. ลบสมาชิกที่เกิน
        if (usersToDelete.length > 0) {
            await db.query(
                `DELETE FROM project_members 
         WHERE project_id = ? AND user_id IN (?)`,
                [project_id, usersToDelete]
            )
        }


        // 4. Insert / Update สมาชิก
        for (const m of memberProjects) {

            const [check] = await db.query(
                "SELECT user_id FROM project_members WHERE user_id = ? AND project_id = ?",
                [m.user_id, project_id]
            )

            if (check.length === 0) {

                await db.query(
                    "INSERT INTO project_members (user_id, project_id, role) VALUES (?,?,?)",
                    [m.user_id, project_id, m.role]
                )

            } else {

                await db.query(
                    "UPDATE project_members SET role = ? WHERE user_id = ? AND project_id = ?",
                    [m.role, m.user_id, project_id]
                )

            }
        }

        return NextResponse.json({ message: 'ok' }, { status: 200 })
    } catch (e) {
        console.log(e)
        return NextResponse.json({ message: 'Internal Server Error' }, { status: 500 })
    }
}