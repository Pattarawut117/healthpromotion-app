import React from 'react'
import { RegisterFormData } from '@/app/user/register/page'

type Props = {
    formData: RegisterFormData;
    onChange: <T>(field: keyof RegisterFormData, value: T) => void;
  };

export default function BehaviorForm({onChange}: Props) {
  return (
    <div>
      <div className='flex flex-col'>
        <label htmlFor="">ท่านกินผักอย่างน้อย 5 ทัพพีต่อวันอย่างไร</label>
        <div className='grid grid-cols-2'>
            <label htmlFor="">
                <input type="radio" name="eatVegetable" value="ไม่กินเลย" onChange={(e)=> onChange("eatVegetable", e.target.value)} />
                ไม่กินเลย
            </label>
            <label htmlFor="">
                <input type="radio" name="eatVegetable" value="กิน 1-3 วันต่อสัปดาห์" onChange={(e)=> onChange("eatVegetable", e.target.value)} />
                กิน 1-3 วันต่อสัปดาห์
            </label>
            <label htmlFor="">
                <input type="radio" name="eatVegetable" value="กิน 4-6 วันต่อสัปดาห์" onChange={(e)=> onChange("eatVegetable", e.target.value)} />
                กิน 4-6 วันต่อสัปดาห์
            </label>
            <label htmlFor="">
                <input type="radio" name="eatVegetable" value="กินทุกวัน" onChange={(e)=> onChange("eatVegetable", e.target.value)} />
                กินทุกวัน
            </label>
        </div>
      </div>
      <div className='flex flex-col'>
        <label htmlFor="">ท่านเติมเครื่องปรุงเค็มหรือไม่</label>
        <label><input type="radio" name='eatSour' value="ไม่เติมเครื่องปรุงรสเค็มเลย" onChange={(e)=> onChange("eatSour",e.target.value)}/>ไม่เติมเครื่องปรุงรสเค็มเลย</label>
        <label><input type="radio" name='eatSour'value="เติมเครื่องปนุงรสเค็มบางครั้ง" onChange={(e)=> onChange("eatSour",e.target.value)}/>เติมเครื่องปนุงรสเค็มบางครั้ง</label>
        <label><input type="radio" name='eatSour' value="เติมเครื่องปรุงรสเค็มทุกครั้ง" onChange={(e)=> onChange("eatSour",e.target.value)}/>เติมเครื่องปรุงรสเค็มทุกครั้ง</label>
      </div>
      <div>
        <label htmlFor="">ท่านดื่มเครื่องดื่มรสหวานหรือไม่</label>
        <div className='grid grid-cols-2'>
            <label htmlFor="">
                <input type="radio" name="eatSweetness" value="ไม่ดื่มเลย" onChange={(e)=> onChange("eatSweetness", e.target.value)} />
                ไม่กินเลย
            </label>
            <label htmlFor="">
                <input type="radio" name="eatSweetness" value="ดื่ม 1-3 วันต่อสัปดาห์" onChange={(e)=> onChange("eatSweetness", e.target.value)} />
                กิน 1-3 วันต่อสัปดาห์
            </label>
            <label htmlFor="">
                <input type="radio" name="eatSweetness" value="ดื่ม 4-6 วันต่อสัปดาห์" onChange={(e)=> onChange("eatSweetness", e.target.value)} />
                กิน 4-6 วันต่อสัปดาห์
            </label>
            <label htmlFor="">
                <input type="radio" name="eatSweetness" value="ดื่มทุกวัน" onChange={(e)=> onChange("eatSweetness", e.target.value)} />
                กินทุกวัน
            </label>
        </div>
      </div>
      <div className='flex flex-col'>
        <label htmlFor="">ท่านมีกิจกรรมทางกายหรือหรือเคลื่อไหวร่างกายจนรู้สึกเหนื่อยกว่าปกติทั้งในการทำงาน การเดินทาง หรือนันทนาการ (ออกกำลังกาย) หรือไม่อย่างไร</label>
        <label><input type="radio" name='activitiesTried' value="ไม่มีกิจกรรมเลย" onChange={(e)=> onChange("activitiesTried",e.target.value)}/>ไม่มีกิจกรรมเลย</label>
        <label><input type="radio" name='activitiesTried'value="มีกิจกรรมทางกาย จนรู้สึกเหนื่อยกว่าปกติน้อยกว่าสัปดาห์ละ 150 นาทีหรือน้อยกว่า 30 นาทีต่อวัน 5 วันต่อสัปดาห์" onChange={(e)=> onChange("activitiesTried",e.target.value)}/>มีกิจกรรมทางกาย จนรู้สึกเหนื่อยกว่าปกติน้อยกว่าสัปดาห์ละ 150 นาทีหรือน้อยกว่า 30 นาทีต่อวัน 5 วันต่อสัปดาห์</label>
        <label><input type="radio" name='activitiesTried' value="มีกิจกรรมทางกาย จรู้สึกเหนื่อยกว่าปกติมากกว่าหรือเท่ากับสัปดาห์ละ 150 นาทีหรือ 30 นาทีต่อวัน 5 วันต่อสัปดาห์" onChange={(e)=> onChange("activitiesTried",e.target.value)}/>มีกิจกรรมทางกาย จรู้สึกเหนื่อยกว่าปกติมากกว่าหรือเท่ากับสัปดาห์ละ 150 นาทีหรือ 30 นาทีต่อวัน 5 วันต่อสัปดาห์</label>
      </div>
      <div className='flex flex-col'>
        <label htmlFor="">ท่านนั่ง หรือเอนกายเฉยๆ ติดต่อกัันนานเกิน 2 ชั่วโมงหรือไม่อย่างไร</label>
        <label><input type="radio" name='workingLongtime' value="ไม่นั่งหรือไม่เอนกายเฉยๆ นานเกิน 2 ชั่วโมงทุกวัน" onChange={(e)=> onChange("workingLongtime",e.target.value)}/>ไม่นั่งหรือไม่เอนกายเฉยๆ นานเกิน 2 ชั่วโมงทุกวัน</label>
        <label><input type="radio" name='workingLongtime' value="นั่งหรือเอนกายเฉยๆ นานเกิน 2 ชั่วโมงบางวัน" onChange={(e)=> onChange("workingLongtime",e.target.value)}/>นั่งหรือเอนกายเฉยๆ นานเกิน 2 ชั่วโมงบางวัน</label>
      </div>
    </div>
  )
}
