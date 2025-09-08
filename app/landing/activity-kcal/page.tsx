import React from "react";
import { ArrowLeftOutlined } from "@ant-design/icons";
import Link from "next/link";

export default function ActivityKcalPage() {
  return (
    <div className="flex flex-col p-4">
      <Link href="/profile">
      <div className="flex gap-4 mb-4">
      <ArrowLeftOutlined/> <p>คำอธิบายเพิ่มเติม</p>
      </div>
      </Link>
      <div className="bg-white rounded-2xl p-2 shadow-2xs">
        <p className="text-gray-800">
          TDEE (Total Daily Energy Expenditure) คือ พลังงาน
          รวมที่ร่างกายเราใช้ไปในหนึ่งวัน โดยแบ่งสัดส่วนการใช้ งานได้ 3 ด้าน คือ
        </p>
        <br />
        <p className="text-gray-800">
          1.
          พลังงานที่ใช้ในการดำรงชีวิตหรือที่เรียกว่าอัตราการเผาผาลพลังงานขั้นพื้นฐาน
          Basal Metabolic Rate(BMR) มีสัดส่วนการใช้พลังงานระหว่าง 60-75%
          ในการทำงานของอวัยวะต่างๆ เช่น การหายใจ การเต้นของหัวใจ
          การไหลเวียนเลือด เพื่อให้ร่างกายทำงานได้ตามปกติ
          จึงจำเป็นต้องรับพลังงานเข้าไปขั้นต่ำเทียบเท่ากับพลังงานส่วนนี้
        </p>
        <br />
        <p className="text-gray-800">
          2. พลังงานที่ใช้ทำกิจกรรมต่างๆ (Physical Activity)
          มีสัดส่วนการใช้พลังงานระหว่าง 17-32% เช่น เดินทำงาน ออกกำลังกาย
          ดังนั้นหากทำกิจกรรมเพิ่มขึ้นการใช้พลังงานส่วนนี้ก็จะได้มากขึ้นด้วย
        </p>
        <br />
        <p className="text-gray-800">
          3. พลังงานที่ใช้ในการย่อยอาหาร (Thermic Effect Food)
          มีสัดส่วนการใช้พลังงานระหว่าง 8-10%
        </p>
        <br />
        <p className="text-gray-800">
          หมายเหตุ : พลังงานขาเข้าที่ควรได้รับจากการบริโภคอาหารแต่ละวัน
          ไม่ควรต่ำกว่า BMR และไม่ควรเกิน TDEE
        </p>
      </div>
    </div>
  );
}
