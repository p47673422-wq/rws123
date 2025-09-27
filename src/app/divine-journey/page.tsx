"use client";
import { useEffect, useState } from "react";

export default function RamaRavana() {
  const TOTAL_HEADS = 10;
  const [heads, setHeads] = useState(Array.from({ length: TOTAL_HEADS }, (_, i) => i));
  const [turnRight, setTurnRight] = useState(false); // alternate head removal side
  const [flyingHead, setFlyingHead] = useState<number | null>(null);
  const [arrowActive, setArrowActive] = useState(false);
  const [fireballActive, setFireballActive] = useState(false);
  const [jivaSteps, setJivaSteps] = useState(0);

  // When arrow is fired, remove one head
 const shootArrow = async () => {
  if (heads.length === 0 || arrowActive) return;
  setArrowActive(true);

  const mid = Math.floor(TOTAL_HEADS / 2);

  setHeads((prev) => {
    // if only center head remains → remove it
    if (prev.length === 1 && prev[0] === mid) {
      setFlyingHead(mid);
      return [];
    }

    let targetIndex;
    if (turnRight) {
      targetIndex = prev.findLast((id) => id !== mid);
    } else {
      targetIndex = prev.find((id) => id !== mid);
    }
    if (targetIndex === undefined) targetIndex = null;

    setFlyingHead(targetIndex);
    setTurnRight((t) => !t);
    return prev.filter((id) => id !== targetIndex);
  });

  // Wait until animation completes
  await new Promise((res) => setTimeout(res, 1800));
  setFlyingHead(null);
  setArrowActive(false);
  setJivaSteps((s) => s + 1);
};
  // Fireball → shakes Jiva
  const launchFireball = async () => {
    if (fireballActive) return;
    setFireballActive(true);
    await new Promise((res) => setTimeout(res, 1200));
    setFireballActive(false);
  };

  const renderHeads = () => {
    const mid = Math.floor(TOTAL_HEADS / 2);

    return heads.map((id, idx) => {
      const relativeIndex = idx - mid;

      // horizontal spread (moves left/right)
      const offsetX = relativeIndex * 3.5;

      // gentle curve → only slight vertical shift
      const offsetY = Math.abs(relativeIndex) * 0.9;

      // scale → center is biggest, sides taper
      const scale = 1 - Math.abs(relativeIndex) * 0.06;

      return (
        <img
          key={id}
          src="/images/ravan-head.png"
          className="absolute"
          style={{
            bottom: `${54 + offsetY}%`,    // anchor above Ravana’s neck
            right: `${15.1 + offsetX}%`,     // spread horizontally
            width: `${12.5 * scale}%`,       // relative size
            transform: `scale(${scale})`,
            zIndex: 100 - Math.abs(relativeIndex),
          }}
          alt="Ravana head"
        />
      );
    });
  };
  // Flying head when arrow hits
  const renderFlyingHead = () =>
  flyingHead !== null && (
    <img
      src="/images/ravan-head.png"
      className="absolute flying-head"
      style={{
        right: `${14 + flyingHead * -2}%`,
        bottom: `${28 + flyingHead * 6.2}%`,
        width: "22%",
        zIndex: 999,
      }}
      alt="Flying head"
    />
  );

  return (
    <div className="min-h-screen flex z-30 items-start justify-center bg-black pt-0 md:pt-8">
      <div
        className="relative w-full max-w-md h-screen bg-cover bg-center overflow-hidden"
        style={{ backgroundImage: "url('/images/ramb.png')", top: 0, position: 'absolute', left: '50%', transform: 'translateX(-50%)', maxHeight: '100vh' }}
      >
        {/* Ravana Heads */}
        {renderHeads()}
        {renderFlyingHead()}

        {/* Arrow animation */}
        {arrowActive && flyingHead !== null && (
          <div
            className="absolute arrow"
            style={{
              left: "20%",
              bottom: "50%",
              transform: `rotate(-10deg)`,
            }}
          ></div>
        )}

        {/* Fireball */}
        {fireballActive &&
          [0, 1, 2].map((f) => (
            <div
              key={f}
              className="absolute fireball"
              style={{
                right: "20%",
                bottom: "55%",
                animationDelay: `${f * 0.2}s`
              }}
            ></div>
          ))}

        {/* Jiva (stick figure) */}
        <div
          className={`absolute jiva ${fireballActive ? "jiva-shake" : ""}`}
          style={{
            left: `${35 - jivaSteps * 2}%`, // moves closer to Ram with each head fall
            bottom: "8%",
            transition: "left 1.2s ease",
          }}
        >
          {/* label */}
          <div className="absolute -top-6 left-1/2 -translate-x-1/2 text-xs text-white bg-black/60 px-2 py-1 rounded-full">
            You ✨
          </div>
          <svg viewBox="0 0 100 200" className="w-12 h-20">
            <circle
              cx="50"
              cy="20"
              r="16"
              className={`transition-colors duration-1000 ${
                heads.length >= 7 ? "fill-black" : heads.length <= 4 ? "fill-yellow-600" : "fill-yellow-400"
              }`}
            />
            <line
              x1="50"
              y1="32"
              x2="50"
              y2="110"
              strokeWidth="6"
              className={`transition-colors duration-1000 ${
                heads.length >= 7 ? "stroke-black" : heads.length <= 4 ? "stroke-yellow-600" : "stroke-yellow-400"
              }`}
            />
            <line
              x1="50"
              y1="50"
              x2="20"
              y2="80"
              strokeWidth="5"
              className={`${
                heads.length >= 7 ? "stroke-black" : heads.length <= 4 ? "stroke-yellow-600" : "stroke-yellow-400"
              }`}
            />
            <line
              x1="50"
              y1="50"
              x2="80"
              y2="80"
              strokeWidth="5"
              className={`${
                heads.length >= 7 ? "stroke-black" : heads.length <= 4 ? "stroke-yellow-600" : "stroke-yellow-400"
              }`}
            />
            <line
              x1="50"
              y1="110"
              x2="25"
              y2="160"
              strokeWidth="5"
              className={`${
                heads.length >= 7 ? "stroke-black" : heads.length <= 4 ? "stroke-yellow-600" : "stroke-yellow-400"
              }`}
            />
            <line
              x1="50"
              y1="110"
              x2="75"
              y2="160"
              strokeWidth="5"
              className={`${
                heads.length >= 7 ? "stroke-black" : heads.length <= 4 ? "stroke-yellow-600" : "stroke-yellow-400"
              }`}
            />
          </svg>
        </div>

        {/* Buttons */}
        <div className="absolute top-10 left-1/2 -translate-x-1/2 flex gap-3">
          <button
            onClick={launchFireball}
            className="px-3 py-2 bg-red-600 text-white rounded-lg shadow"
          >
            Fireball
          </button>
          <button
            onClick={shootArrow}
            className="px-3 py-2 bg-yellow-400 text-black rounded-lg shadow"
          >
            Shoot Arrow
          </button>
        </div>
      </div>

      {/* Custom CSS Animations */}
      <style jsx global>{`
        @keyframes arrowFly {
          0% {
            transform: translateX(0);
            opacity: 1;
          }
          100% {
            transform: translateX(80vw);
            opacity: 0;
          }
        }
        .arrow {
          width: 80px;
          height: 6px;
          background: linear-gradient(to right, #fff7d6, #facc15, #f59e0b);
          animation: arrowFly 0.8s linear forwards;
          border-radius: 4px;
          box-shadow: 0 0 15px 6px rgba(255, 215, 0, 0.8);
          
        }
        .arrow::after {
          content: "";
          position: absolute;
          right: -14px;
          top: -6px;
          border-left: 14px solid #fff7d6;
          border-top: 8px solid transparent;
          border-bottom: 8px solid transparent;
          filter: drop-shadow(0 0 6px #ffd700);
        }

        @keyframes fireballFly {
          0% {
            transform: translate(0, 0) scale(0.9);
            opacity: 1;
          }
          100% {
            transform: translate(-40vw, 145vh) scale(1.2);
            opacity: 0;
          }
        }
        .fireball {
          width: 32px;
          height: 32px;
          border-radius: 50%;
          background: radial-gradient(circle at 30% 30%, #ffdd00, #ff6600, #cc0000);
          box-shadow: 0 0 20px 6px rgba(255, 120, 0, 0.7);
          animation: fireballFly 1.2s linear forwards;
        }

        @keyframes flyAway {
  0% {
    transform: translate(0, 0) rotate(0);
    opacity: 1;
  }
  50% {
    transform: translate(-20vw, -15vh) rotate(-90deg) scale(1.1);
    opacity: 0.9;
  }
  100% {
    transform: translate(-30vw, 50vh) rotate(-180deg) scale(0.8);
    opacity: 0;
  }
}

.flying-head {
  animation: flyAway 1.8s ease forwards;
  pointer-events: none;
}

        @keyframes jivaShake {
          0% {
            transform: translateX(0);
          }
          25% {
            transform: translateX(-4px);
          }
          50% {
            transform: translateX(4px);
          }
          75% {
            transform: translateX(-2px);
          }
          100% {
            transform: translateX(0);
          }
        }
        .jiva-shake {
          animation: jivaShake 0.6s ease;
        }
        .battlefield-container {
  position: relative;
  width: 100%;
  max-width: 420px;
  padding-bottom: 177.78%; /* if ratio is 9:16 => 9/16 = 56.25% so inverse */
  overflow: hidden;
}
.battlefield-container > .background {
  position: absolute; top: 0; left: 0;
  width: 100%; height: 100%;
  object-fit: cover;
}
      `}</style>
    </div>
  );
}
