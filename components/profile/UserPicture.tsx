"use client";

import { useEffect, useState } from "react";
import Image from "next/image";
import { useLiff } from "@/contexts/LiffContext";

type UserData = {
  sname: string;
  lname: string;
};

export default function UserPicture() {
  const { profile, isLoggedIn } = useLiff();
  const [userData, setUserData] = useState<UserData | null>(null);

  useEffect(() => {
    const fetchUser = async () => {
      if (profile?.userId) {
        try {
          const res = await fetch("/api/users?user_id=" + profile.userId);
          const data = await res.json();

          if (res.ok && data) {
            setUserData({
              sname: data.sname,
              lname: data.lname,
            });
          }
        } catch (error) {
          console.error("Error fetching user:", error);
        }
      }
    };
    fetchUser();
  }, [profile?.userId]);

  if (!isLoggedIn) return <p>Loading...</p>;

  return (
    <div className="flex flex-col justify-center items-center space-y-2">
      {profile?.pictureUrl ? (
        <Image
          src={profile.pictureUrl}
          alt="LINE Profile"
          width={128}
          height={128}
          className="w-32 h-32 rounded-full shadow-lg border-4 border-white"
        />
      ) : (
        <p className="text-gray-500">กำลังโหลดรูปโปรไฟล์...</p>
      )}

      <p className="text-lg font-bold">
        {userData ? `${userData.sname} ${userData.lname}` : profile?.displayName}
      </p>
    </div>
  );
}