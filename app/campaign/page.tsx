import React from 'react';
import CampaignCard from '@/components/campaign/CampaignCard';

export default function CampaignPage() {

  return (
    <div className="flex flex-col p-4 gap-4">
      <div className="flex justify-between items-center">
        <p className="text-lg font-bold">แคมเปญ</p>
      </div>
      <div>
        <CampaignCard />
      </div>
    </div>
  );
}