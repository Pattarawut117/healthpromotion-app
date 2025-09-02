"use client"; // ✅ ทำให้คอมโพเนนต์นี้ทำงานในฝั่ง client เท่านั้น

import { usePathname } from "next/navigation";
import BottomBar from "@/components/BottomBar";

export default function ConditionalBottomBar() {
  const pathname = usePathname();

  // ✅ หากเส้นทางปัจจุบันคือ '/user/register' ให้ return null (ไม่แสดงผล)
  if (pathname === '/user/register') {
    return null;
  }

  // ✅ หากไม่ใช่ ให้แสดง BottomBar ตามปกติ
  return <BottomBar />;
}
