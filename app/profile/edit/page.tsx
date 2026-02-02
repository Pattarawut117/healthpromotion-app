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

  const inputClasses =
    "w-full p-2 border border-input rounded-md focus:ring-primary focus:border-primary bg-background text-foreground";

  if (loading) return <p className="p-4">กำลังโหลดข้อมูล...</p>;

  return (
    <div className="max-w-lg mx-auto p-4 space-y-6 pb-20">
      <div className="flex items-center gap-4">
        <Link href="/profile">
          <ArrowLeftOutlined className="text-xl cursor-pointer" />
        </Link>
        <h1 className="text-xl font-bold">แก้ไขโปรไฟล์ (Edit Profile)</h1>
      </div>

      <div className="space-y-4">
        {/* 1. Personal Info */}
        <div className="p-4 border rounded-2xl shadow-sm bg-card text-card-foreground">
          <legend className="font-semibold mb-4">ข้อมูลส่วนบุคคล (Personal Info)</legend>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-muted-foreground mb-1">
                ชื่อ (First Name)
              </label>
              <input
                type="text"
                name="sname"
                value={formData.sname || ""}
                onChange={handleChange}
                placeholder="ชื่อ"
                className={inputClasses}
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-muted-foreground mb-1">
                นามสกุล (Last Name)
              </label>
              <input
                type="text"
                name="lname"
                value={formData.lname || ""}
                onChange={handleChange}
                placeholder="นามสกุล"
                className={inputClasses}
              />
            </div>
          </div>

          <div className="mt-4">
            <label className="block text-sm font-medium text-muted-foreground mb-1">
              เบอร์โทร (Tel)
            </label>
            <input
              type="text"
              name="tel"
              value={formData.tel || ""}
              onChange={handleChange}
              placeholder="เบอร์โทร"
              className={inputClasses}
            />
          </div>

          <div className="grid grid-cols-2 gap-4 mt-4">
            <div>
              <label className="block text-sm font-medium text-muted-foreground mb-1">
                วันเกิด (DOB)
              </label>
              <input
                type="date"
                name="dob"
                value={formData.dob || ""}
                onChange={handleChange}
                className={inputClasses}
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-muted-foreground mb-1">
                เพศ (Gender)
              </label>
              <select
                name="gender"
                value={formData.gender || ""}
                onChange={handleChange}
                className={`select ${inputClasses}`}
              >
                <option value="">-- ระบุ --</option>
                <option value="ชาย">ชาย (Male)</option>
                <option value="หญิง">หญิง (Female)</option>
                <option value="อื่นๆ">อื่นๆ (Other)</option>
              </select>
            </div>
          </div>

          <div className="mt-4">
            <label className="block text-sm font-medium text-muted-foreground mb-1">
              หน่วยงาน (Unit)
            </label>
            <select
              name="unit"
              value={formData.unit || ""}
              onChange={handleChange}
              className={`select ${inputClasses}`}
            >
              <option value="">-- ระบุหน่วยงาน --</option>
              {unitData.map((unit: Unit) => (
                <option key={unit.id} value={unit.value}>
                  {unit.text}
                </option>
              ))}
            </select>
          </div>

          <div className="mt-4">
            <label className="block text-sm font-medium text-muted-foreground mb-1">
              สังกัด/แผนก (Division)
            </label>
            <input
              type="text"
              name="division"
              value={formData.division || ""}
              onChange={handleChange}
              placeholder="ระบุสังกัด"
              className={inputClasses}
            />
          </div>

          <div className="mt-4">
            <label className="block text-sm font-medium text-muted-foreground mb-1">
              ท่านนั่งหรือเอนกายเฉยๆติดต่อกันนาน เกิน 2 ชั่วโมงหรือไม่
            </label>
            <select name="workingLongtime" id="workingLongtime" value={formData.workingLongtime || ""} onChange={handleChange} className={`select ${inputClasses}`}>
              <option value="">-- ระบุ --</option>
              <option value="น้อยกว่า 2 ชั่วโมง">น้อยกว่า 2 ชั่วโมง</option>
              <option value="2-4 ชั่วโมง">2-4 ชั่วโมง</option>
              <option value="4-6 ชั่วโมง">4-6 ชั่วโมง</option>
              <option value="6-8 ชั่วโมง">6-8 ชั่วโมง</option>
              <option value="8 ชั่วโมงขึ้นไป">8 ชั่วโมงขึ้นไป</option>
            </select>
          </div>
        </div>

        {/* 2. Body Composition */}
        <div className="p-4 border rounded-2xl shadow-sm bg-card text-card-foreground">
          <legend className="font-semibold mb-4">ข้อมูลร่างกาย (Body)</legend>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-muted-foreground mb-1">
                ส่วนสูง (cm)
              </label>
              <input
                type="number"
                name="height"
                value={formData.height || ""}
                onChange={handleChange}
                placeholder="cm"
                className={inputClasses}
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-muted-foreground mb-1">
                น้ำหนัก (kg)
              </label>
              <input
                type="number"
                name="weight"
                value={formData.weight || ""}
                onChange={handleChange}
                placeholder="kg"
                className={inputClasses}
              />
            </div>
          </div>

          <div className="mt-4">
            <label className="block text-sm font-medium text-muted-foreground mb-1">
              BMI (Auto-calculated)
            </label>
            <div className="p-2 bg-muted rounded-md text-center font-bold border border-input bg-gray-50">
              {formData.bmi || "-"}
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4 mt-4">
            <div>
              <label className="block text-sm font-medium text-muted-foreground mb-1">
                รอบเอว (Waist cm)
              </label>
              <input
                type="text"
                name="waist"
                value={formData.waist || ""}
                onChange={handleChange}
                placeholder="cm"
                className={inputClasses}
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-muted-foreground mb-1">
                % ไขมัน (Body Fat %)
              </label>
              <input
                type="number"
                name="body_fat_percentage"
                value={formData.body_fat_percentage || ""}
                onChange={handleChange}
                placeholder="%"
                className={inputClasses}
              />
            </div>
          </div>

          <div className="mt-4">
            <label className="block text-sm font-medium text-muted-foreground mb-1">
              โรคประจำตัว (Congenital Disease)
            </label>
            <textarea
              name="condentialDisease"
              value={formData.condentialDisease || ""}
              onChange={handleChange}
              placeholder="ระบุโรคประจำตัว"
              className={inputClasses}
              rows={2}
            />
          </div>
        </div>

        {/* 3. Sleep & Lifestyle */}
        {/* <div className="p-4 border rounded-2xl shadow-sm bg-card text-card-foreground">
          <legend className="font-semibold mb-4">
            การนอนและพฤติกรรม (Sleep & Habits)
          </legend>
          <div>
            <div>
              <label className="block text-sm font-medium text-muted-foreground mb-1">
                ส่วนใหญ่ท่านนอนวันละกี่ชั่วโมง
              </label>
              <select name="sleepPerhour" id="sleepPerhour" value={formData.sleepPerhour || ""} onChange={handleChange} className={`select ${inputClasses}`}>
                <option value="">-- ระบุ --</option>
                <option value="น้อยกว่า 2 ชั่วโมง">น้อยกว่า 2 ชั่วโมง</option>
                <option value="2-4 ชั่วโมง">2-4 ชั่วโมง</option>
                <option value="4-6 ชั่วโมง">4-6 ชั่วโมง</option>
                <option value="6-8 ชั่วโมง">6-8 ชั่วโมง</option>
                <option value="8 ชั่วโมงขึ้นไป">8 ชั่วโมงขึ้นไป</option>
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium text-muted-foreground mb-1">
                นอนพอไหม?
              </label>
              <select
                name="sleepEnough"
                value={formData.sleepEnough || ""}
                onChange={handleChange}
                className={`select ${inputClasses}`}
              >
                <option value="">-- ระบุ --</option>
                <option value="พอ">พอ</option>
                <option value="ไม่พอ">ไม่พอ</option>
              </select>
            </div>
          </div>

          <div className="mt-4">
            <label className="block text-sm font-medium text-muted-foreground mb-1">
              มีปัญหาการนอนหลับ?
            </label>
            <select
              name="sleepProblem"
              value={formData.sleepProblem || ""}
              onChange={handleChange}
              className={`select ${inputClasses}`}
            >
              <option value="">-- ระบุ --</option>
              <option value="ไม่มี">ไม่มี</option>
              <option value="หลับยาก">หลับยาก</option>
              <option value="ตื่นกลางดึก">ตื่นกลางดึก</option>
            </select>
          </div>

          <div className="grid grid-cols-1 gap-4 mt-4">
            <div>
              <label className="block text-sm font-medium text-muted-foreground mb-1">
                สูบบุหรี่?
              </label>
              <select
                name="isSmoke"
                value={formData.isSmoke || ""}
                onChange={handleChange}
                className={`select ${inputClasses}`}
              >
                <option value="">-- ระบุ --</option>
                <option value="ไม่สูบ">ไม่สูบ</option>
                <option value="สูบ">สูบ</option>
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium text-muted-foreground mb-1">
                ดื่มแอลกอฮอล์?
              </label>
              <select
                name="drinkBeer"
                value={formData.drinkBeer || ""}
                onChange={handleChange}
                className={`select ${inputClasses}`}
              >
                <option value="">-- ระบุ --</option>
                <option value="ไม่เคยดื่มเลย">ไม่เคยดื่มเลย</option>
                <option value="เดือนละครั้ง">เดือนละครั้ง</option>
                <option value="สัปดาห์ละครั้ง">สัปดาห์ละครั้ง</option>
                <option value="เกือบทุกวัน">เกือบทุกวัน</option>
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium text-muted-foreground mb-1">
                ท่านดื่มน้ำวันละไหร่ (แก้ว 250 มล. ขวดเล็ก 600 มล. ขวดใหญ่ 1500 มล.)
              </label>
              <select
                name="drinkWater"
                value={formData.drinkWater || ""}
                onChange={handleChange}
                className={`select ${inputClasses}`}
              >
                <option value="">-- ระบุ --</option>
                <option value="ดื่มน้อยกว่า 4 แก้ว (1,000 มล.)">ดื่มน้อยกว่า 4 แก้ว (1,000 มล.)</option>
                <option value="4-6 แก้ว (1,000-1,500 มล.)">4-6 แก้ว (1,000-1,500 มล.)</option>
                <option value="มากกว่า 6-8 แก้ว (1,500-2,000 มล.)">มากกว่า 6-8 แก้ว (1,500-2,000 มล.)</option>
                <option value="มากกว่า 8-10 แก้ว (2,000-2,500 มล.)">มากกว่า 8-10 แก้ว (2,000-2,500 มล.)</option>
              </select>
            </div>
          </div>
        </div> */}

        {/* 4. Diet */}
        {/* <div className="p-4 border rounded-2xl shadow-sm bg-card text-card-foreground">
          <legend className="font-semibold mb-4">อาหารการกิน (Diet)</legend>
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-muted-foreground mb-1">
                ทานผักผลไม้?
              </label>
              <select
                name="eatVegetable"
                value={formData.eatVegetable || ""}
                onChange={handleChange}
                className={`select ${inputClasses}`}
              >
                <option value="">-- ระบุ --</option>
                <option value="ไม่กินเลย">ไม่กินเลย</option>
                <option value="กิน 1-3 ครั้งต่อสัปดาห์">กิน 1-3 ครั้งต่อสัปดาห์</option>
                <option value="กิน 4-6 ครั้งต่อสัปดาห์">กิน 4-6 ครั้งต่อสัปดาห์</option>
                <option value="กินทุกวัน">กินทุกวัน</option>
              </select>
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-muted-foreground mb-1">
                  ทานเปรี้ยว?
                </label>
                <select
                  name="eatSour"
                  value={formData.eatSour || ""}
                  onChange={handleChange}
                  className={`select ${inputClasses}`}
                >
                  <option value="">-- ระบุ --</option>
                  <option value="ไม่เติมเครื่องปรุงรสเค็มเลย">ไม่เติมเครื่องปรุงรสเค็มเลย</option>
                  <option value="เติมเครื่องปรุงรสเค็มน้อย">เติมเครื่องปรุงรสเค็มน้อย</option>
                  <option value="เติมเครื่องปรุงรสเค็มเป็นบางครั้ง">เติมเครื่องปรุงรสเค็มปานกลาง</option>
                  <option value="เติมเครื่องปรุงรสเค็มเป็นทุกครั้ง">เติมเครื่องปรุงรสเค็มมาก</option>
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium text-muted-foreground mb-1">
                  ทานหวาน?
                </label>
                <select
                  name="eatSweetness"
                  value={formData.eatSweetness || ""}
                  onChange={handleChange}
                  className={`select ${inputClasses}`}
                >
                  <option value="">-- ระบุ --</option>
                  <option value="ไม่ดื่มเลย">ไม่ดื่มเลย</option>
                  <option value="ดื่มน้อยกว่า 1 ครั้งต่อสัปดาห์">ดื่มน้อยกว่า 1 ครั้งต่อสัปดาห์</option>
                  <option value="ดื่ม 1-3 ครั้งต่อสัปดาห์">ดื่ม 1-3 ครั้งต่อสัปดาห์</option>
                  <option value="ดื่ม 4-6 ครั้งต่อสัปดาห์">ดื่ม 4-6 ครั้งต่อสัปดาห์</option>
                  <option value="ดื่มทุกวัน">ดื่มทุกวัน</option>
                </select>
              </div>
            </div>
          </div>
        </div> */}

        {/* 5. Mental & Other */}
        {/* <div className="p-4 border rounded-2xl shadow-sm bg-card text-card-foreground">
          <legend className="font-semibold mb-4">
            สุขภาวะทางจิต (Mental & Other)
          </legend>
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-muted-foreground mb-1">
                มีสมาธิน้อยลง
              </label>
              <select
                name="adhd"
                value={formData.adhd || ""}
                onChange={handleChange}
                className={`select ${inputClasses}`}
              >
                <option value="">-- ระบุ --</option>
                <option value="น้อยมากหรือแทบไม่มี">น้อยมากหรือแทบไม่มี</option>
                <option value="เป็นบางครั้ง">เป็นบางครั้ง</option>
                <option value="เป็นบ่อยครั้ง">บ่อย</option>
                <option value="เป็นทุกครั้ง">ทุกครั้ง</option>
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium text-muted-foreground mb-1">
                หงุดหงิด กระวนกระวาย วุ่นวายใจหรือไม่
              </label>
              <select
                name="madness"
                value={formData.madness || ""}
                onChange={handleChange}
                className={`select ${inputClasses}`}
              >
                <option value="">-- ระบุ --</option>
                <option value="น้อยมากหรือแทบไม่มี">น้อยมากหรือแทบไม่มี</option>
                <option value="เป็นบางครั้ง">เป็นบางครั้ง</option>
                <option value="เป็นบ่อยครั้ง">บ่อย</option>
                <option value="เป็นทุกครั้ง">ทุกครั้ง</option>
              </select>
            </div>
          </div>
          <div className="grid grid-cols-2 gap-4 mt-4">
            <div>
              <label className="block text-sm font-medium text-muted-foreground mb-1">
                รู้สึกเบื่อหน่ายหรือไม่
              </label>
              <select
                name="bored"
                value={formData.bored || ""}
                onChange={handleChange}
                className={`select ${inputClasses}`}
              >
                <option value="">-- ระบุ --</option>
                <option value="น้อยมากหรือแทบไม่มี">น้อยมากหรือแทบไม่มี</option>
                <option value="เป็นบางครั้ง">เป็นบางครั้ง</option>
                <option value="เป็นบ่อยครั้ง">บ่อย</option>
                <option value="เป็นทุกครั้ง">ทุกครั้ง</option>
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium text-muted-foreground mb-1">
                ไม่อยากพบปะผู้คนหรือไม่
              </label>
              <select
                name="introvert"
                value={formData.introvert || ""}
                onChange={handleChange}
                className={`select ${inputClasses}`}
              >
                <option value="">-- ระบุ --</option>
                <option value="น้อยมากหรือแทบไม่มี">น้อยมากหรือแทบไม่มี</option>
                <option value="เป็นบางครั้ง">เป็นบางครั้ง</option>
                <option value="เป็นบ่อยครั้ง">บ่อย</option>
                <option value="เป็นทุกครั้ง">ทุกครั้ง</option>
              </select>
            </div>
          </div>
          <div className="mt-4">
            <label className="block text-sm font-medium text-muted-foreground mb-1">
              ท่านมีกิจกรรมทางกายหรือเคลื่อนไหวหรือไม่อย่างไร
            </label>
            <select name="activitiesTried" id="activitiesTried" value={formData.activitiesTried || ""} onChange={handleChange} className={`select ${inputClasses}`}>
              <option value="">-- ระบุ --</option>
              <option value="ไม่มีกิจกรรมเลย">ไม่มีกิจกรรมเลย</option>
              <option value="มีกิจกรรมทางกายน้อยกว่าสัปดาห์ละ 150 นาทีหรือน้อยกว่า 30 นาทีต่อวัน">มีกิจกรรมทางกายน้อยกว่าสัปดาห์ละ 150 นาทีหรือน้อยกว่า 30 นาทีต่อวัน</option>
              <option value="มีกิจกรรมทางกายมากกว่าสัปดาห์ละ 150 นาทีหรือน้อยกว่า 30 นาทีต่อวัน">มีกิจกรรมทางกายมากกว่าสัปดาห์ละ 150 นาทีหรือน้อยกว่า 30 นาทีต่อวัน</option>
            </select>
          </div>
        </div> */}

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
    </div>
  );
}
