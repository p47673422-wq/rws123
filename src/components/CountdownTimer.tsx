import React, { useEffect, useState } from "react";

const TARGET_DATE = new Date("2025-10-08T00:00:00").getTime();

function getTimeLeft() {
  const now = new Date().getTime();
  const diff = TARGET_DATE - now;
  if (diff <= 0) return null;
  const days = Math.floor(diff / (1000 * 60 * 60 * 24));
  const hours = Math.floor((diff / (1000 * 60 * 60)) % 24);
  const mins = Math.floor((diff / (1000 * 60)) % 60);
  return { days, hours, mins };
}

export default function CountdownTimer() {
  const [timeLeft, setTimeLeft] = useState(getTimeLeft());

  useEffect(() => {
    const timer = setInterval(() => {
      setTimeLeft(getTimeLeft());
    }, 1000 * 30);
    return () => clearInterval(timer);
  }, []);

  if (!timeLeft) {
    return <span className="text-pink-600 font-bold text-lg animate-pulse">Registration Closed</span>;
  }
  return (
    <span className="text-pink-600 font-bold text-lg animate-pulse">
      {timeLeft.days}d {timeLeft.hours}h {timeLeft.mins}m left
    </span>
  );
}
