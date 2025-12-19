"use client";
import React, { useState, useEffect } from "react";

export default function QuestionRenderer({ item, value, onChange }: any) {
  const [showShloka, setShowShloka] = useState(false);

  /* ------------------------------------------------------------------ */
  /* VISUAL MATCH STATE (ONLY USED WHEN ui === "visual-dnd") */
  /* ------------------------------------------------------------------ */
  const [selectedLeft, setSelectedLeft] = useState<number | null>(null);
  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    if (typeof window !== "undefined") {
      setIsMobile(window.innerWidth < 768);
    }
  }, []);

  /* ------------------------------------------------------------------ */
  /* PARAGRAPH */
  /* ------------------------------------------------------------------ */
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
        {/* ================= QUESTION HEADER ================= */}
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

        {/* ================= IMAGE ================= */}
        {item.image && (
          <img
            src={item.image}
            className="w-full rounded-lg border"
            alt="Question related"
          />
        )}

        {/* ================= SINGLE CHOICE ================= */}
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

        {/* ================= MULTI CHOICE ================= */}
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

        {/* ================= TRUE / FALSE ================= */}
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

        {/* ================= ONE WORD ================= */}
        {item.type === "one-word" && (
          <input
            value={value || ""}
            onChange={(e) => onChange(e.target.value)}
            placeholder="Type answer"
            className="border p-2 rounded w-full"
          />
        )}

        {/* ================= FILL BLANK ================= */}
        {item.type === "fill-blank" && (
          <input
            value={value || ""}
            onChange={(e) => onChange(e.target.value)}
            placeholder="Fill the blank"
            className="border p-2 rounded w-full"
          />
        )}

        {/* ================= MATCH (NORMAL DROPDOWN) ================= */}
        {item.type === "match" && item.ui !== "visual-dnd" && (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
            <div>
              {item.columnA.map((a: any, i: number) => (
                <div key={i} className="flex items-center gap-2 py-1">
                  <span className="w-8">{`A${i + 1}`}</span>
                  <span className="flex-1">{a.label ?? a}</span>
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
                    {item.columnB.map((_: any, j: number) => (
                      <option key={j} value={j}>
                        {`B${j + 1}`}
                      </option>
                    ))}
                  </select>
                </div>
              ))}
            </div>

            <div>
              {item.columnB.map((b: any, i: number) => (
                <p key={i}>{`B${i + 1}. ${b.label ?? b}`}</p>
              ))}
            </div>
          </div>
        )}

        {/* ================= MATCH (VISUAL DND – GRADED) ================= */}
        {/* ================= MATCH (VISUAL – DESKTOP + MOBILE OPTIMIZED) ================= */}
{item.type === "match" && item.ui === "visual-dnd" && (() => {
  const map = value || {};

  function assign(leftIdx: number, rightIdx: number) {
    const next = { ...map };

    Object.keys(next).forEach((k) => {
      if (next[k] === rightIdx) delete next[k];
    });

    next[leftIdx] = rightIdx;
    onChange(next);
    setSelectedLeft(null);
  }

  function unassign(leftIdx: number) {
    const next = { ...map };
    delete next[leftIdx];
    onChange(next);
  }

  const isAssigned = (rightIdx: number) =>
    Object.values(map).includes(rightIdx);

  /* ---------------- MOBILE LAYOUT ---------------- */
  if (isMobile) {
    return (
      <div className="space-y-4">
        <div className="text-xs bg-amber-50 border border-amber-200 p-3 rounded-lg">
          Tap a card → choose the correct match → you may reassign anytime
        </div>

        {item.columnA.map((a: any, i: number) => {
          const matchedIdx = map[i];
          const matched = matchedIdx !== undefined
            ? item.columnB[matchedIdx]
            : null;

          return (
            <div
              key={i}
              className="border rounded-xl p-3 bg-white space-y-3"
            >
              {/* LEFT CARD */}
              <div
                onClick={() =>
                  setSelectedLeft(selectedLeft === i ? null : i)
                }
                className={`flex items-center gap-3 cursor-pointer
                  ${
                    selectedLeft === i
                      ? "bg-amber-50 border-amber-400"
                      : ""
                  }`}
              >
                <img
                  src={a.image}
                  className="w-12 h-12 rounded-lg border"
                />
                <p className="font-medium">{a.label}</p>
              </div>

              {/* MATCHED INFO */}
              {matched && (
                <div className="text-xs text-green-700 flex justify-between">
                  <span>✓ Matched with: <b>{matched.label}</b></span>
                  <button
                    onClick={() => unassign(i)}
                    className="text-red-600 underline"
                  >
                    Remove
                  </button>
                </div>
              )}

              {/* RIGHT OPTIONS INLINE */}
              {selectedLeft === i && (
                <div className="grid grid-cols-2 gap-2 mt-2">
                  {item.columnB.map((b: any, j: number) => (
                    <button
                      key={j}
                      disabled={isAssigned(j)}
                      onClick={() => assign(i, j)}
                      className={`flex items-center gap-2 p-2 border rounded-lg text-xs
                        ${
                          isAssigned(j)
                            ? "opacity-40"
                            : "hover:border-amber-500"
                        }`}
                    >
                      <img
                        src={b.image}
                        className="w-8 h-8 rounded border"
                      />
                      {b.label}
                    </button>
                  ))}
                </div>
              )}
            </div>
          );
        })}
      </div>
    );
  }

  /* ---------------- DESKTOP LAYOUT (WITH VISUAL FEEDBACK) ---------------- */
return (
  <div className="space-y-4">
    <div className="text-xs bg-amber-50 border border-amber-200 p-3 rounded-lg">
      Drag a LEFT item and drop it on the matching RIGHT item.
      You may remove and reassign anytime.
    </div>

    <div className="grid grid-cols-2 gap-6">
      {/* LEFT */}
      <div className="space-y-3">
        {item.columnA.map((a: any, i: number) => {
          const matchedIdx = map[i];
          const matched =
            matchedIdx !== undefined ? item.columnB[matchedIdx] : null;

          return (
            <div
              key={i}
              draggable
              onDragStart={(e) =>
                e.dataTransfer.setData("text/plain", String(i))
              }
              className="p-3 border rounded-xl bg-white cursor-pointer space-y-2"
            >
              <div className="flex items-center gap-3">
                <img
                  src={a.image}
                  className="w-12 h-12 rounded border"
                />
                <p className="font-medium">{a.label}</p>
              </div>

              {/* MATCH INFO */}
              {matched && (
                <div className="text-xs text-green-700 flex justify-between items-center">
                  <span>
                    ✓ Matched with: <b>{matched.label}</b>
                  </span>
                  <button
                    onClick={() => unassign(i)}
                    className="text-red-600 underline"
                  >
                    Remove
                  </button>
                </div>
              )}
            </div>
          );
        })}
      </div>

      {/* RIGHT */}
      <div className="space-y-3">
        {item.columnB.map((b: any, j: number) => {
          const used = Object.values(map).includes(j);

          return (
            <div
              key={j}
              onDragOver={(e) => e.preventDefault()}
              onDrop={(e) => {
                const left = e.dataTransfer.getData("text/plain");
                if (left !== "") assign(Number(left), j);
              }}
              className={`flex items-center gap-3 p-3 border rounded-xl transition
                ${
                  used
                    ? "opacity-40 bg-slate-100"
                    : "hover:border-amber-500 cursor-pointer bg-white"
                }`}
            >
              <img
                src={b.image}
                className="w-12 h-12 rounded border"
              />
              <p className="font-medium">{b.label}</p>
            </div>
          );
        })}
      </div>
    </div>
  </div>
);

})()}

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

            {item.shloka.iast && (
              <p className="mt-3 text-sm text-center italic text-slate-600">
                {item.shloka.iast}
              </p>
            )}

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
