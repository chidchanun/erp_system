import { NextResponse } from "next/server";
import { db } from "@/app/lib/db";

export async function GET() {
    try {
        const [RequestRole] = await db.query(
            "SELECT * FROM roles"
        )
        return NextResponse.json({message: 'ok', RequestRole}, {status: 200})
    } catch {
        return NextResponse.json({message: 'Internal Server Error'}, {status: 500})
    }
}