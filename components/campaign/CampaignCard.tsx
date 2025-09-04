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
    <div>
      {campaignMenu.map((item) => (
        <div className="grid grid-cols-1">
          <Card
            hoverable
            cover={
              <Image
                alt="Campaign Picture"
                width={48}
                height={48}
                src={item.pictureUrl}
              />
            }
          >
            <Meta title={item.descMain} description={item.unit} />
            <div className="flex border bg-orange-400 px-2 py-1 mt-2">
              <p>เข้าร่วม</p>
              <RightOutlined/>
            </div>
          </Card>
        </div>
      ))}
    </div>
  );
}
