"use client";

import React, { useState } from "react";
import RegisterForm from "@/components/RegisterForm";
import TargetForm from "@/components/TargetForm";
import { useLiff } from "@/contexts/LiffContext";
import { useRouter } from "next/navigation";
import BehaviorForm from "@/components/BehaviorForm";

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
  eatVegetable: string;
  eatSour: string;
  eatSweetness: string;
  activitiesTried: string;
  workingLongtime: string;
};

export default function RegisterPage() {
  const [current, setCurrent] = useState(0);
  const { profile } = useLiff();
  const router = useRouter();
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
      // Regular expression to match only Thai characters, spaces, and common Thai punctuation.
      // Unicode range for Thai characters: U+0E00-U+0E7F
      // \u0E00-\u0E7F covers Thai characters.
      // \s covers whitespace.
      // \u0E2F is the Thai character for '๏' (Thai Baht symbol), sometimes used as punctuation.
      // \u0E40-\u0E44 are various Thai vowels/tone marks that might appear.
      // This regex allows Thai characters, spaces, and a few common punctuation marks that might be used in names.
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
        const height = field === "height" ? Number(value) : prev.height;
        const weight = field === "weight" ? Number(value) : prev.weight;

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
        router.push("/");
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
      title: "General Info",
      content: <RegisterForm formData={formData} onChange={handleChange} />,
    },
    {
      title: 'Health & Lifestyle',
      content: <TargetForm formData={formData} onChange={handleChange} />,
    },
    {
      title: "Behavior Info",
      content: <BehaviorForm formData={formData} onChange={handleChange} />,
    },
    {
      title: "Finish",
      content: (
        <div>
          ✅ Review your information and confirm.
          <pre className="bg-secondary text-xs p-2 mt-2 rounded">
            {JSON.stringify({ ...formData, user_id: profile?.userId }, null, 2)}
          </pre>
        </div>
      ),
    },
  ];

  const next = () => setCurrent((prev) => prev + 1);
  const prev = () => setCurrent((prev) => prev - 1);

  return (
    <div className="p-4 flex flex-col justify-center">
      <Notification
        message={notification.message}
        type={notification.type}
        onClose={() => setNotification({ message: "", type: "" })}
      />



      <div className="">{steps[current].content}</div>

      <div className="flex gap-2 justify-around">
        {current > 0 && (
          <button
            onClick={prev}
            className="px-4 py-2 bg-secondary text-secondary-foreground rounded-md"
          >
            Back
          </button>
        )}
        {current === steps.length - 1 ? (
          <button
            onClick={handleSubmit}
            className="px-4 py-2 bg-primary text-primary-foreground rounded-md"
          >
            Finish
          </button>
        ) : (
          <button
            onClick={next}
            className="px-4 py-2 bg-primary text-primary-foreground rounded-md"
          >
            Next
          </button>
        )}
      </div>
    </div>
  );
}
