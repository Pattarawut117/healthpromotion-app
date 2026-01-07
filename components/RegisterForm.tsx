import React from "react";
import UserPicture from "./profile/UserPicture";
import { RegisterFormData } from "@/app/user/register/page";

// Props type
type Props = {
  formData: RegisterFormData;
  onChange: <T>(field: keyof RegisterFormData, value: T) => void;
};

export default function RegisterForm({ formData, onChange }: Props) {
  const inputClasses =
    "w-full p-2 border border-input rounded-md focus:ring-primary focus:border-primary bg-background";

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
                onChange={(e) => onChange("sname", e.target.value || "")}
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
                onChange={(e) => onChange("lname", e.target.value || "")}
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
              onChange={(e) => onChange("tel", e.target.value || "")}
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
              value={formData.dob ? formData.dob.toString() : ""}
              onChange={(e) => onChange("dob", e.target.value || null)}
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
              onChange={(e) => onChange("gender", e.target.value || "")}
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
            <div className="flex flex-col">
              <label>หน่วยงาน</label>
              <select name="unit">
                <option value="" disabled>
                  Select Unit
                </option>
              </select>
            </div>
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
                  onChange(
                    "height",
                    e.target.value ? Number(e.target.value) : 0
                  )
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
                  onChange(
                    "weight",
                    e.target.value ? Number(e.target.value) : 0
                  )
                }
                className={inputClasses}
                required
              />
            </div>
          </div>
          <div className="flex flex-col">
            <label htmlFor="">Bmi</label>
            <input
              type="text"
              value={formData.bmi}
              onChange={(e) =>
                onChange("bmi", e.target.value ? Number(e.target.value) : 0)
              }
              className={inputClasses}
              disabled
            />
          </div>
          <div>
            <label htmlFor="">โรคประจำตัว</label>
            <input type="text" 
            value={formData.condentialDisease}
            onChange={(e)=>
            onChange("condentialDisease", e.target.value? String(e.target.value): "")
          }
          className={inputClasses}
            />
          </div>
        </div>
      </form>
    </div>
  );
}
