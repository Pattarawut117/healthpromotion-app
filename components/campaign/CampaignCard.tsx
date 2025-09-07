'use client';

import React from 'react';
import Image from 'next/image';

const campaignMenu = [
  {
    pictureUrl: '/targetForm/exercise.png',
    unit: 'TUH',
    descMain: 'Fit for Fun',
  },
  {
    pictureUrl: '/targetForm/exercise.png',
    unit: 'FTECH',
    descMain: 'Health Eating',
  },
];

export default function CampaignCard() {
  return (
    <div className="grid grid-cols-2 gap-4">
      {campaignMenu.map((item) => (
        <div
          key={item.unit}
          className="bg-card text-card-foreground rounded-lg shadow-md overflow-hidden hover:shadow-xl transition-shadow duration-300 flex flex-col"
        >
          <div className="p-4 flex-grow">
            <Image
              alt="Campaign Picture"
              width={48}
              height={48}
              src={item.pictureUrl}
              className="mx-auto"
            />
          </div>
          <div className="p-4 text-center">
            <p className="font-semibold text-lg">{item.descMain}</p>
            <p className="text-muted-foreground text-sm">{item.unit}</p>
          </div>
          <div className="flex items-center justify-center gap-2 bg-primary text-primary-foreground rounded-full px-4 py-2 m-4 cursor-pointer hover:bg-primary/90 transition-colors duration-300">
            <p className="text-sm">Join</p>
            <svg
              className="w-4 h-4"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="2"
                d="M9 5l7 7-7 7"
              ></path>
            </svg>
          </div>
        </div>
      ))}
    </div>
  );
}