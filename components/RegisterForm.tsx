'use client';

import React from 'react';
import UserPicture from './profile/UserPicture';
import { RegisterFormData } from '@/app/user/register/page';
import unitData from '@/app/user/data/data';
import Select from 'react-select';


// Props type
type Props = {
  formData: RegisterFormData;
  onChange: <T>(field: keyof RegisterFormData, value: T) => void;
};

// FileUploader removed as it's not supporting the current API values.

export default function RegisterForm({ formData, onChange }: Props) {

  const inputClasses =
    'input w-full p-2 border border-input rounded-md focus:ring-primary focus:border-primary bg-background';

  const unitOptions = unitData.map((unit) => ({
    value: unit.value,
    label: unit.text,
  }));


  return (
    <div className="px-4 flex flex-col items-center">
      <UserPicture />
      <form className="w-full max-w-md space-y-4">
        {/* General Information */}
        <div className="p-4 border rounded-2xl shadow-sm bg-card text-card-foreground">
          <legend className="font-semibold mb-4">ข้อมูลทั่วไป</legend>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label htmlFor="sname" className="block text-sm font-medium text-muted-foreground mb-1">
                ชื่อจริง
              </label>
              <input
                type="text"
                id="sname"
                placeholder="ชื่อจริง"
                value={formData.sname}
                onChange={(e) => onChange("sname", e.target.value || "")}
                className={inputClasses}
                required
              />
            </div>
            <div>
              <label htmlFor="lname" className="block text-sm font-medium text-muted-foreground mb-1">
                นามสกุล
              </label>
              <input
                type="text"
                id="lname"
                placeholder="นามสกุล"
                value={formData.lname}
                onChange={(e) => onChange("lname", e.target.value || "")}
                className={inputClasses}
                required
              />
            </div>
          </div>

          <div className="mt-4">
            <label htmlFor="tel" className="block text-sm font-medium text-muted-foreground mb-1">
              เบอร์โทรศัพท์
            </label>
            <input
              type="tel"
              id="tel"
              placeholder="เบอร์โทรศัพท์"
              inputMode="numeric"
              pattern="[0-9]*"
              value={formData.tel}
              onChange={(e) => onChange("tel", e.target.value || "")}
              className={inputClasses}
              required
            />
          </div>

          <div className="mt-4">
            <label htmlFor="dob" className="block text-sm font-medium text-muted-foreground mb-1">
              วัน/เดือน/ปี เกิด
            </label>
            <input
              type="date"
              id="dob"
              className={inputClasses}
              value={formData.dob ? formData.dob.toString() : ""}
              onChange={(e) => onChange("dob", e.target.value || null)}
              required
            />
          </div>

          <div className="mt-4">
            <label htmlFor="gender" className="block text-sm font-medium text-muted-foreground mb-1">
              เพศ
            </label>
            <select
              id="gender"
              value={formData.gender}
              onChange={(e) => onChange("gender", e.target.value || "")}
              className={`select ${inputClasses}`}
              required
            >
              <option value="" disabled>ระบุเพศ</option>
              <option value="ชาย">ชาย</option>
              <option value="หญิง">หญิง</option>
              <option value="อื่นๆ">อื่นๆ</option>
            </select>
          </div>

          <div className="mt-4">
            <label htmlFor="unit" className="block text-sm font-medium text-muted-foreground mb-1">
              หน่วยงาน
            </label>
            <Select
              id="unit"
              value={unitOptions.find((opt) => opt.value === formData.unit)}
              onChange={(option) => onChange("unit", option?.value || "")}
              options={unitOptions}
              placeholder="ระบุหน่วยงาน"
              className="basic-single"
              classNamePrefix="select"
              isClearable
              isSearchable
              required
            />
          </div>

          <div className="mt-4">
            <label htmlFor="workingLongtime" className="block text-sm font-medium text-muted-foreground mb-1">
              ท่านนั่ง หรืเอนกายเฉยๆติดต่อกันนาน เกิน 2 ชั่วโมงหรือไม่
            </label>
            <select
              id="workingLongtime"
              value={formData.workingLongtime}
              onChange={(e) => onChange('workingLongtime', e.target.value || '')}
              className={`select ${inputClasses}`}
            >
              <option value="" disabled>ระบุ</option>
              <option value="น้อยกว่า 2 ชั่วโมง">น้อยกว่า 2 ชั่วโมง</option>
              <option value="มากกว่า 2 ชั่วโมง">มากกว่า 2 ชั่วโมง</option>
            </select>
          </div>
        </div>

        {/* Health Information */}
        <div className="p-4 border rounded-2xl shadow-sm bg-card text-card-foreground">
          <legend className="font-semibold mb-4">ข้อมูลสุขภาพ</legend>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label htmlFor="height" className="block text-sm font-medium text-muted-foreground mb-1">
                ส่วนสูง (cm)
              </label>
              <input
                type="text"
                id="height"
                placeholder="ส่วนสูง (cm)"
                value={formData.height}
                inputMode="decimal"
                pattern="[0-9.]*"
                onChange={(e) => {
                  const val = e.target.value;
                  onChange('height', val);
                  const h = Number(val);
                  const w = Number(formData.weight);
                  if (!isNaN(h) && h > 0 && !isNaN(w) && w > 0) {
                    const bmi = w / ((h / 100) * (h / 100));
                    onChange('bmi', parseFloat(bmi.toFixed(2)));
                  }
                }}
                className={inputClasses}
                required
              />
            </div>
            <div>
              <label htmlFor="weight" className="block text-sm font-medium text-muted-foreground mb-1">
                น้ำหนัก (kg)
              </label>
              <input
                type="text"
                id="weight"
                placeholder="น้ำหนัก (kg)"
                value={formData.weight}
                inputMode="decimal"
                pattern="[0-9.]*"
                onChange={(e) => {
                  const val = e.target.value;
                  onChange('weight', val);

                  const w = Number(val);
                  const h = Number(formData.height);
                  if (!isNaN(h) && h > 0 && !isNaN(w) && w > 0) {
                    const bmi = w / ((h / 100) * (h / 100));
                    onChange('bmi', parseFloat(bmi.toFixed(2)));
                  }
                }}
                className={inputClasses}
                required
              />
            </div>
          </div>

          <div className="mt-4">
            <label className="block text-sm font-medium text-muted-foreground mb-1">
              BMI (Auto-calculated)
            </label>
            <div className="p-2 bg-muted rounded-md text-center font-bold">
              {formData.bmi || '-'}
            </div>
          </div>
        </div>
      </form>
    </div>
  );
}
