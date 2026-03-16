import { NextResponse } from "next/server"
import { db } from "@/app/lib/db"

export async function POST(request) {
    try {

        const refreshToken = request.cookies.get("refresh_token")?.value

        if (refreshToken) {
            await db.query(
                `UPDATE user_tokens
                 SET revoked_at = NOW()
                 WHERE token = ?`,
                [refreshToken]
            )
        }

        const response = NextResponse.json(
            { message: "Logout success" },
            { status: 200 }
        )

        response.cookies.set("access_token", "", {
            httpOnly: true,
            secure: process.env.NODE_ENV === "production",
            sameSite: "strict",
            maxAge: 0
        })

        response.cookies.set("refresh_token", "", {
            httpOnly: true,
            secure: process.env.NODE_ENV === "production",
            sameSite: "strict",
            maxAge: 0
        })

        return response

    } catch {
        return NextResponse.json(
            { message: "Internal Server Error" },
            { status: 500 }
        )
    }
}