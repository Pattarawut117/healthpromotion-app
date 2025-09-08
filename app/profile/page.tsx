import React from "react";
import UserPicture from "@/components/profile/UserPicture";
import { RightOutlined, InfoCircleOutlined } from "@ant-design/icons";

export default function ProfilePage() {
  return (
    <div className="flex flex-col items-center p-4 space-y-4">
      {/* Avatar + ชื่อ */}
      <div className="flex flex-col items-center">
        <UserPicture />
        <p className="font-bold text-lg mt-2"></p>
      </div>

      {/* ระดับผู้ใช้ */}
      <div className="flex items-center justify-between w-full border rounded-xl px-4 py-2 shadow-sm">
        <p className="font-medium">ผู้เริ่มต้น</p>
        <InfoCircleOutlined />
      </div>

      {/* น้ำหนัก */}
      <div className="w-full border rounded-xl px-4 py-3 shadow-sm">
        <p className="text-gray-500">น้ำหนัก (กก.)</p>
        <div className="flex justify-between items-center font-bold text-lg">
          <span>70</span>
          <RightOutlined />
        </div>
        <p className="text-sm text-gray-400">29/08/2025</p>
      </div>

      {/* ข้อมูลการออกกำลังกาย */}
      <div className="flex justify-between items-center w-full border rounded-xl px-4 py-3 shadow-sm">
        <p>ข้อมูลการออกกำลังกาย</p>
        
      </div>

      {/* BMI */}
      <div className="w-full border rounded-xl px-4 py-3 shadow-sm">
        <div className="flex justify-between items-center mb-1">
          <p className="font-medium">BMI</p>
          <InfoCircleOutlined />
        </div>
        <p className="font-bold text-lg">24.47</p>
        <p className="text-sm text-gray-500">น้ำหนักเกิน (Overweight)</p>
      </div>

      {/* BMR & TDEE */}
      <div className="w-full border rounded-xl px-4 py-3 shadow-sm space-y-3">
        <div className="flex justify-end">
        <InfoCircleOutlined />
        </div>

        <div>
          <div className="flex justify-between">
            <p>BMR (kcal)</p>
            <p className="font-medium">1601.5</p>
          </div>
          <p className="text-sm text-gray-400">
            อัตราการเผาผลาญพลังงานขั้นพื้นฐาน
          </p>
        </div>

        <div>
          <div className="flex justify-between">
            <p>TDEE (kcal)</p>
            <p className="font-medium">2482.3</p>
          </div>
          <p className="text-sm text-gray-400">
            พลังงานรวมที่ร่างกายใช้ไปในหนึ่งวัน
          </p>
        </div>
      </div>

      {/* เมนูโปรไฟล์ */}
      <div className="w-full border rounded-xl divide-y shadow-sm">
        {[
          "แก้ไขโปรไฟล์",
          "E-Bib ของฉัน",
          "แคมเปญของฉัน",
          "ประวัติการแลกของรางวัล",
          "ปรับเป้าหมาย",
          "นโยบายความเป็นส่วนตัว",
        ].map((item, idx) => (
          <div
            key={idx}
            className="flex justify-between items-center px-4 py-3 hover:bg-gray-50 cursor-pointer"
          >
            <div className="flex items-center gap-2">
            
              <span>{item}</span>
            </div>
            <RightOutlined />
          </div>
        ))}
      </div>
    </div>
  );
}