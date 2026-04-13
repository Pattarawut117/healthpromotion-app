"use client";

import React, { useEffect, useState, useCallback } from "react";
import { ArrowLeftOutlined } from "@ant-design/icons";
import Link from "next/link";
import { useLiff } from "@/contexts/LiffContext";
import unitData, { divisionData } from '@/app/user/data/data';
import Select from 'react-select';

// Interface matching app/api/users/route.ts
interface UserInfo {
  user_id: string;
  sname?: string;
  lname?: string;
  tel?: string;
  dob?: string;
  gender?: string;
  height?: string; // API uses string
  weight?: string; // API uses string
  bmi?: number;
  condentialDisease?: string;
  sleepPerhour?: string;
  sleepEnough?: string;
  isSmoke?: string;
  drinkBeer?: string;
  drinkWater?: string;
  sleepProblem?: string;
  adhd?: string;
  madness?: string;
  bored?: string;
  introvert?: string;
  unit?: string;
  eatVegetable?: string;
  eatSour?: string;
  eatSweetness?: string;
  activitiesTried?: string;
  workingLongtime?: string;
  division?: string;
  waist?: number;
  body_fat_percentage?: number;
}

export default function EditProfilePage() {
  const { profile } = useLiff();
  const userId = profile?.userId;
  const [loading, setLoading] = useState(true);

  const [formData, setFormData] = useState<Partial<UserInfo>>({});
  const [modalMessage, setModalMessage] = useState("");
  const [showModal, setShowModal] = useState(false);

  const divisionOptions = divisionData.map((division) => ({
    value: division.value,
    label: division.text,
  }));

  const fetchUser = useCallback(async () => {
    if (!userId) return;
    setLoading(true);
    try {
      const res = await fetch(`/api/users?user_id=${userId}`);
      if (res.ok) {
        const data = await res.json();
        // Format DOB safely
        if (data.dob) {
          try {
            data.dob = new Date(data.dob).toISOString().split("T")[0];
          } catch (e) {
            console.error("Error formatting date", e);
          }
        }
        setFormData(data);
      }
    } catch (err) {
      console.error("Error fetching user:", err);
    } finally {
      setLoading(false);
    }
  }, [userId]);

  useEffect(() => {
    fetchUser();
  }, [fetchUser]);

  const handleChange = (
    e: React.ChangeEvent<
      HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement
    >
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => {
      const updated = { ...prev, [name]: value };

      // Auto-calculate BMI if height or weight changes
      if (name === "height" || name === "weight") {
        const h = parseFloat(updated.height || "0");
        const w = parseFloat(updated.weight || "0");
        if (h > 0 && w > 0) {
          const hM = h / 100;
          updated.bmi = parseFloat((w / (hM * hM)).toFixed(2));
        }
      }
      return updated;
    });
  };

  const handleSubmit = useCallback(async () => {
    if (!userId) return;
    try {
      const res = await fetch("/api/users", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ ...formData, user_id: userId }),
      });

      const data = await res.json();
      setModalMessage(
        res.ok ? "อัพเดตข้อมูลสำเร็จ! (Update Successful)" : "ข้อผิดพลาด: " + data.error
      );
      setShowModal(true);
      if (res.ok) {
        fetchUser();
      }
    } catch (err) {
      console.error("Error updating user:", err);
      setModalMessage("เกิดข้อผิดพลาดขณะอัพเดตข้อมูล");
      setShowModal(true);
    }
  }, [userId, formData, fetchUser]);

  if (loading) return <div className="min-h-screen bg-base-200 flex items-center justify-center"><span className="loading loading-spinner text-primary"></span></div>;

  return (
    <div className="min-h-screen bg-base-200 text-base-content pb-24 relative">
      {/* Top Navbar */}
      <div className="navbar bg-base-100 sticky top-0 z-50 shadow-sm px-4">
        <div className="navbar-start">
          <Link href="/profile" className="btn btn-ghost btn-sm px-2">
            <ArrowLeftOutlined /> กลับ
          </Link>
        </div>
        <div className="navbar-center font-bold text-lg">
          แก้ไขโปรไฟล์
        </div>
        <div className="navbar-end"></div>
      </div>

      <div className="max-w-lg mx-auto p-4 md:p-6 mt-2 space-y-6">

        {/* 1. Personal Info */}
        <div className="card bg-base-100 shadow-sm border border-base-200/50">
          <div className="card-body p-4 sm:p-6">
            <h2 className="card-title text-lg border-b border-base-200 pb-2 mb-2">ข้อมูลส่วนบุคคล (Personal Info)</h2>

            <div className="grid grid-cols-2 gap-4">
              <div className="form-control w-full">
                <label className="label py-1"><span className="label-text font-medium">ชื่อ (First Name)</span></label>
                <input
                  type="text"
                  name="sname"
                  value={formData.sname || ""}
                  onChange={handleChange}
                  placeholder="ชื่อ"
                  className="input input-sm sm:input-md input-bordered focus:input-primary w-full"
                />
              </div>
              <div className="form-control w-full">
                <label className="label py-1"><span className="label-text font-medium">นามสกุล (Last Name)</span></label>
                <input
                  type="text"
                  name="lname"
                  value={formData.lname || ""}
                  onChange={handleChange}
                  placeholder="นามสกุล"
                  className="input input-sm sm:input-md input-bordered focus:input-primary w-full"
                />
              </div>
            </div>

            <div className="form-control w-full mt-2">
              <label className="label py-1"><span className="label-text font-medium">เบอร์โทร (Tel)</span></label>
              <input
                type="tel"
                name="tel"
                value={formData.tel || ""}
                onChange={handleChange}
                placeholder="เบอร์โทรศัพท์"
                className="input input-sm sm:input-md input-bordered focus:input-primary w-full"
              />
            </div>

            <div className="grid grid-cols-2 gap-4 mt-2">
              <div className="form-control w-full">
                <label className="label py-1"><span className="label-text font-medium">วันเกิด (DOB)</span></label>
                <input
                  type="date"
                  name="dob"
                  value={formData.dob || ""}
                  onChange={handleChange}
                  className="input input-sm sm:input-md input-bordered focus:input-primary w-full"
                />
              </div>
              <div className="form-control w-full">
                <label className="label py-1"><span className="label-text font-medium">เพศ (Gender)</span></label>
                <select
                  name="gender"
                  value={formData.gender || ""}
                  onChange={handleChange}
                  className="select select-sm sm:select-md select-bordered focus:select-primary w-full font-normal"
                >
                  <option value="" disabled>-- ระบุ --</option>
                  <option value="ชาย">ชาย (Male)</option>
                  <option value="หญิง">หญิง (Female)</option>
                  <option value="อื่นๆ">อื่นๆ (Other)</option>
                </select>
              </div>
            </div>

            <div className="form-control w-full mt-2">
              <label className="label py-1"><span className="label-text font-medium">หน่วยงาน (Unit)</span></label>
              <Select
                name="unit"
                value={unitData
                  .map(u => ({ value: u.value, label: u.text }))
                  .find(opt => opt.value === formData.unit)}
                onChange={(option) => setFormData(prev => ({ ...prev, unit: option?.value || "" }))}
                options={unitData.map(u => ({ value: u.value, label: u.text }))}
                placeholder="ระบุหน่วยงาน"
                className="text-sm"
                classNamePrefix="select"
                isClearable
                isSearchable
                styles={{
                  control: (base) => ({
                    ...base,
                    borderRadius: "0.5rem",
                    borderColor: "oklch(var(--b3))",
                    minHeight: "3rem",
                  })
                }}
              />
            </div>

            <div className="form-control w-full mt-2">
              <label className="label py-1"><span className="label-text font-medium">สังกัด/แผนก (Division)</span></label>
              <Select
                name="division"
                value={divisionOptions.find((opt) => opt.value === formData.division)}
                onChange={(option) => setFormData(prev => ({ ...prev, division: option?.value || "" }))}
                options={divisionOptions}
                placeholder="ระบุสังกัด"
                className="text-sm"
                classNamePrefix="select"
                isClearable
                isSearchable
                styles={{
                  control: (base) => ({
                    ...base,
                    borderRadius: "0.5rem",
                    borderColor: "oklch(var(--b3))",
                    minHeight: "3rem",
                  })
                }}
              />
            </div>
          </div>
        </div>

        {/* 2. Body Composition */}
        <div className="card bg-base-100 shadow-sm border border-base-200/50">
          <div className="card-body p-4 sm:p-6">
            <h2 className="card-title text-lg border-b border-base-200 pb-2 mb-2">ข้อมูลร่างกาย (Body)</h2>

            <div className="grid grid-cols-2 gap-4">
              <div className="form-control w-full">
                <label className="label py-1"><span className="label-text font-medium text-xs sm:text-sm">ส่วนสูง (cm)</span></label>
                <input
                  type="number"
                  name="height"
                  value={formData.height || ""}
                  onChange={handleChange}
                  placeholder="ซม."
                  className="input input-sm sm:input-md input-bordered focus:input-primary w-full"
                />
              </div>
              <div className="form-control w-full">
                <label className="label py-1"><span className="label-text font-medium text-xs sm:text-sm">น้ำหนัก (kg)</span></label>
                <input
                  type="number"
                  name="weight"
                  value={formData.weight || ""}
                  onChange={handleChange}
                  placeholder="กก."
                  className="input input-sm sm:input-md input-bordered focus:input-primary w-full"
                />
              </div>
            </div>

            <div className="form-control w-full mt-2">
              <label className="label py-1"><span className="label-text font-medium">BMI (คำนวณอัตโนมัติ)</span></label>
              <div className="w-full bg-base-200 border border-base-300 rounded-lg p-3 text-center text-lg font-bold text-base-content opacity-70">
                {formData.bmi || "-"}
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4 mt-2">
              <div className="form-control w-full">
                <label className="label py-1"><span className="label-text font-medium text-xs sm:text-sm">รอบเอว (Waist cm)</span></label>
                <input
                  type="number"
                  name="waist"
                  value={formData.waist || ""}
                  onChange={handleChange}
                  placeholder="ซม."
                  className="input input-sm sm:input-md input-bordered focus:input-primary w-full"
                />
              </div>
              <div className="form-control w-full">
                <label className="label py-1"><span className="label-text font-medium text-xs sm:text-sm">% ไขมัน (Body Fat)</span></label>
                <input
                  type="number"
                  name="body_fat_percentage"
                  value={formData.body_fat_percentage || ""}
                  onChange={handleChange}
                  placeholder="%"
                  className="input input-sm sm:input-md input-bordered focus:input-primary w-full"
                />
              </div>
            </div>

            <div className="form-control w-full mt-2">
              <label className="label py-1"><span className="label-text font-medium">โรคประจำตัว (Congenital Disease)</span></label>
              <textarea
                name="condentialDisease"
                value={formData.condentialDisease || ""}
                onChange={handleChange}
                placeholder="ระบุโรคประจำตัว"
                className="textarea textarea-bordered focus:textarea-primary w-full h-24 text-base"
              />
            </div>
          </div>
        </div>

        {/* Action Button Sticky on Mobile */}
        <div className="fixed bottom-0 left-0 right-0 p-4 bg-base-100 border-t border-base-200 z-40 sm:relative sm:border-0 sm:bg-transparent sm:p-0">
          <button
            onClick={handleSubmit}
            className="btn btn-primary w-full rounded-full text-base sm:text-lg shadow-lg sm:shadow-sm h-12"
          >
            บันทึกการเปลี่ยนแปลง (Save)
          </button>
        </div>

        {/* DaisyUI Alert Modal */}
        {showModal && (
          <dialog className="modal modal-open modal-bottom sm:modal-middle bg-black/40 backdrop-blur-sm">
            <div className="modal-box text-center p-8">
              {modalMessage.includes("สำเร็จ") ? (
                <div className="mb-4 text-success flex justify-center">
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-16 w-16" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                </div>
              ) : (
                <div className="mb-4 text-error flex justify-center">
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-16 w-16" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                </div>
              )}

              <h3 className="font-bold text-xl">{modalMessage.includes("สำเร็จ") ? "เรียบร้อย!" : "เกิดข้อผิดพลาด"}</h3>
              <p className="py-4 text-base-content/80 text-lg">{modalMessage}</p>

              <div className="modal-action justify-center mt-2">
                <button
                  onClick={() => setShowModal(false)}
                  className="btn btn-neutral w-full rounded-full text-lg"
                >
                  ปิดหน้าต่าง
                </button>
              </div>
            </div>
          </dialog>
        )}
      </div>
    </div>
  );
}
