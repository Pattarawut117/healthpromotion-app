"use client"

import { useLiff } from "@/contexts/LiffContext";
import FloatingActionButton from "@/components/home/FloatingActionButton";
import UserPicture from "@/components/profile/UserPicture";

export default function Home() {
  const { isLoggedIn } = useLiff();

  if (!isLoggedIn) return <p className="text-center p-4">Loading...</p>;

  return (
    <div className="flex flex-col gap-4 bg-gray-50 min-h-screen">
      <div className="flex flex-col gap-2 p-6 bg-gray-50 min-h-full">
        {/* Section Title */}
        <div className="flex justify-center items-center gap-2">
          <UserPicture />
        </div>
        <p className="bg-white text-gray-500 p-6 shadow-md rounded-xl text-gray-700">ข่าวสาร</p>

        {/* No Data Box */}
        <div className="bg-white text-gray-500 w-full p-6 shadow-md rounded-xl">
          <img src="/poster/mentalCampaign.png" alt="mentalCampaign" />

        </div>
      </div>
    </div>
  );
}
