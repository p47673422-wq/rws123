import React from 'react';
import { motion } from 'framer-motion';
import { CheckCircle, AlertTriangle, Info } from 'lucide-react';

type ToastProps = {
  type?: 'success' | 'error' | 'info';
  message: string;
};

export default function Toast({ type = 'info', message }: ToastProps) {
  const Icon = type === 'success' ? CheckCircle : type === 'error' ? AlertTriangle : Info;
  const color = type === 'success' ? 'bg-green-50 text-green-800' : type === 'error' ? 'bg-red-50 text-red-800' : 'bg-blue-50 text-blue-800';

  return (
    <motion.div initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} className={`inline-flex items-start gap-3 p-3 rounded shadow ${color}`} role="status" aria-live="polite">
      <Icon size={20} />
      <div className="text-sm">{message}</div>
    </motion.div>
  );
}
