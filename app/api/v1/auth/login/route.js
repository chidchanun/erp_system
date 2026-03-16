// app/api/login/route.js
import { db } from '@/app/lib/db'
import { NextResponse } from 'next/server'
import bcrypt from 'bcrypt'
import jwt from 'jsonwebtoken'

export async function POST(request) {
    try {
        const body = await request.json()
        const { id, password } = body

        if (!id || !password) {
            return NextResponse.json(
                { message: "กรอกข้อมูลไม่ครบ" },
                { status: 400 }
            )
        }

        const [rows] = await db.query(
            `
                SELECT 
                    u.id,
                    u.first_name,
                    u.last_name,
                    u.first_name_en,
                    u.last_name_en,
                    u.password_hash,

                    r.role_name AS role_name

                FROM users u
                LEFT JOIN roles r ON u.role_id = r.id

                WHERE u.id = ?
            `,
            [id]
        )


        if (rows.length === 0) {
            return NextResponse.json(
                { message: "ไม่พบผู้ใช้" },
                { status: 401 }
            )
        }

        const user = rows[0]

        const isMatch = await bcrypt.compare(password, user.password_hash)
        if (!isMatch) {
            return NextResponse.json(
                { message: "รหัสผ่านไม่ถูกต้อง" },
                { status: 401 }
            )
        }

        const accessToken = jwt.sign(
            {
                userId: user.id,
                first_name : user.first_name,
                last_name : user.last_name,
                first_name_en : user.first_name_en,
                last_name_en : user.last_name_en,
                role_name : user.role_name,
                type: "access",

            },
            process.env.JWT_SECRET,
            { expiresIn: "30m" }
        )

        const refreshToken = jwt.sign(
            { userId: user.id, type: "refresh" },
            process.env.JWT_SECRET,
            { expiresIn: "7d" }
        )

        const ip = request.headers.get('x-forwarded-for') || null
        const userAgent = request.headers.get('user-agent') || null


        // Refresh Token
        await db.query(
            `INSERT INTO user_tokens 
            (user_id, token, token_type, ip_address, user_agent, expires_at)
            VALUES (?, ?, ?, ?, ?, DATE_ADD(NOW(), INTERVAL 7 DAY))
            ON DUPLICATE KEY UPDATE
            token = VALUES(token),
            ip_address = VALUES(ip_address),
            user_agent = VALUES(user_agent),
            expires_at = VALUES(expires_at),
            revoked_at = NULL`,
            [user.id, refreshToken, "refresh", ip, userAgent]
        )

        const response = NextResponse.json(
            { message: "เข้าสู่ระบบสำเร็จ" },
            { status: 200 }
        )

        response.cookies.set("access_token", accessToken, {
            httpOnly: true,
            secure: process.env.NODE_ENV === "production",
            sameSite: "strict",
            maxAge: 60 * 30
        })

        response.cookies.set("refresh_token", refreshToken, {
            httpOnly: true,
            secure: process.env.NODE_ENV === "production",
            sameSite: "strict",
            maxAge: 60 * 60 * 24 * 7
        })

        return response

    } catch (e) {
        console.log(e)
        return NextResponse.json(
            { message: "Internal Server Error" },
            { status: 500 }
        )
    }
}