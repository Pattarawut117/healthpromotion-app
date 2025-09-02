"use client";

import React, { useState } from "react";
import Image from "next/image";
import { PlusCircleOutlined, MinusCircleOutlined } from "@ant-design/icons";

export default function TargetForm() {
  const [excerciseCount, setExerciseCount] = useState<number>(0);
  const [waterCount, setWaterCount] = useState<number>(0);
  const [foodCount, setFoodCount] = useState<number>(0);

  // ฟังก์ชันป้องกันไม่ให้ค่าติดลบ
  const decrease = (value: number, setter: React.Dispatch<React.SetStateAction<number>>) => {
    setter(Math.max(0, value - 5));
  };

  return (
    <div className="space-y-4">
      {/* Exercise */}
      <div className="flex flex-col items-center border rounded-2xl p-4 shadow-sm bg-white">
        <p className="mb-2 text-lg font-semibold text-gray-700">
          เป้าหมายการออกกำลังกาย (นาที)
        </p>
        <Image
          src="/targetForm/exercise.png"
          width={400}
          height={400}
          alt="Exercise"
          className="mb-2"
        />
        <div className="flex items-center gap-4 text-xl font-bold">
          <MinusCircleOutlined
            className="text-red-500 cursor-pointer hover:scale-110 transition-transform"
            onClick={() => decrease(excerciseCount, setExerciseCount)}
          />
          <span className="w-12 text-center">{excerciseCount}</span>
          <PlusCircleOutlined
            className="text-green-500 cursor-pointer hover:scale-110 transition-transform"
            onClick={() => setExerciseCount(excerciseCount + 5)}
          />
        </div>
      </div>

      {/* Water */}
      <div className="flex flex-col items-center border rounded-2xl p-4 shadow-sm bg-white">
        <p className="mb-2 text-lg font-semibold text-gray-700">
          เป้าหมายการดื่มน้ำ (มิลลิลิตร)
        </p>
        <Image
          src="/targetForm/exercise.png"
          width={400}
          height={400}
          alt="Water"
          className="mb-2"
        />
        <div className="flex items-center gap-4 text-xl font-bold">
          <MinusCircleOutlined
            className="text-red-500 cursor-pointer hover:scale-110 transition-transform"
            onClick={() => decrease(waterCount, setWaterCount)}
          />
          <span className="w-12 text-center">{waterCount}</span>
          <PlusCircleOutlined
            className="text-blue-500 cursor-pointer hover:scale-110 transition-transform"
            onClick={() => setWaterCount(waterCount + 5)}
          />
        </div>
      </div>

      {/* Food */}
      <div className="flex flex-col items-center border rounded-2xl p-4 shadow-sm bg-white">
        <p className="mb-2 text-lg font-semibold text-gray-700">
          เป้าหมายการกินอาหาร 2:1:1
        </p>
        <Image
          src="/targetForm/exercise.png"
          width={400}
          height={400}
          alt="Food"
          className="mb-2"
        />
        <div className="flex items-center gap-4 text-xl font-bold">
          <MinusCircleOutlined
            className="text-red-500 cursor-pointer hover:scale-110 transition-transform"
            onClick={() => decrease(foodCount, setFoodCount)}
          />
          <span className="w-12 text-center">{foodCount}</span>
          <PlusCircleOutlined
            className="text-green-500 cursor-pointer hover:scale-110 transition-transform"
            onClick={() => setFoodCount(foodCount + 5)}
          />
        </div>
      </div>
    </div>
  );
}