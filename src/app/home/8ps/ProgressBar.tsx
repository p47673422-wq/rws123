import React from "react";

interface ProgressBarProps {
  percent: number;
  label?: string;
  completed?: boolean;
}

export default function ProgressBar({ percent, label, completed }: ProgressBarProps) {
  return (
    <div className="w-full my-4">
      {label && <div className="mb-1 text-sm font-semibold text-gray-700">{label}</div>}
      <div className="w-full bg-gray-200 rounded-full h-4 relative">
        <div
          className={`h-4 rounded-full transition-all duration-500 ${completed ? 'bg-green-500' : 'bg-yellow-400'}`}
          style={{ width: `${percent}%` }}
        ></div>
        <span className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 text-xs font-bold text-gray-800">
          {percent}%
        </span>
      </div>
    </div>
  );
}
