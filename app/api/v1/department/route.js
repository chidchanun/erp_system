import { NextResponse } from "next/server"
import { db } from "@/app/lib/db"

export async function GET() {
    try {

        const [RequestDepartment] = await db.query(
            "SELECT * FROM departments"
        )

        return NextResponse.json({message: 'ok', RequestDepartment}, {status: 200})
    } catch {
        return NextResponse.json({message: 'Internal Server Error'}, {status: 500})
    }
}