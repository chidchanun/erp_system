import { db } from '@/app/lib/db'
import { NextResponse } from 'next/server'

export async function GET() {
    try {

        const [RequestAllProvince] = await db.query(
            "SELECT * FROM Province"
        )

        return NextResponse.json({message: 'ok', RequestAllProvince}, {status: 200})
    } catch {
        return NextResponse.json({message: 'Internal Server Error'}, {status: 500})
    }
}