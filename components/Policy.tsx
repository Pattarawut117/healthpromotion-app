import React from 'react'

export default function Policy({ isdisabled, onChange }: { isdisabled: boolean, onChange: (value: boolean) => void }) {
    return (
        <div className="px-4 flex flex-col items-center">
            <div className="p-4 border rounded-2xl shadow-sm bg-card text-card-foreground">
                <h1>นโยบายความเป็นส่วนตัว</h1>
                <p>ในการเก็บรวบรวมและเก็บรักษาข้อมูลส่วนบุคคลองค์กรจะใช้วิธีการที่ชอบด้วยกฎหมายและจำกัดเพียงเท่าที่จำเป็นตามวัตถุประสงค์การดำเนินงานขององค์กร อันประกอบด้วย</p>
                <p>1. ข้อมูลส่วนตัว เช่น ชื่อ–นามสกุล, ตำแหน่ง, สถานที่ทำงาน</p>
                <p>2. ข้อมูลสำหรับติดต่อ เช่น ที่อยู่, หมายเลขโทรศัพท์, อีเมล</p>
                <p>3. ข้อมูลที่ได้จากระบบอัตโนมัติหรืออุปกรณ์ต่าง ๆ เช่น หมายเลข IP Address, Cookie, พฤติกรรมการใช้บริการและแพลตฟอร์มของบริษัท, ประวัติการใช้บริการ, ภาพถ่าย, ภายเคลื่อนไหว, ชื่อบัญชี Social Media, Geolocation</p>
            </div>
            <div className='p-4 border rounded-2xl shadow-sm bg-card text-card-foreground'>
                <input type="checkbox" name="policy" id="policy" onClick={() => onChange(!isdisabled)} />
                <label htmlFor="policy">ฉันยอมรับนโยบายความเป็นส่วนตัว</label>
            </div>
        </div>
    )
}
