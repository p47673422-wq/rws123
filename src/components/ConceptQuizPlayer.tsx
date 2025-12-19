"use client";

import { useState } from "react";
import QuestionRenderer from "./QuestionRenderer";
import { useRouter } from "next/navigation";

export default function ConceptQuizPlayer({ quiz, profile, onExit }: any) {
  const [conceptIndex, setConceptIndex] = useState(0);
  const [answers, setAnswers] = useState<Record<string, any>>({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [showSuccess, setShowSuccess] = useState(false);
  const [imageIndex, setImageIndex] = useState(0);

  const router = useRouter();
  const concept = quiz.sections[conceptIndex];

  function setAnswer(id: string, v: any) {
    setAnswers((p) => ({ ...p, [id]: v }));
  }

  async function submitConcept() {
    try {
      setIsSubmitting(true);

      const payload = {
        userId: profile.id,
        profile,
        quizId: concept.submitAs,
        answers,
      };

      const res = await fetch("/api/attempts", {
        method: "POST",
        headers: { "content-type": "application/json" },
        body: JSON.stringify(payload),
      });

      if (!res.ok) throw new Error("Submit failed");

      setShowSuccess(true);
    } catch {
      alert("Could not submit. Please try again.");
    } finally {
      setIsSubmitting(false);
    }
  }

  function goNextConcept() {
    setShowSuccess(false);
    setAnswers({});
    setImageIndex(0);

    if (conceptIndex < quiz.sections.length - 1) {
      setConceptIndex(conceptIndex + 1);
    } else {
      onExit();
    }
  }

  return (
    <>
      <div className="space-y-10">

        {/* ================= HEADER ================= */}
        <div className="flex justify-between items-start">
          <div>
            <p className="text-xs uppercase tracking-wide text-amber-600">
              Sutra {conceptIndex + 1} of {quiz.sections.length}
            </p>
            <h2 className="text-2xl font-bold text-amber-800 mt-1">
              {concept.title}
            </h2>
            <p className="text-md font-semibold text-slate-700">
              {concept.subtitle}
            </p>
          </div>

          <button
            onClick={onExit}
            className="text-sm underline text-slate-600 hover:text-black"
          >
            Exit
          </button>
        </div>

        {/* ================= NAVIGATION ================= */}
        <div className="flex gap-3">
          {conceptIndex > 0 && (
            <button
              onClick={() => {
                setConceptIndex(conceptIndex - 1);
                setAnswers({});
                setImageIndex(0);
              }}
              className="px-4 py-2 rounded-lg bg-amber-100 text-amber-800 hover:bg-amber-200"
            >
              ← Previous Sutra
            </button>
          )}
        </div>

        {/* ================= VIDEO ================= */}
        {concept.video && (
          <div className="rounded-2xl overflow-hidden shadow-lg border border-amber-100">
            <iframe
              src={concept.video.url}
              className="w-full h-64 sm:h-80"
              allowFullScreen
            />
          </div>
        )}

        {/* ================= COMIC IMAGE CAROUSEL ================= */}
        {concept.images && concept.images.length > 0 && (
          <div className="bg-[#fffaf0] border border-amber-200 rounded-2xl shadow-xl overflow-hidden">

            {/* IMAGE */}
            <div className="relative">
              <img
                src={concept.images[imageIndex]}
                alt={`Concept visual ${imageIndex + 1}`}
                className="
                  w-full h-56 sm:h-72 object-contain
                  bg-gradient-to-b from-amber-50 to-white
                  p-3
                "
              />

              {/* COMIC BORDER EFFECT */}
              <div className="absolute inset-0 border-4 border-dashed border-amber-200 rounded-2xl pointer-events-none" />
            </div>

            {/* CONTROLS */}
            {concept.images.length > 1 && (
              <div className="flex items-center justify-between px-4 py-3 bg-amber-50 border-t border-amber-200">
                <button
                  onClick={() => setImageIndex((i) => Math.max(0, i - 1))}
                  disabled={imageIndex === 0}
                  className="px-4 py-1 text-sm rounded-full border bg-white shadow disabled:opacity-40"
                >
                  ⬅ Previous
                </button>

                <span className="text-xs text-slate-600">
                  Visual {imageIndex + 1} / {concept.images.length}
                </span>

                <button
                  onClick={() =>
                    setImageIndex((i) =>
                      Math.min(concept.images.length - 1, i + 1)
                    )
                  }
                  disabled={imageIndex === concept.images.length - 1}
                  className="px-4 py-1 text-sm rounded-full border bg-white shadow disabled:opacity-40"
                >
                  Next ➡
                </button>
              </div>
            )}
          </div>
        )}

        {/* ================= QUESTIONS ================= */}
        <div className="space-y-6">
          {concept.items.map((item: any) => (
            <QuestionRenderer
              key={item.id}
              item={item}
              value={answers[item.id]}
              onChange={(v: any) => setAnswer(item.id, v)}
            />
          ))}
        </div>

        {/* ================= SUBMIT ================= */}
        <button
          onClick={submitConcept}
          disabled={isSubmitting}
          className={`w-full py-3 rounded-xl text-white font-semibold shadow-lg transition
            ${
              isSubmitting
                ? "bg-amber-400 cursor-not-allowed"
                : "bg-amber-600 hover:bg-amber-700"
            }
          `}
        >
          {isSubmitting ? "Submitting…" : "Submit This Sutra"}
        </button>
      </div>

      {/* ================= SUCCESS MODAL ================= */}
      {showSuccess && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 px-4">
          <div className="bg-white max-w-md w-full p-6 rounded-2xl shadow-xl border border-amber-200 text-center">
            <h3 className="text-xl font-bold text-amber-800">
              🙏 Reflection Submitted
            </h3>

            <p className="text-sm text-slate-700 mt-3">
              Thank you for contemplating this truth of the Gita.
            </p>

            <div className="mt-6 flex flex-col gap-3">
              <button
                onClick={goNextConcept}
                className="px-5 py-2 bg-amber-600 text-white rounded-lg"
              >
                {conceptIndex < quiz.sections.length - 1
                  ? "Continue Journey"
                  : "Finish Journey"}
              </button>

              <button
                onClick={() => router.push("/quiz/gift")}
                className="px-5 py-2 border rounded-lg"
              >
                View Progress & Claim Gift
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
