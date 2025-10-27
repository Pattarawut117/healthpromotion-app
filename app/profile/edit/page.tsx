"use client";

import React, { useEffect, useState, useCallback } from "react";
import { ArrowLeftOutlined } from "@ant-design/icons";
import Link from "next/link";
import { useLiff } from "@/contexts/LiffContext";
import Image from "next/image";

interface UserProfile {
  sname: string;
  lname: string;
  tel: string;
  dob: string;
  gender: string;
  height: number;
  weight: number;
  level_activity: string;
  waist: number;
  exercise_target: number;
  water_target: number;
  fat: number;
  muscle: number;
  bp_up: number;
  bp_down: number;
  fat_abnominal: number;
  before_pic?: string;
  after_pic?: string;
}

type FileUploaderProps = {
  onChange: (field: keyof UserProfile, value: string) => void;
  field: keyof UserProfile;
  currentImage?: string;
};

const FileUploader: React.FC<FileUploaderProps> = ({
  onChange,
  field,
  currentImage,
}) => {
  const [preview, setPreview] = useState<string | null>(currentImage || null);

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setPreview(reader.result as string);
      };
      reader.readAsDataURL(file);

      const formData = new FormData();
      formData.append("file", file);

      try {
        const response = await fetch("/api/upload", {
          method: "POST",
          body: formData,
        });
        const result = await response.json();
        if (response.ok && result.success) {
          onChange(field, result.path || "");
        } else {
          console.error("Upload failed:", result.error);
        }
      } catch (error) {
        console.error("Upload error:", error);
      }
    }
  };

  return (
    <div className="border-2 border-dashed border-input rounded-lg p-4 text-center">
      <input
        type="file"
        id={`file-upload-${field}`}
        className="hidden"
        onChange={handleFileChange}
        accept=".png,.jpg,.jpeg"
      />
      <label htmlFor={`file-upload-${field}`} className="cursor-pointer">
        {preview ? (
          <Image
            src={preview}
            alt="Preview"
            width={96}
            height={96}
            className="mx-auto h-24 w-24 object-cover rounded-lg"
          />
        ) : (
          <div className="flex flex-col items-center">
            <svg
              className="w-12 h-12 text-muted-foreground"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="2"
                d="M7 16a4 4 0 01-4-4V7a4 4 0 014-4h10a4 4 0 014 4v5a4 4 0 01-4 4H7z"
              ></path>
            </svg>
            <p className="mt-2 text-sm text-muted-foreground">+ Upload Image</p>
          </div>
        )}
      </label>
    </div>
  );
};

export default function EditProfilePage() {
  const { profile } = useLiff();
  const userId = profile?.userId;
  const [loading, setLoading] = useState(true);

  const [formData, setFormData] = useState<UserProfile>({
    sname: "",
    lname: "",
    tel: "",
    dob: "",
    gender: "",
    height: 0,
    weight: 0,
    level_activity: "",
    waist: 0,
    exercise_target: 0,
    water_target: 0,
    fat: 0,
    muscle: 0,
    bp_up: 0,
    bp_down: 0,
    fat_abnominal: 0,
    before_pic: "",
    after_pic: "",
  });

  const [modalMessage, setModalMessage] = useState("");
  const [showModal, setShowModal] = useState(false);

  const fetchUser = useCallback(async () => {
    if (!userId) return;
    setLoading(true);
    try {
      const res = await fetch(`/api/users?user_id=${userId}`);
      if (res.ok) {
        const data = await res.json();

        // ✅ แปลง dob ให้เป็น YYYY-MM-DD
        if (data.dob) {
          data.dob = new Date(data.dob).toISOString().split("T")[0];
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
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleFileChange = (field: keyof UserProfile, value: string) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
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
        res.ok ? "อัพเดตข้อมูลสำเร็จ!" : "ข้อผิดพลาด: " + data.error
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
    <div className="max-w-lg mx-auto p-4 space-y-6">
      <div className="flex items-center gap-4">
        <Link href="/profile">
          <ArrowLeftOutlined className="text-xl cursor-pointer" />
        </Link>
        <h1 className="text-xl font-bold">แก้ไขโปรไฟล์</h1>
      </div>

      {/* ข้อมูลส่วนบุคคล */}
      <div className="bg-white shadow-md rounded-xl p-4 space-y-3">
        <h2 className="font-semibold text-lg text-gray-700">ข้อมูลส่วนบุคคล</h2>
        <div className="grid grid-cols-2 gap-3">
          <input
            type="text"
            name="sname"
            value={formData.sname || ""}
            onChange={handleChange}
            placeholder="ชื่อ"
            className="border rounded-lg p-2"
          />
          <input
            type="text"
            name="lname"
            value={formData.lname || ""}
            onChange={handleChange}
            placeholder="นามสกุล"
            className="border rounded-lg p-2"
          />
        </div>
        <input
          type="text"
          name="tel"
          value={formData.tel || ""}
          onChange={handleChange}
          placeholder="เบอร์โทร"
          className="border rounded-lg p-2 w-full"
        />
        <input
          type="date"
          name="dob"
          value={formData.dob || ""}
          onChange={handleChange}
          className="border rounded-lg p-2 w-full"
        />
        <select
          name="gender"
          value={formData.gender || ""}
          onChange={handleChange}
          className="border rounded-lg p-2 w-full"
        >
          <option value="">-- เลือกเพศ --</option>
          <option value="ชาย">ชาย</option>
          <option value="หญิง">หญิง</option>
          <option value="อื่นๆ">อื่นๆ</option>
        </select>
      </div>

      {/* ข้อมูลสุขภาพ */}
      <div className="bg-white shadow-md rounded-xl p-4 space-y-3">
        <h2 className="font-semibold text-lg text-gray-700">ข้อมูลสุขภาพ</h2>
        <div className="flex flex-col gap-3">
          <fieldset className="border rounded-lg flex">
            <legend className="px-2">ส่วนสูง</legend>
              <input
                type="number"
                name="height"
                value={formData.height ?? ""}
                onChange={handleChange}
                placeholder="ส่วนสูง (ซม.)"
                className="border-none w-full pl-[2px] pr-[16px]"
                min={0}
              />
              <p className="text-xl bg-gray-200 px-2 text-gray-600 rounded-br-lg">ซม.</p>
            
          </fieldset>
          <fieldset className="border rounded-lg flex">
            <legend className="px-3">น้ำหนัก</legend>
          <input
            type="number"
            name="weight"
            value={formData.weight ?? ""}
            onChange={handleChange}
            placeholder="น้ำหนัก (กก.)"
            className="rounded-lg px-2 w-full"
            min={0}
          />
          <p>kg</p>
          </fieldset>
          <fieldset className="border rounded-lg flex">
          <legend>รอบเอว</legend>
          <input
            type="number"
            name="waist"
            value={formData.waist || ""}
            onChange={handleChange}
            placeholder="รอบเอว"
            className="border-none rounded-lg p-2"
            min={0}
          />
          </fieldset>
          <div className="flex gap-2">
          <fieldset className="border rounded-lg flex">
            <legend>% ไขมัน</legend>
          <input
            type="number"
            name="fat"
            value={formData.fat}
            onChange={handleChange}
            placeholder="ไขมัน %"
            className="border-none rounded-lg p-2"
            min={0}
            max={100}
          />
          </fieldset>
          <fieldset className="border rounded-lg flex">
            <legend>กล้ามเนื้อ</legend>
          <input
            type="number"
            name="muscle"
            value={formData.muscle}
            onChange={handleChange}
            placeholder="กล้ามเนื้อ"
            className="border-none rounded-lg p-2"
            min={0}
            max={100}
          />
          </fieldset >
          </div>
          <fieldset className="border rounded-lg flex">
            <legend>ความดันโลหิตค่าบน</legend>
          <input
            type="number"
            name="bp_up"
            value={formData.bp_up}
            onChange={handleChange}
            placeholder="ความดันโลหิต (บน)"
            className="border-none rounded-lg p-2"
            min={0}
            max={100}
          />
          </fieldset>
          <fieldset className="border rounded-lg flex">
            <legend>ความดันโลหิตค่าล่าง</legend>
          <input
            type="number"
            name="bp_down"
            value={formData.bp_down}
            onChange={handleChange}
            placeholder="ความดันโลหิต (ล่าง)"
            className="border rounded-lg p-2"
            min={0}
            max={100}
          />
          </fieldset>
          <div className="p-3 border rounded border-black relative">
          <h2 className="absolute -top-1/2 translate-y-1/2 bg-white">ระดับไขมันช่องท้อง</h2>
          <input
            type="number"
            name="fat_abnominal"
            value={formData.fat_abnominal}
            onChange={handleChange}
            placeholder="ไขมันช่องท้อง"
            className="border-none rounded-lg w-full"
            min={0}
            max={100}
          />
          </div>
        </div>

        <select
          name="level_activity"
          value={formData.level_activity || ""}
          onChange={handleChange}
          className="border rounded-lg p-2 w-full"
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
            เป็นนักกีฬา/นักวิ่ง
          </option>
        </select>
      </div>

      {/* อัพโหลดรูปภาพ */}
      <div className="bg-white shadow-md rounded-xl p-4 space-y-3">
        <h2 className="font-semibold text-lg text-gray-700">รูปภาพ Before</h2>
        <div>
          <FileUploader
            onChange={handleFileChange}
            field="before_pic"
            currentImage={formData.before_pic}
          />
        </div>
      </div>
      <div className="bg-white shadow-md rounded-xl p-4 space-y-3">
        <h2 className="font-semibold text-lg text-gray-700">รูปภาพ After</h2>

        <div>
          <FileUploader
            onChange={handleFileChange}
            field="after_pic"
            currentImage={formData.after_pic}
          />
        </div>
      </div>

      <button
        onClick={handleSubmit}
        className="w-full bg-orange-400 text-white py-2 rounded-xl font-semibold shadow hover:bg-orange-500 transition"
      >
        บันทึกข้อมูล
      </button>

      {showModal && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center">
          <div className="bg-white p-6 rounded-xl shadow-xl w-80 text-center">
            <p className="text-lg font-semibold">{modalMessage}</p>
            <button
              onClick={() => setShowModal(false)}
              className="mt-4 px-4 py-2 bg-gray-200 rounded-lg w-full"
            >
              ปิด
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
