"use client";

import { useState } from "react";
import ChallengeSubmissionForm from "@/components/campaign/ChallengeSubmissionForm";

const FloatingActionButton = () => {
  const [showModal, setShowModal] = useState(false);
  const [selectedCategory, setSelectedCategory] = useState<'water' | 'food' | 'sleep' | 'exercise' | null>(null);

  const handleOpenModal = (category: 'water' | 'food' | 'sleep' | 'exercise') => {
    setSelectedCategory(category);
    setShowModal(true);
  };

  return (
    <>
      <div className="fixed inset-0 flex justify-center pointer-events-none z-40">
        <div className="w-full max-w-sm relative h-full">
          {/* Container positioned at the bottom */}
          <div className="absolute bottom-20 left-0 w-full pointer-events-auto">

            {/* Horizontal Flex Container */}
            <div className="flex flex-row items-end justify-center gap-4 px-4">

              {/* Record Exercise */}
              <div className="flex flex-col items-center gap-2 animate-slideInUp">
                <button
                  onClick={() => handleOpenModal('exercise')}
                  className="bg-gradient-to-r from-pink-500 to-red-500 hover:scale-110 transition transform text-white w-12 h-12 rounded-full shadow-lg flex items-center justify-center z-50"
                  aria-label="บันทึกการออกกำลังกาย"
                >
                  <span className="text-xl">💪</span>
                </button>
                <p className="bg-white/90 backdrop-blur-sm text-gray-800 px-2 py-1 rounded-md shadow-sm text-xs text-center whitespace-nowrap">
                  ออกกำลังกาย
                </p>
              </div>

              {/* Record Water */}
              <div className="flex flex-col items-center gap-2 animate-slideInUp delay-75">
                <button
                  onClick={() => handleOpenModal('water')}
                  className="bg-gradient-to-r from-blue-400 to-cyan-500 hover:scale-110 transition transform text-white w-12 h-12 rounded-full shadow-lg flex items-center justify-center z-50"
                  aria-label="บันทึกการดื่มน้ำ"
                >
                  <span className="text-xl">💧</span>
                </button>
                <p className="bg-white/90 backdrop-blur-sm text-gray-800 px-2 py-1 rounded-md shadow-sm text-xs text-center whitespace-nowrap">
                  ดื่มน้ำ
                </p>
              </div>

              {/* Record Sleep */}
              <div className="flex flex-col items-center gap-2 animate-slideInUp delay-100">
                <button
                  onClick={() => handleOpenModal('sleep')}
                  className="bg-gradient-to-r from-indigo-400 to-purple-600 hover:scale-110 transition transform text-white w-12 h-12 rounded-full shadow-lg flex items-center justify-center z-50"
                  aria-label="บันทึกการนอน"
                >
                  <span className="text-xl">😴</span>
                </button>
                <p className="bg-white/90 backdrop-blur-sm text-gray-800 px-2 py-1 rounded-md shadow-sm text-xs text-center whitespace-nowrap">
                  การนอน
                </p>
              </div>

              {/* Record Food */}
              <div className="flex flex-col items-center gap-2 animate-slideInUp delay-150">
                <button
                  onClick={() => handleOpenModal('food')}
                  className="bg-gradient-to-r from-green-400 to-emerald-600 hover:scale-110 transition transform text-white w-12 h-12 rounded-full shadow-lg flex items-center justify-center z-50"
                  aria-label="บันทึกการทานอาหาร"
                >
                  <span className="text-xl">🍽️</span>
                </button>
                <p className="bg-white/90 backdrop-blur-sm text-gray-800 px-2 py-1 rounded-md shadow-sm text-xs text-center whitespace-nowrap">
                  อาหาร
                </p>
              </div>

            </div>

          </div>
        </div>
      </div>

      {/* Modal */}
      {showModal && selectedCategory && (
        <ChallengeSubmissionForm
          category={selectedCategory}
          onClose={() => setShowModal(false)}
          onSuccess={() => console.log("Success")}
        />
      )}
    </>
  );
};
export default FloatingActionButton;
