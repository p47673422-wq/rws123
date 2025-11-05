"use client";
import React, { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import DashboardLayout from '@/components/DashboardLayout';
import BookSelect from '@/components/BookSelect';

type ViewMode = 'CAPTAIN' | 'DISTRIBUTOR' | 'STORE_OWNER' | 'VEC_STORE_OWNER' | 'DEFAULT';

interface Book {
  id: string;
  name: string;
  language: string;
}

interface InventoryItem {
  id: string;
  bookId: string;
  book: Book;
  quantity: number;
}

interface ReturnItem {
  bookId: string;
  title: string;
  language: string;
  quantity: number;
}

interface ReturnRequestForm {
  items: ReturnItem[];
  reason?: string;
}

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

const fetchSalesData = async (date: string) => {
  try {
    const res = await fetch(`/api/ram/sales/daily?date=${date}`);
    const data = await res.json();
    if (data.error) throw new Error(data.error);
    return data.map((sale: any) => ({
      date,
      items: [{
        bookId: sale.book.id,
        title: sale.book.name,
        language: sale.book.language,
        quantity: sale.quantity,
        price: Number(sale.book.price)
      }]
    }));
  } catch (err) {
    console.error('Error fetching sales:', err);
    return [];
  }
};

const calculateTotalAmount = (salesData: any[]) => {
  return salesData.reduce((total, sale) => {
    return total + sale.items.reduce((itemTotal: number, item: any) => {
      return itemTotal + (item.price * item.quantity);
    }, 0);
  }, 0);
};

function ActionForm({ action, onCancel, onSuccess }: { action: string; onCancel: () => void; onSuccess: () => void }) {
  const [formState, setFormState] = useState<ReturnRequestForm & Record<string, any>>({ 
    items: [],
    dates: [],
    salesData: [],
    totalAmount: 0
  });
  const [loading, setLoading] = useState(false);
  const [inventoryItems, setInventoryItems] = useState<InventoryItem[]>([]);
  
  useEffect(() => {
    // Fetch distributor inventory when return request form is shown
    if (action === 'return_request') {
      fetch('/api/ram/inventory?inventoryType=DISTRIBUTOR')
        .then(r => r.json())
        .then(d => {
          if (!d.error) setInventoryItems(d);
        });
    }
  }, [action]);

  const handleChange = (k: string, v: any) => setFormState((s: any) => ({ ...s, [k]: v }));

  const submit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    try {
      let res;
      
      // Handle different action types
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
      } else if (action === 'return_request') {
        if (!formState.items?.length) {
          alert('Please select at least one book to return');
          return;
        }
        // Validate quantities against inventory
        for (const item of formState.items) {
          const inv = inventoryItems.find(i => i.bookId === item.bookId);
          if (!inv || inv.quantity < item.quantity) {
            alert(`Insufficient inventory for ${item.title}`);
            return;
          }
        }
        res = await fetch('/api/ram/returns/create', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ items: formState.items, reason: formState.reason })
        });
      } else if (action === 'payment_verification') {
        if (!formState.dates?.length) {
          alert('Please select at least one date');
          return;
        }
        if (!formState.salesData?.length) {
          alert('No sales data found for selected dates');
          return;
        }
        if (!formState.paymentImage) {
          alert('Please upload payment screenshot');
          return;
        }

        res = await fetch('/api/ram/payments/verify', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            dates: formState.dates,
            items: formState.salesData.flatMap((sale: any) => sale.items),
            totalAmount: formState.totalAmount,
            paymentImage: formState.paymentImage,
            notes: formState.notes
          })
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
        <div className="space-y-6">
          <div>
            <h4 className="font-medium text-gray-700 mb-2">Select Books to Return</h4>
            <select 
              className="w-full p-2 border rounded" 
              id="inventory-select"
              onChange={(e) => {
                const selected = inventoryItems.find(i => i.id === e.target.value);
                if (!selected) return;
                
                const item = {
                  bookId: selected.bookId,
                  title: selected.book.name,
                  language: selected.book.language,
                  quantity: 1
                };

                setFormState(prev => ({
                  ...prev,
                  items: [...(prev.items || []), item]
                }));
              }}
            >
              <option value="">Select a book from your inventory...</option>
              {inventoryItems.map(inv => (
                <option key={inv.id} value={inv.id}>
                  {inv.book.name} ({inv.book.language}) - Available: {inv.quantity}
                </option>
              ))}
            </select>
          </div>

          {/* Selected Books List */}
          <div className="space-y-2">
            <h4 className="font-medium text-gray-700">Selected Books for Return</h4>
            {(formState.items || []).map((item: any, idx: number) => (
              <div key={idx} className="flex items-center justify-between bg-white p-3 rounded-lg shadow-sm">
                <div>
                  <h5 className="font-medium">{item.title}</h5>
                  <p className="text-sm text-gray-600">
                    {item.language} - Qty: {item.quantity}
                  </p>
                </div>
                <div className="flex items-center gap-3">
                  <input
                    type="number"
                    min="1"
                    value={item.quantity}
                    onChange={(e) => {
                      const newQty = parseInt(e.target.value);
                      if (isNaN(newQty)) return;
                      const inv = inventoryItems.find(i => i.bookId === item.bookId);
                      if (!inv || newQty > inv.quantity) {
                        alert('Quantity cannot exceed your inventory');
                        return;
                      }
                      setFormState(prev => ({
                        ...prev,
                        items: prev.items.map((it: any, i: number) => 
                          i === idx ? { ...it, quantity: newQty } : it
                        )
                      }));
                    }}
                    className="w-20 p-1 border rounded"
                  />
                  <button
                    type="button"
                    onClick={() => {
                      setFormState(prev => ({
                        ...prev,
                        items: prev.items.filter((_: any, i: number) => i !== idx)
                      }));
                    }}
                    className="text-red-500 hover:text-red-700"
                  >
                    Remove
                  </button>
                </div>
              </div>
            ))}
            {!(formState.items || []).length && (
              <p className="text-sm text-gray-500 text-center p-4 bg-gray-50 rounded-lg">
                No books selected. Select books from your inventory to return.
              </p>
            )}
          </div>

          {/* Optional reason for return */}
          <div>
            <label className="block text-sm text-gray-700">Reason for Return (Optional)</label>
            <textarea
              onChange={e => handleChange('reason', e.target.value)}
              className="w-full rounded border p-2"
              rows={2}
              placeholder="Enter reason for return request..."
            />
          </div>
        </div>
      )}

      {action === 'payment_verification' && (
        <>
          <div>
            <label className="block text-sm text-gray-700">Select Sales Dates</label>
            <div className="flex flex-wrap gap-2">
              <input 
                type="date" 
                multiple
                onChange={async (e) => {
                  const date = e.target.value;
                  const salesData = await fetchSalesData(date);
                  if (salesData.length === 0) {
                    alert('No sales found for selected date');
                    return;
                  }
                  setFormState(prev => {
                    const newSalesData = [...(prev.salesData || []), ...salesData];
                    const newDates = [...(prev.dates || []), date].sort();
                    return {
                      ...prev,
                      dates: newDates,
                      salesData: newSalesData,
                      totalAmount: calculateTotalAmount(newSalesData)
                    };
                  });
                }}
                className="w-full rounded border p-2"
              />
              {/* Selected dates */}
              <div className="w-full flex flex-wrap gap-2 mt-2">
                {(formState.dates || []).map((date: string, idx: number) => (
                  <div key={idx} className="flex items-center gap-2 bg-pink-50 px-3 py-1 rounded">
                    <span>{new Date(date).toLocaleDateString()}</span>
                    <button
                      type="button"
                      onClick={() => {
                        setFormState(prev => {
                          const newDates = prev.dates.filter((_: string, i: number) => i !== idx);
                          const dateToRemove = prev.dates[idx];
                          const newSalesData = prev.salesData.filter((sale: { date: string }) => sale.date !== dateToRemove);
                          return {
                            ...prev,
                            dates: newDates,
                            salesData: newSalesData,
                            totalAmount: calculateTotalAmount(newSalesData)
                          };
                        });
                      }}
                      className="text-red-500 hover:text-red-700"
                    >
                      ×
                    </button>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Books from selected dates */}
          {formState.dates?.length > 0 && (
            <div className="space-y-4">
              <h4 className="font-medium text-gray-700">Books from Selected Dates</h4>
              <div className="max-h-60 overflow-y-auto space-y-2">
                {formState.salesData?.map((sale: any) => (
                  sale.items.map((item: any, idx: number) => (
                    <div key={`${sale.date}-${idx}`} className="flex items-center justify-between bg-white p-3 rounded-lg shadow-sm">
                      <div>
                        <h5 className="font-medium">{item.title}</h5>
                        <p className="text-sm text-gray-600">
                          {item.language} - Price: ₹{item.price} × {item.quantity} = ₹{item.price * item.quantity}
                        </p>
                        <p className="text-xs text-gray-500">Date: {new Date(sale.date).toLocaleDateString()}</p>
                      </div>
                    </div>
                  ))
                ))}
              </div>

              <div className="bg-pink-50 p-4 rounded-lg">
                <div className="flex justify-between items-center">
                  <span className="font-medium">Total Amount:</span>
                  <span className="font-bold text-lg">₹{formState.totalAmount || 0}</span>
                </div>
              </div>
            </div>
          )}

          {/* Payment Screenshot Upload */}
          <div>
            <label className="block text-sm text-gray-700 mb-2">Payment Screenshot</label>
              <input
              type="file"
              accept="image/*"
              onChange={(e) => {
                const file = e.target.files?.[0];
                if (!file) return;

                // Convert to base64
                const reader = new FileReader();
                reader.readAsDataURL(file);
                reader.onload = () => {
                  const base64 = reader.result as string;
                  setFormState(prev => ({
                    ...prev,
                    paymentImage: base64
                  }));
                };
              }}
              className="w-full"
              required
            />
            {formState.paymentImageUrl && (
              <div className="mt-2">
                <img src={formState.paymentImageUrl} alt="Payment Screenshot" className="max-h-40 rounded" />
              </div>
            )}
          </div>

          {/* Additional Notes */}
          <div>
            <label className="block text-sm text-gray-700">Additional Notes</label>
            <textarea
              onChange={e => handleChange('notes', e.target.value)}
              className="w-full rounded border p-2"
              rows={2}
              placeholder="Any additional notes..."
            />
          </div>

          {/* Warning Message */}
          <div className="bg-yellow-50 border border-yellow-200 p-4 rounded-lg text-sm text-yellow-800">
            <p className="font-medium">Important Notes:</p>
            <ul className="list-disc list-inside mt-2 space-y-1">
              <li>This request will be sent for verification. Please be patient.</li>
              <li>Do not submit multiple requests for the same payment.</li>
              <li>Multiple submissions may result in rejection of all requests.</li>
              <li>Make sure the payment screenshot is clear and shows all details.</li>
            </ul>
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
