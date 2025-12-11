"use client";
import { useEffect, useState } from "react";

const quotes = [
  "BG 4.38 — Transcendental knowledge purifies.",
  "BG 2.47 — Perform your duty without attachment.",
  "BG 18.66 — Surrender to Krishna for complete protection.",
  "BG 6.5 — Elevate yourself by your own mind.",
  "BG 12.20 — Devotees are very dear to Krishna.",
];

function Carousel() {
  const [i, setI] = useState(0);

  useEffect(() => {
    const t = setInterval(() => setI((x) => (x + 1) % quotes.length), 2500);
    return () => clearInterval(t);
  }, []);

  return (
    <div className="bg-amber-50 p-4 rounded-xl shadow text-slate-700">
      <p className="font-medium">{quotes[i]}</p>
    </div>
  );
}

export default function ResultsClaim({ profile, onBack }: any) {
  const [attempts, setAttempts] = useState<any[]>([]);

  useEffect(() => {
    if (!profile) return;
    fetch(`/api/attempts?userId=${profile.id}`)
      .then((r) => r.json())
      .then((data) => setAttempts(data));
  }, [profile]);

  return (
    <div className="space-y-6">
      <button className="underline text-sm" onClick={onBack}>
        ← Back
      </button>

      <Carousel />

      {!profile && (
        <div className="bg-white p-4 rounded-xl shadow">
          <p>Please complete your profile first.</p>
        </div>
      )}

      {attempts.length === 0 ? (
        <div className="bg-white p-4 rounded-xl shadow">
          <h3 className="font-semibold">No attempts yet</h3>
          <p className="text-sm text-slate-600 mt-2">
            Bhagavad Gita is a handbook for life. Take the quiz & receive your
            Gita meditation gift.
          </p>
        </div>
      ) : (
        attempts.map((att) => (
          <div
            key={att.id}
            className="bg-white p-4 rounded-xl shadow space-y-2"
          >
            <h3 className="font-medium">
              Attempt on {new Date(att.createdAt).toLocaleString()}
            </h3>
            <p className="text-sm text-slate-600">
              Score: {att.score.total} / {att.score.max}
            </p>

            <details className="mt-2">
              <summary className="cursor-pointer text-sm underline">
                View answers
              </summary>
              <pre className="bg-slate-50 p-2 rounded mt-2 overflow-auto max-h-80 text-xs">
                {JSON.stringify(att.answers, null, 2)}
              </pre>
            </details>
          </div>
        ))
      )}
    </div>
  );
}
