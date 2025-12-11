"use client";
import { useState } from "react";
import QuestionRenderer from "./QuestionRenderer";

export default function QuizPlayer({ quiz, profile, onExit }: any) {
  const [sectionIndex, setSectionIndex] = useState(0);
  const [answers, setAnswers] = useState<Record<string, any>>({});
  const section = quiz.sections[sectionIndex];

  function setAnswer(id: string, v: any) {
    setAnswers((p) => ({ ...p, [id]: v }));
  }

  async function next() {
    if (sectionIndex < quiz.sections.length - 1) {
      setSectionIndex(sectionIndex + 1);
      return;
    }

    const payload = {
      userId: profile.id,
      profile,
      quizId: quiz.id,
      answers,
    };

    await fetch("/api/attempts", {
      method: "POST",
      headers: { "content-type": "application/json" },
      body: JSON.stringify(payload),
    });

    alert("Your responses are submitted. You can now claim your gift.");
    onExit();
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h2 className="text-xl font-semibold">{section.title}</h2>
        <button className="text-sm underline" onClick={onExit}>
          Exit
        </button>
      </div>

      {section.description && (
        <div
          className="text-sm text-slate-600 bg-white p-4 rounded-xl shadow"
          dangerouslySetInnerHTML={{ __html: section.description }}
        />
      )}

      {section.items.map((item: any) => (
        <QuestionRenderer
          key={item.id}
          item={item}
          value={answers[item.id]}
          onChange={(v: any) => setAnswer(item.id, v)}
        />
      ))}

      <button
        onClick={next}
        className="px-4 py-3 bg-amber-600 text-white rounded-xl"
      >
        {sectionIndex < quiz.sections.length - 1 ? "Next Section" : "Submit"}
      </button>
    </div>
  );
}
