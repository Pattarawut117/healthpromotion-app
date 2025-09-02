"use client";

import React, { useState } from "react";
import { Button, Steps, message } from "antd";
import RegisterForm from "@/components/RegisterForm";
import TargetForm from "@/components/TargetForm";

export default function RegisterPage() {
  const [current, setCurrent] = useState(0);

  // Array ของ steps
  const steps = [
    {
      title: "ข้อมูลทั่วไป",
      content: <RegisterForm />, // เรียกใช้ Component ตรงนี้
    },
    {
      title: "เป้าหมายประจำวัน",
      content: <TargetForm />, // เรียกใช้ Component ตรงนี้
    },
    {
      title: "เสร็จสิ้น",
      content: <div>✅ ตรวจสอบข้อมูลและกดยืนยัน</div>,
    },
  ];

  // ฟังก์ชันเปลี่ยน step
  const next = () => setCurrent(current + 1);
  const prev = () => setCurrent(current - 1);

  return (
    <div className="p-4 flex flex-col justify-center">
      {/* Header Steps */}
      

      {/* Content */}
      <div className="my-1">{steps[current].content}</div>

      {/* Navigation buttons */}
      <div className="flex gap-2 justify-around ">
        {current > 0 && (
          <Button style={{ marginLeft: 8 }} onClick={prev}>
            ย้อนกลับ
          </Button>
        )}
        {current === steps.length - 1 && (
          <Button type="primary" onClick={() => message.success("🎉 ลงทะเบียนเสร็จสิ้น!")}>
            เสร็จสิ้น
          </Button>
        )}
        {current < steps.length - 1 && (
          <Button type="primary" onClick={next}>
            ถัดไป
          </Button>
        )}
      </div>
    </div>
  );
}