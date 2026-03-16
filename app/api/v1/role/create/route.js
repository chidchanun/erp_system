import { db } from '@/app/lib/db'
import { NextResponse } from 'next/server'

export async function POST(request) {
    try {
        const body = await request.json()
        const {role_name} = body

        if (!role_name) {
            return NextResponse.json({message : "โปรดกรอกข้อมูลให้เรียบร้อย", status : 400})
        }

        await db.query(
            "INSERT INTO roles (role_name) VALUES (?)", [role_name]
        )

        return NextResponse.json({message: 'บันทึกสำเร็จ'}, {status: 200})
    } catch {
        return NextResponse.json({message: 'Internal Server Error'}, {status: 500})
    }
}