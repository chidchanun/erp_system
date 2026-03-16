import { db } from '@/app/lib/db'
import { NextResponse } from 'next/server'

export async function POST(request) {
    try {
        const body = await request.json()
        const { department_name, department_code } = body

        if (!department_name || !department_code) {
            return NextResponse.json({ message: 'โปรดกรอกข้อมูลให้เรียบร้อย', status: 400 })
        }

        await db.query(
            "INSERT INTO departments (department_name, department_code) VALUES (?, ?)",
            [department_name, department_code]
        )

        return NextResponse.json({ message: 'บันทึกสำเร็จ' }, { status: 200 })
    } catch {
        return NextResponse.json({ message: 'Internal Server Error' }, { status: 500 })
    }
}