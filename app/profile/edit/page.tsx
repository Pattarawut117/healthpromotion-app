"use client";

import React, { useEffect, useState } from "react";
import { ArrowLeftOutlined } from "@ant-design/icons";
import Link from "next/link";
import { useLiff } from "@/contexts/LiffContext";

export default function EditProfilePage() {
  const { profile } = useLiff(); // ✅ ได้ user profile จาก LINE
  const userId = profile?.userId; // ✅ ใช้ userId จริง
  const [loading, setLoading] = useState(true);

  const [formData, setFormData] = useState<any>({
    sname: "",
    lname: "",
    tel: "",
    dob: "",
    gender: "",
    height: "",
    weight: "",
    level_activity: "",
  });

  // ✅ โหลดข้อมูลจาก API ด้วย userId
  useEffect(() => {
    if (!userId) return; // รอจนกว่าจะมี userId

    const fetchUser = async () => {
      try {
        const res = await fetch(`/api/users?user_id=${userId}`);
        if (res.ok) {
          const data = await res.json();
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

  // ✅ handle change input
  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData((prev: any) => ({ ...prev, [name]: value }));
  };

  // ✅ handle submit update
  const handleSubmit = async () => {
    if (!userId) return;

    try {
      const res = await fetch("/api/users", {
        method: "POST", // ✅ API ของคุณรองรับ Insert/Update
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ ...formData, user_id: userId }),
      });

      const data = await res.json();
      if (res.ok) {
        alert("อัพเดตข้อมูลสำเร็จ!");
      } else {
        alert("Error: " + data.error);
      }
    } catch (err) {
      console.error("Error updating user:", err);
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
    
    </div>
  );
}