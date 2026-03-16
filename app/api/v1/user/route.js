import { NextResponse } from "next/server"
import { db } from "@/app/lib/db"


export async function GET(request) {
    try {

        const token = request.cookies.get("access_token")?.value

        if (!token) {
            return NextResponse.json(
                { message: "No token provided" },
                { status: 401 }
            )
        }


        const [rows] = await db.query(
            `
            SELECT 
                u.id,
                u.prefix,
                u.first_name,
                u.last_name,
                u.first_name_en,
                u.last_name_en,
                u.email,
                u.phone,
                u.picture_path,

                d.department_name AS department_name,

                s.sex_name AS sex_name,

                r.role_name AS role_name,
                sr.subrole_name As subrole_name

            FROM users u
            LEFT JOIN departments d ON u.department_id = d.id
            LEFT JOIN sexes s ON u.sex_id = s.id
            LEFT JOIN roles r ON u.role_id = r.id
            LEFT JOIN sub_roles sr ON u.subrole_id = sr.id
            `
        )

        if (rows.length === 0) {
            return NextResponse.json(
                { message: "ไม่พบผู้ใช้งาน" },
                { status: 404 }
            )
        }

        return NextResponse.json(rows)

    } catch (err) {
        console.log(err)
        return NextResponse.json(
            { message: "Internal Server Error" },
            { status: 500 }
        )
    }
}