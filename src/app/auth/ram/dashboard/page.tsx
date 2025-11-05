"use client";
import React, { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import DashboardLayout from '@/components/DashboardLayout';
import BookSelect from '@/components/BookSelect';

type ViewMode = 'CAPTAIN' | 'DISTRIBUTOR' | 'STORE_OWNER' | 'VEC_STORE_OWNER' | 'DEFAULT';

export default function Dashboard() {
  const [user, setUser] = useState<any>(null);
  const router = useRouter();
  const [viewMode, setViewMode] = useState<ViewMode>('DEFAULT');
  const [summary, setSummary] = useState<{ score: number; pendingPayments: number; inventoryCount: number } | null>(null);
  const [loadingSummary, setLoadingSummary] = useState(false);
  const [activeAction, setActiveAction] = useState<string | null>(null);

  useEffect(() => {
    fetch('/api/ram/auth/me').then(r => r.json()).then(d => {
      if (!d?.user) router.push('/auth/ram/login');
      else {
        setUser(d.user);
        setViewMode(d.user.userType || 'DEFAULT');
      }
    });
  }, []);

  useEffect(() => {
    // fetch summary only when we are in distributor view
    const effective = (viewMode === 'DEFAULT' && user) ? user.userType : viewMode;
    if (!user) return;
    if (effective !== 'DISTRIBUTOR') return;

    const fetchSummary = async () => {
      try {
        setLoadingSummary(true);
        const res = await fetch('/api/ram/dashboard/summary');
        const data = await res.json();
        if (!data?.error) setSummary(data);
      } catch (err) {
        console.error('Failed to load summary', err);
      } finally {
        setLoadingSummary(false);
      }
    };

    fetchSummary();
  }, [user, viewMode]);

  if (!user) return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-yellow-100 via-pink-50 to-white">
      <div className="text-xl text-pink-700 font-bold">Loading...</div>
    </div>
  );

  const effectiveView = (viewMode === 'DEFAULT') ? user.userType : viewMode;

  return (
    <DashboardLayout
      user={user}
      viewAs={viewMode === 'DEFAULT' ? undefined : (viewMode as 'CAPTAIN' | 'DISTRIBUTOR' | null)}
      onViewAsChange={(v) => setViewMode(v ?? 'DEFAULT')}
    >
      <div className="space-y-6">
        <div className="bg-white rounded-xl shadow-lg p-6">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-2xl font-bold text-pink-700 mb-1">Hare Krishna, {user.name}!</h1>
              <p className="text-gray-600">Select an option from the menu to get started.</p>
            </div>
          </div>
        </div>

        {/* Distributor view: either actual distributor user or captain viewing as distributor */}
        {(effectiveView === 'DISTRIBUTOR') && (
          <div className="grid gap-6">
            {/* Three summary cards */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="bg-white rounded-xl shadow p-4">
                <h3 className="text-sm text-gray-500">Score</h3>
                <div className="text-2xl font-bold text-pink-700">{loadingSummary ? '...' : summary?.score ?? 0}</div>
              </div>
              <div className="bg-white rounded-xl shadow p-4">
                <h3 className="text-sm text-gray-500">Pending Payments</h3>
                <div className="text-2xl font-bold text-pink-700">{loadingSummary ? '...' : summary?.pendingPayments ?? 0}</div>
              </div>
              <div className="bg-white rounded-xl shadow p-4">
                <h3 className="text-sm text-gray-500">Total Inventory</h3>
                <div className="text-2xl font-bold text-pink-700">{loadingSummary ? '...' : summary?.inventoryCount ?? 0}</div>
              </div>
            </div>

            {/* Quick action grid */}
            <div className="bg-white rounded-xl shadow p-4">
              <h3 className="text-lg font-semibold text-pink-700 mb-3">Quick Actions</h3>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                <button onClick={() => setActiveAction('create_order')} className="p-4 bg-yellow-50 rounded-lg hover:shadow">Create Order</button>
                <button onClick={() => setActiveAction('return_request')} className="p-4 bg-yellow-50 rounded-lg hover:shadow">Return Request</button>
                <button onClick={() => setActiveAction('payment_verification')} className="p-4 bg-yellow-50 rounded-lg hover:shadow">Payment Verification</button>
                <button onClick={() => setActiveAction('add_venue')} className="p-4 bg-yellow-50 rounded-lg hover:shadow">Add Venue</button>
              </div>
            </div>
          </div>
        )}

        {/* Captain view (when not viewing as distributor) */}
        {(effectiveView === 'CAPTAIN') && (
          <div className="bg-white rounded-xl shadow p-6">
            <h3 className="text-lg font-semibold text-pink-700">Captain Dashboard</h3>
            <p className="text-gray-600 mt-2">Overview, team performance, and captain-only actions will appear here.</p>
          </div>
        )}

        {/* Full-screen action modal */}
        {activeAction && (
          <div className="fixed inset-0 z-50 bg-black bg-opacity-50 flex items-start md:items-center justify-center p-4">
            <div className="bg-white w-full h-full md:h-auto md:w-3/4 lg:w-2/3 rounded-xl overflow-auto max-h-[90vh]">
              <div className="p-6">
                <h3 className="text-xl font-bold text-pink-700 mb-4">{activeAction.replace('_', ' ').toUpperCase()}</h3>

                <ActionForm
                  action={activeAction}
                  onCancel={() => { setActiveAction(null); }}
                  onSuccess={() => { setActiveAction(null); /* optionally refresh summary */ }}
                />
              </div>
            </div>
          </div>
        )}
      </div>
    </DashboardLayout>
  );
}

function ActionForm({ action, onCancel, onSuccess }: { action: string; onCancel: () => void; onSuccess: () => void }) {
  const [formState, setFormState] = useState<any>({});
  const [loading, setLoading] = useState(false);

  const handleChange = (k: string, v: any) => setFormState((s: any) => ({ ...s, [k]: v }));

  const submit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    try {
      let res;
      
      // For create_order, use the dedicated orders API endpoint
      if (action === 'create_order') {
        if (!formState.items?.length) {
          alert('Please select at least one book');
          return;
        }
        res = await fetch('/api/ram/orders/my-orders', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ items: formState.items })
        });
      } else {
        // For other actions, use the general actions API
        res = await fetch('/api/ram/actions', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ action, payload: formState })
        });
      }

      const data = await res.json();
      if (data?.error) {
        alert(data.error || 'Failed');
      } else {
        onSuccess();
      }
    } catch (err) {
      console.error(err);
      alert('Request failed');
    } finally {
      setLoading(false);
    }
  };

  return (
    <form onSubmit={submit} className="space-y-4">
      {action === 'create_order' && (
        <div className="space-y-6">
          <BookSelect
            onChange={(selection) => {
              setFormState((prev: any) => ({
                ...prev,
                items: [...(prev.items || []), selection]
              }));
            }}
          />
          
          {/* Selected Books List */}
          <div className="space-y-2">
            <h4 className="font-medium text-gray-700">Selected Books</h4>
            {(formState.items || []).map((item: any, idx: number) => (
              <div key={idx} className="flex items-center justify-between bg-white p-3 rounded-lg shadow-sm">
                <div>
                  <h5 className="font-medium">{item.title}</h5>
                  <p className="text-sm text-gray-600">
                    {item.language.toUpperCase()} - Qty: {item.quantity}
                  </p>
                </div>
                <button
                  type="button"
                  onClick={() => {
                    setFormState((prev: any) => ({
                      ...prev,
                      items: prev.items.filter((_: any, i: number) => i !== idx)
                    }));
                  }}
                  className="text-red-500 hover:text-red-700"
                >
                  Remove
                </button>
              </div>
            ))}
            {!(formState.items || []).length && (
              <p className="text-sm text-gray-500 text-center p-4 bg-gray-50 rounded-lg">
                No books selected. Use the form above to add books to your order.
              </p>
            )}
          </div>
        </div>
      )}

      {action === 'return_request' && (
        <>
          <div>
            <label className="block text-sm text-gray-700">Store Owner ID</label>
            <input required onChange={e => handleChange('storeOwnerId', e.target.value)} className="w-full rounded border p-2" />
          </div>
          <div>
            <label className="block text-sm text-gray-700">Items (JSON)</label>
            <textarea required onChange={e => {
              try { handleChange('items', JSON.parse(e.target.value || '[]')); } catch { handleChange('items', []); }
            }} className="w-full rounded border p-2" rows={4} />
          </div>
        </>
      )}

      {action === 'payment_verification' && (
        <>
          <div>
            <label className="block text-sm text-gray-700">Amount</label>
            <input required type="number" onChange={e => handleChange('amount', Number(e.target.value))} className="w-full rounded border p-2" />
          </div>
          <div>
            <label className="block text-sm text-gray-700">Items (JSON)</label>
            <textarea onChange={e => {
              try { handleChange('items', JSON.parse(e.target.value || '[]')); } catch { handleChange('items', []); }
            }} className="w-full rounded border p-2" rows={3} />
          </div>
        </>
      )}

      {action === 'add_venue' && (
        <>
          <div>
            <label className="block text-sm text-gray-700">Place</label>
            <input required onChange={e => handleChange('place', e.target.value)} className="w-full rounded border p-2" />
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-2">
            <input required type="date" onChange={e => handleChange('date', e.target.value)} className="rounded border p-2" />
            <input required type="time" onChange={e => handleChange('startTime', e.target.value)} className="rounded border p-2" />
            <input required type="number" onChange={e => handleChange('durationMins', Number(e.target.value))} className="rounded border p-2" placeholder="duration mins" />
          </div>
        </>
      )}

      <div className="flex gap-3 mt-4">
        <button disabled={loading} type="submit" className="flex-1 py-2 bg-pink-600 text-white rounded">{loading ? 'Creating...' : 'Create'}</button>
        <button type="button" onClick={onCancel} className="flex-1 py-2 bg-gray-100 rounded">Cancel</button>
      </div>
    </form>
  );
}
