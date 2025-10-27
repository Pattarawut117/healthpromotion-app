'use client';

import React, { useState } from 'react';
import UserPicture from './profile/UserPicture';
import { RegisterFormData } from '@/app/user/register/page';
import Image from 'next/image'; // ✅ Import Image component

// Props type
type Props = {
  formData: RegisterFormData;
  onChange: <T>(field: keyof RegisterFormData, value: T) => void;
};

type FileUploaderProps = {
  onChange: <T>(field: keyof RegisterFormData, value: T) => void;
}; 

// Custom File Uploader Component
const FileUploader: React.FC<FileUploaderProps> = ({ onChange}) => {
  const [preview, setPreview] = useState<string | null>(null);

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      // Create a preview
      const reader = new FileReader();
      reader.onloadend = () => {
        setPreview(reader.result as string);
      };
      reader.readAsDataURL(file);

      // Mock upload
      const formData = new FormData();
      formData.append('file', file);

      try {
        const response = await fetch('/api/upload', {
          method: 'POST',
          body: formData,
        });
        const result = await response.json();
        if (response.ok && result.success) {
          console.log('Upload success:', result.path);
          onChange('before_pic', result.path || '');
        } else {
          console.error('Upload failed:', result.error);
        }
      } catch (error) {
        console.error('Upload error:', error);
      }
    }
  };

  return (
    <div className="border-2 border-dashed border-input rounded-lg p-8 text-center">
      <input
        type="file"
        id="file-upload"
        className="hidden"
        onChange={handleFileChange}
        accept=".png,.jpg,.jpeg"
      />
      <label htmlFor="file-upload" className="cursor-pointer">
        {preview ? (
          <Image // ✅ Use Next.js Image component
            src={preview}
            alt="Preview"
            width={96} // ✅ Add a fixed width
            height={96} // ✅ Add a fixed height
            className="mx-auto h-24 w-24 object-cover rounded-lg"
          />
        ) : (
          <div className="flex flex-col items-center">
            <svg
              className="w-12 h-12 text-muted-foreground"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="2"
                d="M7 16a4 4 0 01-4-4V7a4 4 0 014-4h10a4 4 0 014 4v5a4 4 0 01-4 4H7z"
              ></path>
            </svg>
            <p className="mt-2 text-sm text-muted-foreground">+ Upload Image</p>
            <p className="text-xs text-muted-foreground">
              Supports .png, .jpg, .jpeg
            </p>
          </div>
        )}
      </label>
    </div>
  );
};

export default function RegisterForm({ formData, onChange }: Props) {
  const inputClasses =
    'w-full p-2 border border-input rounded-md focus:ring-primary focus:border-primary bg-background';

  return (
    <div className="px-4 flex flex-col items-center">
      <UserPicture />
      <form className="w-full max-w-md space-y-4">
        <div className="p-4 border rounded-2xl shadow-sm bg-card text-card-foreground">
          <legend className="font-semibold mb-4">General Information</legend>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label
                htmlFor="sname"
                className="block text-sm font-medium text-muted-foreground mb-1"
              >
                First Name
              </label>
              <input
                type="text"
                id="sname"
                placeholder="First Name"
                value={formData.sname}
                onChange={(e) => onChange('sname', e.target.value || '')}
                className={inputClasses}
                required
              />
            </div>
            <div>
              <label
                htmlFor="lname"
                className="block text-sm font-medium text-muted-foreground mb-1"
              >
                Last Name
              </label>
              <input
                type="text"
                id="lname"
                placeholder="Last Name"
                value={formData.lname}
                onChange={(e) => onChange('lname', e.target.value || '')}
                className={inputClasses}
                required
              />
            </div>
          </div>

          <div className="mt-4">
            <label
              htmlFor="tel"
              className="block text-sm font-medium text-muted-foreground mb-1"
            >
              Phone Number
            </label>
            <input
              type="tel"
              id="tel"
              placeholder="Phone Number"
              value={formData.tel}
              onChange={(e) => onChange('tel', e.target.value || '')}
              className={inputClasses}
              required
            />
          </div>

          <div className="mt-4">
            <label
              htmlFor="dob"
              className="block text-sm font-medium text-muted-foreground mb-1"
            >
              Date of Birth
            </label>
            <input
              type="date"
              id="dob"
              className={inputClasses}
              value={formData.dob ? formData.dob.toString() : ''}
              onChange={(e) => onChange('dob', e.target.value || null)}
              required
            />
          </div>

          <div className="mt-4">
            <label
              htmlFor="gender"
              className="block text-sm font-medium text-muted-foreground mb-1"
            >
              Gender
            </label>
            <select
              id="gender"
              value={formData.gender}
              onChange={(e) => onChange('gender', e.target.value || '')}
              className={inputClasses}
              required
            >
              <option value="" disabled>
                Select Gender
              </option>
              <option value="ชาย">ชาย</option>
              <option value="หญิง">หญิง</option>
              <option value="อื่นๆ">อื่นๆ</option>
            </select>
          </div>
        </div>

        <div className="p-4 border rounded-2xl shadow-sm bg-card text-card-foreground">
          <legend className="font-semibold mb-4">Health Information</legend>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label
                htmlFor="height"
                className="block text-sm font-medium text-muted-foreground mb-1"
              >
                Height (cm)
              </label>
              <input
                type="number"
                id="height"
                placeholder="Height (cm)"
                value={formData.height}
                onChange={(e) =>
                  onChange('height', e.target.value ? Number(e.target.value) : 0)
                }
                className={inputClasses}
                required
              />
            </div>
            <div>
              <label
                htmlFor="weight"
                className="block text-sm font-medium text-muted-foreground mb-1"
              >
                Weight (kg)
              </label>
              <input
                type="number"
                id="weight"
                placeholder="Weight (kg)"
                value={formData.weight}
                onChange={(e) =>
                  onChange('weight', e.target.value ? Number(e.target.value) : 0)
                }
                className={inputClasses}
                required
              />
            </div>
          </div>

          <div className="mt-4">
            <label
              htmlFor="level_activity"
              className="block text-sm font-medium text-muted-foreground mb-1"
            >
              Physical Activity Level
            </label>
            <select
              id="level_activity"
              value={formData.level_activity}
              onChange={(e) => onChange('level_activity', e.target.value || '')}
              className={inputClasses}
              required
            >
              <option value="" disabled>
                Select Activity Level
              </option>
              <option value="นั่งทำงานอยู่กับที่ ไม่ออกกำลังกายเลย">นั่งทำงานอยู่กับที่ ไม่ออกกำลังกายเลย</option>
              <option value="ออกกำลังกาย 1-2 ครั้ง/สัปดาห์">ออกกำลังกาย 1-2 ครั้ง/สัปดาห์</option>
              <option value="ออกกำลังกาย 3-5 ครั้ง/สัปดาห์">ออกกำลังกาย 3-5 ครั้ง/สัปดาห์</option>
              <option value="ออกกำลังกาย 6-7 ครั้ง/สัปดาห์">ออกกำลังกาย 6-7 ครั้ง/สัปดาห์</option>
              <option value="เป็นนักกีฬา/นักวิ่ง ออกกำลังกายทุกวัน วันละ 2 ครั้งขึ้นไป">เป็นนักกีฬา/นักวิ่ง ออกกำลังกายทุกวัน วันละ 2 ครั้งขึ้นไป</option>
            </select>
          </div>
        </div>

        <div className="p-4 border rounded-2xl shadow-sm bg-card text-card-foreground">
          <legend className="font-semibold mb-2">Profile Picture</legend>
          <FileUploader onChange={onChange} />
        </div>
      </form>
    </div>
  );
}
