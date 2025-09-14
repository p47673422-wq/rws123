"use client";
import React, { useEffect, useRef, useState } from "react";
import Image from "next/image";
import { FaChevronLeft, FaChevronRight } from "react-icons/fa";

const slides = [
  {
    img: "/bg4.png",
    msg: "You are serving Krishna with every congregation you book",
  },
  {
    img: "/bg1.png",
    msg: "Do more Harinam, inspire more souls",
  },
  {
    img: "/bg3.png",
    msg: "Every booking is an offering of seva",
  },
  {
    img: "/bg2.png",
    msg: "Together we can expand Krishna’s mercy",
  },
];

export default function Carousel() {
  const [idx, setIdx] = useState(0);
  const timeoutRef = useRef<NodeJS.Timeout | null>(null);

  useEffect(() => {
    timeoutRef.current = setTimeout(() => {
      setIdx(i => (i + 1) % slides.length);
    }, 4000);
    return () => {
      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current);
      }
    };
  }, [idx]);

  const goTo = (i: number) => {
    setIdx(i);
    if (timeoutRef.current) clearTimeout(timeoutRef.current);
  };

  // Swipe support
  const startX = useRef<number | null>(null);
  const handleTouchStart = (e: React.TouchEvent) => {
    startX.current = e.touches[0].clientX;
  };
  const handleTouchEnd = (e: React.TouchEvent) => {
    if (startX.current !== null) {
      const dx = e.changedTouches[0].clientX - startX.current;
      if (dx > 50) goTo((idx - 1 + slides.length) % slides.length);
      if (dx < -50) goTo((idx + 1) % slides.length);
      startX.current = null;
    }
  };

  return (
    <div className="relative w-full h-56 md:h-80 rounded-xl overflow-hidden shadow-lg">
      {slides.map((slide, i) => (
        <div
          key={i}
          className={`absolute inset-0 transition-opacity duration-700 ${i === idx ? "opacity-100 z-10" : "opacity-0 z-0"}`}
        >
          <Image src={slide.img} alt="slide" fill className="object-cover" />
          <div className="absolute inset-0 bg-black bg-opacity-40 flex items-center justify-center">
            <div className="text-white text-lg md:text-2xl font-bold text-center px-4 drop-shadow-lg">
              {slide.msg}
            </div>
          </div>
        </div>
      ))}
      <button
        className="absolute left-2 top-1/2 -translate-y-1/2 bg-yellow-600 text-white rounded-full p-2 shadow hover:bg-yellow-700"
        onClick={() => goTo((idx - 1 + slides.length) % slides.length)}
        aria-label="Previous"
      >
        <FaChevronLeft />
      </button>
      <button
        className="absolute right-2 top-1/2 -translate-y-1/2 bg-yellow-600 text-white rounded-full p-2 shadow hover:bg-yellow-700"
        onClick={() => goTo((idx + 1) % slides.length)}
        aria-label="Next"
      >
        <FaChevronRight />
      </button>
      <div className="absolute bottom-2 left-0 right-0 flex justify-center gap-2">
        {slides.map((_, i) => (
          <button
            key={i}
            className={`w-3 h-3 rounded-full ${i === idx ? "bg-yellow-500" : "bg-white"}`}
            onClick={() => goTo(i)}
            aria-label={`Go to slide ${i + 1}`}
          />
        ))}
      </div>
      <div
        className="absolute inset-0"
        onTouchStart={handleTouchStart}
        onTouchEnd={handleTouchEnd}
      />
    </div>
  );
}
