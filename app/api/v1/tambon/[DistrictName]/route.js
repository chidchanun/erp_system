import { db } from '@/app/lib/db'
import { NextResponse } from 'next/server'

export async function GET(request, { params }) {
    try {

        const { DistrictName } = await params

        const [RequsetDistrict] = await db.query(
            "SELECT DistrictID, DisTrictThaiShort FROM District WHERE DistrictThaiShort = ?", [DistrictName]
        )

        if (RequsetDistrict.affectedRows === 0) {
            return NextResponse.json({ message: "ไม่พบอำเภอหรือเขตที่ค้นหา" }, { status: 401 })
        }

        const DistrictID = RequsetDistrict[0].DistrictID

        const [RequestTambonInDistrict] = await db.query(
            `
                SELECT
                    d.DistrictID,

                    t.TambonID,
                    t.TambonThaiShort,
                    t.TambonEngShort

                FROM District d
                LEFT JOIN Tambon t ON t.DistrictID = d.DistrictID
                WHERE d.DistrictID = ?
            `, [DistrictID]
        )

        return NextResponse.json({ message: 'ok', RequestTambonInDistrict }, { status: 200 })
    } catch {
        return NextResponse.json({ message: 'Internal Server Error' }, { status: 500 })
    }
}