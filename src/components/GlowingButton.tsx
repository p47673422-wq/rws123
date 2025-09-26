import React from "react";
import { motion } from "framer-motion";

interface GlowingButtonProps {
  children: React.ReactNode;
  className?: string;
  onClick?: () => void;
  type?: "button" | "submit" | "reset";
}

export default function GlowingButton({ children, className = "", onClick, type = "button" }: GlowingButtonProps) {
  return (
    <motion.button
      type={type}
      onClick={onClick}
      whileHover={{ scale: 1.07, boxShadow: "0 0 24px 8px #ec4899" }}
      whileTap={{ scale: 0.97 }}
      className={`relative rounded-xl px-6 py-3 font-bold text-white bg-gradient-to-r from-pink-500 via-pink-400 to-yellow-400 shadow-lg focus:outline-none transition-all ${className}`}
      style={{ boxShadow: "0 0 16px 4px #ec4899" }}
    >
      <span className="absolute inset-0 rounded-xl blur-md opacity-40 animate-pulse bg-pink-400"></span>
      <span className="relative z-10 flex items-center justify-center gap-2">{children}</span>
    </motion.button>
  );
}
