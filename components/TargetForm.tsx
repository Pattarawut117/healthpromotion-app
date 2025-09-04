"use client";

import React from "react";
import Image from "next/image";
import { PlusCircleOutlined, MinusCircleOutlined } from "@ant-design/icons";
import { RegisterFormData } from "@/app/user/register/page"; // ✅ Import type ที่ถูกต้อง

// ✅ แก้ไข Props ให้ใช้ generic type แทน 'any'
type Props = {
  formData: RegisterFormData;
  onChange: <T>(field: keyof RegisterFormData, value: T) => void;
};

export default function TargetForm({ formData, onChange }: Props) {
  // ฟังก์ชันป้องกันไม่ให้ค่าติดลบ
  const decrease = (field: keyof RegisterFormData, value: number) => {
    onChange(field, Math.max(0, value - 5));
  };

  return (
    <div className="px-4 py-1 flex flex-col items-center">
      <div className="space-y-4 w-full max-w-md">
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
              onClick={() => decrease("exercise_target", formData.exercise_target)}
            />
            <span className="w-12 text-center">{formData.exercise_target}</span>
            <PlusCircleOutlined
              className="text-green-500 cursor-pointer hover:scale-110 transition-transform"
              onClick={() => onChange("exercise_target", formData.exercise_target + 5)}
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
              onClick={() => decrease("water_target", formData.water_target)}
            />
            <span className="w-12 text-center">{formData.water_target}</span>
            <PlusCircleOutlined
              className="text-blue-500 cursor-pointer hover:scale-110 transition-transform"
              onClick={() => onChange("water_target", formData.water_target + 5)}
            />
          </div>
        </div>
      </div>
    </div>
  );
}