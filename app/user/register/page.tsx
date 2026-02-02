"use client";

import React, { useState } from "react";
import RegisterForm from "@/components/RegisterForm";
import TargetForm from "@/components/TargetForm";
import { useLiff } from "@/contexts/LiffContext";
import { useRouter } from "next/navigation";
import Policy from "@/components/Policy";

// Notification component
const Notification = ({
  message,
  type,
  onClose,
}: {
  message: string;
  type: "success" | "error" | "";
  onClose: () => void;
}) => {
  if (!message || !type) return null;

  const baseClasses = "p-4 rounded-md text-white";
  const typeClasses = type === "success" ? "bg-green-500" : "bg-destructive";

  return (
    <div className={`fixed top-5 right-5 ${baseClasses} ${typeClasses}`}>
      {message}
      <button onClick={onClose} className="ml-4 font-bold">
        X
      </button>
    </div>
  );
};

export type RegisterFormData = {
  user_id: string;
  sname: string;
  lname: string;
  tel: string;
  dob: string | null;
  gender: string;
  height: string;
  weight: string;
  bmi: number;
  condentialDisease: string | string[];
  sleepPerhour: string; // Changed from number to string based on API usage (often inputs are strings) or keep as string if API expects string
  sleepEnough: string;
  isSmoke: string;
  drinkBeer: string;
  drinkWater: string;
  sleepProblem: string;
  adhd: string;
  madness: string;
  bored: string;
  introvert: string;
  unit: string;
  division: string;
  eatVegetable: string;
  eatSour: string;
  eatSweetness: string;
  activitiesTried: string;
  workingLongtime: string;
};

export default function RegisterPage() {
  const [current, setCurrent] = useState(0);
  const { profile } = useLiff();
  const [showModal, setShowModal] = useState(false);
  const router = useRouter();
  const [isdisabled, setIsdisabled] = useState(true);
  const [notification, setNotification] = useState({
    message: "",
    type: "" as "success" | "error" | "",
  });

  const showNotification = (message: string, type: "success" | "error") => {
    setNotification({ message, type });
    setTimeout(() => {
      setNotification({ message: "", type: "" });
    }, 3000);
  };

  const [formData, setFormData] = useState<RegisterFormData>({
    user_id: '',
    sname: '',
    lname: '',
    tel: '',
    dob: '',
    gender: '',
    height: '',
    weight: '',
    bmi: 0,
    condentialDisease: '',
    sleepPerhour: '',
    sleepEnough: '',
    isSmoke: '',
    drinkBeer: '',
    drinkWater: '',
    sleepProblem: '',
    adhd: '',
    madness: '',
    bored: '',
    introvert: '',
    unit: '',
    division: '',
    eatVegetable: '',
    eatSour: '',
    eatSweetness: '',
    activitiesTried: '',
    workingLongtime: '',
  });
  console.log(formData);

  const handleChange = (field: keyof RegisterFormData, value: unknown) => {
    // Thai character validation function
    const isThai = (text: string) => {
      const thaiRegex = /^[\u0E00-\u0E7F\s\u0E2F\u0E3F\u0E40-\u0E44]*$/u;
      return thaiRegex.test(text);
    };

    setFormData((prev) => {
      if ((field === "sname" || field === "lname") && typeof value === 'string') {
        if (!isThai(value)) {
          showNotification(`Please use only Thai characters for ${field === "sname" ? "First Name" : "Last Name"}.`, "error");
          return prev; // Do not update state if invalid
        }
      }

      const updatedFormData = {
        ...prev,
        [field]: value,
      };

      if (field === "height" || field === "weight") {
        const height = field === "height" ? Number(value) : Number(prev.height);
        const weight = field === "weight" ? Number(value) : Number(prev.weight);

        if (height > 0 && weight > 0) {
          const heightInMeters = height / 100;
          const bmi = weight / (heightInMeters * heightInMeters);
          updatedFormData.bmi = parseFloat(bmi.toFixed(2));
        } else {
          updatedFormData.bmi = 0;
        }
      }

      return updatedFormData;
    });
  };

  const handleSubmit = async () => {
    try {
      if (!profile) {
        showNotification("Waiting for LINE user data...", "error");
        return;
      }

      const safeData = {
        ...formData,
        dob: formData.dob ? formData.dob : null,
      };

      const payload = { ...safeData, user_id: profile.userId };

      const res = await fetch("/api/users", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });

      const data = await res.json();
      if (res.ok) {
        showNotification("Registration successful! 🎉", "success");
        setShowModal(true);
        setTimeout(() => {
          router.push("/");
        }, 3000);
      } else {
        showNotification("Error: " + data.error, "error");
      }
    } catch (err) {
      console.error(err);
      showNotification("Server error occurred.", "error");
    }
  };

  const steps = [
    {
      title: 'Policy',
      content: <Policy isdisabled={isdisabled} onChange={setIsdisabled} />,
    },
    {
      title: "General Info",
      content: <RegisterForm formData={formData} onChange={handleChange} />,
    },
    {
      title: 'Health & Lifestyle',
      content: <TargetForm formData={formData} onChange={handleChange} />,
    }
  ];

  const validateStep = (stepIndex: number): boolean => {
    if (stepIndex === 1) { // General Info
      const requiredFields: (keyof RegisterFormData)[] = ['sname', 'lname', 'tel', 'dob', 'gender', 'unit', 'height', 'weight'];
      const missingFields = requiredFields.filter(key => !formData[key]);
      if (missingFields.length > 0) {
        showNotification("Please fill in all general information fields.", "error");
        return false;
      }
    } else if (stepIndex === 2) { // Health & Lifestyle
      // List of all keys for TargetForm
      const targetFields: (keyof RegisterFormData)[] = [
        'condentialDisease', 'isSmoke', 'drinkBeer', 'drinkWater',
        'sleepPerhour', 'sleepEnough', 'sleepProblem', 'adhd', 'madness', 'bored', 'introvert',
        'unit', 'division',
        'eatVegetable', 'eatSour', 'eatSweetness',
        'activitiesTried', 'workingLongtime'
      ];

      for (const key of targetFields) {
        const val = formData[key];
        if (key === 'condentialDisease') {
          // Check array or string
          if (Array.isArray(val)) {
            if (val.length === 0) {
              showNotification("Please select at least one Congenital Disease (or 'None').", "error");
              return false;
            }
          } else if (!val) {
            showNotification("Please select Congenital Disease.", "error");
            return false;
          }
        } else {
          if (!val) {
            showNotification(`Please select an option for all fields. (Missing: ${key})`, "error");
            return false;
          }
        }
      }
    }
    return true;
  };

  const next = () => {
    if (validateStep(current)) {
      setCurrent((prev) => prev + 1);
    }
  };
  const prev = () => setCurrent((prev) => prev - 1);

  return (
    <div className="p-4 flex flex-col justify-center">
      <Notification
        message={notification.message}
        type={notification.type}
        onClose={() => setNotification({ message: "", type: "" })}
      />

      <div className="">{steps[current].content}</div>

      <div className="flex gap-2 justify-around mt-2">
        {current > 0 && (
          <button
            onClick={prev}
            className="px-4 py-2 border border-primary btn btn-primary rounded-md"
          >
            กลับ
          </button>
        )}
        {current === steps.length - 1 ? (
          <button
            onClick={handleSubmit}
            className="px-4 py-2 btn btn-success rounded-md"
            disabled={isdisabled}
          >
            เสร็จสิ้น
          </button>
        ) : (
          <button
            onClick={next}
            className="px-4 py-2 btn btn-primary rounded-md"
            disabled={isdisabled}
          >
            ถัดไป
          </button>
        )}
      </div>
      {showModal && (
        <div className="modal modal-open" role="dialog">
          <div className="modal-box">
            <h3 className="text-lg font-bold">เสร็จสิ้น</h3>
            <p className="py-4">ระบบกำลังดำเนินการ</p>
            <div className="modal-action">
              <label htmlFor="my_modal_6" className="btn"> <span className="loading loading-spinner loading-md"></span>loading...</label>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
