import React from "react";
import { motion } from "framer-motion";

export default function Confetti({ count = 100 }) {
  // Simple confetti burst using emoji
  return (
    <div className="fixed inset-0 pointer-events-none z-50">
      {Array(count).fill(null).map((_, i) => (
        <motion.span
          key={i}
          initial={{ x: Math.random() * window.innerWidth, y: -50, rotate: Math.random() * 360 }}
          animate={{ y: window.innerHeight + 50, rotate: Math.random() * 360 }}
          transition={{ duration: 2 + Math.random() * 2, repeat: 0 }}
          style={{ position: "absolute", left: Math.random() * window.innerWidth, fontSize: 32 }}
        >
          🎉
        </motion.span>
      ))}
    </div>
  );
}
