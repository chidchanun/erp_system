import { db } from '@/app/lib/db'
import { NextResponse } from 'next/server'

export async function GET(request, {params}) {
    try {

        const { TambonName } = await params

        const [RequestTambon] = await db.query(
            "SELECT TambonID, TambonThaiShort FROM Tambon WHERE TambonThaiShort = ?", [TambonName]
        )

        if (RequestTambon.affectedRows === 0) {
            return NextResponse.json({message : "ไม่พบตำบลหรือแขวงที่ค้นหา"}, {status : 401})
        }

        const TambonID  = await RequestTambon[0].TambonID

        const [RequestPostalInTambon] = await db.query(
            `
                SELECT 
                    t.TambonID,

                    p.PostCode,
                    p.TambonThaiShort,
                    p.DistrictThaiShort,
                    p.ProvinceThai,
                    p.Region
                FROM Tambon t
                LEFT JOIN Postal p ON p.TambonID = t.TambonID
                WHERE t.TambonID = ?
            `, [TambonID]
        )

        return NextResponse.json({message: 'ok', RequestPostalInTambon}, {status: 200})
    } catch (e) {
        console.log(e)
        return NextResponse.json({message: 'Internal Server Error'}, {status: 500})
    }
}