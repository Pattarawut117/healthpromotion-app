"use client";

import { useState } from "react";

const FloatingActionButton = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  return (
    <div className="fixed inset-0 flex justify-center pointer-events-none z-50">
      <div className="w-full max-w-sm relative h-full">
        <div className="absolute bottom-20 right-0 pointer-events-auto">
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
              <div className="flex items-center gap-2 animate-slideInRight delay-100">
                <p className="bg-white text-gray-800 px-3 py-2 rounded-lg shadow-md text-sm">
                  บันทึกการนอน
                </p>
                <button className="bg-gradient-to-r from-blue-400 to-blue-600 hover:scale-110 transition transform text-white w-12 h-12 rounded-full shadow-lg flex items-center justify-center">
                  💧
                </button>
              </div>
              <div className="flex items-center gap-2 animate-slideInRight delay-100">
                <p className="bg-white text-gray-800 px-3 py-2 rounded-lg shadow-md text-sm">
                  บันทึกการทานอาหาร 2:1:1
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
            className="bg-green-500 hover:bg-green-600 text-white w-16 h-16 rounded-full shadow-lg flex items-center justify-center text-3xl transition-transform"
          >
            {isMenuOpen ? "×" : "+"}
          </button>
        </div>
      </div>
    </div>
  );
};

export default FloatingActionButton;
