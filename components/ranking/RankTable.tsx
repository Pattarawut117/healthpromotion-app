import React from 'react';
import { IRanking } from '@/app/ranking/page';

export default function RankTable({ ranking, unit = 'คะแนน' }: { ranking: IRanking[], unit?: string }) {
  return (
    <div className="p-2">
      <div className="bg-card text-card-foreground shadow-md rounded-lg overflow-hidden bg-white">
        {/* Table Header */}
        <div className="grid grid-cols-3 bg-gray-300 text-gray-800 p-4 font-semibold">
          <div className="text-left">อันดับ</div>
          <div className="text-left">ชื่อ</div>
          <div className="text-left">{unit}</div>
        </div>
        {/* Table Body */}
        <div>
          {ranking.map((row: IRanking, index: number) => (
            <div
              key={index}
              className="grid grid-cols-3 p-4 items-center text-black border-b last:border-b-0">
              <div>{index + 1}</div>
              <div className="font-medium">{row.sname || row.user_info?.sname || '-'}</div>
              <div className="font-bold text-lg">{row.value ?? 0}</div>
            </div>
          ))}
          {ranking.length === 0 && (
            <div className="p-4 text-center text-gray-500">ไม่พบข้อมูล</div>
          )}
        </div>
      </div>
    </div>
  );
}