import React from 'react'

export default function Policy({ isdisabled, onChange }: { isdisabled: boolean, onChange: (value: boolean) => void }) {
    return (
        <div className="px-4 flex flex-col items-center">
            <div className="p-4 border rounded-2xl shadow-sm bg-card text-card-foreground">
                <h1 className='text-2xl font-bold mb-2'>นโยบายความเป็นส่วนตัว</h1>
                <p className='text-sm text-justify'>ข้าพเจ้าได้อ่านและรับทราบรายละเอียดเกี่ยวกับการเก็บรวบรวม ใช้ และ/หรือเปิดเผยข้อมูลส่วนบุคคล โดยเฉพาะข้อมูลสุขภาพ ซึ่งเป็นข้อมูลส่วนบุคคลที่มีความอ่อนไหว ตามพระราชบัญญัติคุ้มครองข้อมูลส่วนบุคคล พ.ศ. 2562 แล้ว</p>
                <p className='text-sm mt-2 text-justify'>ข้าพเจ้ายินยอมให้หน่วยงานเก็บรวบรวม ใช้ และ/หรือเปิดเผยข้อมูลสุขภาพของข้าพเจ้า เพื่อวัตถุประสงค์ในการดำเนินงาน การดูแลรักษา การติดตามผล การพัฒนาคุณภาพบริการ การวิจัย หรือกิจกรรมตามภารกิจของหน่วยงาน ตามที่ได้แจ้งไว้</p>
                <p className='text-sm mt-2 text-justify'>หน่วยงานจะดำเนินการคุ้มครองข้อมูลส่วนบุคคลของข้าพเจ้าอย่างเหมาะสม และใช้ข้อมูลตามวัตถุประสงค์ที่แจ้งไว้เท่านั้น</p>
                <p className='text-sm mt-2 text-justify'>ข้าพเจ้าทราบถึงสิทธิของเจ้าของข้อมูลส่วนบุคคลตามกฎหมาย อาทิ สิทธิในการเข้าถึง ขอแก้ไข ถอนความยินยอม และร้องเรียนตามที่กฎหมายกำหนด</p>
                <div className='p-4 bg-card text-card-foreground gap-2 flex items-center'>
                    <input type="checkbox" name="policy" id="policy" onClick={() => onChange(!isdisabled)} />
                    <label htmlFor="policy">ฉันยอมรับนโยบายความเป็นส่วนตัว</label>
                </div>
            </div>
        </div>
    )
}
