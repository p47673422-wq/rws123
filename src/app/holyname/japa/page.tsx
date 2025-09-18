"use client";
import React, { useEffect, useState } from "react";
import GlowingButton from "../../../components/ui/GlowingButton";
import { useLocalProfile } from "../../../hooks/useLocalProfile";
import { motion, AnimatePresence } from "framer-motion";
import GlowingInput from "../../../components/ui/GlowingInput";
import BadgeModal from "../../../components/ui/BadgeModal";

const MAX_DAYS = 7;
const todayIdx = () => {
  const now = new Date();
  return now.getDay(); // 0-6 (Sunday-Saturday)
};

function getDayLabel(idx: number) {
  return `Day ${idx + 1}`;
}

function getStreak(entries: any[]) {
  return entries.length;
}

function getTotalRounds(entries: any[]) {
  return entries.reduce((sum: number, e: any) => sum + (e.rounds || 0), 0);
}

export default function JapaChallengePage() {
  const { profile, loading, error, refresh } = useLocalProfile();
  const [entries, setEntries] = useState<any[]>([]);
  const [rounds, setRounds] = useState<number>(0);
  const [message, setMessage] = useState<string>("");
  const [badges, setBadges] = useState<any[]>([]);
  const [showBadge, setShowBadge] = useState<{ name: string; desc: string } | null>(null);
  const [gift, setGift] = useState<any>(null);
  const [claiming, setClaiming] = useState<boolean>(false);
  const [showProfileModal, setShowProfileModal] = useState(false);
  const [profileForm, setProfileForm] = useState({ name: "", mobile: "", gender: "", address: "" });
  const [profileLoading, setProfileLoading] = useState(false);
  const [showBadgeModal, setShowBadgeModal] = useState(false);

  useEffect(() => {
    if (!profile) return;
    const japaEntries = profile.japaProgress || [];
    setEntries(japaEntries.slice(0, MAX_DAYS));
  setBadges(profile.badges?.filter((b: any) => b.type === "JAPA") || []);
  setGift(profile.gifts?.find((g: any) => g.type === "JAPA"));
  }, [profile]);

  // Map entries to days
  const dayEntries = Array(MAX_DAYS).fill(null).map((_, i) => entries[i] || null);
  const streak = getStreak(entries);
  const totalRounds = getTotalRounds(entries);
  const today = streak < MAX_DAYS ? streak : MAX_DAYS - 1;

  // Badge logic
  useEffect(() => {
    if (rounds >= 10 && !badges.some((b: any) => b.name === "Daily Bead Badge")) {
      setShowBadge({ name: "Daily Bead Badge", desc: "Chanted 10+ rounds in a day!" });
    } else if (totalRounds >= 50 && !badges.some((b: any) => b.name === "Steadfast Badge")) {
      setShowBadge({ name: "Steadfast Badge", desc: "Chanted 50+ rounds!" });
    } else if (streak === MAX_DAYS && !badges.some((b: any) => b.name === "Devotional Streak Badge")) {
      setShowBadge({ name: "Devotional Streak Badge", desc: "Completed 7-day streak!" });
    } else {
      setShowBadge(null);
    }
  }, [rounds, totalRounds, streak, badges]);

  useEffect(() => {
    if (showBadge && !showBadgeModal) {
      setShowBadgeModal(true);
    }
  }, [showBadge]);

  const handleRoundsChange = (val: number) => {
    setRounds(Math.max(0, val));
  };

  const handleSave = async () => {
    // Check profile
    let userProfile = profile;
    if (!userProfile) {
      // Try fetch
      const mobile = typeof window !== "undefined" ? localStorage.getItem("mkt_mobile") : "";
      if (mobile) {
        const res = await fetch(`/api/holyname/profile?mobile=${encodeURIComponent(mobile)}`);
        if (res.ok) {
          const data = await res.json();
          userProfile = data.user;
        }
      }
    }
    if (!userProfile) {
      setShowProfileModal(true);
      return;
    }
    if (rounds < 1) {
      setMessage("Please enter at least 1 round.");
      return;
    }
    const day = today + 1;
    await fetch("/api/holyname/japa/save", {
      method: "POST",
      body: JSON.stringify({
        userId: userProfile.id,
        day,
        rounds,
      }),
      headers: { "Content-Type": "application/json" },
    });
    refresh();
  };

  const handleClaimGift = async () => {
    setClaiming(true);
    const res = await fetch("/api/holyname/gift/claim", {
      method: "POST",
      body: JSON.stringify({
        userId: profile.id,
        type: "JAPA",
      }),
      headers: { "Content-Type": "application/json" },
    });
    const data = await res.json();
    setGift(data.gift);
    setMessage("🎉 Gift claimed! See your summary below.");
    setClaiming(false);
    refresh();
  };

  if (loading) return <div className="min-h-screen flex items-center justify-center">Loading...</div>;
  if (error) return <div className="min-h-screen flex items-center justify-center text-red-600">{error}</div>;

  // Claim Gift summary
  if (gift && gift.unlocked) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-yellow-200 via-white to-orange-50 flex flex-col items-center py-8 px-2">
        {/* Top Navigation */}
        <div className="w-full flex justify-start mb-4">
          <a href="/holyname/profile" className="px-4 py-2 rounded bg-gradient-to-r from-yellow-400 via-pink-200 to-white text-yellow-900 font-bold shadow hover:scale-105 transition">← Back to Profile</a>
        </div>
        <h2 className="text-2xl font-bold text-yellow-700 mb-4">Japa Challenge Summary</h2>
        <motion.div
          initial={{ scale: 0.8, opacity: 0.7 }}
          animate={{ scale: [1, 1.1, 1], boxShadow: "0 0 48px #fbbf24", opacity: 1 }}
          transition={{ duration: 2, repeat: Infinity }}
          className="w-64 h-64 rounded-full bg-gradient-to-br from-yellow-300 via-orange-200 to-white flex flex-col items-center justify-center shadow-2xl border-8 border-yellow-400 relative"
        >
          <span className="text-6xl">🎁</span>
          <span className="text-xl font-bold text-yellow-700 mt-2">7-Day Completion Reward</span>
        </motion.div>
        <div className="mt-8 w-full max-w-xl">
          <h3 className="text-lg font-semibold text-yellow-700">Rounds per Day:</h3>
          <ul className="mt-2 text-yellow-900">
            {dayEntries.map((e: any, i: number) => (
              <li key={i}>{getDayLabel(i)}: {e ? e.rounds : 0}</li>
            ))}
          </ul>
          <div className="mt-4 font-bold text-yellow-700">Total Rounds: {totalRounds}</div>
          <div className="mt-4">
            <h4 className="font-semibold text-yellow-700">Badges Earned:</h4>
            <ul className="mt-2 text-yellow-900">
              {badges.map((b: any, i: number) => (
                <li key={i}>{b.name}</li>
              ))}
            </ul>
          </div>
        </div>
        {message && <div className="text-pink-600 font-semibold mt-4">{message}</div>}
        {/* Confetti burst animation here */}
        {/* Bottom Navigation */}
        <div className="flex gap-2 mt-8 justify-center">
          <a href="/holyname/japa"><button className="px-4 py-2 rounded bg-gradient-to-r from-yellow-400 via-pink-200 to-white text-yellow-900 font-bold shadow hover:scale-105 transition">Continue Tomorrow</button></a>
          <a href="/holyname/gifts"><button className="px-4 py-2 rounded bg-gradient-to-r from-yellow-400 via-pink-200 to-white text-yellow-900 font-bold shadow hover:scale-105 transition">View My Gifts</button></a>
        </div>
      </div>
    );
  }

  // Encouragement after 7 days
  if (streak >= MAX_DAYS && !(gift && gift.unlocked)) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-yellow-200 via-white to-orange-50 flex flex-col items-center py-8 px-2">
        {/* Back to Profile Button */}
        <div className="w-full flex justify-start mb-4">
          <a href="/holyname/profile" className="px-4 py-2 rounded bg-gradient-to-r from-yellow-400 via-pink-200 to-white text-yellow-900 font-bold shadow hover:scale-105 transition">← Back to Profile</a>
        </div>
        <h2 className="text-2xl font-bold text-yellow-700 mb-4">Japa Challenge</h2>
        <div className="text-lg text-yellow-700 mb-6">✨ You completed your 7-day challenge! Keep going to earn more milestone badges 🙌</div>
        <div className="w-full max-w-xl">
          <h3 className="text-lg font-semibold text-yellow-700">Rounds per Day:</h3>
          <ul className="mt-2 text-yellow-900">
            {dayEntries.map((e: any, i: number) => (
              <li key={i}>{getDayLabel(i)}: {e ? e.rounds : 0}</li>
            ))}
          </ul>
          <div className="mt-4 font-bold text-yellow-700">Total Rounds: {totalRounds}</div>
        </div>
        <GlowingButton onClick={handleClaimGift} disabled={claiming} className="mt-8">
          {claiming ? "Claiming..." : "🎁 Claim Gift"}
        </GlowingButton>
        {message && <div className="text-pink-600 font-semibold mt-4">{message}</div>}
      </div>
    );
  }

  // Fresh challenge form
  if (streak === 0) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-yellow-200 via-white to-orange-50 flex flex-col items-center py-8 px-2">
        {/* Back to Profile Button */}
        <div className="w-full flex justify-start mb-4">
          <a href="/holyname/profile" className="px-4 py-2 rounded bg-gradient-to-r from-yellow-400 via-pink-200 to-white text-yellow-900 font-bold shadow hover:scale-105 transition">← Back to Profile</a>
        </div>
        <h2 className="text-2xl font-bold text-yellow-700 mb-4">Japa Challenge</h2>
        <div className="bg-white rounded-xl shadow-lg p-6 mb-6 w-full max-w-xl">
          <div className="text-lg font-semibold text-yellow-700 mb-2">Welcome to the 7-Day Japa Challenge!</div>
          <div className="text-yellow-900 mb-4">Chant daily and track your progress. Complete 7 days to unlock your reward!</div>
          <div className="flex items-center gap-2 mt-4">
            <span className="font-semibold text-yellow-700">Day 1:</span>
            <input
              type="number"
              value={rounds}
              onChange={e => handleRoundsChange(Number(e.target.value))}
              className="w-24 px-2 py-1 border-2 border-yellow-300 rounded focus:outline-none focus:ring-2 focus:ring-yellow-400 bg-white text-yellow-900 font-semibold shadow"
              min={0}
            />
            <GlowingButton onClick={handleSave}>Save My Count 🙏</GlowingButton>
          </div>
        </div>
        {message && <div className="text-pink-600 font-semibold mt-4">{message}</div>}
      </div>
    );
  }

  // Incomplete streak form
  return (
    <div className="min-h-screen bg-gradient-to-br from-yellow-200 via-white to-orange-50 flex flex-col items-center py-8 px-2">
      {/* Back to Profile Button */}
      <div className="w-full flex justify-start mb-4">
        <a href="/holyname/profile" className="px-4 py-2 rounded bg-gradient-to-r from-yellow-400 via-pink-200 to-white text-yellow-900 font-bold shadow hover:scale-105 transition">← Back to Profile</a>
      </div>
      <h2 className="text-2xl font-bold text-yellow-700 mb-4">Japa Challenge</h2>
      <div className="flex gap-2 mb-6">
        {Array(MAX_DAYS).fill(null).map((_, i) => (
          <motion.div
            key={i}
            className={`w-10 h-10 rounded-full flex items-center justify-center font-bold text-lg shadow-lg border-2 ${i < streak ? "bg-yellow-300 border-yellow-500 text-yellow-900" : i === streak ? "bg-yellow-100 border-yellow-400 animate-pulse" : "bg-gray-100 border-gray-300 text-gray-400"}`}
            initial={{ scale: 0.8, opacity: 0.7 }}
            animate={{ scale: i === streak ? [1, 1.1, 1] : 1, opacity: 1 }}
            transition={{ duration: 1, repeat: i === streak ? Infinity : 0 }}
          >
            {i < streak ? "✅" : i === streak ? "" : ""}
          </motion.div>
        ))}
      </div>
      <div className="bg-white rounded-xl shadow-lg p-6 mb-6 w-full max-w-xl">
        <div className="text-lg font-semibold text-yellow-700 mb-2">Japa Progress</div>
        <div className="grid grid-cols-1 gap-4">
          {dayEntries.map((entry: any, i: number) => (
            <div key={i} className={`flex items-center gap-4 ${i > streak ? "opacity-40" : ""}`}>
              <span className={`font-semibold text-yellow-700 w-24`}>{getDayLabel(i)}</span>
              {i < streak ? (
                <span className="text-yellow-900 font-bold">{entry ? entry.rounds : 0} rounds</span>
              ) : i === streak ? (
                <>
                  <input
                    type="number"
                    value={i === streak ? rounds : (entry ? entry.rounds : 0)}
                    onChange={e => handleRoundsChange(Number(e.target.value))}
                    className="w-24 px-2 py-1 border-2 border-yellow-300 rounded focus:outline-none focus:ring-2 focus:ring-yellow-400 bg-white text-yellow-900 font-semibold shadow"
                    min={0}
                  />
                  <GlowingButton onClick={handleSave} className={(!entry || entry.rounds === 0) ? "animate-pulse" : ""}>Save My Count 🙏</GlowingButton>
                </>
              ) : (
                <span className="text-gray-400">Future</span>
              )}
            </div>
          ))}
        </div>
      </div>
      <div className="w-full max-w-xl">
        <h3 className="text-lg font-semibold text-yellow-700">Your Progress:</h3>
        <ul className="mt-2 text-yellow-900">
            {dayEntries.map((e: any, i: number) => (
              <li key={i}>{getDayLabel(i)}: {e ? e.rounds : 0}</li>
            ))}
        </ul>
        <div className="mt-4 font-bold text-yellow-700">Total Rounds: {totalRounds}</div>
      </div>
      {showBadge && (
        <motion.div
          initial={{ scale: 0.5, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ duration: 0.8 }}
          className="fixed top-1/4 left-1/2 -translate-x-1/2 bg-white border-4 border-yellow-400 rounded-xl shadow-2xl px-8 py-6 z-50 flex flex-col items-center"
        >
          <span className="text-5xl">🏅</span>
          <span className="text-xl font-bold text-yellow-700 mt-2">{(showBadge as any)?.name}</span>
        </motion.div>
      )}
      {message && <div className="text-pink-600 font-semibold mt-4">{message}</div>}

      {/* Profile Modal */}
      {showProfileModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-40">
          <div className="bg-white rounded-xl shadow-lg max-w-sm w-full relative">
            <div className="rounded-t-xl p-4 text-center font-bold text-white bg-gradient-to-r from-yellow-500 via-orange-400 to-pink-400" style={{ boxShadow: "0 0 24px #fbbf24" }}>
              Complete Your Profile
            </div>
            <form className="p-6 flex flex-col gap-4" onSubmit={async e => {
              e.preventDefault();
              setProfileLoading(true);
              const res = await fetch("/api/holyname/user/register", {
                method: "POST",
                body: JSON.stringify(profileForm),
                headers: { "Content-Type": "application/json" },
              });
              setProfileLoading(false);
              if (res.ok) {
                const data = await res.json();
                localStorage.setItem("mkt_mobile", profileForm.mobile);
                setShowProfileModal(false);
                setProfileForm({ name: "", mobile: "", gender: "", address: "" });
                setTimeout(() => {
                  window.dispatchEvent(new CustomEvent("profileSaved"));
                }, 100);
                window.alert("🌸 Profile saved successfully!");
                handleSave(); // Retry original action
              }
            }}>
              <GlowingInput
                placeholder="Name"
                value={profileForm.name}
                onChange={e => setProfileForm(f => ({ ...f, name: e.target.value }))}
                required
                className="focus:ring-pink-400 shadow-pink-200"
              />
              <GlowingInput
                placeholder="Mobile (unique)"
                value={profileForm.mobile}
                onChange={e => setProfileForm(f => ({ ...f, mobile: e.target.value }))}
                required
                className="focus:ring-pink-400 shadow-pink-200"
                type="tel"
              />
              <GlowingInput
                placeholder="Gender"
                value={profileForm.gender}
                onChange={e => setProfileForm(f => ({ ...f, gender: e.target.value }))}
                required
                className="focus:ring-pink-400 shadow-pink-200"
              />
              <GlowingInput
                placeholder="Address"
                value={profileForm.address}
                onChange={e => setProfileForm(f => ({ ...f, address: e.target.value }))}
                required
                className="focus:ring-pink-400 shadow-pink-200"
              />
              <GlowingButton type="submit" disabled={profileLoading} className="bg-gradient-to-r from-yellow-500 via-orange-400 to-pink-400 text-white font-bold animate-pulse">
                {profileLoading ? "Saving..." : "Save Profile"}
              </GlowingButton>
            </form>
          </div>
        </div>
      )}
      {showBadgeModal && (
        <BadgeModal
          open={showBadgeModal}
          badge={{
            name: (showBadge as any)?.name || "Japa Badge",
            desc: (showBadge as any)?.desc || "Milestone achieved!",
            image: "/images/badge.png",
          }}
          onClose={() => setShowBadgeModal(false)}
          shareWhatsapp={() => window.open(`https://wa.me/?text=I%20earned%20the%20${(showBadge as any)?.name}!`, "_blank")}
          shareInstagram={() => window.open("https://www.instagram.com/", "_blank")}
        />
      )}
    </div>
  );
}
