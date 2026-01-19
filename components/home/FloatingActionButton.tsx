"use client";

import { useState } from "react";
import ChallengeSubmissionForm from "@/components/campaign/ChallengeSubmissionForm";

const FloatingActionButton = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [showModal, setShowModal] = useState(false);
  const [selectedCategory, setSelectedCategory] = useState<'water' | 'food' | 'sleep' | 'exercise' | null>(null);

  const handleOpenModal = (category: 'water' | 'food' | 'sleep' | 'exercise') => {
    setSelectedCategory(category);
    setShowModal(true);
    setIsMenuOpen(false); // Close menu on select
  };

  return (
    <>
      <div className="fixed inset-0 flex justify-center pointer-events-none z-50">
        <div className="w-full max-w-sm relative h-full">
          <div className="absolute bottom-20 right-0 pointer-events-auto">
            {isMenuOpen && (
              <div className="flex flex-col items-end gap-4 mb-4 transition-all pr-4">

                {/* Record Exercise */}
                <div className="flex items-center gap-2 animate-slideInRight">
                  <p className="bg-white text-gray-800 px-3 py-2 rounded-lg shadow-md text-sm">
                    บันทึกการออกกำลังกาย
                  </p>
                  <button
                    onClick={() => handleOpenModal('exercise')}
                    className="bg-gradient-to-r from-pink-500 to-red-500 hover:scale-110 transition transform text-white w-12 h-12 rounded-full shadow-lg flex items-center justify-center"
                  >
                    💪
                  </button>
                </div>

                {/* Record Water */}
                <div className="flex items-center gap-2 animate-slideInRight delay-100">
                  <p className="bg-white text-gray-800 px-3 py-2 rounded-lg shadow-md text-sm">
                    บันทึกการดื่มน้ำ
                  </p>
                  <button
                    onClick={() => handleOpenModal('water')}
                    className="bg-gradient-to-r from-blue-400 to-cyan-500 hover:scale-110 transition transform text-white w-12 h-12 rounded-full shadow-lg flex items-center justify-center"
                  >
                    💧
                  </button>
                </div>

                {/* Record Sleep */}
                <div className="flex items-center gap-2 animate-slideInRight delay-100">
                  <p className="bg-white text-gray-800 px-3 py-2 rounded-lg shadow-md text-sm">
                    บันทึกการนอน
                  </p>
                  <button
                    onClick={() => handleOpenModal('sleep')}
                    className="bg-gradient-to-r from-indigo-400 to-purple-600 hover:scale-110 transition transform text-white w-12 h-12 rounded-full shadow-lg flex items-center justify-center"
                  >
                    😴
                  </button>
                </div>

                {/* Record Food */}
                <div className="flex items-center gap-2 animate-slideInRight delay-100">
                  <p className="bg-white text-gray-800 px-3 py-2 rounded-lg shadow-md text-sm">
                    บันทึกการทานอาหาร 2:1:1
                  </p>
                  <button
                    onClick={() => handleOpenModal('food')}
                    className="bg-gradient-to-r from-green-400 to-emerald-600 hover:scale-110 transition transform text-white w-12 h-12 rounded-full shadow-lg flex items-center justify-center"
                  >
                    🍽️
                  </button>
                </div>
              </div>

            )}

            {/* Main FAB */}
            <button
              onClick={() => setIsMenuOpen(!isMenuOpen)}
              className="bg-green-500 hover:bg-green-600 text-white w-16 h-16 rounded-full shadow-lg flex items-center justify-center text-3xl transition-transform mr-4"
            >
              {isMenuOpen ? "×" : "+"}
            </button>
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
