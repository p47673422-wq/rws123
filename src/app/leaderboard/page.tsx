"use client";
import React, { useEffect, useState } from "react";

const tabs = [
  { key: "bookings", label: "By Bookings" },
  { key: "strength", label: "By Strength" },
];

function ProgressRing({ percent }: { percent: number }) {
  const radius = 28;
  const stroke = 6;
  const normalizedRadius = radius - stroke / 2;
  const circumference = normalizedRadius * 2 * Math.PI;
  const strokeDashoffset = circumference - (percent / 100) * circumference;
  return (
    <svg height={radius * 2} width={radius * 2}>
      <circle
        stroke="#fbbf24"
        fill="transparent"
        strokeWidth={stroke}
        r={normalizedRadius}
        cx={radius}
        cy={radius}
      />
      <circle
        stroke="#eab308"
        fill="transparent"
        strokeWidth={stroke}
        strokeDasharray={circumference + " " + circumference}
        style={{ strokeDashoffset }}
        r={normalizedRadius}
        cx={radius}
        cy={radius}
      />
    </svg>
  );
}

const trophyIcons = ["🥇", "🥈", "🥉"];

export default function LeaderboardPage() {
  const [tab, setTab] = useState("bookings");
  const [leaders, setLeaders] = useState<any[]>([]);
  useEffect(() => {
    fetch(`/api/leaderboard/${tab}`)
      .then(res => res.json())
      .then(data => setLeaders(data.leaders?.slice(0, 10) || []));
  }, [tab]);

  return (
    <div className="min-h-screen bg-gradient-to-br from-yellow-100 to-orange-200 py-6 px-2">
      <h2 className="text-xl font-bold text-yellow-700 mb-4">Leaderboard</h2>
      <div className="flex gap-2 mb-6">
        {tabs.map(t => (
          <button
            key={t.key}
            className={`px-4 py-2 rounded font-semibold transition border ${tab === t.key ? "bg-yellow-600 text-white" : "bg-white text-yellow-700"}`}
            onClick={() => setTab(t.key)}
          >
            {t.label}
          </button>
        ))}
      </div>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 mb-8">
        {leaders.slice(0, 3).map((l, i) => (
          <div key={l.user?.id || i} className="flex items-center bg-white rounded-xl shadow-lg p-4 border border-yellow-300 relative">
            <div className="absolute top-2 left-2 text-3xl">{trophyIcons[i]}</div>
            <div className="w-16 h-16 rounded-full bg-yellow-100 flex items-center justify-center mr-4">
              <span className="text-2xl font-bold text-yellow-700">{l.user?.name?.[0] || "U"}</span>
            </div>
            <div className="flex-1">
              <div className="font-bold text-yellow-800 text-lg">{l.user?.name || "User"}</div>
              <div className="text-yellow-700 text-sm">{tab === "bookings" ? `${l.totalBookings} bookings` : `${l.totalStrength} strength`}</div>
            </div>
            <ProgressRing percent={tab === "bookings" ? Math.min(100, (l.totalBookings / leaders[0]?.totalBookings) * 100) : Math.min(100, (l.totalStrength / leaders[0]?.totalStrength) * 100)} />
          </div>
        ))}
      </div>
      <div className="hidden md:block">
        <table className="w-full bg-white rounded-xl shadow border border-yellow-200">
          <thead>
            <tr className="bg-yellow-100">
              <th className="py-2 px-4 text-left">Rank</th>
              <th className="py-2 px-4 text-left">User</th>
              <th className="py-2 px-4 text-left">{tab === "bookings" ? "Bookings" : "Strength"}</th>
            </tr>
          </thead>
          <tbody>
            {leaders.map((l, i) => (
              <tr key={l.user?.id || i} className={i < 3 ? "bg-yellow-50" : ""}>
                <td className="py-2 px-4">{i < 3 ? trophyIcons[i] : i + 1}</td>
                <td className="py-2 px-4">{l.user?.name || "User"}</td>
                <td className="py-2 px-4">{tab === "bookings" ? l.totalBookings : l.totalStrength}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      <div className="md:hidden grid grid-cols-1 gap-2">
        {leaders.slice(3).map((l, i) => (
          <div key={l.user?.id || i} className="flex items-center bg-white rounded-xl shadow p-3 border border-yellow-200">
            <div className="w-12 h-12 rounded-full bg-yellow-100 flex items-center justify-center mr-3">
              <span className="text-xl font-bold text-yellow-700">{l.user?.name?.[0] || "U"}</span>
            </div>
            <div className="flex-1">
              <div className="font-bold text-yellow-800">{l.user?.name || "User"}</div>
              <div className="text-yellow-700 text-sm">{tab === "bookings" ? `${l.totalBookings} bookings` : `${l.totalStrength} strength`}</div>
            </div>
            <ProgressRing percent={tab === "bookings" ? Math.min(100, (l.totalBookings / leaders[0]?.totalBookings) * 100) : Math.min(100, (l.totalStrength / leaders[0]?.totalStrength) * 100)} />
          </div>
        ))}
      </div>
    </div>
  );
}
