"use client";

import { useState } from "react";
import QuestionRenderer from "./QuestionRenderer";
import { useRouter } from "next/navigation";

export default function QuizPlayer({ quiz, profile, onExit }: any) {
  const [sectionIndex, setSectionIndex] = useState(0);
  const [answers, setAnswers] = useState<Record<string, any>>({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [showSuccess, setShowSuccess] = useState(false);

  const router = useRouter();
  const section = quiz.sections[sectionIndex];

  function setAnswer(id: string, v: any) {
    setAnswers((p) => ({ ...p, [id]: v }));
  }

  async function next() {
    // Move to next section
    if (sectionIndex < quiz.sections.length - 1) {
      setSectionIndex(sectionIndex + 1);
      return;
    }

    // Final submit
    try {
      setIsSubmitting(true);

      const payload = {
        userId: profile.id,
        profile,
        quizId: quiz.id,
        answers,
      };

      const res = await fetch("/api/attempts", {
        method: "POST",
        headers: { "content-type": "application/json" },
        body: JSON.stringify(payload),
      });

      if (!res.ok) {
        throw new Error("Failed to submit");
      }

      // Show success modal
      setShowSuccess(true);
    } catch (err) {
      alert("Something went wrong. Please try again.");
    } finally {
      setIsSubmitting(false);
    }
  }

  return (
    <>
      <div className="space-y-6">
        {/* Header */}
        <div className="flex items-center justify-between">
          <h2 className="text-xl font-semibold text-amber-800">
            {section.title}
          </h2>
          <button className="text-sm underline" onClick={onExit}>
            Exit
          </button>
        </div>

        {/* Section description */}
        {section.description && (
          <div
            className="text-sm text-slate-600 bg-white p-4 rounded-xl shadow border border-amber-100"
            dangerouslySetInnerHTML={{ __html: section.description }}
          />
        )}

        {/* Questions */}
        {section.items.map((item: any) => (
          <QuestionRenderer
            key={item.id}
            item={item}
            value={answers[item.id]}
            onChange={(v: any) => setAnswer(item.id, v)}
          />
        ))}

        {/* Submit / Next Button */}
        <button
          onClick={next}
          disabled={isSubmitting}
          className={`px-4 py-3 rounded-xl font-semibold text-white transition
            ${
              isSubmitting
                ? "bg-amber-400 cursor-not-allowed"
                : "bg-amber-600 hover:bg-amber-700"
            }
          `}
        >
          {isSubmitting ? (
            <span className="flex items-center justify-center gap-2">
              <span className="h-4 w-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
              Submitting…
            </span>
          ) : sectionIndex < quiz.sections.length - 1 ? (
            "Next Section"
          ) : (
            "Submit"
          )}
        </button>
      </div>

      {/* ================= SUCCESS MODAL ================= */}
      {showSuccess && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 px-4">
          <div className="bg-white max-w-md w-full p-6 rounded-2xl shadow-xl border border-amber-200 text-center">
            <h3 className="text-xl font-bold text-amber-800">
              🙏 Quiz Submitted Successfully
            </h3>

            <p className="text-sm text-slate-700 mt-3">
              Thank you for participating in the Gita Meditation Quiz.
              Your responses have been recorded successfully.
            </p>

            <p className="text-sm text-slate-600 mt-2">
              You can now view your results and claim your Gita meditation gift.
            </p>

            <div className="mt-6 flex flex-col sm:flex-row gap-3 justify-center">
              <button
                onClick={() => router.push("/quiz/gift")}
                className="px-5 py-2 bg-green-700 hover:bg-green-800 text-white rounded-lg"
              >
                Claim Your Gift 🎁
              </button>

              <button
                onClick={() => {
                  setShowSuccess(false);
                  onExit();
                }}
                className="px-5 py-2 border rounded-lg"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
