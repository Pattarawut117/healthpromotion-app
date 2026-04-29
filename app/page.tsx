"use client"

import { useLiff } from "@/contexts/LiffContext";
import { useState } from "react";

import UserPicture from "@/components/profile/UserPicture";
import Image from "next/image";

const newsList = [
  {
    title: "กิจกรรมวิ่งเพื่อสุขภาพ",
    description: "พบกับแคมเปญส่งเสริมสุขภาพจิตที่ดี ร่วมกิจกรรมเพื่อตัวคุณเองและคนรอบข้างให้สุขภาพจิตแข็งแรง",
    image: "/poster/runCampaignImage.jpg",
  },
  {
    title: "กิจกรรมดูแลสุขภาพจิต",
    description: "พบกับแคมเปญส่งเสริมสุขภาพจิตที่ดี ร่วมกิจกรรมเพื่อตัวคุณเองและคนรอบข้างให้สุขภาพจิตแข็งแรง",
    image: "/poster/mentalCampaign.png",
  },
];

export default function Home() {
  const { isLoggedIn } = useLiff();
  const [selectedImage, setSelectedImage] = useState<string | null>(null);

  if (!isLoggedIn) {
    return (
      <div className="min-h-screen bg-base-200 flex flex-col justify-center items-center">
        <span className="loading loading-spinner text-primary loading-lg"></span>
        <p className="mt-4 text-base-content/60 font-medium">กำลังโหลดข้อมูล...</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-base-200 text-base-content pb-24 relative">
      {/* Top Navbar */}
      <div className="bg-base-100 flex flex-col items-center pt-8 pb-6 px-4 shadow-sm w-full">
        <UserPicture />
      </div>
      <div className="max-w-xl mx-auto p-4 md:p-6 space-y-6 mt-2">
        {/* Section Header */}
        <div className="border-l-4 border-primary pl-3 mb-4">
          <h2 className="text-lg font-extrabold text-base-content">ข่าวสารและแคมเปญ</h2>
          <p className="text-sm text-base-content/70">อัปเดตข้อมูลกิจกรรมเพื่อสุขภาพของคุณ</p>
        </div>

        {/* News Feed Card */}
        {newsList.map((item, index) => (
          <div key={index} className="card bg-base-100 shadow-sm border border-base-200/50 overflow-hidden">
            <figure
              className="relative w-full aspect-[4/3] sm:aspect-video bg-base-200 cursor-pointer group active:scale-[0.98] transition-transform"
              onClick={() => setSelectedImage(item.image)}
            >
              {/* Hover overlay hint */}
              <div className="absolute inset-0 bg-base-200/30 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center z-10 pointer-events-none">
                <div className="bg-black/60 p-3 rounded-full text-white shadow-xl backdrop-blur-sm">
                  <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" className="w-8 h-8">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M21 21l-5.197-5.197m0 0A7.5 7.5 0 105.196 5.196a7.5 7.5 0 0010.607 10.607zM10.5 7.5v6m3-3h-6" />
                  </svg>
                </div>
              </div>
              <Image
                src={item.image}
                alt={item.title}
                fill
                className="object-cover"
              />
            </figure>
            <div className="card-body p-4 sm:p-6">
              <div className="flex justify-between items-start mb-2">
                <h3 className="card-title text-lg">{item.title}</h3>
                <div className="badge badge-primary badge-outline text-xs">ล่าสุด</div>
              </div>
              <p className="text-sm text-base-content/80">
                {item.description}
              </p>
            </div>
          </div>
        ))}


      </div>

      {/* Image Viewer Modal */}
      {selectedImage && (
        <dialog className="modal modal-open bg-black/80 backdrop-blur-sm z-[100] m-0">
          <div className="modal-box bg-transparent shadow-none p-0 max-w-full w-full h-full flex flex-col justify-center items-center rounded-none overflow-hidden" onClick={() => setSelectedImage(null)}>

            {/* Close Button */}
            <div className="absolute top-4 right-4 z-10 text-right w-full flex justify-end px-4">
              <button
                className="btn btn-circle btn-active btn-sm sm:btn-md btn-outline text-white border-white bg-black/20 hover:bg-black/60 shadow-lg"
                onClick={(e) => {
                  e.stopPropagation();
                  setSelectedImage(null);
                }}
              >
                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 sm:h-6 sm:w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M6 18L18 6M6 6l12 12" /></svg>
              </button>
            </div>

            {/* Large Image View */}
            <div className="relative w-full px-2 mt-4" onClick={(e) => e.stopPropagation()}>
              <Image
                src={selectedImage}
                alt="Enlarged Poster View"
                width={1400}
                height={1400}
                className="w-full h-auto max-h-[85vh] object-contain rounded-xl shadow-2xl"
              />
            </div>
          </div>
          <form method="dialog" className="modal-backdrop" onClick={() => setSelectedImage(null)}>
            <button>close</button>
          </form>
        </dialog>
      )}

    </div>
  );
}
