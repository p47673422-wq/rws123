"use client";

import { useEffect, useState, useRef } from "react";
import { quizDefinition } from "@/lib/quizDefinition";

/* ------------------------------------------------------------------ */
/* QUOTE CAROUSEL                                                      */
/* ------------------------------------------------------------------ */
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
    <div className="bg-amber-100 p-4 rounded-xl shadow border border-amber-200">
      <p className="font-semibold text-center text-amber-900">{quotes[i]}</p>
    </div>
  );
}

/* ------------------------------------------------------------------ */
/* FORMAT HELPERS                                                      */
/* ------------------------------------------------------------------ */
function formatUserAnswer(q: any, ans: any): string {
  if (ans === undefined || ans === null) return "—";

  if (q.type === "single-choice" || q.type === "true-false") {
    return q.options?.[ans] ?? "—";
  }

  if (q.type === "multi-choice") {
    const arr: number[] = Array.isArray(ans) ? ans.map(Number) : [];
    return arr.map((i) => q.options?.[i]).join(", ");
  }

  if (q.type === "one-word" || q.type === "fill-blank") {
    return String(ans);
  }

  if (q.type === "match") {
    return Object.entries(ans as Record<string, number>)
      .map(([a, b]) => {
        const left = q.columnA?.[Number(a)];
        const right = q.columnB?.[Number(b)];
        return `${left} → ${right}`;
      })
      .join(", ");
  }

  return "—";
}

function formatCorrectAnswer(q: any): string | null {
  if (!q.graded) return null;

  if (q.type === "single-choice" || q.type === "true-false") {
    return q.options?.[q.answerIndex];
  }

  if (q.type === "multi-choice") {
    return q.answerIndexes.map((i: number) => q.options?.[i]).join(", ");
  }

  if (q.type === "match") {
    return Object.entries(q.correctMap).map(
      ([a, b]: any) =>
        `${q.columnA[a]} → ${q.columnB[b]}`
    ).join(", ");
  }

  return null;
}

/* ------------------------------------------------------------------ */
/* CONCEPT METADATA                                                    */
/* ------------------------------------------------------------------ */
const conceptMap = {
  c1: "This Body is NOT all-in-all (BG 2.13)",
  c2: "This Life is NOT all-in-all (BG 2.22)",
  c3: "We are NOT all-in-all (BG 7.7)",
  c4: "This World is NOT all-in-all (BG 15.1)",
};

/* ------------------------------------------------------------------ */
/* MAIN PAGE                                                           */
/* ------------------------------------------------------------------ */
export default function GiftPage() {
  const [attempts, setAttempts] = useState<any[]>([]);
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
    if (!raw) return;

    const user = JSON.parse(raw);
    fetch(`/api/attempts?userId=${user.id}`)
      .then((r) => r.json())
      .then(setAttempts);
  }, []);

  const meditationAttempts = attempts.filter(
    (a) => a.quizId === "ram-navami-meditation-2025"
  );

  const conceptAttempts = attempts.filter(
    (a) => a.quizId?.startsWith("four-fundamental-truths:")
  );

  return (
    <div className="min-h-screen p-6 bg-gradient-to-br from-amber-50 to-white">
      <audio ref={audioRef} src="/audio/qrn.mp3" autoPlay loop style={{ display: 'none' }} />
      <header className="max-w-3xl mx-auto pb-4 border-b border-amber-200">
        <h1 className="text-xl font-bold text-amber-800">
          Claim Your Ram Navami Gift
        </h1>
      </header>

      <main className="max-w-3xl mx-auto mt-6 space-y-8">

        <QuoteCarousel />

        {/* ---------------- GITA PROMOTION ---------------- */}
        <div className="bg-white p-6 rounded-xl shadow border border-amber-100 flex gap-6">
          <img
            src="/images/ram.jpeg"
            alt="Bhagavad Gita As It Is"
            className="w-32 rounded-lg border shadow"
          />
          <div>
  <h2 className="font-bold text-lg text-amber-800">
    Why Ramayana Is Essential
  </h2>
  <p className="mt-2 text-sm text-slate-700">
    <b>Ramayana</b> as presented in disciplic succession reveals the divine pastimes of <b>Lord Ram</b>, the Supreme Personality of Godhead, and teaches perfect dharma and devotion.
  </p>
  <ul className="list-disc ml-5 mt-3 text-sm text-slate-700 space-y-1">
    <li>Reveals Lord Ram as the embodiment of dharma (Ayodhya Kanda)</li>
    <li>Teaches ideal character through His actions (entire Ramayana)</li>
    <li>Demonstrates pure devotion (Hanuman & Shabari)</li>
    <li>Guides righteous living in all situations</li>
  </ul>
</div>
        </div>

        {/* ---------------- NO ATTEMPTS ---------------- */}
        {attempts.length === 0 && (
          <div className="bg-white p-6 rounded-xl shadow border border-amber-100">
            <p className="text-slate-700">
              You have not attempted any quiz yet. Please take the quiz to
              unlock your gift.
            </p>
            <a
              href="/quiz"
              className="inline-block mt-4 px-4 py-2 bg-amber-600 text-white rounded"
            >
              Take Quiz
            </a>
          </div>
        )}

        {/* ================= MEDITATION QUIZ ================= */}
        {meditationAttempts.length > 0 && (
          <div className="bg-white p-6 rounded-xl shadow border border-amber-100">
            <h2 className="text-lg font-bold text-amber-800 mb-4">
              Ram Navami Meditation Quiz Result
            </h2>

            {meditationAttempts.map((att) => (
              <div key={att.id} className="space-y-4">
                <p className="text-sm text-slate-700">
                  Attempted on {new Date(att.createdAt).toLocaleString()}
                </p>

                <p className="font-semibold text-slate-800">
                  Score: {att.score.total} / {att.score.max}
                </p>

                {quizDefinition.sections.map((section) => (
                  <details
                    key={section.id}
                    className="bg-amber-50 rounded-lg border border-amber-200"
                  >
                    <summary className="cursor-pointer px-3 py-2 font-semibold">
                      {section.title}
                    </summary>

                    <div className="p-3 bg-white space-y-3">
                      {section.items.map((q) => {
                        if (q.type === "paragraph") return null;
                        const ua = formatUserAnswer(q, att.answers[q.id]);
                        const ca = formatCorrectAnswer(q);

                        return (
                          <div
                            key={q.id}
                            className="border rounded p-3"
                          >
                            <p className="font-medium">{q.question}</p>
                            <p className="text-sm mt-1">
                              <b>Your answer:</b> {ua}
                            </p>
                            {ca && (
                              <p className="text-sm mt-1">
                                <b>Correct:</b> {ca}
                              </p>
                            )}
                          </div>
                        );
                      })}
                    </div>
                  </details>
                ))}
              </div>
            ))}
          </div>
        )}

        {/* ================= CONCEPT JOURNEY ================= */}
        {/* <div className="bg-white p-6 rounded-xl shadow border border-amber-100">
          <h2 className="text-lg font-bold text-amber-800 mb-2">
            Four Fundamental Truths of the Gita
          </h2>

          {Object.entries(conceptMap).map(([cid, title]) => {
            const att = conceptAttempts.find((a) =>
              a.quizId.endsWith(`:${cid}`)
            );

            return (
              <div
                key={cid}
                className="mt-3 p-4 rounded-lg border bg-amber-50"
              >
                <p className="font-semibold text-amber-900">{title}</p>

                {att ? (
                  <>
                    <p className="text-sm text-green-700 mt-1">
                      ✔ Completed on{" "}
                      {new Date(att.createdAt).toLocaleDateString()}
                    </p>

                    <div className="mt-2 bg-white p-3 rounded border text-sm">
                      {Object.values(att.answers).map((v, i) => (
                        <p key={i}>{String(v)}</p>
                      ))}
                    </div>
                  </>
                ) : (
                  <p className="text-sm text-slate-600 mt-1">
                    Not attempted yet
                  </p>
                )}
              </div>
            );
          })}
        </div> */}

        {/* ---------------- STALL NOTE ---------------- */}
        <div className="bg-amber-100 p-4 rounded-xl border border-amber-200 text-center">
          <p className="text-sm text-amber-900">
            🙏 Please show this page at the stall to receive your
            <b> gift.</b>
          </p>
        </div>

      </main>
    </div>
  );
}
