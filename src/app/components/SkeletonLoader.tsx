import React from "react";
import { motion } from "framer-motion";

export function CardSkeleton() {
  return (
    <motion.div
      className="bg-gray-100 rounded-lg mb-4"
      style={{ height: 120, width: '100%', position: 'relative', overflow: 'hidden' }}
    >
      <motion.div
        className="absolute top-0 left-0 h-full w-full"
        animate={{ x: ["-100%", "100%"] }}
        transition={{ repeat: Infinity, duration: 1.2 }}
        style={{ background: 'linear-gradient(90deg, #fef3c7 0%, #fff 50%, #fef3c7 100%)', opacity: 0.5 }}
      />
    </motion.div>
  );
}

export function TableRowSkeleton() {
  return (
    <tr className="bg-gray-100">
      <td colSpan={6} style={{ height: 40, position: 'relative', overflow: 'hidden' }}>
        <motion.div
          animate={{ x: ["-100%", "100%"] }}
          transition={{ repeat: Infinity, duration: 1.2 }}
          style={{ background: 'linear-gradient(90deg, #fef3c7 0%, #fff 50%, #fef3c7 100%)', height: '100%', width: '100%', opacity: 0.5 }}
        />
      </td>
    </tr>
  );
}

export function AvatarSkeleton({ size = 40 }: { size?: number }) {
  return (
    <motion.div
      className="bg-gray-200 rounded-full"
      style={{ width: size, height: size, position: 'relative', overflow: 'hidden' }}
    >
      <motion.div
        className="absolute top-0 left-0 h-full w-full"
        animate={{ x: ["-100%", "100%"] }}
        transition={{ repeat: Infinity, duration: 1.2 }}
        style={{ background: 'linear-gradient(90deg, #fef3c7 0%, #fff 50%, #fef3c7 100%)', opacity: 0.5 }}
      />
    </motion.div>
  );
}
