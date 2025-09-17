import { motion, HTMLMotionProps } from "framer-motion";
import { ReactNode } from "react";

type GlowingButtonProps = {
  children: ReactNode;
} & HTMLMotionProps<"button">;

export default function GlowingButton({ children, ...props }: GlowingButtonProps) {
  return (
    <motion.button
      whileHover={{ scale: 1.05, boxShadow: "0 0 16px #fbbf24" }}
      className="w-full py-2 rounded bg-gradient-to-r from-yellow-400 via-pink-200 to-white text-yellow-900 font-bold shadow"
      {...props}
    >
      {children}
    </motion.button>
  );
}
