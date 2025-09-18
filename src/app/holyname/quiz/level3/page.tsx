"use client";
import React, { useEffect, useState } from "react";
import GlowingInput from "../../../../components/ui/GlowingInput";
import GlowingButton from "../../../../components/ui/GlowingButton";
import { useLocalProfile } from "../../../../hooks/useLocalProfile";
import { motion, AnimatePresence } from "framer-motion";
import BadgeModal from "../../../../components/ui/BadgeModal";

export default function QuizLevel3Page() {
  const { profile, loading, error, refresh } = useLocalProfile();
  const [commitment, setCommitment] = useState({ rounds: "", friends: "", japaChallenge: false });
  const [status, setStatus] = useState<"new" | "incomplete" | "locked" | "unlocked">("new");
  const [gift, setGift] = useState<any>(null);
  const [badge, setBadge] = useState<any>(null);
  const [message, setMessage] = useState("");
  const [showBadge, setShowBadge] = useState(false);
  const [showProfileModal, setShowProfileModal] = useState(false);
  const [profileForm, setProfileForm] = useState({ name: "", mobile: "", gender: "", address: "" });
  const [profileLoading, setProfileLoading] = useState(false);
  const [showBadgeModal, setShowBadgeModal] = useState(false);

  useEffect(() => {
    if (!profile) return;
    const level3Commit = profile.commitments?.find((c: any) => c.level === 3);
    const giftObj = profile.gifts?.find((g: any) => g.level === 3 && g.type === "QUIZ");
    const badgeObj = profile.badges?.find((b: any) => b.level === 3 && b.type === "QUIZ_COMPLETION");
    if (!level3Commit) {
      setStatus("new");
      setCommitment({ rounds: "", friends: "", japaChallenge: false });
    } else if (!level3Commit.isComplete) {
      setStatus("incomplete");
      setCommitment({
        rounds: level3Commit.rounds || "",
        friends: level3Commit.friends || "",
        japaChallenge: !!level3Commit.japaChallenge,
      });
      setMessage("You started your commitment 🌸 — please complete to unlock your sticker gift!");
    } else if (giftObj && !giftObj.unlocked) {
      setStatus("locked");
      setCommitment({
        rounds: level3Commit.rounds || "",
        friends: level3Commit.friends || "",
        japaChallenge: !!level3Commit.japaChallenge,
      });
      setMessage("Complete all commitments to unlock your sticker gift.");
    } else if (giftObj && giftObj.unlocked) {
      setStatus("unlocked");
      setGift(giftObj);
      setBadge(badgeObj);
    }
  }, [profile]);

  useEffect(() => {
    if (badge && !showBadgeModal) {
      setShowBadgeModal(true);
    }
  }, [badge]);

  const handleInput = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value, type, checked } = e.target;
    setCommitment(c => ({
      ...c,
      [name]: type === "checkbox" ? checked : value,
    }));
  };

  const handleSubmit = async () => {
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
    // Validate
    if (!commitment.rounds || !commitment.friends) {
      setMessage("Please fill all fields to unlock your sticker gift.");
      // Save incomplete
      await fetch("/api/holyname/commitment/save", {
        method: "POST",
        body: JSON.stringify({
          userId: userProfile.id,
          level: 3,
          rounds: commitment.rounds,
          friends: commitment.friends,
          japaChallenge: commitment.japaChallenge,
          isComplete: false,
        }),
        headers: { "Content-Type": "application/json" },
      });
      refresh();
      setStatus("locked");
      return;
    }
    // Save complete
    await fetch("/api/holyname/commitment/save", {
      method: "POST",
      body: JSON.stringify({
        userId: userProfile.id,
        level: 3,
        rounds: commitment.rounds,
        friends: commitment.friends,
        japaChallenge: commitment.japaChallenge,
        isComplete: true,
      }),
      headers: { "Content-Type": "application/json" },
    });
    // Unlock gift and badge
    const res = await fetch("/api/holyname/quiz/submit", {
      method: "POST",
      body: JSON.stringify({
        userId: profile.id,
        level: 3,
        answers: [],
        isComplete: true,
      }),
      headers: { "Content-Type": "application/json" },
    });
    const data = await res.json();
    if (data.gift?.unlocked) {
      setGift(data.gift);
      setBadge(data.badge);
      setStatus("unlocked");
      setShowBadge(true);
      setMessage("Congratulations! You unlocked your sticker gift and earned the Holy Name Badge!");
    } else {
      setStatus("locked");
      setMessage("Saved, but sticker gift is locked.");
    }
    refresh();
  };

  if (loading) return <div className="min-h-screen flex items-center justify-center">Loading...</div>;
  if (error) return <div className="min-h-screen flex items-center justify-center text-red-600">{error}</div>;

  // Claim Gift Screen
  if (status === "unlocked") {
    return (
      <>
        <BadgeModal
          open={showBadgeModal}
          badge={{
            name: badge?.name || "Holy Name Badge",
            desc: badge?.desc || "You completed Level 3 Quiz!",
            image: badge?.image || "/images/badge.png",
          }}
          onClose={() => setShowBadgeModal(false)}
          shareWhatsapp={() => window.open(`https://wa.me/?text=I%20earned%20the%20${badge?.name}!`, "_blank")}
          shareInstagram={() => window.open("https://www.instagram.com/", "_blank")}
        />
        <div className="min-h-screen bg-gradient-to-br from-pink-200 via-white to-yellow-50 flex flex-col items-center py-8 px-2">
          {/* Back to Profile Button */}
          <div className="w-full flex justify-start mb-4">
            <a href="/holyname/profile" className="px-4 py-2 rounded bg-gradient-to-r from-yellow-400 via-pink-200 to-white text-yellow-900 font-bold shadow hover:scale-105 transition">← Back to Profile</a>
          </div>
          <h2 className="text-2xl font-bold text-pink-700 mb-4">Level 3 Gift</h2>
          <motion.div
            initial={{ scale: 0.8, opacity: 0.7 }}
            animate={{ scale: [1, 1.1, 1], boxShadow: "0 0 48px #fbbf24", opacity: 1 }}
            transition={{ duration: 2, repeat: Infinity }}
            className="w-64 h-64 rounded-full bg-gradient-to-br from-pink-300 via-yellow-200 to-white flex flex-col items-center justify-center shadow-2xl border-8 border-pink-400 relative"
          >
            <span className="text-6xl">🌸</span>
            <span className="text-xl font-bold text-pink-700 mt-2">Sticker Unlocked!</span>
            {/* Floating aura animation */}
            <motion.div
              className="absolute inset-0 rounded-full border-4 border-pink-200 animate-pulse"
              animate={{ opacity: [0.7, 1, 0.7] }}
              transition={{ duration: 2, repeat: Infinity }}
            />
          </motion.div>
          {showBadge && (
            <motion.div
              initial={{ scale: 0.5, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              transition={{ duration: 0.8 }}
              className="fixed top-1/4 left-1/2 -translate-x-1/2 bg-white border-4 border-yellow-400 rounded-xl shadow-2xl px-8 py-6 z-50 flex flex-col items-center"
            >
              <span className="text-5xl">🏅</span>
              <span className="text-xl font-bold text-yellow-700 mt-2">You earned the Holy Name Badge!</span>
            </motion.div>
          )}
          <div className="mt-8 w-full max-w-xl">
            <h3 className="text-lg font-semibold text-pink-700">Your Commitments:</h3>
            <ul className="mt-2 text-pink-900">
              <li>Chant {commitment.rounds} rounds daily</li>
              <li>Inspire {commitment.friends} friends</li>
              <li>Join Japa Challenge: {commitment.japaChallenge ? "Yes" : "No"}</li>
            </ul>
          </div>
          <div className="flex gap-4 mt-8">
            <a href="https://wa.me/?text=I%20completed%20the%20Holy%20Name%20Challenge!" target="_blank"><GlowingButton>Share on WhatsApp</GlowingButton></a>
            <a href="https://www.instagram.com/" target="_blank"><GlowingButton>Share on Instagram</GlowingButton></a>
          </div>
          {/* Bottom Navigation */}
          <div className="flex gap-2 mt-8 justify-center">
            <a href="/holyname/quiz/level1"><button className="px-4 py-2 rounded bg-gradient-to-r from-yellow-400 via-pink-200 to-white text-yellow-900 font-bold shadow hover:scale-105 transition">Go to Level 1</button></a>
            <a href="/holyname/quiz/level2"><button className="px-4 py-2 rounded bg-gradient-to-r from-yellow-400 via-pink-200 to-white text-yellow-900 font-bold shadow hover:scale-105 transition">Go to Level 2</button></a>
            <a href="/holyname/quiz/level3"><button className="px-4 py-2 rounded bg-gradient-to-r from-yellow-400 via-pink-200 to-white text-yellow-900 font-bold shadow hover:scale-105 transition">Go to Level 3</button></a>
          </div>
          {message && <div className="text-pink-600 font-semibold mt-4">{message}</div>}
        </div>
      </>
    );
  }

  // Locked sticker screen
  if (status === "locked") {
    return (
      <div className="min-h-screen bg-gradient-to-br from-pink-200 via-white to-yellow-50 flex flex-col items-center py-8 px-2">
        {/* Back to Profile Button */}
        <div className="w-full flex justify-start mb-4">
          <a href="/holyname/profile" className="px-4 py-2 rounded bg-gradient-to-r from-yellow-400 via-pink-200 to-white text-yellow-900 font-bold shadow hover:scale-105 transition">← Back to Profile</a>
        </div>
        <h2 className="text-2xl font-bold text-pink-700 mb-4">Level 3 Gift</h2>
        <div className="w-64 h-64 rounded-full bg-gray-100 flex flex-col items-center justify-center shadow-lg border-8 border-gray-300">
          <span className="text-6xl">🌸</span>
          <span className="text-xl font-bold text-gray-500 mt-2">Sticker Locked</span>
          <div className="text-gray-500 mt-4">Complete all commitments to unlock</div>
        </div>
        <div className="mt-8 w-full max-w-xl">
          <h3 className="text-lg font-semibold text-pink-700">Your Commitments:</h3>
          <ul className="mt-2 text-pink-900">
            <li>Chant {commitment.rounds} rounds daily</li>
            <li>Inspire {commitment.friends} friends</li>
            <li>Join Japa Challenge: {commitment.japaChallenge ? "Yes" : "No"}</li>
          </ul>
        </div>
        {message && <div className="text-pink-600 font-semibold mt-4">{message}</div>}
      </div>
    );
  }

  // Commitment Form
  return (
    <div className="min-h-screen bg-gradient-to-br from-pink-200 via-white to-yellow-50 flex flex-col items-center py-8 px-2">
      {/* Back to Profile Button */}
      <div className="w-full flex justify-start mb-4">
        <a href="/holyname/profile" className="px-4 py-2 rounded bg-gradient-to-r from-yellow-400 via-pink-200 to-white text-yellow-900 font-bold shadow hover:scale-105 transition">← Back to Profile</a>
      </div>
      <h2 className="text-2xl font-bold text-pink-700 mb-4">Level 3 Commitment</h2>
      <AnimatePresence>
        <motion.form
          initial={{ opacity: 0, y: 40 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -40 }}
          transition={{ duration: 0.7 }}
          className="w-full max-w-xl bg-white rounded-xl shadow-lg p-8 flex flex-col gap-6"
          onSubmit={e => { e.preventDefault(); handleSubmit(); }}
        >
          <div className="flex flex-col gap-2">
            <label className="font-semibold text-pink-700">I will chant ___ rounds daily.</label>
            <GlowingInput
              type="number"
              name="rounds"
              value={commitment.rounds}
              onChange={handleInput}
              placeholder="Enter number of rounds"
              className="bg-pink-50 border-pink-300 focus:ring-pink-400"
              required
            />
          </div>
          <div className="flex flex-col gap-2">
            <label className="font-semibold text-pink-700">I will inspire ___ friends.</label>
            <GlowingInput
              type="number"
              name="friends"
              value={commitment.friends}
              onChange={handleInput}
              placeholder="Enter number of friends"
              className="bg-pink-50 border-pink-300 focus:ring-pink-400"
              required
            />
          </div>
          <div className="flex items-center gap-2">
            <input
              type="checkbox"
              name="japaChallenge"
              checked={commitment.japaChallenge}
              onChange={handleInput}
              className="accent-pink-500 w-5 h-5"
            />
            <label className="font-semibold text-pink-700">I will join the Japa Challenge 🙏</label>
          </div>
          {message && <div className="text-pink-600 font-semibold mb-2">{message}</div>}
          <GlowingButton type="submit">Submit Commitment</GlowingButton>
        </motion.form>
      </AnimatePresence>
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
                handleSubmit(); // Retry original action
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
    </div>
  );
}
