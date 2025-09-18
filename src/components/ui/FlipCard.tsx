import { motion } from "framer-motion";
import React, { useState } from "react";

type FlipCardProps = {
  frontImg: string;
  label?: string;
  backContent?: React.ReactNode;
  showFlipButton?: boolean;
  width?: string;
  imgClassName?: string;
};

export default function FlipCard({ frontImg, label, backContent, showFlipButton = false, width = "w-40", imgClassName = "h-56 w-full object-cover rounded-xl" }: FlipCardProps) {
  const [flipped, setFlipped] = useState(false);
  return (
    <div className={`flex flex-col items-center w-full max-w-xl`}>
      <motion.div
        className={`relative bg-white rounded-xl shadow-lg w-full h-[420px]`}
        style={{ perspective: 1000 }}
      >
        <motion.div
          animate={{ rotateY: flipped ? 180 : 0 }}
          transition={{ duration: 0.6 }}
          className={`absolute inset-0 w-full h-full ${flipped ? 'z-0' : 'z-10'}`}
          style={{ backfaceVisibility: "hidden" }}
        >
          <img src={frontImg} alt={label} className="w-full h-full object-cover rounded-xl" />
        </motion.div>
        <motion.div
          animate={{ rotateY: flipped ? 0 : -180 }}
          transition={{ duration: 0.6 }}
          className={`absolute inset-0 w-full h-full flex flex-col items-center justify-center bg-yellow-100 rounded-xl ${flipped ? 'z-10' : 'z-0'}`}
          style={{ backfaceVisibility: "hidden" }}
        >
          <div className="w-full h-full flex flex-col items-center justify-center p-1 overflow-y-auto">
            {backContent ? (
              <>{backContent}</>
            ) : (
              label && <span className="text-xl font-bold text-yellow-700">{label}</span>
            )}
          </div>
        </motion.div>
      </motion.div>
      {showFlipButton && !flipped && (
        <button
          type="button"
          className="mt-2 px-3 py-1 text-xs bg-yellow-400 text-yellow-900 font-bold rounded shadow hover:bg-yellow-500 transition"
          onClick={() => setFlipped(true)}
        >
          Flip to View Story
        </button>
      )}
      {showFlipButton && flipped && (
        <button
          type="button"
          className="mt-2 px-3 py-1 text-xs bg-yellow-400 text-yellow-900 font-bold rounded shadow hover:bg-yellow-500 transition"
          onClick={() => setFlipped(false)}
        >
          Flip Back
        </button>
      )}
    </div>
  );
}
