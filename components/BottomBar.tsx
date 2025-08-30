"use client";

import React, { useState } from "react";
import Image from "next/image";
import { useRouter } from "next/navigation";

const menuItems = [
  { name: "Home", icon: "/bottombar/home.png", path: "/" },
  { name: "Ranking", icon: "/bottombar/ranking.png", path: "/ranking" },
  { name: "Campaign", icon: "/bottombar/social-media-marketing.png", path: "/campaign" },
  { name: "Review", icon: "/bottombar/message.png", path: "/review" },
  { name: "Profile", icon: "/bottombar/user.png", path: "/profile" },
];

export default function BottomBar() {
  const [active, setActive] = useState("Home");
  const router = useRouter();

  const handleClick = (item: typeof menuItems[0]) => {
    setActive(item.name);
    router.push(item.path);
  };

  return (
    <div className="fixed bottom-0 left-0 right-0 bg-white shadow-md border-t border-gray-200 flex justify-around py-[16] z-50 px-8">
      {menuItems.map((item) => (
        <button
          key={item.name}
          onClick={() => handleClick(item)}
          className={`flex flex-col items-center text-xs ${
            active === item.name ? "text-green-600 font-semibold" : "text-gray-500"
          }`}
        >
          <Image
            src={item.icon}
            width={24}
            height={24}
            alt={item.name}
            className={`${active === item.name ? "opacity-100" : "opacity-60"}`}
          />
          <span>{item.name}</span>
        </button>
      ))}
    </div>
  );
}