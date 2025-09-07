'use client';

import React from 'react';
import Image from 'next/image';
import { RegisterFormData } from '@/app/user/register/page';

type Props = {
  formData: RegisterFormData;
  onChange: <T>(field: keyof RegisterFormData, value: T) => void;
};

const MinusIcon = ({ className, onClick }: { className: string, onClick: () => void }) => (
  <svg onClick={onClick} className={className} fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 12H9m12 0a9 9 0 11-18 0 9 9 0 0118 0z"></path></svg>
);

const PlusIcon = ({ className, onClick }: { className: string, onClick: () => void }) => (
  <svg onClick={onClick} className={className} fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 9v3m0 0v3m0-3h3m-3 0H9m12 0a9 9 0 11-18 0 9 9 0 0118 0z"></path></svg>
);

export default function TargetForm({ formData, onChange }: Props) {
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
            <MinusIcon
              className="w-8 h-8 text-red-500 cursor-pointer hover:scale-110 transition-transform"
              onClick={() => decrease('exercise_target', formData.exercise_target)}
            />
            <span className="w-12 text-center">{formData.exercise_target}</span>
            <PlusIcon
              className="w-8 h-8 text-green-500 cursor-pointer hover:scale-110 transition-transform"
              onClick={() => onChange('exercise_target', formData.exercise_target + 5)}
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
            <MinusIcon
              className="w-8 h-8 text-red-500 cursor-pointer hover:scale-110 transition-transform"
              onClick={() => decrease('water_target', formData.water_target)}
            />
            <span className="w-12 text-center">{formData.water_target}</span>
            <PlusIcon
              className="w-8 h-8 text-blue-500 cursor-pointer hover:scale-110 transition-transform"
              onClick={() => onChange('water_target', formData.water_target + 5)}
            />
          </div>
        </div>
      </div>
    </div>
  );
}