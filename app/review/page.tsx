'use client';

import Image from 'next/image';
import React, { useState } from 'react';

type CampaignType = 'fitness' | 'food' | 'mental' | 'run';

interface UserOption {
  value: CampaignType;
  label: React.ReactNode;
}

interface Campaign {
  id: number;
  image: string;
}

const users: UserOption[] = [
  {
    value: 'fitness',
    label: (
      <div className="w-8 h-8 rounded-full bg-green-500 flex items-center justify-center">
        <Image src="/review/heart-rate.png" alt="heart-rate" width={24} height={24} />
      </div>
    ),
  },
  {
    value: 'food',
    label: (
      <div className="w-8 h-8 rounded-full bg-green-500 flex items-center justify-center">
        <Image src="/review/diet.png" alt="diet" width={24} height={24} />
      </div>
    ),
  },
  {
    value: 'mental',
    label: (
      <div className="w-8 h-8 rounded-full bg-green-500 flex items-center justify-center">
        <svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"></path></svg>
      </div>
    ),
  },
  {
    value: 'run',
    label: (
      <div className="w-8 h-8 rounded-full bg-green-500 flex items-center justify-center">
        <svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"></path></svg>
      </div>
    ),
  },
];

const campaignData: Record<CampaignType, Campaign[]> = {
  fitness: [{ id: 1, image: "/poster/fitness1.jpg" }, { id: 2, image: "/poster/fitness2.png" }, { id: 3, image: "/poster/fitness3.png" }],
  food: [{ id: 1, image: "/poster/food1.jpg" }, { id: 2, image: "/poster/food2.jpg" }, { id: 3, image: "/poster/food3.jpg" }, { id: 4, image: "/poster/food4.jpg" }],
  mental: [{ id: 1, image: "/poster/mental1.jpg" }],
  run: []
}

export default function ReviewPage() {
  const [selectedValue, setSelectedValue] = useState<CampaignType>('fitness');

  return (
    <div className="flex flex-col p-2 justify-center text-black">
      <div className="flex justify-between px-2 py-2 items-center">
        <p className="text-xl font-bold font-sans">คำแนะนำ</p>
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

      <div className="flex flex-col gap-2 mt-2">
        {campaignData[selectedValue].map((campaign) => (
          <div key={campaign.id} className="w-full h-full bg-gray-200 rounded-lg flex justify-center items-center">
            <Image src={campaign.image} alt={campaign.id.toString()} width={256} height={256} />
          </div>
        ))}
      </div>
    </div>
  );
}