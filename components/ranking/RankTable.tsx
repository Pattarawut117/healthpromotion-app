import React from 'react'
import { Table } from 'antd';

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
    <div className='p-2'>
      <Table dataSource={dataSource} columns={columns} />
    </div>
  )
}