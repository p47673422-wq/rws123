"use client";
import React, { useEffect, useState } from "react";
import GlowingButton from "../../../components/ui/GlowingButton";
import { useLocalProfile } from "../../../hooks/useLocalProfile";
import { motion, AnimatePresence } from "framer-motion";
import BadgeCard from "../../../components/ui/BadgeCard";

const verses = [
  "Chant Hare Krishna and your life will be sublime. — Srila Prabhupada",
  "In this age, chanting the holy name is the only way. — Srila Prabhupada",
  "The holy name is the greatest treasure. — Srila Prabhupada",
  "Chant and be happy. — Srila Prabhupada",
];

function getQuizStatus(level: number, profile: any) {
  const gift = profile.gifts?.find((g: any) => g.level === level && g.type === "QUIZ");
  const answers = profile.quizAnswers?.filter((a: any) => a.level === level) || [];
  if (answers.length === 0) return { status: "Not Started", icon: "🔓" };
  if (gift && gift.unlocked) return { status: "Completed", icon: "✅" };
  return { status: "In Progress", icon: "⏳" };
}

export default function ProfilePage() {
  const { profile, loading, error, refresh } = useLocalProfile();
  const [editMode, setEditMode] = useState(false);
  const [editData, setEditData] = useState({ name: "", mobile: "", gender: "", address: "" });
  const [verseIdx, setVerseIdx] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => {
      setVerseIdx(i => (i + 1) % verses.length);
    }, 8000);
    return () => clearInterval(interval);
  }, []);

  useEffect(() => {
    if (profile) {
      setEditData({
        name: profile.name || "",
        mobile: profile.mobile || "",
        gender: profile.gender || "",
        address: profile.address || "",
      });
    }
  }, [profile]);

  const handleEdit = () => setEditMode(true);
  const handleEditChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setEditData(d => ({ ...d, [name]: value }));
  };
  const handleEditSave = async () => {
    await fetch("/api/holyname/user/register", {
      method: "POST",
      body: JSON.stringify(editData),
      headers: { "Content-Type": "application/json" },
    });
    setEditMode(false);
    refresh();
  };

  if (loading) return <div className="min-h-screen flex items-center justify-center">Loading...</div>;
  if (error) return <div className="min-h-screen flex items-center justify-center text-red-600">{error}</div>;
  if (!profile) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-yellow-200 via-pink-100 to-white flex flex-col items-center py-8 px-2">
        <motion.div
          initial={{ opacity: 0, y: -30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7 }}
          className="w-full max-w-xl rounded-2xl mb-6 py-8 px-6 bg-gradient-to-r from-yellow-300 via-pink-200 to-white shadow-xl flex flex-col items-center"
        >
          <h2 className="text-3xl font-bold text-pink-600 mb-4">🌸 Welcome to the Holy Name Challenge!</h2>
          <div className="text-lg text-yellow-900 mb-6 text-center">Start your journey by taking the quiz or Japa challenge.</div>
          <div className="flex gap-4 mt-2">
            <GlowingButton className="bg-gradient-to-r from-yellow-500 via-orange-400 to-pink-400 text-white font-bold animate-pulse px-6 py-3" onClick={() => window.location.href = '/holyname/quiz/level1'}>
              Start Quiz
            </GlowingButton>
            <GlowingButton className="bg-gradient-to-r from-pink-400 via-yellow-400 to-orange-400 text-white font-bold animate-pulse px-6 py-3" onClick={() => window.location.href = '/holyname/japa'}>
              Start Japa
            </GlowingButton>
          </div>
        </motion.div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-yellow-200 via-pink-100 to-white flex flex-col items-center py-8 px-2">
      {/* Header */}
      <motion.div
        initial={{ opacity: 0, y: -30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.7 }}
        className="w-full max-w-xl rounded-xl mb-6 py-6 px-4 bg-gradient-to-r from-yellow-300 via-pink-200 to-white shadow-xl flex flex-col items-center"
      >
        <h2 className="text-2xl font-bold text-yellow-700 mb-2">Hare Krishna, {profile.name} 🙏</h2>
      </motion.div>

      {/* Profile Card */}
      <motion.div
        initial={{ opacity: 0, x: -30 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ duration: 0.7 }}
        className="w-full max-w-xl rounded-xl bg-white shadow-lg p-6 mb-6 flex flex-col gap-2 relative"
      >
        <div className="font-bold text-lg text-yellow-700">Profile</div>
        <div>Name: {profile.name}</div>
        <div>Mobile: {profile.mobile}</div>
        <div>Gender: {profile.gender}</div>
        <div>Address: {profile.address}</div>
        <button className="absolute top-4 right-4 text-pink-500" onClick={handleEdit}>✏️</button>
        {editMode && (
          <div className="fixed inset-0 bg-black bg-opacity-40 flex items-center justify-center z-50">
            <div className="bg-white rounded-xl shadow-xl p-8 flex flex-col gap-4 w-80">
              <h3 className="font-bold text-yellow-700 mb-2">Edit Profile</h3>
              <input name="name" value={editData.name} onChange={handleEditChange} className="border rounded px-2 py-1" placeholder="Name" />
              <input name="mobile" value={editData.mobile} onChange={handleEditChange} className="border rounded px-2 py-1" placeholder="Mobile" />
              <input name="gender" value={editData.gender} onChange={handleEditChange} className="border rounded px-2 py-1" placeholder="Gender" />
              <input name="address" value={editData.address} onChange={handleEditChange} className="border rounded px-2 py-1" placeholder="Address" />
              <div className="flex gap-2 mt-2">
                <GlowingButton onClick={handleEditSave}>Save</GlowingButton>
                <GlowingButton onClick={() => setEditMode(false)} className="bg-gray-200 text-gray-700">Cancel</GlowingButton>
              </div>
            </div>
          </div>
        )}
      </motion.div>

      {/* Quiz Progress */}
      <motion.div
        initial={{ opacity: 0, x: 30 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ duration: 0.7 }}
        className="w-full max-w-xl grid grid-cols-1 md:grid-cols-3 gap-4 mb-6"
      >
        {[1, 2, 3].map(level => {
          const { status, icon } = getQuizStatus(level, profile);
          let href = `/holyname/quiz/level${level}`;
          if (status === "Completed") {
            href = `/holyname/quiz/level${level}?summary=1`;
          } else if (status === "In Progress") {
            href = `/holyname/quiz/level${level}?resume=1`;
          }
          return (
            <a
              key={level}
              href={href}
              className={`rounded-xl p-6 shadow-lg flex flex-col items-center cursor-pointer bg-gradient-to-br from-yellow-100 via-pink-50 to-white border-2 ${status === "Completed" ? "border-yellow-400" : status === "In Progress" ? "border-pink-300" : "border-gray-300"}`}
            >
              <span className="text-3xl mb-2">{icon}</span>
              <div className="font-bold text-lg text-yellow-700">Level {level}</div>
              <div className="text-pink-700">{status}</div>
            </a>
          );
        })}
      </motion.div>

      {/* My Commitments */}
      <motion.div
        initial={{ opacity: 0, x: -30 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ duration: 0.7 }}
        className="w-full max-w-xl rounded-xl bg-white shadow-lg p-6 mb-6"
      >
        <div className="font-bold text-lg text-pink-700 mb-2">My Commitments</div>
        {profile.commitments?.length ? (
          <ul className="text-pink-900">
            {profile.commitments.map((c: any, i: number) => (
              <li key={i}>Chant {c.rounds} rounds daily, Inspire {c.friends} friends, Japa Group: {c.japaChallenge ? "Yes" : "No"}</li>
            ))}
          </ul>
        ) : (
          <div className="text-pink-600">Take the Holy Name Quiz to make your first commitment 🙏</div>
        )}
      </motion.div>

      {/* Japa Challenge */}
      <motion.div
        initial={{ opacity: 0, x: 30 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ duration: 0.7 }}
        className="w-full max-w-xl rounded-xl bg-white shadow-lg p-6 mb-6 flex flex-col gap-2"
      >
        <div className="font-bold text-lg text-yellow-700 mb-2">Japa Challenge</div>
        <div>Streak: {profile.japaProgress?.length || 0} days</div>
  <div>Total Rounds: {profile.japaProgress?.reduce((sum: number, e: any) => sum + (e.rounds || 0), 0) || 0}</div>
        <div className="flex gap-2 mt-2">
          {profile.badges?.filter((b: any) => b.type === "JAPA").map((b: any, i: number) => (
            <div key={i} className="rounded-xl bg-gradient-to-br from-yellow-200 via-pink-100 to-white px-4 py-2 shadow border border-yellow-400 flex items-center gap-2">
              <span className="text-2xl">🏅</span>
              <span>{b.name}</span>
              <a href="https://wa.me/?text=I%20earned%20a%20Japa%20Badge!" target="_blank" rel="noopener">
                <GlowingButton>WhatsApp</GlowingButton>
              </a>
              <a href="https://www.instagram.com/" target="_blank" rel="noopener">
                <GlowingButton>Instagram</GlowingButton>
              </a>
            </div>
          ))}
        </div>
        <a href="/holyname/japa" className="mt-4 block"><button className="w-full py-3 rounded bg-gradient-to-r from-yellow-400 via-pink-200 to-white text-yellow-900 font-bold shadow hover:scale-105 transition">Continue Japa Challenge</button></a>
      </motion.div>

      {/* My Gifts & Badges */}
      <motion.div
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.7 }}
        className="w-full max-w-xl rounded-xl bg-white shadow-lg p-6 mb-6"
      >
        <div className="font-bold text-lg text-yellow-700 mb-2">My Gifts & Badges</div>
        <a href="/holyname/gifts" className="block">
          <button className="w-full py-3 rounded bg-gradient-to-r from-yellow-400 via-pink-200 to-white text-yellow-900 font-bold shadow hover:scale-105 transition mb-4">View All Gifts & Badges</button>
        </a>
        <div className="grid grid-cols-2 gap-4">
          {profile.gifts?.map((g: any, i: number) => (
            <div key={i} className={`rounded-xl p-4 flex flex-col items-center shadow border-2 ${g.unlocked ? "border-yellow-400 bg-gradient-to-br from-yellow-100 via-pink-50 to-white animate-pulse" : "border-gray-300 bg-gray-100"}`}>
              <span className="text-3xl mb-2">{g.unlocked ? "🎁" : "🔒"}</span>
              <div className="font-bold text-yellow-700">{g.name || `Gift Level ${g.level}`}</div>
              <div className="text-pink-700">{g.unlocked ? "Unlocked" : `Complete Level ${g.level}`}</div>
            </div>
          ))}
        </div>
        <div className="flex gap-2 mt-4">
          {profile.badges?.map((b: any, i: number) => (
            <BadgeCard
              key={i}
              name={b.name}
              desc={b.desc || ""}
              image={b.image || "/images/badge.png"}
              unlocked={!!b.unlocked}
              onShareWhatsapp={() => window.open(`https://wa.me/?text=I%20earned%20the%20${b.name}!`, "_blank")}
              onShareInstagram={() => window.open("https://www.instagram.com/", "_blank")}
              lockedCondition={b.lockedCondition || "Complete challenge to unlock."}
            />
          ))}
        </div>
  {(!profile.gifts?.length || profile.gifts.some((g: any) => !g.unlocked)) && (
          <div className="text-pink-600 mt-4">😢 You are missing some gifts. Complete levels to unlock!</div>
        )}
      </motion.div>

      {/* Verse of the Day */}
      <motion.div
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.7 }}
        className="w-full max-w-xl rounded-xl bg-gradient-to-br from-yellow-100 via-pink-50 to-white shadow-lg p-6 mb-6 flex items-center gap-4"
      >
        <span className="text-3xl text-pink-500">🌸</span>
        <div className="font-semibold text-yellow-700">{verses[verseIdx]}</div>
      </motion.div>
    </div>
  );
}
