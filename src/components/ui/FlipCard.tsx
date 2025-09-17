import { motion } from "framer-motion";
import React, { useState } from "react";

export default function FlipCard({ frontImg, label }: { frontImg: string; label: string }) {
  const [flipped, setFlipped] = useState(false);
  return (
    <motion.div
      className="w-40 h-56 bg-white rounded-xl shadow-lg cursor-pointer relative"
      onClick={() => setFlipped(f => !f)}
      whileHover={{ scale: 1.05 }}
      style={{ perspective: 1000 }}
    >
      <motion.div
        animate={{ rotateY: flipped ? 180 : 0 }}
        transition={{ duration: 0.6 }}
        className="absolute inset-0 w-full h-full"
        style={{ backfaceVisibility: "hidden" }}
      >
        <img src={frontImg} alt={label} className="w-full h-full object-cover rounded-xl" />
      </motion.div>
      <motion.div
        animate={{ rotateY: flipped ? 0 : -180 }}
        transition={{ duration: 0.6 }}
        className="absolute inset-0 w-full h-full flex items-center justify-center bg-yellow-100 rounded-xl"
        style={{ backfaceVisibility: "hidden" }}
      >
        <span className="text-xl font-bold text-yellow-700">{label}</span>
      </motion.div>
    </motion.div>
  );
}
