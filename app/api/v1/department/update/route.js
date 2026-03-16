import { db } from '@/app/lib/db'
import { NextResponse } from 'next/server'

export async function POST(request) {
    try {
        const body = await request.json()
        const {id, department_name, department_code} = body

        if (!department_name || !id || !department_code) {
            return NextResponse.json({message : 'โปรดกรอกข้อมูลให้เรียบร้อย', status: 400})
        }

        const [result] = await db.query(
            "UPDATE departments SET department_name = ?, department_code = ? WHERE id = ?", [department_name, department_code, id]
        )

        if (result.affectedRows === 0){
            return NextResponse.json({message : "ไม่พบข้อมูล", status : 404})
        }

        return NextResponse.json({message: 'บันทึกสำเร็จ'}, {status: 200})
    } catch {
        return NextResponse.json({message: 'Internal Server Error'}, {status: 500})
    }
}