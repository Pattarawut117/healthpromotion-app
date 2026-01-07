"use client";

import Image from "next/image";

const ranks = [
  { name: "Bronze", image: "/coinRank/bronzeJar.png", color: "text-yellow-500" },
  { name: "Silver", image: "/coinRank/silverJar.png", color: "text-gray-500" },
  { name: "Gold", image: "/coinRank/goldJar.png", color: "text-orange-400" },
  { name: "Diamond", image: "/coinRank/diamondJar.png", color: "text-blue-400" },
];

const RankDisplay = () => {
  return (
    <div className="grid grid-cols-4 gap-2 w-full bg-gray-100 px-4 py-3 rounded-lg mt-4">
      {ranks.map((rank) => (
        <div key={rank.name} className="flex flex-col items-center">
          <Image src={rank.image} alt={rank.name} width={64} height={64} className="mb-1" />
          <span className={`text-xs font-semibold ${rank.color}`}>{rank.name}</span>
        </div>
      ))}
    </div>
  );
};

export default RankDisplay;
