import React from 'react';
import { IRanking } from '@/app/ranking/page';

const columns = [
  {
    title: 'อันดับ',
    dataIndex: 'rank',
    key: 'rank',
  },
  {
    title: 'ชื่อ',
    dataIndex: 'user_info',
    key: 'name',
  },
  {
    title: 'ระยะทาง (km)',
    dataIndex: 'value',
    key: 'distance',
  },
];

export default function RankTable({ ranking }: { ranking: IRanking[] }) {
  return (
    <div className="p-2">
      <div className="bg-card text-card-foreground shadow-md rounded-lg overflow-hidden bg-white">
        {/* Table Header */}
        <div className="grid grid-cols-3 bg-gray-300 text-gray-800 p-4 font-semibold">
          {columns.map((col) => (
            <div key={col.key} className="text-left">
              {col.title}
            </div>
          ))}
        </div>
        {/* Table Body */}
        <div>
          {ranking.map((row: IRanking, index: number) => (
            <div
              key={index}
              className="grid grid-cols-3 p-4 items-center">
              <div>{index + 1}</div>
              <div>{row.user_info.sname}</div>
              <div>{row.value}</div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}