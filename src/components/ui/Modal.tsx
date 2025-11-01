import React from 'react';
import { motion } from 'framer-motion';

type Props = {
  open: boolean;
  onClose?: () => void;
  title?: string;
  children?: React.ReactNode;
};

export default function Modal({ open, onClose, title, children }: Props) {
  if (!open) return null;
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center">
      <motion.div className="absolute inset-0 bg-black/40 backdrop-blur-sm" onClick={onClose} initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} />

      <motion.div className="relative z-10 max-w-lg w-full mx-4" initial={{ y: 20, opacity: 0 }} animate={{ y: 0, opacity: 1 }} exit={{ y: 20, opacity: 0 }}>
        <div className="glass rounded-2xl p-6">
          {title && <h3 className="text-lg font-semibold mb-3">{title}</h3>}
          <div>{children}</div>
          <div className="mt-4 flex justify-end">
            <button onClick={onClose} className="px-4 py-2 rounded bg-gray-100">Close</button>
          </div>
        </div>
      </motion.div>
    </div>
  );
}
