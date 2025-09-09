'use client';

import React, { useState } from 'react';
import RegisterForm from '@/components/RegisterForm';
import TargetForm from '@/components/TargetForm';
import { useLiff } from '@/contexts/LiffContext';
import { useRouter } from 'next/navigation';

// Notification component
const Notification = ({
  message,
  type,
  onClose,
}: {
  message: string;
  type: 'success' | 'error' | '';
  onClose: () => void;
}) => {
  if (!message || !type) return null;

  const baseClasses = 'p-4 rounded-md text-white';
  const typeClasses =
    type === 'success' ? 'bg-green-500' : 'bg-destructive';

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
  height: number;
  weight: number;
  level_activity: string;
  before_pic: string;
  exercise_target: number;
  water_target: number;
};

export default function RegisterPage() {
  const [current, setCurrent] = useState(0);
  const { profile } = useLiff();
  const router = useRouter();
  const [notification, setNotification] = useState({
    message: '',
    type: '' as 'success' | 'error' | '',
  });

  const showNotification = (message: string, type: 'success' | 'error') => {
    setNotification({ message, type });
    setTimeout(() => {
      setNotification({ message: '', type: '' });
    }, 3000);
  };

  const [formData, setFormData] = useState<RegisterFormData>({
    user_id: '',
    sname: '',
    lname: '',
    tel: '',
    dob: '',
    gender: '',
    height: 0,
    weight: 0,
    level_activity: '',
    before_pic: '',
    exercise_target: 0,
    water_target: 0,
  });

  const handleChange = (field: keyof RegisterFormData, value: unknown) => {
    setFormData((prev) => ({
      ...prev,
      [field]: value,
    }));
  };

  const handleSubmit = async () => {
    try {
      if (!profile) {
        showNotification('Waiting for LINE user data...', 'error');
        return;
      }

      const safeData = {
        ...formData,
        dob: formData.dob ? formData.dob : null,
      };

      const payload = { ...safeData, user_id: profile.userId };

      const res = await fetch('/api/users', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      });

      const data = await res.json();
      if (res.ok) {
        showNotification('Registration successful! 🎉', 'success');
        router.push('/');
      } else {
        showNotification('Error: ' + data.error, 'error');
      }
    } catch (err) {
      console.error(err);
      showNotification('Server error occurred.', 'error');
    }
  };

  const steps = [
    {
      title: 'General Info',
      content: <RegisterForm formData={formData} onChange={handleChange} />,
    },
    {
      title: 'Daily Goals',
      content: <TargetForm formData={formData} onChange={handleChange} />,
    },
    {
      title: 'Finish',
      content: (
        <div>
          ✅ Review your information and confirm.
          <pre className="bg-secondary text-xs p-2 mt-2 rounded">
            {JSON.stringify(
              { ...formData, user_id: profile?.userId },
              null,
              2
            )}
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
        onClose={() => setNotification({ message: '', type: '' })}
      />
      
      

      <div className="my-4">{steps[current].content}</div>

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