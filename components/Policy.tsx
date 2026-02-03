import React from 'react'

export default function Policy({ isdisabled, onChange }: { isdisabled: boolean, onChange: (value: boolean) => void }) {
    return (
        <div className="px-4 flex flex-col items-center text-black">
            <div className="p-4 border rounded-2xl shadow-sm bg-card text-card-foreground ">
                <h1 className='text-2xl font-bold mb-2'>นโยบายความเป็นส่วนตัว</h1>
                <p className='text-md indent-8 leading-loose'>ข้าพเจ้ารับทราบรายละเอียดและให้ความยินยอมในการเก็บรวบรวม ใช้ และเปิดเผยข้อมูลส่วนบุคคล โดยเฉพาะข้อมูลด้านสุขภาพซึ่งจัดเป็นข้อมูลที่มีความอ่อนไหว ตามพระราชบัญญัติคุ้มครองข้อมูลส่วนบุคคล พ.ศ. 2562 เพื่อประโยชน์ในการดำเนินงาน การดูแลรักษา การติดตามผล การพัฒนาคุณภาพการบริการ การศึกษาวิจัย ตลอดจนการดำเนินกิจกรรมต่าง ๆ ตามภารกิจของหน่วยงานที่ได้ระบุไว้ โดยหน่วยงานจะดำเนินการคุ้มครองข้อมูลส่วนบุคคลดังกล่าวอย่างเหมาะสมและนำไปใช้ภายใต้วัตถุประสงค์ที่แจ้งไว้เท่านั้น นอกจากนี้ ข้าพเจ้ายังรับทราบถึงสิทธิในฐานะเจ้าของข้อมูลส่วนบุคคลตามที่กฎหมายกำหนด ไม่ว่าจะเป็นสิทธิในการเข้าถึง การขอแก้ไขข้อมูล การถอนความยินยอม หรือการร้องเรียนต่อหน่วยงานที่เกี่ยวข้อง</p>
                <div className='p-4 bg-card text-card-foreground gap-2 flex items-center text-black'>
                    <input type="checkbox" name="policy" id="policy" onClick={() => onChange(!isdisabled)} />
                    <label htmlFor="policy">ฉันยอมรับนโยบายความเป็นส่วนตัว</label>
                </div>
            </div>
        </div>
    )
}
