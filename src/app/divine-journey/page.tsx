"use client";
import { useEffect, useState } from "react";

export default function RamaRavana() {
  const TOTAL_HEADS = 10;
  const [heads, setHeads] = useState(Array.from({ length: TOTAL_HEADS }, (_, i) => i));
  const [flyingHead, setFlyingHead] = useState<number | null>(null);
  const [arrowActive, setArrowActive] = useState(false);
  const [fireballActive, setFireballActive] = useState(false);
  const [jivaSteps, setJivaSteps] = useState(0);

  // When arrow is fired, remove one head
  const shootArrow = async () => {
    if (heads.length === 0 || arrowActive) return;
    setArrowActive(true);
    setFlyingHead(heads[heads.length - 1]);

    // wait for head animation to finish
    await new Promise((res) => setTimeout(res, 1000));
    setHeads((h) => h.slice(0, -1));
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

  // Renders Ravana’s 10 heads stacked
  const renderHeads = () => {
    const baseBottom = 22;
    const baseRight = 11;
    const gap = 5.5;
    const shift = -0.5;

    

    return heads.map((id, idx) => {
      const centerX = 14.3; // neck anchor
      const centerY = 51;
      if (idx === 0) {
        // main head on neck
        return (
          <img
            key={id}
            src="/images/ravan-head.png"
            className="absolute"
            style={{
              bottom: `${centerY}%`,
              right: `${centerX}%`,
              width: "22%",
              zIndex: 30,
            }}
            alt="Ravana head"
          />
        );
      }
      const side = idx % 2 === 0 ? 1 : -1; // alternate left/right
      const row = Math.ceil(idx / 2);
      return (
        <img
          key={id}
          src="/images/ravan-head.png"
          className="absolute"
          style={{
            bottom: `${centerY + row * 1.4}%`,
            right: `${centerX + side * row * 3.4}%`,
            width: "20%",
            zIndex: 20 + row,
          }}
          alt="Ravana head"
        />
      );
    });
  };
// Renders Ravana’s 10 heads in an arc
//   const renderHeads = () => {
//     const centerX = 14; // anchor over body
//     const centerY = 55; // arc baseline
//     const radius = 30;  // arc radius

//     const angleStep = (Math.PI / 8); // spread arc
//     const startAngle = -Math.PI / 2 - (angleStep * 4); // center arc

//     return heads.map((id, idx) => {
//       const angle = startAngle + idx * angleStep;
//       const x = centerX + radius * Math.cos(angle);
//       const y = centerY + radius * Math.sin(angle);

//       return (
//         <img
//           key={id}
//           src="/images/ravan-head.png"
//           className="absolute"
//           style={{
//             bottom: `${y}%`,
//             right: `${x}%`,
//             width: "20%",
//             zIndex: 30 - idx,
//             transform: `rotate(${(angle * 180) / Math.PI / 6}deg)`,
//           }}
//           alt="Ravana head"
//         />
//       );
//     });
//   };

  // Flying head when arrow hits
  const renderFlyingHead = () =>
    flyingHead !== null && (
      <img
        src="/images/ravan-head.png"
        className="absolute flying-head"
        style={{
          right: "14%",
          bottom: "84%",
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

        @keyframes headFly {
          0% {
            transform: translate(0, 0) rotate(0);
            opacity: 1;
          }
          50% {
            transform: translate(-20vw, -10vh) rotate(-90deg);
          }
          100% {
            transform: translate(-25vw, 50vh) rotate(-180deg);
            opacity: 0;
          }
        }
        .flying-head {
          animation: headFly 1s ease forwards;
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
