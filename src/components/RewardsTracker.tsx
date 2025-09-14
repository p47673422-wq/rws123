"use client";
import React, { useState } from "react";

const levels = [
  { level: 1, bookings: 4, label: "Small Gift" },
  { level: 2, bookings: 6, label: "Promotion" },
  { level: 3, bookings: 10, label: "Bigger Gift" },
  { level: 4, bookings: 20, label: "Special Recognition" },
];

function getLevel(totalBookings: number) {
  for (let i = levels.length - 1; i >= 0; i--) {
    if (totalBookings >= levels[i].bookings) return levels[i];
  }
  return { level: 0, bookings: 0, label: "No Reward Yet" };
}

export default function RewardsTracker({ totalBookings, totalStrength }: { totalBookings: number; totalStrength: number }) {
  const [claiming, setClaiming] = useState(false);
  const current = getLevel(totalBookings);
  const next = levels.find(l => l.bookings > totalBookings);
  const bookingsToNext = next ? next.bookings - totalBookings : 0;
  const percent = next ? Math.min(100, (totalBookings / next.bookings) * 100) : 100;

  const handleClaim = async () => {
    setClaiming(true);
    await fetch("/api/rewards/claim", { method: "POST" });
    setTimeout(() => setClaiming(false), 1000);
    // Optionally show toast
  };

  return (
    <div className="bg-white rounded-xl shadow-md p-4 border border-yellow-200 flex flex-col items-center">
      <div className="text-lg font-bold text-yellow-700 mb-2">Rewards Progress</div>
      <div className="w-full bg-yellow-100 rounded-full h-4 mb-2 overflow-hidden">
        <div
          className="bg-yellow-500 h-4 rounded-full transition-all duration-700"
          style={{ width: `${percent}%` }}
        />
      </div>
      <div className="flex items-center gap-2 mb-2">
        <span className="px-3 py-1 bg-yellow-600 text-white rounded-full font-semibold">Level {current.level || 1}</span>
        <span className="px-3 py-1 bg-orange-400 text-white rounded-full font-semibold">{current.label}</span>
      </div>
      {next ? (
        <div className="text-yellow-700 text-sm mb-2">{bookingsToNext} bookings away from Level {next.level} ({next.label})</div>
      ) : (
        <div className="text-yellow-700 text-sm mb-2">Highest Level Achieved!</div>
      )}
      <button
        className={`mt-2 px-4 py-2 rounded font-bold transition ${bookingsToNext === 0 ? "bg-yellow-600 text-white hover:bg-yellow-700" : "bg-yellow-300 text-yellow-700 cursor-not-allowed"}`}
        disabled={bookingsToNext !== 0 || claiming}
        onClick={handleClaim}
      >
        {claiming ? "Claiming..." : "Claim Gift"}
      </button>
      <div className="mt-2 text-yellow-700 text-xs">Total Strength: {totalStrength}</div>
    </div>
  );
}
