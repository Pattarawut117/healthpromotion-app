'use client';

import React, { useState } from 'react';

const users = [
  {
    value: 'user1',
    label: (
      <div className="w-8 h-8 rounded-full bg-green-500 flex items-center justify-center">
        <svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"></path></svg>
      </div>
    ),
  },
  {
    value: 'user2',
    label: (
      <div className="w-8 h-8 rounded-full bg-green-500 flex items-center justify-center">
        <svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"></path></svg>
      </div>
    ),
  },
  {
    value: 'user3',
    label: (
      <div className="w-8 h-8 rounded-full bg-green-500 flex items-center justify-center">
        <svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"></path></svg>
      </div>
    ),
  },
  {
    value: 'user4',
    label: (
      <div className="w-8 h-8 rounded-full bg-green-500 flex items-center justify-center">
        <svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"></path></svg>
      </div>
    ),
  },
  {
    value: 'user5',
    label: (
      <div className="w-8 h-8 rounded-full bg-green-500 flex items-center justify-center">
        <svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"></path></svg>
      </div>
    ),
  },
];

export default function ReviewPage() {
  const [selectedValue, setSelectedValue] = useState('user1');

  return (
    <div className="flex flex-col p-2 justify-center text-black">
      <div className="flex justify-between px-2 py-2 items-center">
        <p className="text-xl font-bold font-sans">คำแนะนำ</p>
        <select className="flex px-2 py-2 rounded bg-white">
          <option value="กิจกรรมทั้งหมด">กิจกรรมทั้งหมด</option>
          <option value="กิจกรรมแคมเปญ">กิจกรรมแคมเปญ</option>
        </select>
      </div>
      <div className="flex justify-around">
        <div className="flex items-end gap-2">
          <div className="flex bg-gray-200 rounded-lg p-1">
            {users.map((user) => (
              <button
                key={user.value}
                onClick={() => setSelectedValue(user.value)}
                className={`p-2 rounded-lg transition-colors duration-300 ${selectedValue === user.value
                  ? 'bg-white shadow'
                  : 'bg-transparent'
                  }`}>
                {user.label}
              </button>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}