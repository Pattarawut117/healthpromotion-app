"use client";

import { useLiff } from "@/contexts/LiffContext";
import Carousel from "@/components/home/Carousel";
import { useState } from "react";

export default function Home() {
  const { isLoggedIn } = useLiff();
  const [isMenuOpen, setIsMenuOpen] = useState(false);

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
      <p className="font-bold text-lg text-gray-700">
        กิจกรรมสุขภาพของวันนี้
      </p>

      {/* Carousel */}
      <div>
        <Carousel />
      </div>

      {/* No Data Box */}
      <div className="bg-white text-gray-500 w-full h-56 p-6 shadow-md rounded-xl flex justify-center items-center border border-dashed">
        <p className="italic">No data available&apos;s</p>
      </div>

      {/* Floating Action Button */}
      <div className="fixed bottom-24 right-6">
        {isMenuOpen && (
          <div className="flex flex-col items-end gap-4 mb-4 transition-all">
            {/* Record Exercise */}
            <div className="flex items-center gap-2 animate-slideInRight">
              <p className="bg-white text-gray-800 px-3 py-2 rounded-lg shadow-md text-sm">
                บันทึกการออกกำลังกาย
              </p>
              <button className="bg-gradient-to-r from-pink-500 to-red-500 hover:scale-110 transition transform text-white w-12 h-12 rounded-full shadow-lg flex items-center justify-center">
                💪
              </button>
            </div>

            {/* Record Water */}
            <div className="flex items-center gap-2 animate-slideInRight delay-100">
              <p className="bg-white text-gray-800 px-3 py-2 rounded-lg shadow-md text-sm">
                บันทึกการดื่มน้ำ
              </p>
              <button className="bg-gradient-to-r from-blue-400 to-blue-600 hover:scale-110 transition transform text-white w-12 h-12 rounded-full shadow-lg flex items-center justify-center">
                💧
              </button>
            </div>
          </div>
        )}

        {/* Main FAB */}
        <button
          onClick={() => setIsMenuOpen(!isMenuOpen)}
          className="bg-green-500 hover:bg-green-600 text-white w-16 h-16 rounded-full shadow-lg flex items-center justify-center text-3xl transition-transform hover:rotate-90"
        >
          {isMenuOpen ? "×" : "+"}
        </button>
      </div>
    </div>
  );
}
