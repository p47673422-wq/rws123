"use client";

import "../../../../globals.css";
import "../../home-custom.css";
import React, { useState } from "react";

const sevaOptions = [
  {
    id: 1,
    title: "10 Plate Food Donation",
    description: "Sponsor 10 plates of nutritious food for the needy.",
    price: 500,
    image: "https://images.unsplash.com/photo-1504674900247-0877df9cc836?auto=format&fit=crop&w=400&q=80" // food donation
  },
  {
    id: 2,
    title: "Cow Seva (Feed a Cow)",
    description: "Provide a day's feed for a cow at the ashram.",
    price: 300,
    image: "https://images.unsplash.com/photo-1508672019048-805c876b67e2?auto=format&fit=crop&w=400&q=80" // cow
  },
  {
    id: 3,
    title: "Volunteer Help in Cow Seva",
    description: "Offer your time and effort to help with cow seva. (Free)",
    price: 0,
    image: "https://images.unsplash.com/photo-1465101046530-73398c7f28ca?auto=format&fit=crop&w=400&q=80" // people helping cows
  },
  {
    id: 4,
    title: "Temple Cleaning Seva",
    description: "Participate in cleaning and maintaining the temple. (Free)",
    price: 0,
    image: "https://images.unsplash.com/photo-1509228468518-180dd4864904?auto=format&fit=crop&w=400&q=80" // cleaning temple
  }
];

export default function SevaPage() {
  const [selected, setSelected] = useState<number[]>([]);
  const [showSummary, setShowSummary] = useState(false);

  function toggleSeva(id: number) {
    setSelected(sel => sel.includes(id) ? sel.filter(sid => sid !== id) : [...sel, id]);
  }

  function handleProceed() {
    setShowSummary(true);
  }

  const selectedSevas = sevaOptions.filter(opt => selected.includes(opt.id));
  const total = selectedSevas.reduce((sum, s) => sum + s.price, 0);

  return (
    <div className="min-h-screen bg-gradient-to-br from-yellow-50 to-yellow-200 flex flex-col items-center py-10">
      <h2 className="fancyTitle text-yellow-700 mb-8">Choose Your Seva</h2>
      {!showSummary ? (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 w-full max-w-3xl">
          {sevaOptions.map(opt => (
            <div key={opt.id} className={`rounded-2xl shadow-lg bg-white/80 p-5 flex flex-col items-center border-2 transition-all duration-200 ${selected.includes(opt.id) ? 'border-yellow-500 scale-105' : 'border-transparent'}`}
                 onClick={() => toggleSeva(opt.id)}
                 style={{ cursor: 'pointer' }}>
              <img src={opt.image} alt={opt.title} className="w-40 h-32 object-cover rounded-xl mb-4 shadow" />
              <div className="font-bold text-lg text-yellow-800 mb-1">{opt.title}</div>
              <div className="text-gray-700 mb-2 text-center">{opt.description}</div>
              <div className={`font-bold ${opt.price === 0 ? 'text-green-600' : 'text-yellow-700'}`}>{opt.price === 0 ? 'Free' : `₹${opt.price}`}</div>
              <div className={`mt-3 px-4 py-1 rounded-full text-sm font-semibold ${selected.includes(opt.id) ? 'bg-yellow-500 text-white' : 'bg-yellow-100 text-yellow-700'}`}>{selected.includes(opt.id) ? 'Selected' : 'Select'}</div>
            </div>
          ))}
        </div>
      ) : (
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
                  <span className={`font-bold ${s.price === 0 ? 'text-green-600' : 'text-yellow-700'}`}>{s.price === 0 ? 'Free' : `₹${s.price}`}</span>
                </li>
              ))}
            </ul>
          )}
          <div className="flex justify-end font-bold text-yellow-800 text-lg w-full mb-4">Total: ₹{total}</div>
          <button className="fancy-btn bg-yellow-500 text-white px-6 py-2 rounded-full font-bold shadow hover:bg-yellow-600 transition" onClick={() => setShowSummary(false)}>Back</button>
          {total > 0 && <button className="fancy-btn bg-green-500 text-white px-6 py-2 rounded-full font-bold shadow hover:bg-green-600 transition mt-3">Proceed to Payment</button>}
        </div>
      )}
      {!showSummary && (
        <button className="fancy-btn bg-yellow-500 text-white px-8 py-3 rounded-full font-bold shadow hover:bg-yellow-600 transition mt-10" onClick={handleProceed} disabled={selected.length === 0}>Continue</button>
      )}
    </div>
  );
}
