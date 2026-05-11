import { NextResponse } from "next/server";
import { db } from "@/app/lib/db";

export async function GET() {
    try {

        const [RequestSex] = await db.query(
            "SELECT * FROM sexes"
        )

        return NextResponse.json({message: 'ok', RequestSex}, {status: 200})
    } catch {
        return NextResponse.json({message: 'Internal Server Error'}, {status: 500})
    }
}