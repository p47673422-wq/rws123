"use client";
import React, { useState } from "react";

const MOTIVATIONAL_QUOTES = [
  "Success is not the key to happiness. Happiness is the key to success.",
  "The best way to get started is to quit talking and begin doing.",
  "Great things never come from comfort zones.",
  "Push yourself, because no one else is going to do it for you.",
];

const leaderboardStub = [
  { id: "u1", name: "Radha", avatar: "/avatar1.png", score: 12000 },
  { id: "u2", name: "Amit", avatar: "/avatar2.png", score: 9500 },
  { id: "u3", name: "Meera", avatar: "/avatar3.png", score: 8000 },
  { id: "u4", name: "You", avatar: "/avatar4.png", score: 7000 },
  { id: "u5", name: "Sita", avatar: "/avatar5.png", score: 6500 },
  { id: "u6", name: "Gopal", avatar: "/avatar6.png", score: 6000 },
];

const FILTERS = ["This Week", "This Month", "All Time"];

export default function LeaderboardPage() {
  const [filter, setFilter] = useState(FILTERS[0]);
  const [quote] = useState(
    MOTIVATIONAL_QUOTES[Math.floor(Math.random() * MOTIVATIONAL_QUOTES.length)]
  );
  // Sort leaderboard by score desc
  const sorted = leaderboardStub.slice().sort((a, b) => b.score - a.score);
  const top3 = sorted.slice(0, 3);
  const rest = sorted.slice(3);
  const currentUserId = "u4";

  return (
    <div className="max-w-2xl mx-auto p-4">
      <h1 className="text-2xl font-bold mb-2">Distributor Leaderboard</h1>
      <div className="text-lg text-blue-700 font-semibold mb-6 text-center italic">
        {quote}
      </div>
      <div className="flex gap-2 justify-center mb-6">
        {FILTERS.map((f) => (
          <button
            key={f}
            className={`px-4 py-1 rounded-full font-semibold border ${filter === f ? "bg-blue-600 text-white" : "bg-gray-100 text-gray-800"}`}
            onClick={() => setFilter(f)}
          >
            {f}
          </button>
        ))}
      </div>
      {/* Podium for top 3 */}
      <div className="flex justify-center items-end gap-4 mb-8">
        <PodiumEntry
          rank={2}
          user={top3[1]}
          color="silver"
          currentUserId={currentUserId}
        />
        <PodiumEntry
          rank={1}
          user={top3[0]}
          color="gold"
          currentUserId={currentUserId}
        />
        <PodiumEntry
          rank={3}
          user={top3[2]}
          color="bronze"
          currentUserId={currentUserId}
        />
      </div>
      {/* List for remaining */}
      <div className="grid gap-4">
        {rest.map((user, idx) => (
          <LeaderboardEntry
            key={user.id}
            rank={idx + 4}
            user={user}
            currentUserId={currentUserId}
            maxScore={sorted[0].score}
          />
        ))}
      </div>
    </div>
  );
}

interface PodiumEntryProps {
  rank: number;
  user: any;
  color: 'gold' | 'silver' | 'bronze';
  currentUserId: string;
}
function PodiumEntry({ rank, user, color, currentUserId }: PodiumEntryProps) {
  const colors = {
    gold: "bg-yellow-300 border-yellow-500",
    silver: "bg-gray-300 border-gray-500",
    bronze: "bg-orange-300 border-orange-500",
  };
  const accent = user.id === currentUserId ? "ring-4 ring-blue-400" : "";
  return (
    <div
  className={`flex flex-col items-center justify-end ${colors[color as keyof typeof colors]} border rounded-lg px-4 pb-2 pt-4 shadow-lg ${accent}`}
      style={{ minWidth: 100, minHeight: 180, zIndex: 10 - rank }}
    >
      <div className="text-2xl font-bold mb-1">#{rank}</div>
      <img
        src={user.avatar}
        alt={user.name}
        className={`w-16 h-16 rounded-full border-4 ${accent} mb-2`}
      />
      <div className="font-semibold text-lg mb-1">{user.name}</div>
      <div className="font-bold text-blue-900 text-xl">₹{user.score}</div>
    </div>
  );
}

interface LeaderboardEntryProps {
  rank: number;
  user: any;
  currentUserId: string;
  maxScore: number;
}
function LeaderboardEntry({ rank, user, currentUserId, maxScore }: LeaderboardEntryProps) {
  const accent = user.id === currentUserId ? "bg-blue-100 border-blue-400" : "bg-white border-gray-200";
  return (
    <div className={`flex items-center gap-4 border rounded-lg p-3 shadow-sm ${accent}`}>
      <div className="text-xl font-bold w-10 text-center">#{rank}</div>
      <img src={user.avatar} alt={user.name} className="w-10 h-10 rounded-full border" />
      <div className="flex-1">
        <div className="font-semibold">{user.name}</div>
        <div className="text-xs text-gray-500">Score: ₹{user.score}</div>
        <div className="w-full h-2 bg-gray-200 rounded mt-1">
          <div
            className="h-2 bg-blue-500 rounded"
            style={{ width: `${Math.round((user.score / maxScore) * 100)}%` }}
          />
        </div>
      </div>
    </div>
  );
}
