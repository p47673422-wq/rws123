"use client";
import React, { useEffect, useState } from 'react';
import DashboardLayout from '@/components/DashboardLayout';
import { FaSearch, FaPhone, FaUser, FaEnvelope, FaWhatsapp } from 'react-icons/fa';

interface DistributorRow {
  id: string;
  name: string;
  phone: string;
  createdAt: string;
  preAmount: number;
  returnAmount: number;
  paidAmount: number;
  pendingAmount: number;
  preItems: any[];
  returnItems: any[];
  paymentItems: any[];
  paidItems?: any[];
  pendingItems?: any[];
}

export default function TeamListPage() {
  const [user, setUser] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [rows, setRows] = useState<DistributorRow[]>([]);
  const [q, setQ] = useState('');
  const [sortDesc, setSortDesc] = useState(true);
  const [hoveredRow, setHoveredRow] = useState<string | null>(null);
  const [hoveredCol, setHoveredCol] = useState<'name'|'pending'|'paid'|'returns'|null>(null);
  const [selectedReminder, setSelectedReminder] = useState<DistributorRow | null>(null);

  useEffect(() => {
    const load = async () => {
      try {
        const me = await fetch('/api/ram/auth/me');
        const meData = await me.json();
        if (!meData?.user) return;
        setUser(meData.user);

        const res = await fetch('/api/ram/team-members/store-users');
        const data = await res.json();
        if (Array.isArray(data)) setRows(data);
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };
    load();
  }, []);

  const filtered = rows.filter(r => {
    if (!q) return true;
    const s = q.toLowerCase();
    return (r.name || '').toLowerCase().includes(s) || (r.phone || '').toLowerCase().includes(s) || (r.id || '').toLowerCase().includes(s);
  }).sort((a,b) => sortDesc ? b.pendingAmount - a.pendingAmount : a.pendingAmount - b.pendingAmount);

  const prepareMessage = (r: DistributorRow) => {
    return `Dear ${r.name},\nPlease note your pending balance is ₹${r.pendingAmount.toFixed(2)}.\nPlease clear as soon as possible.\nThank you.`;
  };

  return (
    <DashboardLayout user={user}>
      <div className="p-6">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-xl font-medium">Store Team — All Distributors</h2>
          <div className="flex items-center gap-2">
            <input value={q} onChange={(e) => setQ(e.target.value)} placeholder="Search name or phone" className="px-3 py-2 border rounded" />
            <button onClick={() => setSortDesc(s => !s)} className="px-3 py-2 bg-gray-100 rounded">Sort by Pending {sortDesc ? '↓' : '↑'}</button>
          </div>
        </div>

        <div className="bg-white rounded-lg shadow overflow-x-auto">
          <table className="w-full text-sm">
            <thead className="bg-gray-50">
              <tr>
                <th className="p-3 text-left">Name</th>
                <th className="p-3 text-left">Phone</th>
                <th className="p-3 text-right">Pending</th>
                <th className="p-3 text-right">Paid</th>
                <th className="p-3 text-right">Returns</th>
                <th className="p-3 text-center">Actions</th>
              </tr>
            </thead>
            <tbody>
              {loading ? (
                <tr><td colSpan={6} className="p-6 text-center">Loading...</td></tr>
              ) : filtered.length === 0 ? (
                <tr><td colSpan={6} className="p-6 text-center">No distributors found</td></tr>
              ) : (
                filtered.map(r => (
                  <tr key={r.id} className="border-t">
                    <td className="p-3" onMouseEnter={() => { setHoveredRow(r.id); setHoveredCol('name'); }} onMouseLeave={() => { setHoveredRow(null); setHoveredCol(null); }}>
                      <div className="font-medium">{r.name}</div>
                      {hoveredRow === r.id && hoveredCol === 'name' && (
                        <div className="mt-1 text-xs text-gray-600">
                          <div><strong>Preorders:</strong></div>
                          {(r.preItems || []).slice(0,5).map(it => (<div key={it.bookId}>{it.title} ({it.language}) x{it.qty}</div>))}
                        </div>
                      )}
                    </td>
                    <td className="p-3">{r.phone}</td>
                    <td className="p-3 text-right" onMouseEnter={() => { setHoveredRow(r.id); setHoveredCol('pending'); }} onMouseLeave={() => { setHoveredRow(null); setHoveredCol(null); }}>
                      ₹{r.pendingAmount.toFixed(2)}
                      {hoveredRow === r.id && hoveredCol === 'pending' && (
                        <div className="mt-1 text-xs text-gray-600 text-right">
                          <div><strong>Pending items:</strong></div>
                          {(r.pendingItems || []).slice(0,6).map(it => (<div key={it.bookId}>{it.title} ({it.language}) x{it.qty}</div>))}
                        </div>
                      )}
                    </td>
                    <td className="p-3 text-right" onMouseEnter={() => { setHoveredRow(r.id); setHoveredCol('paid'); }} onMouseLeave={() => { setHoveredRow(null); setHoveredCol(null); }}>
                      ₹{r.paidAmount.toFixed(2)}
                      {hoveredRow === r.id && hoveredCol === 'paid' && (
                        <div className="mt-1 text-xs text-gray-600 text-right">
                          <div><strong>Paid items:</strong></div>
                          {(r.paidItems || []).slice(0,6).map(it => (<div key={it.bookId}>{it.title} ({it.language}) x{it.qty}</div>))}
                        </div>
                      )}
                    </td>
                    <td className="p-3 text-right" onMouseEnter={() => { setHoveredRow(r.id); setHoveredCol('returns'); }} onMouseLeave={() => { setHoveredRow(null); setHoveredCol(null); }}>
                      ₹{r.returnAmount.toFixed(2)}
                      {hoveredRow === r.id && hoveredCol === 'returns' && (
                        <div className="mt-1 text-xs text-gray-600 text-right">
                          <div><strong>Return items:</strong></div>
                          {(r.returnItems || []).slice(0,6).map(it => (<div key={it.bookId}>{it.title} ({it.language}) x{it.qty}</div>))}
                        </div>
                      )}
                    </td>
                    <td className="p-3 text-center">
                      <button onClick={() => setSelectedReminder(r)} className="px-3 py-1 bg-green-600 text-white rounded inline-flex items-center gap-2"><FaWhatsapp /> Remind</button>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>

        {selectedReminder && (
          <div className="fixed inset-0 z-50 bg-black bg-opacity-40 flex items-center justify-center p-4">
            <div className="bg-white rounded-lg shadow-lg w-full max-w-xl p-6">
              <h3 className="text-lg font-medium mb-2">WhatsApp Reminder (copy & paste)</h3>
              <div className="text-sm text-gray-700 mb-4 whitespace-pre-wrap border p-3 rounded">{prepareMessage(selectedReminder)}</div>
              <div className="flex gap-2 justify-end">
                <button onClick={() => { navigator.clipboard.writeText(prepareMessage(selectedReminder)); alert('Message copied'); }} className="px-4 py-2 bg-blue-600 text-white rounded">Copy</button>
                <button onClick={() => setSelectedReminder(null)} className="px-4 py-2 bg-gray-200 rounded">Close</button>
              </div>
            </div>
          </div>
        )}
      </div>
    </DashboardLayout>
  );
}
