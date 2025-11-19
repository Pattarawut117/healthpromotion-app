"use client";

import React from "react";
import { RegisterFormData } from "@/app/user/register/page";

type Props = {
  formData: RegisterFormData;
  onChange: <T>(field: keyof RegisterFormData, value: T) => void;
};

export default function TargetForm({ formData, onChange }: Props) {
  return (
    <div className="px-4 py-1 flex flex-col items-center">
      <form className="w-full max-w-md space-y-4">
        <div className="border">
          <label htmlFor="sleepPerHour">ส่วนใหญ่ท่านนอนวันละกี่ชั่วโมง</label>
          <select name="sleepPerHour" onChange={(e)=> onChange("sleepPerHour", e.target.value)}>
            <option value="4 ชั่วโมง/วัน">4 ชั่วโมง/วัน</option>
            <option value="5 ชั่วโมง/วัน">5 ชั่วโมง/วัน</option>
            <option value="6 ชั่วโมง/วัน">6 ชั่วโมง/วัน</option>
          </select>
          <div className="flex flex-col">
          <label htmlFor="sleeoEnough">ท่านคิดว่าชั่วโมงการนอนเพียงพอหรือไม่</label>
          <div className="grid grid-cols-2">
            <label><input type="radio" name="sleepEnough" value="เพียงพอ" onChange={(e)=> onChange("sleepEnough",e.target.value)}/>เพียงพอ</label>
            <label ><input type="radio" name="sleepEnough" value="ไม่เพียงพอ" onChange={(e)=> onChange("sleepEnough",e.target.value)}/>ไม่เพียงพอ</label>
          </div>
          </div>
        </div>
        <div className="border">
          <div className="flex flex-col">
            <label htmlFor="isSmoke">ท่านสูบบุหรี่หรือไม่ อย่างไร</label>
            <div className="grid grid-cols-2">
              <label>
                <input
                  type="radio"
                  name="isSmoke"
                  value="สูบ"
                  checked={formData.isSmoke === "สูบ"}
                  onChange={(e) => onChange("isSmoke", e.target.value)}
                />
                สูบ
              </label>
              <label>
                <input
                  type="radio"
                  name="isSmoke"
                  value="ไม่สูบ"
                  checked={formData.isSmoke === "ไม่สูบ"}
                  onChange={(e) => onChange("isSmoke", e.target.value)}
                />
                ไม่สูบ
              </label>
            </div>
          </div>
          <div className="flex flex-col">
            <label htmlFor="drinkBeer">
              ท่านดื่มเบียร์เกิน 4 กระป๋องหรือ 2
              ขวดใหญ่หรือสุราเกินครึ่งแบนขึ้นไปหรือไม่
            </label>
            <div className="grid grid-cols-2">
              <label>
                <input
                  type="radio"
                  name="drinkBeer"
                  value="ไม่เคยเลย"
                  checked={formData.drinkBeer === "ไม่เคยเลย"}
                  onChange={(e) => onChange("drinkBeer", e.target.value)}
                />
                ไม่เคยเลย
              </label>
              <label>
                <input
                  type="radio"
                  name="drinkBeer"
                  value="เดือนละครั้ง"
                  checked={formData.drinkBeer === "เดือนละครั้ง"}
                  onChange={(e) => onChange("drinkBeer", e.target.value)}
                />
                เดือนละครั้ง
              </label>
              <label>
                <input
                  type="radio"
                  name="drinkBeer"
                  value="สัปดาห์ละครั้ง"
                  checked={formData.drinkBeer === "สัปดาห์ละครั้ง"}
                  onChange={(e) => onChange("drinkBeer", e.target.value)}
                />
                สัปดาห์ละครั้ง
              </label>
              <label>
                <input
                  type="radio"
                  name="drinkBeer"
                  value="ทุกวันหรือเกือบทุกวัน"
                  checked={formData.drinkBeer === "ทุกวันหรือเกือบทุกวัน"}
                  onChange={(e) => onChange("drinkBeer", e.target.value)}
                />
                ทุกวันหรือเกือบทุกวัน
              </label>
            </div>
          </div>
          <div className="flex flex-col">
            <label htmlFor="drinkWater">
              ท่านดื่มน้ำสะอาดวันละเท่าไหร่ (แก้ว 250 มล. ขวดเล็ก 600 มล.
              ขวดใหญ่ 1,500 มล.)
            </label>
            <div className="flex flex-col">
              <label>
                <input
                  type="radio"
                  name="drinkWater"
                  value="ดื่มน้อยกว่า 4 แก้ว (1,000 มล.)"
                  checked={
                    formData.drinkWater === "ดื่มน้อยกว่า 4 แก้ว (1,000 มล.)"
                  }
                  onChange={(e) => onChange("drinkWater", e.target.value)}
                />
                ดื่มน้อยกว่า 4 แก้ว (1,000 มล.)
              </label>
              <label>
                <input
                  type="radio"
                  name="drinkWater"
                  value="ดื่ม 4-6 แก้ว (มากกว่า 1,000-1,500 มล.)"
                  checked={
                    formData.drinkWater ===
                    "ดื่ม 4-6 แก้ว (มากกว่า 1,000-1,500 มล.)"
                  }
                  onChange={(e) => onChange("drinkWater", e.target.value)}
                />
                ดื่ม 4-6 แก้ว (มากกว่า 1,000-1,500 มล.)
              </label>
              <label>
                <input
                  type="radio"
                  name="drinkWater"
                  value="ดื่มมากกว่า 6-8 แก้ว (มากกว่า 1,500-2,000 มล.)"
                  checked={
                    formData.drinkWater ===
                    "ดื่มมากกว่า 6-8 แก้ว (มากกว่า 1,500-2,000 มล.)"
                  }
                  onChange={(e) => onChange("drinkWater", e.target.value)}
                />
                ดื่มมากกว่า 6-8 แก้ว (มากกว่า 1,500-2,000 มล.)
              </label>
              <label>
                <input
                  type="radio"
                  name="drinkWater"
                  value="ดื่มมากกว่า 8-10 แก้ว (มากกว่า 2,000-2,500 มล.)"
                  checked={
                    formData.drinkWater ===
                    "ดื่มมากกว่า 8-10 แก้ว (มากกว่า 2,000-2,500 มล.)"
                  }
                  onChange={(e) => onChange("drinkWater", e.target.value)}
                />
                ดื่มมากกว่า 8-10 แก้ว (มากกว่า 2,000-2,500 มล.)
              </label>
            </div>
          </div>
        </div>
        <div className="border">
          {/* 1. */}
          <div className="flex flex-col">
            <label htmlFor="sleepProblem">
              มีปัญหาการนอน นอนไม่หลับหรือนอนมาก
            </label>
            <div className="flex flex-col">
              <label>
                <input
                  type="radio"
                  name="sleepProblem"
                  value="น้อยมากหรือแทบไม่มี"
                  checked={formData.sleepProblem === "น้อยมากหรือแทบไม่มี"}
                  onChange={(e) => onChange("sleepProblem", e.target.value)}
                />
                น้อยมากหรือแทบไม่มี
              </label>
              <label>
                <input
                  type="radio"
                  name="sleepProblem"
                  value="เป็นบางครั้ง"
                  checked={formData.sleepProblem === "เป็นบางครั้ง"}
                  onChange={(e) => onChange("sleepProblem", e.target.value)}
                />
                เป็นบางครั้ง
              </label>
              <label>
                <input
                  type="radio"
                  name="sleepProblem"
                  value="เป็นบ่อยครั้ง"
                  checked={formData.sleepProblem === "เป็นบ่อยครั้ง"}
                  onChange={(e) => onChange("sleepProblem", e.target.value)}
                />
                เป็นบ่อยครั้ง
              </label>
              <label>
                <input
                  type="radio"
                  name="sleepProblem"
                  value="เป็นประจำ"
                  checked={formData.sleepProblem === "เป็นประจำ"}
                  onChange={(e) => onChange("sleepProblem", e.target.value)}
                />
                เป็นประจำ
              </label>
            </div>
          </div>
          {/* 2. */}
          <div className="flex flex-col">
            <label htmlFor="adhd">มีสมาธิน้อยลง</label>
            <div className="flex flex-col">
              <label>
                <input
                  type="radio"
                  name="adhd"
                  value="น้อยมากหรือแทบไม่มี"
                  checked={formData.adhd === "น้อยมากหรือแทบไม่มี"}
                  onChange={(e) => onChange("adhd", e.target.value)}
                />
                น้อยมากหรือแทบไม่มี
              </label>
              <label>
                <input
                  type="radio"
                  name="adhd"
                  value="เป็นบางครั้ง"
                  checked={formData.adhd === "เป็นบางครั้ง"}
                  onChange={(e) => onChange("adhd", e.target.value)}
                />
                เป็นบางครั้ง
              </label>
              <label>
                <input
                  type="radio"
                  name="adhd"
                  value="เป็นบ่อยครั้ง"
                  checked={formData.adhd === "เป็นบ่อยครั้ง"}
                  onChange={(e) => onChange("adhd", e.target.value)}
                />
                เป็นบ่อยครั้ง
              </label>
              <label>
                <input
                  type="radio"
                  name="adhd"
                  value="เป็นประจำ"
                  checked={formData.adhd === "เป็นประจำ"}
                  onChange={(e) => onChange("adhd", e.target.value)}
                />
                เป็นประจำ
              </label>
            </div>
          </div>
          {/* 3. */}
          <div className="flex flex-col">
            <label htmlFor="madness">หงุดหงิด</label>
            <div className="flex flex-col">
              <label>
                <input
                  type="radio"
                  name="madness"
                  value="น้อยมากหรือแทบไม่มี"
                  checked={formData.madness === "น้อยมากหรือแทบไม่มี"}
                  onChange={(e) => onChange("madness", e.target.value)}
                />
                น้อยมากหรือแทบไม่มี
              </label>
              <label>
                <input
                  type="radio"
                  name="madness"
                  value="เป็นบางครั้ง"
                  checked={formData.madness === "เป็นบางครั้ง"}
                  onChange={(e) => onChange("madness", e.target.value)}
                />
                เป็นบางครั้ง
              </label>
              <label>
                <input
                  type="radio"
                  name="madness"
                  value="เป็นบ่อยครั้ง"
                  checked={formData.madness === "เป็นบ่อยครั้ง"}
                  onChange={(e) => onChange("madness", e.target.value)}
                />
                เป็นบ่อยครั้ง
              </label>
              <label>
                <input
                  type="radio"
                  name="madness"
                  value="เป็นประจำ"
                  checked={formData.madness === "เป็นประจำ"}
                  onChange={(e) => onChange("madness", e.target.value)}
                />
                เป็นประจำ
              </label>
            </div>
          </div>
          {/* 4. */}
          <div className="flex flex-col">
            <label htmlFor="bored">รู้สึกเบื่อ เซ็ง</label>
            <div className="flex flex-col">
              <label>
                <input
                  type="radio"
                  name="bored"
                  value="น้อยมากหรือแทบไม่มี"
                  checked={formData.bored === "น้อยมากหรือแทบไม่มี"}
                  onChange={(e) => onChange("bored", e.target.value)}
                />
                น้อยมากหรือแทบไม่มี
              </label>
              <label>
                <input
                  type="radio"
                  name="bored"
                  value="เป็นบางครั้ง"
                  checked={formData.bored === "เป็นบางครั้ง"}
                  onChange={(e) => onChange("bored", e.target.value)}
                />
                เป็นบางครั้ง
              </label>
              <label>
                <input
                  type="radio"
                  name="bored"
                  value="เป็นบ่อยครั้ง"
                  checked={formData.bored === "เป็นบ่อยครั้ง"}
                  onChange={(e) => onChange("bored", e.target.value)}
                />
                เป็นบ่อยครั้ง
              </label>
              <label>
                <input
                  type="radio"
                  name="bored"
                  value="เป็นประจำ"
                  checked={formData.bored === "เป็นประจำ"}
                  onChange={(e) => onChange("bored", e.target.value)}
                />
                เป็นประจำ
              </label>
            </div>
          </div>
          {/* 5. */}
          <div className="flex flex-col">
            <label htmlFor="introvert">ไม่อยากพบปะผู้คน</label>
            <div className="flex flex-col">
              <label>
                <input
                  type="radio"
                  name="introvert"
                  value="น้อยมากหรือแทบไม่มี"
                  checked={formData.introvert === "น้อยมากหรือแทบไม่มี"}
                  onChange={(e) => onChange("introvert", e.target.value)}
                />
                น้อยมากหรือแทบไม่มี
              </label>
              <label>
                <input
                  type="radio"
                  name="introvert"
                  value="เป็นบางครั้ง"
                  checked={formData.introvert === "เป็นบางครั้ง"}
                  onChange={(e) => onChange("introvert", e.target.value)}
                />
                เป็นบางครั้ง
              </label>
              <label>
                <input
                  type="radio"
                  name="introvert"
                  value="เป็นบ่อยครั้ง"
                  checked={formData.introvert === "เป็นบ่อยครั้ง"}
                  onChange={(e) => onChange("introvert", e.target.value)}
                />
                เป็นบ่อยครั้ง
              </label>
              <label>
                <input
                  type="radio"
                  name="introvert"
                  value="เป็นประจำ"
                  checked={formData.introvert === "เป็นประจำ"}
                  onChange={(e) => onChange("introvert", e.target.value)}
                />
                เป็นประจำ
              </label>
            </div>
          </div>
        </div>
      </form>
    </div>
  );
}
