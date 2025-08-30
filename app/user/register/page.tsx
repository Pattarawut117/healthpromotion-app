import React from "react";
import { Avatar } from "antd";
import { UserOutlined } from "@ant-design/icons";
import registerForm from "@/components/registerForm";
import { Form, Input, DatePicker, Upload } from "antd";

export default function RegisterPage() {
  return (
    <div className="px-2 border p-2 rounded-2xl flex flex-col justify-center">
      <Avatar size={128} icon={<UserOutlined />} className="flex" />
      <div className="mt-3 flex justify-center">
        <Form>
          <legend>ข้อมูลทั่วไป</legend>
          <div className="flex gap-2 mb-2">
            <Input type="text" placeholder="Fisrtname" />
            <Input type="text" placeholder="Surname" />
          </div>
          <div className="flex gap-2 mt-2 mb-2">
            <Input type="text" placeholder="เบอร์โทรศัพท์" />
            <DatePicker className="w-full" />
          </div>
          <Upload listType="picture-card"></Upload>
        </Form>
      </div>

      <div className="mt-3 flex px-2 p-2">
        <Form>
          <legend>ข้อมูลสุขภาพ</legend>
          <Input type="number" placeholder="ส่วนสูง" />
          <Input type="number" placeholder="น้ำหนัก"/>
        </Form>
      </div>
    </div>
  );
}
