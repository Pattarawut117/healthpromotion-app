"use client"; // ต้องมีเพราะใช้ hook

import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import BottomBar from "@/components/BottomBar";
import Image from "next/image";
import { usePathname } from "next/navigation";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const pathname = usePathname();

  // ✅ ซ่อน BottomBar เมื่ออยู่ใน /user/register
  const hideBottomBar = pathname.startsWith("/user/register");

  return (
    <html lang="en">
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased`}
      >
        {/* Topbar */}
        <div className="bg-orange-400 py-4 p-4 font-serif font-bold flex justify-between">
          <nav className="text-xl">Thaihealth</nav>
          <div className="bg-amber-50 flex gap-4 px-2 rounded-full py-2">
            <Image src="/topbar/coin.png" width={30} height={24} alt="coin" />
            <div className="text-lg">100</div>
          </div>
        </div>

        {/* Content */}
        {children}

        {/* ✅ เงื่อนไขแสดง BottomBar */}
        {!hideBottomBar && <BottomBar />}
      </body>
    </html>
  );
}