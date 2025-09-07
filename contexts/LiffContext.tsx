"use client";

import React, { createContext, useContext, useEffect, useState } from "react";
import liff from "@line/liff";
import { useRouter, usePathname } from "next/navigation";

type Profile = {
  userId: string;
  displayName: string;
  pictureUrl?: string;
  statusMessage?: string;
};

type LiffContextType = {
  isLoggedIn: boolean;
  profile: Profile | null;
  liffObject: typeof liff | null;
};

const LiffContext = createContext<LiffContextType>({
  isLoggedIn: false,
  profile: null,
  liffObject: null,
});

export const useLiff = () => useContext(LiffContext);

export const LiffProvider = ({ children }: { children: React.ReactNode }) => {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [profile, setProfile] = useState<Profile | null>(null);
  const router = useRouter();
  const pathname = usePathname();

  useEffect(() => {
    const init = async () => {
      try {
        await liff.init({ liffId: "2007987577-9DzlZY4K" });

        if (!liff.isLoggedIn()) {
          liff.login();
          return;
        }

        setIsLoggedIn(true);

        const prof = await liff.getProfile();
        setProfile(prof);

        // ✅ ตรวจสอบ DB
        const res = await fetch("/api/check-user", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ user_id: prof.userId }),
        });

        const data = await res.json();

        if (!data.exists && pathname !== "/user/register") {
          // ❌ ถ้า user_id ไม่มีใน DB และไม่ได้อยู่หน้า register
          router.push("/user/register");
        }
      } catch (err) {
        console.error("LIFF init error", err);
      }
    };

    init();
  }, [router, pathname]);

  return (
    <LiffContext.Provider value={{ isLoggedIn, profile, liffObject: liff }}>
      {children}
    </LiffContext.Provider>
  );
};