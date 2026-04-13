'use client';

import Image from 'next/image';
import React, { useState } from 'react';

type CampaignType = 'fitness' | 'food' | 'mental' | 'run';

interface UserOption {
  value: CampaignType;
  title: string;
  label: React.ReactNode;
}

interface Campaign {
  id: number;
  image: string;
}

const users: UserOption[] = [
  {
    value: 'fitness',
    title: 'ฟิตเนส',
    label: (
      <div className="w-8 h-8 rounded-full bg-green-500 flex items-center justify-center shadow-sm shrink-0">
        <Image src="/review/heart-rate.png" alt="heart-rate" width={24} height={24} className="w-4 h-4 object-contain" />
      </div>
    ),
  },
  {
    value: 'food',
    title: 'อาหาร',
    label: (
      <div className="w-8 h-8 rounded-full bg-orange-400 flex items-center justify-center shadow-sm shrink-0">
        <Image src="/review/diet.png" alt="diet" width={24} height={24} className="w-4 h-4 object-contain" />
      </div>
    ),
  },
  {
    value: 'mental',
    title: 'สุขภาพจิต',
    label: (
      <div className="w-8 h-8 rounded-full bg-blue-400 flex items-center justify-center shadow-sm shrink-0">
        <svg className="w-4 h-4 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"></path></svg>
      </div>
    ),
  },
  {
    value: 'run',
    title: 'วิ่ง',
    label: (
      <div className="w-8 h-8 rounded-full bg-red-400 flex items-center justify-center shadow-sm shrink-0">
        <svg className="w-4 h-4 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 10V3L4 14h7v7l9-11h-7z"></path></svg>
      </div>
    ),
  },
];

const campaignData: Record<CampaignType, Campaign[]> = {
  fitness: [{ id: 1, image: "/poster/fitness1.jpg" }, { id: 2, image: "/poster/fitness2.png" }, { id: 3, image: "/poster/fitness3.png" }],
  food: [{ id: 1, image: "/poster/food1.jpg" }, { id: 2, image: "/poster/food2.jpg" }, { id: 3, image: "/poster/food3.jpg" }, { id: 4, image: "/poster/food4.jpg" }],
  mental: [{ id: 1, image: "/poster/mental1.jpg" }],
  run: []
}

export default function ReviewPage() {
  const [selectedValue, setSelectedValue] = useState<CampaignType>('fitness');
  const [selectedImage, setSelectedImage] = useState<string | null>(null);
  const activeData = campaignData[selectedValue] || [];

  return (
    <div className="min-h-screen bg-base-200 text-base-content pb-20 relative">
      {/* Top Navbar */}
      <div className="navbar bg-base-100 sticky top-0 z-50 shadow-sm px-4">
        <div className="navbar-start"></div>
        <div className="navbar-center font-bold text-lg">
          คำแนะนำ
        </div>
        <div className="navbar-end"></div>
      </div>

      <div className="max-w-xl mx-auto p-4 md:p-6 space-y-6">

        {/* Category Tabs */}
        <div className="card bg-base-100 shadow-sm border border-base-200/50 overflow-hidden">
          <div className="p-2">
            <div role="tablist" className="tabs tabs-boxed bg-transparent gap-1">
              {users.map((user) => {
                const isActive = selectedValue === user.value;
                return (
                  <button
                    key={user.value}
                    role="tab"
                    onClick={() => setSelectedValue(user.value)}
                    className={`tab h-auto py-2 px-1 sm:px-4 flex flex-row items-center justify-center gap-1.5 transition-all duration-300 flex-1 rounded-xl ${isActive
                      ? 'tab-active !bg-primary/10 !text-primary shadow-sm border border-primary/20 scale-105'
                      : 'hover:bg-base-200 opacity-60 hover:opacity-100'
                      }`}
                  >
                    {user.label}
                    <span className="text-[11px] sm:text-sm font-semibold whitespace-nowrap">{user.title}</span>
                  </button>
                )
              })}
            </div>
          </div>
        </div>

        {/* Gallery */}
        <div className="grid grid-cols-1 gap-5">
          {activeData.length > 0 ? (
            activeData.map((campaign) => (
              <div
                key={campaign.id}
                className="card bg-base-100 shadow-sm border border-base-200/50 p-2 overflow-hidden flex flex-col justify-center items-center cursor-pointer active:scale-95 hover:opacity-90 transition-all duration-200 relative group"
                onClick={() => setSelectedImage(campaign.image)}
              >
                {/* Plus Icon Overlay visible on hover (desktop mainly, but good hint) */}
                <div className="absolute inset-0 bg-base-200/30 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center z-10 pointer-events-none rounded-xl">
                  <div className="bg-black/60 p-3 rounded-full text-white shadow-xl backdrop-blur-sm">
                    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" className="w-8 h-8">
                      <path strokeLinecap="round" strokeLinejoin="round" d="M21 21l-5.197-5.197m0 0A7.5 7.5 0 105.196 5.196a7.5 7.5 0 0010.607 10.607zM10.5 7.5v6m3-3h-6" />
                    </svg>
                  </div>
                </div>
                <Image
                  src={campaign.image}
                  alt={`Campaign ${campaign.id}`}
                  width={800}
                  height={800}
                  className="w-full max-h-[70vh] object-contain rounded-xl bg-base-200/40 border border-base-200"
                />
              </div>
            ))
          ) : (
            /* Empty State */
            <div className="col-span-1 md:col-span-2 card bg-base-100 shadow-sm border border-base-200 border-dashed py-16 mt-2 rounded-3xl">
              <div className="card-body items-center text-center opacity-40">
                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" className="w-20 h-20 stroke-current mb-2"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z"></path></svg>
                <h3 className="font-bold text-xl">ยังไม่มีข้อมูลแนะนำ</h3>
                <p className="text-base mt-2">เนื้อหาหมวดหมู่นี้กำลังอยู่ระหว่างการจัดเตรียม</p>
              </div>
            </div>
          )}
        </div>

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