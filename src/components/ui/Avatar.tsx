import React from 'react';

type Props = {
  src?: string | null;
  name?: string;
  size?: number;
  className?: string;
};

export default function Avatar({ src, name, size = 40, className = '' }: Props) {
  const initials = name ? name.split(' ').map(s => s[0]).slice(0,2).join('').toUpperCase() : '';
  return (
    <div style={{ width: size, height: size }} className={`rounded-full overflow-hidden bg-gray-100 flex items-center justify-center ${className}`} aria-label={name || 'avatar'}>
      {src ? <img src={src} alt={name || 'avatar'} className="w-full h-full object-cover" /> : <span className="text-sm font-medium text-gray-700">{initials || 'U'}</span>}
    </div>
  );
}
