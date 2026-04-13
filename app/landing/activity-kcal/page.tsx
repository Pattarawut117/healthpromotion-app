import React from "react";
import { ArrowLeftOutlined, InfoCircleOutlined, FireOutlined, RetweetOutlined } from "@ant-design/icons";
import Link from "next/link";

export default function ActivityKcalPage() {
  return (
    <div className="min-h-screen bg-base-200 text-base-content pb-10">
      {/* Top Navbar */}
      <div className="navbar bg-base-100 sticky top-0 z-50 shadow-sm px-4">
        <div className="navbar-start">
          <Link href="/profile" className="btn btn-ghost btn-sm px-2">
            <ArrowLeftOutlined /> กลับ
          </Link>
        </div>
        <div className="navbar-center font-bold text-lg">
          คำอธิบายพลังงาน
        </div>
        <div className="navbar-end"></div>
      </div>

      <div className="max-w-xl mx-auto p-4 space-y-4">
        
        {/* Intro */}
        <div className="card bg-base-100 shadow-sm border border-base-200/50">
          <div className="card-body p-5">
            <h2 className="card-title text-xl text-primary mb-2 border-b border-base-200 pb-2">TDEE คืออะไร?</h2>
            <p className="text-base-content/80 font-medium">
              <span className="font-bold text-base-content">TDEE (Total Daily Energy Expenditure)</span> คือ 
              พลังงานรวมที่ร่างกายเราใช้ไปในหนึ่งวัน โดยแบ่งสัดส่วนการใช้งานเป็น 3 ด้านหลัก ดังนี้:
            </p>
          </div>
        </div>

        {/* Section 1 */}
        <div className="card bg-info/10 border border-info/20 shadow-sm">
          <div className="card-body p-5">
            <h3 className="font-bold text-info flex items-center gap-2 mb-1">
              <InfoCircleOutlined /> 1. เผาผลาญพื้นฐาน (BMR)
            </h3>
            <div className="badge badge-info text-white mb-2 font-bold px-3 py-3 text-xs">60-75%</div>
            <p className="text-sm sm:text-base text-base-content/80 leading-relaxed">
              พลังงานที่ใช้ในการดำรงชีวิต หรืออัตราการเผาผลาญพลังงานขั้นพื้นฐาน (<span className="font-semibold">Basal Metabolic Rate</span>) 
              ถูกใช้ไปกับการทำงานของอวัยวะต่างๆ เช่น การหายใจ การเต้นของหัวใจ การไหลเวียนเลือด 
              เพื่อให้ร่างกายทำงานได้ตามปกติ จึงจำเป็นต้องรับพลังงานเข้าไปขั้นต่ำเทียบเท่ากับพลังงานส่วนนี้
            </p>
          </div>
        </div>

        {/* Section 2 */}
        <div className="card bg-success/10 border border-success/20 shadow-sm">
          <div className="card-body p-5">
             <h3 className="font-bold text-success flex items-center gap-2 mb-1">
              <FireOutlined /> 2. การทำกิจกรรมต่างๆ
            </h3>
            <div className="badge badge-success text-white mb-2 font-bold px-3 py-3 text-xs">17-32%</div>
            <p className="text-sm sm:text-base text-base-content/80 leading-relaxed">
              พลังงานที่ใช้ทำกิจกรรมต่างๆ (<span className="font-semibold">Physical Activity</span>)
              เช่น เดิน ทำงาน ออกกำลังกาย ดังนั้นหากทำกิจกรรมเพิ่มขึ้นการใช้พลังงานส่วนนี้ก็จะมากขึ้นด้วย
            </p>
          </div>
        </div>

        {/* Section 3 */}
        <div className="card bg-warning/10 border border-warning/20 shadow-sm">
          <div className="card-body p-5">
             <h3 className="font-bold text-warning flex items-center gap-2 mb-1">
              <RetweetOutlined /> 3. การย่อยอาหาร
            </h3>
            <div className="badge badge-warning text-white mb-2 font-bold px-3 py-3 text-xs opacity-90">8-10%</div>
            <p className="text-sm sm:text-base text-base-content/80 leading-relaxed">
              พลังงานที่ใช้ในการย่อยอาหาร (<span className="font-semibold">Thermic Effect Food</span>) 
              กระบวนการดูดซึมสารอาหารก็ใช้พลังงานเป็นสัดส่วนเล็กน้อยเช่นกัน
            </p>
          </div>
        </div>

        {/* Notice Alert */}
        <div className="alert bg-primary/10 border border-primary/20 mt-4 rounded-xl shadow-sm">
          <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" className="stroke-primary shrink-0 w-8 h-8"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"></path></svg>
          <div>
            <h3 className="font-bold text-primary mb-1 text-base">หมายเหตุสำคัญ</h3>
            <div className="text-sm text-base-content/80 leading-relaxed">
              พลังงานขาเข้าที่ควรได้รับจากการบริโภคอาหารในแต่ละวัน <span className="font-semibold underline decoration-error underline-offset-2">ไม่ควรต่ำกว่า BMR</span> และ <span className="font-semibold underline decoration-error underline-offset-2">ไม่ควรเกิน TDEE</span>
            </div>
          </div>
        </div>

      </div>
    </div>
  );
}
