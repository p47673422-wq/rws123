"use client";
import React from "react";

interface SevaOption {
  id: number;
  title: string;
  description: string;
  price: number;
  image: string;
}

interface SevaSummaryProps {
  selectedSevas: SevaOption[];
  onBack: () => void;
}

export function SevaSummary({ selectedSevas, onBack }: SevaSummaryProps) {
  const total = selectedSevas.reduce((sum, s) => sum + s.price, 0);

  return (
    <div className="w-full max-w-xl bg-white/90 rounded-2xl shadow-2xl p-8 flex flex-col items-center">
      <h3 className="font-bold text-lg text-yellow-700 mb-4">Seva Summary</h3>
      {selectedSevas.length === 0 ? (
        <div className="text-gray-500">No seva selected.</div>
      ) : (
        <ul className="w-full space-y-3 mb-4">
          {selectedSevas.map(s => (
            <li key={s.id} className="flex items-center gap-4 bg-yellow-100 rounded p-3">
              <img src={s.image} alt={s.title} className="w-16 h-12 object-cover rounded" />
              <span className="font-bold text-yellow-800 flex-1">{s.title}</span>
              <span className={`font-bold ${s.price === 0 ? 'text-green-600' : 'text-yellow-700'}`}>
                {s.price === 0 ? 'Free' : `₹${s.price}`}
              </span>
            </li>
          ))}
        </ul>
      )}
      <div className="flex justify-end font-bold text-yellow-800 text-lg w-full mb-4">
        Total: ₹{total}
      </div>
      <button 
        className="fancy-btn bg-yellow-500 text-white px-6 py-2 rounded-full font-bold shadow hover:bg-yellow-600 transition" 
        onClick={onBack}
      >
        Back
      </button>
      {total > 0 && (
        <button className="fancy-btn bg-green-500 text-white px-6 py-2 rounded-full font-bold shadow hover:bg-green-600 transition mt-3">
          Proceed to Payment
        </button>
      )}
    </div>
  );
}