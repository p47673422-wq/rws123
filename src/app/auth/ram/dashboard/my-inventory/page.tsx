"use client";

import React, { useState, useEffect } from 'react';
import DashboardLayout from '@/components/DashboardLayout';
import { FaShoppingCart, FaExchangeAlt, FaFilter, FaSort } from 'react-icons/fa';

interface Book {
  id: string;
  name: string;
  category: string;
  language: string;
  price: number;
  warehouseType: 'NORMAL' | 'VEC';
}

interface Inventory {
  id: string;
  quantity: number;
  book: Book;
}

export default function MyInventoryPage() {
  const [user, setUser] = useState<any>(null);
  const [inventory, setInventory] = useState<Inventory[]>([]);
  const [filters, setFilters] = useState({
    category: '',
    language: '',
    search: '',
    minPrice: '',
    maxPrice: ''
  });
  const [sort, setSort] = useState({ field: '', direction: 'asc' });

  useEffect(() => {
    const fetchUser = async () => {
      try {
        const res = await fetch('/api/ram/auth/me');
        if (res.ok) {
          const data = await res.json();
          setUser(data.user);
        }
      } catch (error) {
        console.error(error);
      }
    };
    fetchUser();
  }, []);

  useEffect(() => {
    if (!user) return;

    const fetchInventory = async () => {
      try {
        const queryParams = new URLSearchParams({
          userId: user.id,
          inventoryType: 'DISTRIBUTOR',
          ...filters
        });
        const res = await fetch(`/api/ram/inventory?${queryParams}`);
        if (res.ok) {
          const data = await res.json();
          setInventory(data);
        }
      } catch (error) {
        console.error(error);
      }
    };
    fetchInventory();
  }, [user, filters]);

  if (!user) return null;

  return (
    <DashboardLayout user={user}>
      <div className="p-6 space-y-6">
        {/* Action Buttons */}
        <div className="flex flex-col md:flex-row gap-4">
          <button
            onClick={() => window.location.href = '/auth/ram/dashboard/place-order'}
            className="flex-1 bg-pink-600 text-white py-3 px-6 rounded-xl hover:bg-pink-700 transition-colors flex items-center justify-center gap-2"
          >
            <FaShoppingCart />
            Place Order
          </button>
          <button
            onClick={() => window.location.href = '/auth/ram/dashboard/return-request'}
            className="flex-1 bg-yellow-500 text-white py-3 px-6 rounded-xl hover:bg-yellow-600 transition-colors flex items-center justify-center gap-2"
          >
            <FaExchangeAlt />
            Raise Return Request
          </button>
        </div>

        {/* Inventory Table */}
        {inventory.length > 0 ? (
          <div>
            {/* Filters */}
            <div className="mb-4 p-4 bg-white rounded-lg shadow space-y-2">
              <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                <input
                  type="text"
                  placeholder="Search books..."
                  className="rounded-md border p-2"
                  value={filters.search}
                  onChange={(e) => setFilters(prev => ({ ...prev, search: e.target.value }))}
                />
                <input
                  type="text"
                  placeholder="Category"
                  className="rounded-md border p-2"
                  value={filters.category}
                  onChange={(e) => setFilters(prev => ({ ...prev, category: e.target.value }))}
                />
                <select
                  className="rounded-md border p-2"
                  value={filters.language}
                  onChange={(e) => setFilters(prev => ({ ...prev, language: e.target.value }))}
                >
                  <option value="">All Languages</option>
                  {['HINDI', 'ENGLISH', 'TELUGU'].map(lang => (
                    <option key={lang} value={lang}>{lang}</option>
                  ))}
                </select>
                <div className="flex gap-2">
                  <input
                    type="number"
                    placeholder="Min Price"
                    className="rounded-md border p-2 w-1/2"
                    value={filters.minPrice}
                    onChange={(e) => setFilters(prev => ({ ...prev, minPrice: e.target.value }))}
                  />
                  <input
                    type="number"
                    placeholder="Max Price"
                    className="rounded-md border p-2 w-1/2"
                    value={filters.maxPrice}
                    onChange={(e) => setFilters(prev => ({ ...prev, maxPrice: e.target.value }))}
                  />
                </div>
              </div>
            </div>

            {/* Table */}
            <div className="overflow-x-auto">
              <table className="min-w-full bg-white rounded-lg shadow">
                <thead>
                  <tr>
                    <th className="p-4 text-left">Book Name</th>
                    <th className="p-4 text-left">Category</th>
                    <th className="p-4 text-left">Language</th>
                    <th className="p-4 text-right">Price</th>
                    <th className="p-4 text-right">Quantity</th>
                  </tr>
                </thead>
                <tbody>
                  {inventory.map((item) => (
                    <tr key={item.id} className="border-t hover:bg-gray-50">
                      <td className="p-4">{item.book.name}</td>
                      <td className="p-4">{item.book.category}</td>
                      <td className="p-4">{item.book.language}</td>
                      <td className="p-4 text-right">₹{item.book.price}</td>
                      <td className="p-4 text-right">{item.quantity}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        ) : (
          <div className="text-center py-12">
            <p className="text-xl text-gray-600">You don't have any inventory yet.</p>
            <button
              onClick={() => window.location.href = '/auth/ram/dashboard/place-order'}
              className="mt-4 bg-pink-600 text-white py-2 px-6 rounded-lg hover:bg-pink-700 transition-colors"
            >
              Place Your First Order
            </button>
          </div>
        )}
      </div>
    </DashboardLayout>
  );
}