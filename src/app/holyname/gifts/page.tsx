"use client";
import React, { useEffect, useState } from "react";
import GlowingButton from "../../../components/ui/GlowingButton";
import { useLocalProfile } from "../../../hooks/useLocalProfile";
import { motion, AnimatePresence } from "framer-motion";
import BadgeCard from "../../../components/ui/BadgeCard";

const giftImages: { [key: string]: string } = {
  Certificate: "/images/certificate.png",
  Laddoo: "/images/laddoo.png",
  Sticker: "/images/sticker.png",
  "Japa Reward": "/images/japa_reward.png",
};

const badgeInfo: { [key: string]: { desc: string } } = {
  "Quiz Completion Badge": { desc: "Complete Level 3 Quiz" },
  "Daily Bead Badge": { desc: "Chant 10+ rounds in a day" },
  "Steadfast Badge": { desc: "Chant 50+ rounds total" },
  "Devotional Streak Badge": { desc: "Complete 7-day Japa streak" },
};

export default function GiftsPage() {
  const { profile, loading, error, refresh } = useLocalProfile();
  const [confettiIdx, setConfettiIdx] = useState(-1);

  useEffect(() => {
    refresh();
  }, []);

  if (loading) return <div className="min-h-screen flex items-center justify-center">Loading...</div>;
  if (error) return <div className="min-h-screen flex items-center justify-center text-red-600">{error}</div>;
  if (!profile) return null;

  const gifts = profile.gifts || [];
  const badges = profile.badges || [];
  const totalGifts = gifts.length;
  const unlockedGifts = gifts.filter((g: any) => g.unlocked).length;

  const noUnlockedGifts = unlockedGifts === 0;

  return (
    <div className="min-h-screen bg-gradient-to-br from-yellow-200 via-pink-100 to-white flex flex-col items-center py-8 px-2">
      {/* Header */}
      <motion.div
        initial={{ opacity: 0, y: -30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.7 }}
        className="w-full max-w-xl rounded-2xl mb-6 py-6 px-4 bg-gradient-to-r from-yellow-300 via-pink-200 to-white shadow-xl flex flex-col items-center"
      >
        <h2 className="text-2xl font-bold text-yellow-700 mb-2">🎁 My Gifts & Achievements</h2>
        <div className="text-pink-700">See what you have unlocked and what you’re missing.</div>
      </motion.div>

      {/* Devotional message and CTA if no gifts unlocked */}
      {noUnlockedGifts && (
        <motion.div
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7 }}
          className="w-full max-w-xl rounded-2xl bg-gradient-to-r from-yellow-400 via-orange-300 to-pink-200 shadow-lg p-6 mb-6 flex flex-col items-center"
        >
          <div className="text-xl font-bold text-yellow-900 mb-2 text-center">🙏 Please attempt the Holy Name Challenge to start unlocking gifts.</div>
          <GlowingButton className="bg-gradient-to-r from-yellow-500 via-orange-400 to-pink-400 text-white font-bold animate-pulse px-6 py-3 mt-2" onClick={() => window.location.href = '/holyname/quiz/level1'}>
            Start Quiz
          </GlowingButton>
        </motion.div>
      )}

      {/* Badges Section - always render, but greyed out if no gifts unlocked */}
      <motion.div
        initial={{ opacity: 0, x: -30 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ duration: 0.7 }}
        className="w-full max-w-xl grid grid-cols-1 md:grid-cols-2 gap-4 mb-6"
      >
        {Object.keys(badgeInfo).map((badgeName: string, idx: number) => {
          const badge = badges.find((b: any) => b.name === badgeName);
          const unlocked = !!badge && !noUnlockedGifts;
          return (
            <BadgeCard
              key={badgeName}
              name={badgeName}
              desc={badgeInfo[badgeName].desc}
              image={badge?.image || "/images/badge.png"}
              unlocked={unlocked}
              onShareWhatsapp={unlocked ? () => window.open(`https://wa.me/?text=I%20earned%20the%20${badgeName}!`, "_blank") : undefined}
              onShareInstagram={unlocked ? () => window.open("https://www.instagram.com/", "_blank") : undefined}
              lockedCondition={
                badgeName === "Quiz Completion Badge"
                  ? "Complete Level 3 Quiz to unlock Quiz Completion Badge."
                  : badgeName === "Steadfast Badge"
                  ? "Chant 50+ rounds to unlock Steadfast Badge."
                  : badgeName === "Daily Bead Badge"
                  ? "Chant 10+ rounds in a day to unlock Daily Bead Badge."
                  : badgeName === "Devotional Streak Badge"
                  ? "Complete 7-day Japa streak to unlock Devotional Streak Badge."
                  : "Complete challenge to unlock."
              }
            />
          );
        })}
      </motion.div>

      {/* Gifts Grid - always render, but all greyed out if no gifts unlocked */}
      <motion.div
        initial={{ opacity: 0, x: 30 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ duration: 0.7 }}
        className="w-full max-w-xl grid grid-cols-2 md:grid-cols-3 gap-4 mb-6"
      >
        {gifts.map((g: any, i: number) => {
          let unlockHref = null;
          if (!g.unlocked) {
            if (g.name === "Certificate") unlockHref = "/holyname/quiz/level1";
            else if (g.name === "Laddoo") unlockHref = "/holyname/quiz/level2";
            else if (g.name === "Sticker") unlockHref = "/holyname/quiz/level3";
            else if (g.name === "Japa Reward") unlockHref = "/holyname/japa";
          }
          return (
            <motion.div
              key={i}
              whileHover={g.unlocked && !noUnlockedGifts ? { scale: 1.05, boxShadow: "0 0 32px #fbbf24" } : {}}
              className={`rounded-2xl p-6 flex flex-col items-center shadow border-2 relative ${g.unlocked && !noUnlockedGifts ? "border-yellow-400 bg-gradient-to-br from-yellow-100 via-pink-50 to-white animate-pulse" : "border-gray-300 bg-gray-100 opacity-60"}`}
              onMouseEnter={() => g.unlocked && !noUnlockedGifts && setConfettiIdx(i)}
              onMouseLeave={() => setConfettiIdx(-1)}
            >
              <img src={giftImages[g.name] || "/images/gift.png"} alt={g.name} className="w-20 h-20 mb-2 rounded-xl shadow" />
              <div className="font-bold text-yellow-700">{g.name || `Gift Level ${g.level}`}</div>
              <div className="text-pink-700 mb-2">{g.unlocked && !noUnlockedGifts ? "Unlocked" : "Locked"}</div>
              {g.unlocked && !noUnlockedGifts && confettiIdx === i && (
                <motion.div
                  initial={{ opacity: 0, scale: 0.5 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 0.5 }}
                  transition={{ duration: 0.6 }}
                  className="absolute inset-0 flex items-center justify-center pointer-events-none"
                >
                  {/* Confetti burst animation placeholder */}
                  <span className="text-5xl">🎉</span>
                </motion.div>
              )}
              {!g.unlocked && unlockHref && (
                <a href={unlockHref} className="w-full mt-2">
                  <GlowingButton className="w-full">Go to Challenge</GlowingButton>
                </a>
              )}
              {!g.unlocked && !unlockHref && (
                <div className="text-gray-500 mt-2">Locked</div>
              )}
            </motion.div>
          );
        })}
      </motion.div>

      {/* WhatsApp Channel CTA */}
      <motion.div
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.7 }}
        className="w-full max-w-xl rounded-2xl bg-gradient-to-br from-yellow-100 via-pink-50 to-white shadow-lg p-6 mb-6 flex items-center gap-4"
      >
        <span className="text-3xl text-yellow-500 animate-pulse">💬</span>
        <div className="flex-1">
          <div className="font-bold text-yellow-700 mb-2">📢 Stay inspired daily! Join our WhatsApp channel for tips and updates.</div>
        <a href="https://whatsapp.com/channel/inspiration" target="_blank" rel="noopener">
          <GlowingButton className="w-full py-3 text-lg mt-2 bg-gradient-to-r from-yellow-400 via-pink-200 to-white">Join Now →</GlowingButton>
        </a>
        </div>
      </motion.div>
    </div>
  );
}
