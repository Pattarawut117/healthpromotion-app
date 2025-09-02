"use client";

import { useEffect, useState } from "react";
import liff from "@line/liff";

export default function UserPicture() {
  const [pictureUrl, setPictureUrl] = useState<string>();
  const [displayName, setDisplayName] = useState<string>("");

  useEffect(() => {
    const initLiff = async () => {
      try {
        await liff.init({ liffId: "2007987577-9DzlZY4K" }); // 👉 เปลี่ยนเป็น LIFF ID ของคุณ

        if (liff.isLoggedIn()) {
          const profile = await liff.getProfile();
          setPictureUrl(profile.pictureUrl);
          setDisplayName(profile.displayName);
        } else {
          liff.login();
        }
      } catch (err) {
        console.error("LIFF init error:", err);
      }
    };

    initLiff();
  }, []);

  return (
    <div className="flex mb-2">
      {pictureUrl ? (
        <>
          <img
            src={pictureUrl}
            alt="LINE Profile"
            className="w-32 h-32 rounded-full shadow-lg border-4 border-white"
          />
        </>
      ) : (
        <p className="text-gray-500">กำลังโหลดข้อมูลผู้ใช้...</p>
      )}
    </div>
  );
}
