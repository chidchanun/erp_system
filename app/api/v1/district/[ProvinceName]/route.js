import { db } from '@/app/lib/db'
import { NextResponse } from 'next/server'

export async function GET(requset, { params }) {
    try {

        const { ProvinceName } = await params
        console.log(ProvinceName)
        const [RequestProvinceByName] = await db.query(
            "SELECT ProvinceID, ProvinceThai FROM Province WHERE ProvinceThai = ?", [ProvinceName]
        )

        if (RequestProvinceByName.affectedRows === 0) {
            return NextResponse.json({ message: "ไม่พบจังหวัดที่ค้นหา" }, { status: 401 })
        }

        const ProvinceID = RequestProvinceByName[0].ProvinceID

        const [RequestDistrictInProvince] = await db.query(
            `
                SELECT 
                    p.ProvinceID,
                    p.ProvinceThai,

                    d.DistrictID,
                    d.DistrictThaiShort,
                    d.DistrictEngShort

                FROM Province p
                LEFT JOIN District d 
                    ON d.ProvinceID = p.ProvinceID
                WHERE p.ProvinceID = ?
            `,
            [ProvinceID]
        );
        
        return NextResponse.json({ message: 'ok', RequestDistrictInProvince }, { status: 200 })
    } catch (e) {
        console.log(e)
        return NextResponse.json({ message: 'Internal Server Error' }, { status: 500 })
    }
}