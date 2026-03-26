"use client";

import { useEffect, useState, useRef } from "react";
import ProfileForm from "../../components/ProfileForm";
import QuizRunner from "../../components/QuizRunner";
import { quizDefinition as gitaMeditationQuiz } from "@/lib/quizDefinition";
// import { fourConceptQuizDefinition } from "@/lib/fourConceptQuizDefinition";

type Mode = "select" | "profile" | "quiz";

export default function QuizPage() {
  const [profile, setProfile] = useState<any>(null);
  const [mode, setMode] = useState<Mode>("select");
  const [selectedQuiz, setSelectedQuiz] = useState<any>(null);
  const audioRef = useRef<HTMLAudioElement | null>(null);
    useEffect(() => {
      // Try to play background music on mount
      if (audioRef.current) {
        audioRef.current.volume = 0.5;
        audioRef.current.play().catch(() => {});
      }
    }, []);

  useEffect(() => {
    const raw = localStorage.getItem("_mkt_profile_v1");
    if (raw) setProfile(JSON.parse(raw));
  }, []);

  function startQuiz(quiz: any) {
    setSelectedQuiz(quiz);
    if (!profile) setMode("profile");
    else setMode("quiz");
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-amber-50 to-white">
      <audio ref={audioRef} src="/audio/qrn.mp3" autoPlay loop style={{ display: 'none' }} />

      {/* ================= HEADER ================= */}
      <div
        className="w-full h-36 md:h-44 bg-cover bg-center rounded-b-3xl shadow"
        style={{ backgroundImage: "url('/images/ram.jpeg')" }}
      />

      <header className="max-w-4xl mx-auto px-6 mt-4 text-center">
        <h1 className="text-3xl font-bold text-amber-800">
          Bhakti Path
        </h1>
        <p className="text-sm text-slate-600 mt-1">
          Reflect • Learn • Transform
        </p>
      </header>

      <main className="max-w-4xl mx-auto px-6 mt-8 pb-24">

        {/* ================= QUIZ SELECTION ================= */}
        {mode === "select" && (
          <div className="grid md:grid-cols-2 gap-6 animate-fadeIn">

            {/* -------- GITA MEDITATION QUIZ -------- */}
            <div className="bg-white p-6 rounded-2xl shadow border border-amber-100 md:col-span-2">
              <h2 className="text-xl font-semibold text-amber-800">
                Ram Navami Meditation Quiz
              </h2>
              
              <ul className="text-sm text-slate-600 mt-3 list-disc ml-5">
                <li>Increase bhakti</li>
                <li>Know about Lord Ram</li>
                <li>Gift after completion</li>
              </ul>

              <button
                onClick={() => startQuiz(gitaMeditationQuiz)}
                className="mt-4 px-5 py-2 bg-amber-600 hover:bg-amber-700 text-white rounded-xl"
              >
                Start Meditation Quiz
              </button>
            </div>

            {/* -------- FOUR CONCEPT JOURNEY -------- */}
          </div>
        )}

        {/* ================= PROFILE ================= */}
        {mode === "profile" && (
          <ProfileForm
            initial={profile}
            onSave={(p: any) => {
              localStorage.setItem("_mkt_profile_v1", JSON.stringify(p));
              setProfile(p);
              setMode("quiz");
            }}
            onCancel={() => setMode("select")}
          />
        )}

        {/* ================= QUIZ PLAYER ================= */}
        {mode === "quiz" && selectedQuiz && profile && (
          <QuizRunner
            quiz={selectedQuiz}
            profile={profile}
            onExit={() => setMode("select")}
          />
        )}
      </main>
    </div>
  );
}
