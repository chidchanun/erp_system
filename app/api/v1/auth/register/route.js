import { db } from '@/app/lib/db'
import { NextResponse } from 'next/server'
import bcrypt from "bcrypt"

export async function POST(request) {
    try {
        const body = await request.json()
        const { prefix, first_name, last_name, first_name_en, last_name_en, password, password_comfirmed, phone, sex_id, department_id, role_id, subrole_id } = body

        if (!prefix || !first_name || !last_name || !password || !password_comfirmed || !phone || !sex_id || !department_id || !role_id || !first_name_en || !last_name_en || !subrole_id) {
            return NextResponse.json({ message: 'โปรดกรอกข้อมูลให้เรียบร้อย', status: 400 })
        }

        if (password !== password_comfirmed) {
            return NextResponse.json({ message: "รหัสผ่านไม่เหมือนกัน", status: 400 })
        }

        const saltRounds = 10
        const hashedPassword = await bcrypt.hash(password, saltRounds)

        const email = (first_name_en + "." + last_name_en + "@email.com").toLowerCase()

        // สร้าง users id
        const twoDigitYear = new Intl.DateTimeFormat('th-TH', {
            year: '2-digit'
        }).format(new Date()).replace(/\D/g, '');

        // ดึง department code จาก database
        const [reqDepartmentCode] = await db.query(
            "SELECT department_code FROM departments WHERE id = ?",
            [department_id]
        )

        // ตรวจสอบ department code จาก database
        if (reqDepartmentCode.length === 0) {
            return NextResponse.json({ message: 'ไม่พบแผนก' }, { status: 400 })
        }

        // สร้างตัวแปรเก็บ department code
        const departmentCode = reqDepartmentCode[0].department_code

        // นับจำนวน data ในแต่ละปีมันกี่คน และในปีนั้นมีคนในแผนกกี่คน
        const [countResult] = await db.query(
            `SELECT COUNT(*) as total 
            FROM users 
            WHERE department_id = ? 
            AND id LIKE ?`,
            [department_id, `${twoDigitYear}${departmentCode}%`]
        )

        // เพิ่มตัวเลขจากการใน database
        const runningNumber = countResult[0].total + 1

        // เติมเลข 0 ข้างหน้า เช่น นับได้ 1 จะได้ 0001
        const paddedRunning = String(runningNumber).padStart(4, '0')

        const userId = `${twoDigitYear}${departmentCode}${paddedRunning}`

        await db.query(
            "INSERT INTO users (id, prefix, first_name, last_name, first_name_en, last_name_en, email, password_hash, phone, department_id, sex_id, role_id, subrole_id) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)",
            [userId, prefix, first_name, last_name, first_name_en, last_name_en, email, hashedPassword, phone, department_id, sex_id, role_id, subrole_id]
        )

        return NextResponse.json({ message: 'บันทึกข้อมูลสำเร็จ' }, { status: 200 })
    } catch (e)  {
        console.log(e)
        return NextResponse.json({ message: 'Internal Server Error' }, { status: 500 })
    }
}