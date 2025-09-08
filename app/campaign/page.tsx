'use client';

import React, { useState } from 'react';
import CampaignCard from '@/components/campaign/CampaignCard';

type Align = 'Current' | 'Upcoming' | 'Past';

const options: Align[] = ['Current', 'Upcoming', 'Past'];

export default function CampaignPage() {
  const [alignValue, setAlignValue] = useState<Align>('Current');

  return (
    <div className="flex flex-col p-4 gap-4">
      <div className="flex justify-between items-center">
        <p className="text-lg font-bold">แคมเปญ</p>
        <select className="px-2 py-2 rounded-md bg-card text-card-foreground border">
          <option value="all">ทั้งหมด</option>
          <option value="organization">องค์กร</option>
          <option value="general">บุคคลทั่วไป</option>
          <option value="special">แคมเปญพิเศษ</option>
        </select>
      </div>
      <div className="w-full mb-1">
        <div className="flex bg-secondary rounded-lg p-1">
          {options.map((option) => (
            <button
              key={option}
              onClick={() => setAlignValue(option)}
              className={`w-full text-center py-2 rounded-lg transition-colors duration-300 ${
                alignValue === option
                  ? 'bg-white text-primary-foreground shadow'
                  : 'text-muted-foreground'
              }`}>
              {option}
            </button>
          ))}
        </div>
      </div>
      <div>
        <CampaignCard />
      </div>
    </div>
  );
}