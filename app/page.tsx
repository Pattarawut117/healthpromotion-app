"use client";

import { useEffect } from "react";
import liff from "@line/liff";
import { useRouter } from "next/navigation";

export default function Home() {
  useEffect(() => {
    const initLiff = async () => {
      try {
        await liff.init({ liffId: "2007987577-9DzlZY4K" });

        if (!liff.isLoggedIn()) {
          liff.login();
          return;
        }
        const profile = await liff.getProfile();
        console.log(profile);
        
        const userId = profile.userId;

        
      } catch (err) {
        console.error("LIFF init error", err);
      }
    };
    initLiff();
  }, []);

  return (
    <div className="flex flex-col gap-4 items-center justify-center h-screen"></div>
  );
}
