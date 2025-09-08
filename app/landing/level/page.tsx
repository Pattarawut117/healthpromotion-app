'use client';

import React, { useState } from 'react';
import { ArrowLeftOutlined } from '@ant-design/icons';
import Link from 'next/link';

type TabPosition = 'history' | 'rule';

export default function HistoryCoin() {
  const [detail, setDetail] = useState<TabPosition>('history');

  return (
    <div className='p-4'>
      <Link href="/profile">
      <div className='flex gap-4 mb-6'>
        <ArrowLeftOutlined/> <p>การทำกิจกรรม</p>
      </div>
      </Link>
      <div className=' flex flex-col'>
      <div className="flex justify-center">
        <div className="flex bg-gray-200 rounded-lg p-1">
          <button
            onClick={() => setDetail('history')}
            className={`px-4 py-2 text-sm font-medium rounded-lg transition-colors duration-300 ${
              detail === 'history'
                ? 'bg-white text-blue-500 shadow'
                : 'bg-transparent text-gray-600'
            }`}>
            ประวัติการรับเหรียญ
          </button>
          <button
            onClick={() => setDetail('rule')}
            className={`px-4 py-2 text-sm font-medium rounded-lg transition-colors duration-300 ${
              detail === 'rule'
                ? 'bg-white text-blue-500 shadow'
                : 'bg-transparent text-gray-600'
            }`}>
            กติกาการรับเหรียญ
          </button>
        </div>
      </div>

      <div className="mt-4 rounded-2xl bg-white shadow-xl">
        {detail === 'history' && (
          <div className="p-4 text-center">
            <h2 className="text-lg font-bold">ยังไม่มีข้อมูล</h2>
          </div>
        )}
        {detail === 'rule' && (
          <div className="p-4 mt-2">
            <h2 className="text-lg font-bold mb-4">เงื่อนไขการรับเหรียญ</h2>
            <div className="space-y-4">
              <div>
                <p className="font-semibold">1. การบันทึกการออกกำลังกาย</p>
                <ul className='list-disc pl-10 space-y-1 mt-1'>
                  <li>คุณจะได้รับ Health Coin จำนวน 2 เหรียญทุกครั้ง</li>
                  <li>
                    คุณสามารถบันทึกการเดินได้วันละ 1 ครั้ง การวิ่ง 2 ครั้ง
                    และประเภทอื่นๆ อย่างละ 1 ครั้งต่อวัน
                  </li>
                </ul>
              </div>
              <div>
                <p className="font-semibold">2. การบันทึกการดื่มน้ำ</p>
                <ul className="list-disc pl-10 space-y-1 mt-1">
                  <li>คุณจะได้รับ Health Coin จำนวน 1 เหรียญทุกครั้ง</li>
                  <li>คุณสามารถบันทึกการดื่มน้ำได้ 3 ครั้งต่อวัน</li>
                </ul>
              </div>
              <div>
                <p className="font-semibold">3. การบันทึกการกินผักผลไม้</p>
                <ul className="list-disc pl-10 space-y-1 mt-1">
                  <li>คุณจะได้รับ Health Coin จำนวน 1 เหรียญทุกครั้ง</li>
                  <li>คุณสามารถบันทึกการกินผักผลไม้ได้ 3 ครั้งต่อวัน</li>
                </ul>
              </div>
              <div>
                <p className="font-semibold">4. การบันทึกมื้ออาหารจานสุขภาพ 2:1:1</p>
                <ul className="list-disc pl-10 space-y-1 mt-1">
                  <li>คุณจะได้รับ Health Coin จำนวน 1 เหรียญทุกครั้ง</li>
                  <li>คุณสามารถบันทึกมื้ออาหารจานสุขภาพ 3 ครั้ง (3 มื้อ) ต่อวัน</li>
                </ul>
              </div>
            </div>
            <div className="mt-6">
              <h2 className="text-lg font-bold">รายละเอียดเลเวล</h2>
              <div className="mt-2">
                {/* Level details can be added here */}
                <p className="text-gray-500">ยังไม่มีข้อมูลเลเวล</p>
              </div>
            </div>
          </div>
        )}
      </div>
      </div>
    </div>
  );
}