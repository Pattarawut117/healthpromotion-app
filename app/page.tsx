"use client"

import { useLiff } from "@/contexts/LiffContext";
import Carousel from "@/components/home/Carousel";
import RankDisplay from "@/components/home/RankDisplay";
import ProgressBar from "@/components/home/ProgressBar";
import FloatingActionButton from "@/components/home/FloatingActionButton";

export default function Home() {
  const { isLoggedIn } = useLiff();

  if (!isLoggedIn) return <p className="text-center p-4">Loading...</p>;
  
  return (
    <div className="flex flex-col gap-6 p-6 bg-gray-50 min-h-full">
      {/* Header Card */}
      <div className="w-full flex flex-col items-center bg-white text-gray-800 rounded-xl shadow-md p-6">
        <p className="font-bold text-lg">🏦 Piggy Bank</p>
        <div className="grid grid-cols-3 divide-x w-full bg-gray-100 px-4 py-3 rounded-lg mt-4">
          <div className="text-center font-semibold text-blue-500">1</div>
          <div className="text-center font-semibold text-green-500">2</div>
          <div className="text-center font-semibold text-purple-500">3</div>
        </div>
      </div>

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

      <FloatingActionButton />
    </div>
  );
}
