"use client";

import React from 'react';
import { RegisterFormData } from '@/app/user/register/page';

type Props = {
  formData: RegisterFormData;
  onChange: <T>(field: keyof RegisterFormData, value: T) => void;
};

export default function TargetForm({ formData, onChange }: Props) {
  const inputClasses =
    'w-full p-2 border border-input rounded-md focus:ring-primary focus:border-primary bg-background';

  interface Field {
    id: keyof RegisterFormData;
    label: string;
    type: 'text' | 'select' | 'checkbox';
    options?: string[];
  }

  interface Section {
    title: string;
    fields: Field[];
  }

  const sections: Section[] = [
    {
      title: 'Health Status',
      fields: [
        {
          id: 'condentialDisease',
          label: 'Congenital Disease (โรคประจำตัว)',
          type: 'checkbox',
          options: ['ความดันโลหิตสูง', 'ไขมันในเลือดสูง', 'โรคเบาหวาน', 'โรคหัวใจ', 'โรคไต', 'โรคปอดอุดกั้นเรื้อรัง', 'มะเร็ง', 'โรคอื่นๆ'],
        },
        {
          id: 'isSmoke',
          label: 'Do you smoke? (การสูบบุหรี่)',
          type: 'select',
          options: ['ไม่สูบ', 'สูบ', 'เคยสูบแต่เลิกแล้ว'],
        },
        {
          id: 'drinkBeer',
          label: 'ท่านดื่มเบียร์เกิน 4 กระป๋องหรือ 2 ขวดใหญ่หรือสุราเกินครึ่งแบนขึ้นไปหรือไม่',
          type: 'select',
          options: ['ไม่เคยเลย', 'เดือนละครั้ง', 'สัปดาห์ละครั้ง', 'ทุกวันหรือเกือบทุกวัน'],
        },
        {
          id: 'drinkWater',
          label: 'ท่านดื่มน้ำวันละไหร่ (แก้ว 250 มล. ขวดเล็ก 600 มล. ขวดใหญ่ 1500 มล.)',
          type: 'select',
          options: ['ดื่มน้อยกว่า 4 แก้ว (1,000 มล.)', '4-6 แก้ว (1,000-1,500 มล.)', 'มากกว่า 6-8 แก้ว (1,500-2,000 มล.)', 'มากกว่า 8-10 แก้ว (2,000-2,500 มล.)'],
        }
      ],
    },
    {
      title: 'Sleep Habits',
      fields: [
        {
          id: 'sleepPerhour',
          label: 'ส่วนใหญ่ท่านนอนวันละกี่ชั่วโมง',
          type: 'select',
          options: ['4 ชั่วโมง/วัน', '5 ชั่วโมง/วัน', '6 ชั่วโมง/วัน', '7 ชั่วโมง/วัน', '8 ชั่วโมง/วัน', 'อื่นๆ'],
        },
        {
          id: 'sleepEnough',
          label: 'ท่านคิดว่าการนอนเพียงพอหรือไม่',
          type: 'select',
          options: ['เพียงพอ', 'ไม่เพียงพอ'],
        },
        {
          id: 'sleepProblem',
          label: 'ท่านมีปัญหาการนอนไม่หลับหรือนอนมาก',
          type: 'select',
          options: ['น้อยมากหรือแทบไม่มี', 'เป็นบางครั้ง', 'เป็นบ่อยครั้ง', 'เป็นทุกครั้ง'],
        },
      ],
    },
    {
      title: 'Mental Health Check',
      fields: [
        {
          id: 'adhd',
          label: 'มีสมาธิน้อยลง',
          type: 'select',
          options: ['น้อยมากหรือแทบไม่มี', 'เป็นบางครั้ง', 'เป็นบ่อยครั้ง', 'เป็นทุกครั้ง'],
        },
        {
          id: 'madness',
          label: 'หงุดหงิด กระวนกระวาย วุ่นวายใจหรือไม่',
          type: 'select',
          options: ['น้อยมากหรือแทบไม่มี', 'เป็นบางครั้ง', 'เป็นบ่อยครั้ง', 'เป็นทุกครั้ง'],
        },
        {
          id: 'bored',
          label: 'รู้สึกเบื่อหน่ายหรือไม่',
          type: 'select',
          options: ['น้อยมากหรือแทบไม่มี', 'เป็นบางครั้ง', 'เป็นบ่อยครั้ง', 'เป็นทุกครั้ง'],
        },
        {
          id: 'introvert',
          label: 'ไม่อยากพบปะผู้คนหรือไม่',
          type: 'select',
          options: ['น้อยมากหรือแทบไม่มี', 'เป็นบางครั้ง', 'เป็นบ่อยครั้ง', 'เป็นทุกครั้ง'],
        },
      ],
    },
    {
      title: 'Eat Habits (พฤติกรรมการกิน)',
      fields: [
        {
          id: 'eatVegetable',
          label: 'ท่านกินผักอย่างน้อย 5 ทัพพีต่อวันอย่างไร',
          type: 'select',
          options: ['ไม่กินเลย', 'กิน 1-3 วันต่อสัปดาห์', 'กิน 4-6 วันต่อสัปดาห์', 'กินทุกวัน'],
        },
        {
          id: 'eatSour',
          label: 'ท่านเติมเครื่องปรุงรสเค็มหรือไม่',
          type: 'select',
          options: ['ไม่เติมเครื่องปรุงรสเค็มเลย', 'เติมเครื่องปรุงรสเค็มเป็นบางครั้ง', 'เติมเครื่องปรุงรสเค็มเป็นทุกครั้ง'],
        },
        {
          id: 'eatSweetness',
          label: 'ท่านดื่มเครื่องดื่มรสหวานหรือไม่',
          type: 'select',
          options: ['ไม่ดื่มเลย', 'ดื่ม 1-3 วันต่อสัปดาห์', 'ดื่ม 4-6 วันต่อสัปดาห์', 'ดื่มทุกวัน'],
        },
      ],
    },
    {
      title: 'Activities',
      fields: [
        {
          id: 'activitiesTried',
          label: 'ท่านมีกิจกรรมทางกายหรือเคลื่อนไหวหรือไม่อย่างไร',
          type: 'select',
          options: ['ไม่มีกิจกรรมเลย', 'มีกิจกรรมทางกายน้อยกว่าสัปดาห์ละ 150 นาทีหรือน้อยกว่า 30 นาทีต่อวัน', 'มีกิจกรรมทางกายมากกว่าสัปดาห์ละ 150 นาทีหรือน้อยกว่า 30 นาทีต่อวัน'],
        },
        {
          id: 'workingLongtime',
          label: 'ท่านนั่งหรือเอนกายเฉยๆติดต่อกันนาน เกิน 2 ชั่วโมงหรือไม่',
          type: 'select',
          options: ['น้อยกว่า 2 ชั่วโมง', 'มากกว่า 2 ชั่วโมง'],
        }
      ],
    },
  ];

  const getValue = (id: keyof RegisterFormData): string | string[] | number | null => {
    return formData[id];
  };

  const isChecked = (id: keyof RegisterFormData, option: string): boolean => {
    const value = formData[id];
    if (Array.isArray(value)) {
      return value.includes(option);
    }
    return value === option;
  };

  return (
    <div className="px-4 py-1 flex flex-col items-center">
      <div className="w-full max-w-md space-y-4">
        {sections.map((section, idx) => (
          <div
            key={idx}
            className="p-4 border rounded-2xl shadow-sm bg-card text-card-foreground"
          >
            <legend className="font-semibold mb-4 border-b pb-2">
              {section.title}
            </legend>
            <div className="space-y-4">
              {section.fields.map((field) => (
                <div key={field.id}>
                  <label
                    htmlFor={field.id}
                    className="block text-sm font-medium text-muted-foreground mb-1"
                  >
                    {field.label}
                  </label>
                  {field.type === 'select' ? (

                    <select
                      id={field.id}
                      value={String(getValue(field.id) || '')}
                      onChange={(e) =>
                        onChange(field.id, e.target.value)
                      }
                      className={`select ${inputClasses}`}
                      required
                    >
                      <option value="" disabled>
                        โปรดระบุ
                      </option>
                      {field.options?.map((opt) => (
                        <option key={opt} value={opt}>
                          {opt}
                        </option>
                      ))}
                    </select>

                  ) : field.type === 'checkbox' ? (
                    <div className="grid grid-cols-2 gap-2">
                      {field.options?.map((opt) => (
                        <label
                          key={opt}
                          className="flex items-center space-x-2"
                        >
                          <input
                            type="checkbox"
                            id={`${field.id}-${opt}`}
                            checked={isChecked(field.id, opt)}
                            onChange={() => {
                              const currentVal = formData[field.id];
                              let newVal: string[];
                              if (Array.isArray(currentVal)) {
                                if (currentVal.includes(opt)) {
                                  newVal = currentVal.filter((item) => item !== opt);
                                } else {
                                  newVal = [...currentVal, opt];
                                }
                              } else {
                                // Fallback if it was a string or empty (initialize as array)
                                newVal = [opt];
                              }
                              onChange(field.id, newVal);
                            }}
                            className="checkbox checkbox-xs"
                          />
                          <span>{opt}</span>
                        </label>
                      ))}
                    </div>
                  ) : (
                    <input
                      type={field.type}
                      id={field.id}
                      value={String(getValue(field.id) || '')}
                      onChange={(e) =>
                        onChange(field.id, e.target.value)
                      }
                      required
                      className={inputClasses}
                    />
                  )}
                </div>
              ))}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
