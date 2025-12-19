"use client";

import { useState } from "react";
import QuestionRenderer from "./QuestionRenderer";
import { useRouter } from "next/navigation";

export default function ConceptQuizPlayer({ quiz, profile, onExit }: any) {
  const [conceptIndex, setConceptIndex] = useState(0);
  const [answers, setAnswers] = useState<Record<string, any>>({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [showSuccess, setShowSuccess] = useState(false);

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
    } catch (e) {
      alert("Could not submit. Please try again.");
    } finally {
      setIsSubmitting(false);
    }
  }

  function onSuccessNext() {
    setShowSuccess(false);
    setAnswers({});

    if (conceptIndex < quiz.sections.length - 1) {
      setConceptIndex(conceptIndex + 1);
    } else {
      onExit();
    }
  }

  return (
    <>
      <div className="space-y-8">
        {/* HEADER */}
        <div className="flex justify-between items-center">
          <div>
            <p className="text-xs text-amber-700">
              Sutra {conceptIndex + 1} of {quiz.sections.length}
            </p>
            <h2 className="text-xl font-semibold text-amber-800">
              {concept.title}
            </h2>
            <p className="text-lg font-semibold text-amber-800">{concept.subtitle}</p>
          </div>

          <button className="text-sm underline" onClick={onExit}>
            Exit
          </button>
        </div>

        {/* NAVIGATION BUTTONS */}
        <div className="flex gap-3">
          {conceptIndex > 0 && (
            <button
              onClick={() => {
                setConceptIndex(conceptIndex - 1);
                setAnswers({});
              }}
              className="px-4 py-2 bg-amber-100 text-amber-800 rounded-lg hover:bg-amber-200"
            >
              ← Back Sutra
            </button>
          )}
          {conceptIndex < quiz.sections.length - 1 && (
            <button
              onClick={() => {
                setConceptIndex(conceptIndex + 1);
                setAnswers({});
              }}
              className="px-4 py-2 bg-amber-100 text-amber-800 rounded-lg hover:bg-amber-200"
            >
              Next Sutra →
            </button>
          )}
        </div>

        {/* VIDEO */}
        {concept?.video && (
          <div className="rounded-2xl overflow-hidden shadow border border-amber-100">
            <iframe
              src={concept.video.url}
              className="w-full h-64 sm:h-80"
              allowFullScreen
            />
          </div>
        )}
        {concept.image && (
  <div className="rounded-2xl overflow-hidden shadow border border-amber-100">
    <img
      src={concept.image}
      
      className="w-full h-48 sm:h-56 object-cover"
    />
  </div>
)}

        {/* QUESTIONS */}
        {concept.items.map((item: any) => (
          <QuestionRenderer
            key={item.id}
            item={item}
            value={answers[item.id]}
            onChange={(v: any) => setAnswer(item.id, v)}
          />
        ))}

        {/* SUBMIT */}
        <button
          onClick={submitConcept}
          disabled={isSubmitting}
          className={`w-full px-4 py-3 rounded-xl font-semibold text-white
            ${
              isSubmitting
                ? "bg-amber-400 cursor-not-allowed"
                : "bg-amber-600 hover:bg-amber-700"
            }`}
        >
          {isSubmitting ? "Submitting…" : "Submit This Sutra"}
        </button>
      </div>

      {/* SUCCESS MODAL */}
      {showSuccess && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 px-4">
          <div className="bg-white max-w-md w-full p-6 rounded-2xl shadow-xl border border-amber-200 text-center">
            <h3 className="text-xl font-bold text-amber-800">
              🙏 Sutra Submitted
            </h3>

            <p className="text-sm text-slate-700 mt-3">
              Thank you for reflecting on this sutra.
            </p>

            <div className="mt-6 flex flex-col gap-3">
              <button
                onClick={onSuccessNext}
                className="px-5 py-2 bg-amber-600 text-white rounded-lg"
              >
                {conceptIndex < quiz.sections.length - 1
                  ? "Continue to Next Sutra"
                  : "Finish Journey"}
              </button>

              <button
                onClick={() => router.push("/quiz/gift")}
                className="px-5 py-2 border rounded-lg"
              >
                View My Progres & claim gifts
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
