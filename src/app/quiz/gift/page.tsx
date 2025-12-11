"use client";

import { useEffect, useState } from "react";
import { quizDefinition } from "@/lib/quizDefinition";

// ---------------- QUOTE CAROUSEL ----------------
const quotes = [
  "BG 4.38 — There is no purifier equal to transcendental knowledge.",
  "BG 2.47 — Perform your duty without attachment.",
  "BG 18.66 — Surrender to Krishna for complete protection.",
  "BG 6.5 — Elevate yourself by your own mind.",
  "BG 12.20 — Devotees engaged with faith are very dear to Krishna.",
];

function QuoteCarousel() {
  const [i, setI] = useState(0);

  useEffect(() => {
    const id = setInterval(() => setI((x) => (x + 1) % quotes.length), 2800);
    return () => clearInterval(id);
  }, []);

  return (
    <div className="bg-amber-100 p-4 rounded-xl shadow text-amber-900 border border-amber-200">
      <p className="font-semibold text-center">{quotes[i]}</p>
    </div>
  );
}

// ---------------- FORMAT ANSWERS ----------------
function formatUserAnswer(q: any, ans: any): string {
  if (ans === undefined || ans === null) return "—";

  if (q.type === "single-choice" || q.type === "true-false") {
    return q.options?.[ans] ?? "—";
  }

  if (q.type === "multi-choice") {
    const arr: number[] = Array.isArray(ans) ? ans.map((v) => Number(v)) : [];
    return arr.map((i) => q.options?.[i] ?? `(${i})`).join(", ");
  }

  if (q.type === "one-word" || q.type === "fill-blank") {
    return String(ans) || "—";
  }

  if (q.type === "match") {
    // ans is expected to be an object like { "0": 2, "1": 1, ... }
    const map = ans as Record<string, unknown>;
    return Object.entries(map)
      .map(([a, b]) => {
        const ai = Number(a);
        const bi = Number(b as unknown);
        const left = q.columnA?.[ai] ?? `A${a}`;
        const right = q.columnB?.[bi] ?? `B${String(b)}`;
        return `${left} → ${right}`;
      })
      .join(", ");
  }

  return "—";
}

function formatCorrectAnswer(q: any): string | null {
  if (!q.graded) return null;

  if (q.type === "single-choice" || q.type === "true-false") {
    return q.options?.[q.answerIndex] ?? null;
  }

  if (q.type === "multi-choice") {
    const arr: number[] = Array.isArray(q.answerIndexes)
      ? q.answerIndexes.map((v: any) => Number(v))
      : [];
    return arr.map((i) => q.options?.[i] ?? `(${i})`).join(", ");
  }

  if (q.type === "match") {
    const cmap = q.correctMap as Record<string, unknown>;
    return Object.entries(cmap)
      .map(([a, b]) => {
        const ai = Number(a);
        const bi = Number(b as unknown);
        const left = q.columnA?.[ai] ?? `A${a}`;
        const right = q.columnB?.[bi] ?? `B${String(b)}`;
        return `${left} → ${right}`;
      })
      .join(", ");
  }

  return null;
}

// ---------------- MAIN PAGE ----------------
export default function GiftPage() {
  const [profile, setProfile] = useState<any>(null);
  const [attempts, setAttempts] = useState<any[]>([]);

  useEffect(() => {
    const raw = localStorage.getItem("_mkt_profile_v1");
    if (raw) {
      const user = JSON.parse(raw);
      setProfile(user);

      fetch(`/api/attempts?userId=${user.id}`)
        .then((r) => r.json())
        .then((data) => setAttempts(data));
    }
  }, []);

  return (
    <div className="min-h-screen p-6 bg-gradient-to-br from-amber-50 to-white">
      <header className="max-w-3xl mx-auto pb-4 border-b border-amber-200">
        <h1 className="text-xl font-bold text-amber-800">
          Claim Your Gita Meditation Gift
        </h1>
      </header>

      <main className="max-w-3xl mx-auto mt-6 space-y-6">

        <QuoteCarousel />

        {/* ---------------- GITA PROMOTION ---------------- */}
        <div className="bg-white p-6 rounded-xl shadow border border-amber-100 flex flex-col md:flex-row gap-6 items-center md:items-start">

  {/* BOOK IMAGE */}
  <div className="w-36 flex-shrink-0">
    <img
      src="/images/BG.jpg"
      alt="Bhagavad Gita As It Is"
      className="w-full h-auto rounded-lg shadow-md border border-amber-100"
    />
  </div>

  {/* TEXT CONTENT */}
  <div className="flex-1">
    <h2 className="font-bold text-lg text-amber-800">
      Why Bhagavad Gita Is Essential
    </h2>

    <p className="mt-2 text-sm text-slate-700 leading-relaxed">
      <span className="font-semibold">Bhagavad Gita As It Is</span> by 
      <span className="font-semibold"> Srila Prabhupada</span> presents Krishna’s
      teachings in their purest form — practical, powerful, and spiritually uplifting.
    </p>

    <ul className="list-disc ml-5 mt-3 text-sm text-slate-700 space-y-1">
      <li>Purifies the heart (BG 4.38)</li>
      <li>Teaches detached action (BG 2.47)</li>
      <li>Gives full surrender & protection (BG 18.66)</li>
      <li>Strengthens devotion & clarity (BG 12.20)</li>
    </ul>

    <a
      href="https://vedabase.io/en/library/bg/"
      target="_blank"
      className="inline-block mt-4 px-4 py-2 bg-green-700 text-white rounded hover:bg-green-800 transition"
    >
      Read Gita Online
    </a>
  </div>
</div>

        {/* ---------------- NO ATTEMPTS ---------------- */}
        {attempts.length === 0 ? (
          <div className="bg-white p-5 rounded-xl shadow border border-amber-100">
            <h3 className="font-semibold">No attempts found</h3>
            <p className="text-sm text-slate-600 mt-2">
              Take the Gita Meditation Quiz to unlock your gift and spiritual
              insights based on the teachings of Srila Prabhupada.
            </p>

            <a
              href="/quiz"
              className="inline-block mt-3 px-4 py-2 bg-amber-600 text-white rounded"
            >
              Take Quiz Now
            </a>
          </div>
        ) : (
          attempts.map((att) => (
            <div
              key={att.id}
              className="bg-white p-6 rounded-xl shadow border border-amber-100 space-y-4"
            >
              <h3 className="text-lg font-semibold text-amber-800">
                Attempt on {new Date(att.createdAt).toLocaleString()}
              </h3>

              <p className="text-sm text-slate-700 mb-3">
                <span className="font-semibold">Score:</span>{" "}
                {att.score.total} / {att.score.max}
              </p>

              {/* ---------------- SECTION-WISE RESULT ---------------- */}
              {quizDefinition.sections.map((section) => (
                <details
                  key={section.id}
                  className="mb-3 bg-amber-50 rounded-lg border border-amber-200"
                >
                  <summary className="cursor-pointer py-2 px-3 font-semibold text-amber-900">
                    {section.title}
                  </summary>

                  <div className="p-3 space-y-3 border-t border-amber-200 bg-white">
                    {section.items.map((q) => {
                      if (q.type === "paragraph") return null;

                      const userAns = formatUserAnswer(q, att.answers[q.id]);
                      const correctAns = formatCorrectAnswer(q);

                      return (
                        <div
                          key={q.id}
                          className="bg-amber-50 p-3 rounded-md border border-amber-200"
                        >
                          <p className="font-medium text-amber-900">{q.question}</p>

                          <p className="text-sm mt-1">
                            <span className="font-semibold">Your Answer:</span>{" "}
                            {userAns}
                          </p>

                          {correctAns && (
                            <p className="text-sm mt-1">
                              <span className="font-semibold">Correct:</span>{" "}
                              {correctAns}
                            </p>
                          )}
                        </div>
                      );
                    })}
                  </div>
                </details>
              ))}
            </div>
          ))
        )}
      </main>
    </div>
  );
}
