import confetti from "canvas-confetti";
import { useEffect } from "react";

export default function ConfettiSuccess({ trigger }: { trigger: boolean }) {
  useEffect(() => {
    if (trigger) {
      confetti({
        particleCount: 120,
        spread: 70,
        origin: { y: 0.6 },
        colors: ["#FF9933", "#38a169", "#FEF3C7"],
      });
    }
  }, [trigger]);
  return null;
}
