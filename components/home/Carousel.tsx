import React from 'react';

export default function Carousel() {
  return (
    <div className="flex flex-col gap-4">
      <div className="flex flex-row gap-4">
        <div className="flex flex-col items-center justify-center bg-card text-card-foreground w-32 h-32 rounded-lg shadow-md bg-white">
          <p>ออกกำลังกาย</p>
          <p className="text-sm">นาที</p>
        </div>
        <div className="flex flex-col items-center justify-center bg-card text-card-foreground w-32 h-32 rounded-lg shadow-md bg-white">
          <p>การดื่มน้ำ</p>
          <p className="text-sm">มิลลิลิตร</p>
        </div>
      </div>
      <div className="flex w-full justify-between items-center bg-card text-card-foreground rounded-lg shadow-md px-4 py-2 bg-white">
        <p className="text-sm">เป้าหมายการออกกำลังกาย</p>
        <p className="text-primary">300 นาที/วัน</p>
      </div>
    </div>
  );
}
