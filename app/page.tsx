"use client";

import { useLiff } from "@/contexts/LiffContext";
import Carousel from "@/components/home/Carousel";
import { FloatButton } from "antd";
import { CommentOutlined, CustomerServiceOutlined } from "@ant-design/icons";

export default function Home() {
  const {profile, isLoggedIn} = useLiff();

  if(!isLoggedIn) return <p>กำลังโหลด...</p>

  return (
    <div className="flex flex-col gap-4 justify-center mt-2 p-2">
      <div className="w-full flex flex-col items-center bg-white rounded-lg shadow-md p-4 px-2 py-2">
        <p>Pinky Bank</p>
        <div className="grid grid-cols-3 divide-x-4 w-full bg-gray-200 px-2 py-2 rounded-2xl">
          <div>1</div>
          <div>2</div>
          <div>3</div>
        </div>
      </div>
      <p>กิจกรรมสุขภาพของคุณวันนี้</p>
      <div>
        <Carousel />
      </div>

      <div className="bg-white w-full h-56 px-2 py-2 shadow-md rounded-lg flex justify-center items-center">
        <p>ยังไม่มีข้อมูล</p>
      </div>
      <div className="flex">
        <FloatButton.Group
          trigger="click"
          type="primary"
          style={{ insetInlineEnd: 36 }}
          icon={<CustomerServiceOutlined />}
        >
          <div className="flex gap-2 w-48">
            <p>บันทึกออกกำลังกาย</p> <FloatButton />
          </div>
          <div className="flex w-35 gap-2">
            <p>บันทึกการดื่มน้ำ</p>
            <FloatButton icon={<CommentOutlined />} />
          </div>
        </FloatButton.Group>
      </div>
    </div>
  );
}
