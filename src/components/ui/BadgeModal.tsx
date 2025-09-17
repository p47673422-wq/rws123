import React from "react";
import { motion, AnimatePresence } from "framer-motion";
import Confetti from "react-confetti";
import GlowingButton from "./GlowingButton";

interface BadgeModalProps {
  open: boolean;
  badge: {
    name: string;
    desc: string;
    image: string;
  };
  onClose: () => void;
  shareWhatsapp: () => void;
  shareInstagram: () => void;
}

export default function BadgeModal({ open, badge, onClose, shareWhatsapp, shareInstagram }: BadgeModalProps) {
  return (
    <AnimatePresence>
      {open && (
        <motion.div
          className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-60"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
        >
          <Confetti numberOfPieces={200} recycle={false} width={window.innerWidth} height={window.innerHeight} />
          <motion.div
            className="rounded-2xl bg-gradient-to-br from-yellow-400 via-pink-200 to-white shadow-2xl p-8 flex flex-col items-center relative"
            initial={{ scale: 0.7, boxShadow: "0 0 0px #fbbf24" }}
            animate={{ scale: 1, boxShadow: "0 0 48px #fbbf24" }}
            exit={{ scale: 0.7, opacity: 0 }}
            transition={{ type: "spring", stiffness: 300, damping: 30 }}
          >
            <div className="absolute top-2 right-2">
              <button onClick={onClose} className="text-pink-600 text-2xl font-bold">×</button>
            </div>
            <div className="mb-4">
              <motion.img
                src={badge.image}
                alt={badge.name}
                className="w-32 h-32 rounded-full shadow-lg border-4 border-yellow-400 animate-pulse"
                initial={{ scale: 0.8, boxShadow: "0 0 0px #fbbf24" }}
                animate={{ scale: [1, 1.1, 1], boxShadow: "0 0 48px #fbbf24" }}
                transition={{ duration: 2, repeat: Infinity }}
              />
            </div>
            <h2 className="text-3xl font-bold text-yellow-700 mb-2">🏅 You earned the {badge.name}!</h2>
            <div className="text-lg text-pink-700 mb-4">{badge.desc}</div>
            <div className="text-lg text-pink-600 mb-4">🌸 Share your achievement with friends!</div>
            <div className="flex gap-4 mt-2">
              <GlowingButton onClick={shareWhatsapp} className="rounded-full bg-gradient-to-r from-yellow-500 via-orange-400 to-pink-400 text-white font-bold animate-pulse px-6 py-3 flex items-center gap-2">
                <span className="text-2xl">🟢</span> WhatsApp
              </GlowingButton>
              <GlowingButton onClick={shareInstagram} className="rounded-full bg-gradient-to-r from-pink-400 via-yellow-400 to-orange-400 text-white font-bold animate-pulse px-6 py-3 flex items-center gap-2">
                <span className="text-2xl">🟣</span> Instagram
              </GlowingButton>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
