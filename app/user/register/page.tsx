"use client";

import React, { useState, useEffect } from "react";
import { Button, Steps, message } from "antd";
import RegisterForm from "@/components/RegisterForm";
import TargetForm from "@/components/TargetForm";
import liff from "@line/liff";
import dayjs, { Dayjs } from "dayjs";

export type RegisterFormData = {
  user_id: string;
  sname: string;
  lname: string;
  tel: string;
  dob: Dayjs | string;
  gender: string;
  height: number;
  weight: number;
  level_activity: string;
  before_pic: string;
  exercise_target: number;
  water_target: number;
}

type formDataProps = {
  formData: RegisterFormData;
  onChange?: (field: keyof RegisterFormData, value: any) => void; // ฟังก์ชันอัพเดตค่า
};

export default function RegisterPage() {
  const [current, setCurrent] = useState(0);
  const [userId, setUserId] = useState<string>("");
  const [isLiffInitialized, setIsLiffInitialized] = useState(false);

  useEffect(() => {
    const initLiff = async () => {
      try {
        await liff.init({ liffId: "2007987577-9DzlZY4K" });
        setIsLiffInitialized(true);

        if (!liff.isLoggedIn()) {
          // Check if LIFF is running in a browser environment (not LINE app)
          // and prevent infinite login loop
          if (liff.getOS() === "web") {
            console.warn(
              "User is not logged in via LIFF on a web browser. Please log in first."
            );
            // You might want to redirect to a different page or show a login button
            return;
          }
          liff.login();
          return;
        }

        const profile = await liff.getProfile();
        console.log("LIFF Profile:", profile);
        setUserId(profile.userId);
      } catch (err) {
        console.error("LIFF init error", err);
      }
    };
    initLiff();
  }, []);

  // state เก็บค่าฟอร์มทั้งหมด
  const [formData, setFormData] = useState<RegisterFormData>({
    user_id: userId, // This will be replaced by the real userId later
    sname: "",
    lname: "",
    tel: "",
    dob: "",
    gender: "",
    height: 0,
    weight: 0,
    level_activity: "",
    before_pic: "",
    exercise_target: 0,
    water_target: 0,
  });

  // ฟังก์ชันอัพเดตค่า (child component เรียกใช้)
  const handleChange = (field: string, value: any) => {
    setFormData((prev) => ({
      ...prev,
      [field]: value,
    }));
  };

  // ฟังก์ชันส่งข้อมูลไป API
  const handleSubmit = async () => {
    try {
      if (!isLiffInitialized || !userId) {
        message.error("กรุณารอสักครู่... กำลังเชื่อมต่อกับ LINE");
        return;
      }

      // ✅ แปลงค่าให้พร้อม stringify
      const safeData = {
        ...formData,
        dob: formData.dob
          ? typeof formData.dob === "string"
            ? formData.dob
            : formData.dob.format("YYYY-MM-DD")
          : null,
      };

      // ✅ รวม userId เข้าไปใน payload ก่อนส่ง
      const payload = { ...safeData, user_id: userId };

      const res = await fetch("/api/users", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload), // ตอนนี้ stringify ได้แล้ว
      });

      const data = await res.json();
      if (res.ok) {
        message.success("สมัครสมาชิกเรียบร้อยแล้ว! 🎉");
      } else {
        message.error("Error: " + data.error);
      }
    } catch (err) {
      console.error(err);
      message.error("เกิดข้อผิดพลาดที่ server");
    }
  };

  // Array ของ steps
  const steps = [
    {
      title: "ข้อมูลทั่วไป",
      content: <RegisterForm formData={formData} onChange={handleChange} />,
    },
    {
      title: "เป้าหมายประจำวัน",
      content: <TargetForm formData={formData} onChange={handleChange} />,
    },
    {
      title: "เสร็จสิ้น",
      content: (
        <div>
          ✅ ตรวจสอบข้อมูลและกดยืนยัน
          <pre className="bg-gray-100 text-xs p-2 mt-2 rounded">
            {JSON.stringify(formData, null, 2)}
          </pre>
        </div>
      ),
    },
  ];

  // ฟังก์ชันเปลี่ยน step
  const next = () => setCurrent((prev) => prev + 1);
  const prev = () => setCurrent((prev) => prev - 1);

  return (
    <div className="p-4 flex flex-col justify-center">
      {/* Steps header */}
      <Steps
        current={current}
        items={steps.map((s) => ({ key: s.title, title: s.title }))}
      />

      {/* Content */}
      <div className="my-4">{steps[current].content}</div>

      {/* Navigation buttons */}
      <div className="flex gap-2 justify-around">
        {current > 0 && <Button onClick={prev}>ย้อนกลับ</Button>}
        {current === steps.length - 1 ? (
          <Button type="primary" onClick={handleSubmit}>
            เสร็จสิ้น
          </Button>
        ) : (
          <Button type="primary" onClick={next}>
            ถัดไป
          </Button>
        )}
      </div>
    </div>
  );
}
