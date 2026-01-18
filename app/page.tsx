"use client"

import { useLiff } from "@/contexts/LiffContext";
import Carousel from "@/components/home/Carousel";
import FloatingActionButton from "@/components/home/FloatingActionButton";
import Bingo from "@/components/campaign/bingoBoard/Bingo";

export default function Home() {
  const { isLoggedIn } = useLiff();

  if (!isLoggedIn) return <p className="text-center p-4">Loading...</p>;

  return (
    <div className="flex flex-col gap-4 bg-gray-50 min-h-screen">
      <div className="flex flex-col gap-6 p-6 bg-gray-50 min-h-full">
        {/* Section Title */}
        <p className="font-bold text-lg text-gray-700">กิจกรรมสุขภาพของวันนี้</p>

        {/* Carousel */}
        <div>
          <Carousel />
        </div>

        {/* No Data Box */}
        <div className="bg-white text-gray-500 w-full h-56 p-6 shadow-md rounded-xl flex justify-center items-center border border-dashed">
          <p className="italic">No data available&apos;s</p>

        </div>

        {/* Floating Action Button */}
        <FloatingActionButton />

        {/* Bingo */}
        <Bingo />
      </div>
    </div>
  );
}
