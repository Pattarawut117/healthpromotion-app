"use client";

import { Card } from "antd";
import React from "react";
import Image from "next/image";
import { RightOutlined } from "@ant-design/icons";

const campaignMenu = [
  {
    pictureUrl: "/targetForm/exercise.png",
    unit: "TUH",
    descMain: "Fit for Fun",
  },
  {
    pictureUrl: "/targetForm/exercise.png",
    unit: "FTECH",
    descMain: "Health Eating",
  },
];

export default function CampaignCard() {
  const { Meta } = Card;
  return (
    <div className="flex flex-col gap-4">
      {campaignMenu.map((item) => (
        <Card
          key={item.unit}
          hoverable
          cover={
            <Image
              alt="Campaign Picture"
              width={48}
              height={48}
              src={item.pictureUrl}
              className="p-4"
            />
          }
          className="shadow-md"
        >
          <Meta title={item.descMain} description={item.unit} />
          <div className="flex items-center justify-center gap-2 border bg-orange-400 text-white rounded-full px-4 py-1 mt-4 cursor-pointer">
            <p className="text-sm">เข้าร่วม</p>
            <RightOutlined />
          </div>
        </Card>
      ))}
    </div>
  );
}