import React from "react";

interface BadgeCardProps {
  name: string;
  desc: string;
  image: string;
  unlocked: boolean;
  onShareWhatsapp?: () => void;
  onShareInstagram?: () => void;
  lockedCondition?: string;
}

export default function BadgeCard({ name, desc, image, unlocked, onShareWhatsapp, onShareInstagram, lockedCondition }: BadgeCardProps) {
  return (
    <div
      className={`rounded-2xl p-6 shadow-lg flex flex-col items-center bg-gradient-to-br from-yellow-100 via-pink-50 to-white border-2 ${unlocked ? "border-yellow-400 animate-pulse" : "border-gray-300 bg-gray-100 opacity-60"}`}
      title={!unlocked && lockedCondition ? lockedCondition : undefined}
    >
      <img src={image} alt={name} className={`w-20 h-20 mb-2 rounded-full shadow border-4 ${unlocked ? "border-yellow-400" : "border-gray-300"}`} />
      <div className="font-bold text-yellow-700 text-lg mb-1">{name}</div>
      <div className="text-pink-700 mb-2 text-center">{desc}</div>
      {unlocked ? (
        <div className="flex gap-2 mt-2">
          {onShareWhatsapp && (
            <button onClick={onShareWhatsapp} className="rounded-full bg-gradient-to-r from-yellow-500 via-orange-400 to-pink-400 text-white font-bold animate-pulse px-4 py-2 flex items-center gap-2">
              <span className="text-2xl">🟢</span> WhatsApp
            </button>
          )}
          {onShareInstagram && (
            <button onClick={onShareInstagram} className="rounded-full bg-gradient-to-r from-pink-400 via-yellow-400 to-orange-400 text-white font-bold animate-pulse px-4 py-2 flex items-center gap-2">
              <span className="text-2xl">🟣</span> Instagram
            </button>
          )}
        </div>
      ) : (
        <div className="text-gray-500 mt-2">Locked</div>
      )}
    </div>
  );
}
