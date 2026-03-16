import { db } from '@/app/lib/db'
import { NextResponse } from 'next/server'

export async function POST(request) {
    try {
        const body = await request.json()
        const { id, role_name } = body

        if (!id || !role_name) {
            return NextResponse.json({ message: "โปรดกรอกข้อมูลให้เรียบร้อย", status: 400 })
        }

        const [result] = await db.query(
            "UPDATE roles SET role_name = ? WHERE id = ?", [role_name, id]
        )

        if (result.affectedRows === 0) {
            return NextResponse.json({message : "ไม่พบข้อมูล", status : 400})
        }

        return NextResponse.json({ message: 'บันทึกสำเร็จ' }, { status: 200 })
    } catch {
        return NextResponse.json({ message: 'ข้อผิดพลาดจากเซิฟเวอร์' }, { status: 500 })
    }
}