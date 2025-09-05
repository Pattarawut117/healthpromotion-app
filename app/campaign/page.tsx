"use client";

import React, { useState } from "react";
import { Segmented } from "antd";
import CampaignCard from "@/components/campaign/CampaignCard";

type Align = "ปัจจุบัน" | "กำลังมาถึง" | "ผ่านไปแล้ว";

export default function CampaignPage() {
  const [alignValue, setAlignValue] = useState<Align>("ปัจจุบัน");

  return (
    <div className="flex flex-col p-2 justify-center">
      <div className="flex justify-between px-2 py-2 items-center">
        <p className="text-xl font-bold font-sans">แคมเปญ</p>
        <select className="flex px-2 py-2 rounded bg-white">
          <option value="ทั้งหมด">ทั้งหมด</option>
          <option value="องค์กร">องค์กร</option>
          <option value="บุคคทั่วไป">บุคคทั่วไป</option>
          <option value="แคมเปญพิเศษ">แคมเปญพิเศษ</option>
        </select>
      </div>
      <div>
        <Segmented
          value={alignValue}
          style={{ marginBottom: 8 }}
          onChange={(value) => setAlignValue(value as Align)}
          options={["ปัจจุบัน", "กำลังมาถึง", "ผ่านไปแล้ว"]}
        />
      </div>
      <div>
        <CampaignCard />
      </div>
    </div>
  );
}