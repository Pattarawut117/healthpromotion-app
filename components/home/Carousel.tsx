import React from 'react'

export default function Carousel() {
  return (
    <div >
        <div className='flex flex-row'>
      <div className='flex flex-col items-center justify-center bg-white w-32 h-32 m-2 rounded-lg shadow-md'>
        <p>ออกกำลังกาย</p>
        <p className="text-orange-400">นาที</p> 
      </div>
      <div className='flex flex-col items-center justify-center bg-white w-32 h-32 m-2 rounded-lg shadow-md'>
        <p>การดื่มน้ำ</p>
        <p className="text-orange-400">มิลลิลิตร</p> 
      </div>
      </div>
      <div className='flex w-full justify-between items-center bg-white rounded-lg shadow-md px-2 py-2'>
        <p>เป้าหมายการออกกำลังกาย</p>
        <p className='text-orange-400'>300 นาที/วัน</p>
      </div>
    </div>
  )
}
