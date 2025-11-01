import React, { useEffect, useRef, useState } from 'react';
import { ChevronDown } from 'lucide-react';

type Option = { value: string; label: string };

type Props = {
  options: Option[];
  value?: string | null;
  onChange?: (v: string) => void;
  placeholder?: string;
  label?: string;
};

export default function Select({ options, value, onChange, placeholder = 'Select…', label }: Props) {
  const [open, setOpen] = useState(false);
  const [filter, setFilter] = useState('');
  const ref = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    function onDoc(e: MouseEvent) {
      if (!ref.current) return;
      if (!ref.current.contains(e.target as Node)) setOpen(false);
    }
    document.addEventListener('click', onDoc);
    return () => document.removeEventListener('click', onDoc);
  }, []);

  const filtered = options.filter(o => o.label.toLowerCase().includes(filter.toLowerCase()));
  const selected = options.find(o => o.value === value) || null;

  return (
    <div ref={ref} className="relative w-full">
      {label && <div className="text-sm mb-1 text-gray-700">{label}</div>}
      <button
        type="button"
        aria-haspopup="listbox"
        aria-expanded={open}
        onClick={() => setOpen(s => !s)}
        className="w-full p-3 rounded-lg border flex items-center justify-between bg-white"
      >
        <span className={`${selected ? '' : 'text-gray-400'}`}>{selected?.label || placeholder}</span>
        <ChevronDown size={16} />
      </button>

      {open && (
        <div className="absolute z-50 mt-2 w-full bg-white rounded-lg shadow-krishna-md p-2">
          <input value={filter} onChange={e=>setFilter(e.target.value)} placeholder="Search…" className="w-full p-2 rounded border mb-2" />
          <ul role="listbox" tabIndex={-1} className="max-h-48 overflow-auto">
            {filtered.map(opt => (
              <li key={opt.value} role="option" onClick={() => { onChange?.(opt.value); setOpen(false); setFilter(''); }} className="p-2 rounded hover:bg-gray-100 cursor-pointer">{opt.label}</li>
            ))}
          </ul>
        </div>
      )}
    </div>
  );
}
