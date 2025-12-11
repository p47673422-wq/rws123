"use client";
import React from "react";

export default function QuestionRenderer({ item, value, onChange }: any) {
  if (item.type === "paragraph") {
    return (
      <div
        className="bg-white p-4 rounded-xl shadow"
        dangerouslySetInnerHTML={{ __html: item.html }}
      />
    );
  }

  return (
    <div className="bg-white p-4 rounded-xl shadow space-y-3">
      <p className="font-medium">{item.question}</p>

      {item.image && (
        <img src={item.image} className="w-full rounded-lg" alt="Q image" />
      )}

      {item.type === "single-choice" &&
        item.options.map((opt: string, i: number) => (
          <label
            key={i}
            className="flex items-center gap-2 border p-2 rounded cursor-pointer"
          >
            <input
              type="radio"
              checked={value === i}
              onChange={() => onChange(i)}
            />
            <span>{opt}</span>
          </label>
        ))}

      {item.type === "multi-choice" &&
        item.options.map((opt: string, i: number) => {
          const arr = Array.isArray(value) ? value : [];
          return (
            <label
              key={i}
              className="flex items-center gap-2 border p-2 rounded cursor-pointer"
            >
              <input
                type="checkbox"
                checked={arr.includes(i)}
                onChange={(e) => {
                  const newVal = [...arr];
                  if (e.target.checked) newVal.push(i);
                  else newVal.splice(newVal.indexOf(i), 1);
                  onChange(newVal);
                }}
              />
              <span>{opt}</span>
            </label>
          );
        })}

      {item.type === "true-false" &&
        item.options.map((opt: string, i: number) => (
          <label
            key={i}
            className="flex items-center gap-2 border p-2 rounded cursor-pointer"
          >
            <input
              type="radio"
              checked={value === i}
              onChange={() => onChange(i)}
            />
            <span>{opt}</span>
          </label>
        ))}

      {item.type === "one-word" && (
        <input
          value={value || ""}
          onChange={(e) => onChange(e.target.value)}
          placeholder="Type answer"
          className="border p-2 rounded w-full"
        />
      )}

      {item.type === "fill-blank" && (
        <input
          value={value || ""}
          onChange={(e) => onChange(e.target.value)}
          placeholder="Fill the blank"
          className="border p-2 rounded w-full"
        />
      )}

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
  );
}
