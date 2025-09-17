"use client";
import React, { useEffect, useState } from "react";
import FlipCard from "../../../../components/ui/FlipCard";
import GlowingInput from "../../../../components/ui/GlowingInput";
import GlowingButton from "../../../../components/ui/GlowingButton";
import GiftCard from "../../../../components/ui/GiftCard";
import { useLocalProfile } from "../../../../hooks/useLocalProfile";
// import Confetti from "../../../components/ui/Confetti"; // If using

const images = [
  { src: "/images/devotion1.jpg", label: "Image 1" },
  { src: "/images/devotion2.jpg", label: "Image 2" },
  { src: "/images/devotion3.jpg", label: "Image 3" },
  { src: "/images/devotion4.jpg", label: "Image 4" },
];

export default function QuizLevel1Page() {
  const { profile, loading, error, refresh } = useLocalProfile();
  const [answers, setAnswers] = useState(["", "", "", "", ""]);
  const [status, setStatus] = useState<"new" | "incomplete" | "locked" | "unlocked">("new");
  const [gift, setGift] = useState<any>(null);
  const [message, setMessage] = useState("");
  const [showProfileModal, setShowProfileModal] = useState(false);
  const [profileForm, setProfileForm] = useState({ name: "", mobile: "", gender: "", address: "" });
  const [profileLoading, setProfileLoading] = useState(false);

  useEffect(() => {
    if (!profile) return;
    // Check quiz answers for level 1
    const level1Answers = profile.quizAnswers?.filter((a: any) => a.level === 1) || [];
    const giftObj = profile.gifts?.find((g: any) => g.level === 1 && g.type === "QUIZ");
    if (level1Answers.length === 0) {
      setStatus("new");
      setAnswers(["", "", "", "", ""]);
    } else if (level1Answers.length < 5) {
      setStatus("incomplete");
      setAnswers(level1Answers.map((a: any) => a.answer).concat(Array(5 - level1Answers.length).fill("")));
      setMessage("You started this quiz earlier 🌸 — please complete to unlock your gift 🎁");
    } else if (giftObj && !giftObj.unlocked) {
      setStatus("locked");
      setAnswers(level1Answers.map((a: any) => a.answer));
      setMessage("Complete missing answers to unlock");
    } else if (giftObj && giftObj.unlocked) {
      setStatus("unlocked");
      setAnswers(level1Answers.map((a: any) => a.answer));
      setGift(giftObj);
    }
  }, [profile]);

  const handleInput = (idx: number, value: string) => {
    setAnswers(a => a.map((v, i) => (i === idx ? value : v)));
  };

  const handleSubmit = async () => {
    // Check profile
    let userProfile = profile;
    if (!userProfile) {
      // Try fetch
      const res = await fetch("/api/holyname/profile");
      if (res.ok) {
        userProfile = await res.json();
      }
    }
    if (!userProfile) {
      setShowProfileModal(true);
      return;
    }
    // Validate
    if (answers.slice(0, 4).some(a => !a) || !answers[4]) {
      setMessage("Please answer all questions to unlock your gift.");
      // Save incomplete
      await fetch("/api/holyname/quiz/submit", {
        method: "POST",
        body: JSON.stringify({
          userId: userProfile.id,
          level: 1,
          answers: answers,
          isComplete: false,
        }),
        headers: { "Content-Type": "application/json" },
      });
      refresh();
      setStatus("locked");
      return;
    }
    // Save complete
    const res = await fetch("/api/holyname/quiz/submit", {
      method: "POST",
      body: JSON.stringify({
        userId: userProfile.id,
        level: 1,
        answers: answers,
        isComplete: true,
      }),
      headers: { "Content-Type": "application/json" },
    });
    const data = await res.json();
    if (data.gift?.unlocked) {
      setGift(data.gift);
      setStatus("unlocked");
      setMessage("Congratulations! You unlocked your certificate.");
    } else {
      setStatus("locked");
      setMessage("Saved, but gift is locked.");
    }
    refresh();
  };

  if (loading) return <div className="min-h-screen flex items-center justify-center">Loading...</div>;
  if (error) return <div className="min-h-screen flex items-center justify-center text-red-600">{error}</div>;

  return (
    <div className="min-h-screen bg-gradient-to-br from-yellow-100 via-pink-50 to-white flex flex-col items-center py-8 px-2">
      {/* Back to Profile Button */}
      <div className="w-full flex justify-start mb-4">
        <a href="/holyname/profile" className="px-4 py-2 rounded bg-gradient-to-r from-yellow-400 via-pink-200 to-white text-yellow-900 font-bold shadow hover:scale-105 transition">← Back to Profile</a>
      </div>
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
                localStorage.setItem("mobile", profileForm.mobile);
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
      <h2 className="text-2xl font-bold text-yellow-700 mb-4">Level 1 Quiz</h2>
      {status === "unlocked" ? (
        <div className="flex flex-col items-center gap-6">
          {/* <Confetti /> */}
          <GiftCard unlocked name="Certificate" />
          <div className="mt-4">
            <h3 className="text-lg font-semibold text-yellow-700">Your Answers:</h3>
            <ul className="mt-2 text-yellow-900">
              {answers.map((a, i) => (
                <li key={i}>{a}</li>
              ))}
            </ul>
          </div>
        </div>
      ) : (
        <form className="w-full max-w-xl flex flex-col items-center gap-6" onSubmit={e => { e.preventDefault(); handleSubmit(); }}>
          <div className="grid grid-cols-2 gap-4 w-full">
            {images.map((img, idx) => (
              <div key={idx} className="flex flex-col items-center gap-2">
                <FlipCard frontImg={img.src} label={`Devotional Image ${idx + 1}`} />
                <GlowingInput
                  type="text"
                  value={answers[idx]}
                  onChange={e => handleInput(idx, e.target.value)}
                  placeholder="Identify this image"
                  required={status === "new" || status === "incomplete"}
                />
              </div>
            ))}
          </div>
          <div className="w-full mt-4">
            <GlowingInput
              type="text"
              value={answers[4]}
              onChange={e => handleInput(4, e.target.value)}
              placeholder="What is common in all pictures?"
              required={status === "new" || status === "incomplete"}
            />
          </div>
          {message && <div className="text-pink-600 font-semibold mb-2">{message}</div>}
          <GlowingButton type="submit">
            {status === "locked" ? "Save & Try Again" : "Submit"}
          </GlowingButton>
        </form>
      )}
      {/* Bottom Navigation */}
      <div className="flex gap-2 mt-8 justify-center">
        <a href="/holyname/quiz/level1"><button className="px-4 py-2 rounded bg-gradient-to-r from-yellow-400 via-pink-200 to-white text-yellow-900 font-bold shadow hover:scale-105 transition">Go to Level 1</button></a>
        <a href="/holyname/quiz/level2"><button className="px-4 py-2 rounded bg-gradient-to-r from-yellow-400 via-pink-200 to-white text-yellow-900 font-bold shadow hover:scale-105 transition">Go to Level 2</button></a>
        <a href="/holyname/quiz/level3"><button className="px-4 py-2 rounded bg-gradient-to-r from-yellow-400 via-pink-200 to-white text-yellow-900 font-bold shadow hover:scale-105 transition">Go to Level 3</button></a>
      </div>
    </div>
  );
}
