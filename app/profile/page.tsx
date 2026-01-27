"use client";

import React, { useEffect, useState } from "react";
import UserPicture from "@/components/profile/UserPicture";
import { RightOutlined, InfoCircleOutlined } from "@ant-design/icons";
import Link from "next/link";
import { useLiff } from "@/contexts/LiffContext";

type UserInfo = {
  user_id: string;
  sname?: string;
  lname?: string;
  tel?: string;
  dob?: string;
  gender?: string;
  height?: number;
  weight?: number;
  level_activity?: string;
  exercise_target?: number;
  water_target?: number;
};

export default function ProfilePage() {
  const { profile } = useLiff();
  const [user, setUser] = useState<UserInfo | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchUser = async () => {
      if (!profile?.userId) return;
      try {
        const res = await fetch(`/api/users?user_id=${profile.userId}`);
        const data = await res.json();
        if (res.ok) {
          setUser(data);
        } else {
          console.warn("User not found:", data.error);
        }
      } catch (err) {
        console.error("Fetch user error:", err);
      } finally {
        setLoading(false);
      }
    };
    fetchUser();
  }, [profile?.userId]);

  if (loading) {
    return <div className="p-4 text-center">Loading...</div>;
  }

  return (
    <div className="text-black flex flex-col items-center p-4 space-y-4">
      {/* Avatar + ชื่อ */}
      <div className="flex flex-col items-center">
        <UserPicture />
      </div>

      {/* ระดับผู้ใช้ */}
      <div className="flex items-center justify-between w-full border rounded-xl px-4 py-2 shadow-sm">
        <p className="font-medium">ผู้เริ่มต้น</p>
        <Link href="/landing/level">
          <InfoCircleOutlined />
        </Link>
      </div>

      {/* น้ำหนัก */}
      <div className="w-full border rounded-xl px-4 py-3 shadow-sm">
        <p className="text-gray-500">น้ำหนัก (กก.)</p>
        <div className="flex justify-between items-center font-bold text-lg">
          <span>{user?.weight ?? "-"}</span>
          <RightOutlined />
        </div>
        <p className="text-sm text-gray-400">
          {user?.dob ? `วันเกิด: ${user.dob}` : "ไม่มีข้อมูลวันเกิด"}
        </p>
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
        <p className="font-bold text-lg">
          {user?.weight && user?.height
            ? (user.weight / (user.height / 100) ** 2).toFixed(2)
            : "-"}
        </p>
        <p className="text-sm text-gray-500">
          {user?.weight && user?.height
            ? getBmiStatus(user.weight / (user.height / 100) ** 2)
            : "ไม่มีข้อมูล"}
        </p>
      </div>

      {/* BMR & TDEE */}
      <div className="w-full border rounded-xl px-4 py-3 shadow-sm space-y-3">
        <div className="flex justify-end">
          <Link href="/landing/activity-kcal">
            <InfoCircleOutlined />
          </Link>
        </div>

        <div>
          <div className="flex justify-between">
            <p>BMR (kcal)</p>
            <p className="font-medium">
              {user?.weight && user?.height ? calcBmr(user).toFixed(1) : "-"}
            </p>
          </div>
          <p className="text-sm text-gray-400">
            อัตราการเผาผลาญพลังงานขั้นพื้นฐาน
          </p>
        </div>

        <div>
          <div className="flex justify-between">
            <p>TDEE (kcal)</p>
            <p className="font-medium">
              {user?.weight && user?.height ? calcTdee(user).toFixed(1) : "-"}
            </p>
          </div>
          <p className="text-sm text-gray-400">
            พลังงานรวมที่ร่างกายใช้ไปในหนึ่งวัน
          </p>
        </div>
      </div>

      {/* เมนูโปรไฟล์ */}
      <div className="w-full border rounded-xl divide-y shadow-sm">
        {[
          { label: "แก้ไขโปรไฟล์", path: "/profile/edit" },
          { label: "นโยบายความเป็นส่วนตัว", path: "/profile/privacy-policy" },
        ].map((item, idx) => (
          <Link
            key={idx}
            href={item.path}
            className="flex justify-between items-center px-4 py-3 hover:bg-gray-50 cursor-pointer"
          >
            <div className="flex items-center gap-2">
              <span>{item.label}</span>
            </div>
            <RightOutlined />
          </Link>
        ))}
      </div>
    </div>
  );
}

// ✅ Helper ฟังก์ชันสำหรับคำนวณ BMI
function getBmiStatus(bmi: number): string {
  if (bmi < 18.5) return "น้ำหนักน้อยเกินไป";
  if (bmi < 23) return "น้ำหนักปกติ";
  if (bmi < 25) return "ท้วม (Overweight)";
  if (bmi < 30) return "อ้วน";
  return "อ้วนมาก";
}

// ✅ Helper ฟังก์ชันสำหรับคำนวณ BMR (ใช้ Mifflin-St Jeor)
// หมายเหตุ: เพศยังไม่ถูกแยก ถ้ามี gender ค่อยเพิ่มสูตรชาย/หญิง
function calcBmr(user: UserInfo): number {
  const weight = user.weight ?? 0;
  const height = user.height ?? 0;
  const age = user.dob
    ? new Date().getFullYear() - new Date(user.dob).getFullYear()
    : 30;
  return 10 * weight + 6.25 * height - 5 * age + 5; // male default
}

function calcTdee(user: UserInfo): number {
  const activityLevels: Record<string, number> = {
    low: 1.2,
    moderate: 1.55,
    high: 1.725,
  };
  const factor = activityLevels[user.level_activity ?? "moderate"] ?? 1.55;
  return calcBmr(user) * factor;
}
