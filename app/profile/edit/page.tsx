"use client";

import React, { useEffect, useState, useCallback } from "react";
import { ArrowLeftOutlined } from "@ant-design/icons";
import Link from "next/link";
import { useLiff } from "@/contexts/LiffContext";
import unitData, { Unit } from '@/app/user/data/data';

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
}

export default function EditProfilePage() {
  const { profile } = useLiff();
  const userId = profile?.userId;
  const [loading, setLoading] = useState(true);

  const [formData, setFormData] = useState<Partial<UserInfo>>({});
  const [modalMessage, setModalMessage] = useState("");
  const [showModal, setShowModal] = useState(false);

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

  if (loading) return <p className="p-4">กำลังโหลดข้อมูล...</p>;

  return (
    <div className="max-w-lg mx-auto p-4 space-y-6 pb-20">
      <div className="flex items-center gap-4">
        <Link href="/profile">
          <ArrowLeftOutlined className="text-xl cursor-pointer" />
        </Link>
        <h1 className="text-xl font-bold">แก้ไขโปรไฟล์ (Edit Profile)</h1>
      </div>

      {/* 1. Personal Info */}
      <section className="bg-white shadow-md rounded-xl p-4 space-y-3">
        <h2 className="font-semibold text-lg text-gray-700">ข้อมูลส่วนบุคคล (Personal Info)</h2>
        <div className="grid grid-cols-2 gap-3">
          <input type="text" name="sname" value={formData.sname || ""} onChange={handleChange} placeholder="ชื่อ (First Name)" className="border rounded-lg p-2" />
          <input type="text" name="lname" value={formData.lname || ""} onChange={handleChange} placeholder="นามสกุล (Last Name)" className="border rounded-lg p-2" />
        </div>
        <input type="text" name="tel" value={formData.tel || ""} onChange={handleChange} placeholder="เบอร์โทร (Tel)" className="border rounded-lg p-2 w-full" />
        <div className="grid grid-cols-2 gap-3">
          <input type="date" name="dob" value={formData.dob || ""} onChange={handleChange} className="border rounded-lg p-2 w-full" />
          <select name="gender" value={formData.gender || ""} onChange={handleChange} className="border rounded-lg p-2 w-full">
            <option value="">-- เพศ (Gender) --</option>
            <option value="ชาย">ชาย (Male)</option>
            <option value="หญิง">หญิง (Female)</option>
            <option value="อื่นๆ">อื่นๆ (Other)</option>
          </select>
        </div>
        <select name="unit" value={formData.unit || ""} onChange={handleChange}>
          {unitData.map((unit: Unit) => (
            <option key={unit.id} value={unit.value}>
              {unit.text}
            </option>
          ))}
        </select>
        <input type="text" name="workingLongtime" value={formData.workingLongtime || ""} onChange={handleChange} placeholder="อายุงาน (Working Duration)" className="border rounded-lg p-2 w-full" />
      </section>

      {/* 2. Body Composition */}
      <section className="bg-white shadow-md rounded-xl p-4 space-y-3">
        <h2 className="font-semibold text-lg text-gray-700">ข้อมูลร่างกาย (Body)</h2>
        <div className="grid grid-cols-2 gap-3">
          <div className="relative">
            <input type="number" name="height" value={formData.height || ""} onChange={handleChange} placeholder="ส่วนสูง (cm)" className="border rounded-lg p-2 w-full pr-10" />
            <span className="absolute right-3 top-2 text-gray-400">cm</span>
          </div>
          <div className="relative">
            <input type="number" name="weight" value={formData.weight || ""} onChange={handleChange} placeholder="น้ำหนัก (kg)" className="border rounded-lg p-2 w-full pr-10" />
            <span className="absolute right-3 top-2 text-gray-400">kg</span>
          </div>
        </div>
        <div className="flex items-center gap-2">
          <span className="font-bold">BMI:</span>
          <span className="text-blue-600">{formData.bmi || "-"}</span>
        </div>
        <textarea name="condentialDisease" value={formData.condentialDisease || ""} onChange={handleChange} placeholder="โรคประจำตัว (Congenital Disease)" className="border rounded-lg p-2 w-full" rows={2} />
      </section>

      {/* 3. Sleep & Lifestyle */}
      <section className="bg-white shadow-md rounded-xl p-4 space-y-3">
        <h2 className="font-semibold text-lg text-gray-700">การนอนและพฤติกรรม (Sleep & Habits)</h2>
        <div className="grid grid-cols-2 gap-3">
          <input type="number" name="sleepPerhour" value={formData.sleepPerhour || ""} onChange={handleChange} placeholder="ชั่วโมงนอน/วัน" className="border rounded-lg p-2 w-full" />
          <select name="sleepEnough" value={formData.sleepEnough || ""} onChange={handleChange} className="border rounded-lg p-2 w-full">
            <option value="">นอนพอไหม?</option>
            <option value="พอ">พอ</option>
            <option value="ไม่พอ">ไม่พอ</option>
          </select>
        </div>
        <select name="sleepProblem" value={formData.sleepProblem || ""} onChange={handleChange} className="border rounded-lg p-2 w-full">
          <option value="">มีปัญหาการนอนหลับ?</option>
          <option value="ไม่มี">ไม่มี</option>
          <option value="หลับยาก">หลับยาก</option>
          <option value="ตื่นกลางดึก">ตื่นกลางดึก</option>
        </select>

        <div className="grid grid-cols-3 gap-2">
          <select name="isSmoke" value={formData.isSmoke || ""} onChange={handleChange} className="border rounded-lg p-2 w-full text-sm">
            <option value="">สูบบุหรี่?</option>
            <option value="ไม่สูบ">ไม่สูบ</option>
            <option value="สูบ">สูบ</option>
          </select>
          <select name="drinkBeer" value={formData.drinkBeer || ""} onChange={handleChange} className="border rounded-lg p-2 w-full text-sm">
            <option value="">ดื่มแอลกอฮอล์?</option>
            <option value="ไม่ดื่ม">ไม่ดื่ม</option>
            <option value="ดื่ม">ดื่ม</option>
          </select>
          <select name="drinkWater" value={formData.drinkWater || ""} onChange={handleChange} className="border rounded-lg p-2 w-full text-sm">
            <option value="">ดื่มน้ำวันละ?</option>
            <option value="<8 แก้ว">{"<8 แก้ว"}</option>
            <option value="8-10 แก้ว">8-10 แก้ว</option>
            <option value=">10 แก้ว">{">10 แก้ว"}</option>
          </select>
        </div>
      </section>

      {/* 4. Diet */}
      <section className="bg-white shadow-md rounded-xl p-4 space-y-3">
        <h2 className="font-semibold text-lg text-gray-700">อาหารการกิน (Diet)</h2>
        <div className="grid grid-cols-1 gap-3">
          <select name="eatVegetable" value={formData.eatVegetable || ""} onChange={handleChange} className="border rounded-lg p-2 w-full">
            <option value="">ทานผักผลไม้?</option>
            <option value="ทานประจำ">ทานประจำ</option>
            <option value="ทานบ้าง">ทานบ้าง</option>
            <option value="ไม่ทานเลย">ไม่ทานเลย</option>
          </select>
          <div className="grid grid-cols-2 gap-3">
            <select name="eatSour" value={formData.eatSour || ""} onChange={handleChange} className="border rounded-lg p-2 w-full">
              <option value="">ทานเปรี้ยว?</option>
              <option value="ชอบ">ชอบ</option>
              <option value="เฉยๆ">เฉยๆ</option>
              <option value="ไม่ชอบ">ไม่ชอบ</option>
            </select>
            <select name="eatSweetness" value={formData.eatSweetness || ""} onChange={handleChange} className="border rounded-lg p-2 w-full">
              <option value="">ทานหวาน?</option>
              <option value="ชอบ">ชอบ</option>
              <option value="เฉยๆ">เฉยๆ</option>
              <option value="ไม่ชอบ">ไม่ชอบ</option>
            </select>
          </div>
        </div>
      </section>

      {/* 5. Mental & Other */}
      <section className="bg-white shadow-md rounded-xl p-4 space-y-3">
        <h2 className="font-semibold text-lg text-gray-700">สุขภาวะทางจิต (Mental & Other)</h2>
        <div className="grid grid-cols-2 gap-3">
          <select name="adhd" value={formData.adhd || ""} onChange={handleChange} className="border rounded-lg p-2 w-full">
            <option value="">สมาธิสั้น/วอกแวก?</option>
            <option value="ใช่">ใช่</option>
            <option value="ไม่ใช่">ไม่ใช่</option>
          </select>
          <select name="madness" value={formData.madness || ""} onChange={handleChange} className="border rounded-lg p-2 w-full">
            <option value="">เครียด/หงุดหงิด?</option>
            <option value="บ่อย">บ่อย</option>
            <option value="บางครั้ง">บางครั้ง</option>
            <option value="ไม่ค่อย">ไม่ค่อย</option>
          </select>
        </div>
        <div className="grid grid-cols-2 gap-3">
          <select name="bored" value={formData.bored || ""} onChange={handleChange} className="border rounded-lg p-2 w-full">
            <option value="">เบื่อหน่าย/หมดไฟ?</option>
            <option value="ใช่">ใช่</option>
            <option value="ไม่ใช่">ไม่ใช่</option>
          </select>
          <select name="introvert" value={formData.introvert || ""} onChange={handleChange} className="border rounded-lg p-2 w-full">
            <option value="">Introvert?</option>
            <option value="ใช่">ใช่</option>
            <option value="ไม่ใช่">ไม่ใช่</option>
            <option value="กึ่งๆ">กึ่งๆ</option>
          </select>
        </div>
        <textarea name="activitiesTried" value={formData.activitiesTried || ""} onChange={handleChange} placeholder="กิจกรรมที่เคยลอง (Activities Tried)" className="border rounded-lg p-2 w-full" rows={2} />
      </section>

      <button
        onClick={handleSubmit}
        className="w-full bg-orange-400 text-white py-3 rounded-xl font-semibold shadow hover:bg-orange-500 transition text-lg"
      >
        บันทึกการเปลี่ยนแปลง (Save Changes)
      </button>

      {showModal && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
          <div className="bg-white p-6 rounded-xl shadow-xl w-80 text-center">
            <p className="text-lg font-semibold mb-4">{modalMessage}</p>
            <button
              onClick={() => setShowModal(false)}
              className="bg-gray-200 hover:bg-gray-300 text-gray-800 font-semibold py-2 px-4 rounded-lg w-full"
            >
              ปิด (Close)
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
