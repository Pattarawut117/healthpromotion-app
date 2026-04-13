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
    <div className="min-h-screen bg-base-200 pb-10 text-base-content flex flex-col items-center">
      {/* Avatar & Header Section */}
      <div className="bg-base-100 flex flex-col items-center pt-8 pb-6 px-4 shadow-sm w-full">
        <UserPicture />
      </div>

      <div className="w-full px-4 space-y-4 mt-4 max-w-md mx-auto">

        {/* ข้อมูลทั่วไป (น้ำหนัก & วันเกิด) */}
        <div className="stats shadow w-full bg-base-100 rounded-2xl">
          <div className="stat">
            <div className="stat-figure text-primary/40 hidden sm:block">
              <RightOutlined />
            </div>
            <div className="stat-title text-base-content/70">น้ำหนักปัจจุบัน (กก.)</div>
            <div className="stat-value text-primary font-bold">{user?.weight ?? "-"}</div>
            <div className="stat-desc mt-1 text-base-content/60 font-medium">
              {user?.dob ? `วันเกิด: ${user.dob}` : "ไม่มีข้อมูลวันเกิด"}
            </div>
          </div>
        </div>

        {/* ข้อมูลสุขภาพ & การออกกำลังกาย */}
        <div className="flex justify-between items-center px-1 pt-2">
          <p className="font-bold text-base-content/80 text-sm">ข้อมูลสุขภาพ</p>
        </div>

        {/* BMI Stats */}
        <div className="stats shadow w-full bg-base-100 rounded-2xl">
          <div className="stat">
            <div className="stat-figure text-base-content/40 cursor-help" title="ข้อมูล BMI">
              <InfoCircleOutlined className="text-xl" />
            </div>
            <div className="stat-title text-base-content/70">ดัชนีมวลกาย (BMI)</div>
            {user?.weight && user?.height ? (
              <>
                <div className={`stat-value ${getBmiColor(user.weight / (user.height / 100) ** 2)}`}>
                  {(user.weight / (user.height / 100) ** 2).toFixed(2)}
                </div>
                <div className="stat-desc mt-1 font-medium text-base text-base-content/80">
                  อยู่ในเกณฑ์: {getBmiStatus(user.weight / (user.height / 100) ** 2)}
                </div>
              </>
            ) : (
              <div className="stat-value text-base-content/30">-</div>
            )}
          </div>
        </div>

        {/* พลังงาน BMR & TDEE (2 คอลัมน์) */}
        <div className="stats shadow w-full bg-base-100 rounded-2xl">
          <div className="stat px-3">
            <div className="stat-title max-w-full text-xs xs:text-sm text-base-content/70 flex justify-between">
              BMR <Link href="/landing/activity-kcal" className="text-primary"><InfoCircleOutlined /></Link>
            </div>
            <div className="text-xl sm:text-2xl font-bold mt-1">
              {user?.weight && user?.height ? calcBmr(user).toFixed(0) : "-"} <span className="text-xs font-normal">kcal</span>
            </div>
            <div className="stat-desc mt-1 text-[10px] sm:text-xs">เผาผลาญพื้นฐาน</div>
          </div>

          <div className="stat px-3 border-l border-base-200">
            <div className="stat-title max-w-full text-xs xs:text-sm text-base-content/70 flex justify-between">
              TDEE <Link href="/landing/activity-kcal" className="text-primary"><InfoCircleOutlined /></Link>
            </div>
            <div className="text-xl sm:text-2xl font-bold mt-1 text-secondary">
              {user?.weight && user?.height ? calcTdee(user).toFixed(0) : "-"} <span className="text-xs font-normal">kcal</span>
            </div>
            <div className="stat-desc mt-1 text-[10px] sm:text-xs text-secondary/80">พลังงานที่ใช้ต่อวัน</div>
          </div>
        </div>

        {/* Settings Menu */}
        <div className="mt-6 mb-4">
          <ul className="menu bg-base-100 w-full rounded-2xl shadow-sm text-base font-medium">
            <li>
              <Link href="/profile/edit" className="flex justify-between py-4">
                <span>จัดการโปรไฟล์</span>
                <RightOutlined className="opacity-50" />
              </Link>
            </li>
            <li>
              <Link href="/profile/privacy-policy" className="flex justify-between py-4">
                <span>นโยบายความเป็นส่วนตัว</span>
                <RightOutlined className="opacity-50" />
              </Link>
            </li>
          </ul>
        </div>

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

// ✅ โทนสีสำหรับค่า BMI
function getBmiColor(bmi: number): string {
  if (bmi < 18.5) return "text-info";
  if (bmi < 23) return "text-success";
  if (bmi < 25) return "text-warning";
  if (bmi < 30) return "text-error text-opacity-80";
  return "text-error";
}

// ✅ Helper ฟังก์ชันสำหรับคำนวณ BMR (ใช้ Mifflin-St Jeor)
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
