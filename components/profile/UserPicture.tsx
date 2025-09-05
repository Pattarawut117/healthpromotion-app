"use client";

import { useState } from "react";
import liff from "@line/liff";
import Image from "next/image";
import { useLiff } from "@/contexts/LiffContext";

export default function UserPicture() {
  const {profile, isLoggedIn} = useLiff();

  if (!isLoggedIn) return <p>Loading...</p>


  return (
    <div className="flex flex-col justify-center items-center space-y-2">
      {profile?.pictureUrl ? (
        <>
          <Image
            src={profile.pictureUrl}
            alt="LINE Profile"
            width={128} // ✅ Use the actual width
            height={128} // ✅ Use the actual height
            className="w-32 h-32 rounded-full shadow-lg border-4 border-white"
          />
        </>
      ) : (
        <p className="text-gray-500">กำลังโหลดข้อมูลผู้ใช้...</p>
      )}
      <p className="text-lg font-bold">{profile?.displayName}</p>
    </div>
  );
}