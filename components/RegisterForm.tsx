"use client";

import React from "react";
import {
  Form,
  Input,
  DatePicker,
  Select,
  message,
  Upload,
} from "antd";
import { InboxOutlined } from "@ant-design/icons";
import type { UploadProps } from "antd";
import UserPicture from "./profile/UserPicture";
import dayjs from "dayjs";

type Props = {
  formData: any;
  onChange: (field: string, value: any) => void;
};

export default function RegisterForm({ formData, onChange }: Props) {
  const { Dragger } = Upload;

  const props: UploadProps = {
    name: "file",
    multiple: false,
    action: "https://660d2bd96ddfa2943b33731c.mockapi.io/api/upload",
    onChange(info) {
      const { status } = info.file;
      if (status === "done") {
        message.success(`${info.file.name} อัปโหลดสำเร็จแล้ว`);
        // ✅ เก็บเฉพาะ URL ของไฟล์ (string)
        onChange("before_pic", info.file.response?.url || "");
      } else if (status === "error") {
        message.error(`${info.file.name} อัปโหลดไม่สำเร็จ`);
      }
    },
  };

  return (
    <div className="px-4 py-1 flex flex-col items-center">
      {/* Avatar */}
      <UserPicture />

      {/* Form */}
      <Form layout="vertical" className="w-full max-w-md space-y-2">
        {/* ข้อมูลทั่วไป */}
        <div className="p-4 border rounded-2xl shadow-sm bg-white">
          <legend className="font-semibold mb-2">ข้อมูลทั่วไป</legend>
          <div className="grid grid-cols-2 gap-2">
            <Form.Item required>
              <Input
                placeholder="ชื่อจริง"
                value={formData.sname}
                onChange={(e) => onChange("sname", e.target.value || "")}
              />
            </Form.Item>
            <Form.Item required>
              <Input
                placeholder="นามสกุล"
                value={formData.lname}
                onChange={(e) => onChange("lname", e.target.value || "")}
              />
            </Form.Item>
          </div>

          <Form.Item required>
            <Input
              placeholder="เบอร์โทรศัพท์"
              value={formData.tel}
              onChange={(e) => onChange("tel", e.target.value || "")}
            />
          </Form.Item>

          <Form.Item required>
            <DatePicker
              placeholder="วันเกิด"
              className="w-full"
              value={formData.dob ? dayjs(formData.dob) : null}
              // ✅ เก็บค่าเป็น string YYYY-MM-DD
              onChange={(_, dateString) => onChange("dob", dateString || null)}
            />
          </Form.Item>

          <Form.Item required>
            <Select
              placeholder="เพศ"
              value={formData.gender}
              onChange={(val) => onChange("gender", val || "")}
            >
              <Select.Option value="ชาย">ชาย</Select.Option>
              <Select.Option value="หญิง">หญิง</Select.Option>
              <Select.Option value="อื่นๆ">อื่นๆ</Select.Option>
            </Select>
          </Form.Item>
        </div>

        {/* ข้อมูลสุขภาพ */}
        <div className="p-4 border rounded-2xl shadow-sm bg-white">
          <legend className="font-semibold ">ข้อมูลสุขภาพ</legend>
          <div className="grid grid-cols-2 gap-2">
            <Form.Item required>
              <Input
                type="number"
                placeholder="ส่วนสูง (ซม.)"
                value={formData.height}
                onChange={(e) =>
                  onChange("height", e.target.value ? Number(e.target.value) : 0)
                }
              />
            </Form.Item>
            <Form.Item required>
              <Input
                type="number"
                placeholder="น้ำหนัก (กก.)"
                value={formData.weight}
                onChange={(e) =>
                  onChange("weight", e.target.value ? Number(e.target.value) : 0)
                }
              />
            </Form.Item>
          </div>

          <Form.Item required>
            <Select
              placeholder="ระดับกิจกรรมทางกาย"
              value={formData.level_activity}
              onChange={(val) => onChange("level_activity", val || "")}
            >
              <Select.Option value="นั่งทำงานอยู่กับที่ ไม่ออกกำลังกายเลย">
                นั่งทำงานอยู่กับที่ ไม่ออกกำลังกายเลย
              </Select.Option>
              <Select.Option value="ออกกำลังกาย 1-2 ครั้ง/สัปดาห์">
                ออกกำลังกาย 1-2 ครั้ง/สัปดาห์
              </Select.Option>
              <Select.Option value="ออกกำลังกาย 3-5 ครั้ง/สัปดาห์">
                ออกกำลังกาย 3-5 ครั้ง/สัปดาห์
              </Select.Option>
              <Select.Option value="ออกกำลังกาย 6-7 ครั้ง/สัปดาห์">
                ออกกำลังกาย 6-7 ครั้ง/สัปดาห์
              </Select.Option>
              <Select.Option value="เป็นนักกีฬา/นักวิ่ง ออกกำลังกายทุกวัน วันละ 2 ครั้งขึ้นไป">
                เป็นนักกีฬา/นักวิ่ง ออกกำลังกายทุกวัน วันละ 2 ครั้งขึ้นไป
              </Select.Option>
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
              รองรับเฉพาะไฟล์ .png .jpg .jpeg <br />
              ขนาดไม่เกิน 10 MB
            </p>
          </Dragger>
        </div>
      </Form>
    </div>
  );
}