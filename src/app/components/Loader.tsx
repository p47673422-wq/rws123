import React from "react";
import { motion } from "framer-motion";

export default function Loader({ size = 64, variant = "chakra" }: { size?: number; variant?: string }) {
  return (
    <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', minHeight: size + 32 }}>
      {variant === "chakra" && (
        <motion.div
          animate={{ rotate: 360 }}
          transition={{ repeat: Infinity, duration: 1.2, ease: "linear" }}
          style={{ width: size, height: size, borderRadius: '50%', background: 'conic-gradient(#FF9933, #FEF3C7, #38a169, #FF9933)', marginBottom: 16 }}
        />
      )}
      {variant === "lotus" && (
        <motion.img
          src="/icons/lotus.png"
          alt="Lotus"
          initial={{ scale: 0.9, opacity: 0.7 }}
          animate={{ scale: [0.9, 1.1, 0.9], opacity: [0.7, 1, 0.7] }}
          transition={{ repeat: Infinity, duration: 1.2 }}
          style={{ width: size, height: size, marginBottom: 16 }}
        />
      )}
      <motion.div
        initial={{ opacity: 0.5 }}
        animate={{ opacity: [0.5, 1, 0.5] }}
        transition={{ repeat: Infinity, duration: 1.2 }}
        style={{ fontSize: 18, color: '#FF9933', fontWeight: 600 }}
      >
        Loading...
      </motion.div>
    </div>
  );
}
