"use client";

import { useEffect, useState } from "react";
import ProfileForm from "../../components/ProfileForm";
import QuizPlayer from "../../components/QuizPlayer";
import { quizDefinition } from "@/lib/quizDefinition";

export default function QuizPage() {
  const [profile, setProfile] = useState<any>(null);
  const [mode, setMode] = useState<"home" | "profile" | "quiz">("home");

  // Load stored profile
  useEffect(() => {
    const raw = localStorage.getItem("_mkt_profile_v1");
    if (raw) setProfile(JSON.parse(raw));
  }, []);

  function startQuiz() {
    if (!profile) setMode("profile");
    else setMode("quiz");
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-amber-50 to-white">
      {/* ----------------------------- BANNER IMAGE ----------------------------- */}
      <div className="w-full h-32 sm:h-40 md:h-48 bg-cover bg-center rounded-b-3xl shadow-md"
        style={{
          backgroundImage: "url('/images/BG.jpg')",
        }}
      />

      {/* ----------------------------- HEADER ----------------------------- */}
      <header className="max-w-3xl mx-auto px-6 mt-4 text-center">
        <h1 className="text-3xl font-bold text-amber-800 tracking-wide drop-shadow-sm">
          Gita Meditation Quiz
        </h1>
        <p className="text-sm text-slate-600 mt-1">
          Discover divine wisdom through a guided meditation quiz and earn gift.
        </p>
      </header>

      <main className="max-w-3xl mx-auto px-6 mt-8 pb-20">

        {/* =========================================================================
           HOME SCREEN
        ========================================================================= */}
        {mode === "home" && (
          <div className="space-y-8 animate-fadeIn">

            {/* ---------------------- INTRO CARD ---------------------- */}
            <div className="bg-white p-6 rounded-2xl shadow-xl border border-amber-100">
              <h2 className="text-xl font-semibold text-amber-800 mb-2">
                Welcome to Gita Meditation
              </h2>

              <p className="text-slate-700 text-sm leading-relaxed">
                This meditation quiz is based on teachings from the
                <span className="font-semibold"> Bhagavad Gita As It Is </span>
                by <span className="font-semibold">Srila Prabhupada</span>.
                <br />
                You'll explore essential spiritual principles, cultivate
                reflection, and deepen your connection with Krishna.
              </p>

              <button
                onClick={startQuiz}
                className="mt-6 w-full sm:w-auto px-6 py-3 bg-amber-600 hover:bg-amber-700 transition text-white text-sm font-semibold rounded-xl shadow-lg"
              >
                Start Gita Meditation Quiz
              </button>
            </div>

            {/* ---------------------- ART STRIP ---------------------- */}
            <div className="rounded-xl overflow-hidden shadow border border-amber-100">
              <img
                src="/images/arjuna-krishna-chariot.jpg"
                className="w-full h-28 sm:h-40 object-cover"
                alt="Krishna and Arjuna"
              />
            </div>

            {/* ---------------------- TEXT SECTION ---------------------- */}
            <div className="bg-amber-50 p-5 rounded-2xl shadow border border-amber-100">
              <h3 className="font-semibold text-amber-800 text-lg mb-1">
                Why This Quiz?
              </h3>
              <p className="text-sm text-slate-700 leading-relaxed">
                Krishna says in <b>BG 4.38</b>,
                <em> “There is no purifier equal to transcendental knowledge.”</em>
                This quiz is designed to guide you gently into that wisdom.
              </p>
            </div>
          </div>
        )}

        {/* =========================================================================
           PROFILE SCREEN
        ========================================================================= */}
        {mode === "profile" && (
          <div className="animate-fadeIn">
            <ProfileForm
              initial={profile}
              onSave={(p: any) => {
                localStorage.setItem("_mkt_profile_v1", JSON.stringify(p));
                setProfile(p);
                setMode("quiz");
              }}
              onCancel={() => setMode("home")}
            />
          </div>
        )}

        {/* =========================================================================
           QUIZ PLAYER
        ========================================================================= */}
        {mode === "quiz" && profile && (
          <div className="animate-fadeIn">
            <QuizPlayer
              quiz={quizDefinition}
              profile={profile}
              onExit={() => setMode("home")}
            />
          </div>
        )}

      </main>
    </div>
  );
}
