import { NextResponse } from "next/server"
import { verifyAccessToken } from "@/app/lib/auth"
import jwt from "jsonwebtoken"

export async function POST(request) {
    try {

        const token = request.cookies.get("access_token")?.value

        if (!token) {
            return NextResponse.json(
                { message: "No token provided" },
                { status: 401 }
            )
        }

        const decoded = verifyAccessToken(token)

        const now = Math.floor(Date.now() / 1000)
        let newAccessToken = null

        // refresh token ถ้าใกล้หมดอายุ (<5 นาที)
        if (decoded.exp - now < 300) {
            newAccessToken = jwt.sign(
                {
                    userId: decoded.userId,
                    first_name: decoded.first_name,
                    last_name: decoded.last_name,
                    first_name_en: decoded.first_name_en,
                    last_name_en: decoded.last_name_en,
                    role_name : decoded.role_name,
                    type: "access"
                },
                process.env.JWT_SECRET,
                { expiresIn: "30m" }
            )
        }

        const response = NextResponse.json({
            userId: decoded.userId,
            first_name: decoded.first_name,
            last_name: decoded.last_name,
            first_name_en: decoded.first_name_en,
            last_name_en: decoded.last_name_en,
            role_name : decoded.role_name
        })

        if (newAccessToken) {
            response.cookies.set("access_token", newAccessToken, {
                httpOnly: true,
                secure: process.env.NODE_ENV === "production",
                sameSite: "strict",
                path: "/",
                maxAge: 60 * 30
            })
        }

        return response

    } catch (err) {
        return NextResponse.json(
            { message: "Unauthorized" },
            { status: 401 }
        )
    }
}