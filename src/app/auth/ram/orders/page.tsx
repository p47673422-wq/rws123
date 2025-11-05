"use client";
import React, { useEffect, useState } from 'react';
import DashboardLayout from '@/components/DashboardLayout';

export default function Orders() {
  const [orders, setOrders] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [user, setUser] = useState<any>(null);
  const [editingOrder, setEditingOrder] = useState<string | null>(null);
  const [editedItems, setEditedItems] = useState<any[]>([]);

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

    // Fetch store orders
    fetch('/api/ram/orders/store-orders')
      .then(res => res.json())
      .then(data => {
        if (!data.error) {
          setOrders(data);
        }
      })
      .finally(() => setLoading(false));
  }, []);

   const handleStatusUpdate = async (orderId: string, status: string, otp?: string) => {
    try {
      const res = await fetch(`/api/ram/orders/update-status`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ orderId, status, otp })
      });
      const data = await res.json();
      if (data.error) throw new Error(data.error);
      
      // Refresh orders list
      const updatedOrders = await fetch('/api/ram/orders/store-orders').then(r => r.json());
      if (!updatedOrders.error) {
        // Update the specific order in the list
        setOrders(orders.map(o => o.id === orderId ? { ...o, status } : o));
      }
    } catch (err: any) {
      alert(err.message || 'Failed to update status');
    }
  };

  const getStatusActions = (order: any) => {
    switch (order.status) {
      case 'PENDING':
        return (
          <div className="space-x-2">
            <button 
              onClick={() => handleStatusUpdate(order.id, 'ACCEPTED')}
              className="px-3 py-1 bg-green-500 text-white rounded-lg hover:bg-green-600"
            >
              Accept
            </button>
            <button 
              onClick={() => handleStatusUpdate(order.id, 'REJECTED')}
              className="px-3 py-1 bg-red-500 text-white rounded-lg hover:bg-red-600"
            >
              Reject
            </button>
          </div>
        );
      case 'ACCEPTED':
        return (
          <button 
            onClick={() => handleStatusUpdate(order.id, 'PACKED')}
            className="px-3 py-1 bg-blue-500 text-white rounded-lg hover:bg-blue-600"
          >
            Mark as Packed
          </button>
        );
      case 'PACKED':
        return (
          <button 
            onClick={() => {
              const otp = prompt('Enter OTP to complete the order:');
              if (otp) handleStatusUpdate(order.id, 'COLLECTED', otp);
            }}
            className="px-3 py-1 bg-purple-500 text-white rounded-lg hover:bg-purple-600"
          >
            Complete Order
          </button>
        );
      default:
        return null;
    }
  };

  if (!user) return <div>Loading...</div>;

  return (
    <DashboardLayout user={user}>
      <div className="space-y-6 p-6">
        <h1 className="text-2xl font-bold text-pink-700">Store Orders</h1>
        
        {loading ? (
          <div className="text-center py-8">Loading orders...</div>
        ) : (
          <div className="grid gap-4">
            {orders?.map(order => (
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
                      {order?.items.map((item: any, idx: number) => (
                        <div key={idx} className="flex justify-between text-sm">
                          <span>{item.title} ({item.language})</span>
                          <span className="text-gray-600">Qty: {item.quantity}</span>
                        </div>
                      ))}
                      {order.status === 'ACCEPTED' && (
                        <div className="flex justify-end mt-2">
                          <button
                            onClick={() => {
                              setEditingOrder(order.id);
                              setEditedItems([...order.items]);
                            }}
                            className="px-3 py-1 bg-blue-500 text-white rounded-lg hover:bg-blue-600 mr-2"
                          >
                            Edit Order
                          </button>
                        </div>
                      )}
                    </>
                  )}
                </div>

                <div className="pt-2 flex justify-end">{getStatusActions(order)}</div>
              </div>
            ))}

            {orders?.length === 0 && (
              <div className="text-center py-8 bg-gray-50 rounded-xl">
                <p className="text-gray-600">No orders found</p>
              </div>
            )}
          </div>
        )}
      </div>
    </DashboardLayout>
  );
}