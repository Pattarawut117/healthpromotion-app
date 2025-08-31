"use client";

import React from "react";
import { Avatar, Form, Input, DatePicker, Select, message, Upload, Button } from "antd";
import { UserOutlined, InboxOutlined } from "@ant-design/icons";
import type { UploadProps } from "antd";

type RegisterFormValues = {
  firstname: string;
  surname: string;
  phone: string;
  birthdate: string;
  gender: string;
  height: number;
  weight: number;
  activity: string;
};

export default function RegisterPage() {
  const { Dragger } = Upload;

  const props: UploadProps = {
    name: "file",
    multiple: false,
    action: "https://660d2bd96ddfa2943b33731c.mockapi.io/api/upload",
    onChange(info) {
      const { status } = info.file;
      if (status === "done") {
        message.success(`${info.file.name} อัปโหลดสำเร็จแล้ว`);
      } else if (status === "error") {
        message.error(`${info.file.name} อัปโหลดไม่สำเร็จ`);
      }
    },
  };

  const onFinish = (values: RegisterFormValues) => {
    console.log("Form Submitted: ", values);
  };

  return (
    <div className="px-4 py-6 flex flex-col items-center">
      {/* Avatar */}
      <Avatar size={128} icon={<UserOutlined />} className="border shadow" />

      {/* Form */}
      <Form layout="vertical" onFinish={onFinish} className="w-full max-w-md space-y-2">
        
        {/* ข้อมูลทั่วไป */}
        <div className="p-4 border rounded-2xl shadow-sm bg-white">
          <legend className="font-semibold mb-2">ข้อมูลทั่วไป</legend>
          <div className="grid grid-cols-2 gap-2">
            <Form.Item name="firstname" rules={[{ required: true, message: "กรอกชื่อจริง" }]}>
              <Input placeholder="ชื่อจริง" />
            </Form.Item>
            <Form.Item name="surname" rules={[{ required: true, message: "กรอกนามสกุล" }]}>
              <Input placeholder="นามสกุล" />
            </Form.Item>
          </div>

          <Form.Item name="phone" rules={[{ required: true, message: "กรอกเบอร์โทรศัพท์" }]}>
            <Input placeholder="เบอร์โทรศัพท์" />
          </Form.Item>

          <Form.Item name="birthdate" rules={[{ required: true, message: "เลือกวันเกิด" }]}>
            <DatePicker placeholder="วันเกิด" className="w-full" />
          </Form.Item>

          <Form.Item name="gender" rules={[{ required: true, message: "เลือกเพศ" }]}>
            <Select placeholder="เพศ">
              <Select.Option value="ชาย">ชาย</Select.Option>
              <Select.Option value="หญิง">หญิง</Select.Option>
              <Select.Option value="อื่น ๆ">อื่น ๆ</Select.Option>
            </Select>
          </Form.Item>
        </div>

        {/* ข้อมูลสุขภาพ */}
        <div className="p-4 border rounded-2xl shadow-sm bg-white">
          <legend className="font-semibold ">ข้อมูลสุขภาพ</legend>
          <div className="grid grid-cols-2 gap-2">
            <Form.Item name="height" rules={[{ required: true, message: "กรอกส่วนสูง" }]}>
              <Input type="number" placeholder="ส่วนสูง (ซม.)" />
            </Form.Item>
            <Form.Item name="weight" rules={[{ required: true, message: "กรอกน้ำหนัก" }]}>
              <Input type="number" placeholder="น้ำหนัก (กก.)" />
            </Form.Item>
          </div>

          <Form.Item name="activity" rules={[{ required: true, message: "เลือกระดับกิจกรรม" }]}>
            <Select placeholder="ระดับกิจกรรมทางกาย">
              <Select.Option value="level1">Level 1</Select.Option>
              <Select.Option value="level2">Level 2</Select.Option>
            </Select>
          </Form.Item>
        </div>

        {/* อัปโหลดรูป */}
        <div className="p-4 border rounded-2xl shadow-sm bg-white">
          <legend className="font-semibold mb-2">รูปภาพ</legend>
          <Dragger {...props}>
            <p className="ant-upload-drag-icon">
              <InboxOutlined />
            </p>
            <p className="ant-upload-text">+ อัปโหลดรูปภาพ</p>
            <p className="ant-upload-hint">
              รองรับเฉพาะไฟล์ .png .jpg .jpeg <br/>ขนาดไม่เกิน 10 MB
            </p>
          </Dragger>
        </div>

        {/* Submit Button */}
        <Form.Item className="text-center">
          <Button type="primary" htmlType="submit" className="w-full rounded-lg">
            ต่อไป
          </Button>
        </Form.Item>
      </Form>
    </div>
  );
}