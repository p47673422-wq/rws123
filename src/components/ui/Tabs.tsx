import React, { useState } from 'react';

type Tab = { id: string; label: string; content: React.ReactNode };

type Props = { tabs: Tab[]; defaultId?: string };

export default function Tabs({ tabs, defaultId }: Props) {
  const [active, setActive] = useState<string>(defaultId || (tabs[0] && tabs[0].id));
  return (
    <div>
      <div role="tablist" className="flex gap-4 border-b pb-2">
        {tabs.map(t => (
          <button key={t.id} role="tab" aria-selected={active === t.id} onClick={() => setActive(t.id)} className={`pb-2 ${active===t.id ? 'text-krishna-blue border-b-2 border-krishna-blue' : 'text-gray-600'}`}>
            {t.label}
          </button>
        ))}
      </div>
      <div className="mt-4">
        {tabs.map(t => (
          <div key={t.id} role="tabpanel" hidden={active !== t.id}>
            {active === t.id && t.content}
          </div>
        ))}
      </div>
    </div>
  );
}
