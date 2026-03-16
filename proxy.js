import { NextResponse } from "next/server"
import jwt from "jsonwebtoken"

export async function proxy(request) {

    const { pathname } = request.nextUrl

    if (pathname === "/api/v1/auth/login") {
        return NextResponse.next()
    }

    const token = request.cookies.get("access_token")?.value

    if (!token) {
        return NextResponse.json(
            { message: "No token provided" },
            { status: 401 }
        )
    }

    try {
        jwt.verify(token, process.env.JWT_SECRET)
    } catch {
        return NextResponse.json(
            { message: "Invalid token" },
            { status: 401 }
        )
    }

    return NextResponse.next()
}

export const config = {
    matcher: ["/api/:path*"]
}