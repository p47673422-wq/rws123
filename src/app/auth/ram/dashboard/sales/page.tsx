"use client";
import React, { useEffect, useState } from 'react';
import DashboardLayout from '@/components/DashboardLayout';
import { useRouter } from 'next/navigation';

// Prabhupada quotes for the carousel
const QUOTES = [
  "Book distribution is the most important activity in our society. Therefore I am giving so much stress and I am working so hard on this.",
  "By distributing books, you are rendering the highest service to Krishna.",
  "These books and magazines are our most important propaganda weapons to defeat the ignorance of maya's army.",
  "The more you distribute books, the more you become qualified and inspired in Krishna consciousness.",
  "Distribution of books and magazines is our most important activity. Without books, our preaching has no solid basis."
];

interface Book {
  id: string;
  name: string;
  language: string;
  price: number;
}

interface Sale {
  id: string;
  date: string;
  items: {
    bookId: string;
    title: string;
    language: string;
    quantity: number;
    price?: number;
  }[];
  totalBooks: number;
}

export default function SalesDashboard() {
  const [user, setUser] = useState<any>(null);
  const [currentQuote, setCurrentQuote] = useState(0);
  const [activeModal, setActiveModal] = useState<'customer' | 'sales' | null>(null);
  const [inventory, setInventory] = useState<any[]>([]);
  const [sales, setSales] = useState<Sale[]>([]);
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  // Form states
  const [customerForm, setCustomerForm] = useState({
    customerName: '',
    customerPhone: '',
    items: [] as any[]
  });

  const [salesForm, setTodaySalesForm] = useState({
    items: [] as any[]
  });

  useEffect(() => {
    // Fetch user data
    fetch('/api/ram/auth/me').then(r => r.json()).then(d => {
      if (!d?.user) router.push('/auth/ram/login');
      else setUser(d.user);
    });

    // Fetch inventory
    fetch('/api/ram/inventory?inventoryType=DISTRIBUTOR').then(r => r.json()).then(d => {
      if (!d.error) setInventory(d);
    });

    // Fetch recent sales
    fetch('/api/ram/sales/my-sales').then(r => r.json()).then(d => {
      if (!d.error) setSales(d);
    });
  }, []);

  // Quote carousel effect
  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentQuote((prev) => (prev + 1) % QUOTES.length);
    }, 5000);
    return () => clearInterval(timer);
  }, []);

  const handleCustomerSale = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    try {
      const res = await fetch('/api/ram/sales/record', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ ...customerForm, mode: 'customer' })
      });
      const data = await res.json();
      if (data.error) {
        alert(data.error);
      } else {
        // Customer sale recorded (stored in Sale_Z). It doesn't affect inventory
        // and is not shown in daily sales history, so just close modal and clear form.
        setActiveModal(null);
        setCustomerForm({ customerName: '', customerPhone: '', items: [] });
      }
    } catch (err) {
      alert('Failed to record sale');
    } finally {
      setLoading(false);
    }
  };

  const handleTodaySales = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    try {
      const res = await fetch('/api/ram/sales/record', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ items: salesForm.items, mode: 'daily' })
      });
      const data = await res.json();
      if (data.error) {
        alert(data.error);
      } else {
        // Refresh sales data to show the new daily summary and refresh inventory
        const [salesRes, inventoryRes] = await Promise.all([
          fetch('/api/ram/sales/my-sales'),
          fetch('/api/ram/inventory?inventoryType=DISTRIBUTOR')
        ]);
        const [salesData, inventoryData] = await Promise.all([salesRes.json(), inventoryRes.json()]);
        if (!salesData.error) setSales(salesData);
        if (!inventoryData.error) setInventory(inventoryData);
        setActiveModal(null);
        setTodaySalesForm({ items: [] });
      }
    } catch (err) {
      alert('Failed to record sales');
    } finally {
      setLoading(false);
    }
  };

  if (!user) return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-yellow-100 via-pink-50 to-white">
      <div className="text-xl text-pink-700 font-bold">Loading...</div>
    </div>
  );

  return (
    <DashboardLayout user={user}>
      <div className="space-y-6">
        {/* Quote Carousel */}
        <div className="bg-gradient-to-r from-pink-600 to-pink-700 text-white p-6 rounded-xl shadow-lg">
          <p className="text-lg font-medium italic transition-opacity duration-500">
            "{QUOTES[currentQuote]}"
          </p>
          <p className="text-sm mt-2">- Srila Prabhupada</p>
        </div>

        {/* Action Cards */}
        <div className="grid md:grid-cols-2 gap-6">
          <div 
            onClick={() => setActiveModal('customer')}
            className="bg-white p-6 rounded-xl shadow-lg hover:shadow-xl transition-shadow cursor-pointer"
          >
            <h3 className="text-xl font-bold text-pink-700 mb-2">Record Customer</h3>
            <p className="text-gray-600">Record individual customer book purchases with their details</p>
          </div>

          <div 
            onClick={() => setActiveModal('sales')}
            className="bg-white p-6 rounded-xl shadow-lg hover:shadow-xl transition-shadow cursor-pointer"
          >
            <h3 className="text-xl font-bold text-pink-700 mb-2">Record Today's Sales</h3>
            <p className="text-gray-600">Record all books distributed today in bulk</p>
          </div>
        </div>

        {/* Sales History */}
        <div className="bg-white rounded-xl shadow-lg p-6">
          <h3 className="text-xl font-bold text-pink-700 mb-4">Daily Sales History</h3>
          <div className="space-y-4">
            {sales.map((sale) => (
              <div key={sale.id} className="border-b pb-4">
                <div className="flex justify-between items-start">
                  <div>
                    <h4 className="font-medium">Daily Summary</h4>
                    <p className="text-sm text-pink-600">Total Books: {sale.totalBooks}</p>
                  </div>
                  <p className="text-sm text-gray-500">
                    {new Date(sale.date).toLocaleDateString()}
                  </p>
                </div>
                <div className="mt-2">
                  {sale.items.map((item, idx) => (
                    <div key={idx} className="text-sm text-gray-600">
                      {item.title} ({item.language}) - {item.quantity} copies
                    </div>
                  ))}
                </div>
              </div>
            ))}
            {sales.length === 0 && (
              <p className="text-center text-gray-500">No sales recorded yet</p>
            )}
          </div>
        </div>

        {/* Customer Modal */}
        {activeModal === 'customer' && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
            <div className="bg-white rounded-xl p-6 max-w-2xl w-full max-h-[90vh] overflow-y-auto">
              <h3 className="text-xl font-bold text-pink-700 mb-4">Record Customer Sale</h3>
              <form onSubmit={handleCustomerSale} className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700">Customer Name</label>
                  <input
                    required
                    type="text"
                    className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-pink-500 focus:ring-pink-500"
                    value={customerForm.customerName}
                    onChange={(e) => setCustomerForm(prev => ({ ...prev, customerName: e.target.value }))}
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700">Phone Number</label>
                  <input
                    type="tel"
                    className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-pink-500 focus:ring-pink-500"
                    value={customerForm.customerPhone}
                    onChange={(e) => setCustomerForm(prev => ({ ...prev, customerPhone: e.target.value }))}
                  />
                </div>

                {/* Book Selection */}
                <div>
                  <label className="block text-sm font-medium text-gray-700">Add Books</label>
                  <select
                    className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-pink-500 focus:ring-pink-500"
                    onChange={(e) => {
                      const book = inventory.find(b => b.id === e.target.value);
                      if (!book) return;
                      setCustomerForm(prev => ({
                        ...prev,
                        items: [...prev.items, {
                          bookId: book.bookId,
                          title: book.book.name,
                          language: book.book.language,
                          quantity: 1,
                          price: book.book.price
                        }]
                      }));
                    }}
                  >
                    <option value="">Select a book...</option>
                    {inventory.map(item => (
                      <option key={item.id} value={item.id}>
                        {item.book.name} ({item.book.language}) - Available: {item.quantity}
                      </option>
                    ))}
                  </select>
                </div>

                {/* Selected Books */}
                <div className="space-y-2">
                  {customerForm.items.map((item, idx) => (
                    <div key={idx} className="flex items-center justify-between bg-gray-50 p-2 rounded">
                      <div>
                        <p className="font-medium">{item.title}</p>
                        <p className="text-sm text-gray-600">{item.language}</p>
                      </div>
                      <div className="flex items-center gap-2">
                        <input
                          type="number"
                          min="1"
                          className="w-20 rounded-md border-gray-300 shadow-sm"
                          value={item.quantity}
                          onChange={(e) => {
                            const newQty = parseInt(e.target.value);
                            if (isNaN(newQty)) return;
                            setCustomerForm(prev => ({
                              ...prev,
                              items: prev.items.map((it, i) => 
                                i === idx ? { ...it, quantity: newQty } : it
                              )
                            }));
                          }}
                        />
                        <button
                          type="button"
                          className="text-red-600 hover:text-red-800"
                          onClick={() => {
                            setCustomerForm(prev => ({
                              ...prev,
                              items: prev.items.filter((_, i) => i !== idx)
                            }));
                          }}
                        >
                          Remove
                        </button>
                      </div>
                    </div>
                  ))}
                </div>

                <div className="flex justify-end gap-3 mt-6">
                  <button
                    type="button"
                    onClick={() => setActiveModal(null)}
                    className="px-4 py-2 border rounded-md text-gray-700 hover:bg-gray-50"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    disabled={loading || customerForm.items.length === 0}
                    className="px-4 py-2 bg-pink-600 text-white rounded-md hover:bg-pink-700 disabled:bg-pink-300"
                  >
                    {loading ? 'Recording...' : 'Record Sale'}
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}

        {/* Today's Sales Modal */}
        {activeModal === 'sales' && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
            <div className="bg-white rounded-xl p-6 max-w-2xl w-full max-h-[90vh] overflow-y-auto">
              <h3 className="text-xl font-bold text-pink-700 mb-4">Record Today's Sales</h3>
              <form onSubmit={handleTodaySales} className="space-y-4">
                <div className="bg-yellow-50 p-4 rounded-lg">
                  <p className="text-sm text-yellow-800">
                    ⚠️ This will decrease your inventory. Please ensure all quantities are correct before submitting.
                  </p>
                </div>

                {/* Book Selection */}
                <div>
                  <label className="block text-sm font-medium text-gray-700">Add Books</label>
                  <select
                    className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-pink-500 focus:ring-pink-500"
                    onChange={(e) => {
                      const book = inventory.find(b => b.id === e.target.value);
                      if (!book) return;
                      setTodaySalesForm(prev => ({
                        ...prev,
                        items: [...prev.items, {
                          bookId: book.bookId,
                          title: book.book.name,
                          language: book.book.language,
                          quantity: 1,
                          price: book.book.price
                        }]
                      }));
                    }}
                  >
                    <option value="">Select a book...</option>
                    {inventory.map(item => (
                      <option key={item.id} value={item.id}>
                        {item.book.name} ({item.book.language}) - Available: {item.quantity}
                      </option>
                    ))}
                  </select>
                </div>

                {/* Selected Books */}
                <div className="space-y-2">
                  {salesForm.items.map((item, idx) => (
                    <div key={idx} className="flex items-center justify-between bg-gray-50 p-2 rounded">
                      <div>
                        <p className="font-medium">{item.title}</p>
                        <p className="text-sm text-gray-600">{item.language}</p>
                      </div>
                      <div className="flex items-center gap-2">
                        <input
                          type="number"
                          min="1"
                          className="w-20 rounded-md border-gray-300 shadow-sm"
                          value={item.quantity}
                          onChange={(e) => {
                            const newQty = parseInt(e.target.value);
                            if (isNaN(newQty)) return;
                            setTodaySalesForm(prev => ({
                              ...prev,
                              items: prev.items.map((it, i) => 
                                i === idx ? { ...it, quantity: newQty } : it
                              )
                            }));
                          }}
                        />
                        <button
                          type="button"
                          className="text-red-600 hover:text-red-800"
                          onClick={() => {
                            setTodaySalesForm(prev => ({
                              ...prev,
                              items: prev.items.filter((_, i) => i !== idx)
                            }));
                          }}
                        >
                          Remove
                        </button>
                      </div>
                    </div>
                  ))}
                </div>

                <div className="flex justify-end gap-3 mt-6">
                  <button
                    type="button"
                    onClick={() => setActiveModal(null)}
                    className="px-4 py-2 border rounded-md text-gray-700 hover:bg-gray-50"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    disabled={loading || salesForm.items.length === 0}
                    className="px-4 py-2 bg-pink-600 text-white rounded-md hover:bg-pink-700 disabled:bg-pink-300"
                  >
                    {loading ? 'Recording...' : 'Record Sales'}
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}
      </div>
    </DashboardLayout>
  );
}