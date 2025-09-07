'use client';

import React, { useState } from 'react';
import RankTable from '@/components/ranking/RankTable';
import Image from 'next/image';

const users = [
  {
    value: 'user1',
    label: (
      <Image
        src="https://api.dicebear.com/7.x/miniavs/svg?seed=8"
        alt="user1"
        className="w-8 h-8 rounded-full"
        width={32}
        height={32}
      />
    ),
  },
  {
    value: 'user2',
    label: (
      <div className="w-8 h-8 rounded-full bg-orange-500 flex items-center justify-center text-white font-bold">
        K
      </div>
    ),
  },
  {
    value: 'user3',
    label: (
      <div className="w-8 h-8 rounded-full bg-green-500 flex items-center justify-center">
        <svg
          className="w-5 h-5 text-white"
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
          xmlns="http://www.w3.org/2000/svg"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth="2"
            d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"
          ></path>
        </svg>
      </div>
    ),
  },
];

export default function RankingPage() {
  const [selectedValue, setSelectedValue] = useState('user1');

  return (
    <div className="p-4 flex flex-col gap-4">
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-bold">Ranking</h1>
        <div className="flex items-center gap-2 bg-secondary rounded-lg p-1">
          {users.map((user) => (
            <button
              key={user.value}
              onClick={() => setSelectedValue(user.value)}
              className={`p-2 rounded-lg transition-colors duration-300 ${
                selectedValue === user.value ? 'bg-card shadow' : 'bg-transparent'
              }`}>
              {user.label}
            </button>
          ))}
        </div>
      </div>
      <RankTable />
    </div>
  );
}