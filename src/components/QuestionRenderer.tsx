"use client";
import React, { useState } from "react";

export default function QuestionRenderer({ item, value, onChange }: any) {
  const [showShloka, setShowShloka] = useState(false);

  if (item.type === "paragraph") {
    return (
      <div
        className="bg-white p-4 rounded-xl shadow"
        dangerouslySetInnerHTML={{ __html: item.html }}
      />
    );
  }

  return (
    <>
      <div className="bg-white p-4 rounded-xl shadow space-y-3 border border-amber-100">
        {/* QUESTION HEADER */}
        <div className="flex items-start justify-between gap-3">
          <p className="font-medium text-slate-800">{item.question}</p>

          {item.shloka && (
            <button
              onClick={() => setShowShloka(true)}
              className="text-xs text-amber-700 underline whitespace-nowrap"
            >
              📜 View Śloka
            </button>
          )}
        </div>

        {/* IMAGE */}
        {item.image && (
          <img
            src={item.image}
            className="w-full rounded-lg border"
            alt="Question related"
          />
        )}

        {/* SINGLE CHOICE */}
        {item.type === "single-choice" &&
          item.options.map((opt: string, i: number) => (
            <label
              key={i}
              className="flex items-center gap-2 border p-2 rounded cursor-pointer hover:bg-amber-50"
            >
              <input
                type="radio"
                checked={value === i}
                onChange={() => onChange(i)}
              />
              <span>{opt}</span>
            </label>
          ))}

        {/* MULTI CHOICE */}
        {item.type === "multi-choice" &&
          item.options.map((opt: string, i: number) => {
            const arr = Array.isArray(value) ? value : [];
            return (
              <label
                key={i}
                className="flex items-center gap-2 border p-2 rounded cursor-pointer hover:bg-amber-50"
              >
                <input
                  type="checkbox"
                  checked={arr.includes(i)}
                  onChange={(e) => {
                    const next = [...arr];
                    if (e.target.checked) next.push(i);
                    else next.splice(next.indexOf(i), 1);
                    onChange(next);
                  }}
                />
                <span>{opt}</span>
              </label>
            );
          })}

        {/* TRUE / FALSE */}
        {item.type === "true-false" &&
          item.options.map((opt: string, i: number) => (
            <label
              key={i}
              className="flex items-center gap-2 border p-2 rounded cursor-pointer hover:bg-amber-50"
            >
              <input
                type="radio"
                checked={value === i}
                onChange={() => onChange(i)}
              />
              <span>{opt}</span>
            </label>
          ))}

        {/* ONE WORD */}
        {item.type === "one-word" && (
          <input
            value={value || ""}
            onChange={(e) => onChange(e.target.value)}
            placeholder="Type answer"
            className="border p-2 rounded w-full"
          />
        )}

        {/* FILL BLANK */}
        {item.type === "fill-blank" && (
          <input
            value={value || ""}
            onChange={(e) => onChange(e.target.value)}
            placeholder="Fill the blank"
            className="border p-2 rounded w-full"
          />
        )}

        {/* MATCH */}
        {item.type === "match" && (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
            <div>
              {item.columnA.map((a: string, i: number) => (
                <div key={i} className="flex items-center gap-2 py-1">
                  <span className="w-8">{`A${i + 1}`}</span>
                  <span className="flex-1">{a}</span>
                  <select
                    className="border p-1 rounded"
                    value={value?.[i] ?? ""}
                    onChange={(e) =>
                      onChange({
                        ...(value || {}),
                        [i]: Number(e.target.value),
                      })
                    }
                  >
                    <option value="">--</option>
                    {item.columnB.map((b: string, j: number) => (
                      <option key={j} value={j}>
                        {`B${j + 1}`}
                      </option>
                    ))}
                  </select>
                </div>
              ))}
            </div>

            <div>
              {item.columnB.map((b: string, i: number) => (
                <p key={i}>{`B${i + 1}. ${b}`}</p>
              ))}
            </div>
          </div>
        )}
      </div>

      {/* ================= SHLOKA MODAL ================= */}
      {showShloka && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 px-4"
          onClick={() => setShowShloka(false)}
        >
          <div
            className="bg-white max-w-lg w-full p-6 rounded-2xl shadow-xl border border-amber-200"
            onClick={(e) => e.stopPropagation()}
          >
            {/* HEADER */}
            <div className="flex justify-between items-start">
              <h3 className="font-bold text-amber-800">
                {item.shloka.ref}
              </h3>
              <button
                onClick={() => setShowShloka(false)}
                className="text-slate-500 hover:text-black"
              >
                ✕
              </button>
            </div>

            {/* IAST */}
            {item.shloka.iast && (
              <p className="mt-3 text-sm text-center italic text-slate-600">
                {item.shloka.iast}
              </p>
            )}

            {/* TRANSLATION */}
            {item.shloka.translation && (
              <p className="mt-4 text-sm text-slate-700 leading-relaxed text-center">
                {item.shloka.translation}
              </p>
            )}
          </div>
        </div>
      )}
    </>
  );
}
