"use client";
import React, { useEffect, useState } from 'react';
import DashboardLayout from '@/components/DashboardLayout';

export default function MyOrders() {
  const [orders, setOrders] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [user, setUser] = useState<any>(null);
  const [editingOrder, setEditingOrder] = useState<string | null>(null);
  const [editedItems, setEditedItems] = useState<any[]>([]);
  const [returns, setReturns] = useState<any[]>([]);
  const [loadingReturns, setLoadingReturns] = useState(true);
  const [editingReturn, setEditingReturn] = useState<string | null>(null);
  const [editedReturnItems, setEditedReturnItems] = useState<any[]>([]);
  const [inventories, setInventories] = useState<any[]>([]);
  const [returnCart, setReturnCart] = useState<any[]>([]);
  const [creatingReturn, setCreatingReturn] = useState(false);

  const handleUpdateOrder = async (orderId: string, updatedItems: any[]) => {
    try {
      const res = await fetch(`/api/ram/orders/update-items`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ orderId, items: updatedItems })
      });
      const data = await res.json();
      if (data.error) throw new Error(data.error);
      
      // Update the order in the list
      setOrders(orders.map(o => o.id === orderId ? { ...o, items: updatedItems } : o));
      setEditingOrder(null);
    } catch (err: any) {
      alert(err.message || 'Failed to update order');
    }
  };

  useEffect(() => {
    // Fetch user data
    fetch('/api/ram/auth/me').then(r => r.json()).then(d => {
      if (d?.user) setUser(d.user);
    });

    // Fetch orders
    fetch('/api/ram/orders/my-orders')
      .then(res => res.json())
      .then(data => {
        if (!data.error) {
          setOrders(data);
        }
      })
      .finally(() => setLoading(false));
  }, []);

  // Fetch returns and inventory once we have user
  useEffect(() => {
    if (!user) return;

    setLoadingReturns(true);
    fetch('/api/ram/returns/my-returns')
      .then(r => r.json())
      .then(d => {
        if (!d?.error) setReturns(d);
      })
      .finally(() => setLoadingReturns(false));

    // fetch distributor inventory for create form
    fetch(`/api/ram/inventory?userId=${user.id}&inventoryType=DISTRIBUTOR`)
      .then(r => r.json())
      .then(d => {
        if (!d?.error) setInventories(d);
      });
  }, [user]);

 

  if (!user) return <div>Loading...</div>;

  return (
    <DashboardLayout user={user}>
      <div className="space-y-6 p-6">
        <h1 className="text-2xl font-bold text-pink-700">My Orders</h1>
        
        {loading ? (
          <div className="text-center py-8">Loading orders...</div>
        ) : (
          <div className="grid gap-4">
            {orders.map(order => (
              <div key={order.id} className="bg-white rounded-xl shadow p-4 space-y-3">
                <div className="flex items-center justify-between">
                  <h3 className="font-semibold">Order #{order.id}</h3>
                  <span className={`px-2 py-1 rounded-full text-sm ${
                    order.status === 'COLLECTED' ? 'bg-green-100 text-green-800' :
                    order.status === 'REJECTED' ? 'bg-red-100 text-red-800' :
                    order.status === 'PACKED' ? 'bg-purple-100 text-purple-800' :
                    order.status === 'ACCEPTED' ? 'bg-blue-100 text-blue-800' :
                    'bg-yellow-100 text-yellow-800'
                  }`}>
                    {order.status}
                  </span>
                </div>
                
                <div className="space-y-2">
                  {editingOrder === order.id ? (
                    <>
                      {editedItems.map((item: any, idx: number) => (
                        <div key={idx} className="flex items-center gap-4 text-sm">
                          <span className="flex-grow">{item.title} ({item.language})</span>
                          <input
                            type="number"
                            min="1"
                            value={item.quantity}
                            onChange={(e) => {
                              const newItems = [...editedItems];
                              newItems[idx] = { ...item, quantity: parseInt(e.target.value) };
                              setEditedItems(newItems);
                            }}
                            className="w-20 px-2 py-1 border rounded"
                          />
                          <button
                            onClick={() => {
                              setEditedItems(editedItems.filter((_, i) => i !== idx));
                            }}
                            className="text-red-500 hover:text-red-700"
                          >
                            Remove
                          </button>
                        </div>
                      ))}
                      <div className="flex justify-end gap-2 mt-3">
                        <button
                          onClick={() => {
                            handleUpdateOrder(order.id, editedItems);
                          }}
                          className="px-3 py-1 bg-green-500 text-white rounded-lg hover:bg-green-600"
                        >
                          Save Changes
                        </button>
                        <button
                          onClick={() => {
                            setEditingOrder(null);
                            setEditedItems([]);
                          }}
                          className="px-3 py-1 bg-gray-500 text-white rounded-lg hover:bg-gray-600"
                        >
                          Cancel
                        </button>
                      </div>
                    </>
                  ) : (
                    <>
                      {order.items.map((item: any, idx: number) => (
                        <div key={idx} className="flex justify-between text-sm">
                          <span>{item.title} ({item.language})</span>
                          <span className="text-gray-600">Qty: {item.quantity}</span>
                        </div>
                      ))}
                      {order.status === 'PENDING' && (
                        <div className="flex justify-end mt-2">
                          <button
                            onClick={() => {
                              setEditingOrder(order.id);
                              setEditedItems([...order.items]);
                            }}
                            className="px-3 py-1 bg-blue-500 text-white rounded-lg hover:bg-blue-600"
                          >
                            Edit Order
                          </button>
                        </div>
                      )}
                    </>
                  )}
                </div>

                {order.status === 'PACKED' && (
                  <div className="pt-2">
                    <p className="text-sm text-gray-600">OTP: {order.otp}</p>
                  </div>
                )}
              </div>
            ))}

            {orders.length === 0 && (
              <div className="text-center py-8 bg-gray-50 rounded-xl">
                <p className="text-gray-600">No orders found</p>
              </div>
            )}
          </div>
        )}

        {/* Return requests section */}
        <div className="pt-6">
          <h2 className="text-xl font-semibold text-pink-700">Return Requests</h2>

          {/* Create return UI */}
          <div className="bg-white rounded-xl shadow p-4 my-4">
            <div className="flex items-center justify-between">
              <h3 className="font-medium">Create Return Request</h3>
              <button
                onClick={() => setCreatingReturn(!creatingReturn)}
                className="px-3 py-1 bg-blue-500 text-white rounded-lg hover:bg-blue-600"
              >
                {creatingReturn ? 'Close' : 'New Return'}
              </button>
            </div>

            {creatingReturn && (
              <div className="mt-4 space-y-3">
                <div className="grid grid-cols-3 gap-3">
                  <select className="border p-2 rounded" id="inventory-select">
                    {inventories.map((inv: any) => (
                      <option key={inv.id} value={inv.bookId}>{inv.book.name} ({inv.book.language}) - Available: {inv.quantity}</option>
                    ))}
                  </select>
                  <input id="inventory-qty" type="number" min={1} defaultValue={1} className="border p-2 rounded" />
                  <button
                    onClick={() => {
                      const sel = (document.getElementById('inventory-select') as HTMLSelectElement);
                      const qtyInp = (document.getElementById('inventory-qty') as HTMLInputElement);
                      if (!sel || !qtyInp) return;
                      const bookId = sel.value;
                      const inv = inventories.find((i: any) => i.bookId === bookId || i.book?.id === bookId);
                      const qty = parseInt(qtyInp.value || '1');
                      if (!inv) return alert('Invalid selection');
                      if (qty < 1) return alert('Quantity must be >=1');
                      if (qty > inv.quantity) return alert('Quantity exceeds available inventory');
                      setReturnCart([...returnCart, { bookId: inv.bookId ?? inv.book.id, title: inv.book.name, language: inv.book.language, quantity: qty }]);
                    }}
                    className="px-3 py-1 bg-green-500 text-white rounded-lg"
                  >
                    Add
                  </button>
                </div>

                {returnCart.length > 0 && (
                  <div className="space-y-2">
                    {returnCart.map((it, idx) => (
                      <div key={idx} className="flex justify-between items-center">
                        <div>{it.title} ({it.language})</div>
                        <div className="flex items-center gap-2">
                          <div>Qty: {it.quantity}</div>
                          <button onClick={() => setReturnCart(returnCart.filter((_, i) => i !== idx))} className="text-red-500">Remove</button>
                        </div>
                      </div>
                    ))}
                    <div className="flex justify-end">
                      <button
                        onClick={async () => {
                          try {
                            const res = await fetch('/api/ram/returns/create', {
                              method: 'POST', headers: { 'Content-Type': 'application/json' },
                              body: JSON.stringify({ items: returnCart })
                            });
                            const d = await res.json();
                            if (d.error) throw new Error(d.error);
                            setReturns([d, ...returns]);
                            setReturnCart([]);
                            setCreatingReturn(false);
                            alert('Return request created');
                          } catch (err: any) {
                            alert(err.message || 'Failed to create return request');
                          }
                        }}
                        className="px-3 py-1 bg-indigo-600 text-white rounded-lg"
                      >
                        Submit Return Request
                      </button>
                    </div>
                  </div>
                )}
              </div>
            )}
          </div>

          {loadingReturns ? (
            <div className="text-center py-6">Loading return requests...</div>
          ) : (
            <div className="grid gap-4">
              {returns.map((ret: any) => (
                <div key={ret.id} className="bg-white rounded-xl shadow p-4 space-y-3">
                  <div className="flex items-center justify-between">
                    <h3 className="font-semibold">Return #{ret.id}</h3>
                    <span className={`px-2 py-1 rounded-full text-sm ${
                      ret.status === 'COMPLETED' ? 'bg-green-100 text-green-800' :
                      ret.status === 'REJECTED' ? 'bg-red-100 text-red-800' :
                      ret.status === 'ACCEPTED' ? 'bg-blue-100 text-blue-800' :
                      'bg-yellow-100 text-yellow-800'
                    }`}>{ret.status}</span>
                  </div>

                  <div className="space-y-2">
                    {editingReturn === ret.id ? (
                      <>
                        {editedReturnItems.map((item: any, idx: number) => (
                          <div key={idx} className="flex items-center gap-4 text-sm">
                            <span className="flex-grow">{item.title} ({item.language})</span>
                            <input type="number" min={1} value={item.quantity} onChange={(e) => {
                              const newItems = [...editedReturnItems];
                              newItems[idx] = { ...item, quantity: parseInt(e.target.value) };
                              setEditedReturnItems(newItems);
                            }} className="w-20 px-2 py-1 border rounded" />
                            <button onClick={() => setEditedReturnItems(editedReturnItems.filter((_, i) => i !== idx))} className="text-red-500">Remove</button>
                          </div>
                        ))}
                        <div className="flex justify-end gap-2 mt-3">
                          <button onClick={async () => {
                            try {
                              const res = await fetch('/api/ram/returns/update-items', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ returnId: ret.id, items: editedReturnItems }) });
                              const d = await res.json();
                              if (d.error) throw new Error(d.error);
                              setReturns(returns.map(r => r.id === ret.id ? d : r));
                              setEditingReturn(null);
                              setEditedReturnItems([]);
                            } catch (err: any) { alert(err.message || 'Failed to update return'); }
                          }} className="px-3 py-1 bg-green-500 text-white rounded-lg">Save</button>
                          <button onClick={() => { setEditingReturn(null); setEditedReturnItems([]); }} className="px-3 py-1 bg-gray-500 text-white rounded-lg">Cancel</button>
                        </div>
                      </>
                    ) : (
                      <>
                        {ret.items.map((item: any, i: number) => (
                          <div key={i} className="flex justify-between text-sm">
                            <span>{item.title || item.bookId} ({item.language || ''})</span>
                            <span className="text-gray-600">Qty: {item.quantity}</span>
                          </div>
                        ))}

                        {ret.status === 'PENDING' && (
                          <div className="flex justify-end mt-2">
                            <button onClick={() => { setEditingReturn(ret.id); setEditedReturnItems([...ret.items]); }} className="px-3 py-1 bg-blue-500 text-white rounded-lg">Edit Return</button>
                          </div>
                        )}

                        {ret.status === 'ACCEPTED' && (
                          <div className="pt-2">
                            <p className="text-sm text-gray-600">OTP: {(ret as any).otp}</p>
                          </div>
                        )}
                      </>
                    )}
                  </div>
                </div>
              ))}

              {returns.length === 0 && (
                <div className="text-center py-8 bg-gray-50 rounded-xl">
                  <p className="text-gray-600">No return requests</p>
                </div>
              )}
            </div>
          )}
        </div>
      </div>
    </DashboardLayout>
  );
}