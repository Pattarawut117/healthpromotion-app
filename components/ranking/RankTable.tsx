import React from 'react';

const dataSource = [
  {
    key: '1',
    rank: 1,
    name: 'Mike',
    distance: '125916.6',
  },
  {
    key: '2',
    rank: 2,
    name: 'John',
    distance: '77318',
  },
];

const columns = [
  {
    title: 'อันดับ',
    dataIndex: 'rank',
    key: 'rank',
  },
  {
    title: 'ชื่อ',
    dataIndex: 'name',
    key: 'name',
  },
  {
    title: 'ระยะทาง (km)',
    dataIndex: 'distance',
    key: 'distance',
  },
];

export default function RankTable() {
  return (
    <div className="p-2">
      <div className="bg-card text-card-foreground shadow-md rounded-lg overflow-hidden bg-white">
        {/* Table Header */}
        <div className="grid grid-cols-3 bg-secondary text-secondary-foreground p-4 font-semibold">
          {columns.map((col) => (
            <div key={col.key} className="text-left">
              {col.title}
            </div>
          ))}
        </div>
        {/* Table Body */}
        <div>
          {dataSource.map((row, rowIndex) => (
            <div
              key={row.key}
              className={`grid grid-cols-3 p-4 items-center ${
                rowIndex % 2 === 0 ? 'bg-card' : 'bg-secondary'
              }`}>
              <div>{row.rank}</div>
              <div>{row.name}</div>
              <div>{row.distance}</div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}