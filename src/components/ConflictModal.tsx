"use client";
import { DURATION_LABELS } from "@/app/(dashboard)/distributor/venues/constants";
import React from "react";
// import { DURATION_LABELS } from "./constants";



interface ConflictModalProps {
  conflict: {
    distributor: string;
    distributorPhone: string;
    startTime: string;
    duration: number;
  };
  onClose: () => void;
  onProceed: () => void;
}

export function ConflictModal({ conflict, onClose, onProceed }: ConflictModalProps) {
  return (
    <div className="bg-red-100 border-l-4 border-red-500 p-4 rounded mb-2">
      <div className="font-bold text-red-700 mb-1">Conflict Detected!</div>
      <div className="mb-1">
        Venue is already booked by <span className="font-semibold">{conflict.distributor}</span> ({conflict.distributorPhone})
      </div>
      <div>Time slot: {conflict.startTime} for {DURATION_LABELS[conflict.duration]}</div>
      <div className="flex gap-2 mt-2">
        <button className="bg-gray-200 px-3 py-1 rounded" onClick={onClose}>Change Time</button>
        <button className="bg-blue-600 text-white px-3 py-1 rounded" onClick={onProceed}>Proceed Anyway</button>
      </div>
    </div>
  );
}