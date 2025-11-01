"use client";
import React from "react";

interface SevaOption {
  id: number;
  title: string;
  description: string;
  price: number;
  image: string;
}

interface SevaCardProps {
  seva: SevaOption;
  isSelected: boolean;
  onSelect: () => void;
}

export function SevaCard({ seva, isSelected, onSelect }: SevaCardProps) {
  return (
    <div 
      className={`rounded-2xl shadow-lg bg-white/80 p-5 flex flex-col items-center border-2 transition-all duration-200 ${
        isSelected ? 'border-yellow-500 scale-105' : 'border-transparent'
      }`}
      onClick={onSelect}
      style={{ cursor: 'pointer' }}
    >
      <img src={seva.image} alt={seva.title} className="w-40 h-32 object-cover rounded-xl mb-4 shadow" />
      <div className="font-bold text-lg text-yellow-800 mb-1">{seva.title}</div>
      <div className="text-gray-700 mb-2 text-center">{seva.description}</div>
      <div className={`font-bold ${seva.price === 0 ? 'text-green-600' : 'text-yellow-700'}`}>
        {seva.price === 0 ? 'Free' : `₹${seva.price}`}
      </div>
      <div 
        className={`mt-3 px-4 py-1 rounded-full text-sm font-semibold ${
          isSelected ? 'bg-yellow-500 text-white' : 'bg-yellow-100 text-yellow-700'
        }`}
      >
        {isSelected ? 'Selected' : 'Select'}
      </div>
    </div>
  );
}