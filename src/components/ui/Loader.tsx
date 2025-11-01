import React from 'react';

export default function Loader({ size = 48 }: { size?: number }) {
  return (
    <div style={{ width: size, height: size }} className="flex items-center justify-center">
      <svg className="animate-spin" viewBox="0 0 50 50" style={{ width: size, height: size }}>
        <circle cx="25" cy="25" r="20" strokeWidth="5" stroke="#FCD34D" strokeDasharray="31.4 31.4" strokeLinecap="round" fill="none" />
      </svg>
    </div>
  );
}
