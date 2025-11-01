import React from 'react';

type BadgeProps = {
  status: 'pending' | 'packed' | 'collected' | string;
  children?: React.ReactNode;
};

export default function Badge({ status, children }: BadgeProps) {
  const map: Record<string, string> = {
    pending: 'bg-yellow-100 text-yellow-800',
    packed: 'bg-krishna-blue text-white',
    collected: 'bg-green-100 text-green-800',
  };
  const cls = map[status] || 'bg-gray-100 text-gray-800';
  return (
    <span className={`inline-flex items-center gap-2 px-3 py-1 rounded-full text-sm font-medium ${cls}`} role="status">
      {children ?? status}
    </span>
  );
}
