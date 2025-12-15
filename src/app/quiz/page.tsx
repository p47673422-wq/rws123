"use client";

import { useEffect, useState } from "react";
import ProfileForm from "../../components/ProfileForm";
import QuizRunner from "../../components/QuizRunner";
import { quizDefinition as gitaMeditationQuiz } from "@/lib/quizDefinition";
import { fourConceptQuizDefinition } from "@/lib/fourConceptQuizDefinition";

type Mode = "select" | "profile" | "quiz";

export default function QuizPage() {
  const [profile, setProfile] = useState<any>(null);
  const [mode, setMode] = useState<Mode>("select");
  const [selectedQuiz, setSelectedQuiz] = useState<any>(null);

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

      {/* ================= HEADER ================= */}
      <div
        className="w-full h-36 md:h-44 bg-cover bg-center rounded-b-3xl shadow"
        style={{ backgroundImage: "url('/images/BG.jpg')" }}
      />

      <header className="max-w-4xl mx-auto px-6 mt-4 text-center">
        <h1 className="text-3xl font-bold text-amber-800">
          Gita Learning Journey
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
            <div className="bg-white p-6 rounded-2xl shadow border border-amber-100">
              <h2 className="text-xl font-semibold text-amber-800">
                Gita Meditation Quiz
              </h2>
              <p className="text-sm text-slate-700 mt-2">
                A guided quiz based on Bhagavad Gita As It Is by Srila Prabhupada.
                Ideal for first-time seekers.
              </p>

              <ul className="text-sm text-slate-600 mt-3 list-disc ml-5">
                <li>Multiple sections</li>
                <li>Mixed question types</li>
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
            <div className="bg-white p-6 rounded-2xl shadow border border-amber-100">
              <h2 className="text-xl font-semibold text-amber-800">
                Four Fundamental Truths of Gita
              </h2>
              <p className="text-sm text-slate-700 mt-2">
                A deep, video-based journey exploring core truths of existence
                taught by Krishna.
              </p>

              <ul className="text-sm text-slate-600 mt-3 list-disc ml-5">
                <li>4 core concepts</li>
                <li>Video + reflection</li>
                <li>Philosophical depth</li>
              </ul>

              <button
                onClick={() => startQuiz(fourConceptQuizDefinition)}
                className="mt-4 px-5 py-2 bg-green-700 hover:bg-green-800 text-white rounded-xl"
              >
                Begin Concept Journey
              </button>
            </div>
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
