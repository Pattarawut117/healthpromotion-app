'use client';

import React, { useEffect, useState } from 'react';
import { RightOutlined } from '@ant-design/icons';
import Link from 'next/link';
import axios from 'axios';

interface ICampaign {
  id: number;
  activity_name: string;
  activity_type: string;
  title: string;
  description: string;
  start_date: string;
  end_date: string;
  is_active: string;
  created_at: string;
}

export default function CampaignCard() {
  useEffect(() => {
    axios.get('/api/campaign')
      .then((response) => {
        setCampaigns(response.data);
      })
      .catch((error) => {
        console.error(error);
      });
  }, []);

  const [campaigns, setCampaigns] = useState<ICampaign[]>([]);
  return (
    <div>
      <div className="grid grid-cols-2 gap-4 mt-4">
        {campaigns.map((item) => (
          <div
            key={item.id}
            className="bg-card text-card-foreground rounded-lg shadow-md overflow-hidden hover:shadow-xl transition-shadow duration-300 flex flex-col"
          >
            <div className="flex-grow">
              <img
                alt={item.activity_name}
                width={200}
                height={200}
                src={item.title}
                className="mx-auto"
              />
            </div>
            <div className="p-2 text-center">
              <p className="font-semibold text-lg">{item.activity_name}</p>
              <p className="text-muted-foreground text-sm">{item.activity_type}</p>
            </div>
            <Link href={`/campaign/${item.id}`}>
              <div className="flex items-center justify-center gap-2 bg-orange-300 text-primary-foreground rounded-full px-4 py-2 m-4 cursor-pointer hover:bg-orange-400 transition-colors duration-300">
                <p className="text-sm">เข้าร่วม</p>
                <RightOutlined />
              </div>
            </Link>
          </div>
        ))}
      </div>
    </div>
  );
}