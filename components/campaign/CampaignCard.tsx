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
      <div className="grid grid-cols-2 gap-3 mt-4 text-base-content">
        {campaigns.map((item) => (
          <div
            key={item.id}
            className="card bg-base-100 shadow-xl card-compact hover:shadow-2xl transition-all duration-300 w-full"
          >
            <figure className="w-full bg-slate-50 relative aspect-video overflow-hidden">
              <img
                alt={item.activity_name}
                src={item.title}
                className="object-cover w-full h-full"
              />
            </figure>
            <div className="card-body p-3">
              <h2 className="card-title text-sm line-clamp-2 leading-snug">
                {item.activity_name}
              </h2>
              <div className="mt-1">
                <div className="badge badge-primary badge-outline text-[10px] sm:text-xs">
                  {item.activity_type}
                </div>
              </div>
              <div className="card-actions justify-end mt-2">
                <Link href={`/campaign/${item.id}`} className="w-full">
                  <button className="btn btn-sm sm:btn-md bg-orange-300 hover:bg-orange-400 border-none text-black rounded-full w-full text-xs">
                    เข้าร่วม <RightOutlined className="text-[10px] sm:text-xs" />
                  </button>
                </Link>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}