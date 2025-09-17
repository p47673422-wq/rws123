import { motion } from "framer-motion";
export default function GiftCard({ unlocked, name }: { unlocked: boolean; name: string }) {
  return (
    <motion.div
      className={`w-64 h-40 rounded-xl flex items-center justify-center font-bold text-xl shadow-lg border-4 ${unlocked ? "border-yellow-400 bg-white" : "border-gray-300 bg-gray-100 animate-pulse"}`}
      animate={unlocked ? { boxShadow: "0 0 32px #fbbf24" } : { opacity: [0.7, 1, 0.7] }}
      transition={{ duration: 2, repeat: Infinity }}
    >
      {unlocked ? `🎉 ${name} Unlocked!` : `🔒 ${name} (Locked)`}
    </motion.div>
  );
}
