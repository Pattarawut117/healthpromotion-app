"use client";

import React, { useEffect, useState } from "react";
import { ArrowLeftOutlined } from "@ant-design/icons";
import Link from "next/link";
import { useLiff } from "@/contexts/LiffContext";

// ✅ สร้าง Interface สำหรับข้อมูลโปรไฟล์ผู้ใช้
interface UserProfile {
  sname: string;
  lname: string;
  tel: string;
  dob: string;
  gender: string;
  height: string;
  weight: string;
  level_activity: string;
}

export default function EditProfilePage() {
  const { profile } = useLiff();
  const userId = profile?.userId;
  const [loading, setLoading] = useState(true);
  
  // ✅ กำหนดประเภทข้อมูลให้กับ useState ด้วย UserProfile
  const [formData, setFormData] = useState<UserProfile>({
    sname: "",
    lname: "",
    tel: "",
    dob: "",
    gender: "",
    height: "",
    weight: "",
    level_activity: "",
  });

  // ✅ State สำหรับ Modal
  const [modalMessage, setModalMessage] = useState("");
  const [showModal, setShowModal] = useState(false);

  useEffect(() => {
    if (!userId) return;

    const fetchUser = async () => {
      try {
        const res = await fetch(`/api/users?user_id=${userId}`);
        if (res.ok) {
          const data = await res.json();
          // ✅ ตรวจสอบและใช้ประเภทข้อมูลที่ถูกต้อง
          setFormData(data);
        }
      } catch (err) {
        console.error("Error fetching user:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchUser();
  }, [userId]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    // ✅ กำหนดประเภทให้กับ prev เพื่อให้ TypeScript ตรวจสอบได้
    setFormData((prev: UserProfile) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async () => {
    if (!userId) return;

    try {
      const res = await fetch("/api/users", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ ...formData, user_id: userId }),
      });

      const data = await res.json();
      if (res.ok) {
        setModalMessage("อัพเดตข้อมูลสำเร็จ!");
      } else {
        setModalMessage("ข้อผิดพลาด: " + data.error);
      }
      setShowModal(true);
    } catch (err) {
      console.error("Error updating user:", err);
      setModalMessage("เกิดข้อผิดพลาดขณะอัพเดตข้อมูล");
      setShowModal(true);
    }
  };

  if (loading) return <p className="p-4">กำลังโหลดข้อมูล...</p>;

  return (
    <div className="p-4 flex flex-col gap-4">
      {/* Back Button */}
      <Link href="/profile" className="flex gap-4 items-center">
        <ArrowLeftOutlined />
        <p className="text-lg font-bold">แก้ไขโปรไฟล์</p>
      </Link>

      {/* ข้อมูลส่วนบุคคล */}
      <div className="space-y-2">
        <p className="font-bold">ข้อมูลส่วนบุคคล</p>
        <input
          type="text"
          name="sname"
          value={formData.sname || ""}
          onChange={handleChange}
          className="border rounded p-2 w-full"
          placeholder="ชื่อ"
        />
        <input
          type="text"
          name="lname"
          value={formData.lname || ""}
          onChange={handleChange}
          className="border rounded p-2 w-full"
          placeholder="นามสกุล"
        />
        <input
          type="text"
          name="tel"
          value={formData.tel || ""}
          onChange={handleChange}
          className="border rounded p-2 w-full"
          placeholder="เบอร์โทร"
        />
        <input
          type="date"
          name="dob"
          value={formData.dob || ""}
          onChange={handleChange}
          className="border rounded p-2 w-full"
        />
        <select
          name="gender"
          value={formData.gender || ""}
          onChange={handleChange}
          className="border rounded p-2 w-full"
        >
          <option value="">-- เลือกเพศ --</option>
          <option value="ชาย">ชาย</option>
          <option value="หญิง">หญิง</option>
          <option value="อื่นๆ">อื่นๆ</option>
        </select>
      </div>

      {/* ข้อมูลสุขภาพ */}
      <div className="space-y-2">
        <p className="font-bold">ข้อมูลสุขภาพ</p>
        <input
          type="number"
          name="height"
          value={formData.height || ""}
          onChange={handleChange}
          className="border rounded p-2 w-full"
          placeholder="ส่วนสูง (ซม.)"
        />
        <input
          type="number"
          name="weight"
          value={formData.weight || ""}
          onChange={handleChange}
          className="border rounded p-2 w-full"
          placeholder="น้ำหนัก (กก.)"
        />
        <select
          name="level_activity"
          value={formData.level_activity || ""}
          onChange={handleChange}
          className="border rounded p-2 w-full"
        >
          <option value="">-- เลือกระดับการออกกำลังกาย --</option>
          <option value="นั่งทำงานอยู่กับที่ ไม่ออกกำลังกายเลย">
            นั่งทำงานอยู่กับที่ ไม่ออกกำลังกายเลย
          </option>
          <option value="ออกกำลังกาย 1-2 ครั้ง/สัปดาห์">
            ออกกำลังกาย 1-2 ครั้ง/สัปดาห์
          </option>
          <option value="ออกกำลังกาย 3-5 ครั้ง/สัปดาห์">
            ออกกำลังกาย 3-5 ครั้ง/สัปดาห์
          </option>
          <option value="ออกกำลังกาย 6-7 ครั้ง/สัปดาห์">
            ออกกำลังกาย 6-7 ครั้ง/สัปดาห์
          </option>
          <option value="เป็นนักกีฬา/นักวิ่ง ออกกำลังกายทุกวัน วันละ 2 ครั้งขึ้นไป">
            เป็นนักกีฬา/นักวิ่ง ออกกำลังกายทุกวัน วันละ 2 ครั้งขึ้นไป
          </option>
        </select>
      </div>

      {/* ปุ่มบันทึก */}
      <button
        onClick={handleSubmit}
        className="px-4 py-2 rounded bg-orange-300"
      >
        บันทึก
      </button>

      {/* Modal */}
      {showModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center">
          <div className="bg-white p-6 rounded-lg shadow-lg">
            <p className="text-lg font-semibold text-center">{modalMessage}</p>
            <button
              onClick={() => setShowModal(false)}
              className="mt-4 px-4 py-2 bg-gray-200 rounded w-full"
            >
              ปิด
            </button>
          </div>
        </div>
      )}
    </div>
  );
}