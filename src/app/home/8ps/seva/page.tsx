"use client";

import "../../../../globals.css";
import "../../home-custom.css";
import React, { useState } from "react";
import { SevaCard } from "@/components/SevaCard";
import { SevaSummary } from "@/components/SevaSummary";

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
        <>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 w-full max-w-3xl">
            {sevaOptions.map(opt => (
              <SevaCard
                key={opt.id}
                seva={opt}
                isSelected={selected.includes(opt.id)}
                onSelect={() => toggleSeva(opt.id)}
              />
            ))}
          </div>
          <button 
            className="fancy-btn bg-yellow-500 text-white px-8 py-3 rounded-full font-bold shadow hover:bg-yellow-600 transition mt-10" 
            onClick={handleProceed} 
            disabled={selected.length === 0}
          >
            Continue
          </button>
        </>
      ) : (
        <SevaSummary 
          selectedSevas={selectedSevas}
          onBack={() => setShowSummary(false)}
        />
      )}
    </div>
  );
}
