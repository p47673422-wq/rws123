"use client";

import React, { useState, useEffect } from 'react';
import DashboardLayout from '@/components/DashboardLayout';
import { FaPlus, FaBoxOpen, FaList, FaFilter, FaSort } from 'react-icons/fa';

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

const AddBookForm = ({ onClose, warehouseType }: { onClose: () => void, warehouseType: 'NORMAL' | 'VEC' }) => {
  const [formData, setFormData] = useState({
    name: '',
    category: '',
    isPriceSameForAll: true,
    price: '',
    languages: [] as string[],
    language: 'HINDI'
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const res = await fetch('/api/ram/books', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          ...formData,
          price: parseFloat(formData.price),
          warehouseType
        })
      });
      if (res.ok) {
        onClose();
      }
    } catch (error) {
      console.error(error);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div>
        <label className="block text-sm font-medium text-gray-700">Book Name</label>
        <input
          type="text"
          required
          className="mt-1 block w-full rounded-md border border-gray-300 p-2"
          value={formData.name}
          onChange={(e) => setFormData(prev => ({ ...prev, name: e.target.value }))}
        />
      </div>
      
      <div>
        <label className="block text-sm font-medium text-gray-700">Category</label>
        <input
          type="text"
          required
          className="mt-1 block w-full rounded-md border border-gray-300 p-2"
          value={formData.category}
          onChange={(e) => setFormData(prev => ({ ...prev, category: e.target.value }))}
        />
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700">Price</label>
        <input
          type="number"
          required
          step="0.01"
          className="mt-1 block w-full rounded-md border border-gray-300 p-2"
          value={formData.price}
          onChange={(e) => setFormData(prev => ({ ...prev, price: e.target.value }))}
        />
      </div>

      <div>
        <label className="flex items-center">
          <input
            type="checkbox"
            checked={formData.isPriceSameForAll}
            onChange={(e) => setFormData(prev => ({ ...prev, isPriceSameForAll: e.target.checked }))}
            className="mr-2"
          />
          <span className="text-sm font-medium text-gray-700">Same price for all languages</span>
        </label>
      </div>

      {formData.isPriceSameForAll ? (
        <div>
          <label className="block text-sm font-medium text-gray-700">Languages</label>
          <div className="space-y-2">
            {['HINDI', 'ENGLISH', 'TELUGU'].map(lang => (
              <label key={lang} className="flex items-center">
                <input
                  type="checkbox"
                  checked={formData.languages.includes(lang)}
                  onChange={(e) => {
                    const languages = e.target.checked 
                      ? [...formData.languages, lang]
                      : formData.languages.filter(l => l !== lang);
                    setFormData(prev => ({ ...prev, languages }));
                  }}
                  className="mr-2"
                />
                <span>{lang}</span>
              </label>
            ))}
          </div>
        </div>
      ) : (
        <div>
          <label className="block text-sm font-medium text-gray-700">Language</label>
          <select
            value={formData.language}
            onChange={(e) => setFormData(prev => ({ ...prev, language: e.target.value }))}
            className="mt-1 block w-full rounded-md border border-gray-300 p-2"
          >
            {['HINDI', 'ENGLISH', 'TELUGU'].map(lang => (
              <option key={lang} value={lang}>{lang}</option>
            ))}
          </select>
        </div>
      )}

      <button
        type="submit"
        className="w-full bg-pink-600 text-white py-2 px-4 rounded-md hover:bg-pink-700"
      >
        Add Book
      </button>
    </form>
  );
};

const AddInventoryForm = ({ onClose, user }: { onClose: () => void, user: any }) => {
  const [books, setBooks] = useState<Book[]>([]);
  const [formData, setFormData] = useState({
    bookId: '',
    quantity: ''
  });

  useEffect(() => {
    const fetchBooks = async () => {
      try {
        const res = await fetch(`/api/ram/books?warehouseType=${user.storeType}`);
        if (res.ok) {
          const data = await res.json();
          setBooks(data);
        }
      } catch (error) {
        console.error(error);
      }
    };
    fetchBooks();
  }, [user.storeType]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const res = await fetch('/api/ram/inventory', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          ...formData,
          userId: user.id,
          quantity: parseInt(formData.quantity),
          inventoryType: 'WAREHOUSE',
          warehouseType: user.storeType
        })
      });
      if (res.ok) {
        onClose();
      }
    } catch (error) {
      console.error(error);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div>
        <label className="block text-sm font-medium text-gray-700">Book</label>
        <select
          required
          className="mt-1 block w-full rounded-md border border-gray-300 p-2"
          value={formData.bookId}
          onChange={(e) => setFormData(prev => ({ ...prev, bookId: e.target.value }))}
        >
          <option value="">Select a book</option>
          {books.map(book => (
            <option key={book.id} value={book.id}>
              {book.name} - {book.language} - ₹{book.price}
            </option>
          ))}
        </select>
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700">Quantity</label>
        <input
          type="number"
          required
          min="1"
          className="mt-1 block w-full rounded-md border border-gray-300 p-2"
          value={formData.quantity}
          onChange={(e) => setFormData(prev => ({ ...prev, quantity: e.target.value }))}
        />
      </div>

      <button
        type="submit"
        className="w-full bg-pink-600 text-white py-2 px-4 rounded-md hover:bg-pink-700"
      >
        Add Inventory
      </button>
    </form>
  );
};

const InventoryTable = ({ user }: { user: any }) => {
  const [inventory, setInventory] = useState<Inventory[]>([]);
  const [filters, setFilters] = useState({
    category: '',
    language: '',
    search: '',
    minPrice: '',
    maxPrice: ''
  });
  const [sort, setSort] = useState({ field: 'name', direction: 'asc' });

  const toggleSort = (field: string) => {
    if (sort.field === field) {
      setSort(prev => ({ ...prev, direction: prev.direction === 'asc' ? 'desc' : 'asc' }));
    } else {
      setSort({ field, direction: 'asc' });
    }
  };

  useEffect(() => {
    const fetchInventory = async () => {
      try {
        const queryParams = new URLSearchParams({
          inventoryType: 'WAREHOUSE',
          warehouseType: user.storeType,
          ...filters
        });
        const res = await fetch(`/api/ram/inventory?${queryParams}`);
        if (res.ok) {
          let data = await res.json();
          // apply client-side sorting
          if (sort.field === 'name') {
            data.sort((a: any, b: any) => {
              const aVal = a.book.name.toLowerCase();
              const bVal = b.book.name.toLowerCase();
              return sort.direction === 'asc' ? aVal.localeCompare(bVal) : bVal.localeCompare(aVal);
            });
          } else if (sort.field === 'quantity') {
            data.sort((a: any, b: any) => {
              const aVal = Number(a.quantity) || 0;
              const bVal = Number(b.quantity) || 0;
              return sort.direction === 'asc' ? aVal - bVal : bVal - aVal;
            });
          }
          setInventory(data);
        }
      } catch (error) {
        console.error(error);
      }
    };
    fetchInventory();
  }, [user.storeType, filters, sort]);

  return (
    <div>
      {/* Filters & Sort */}
      <div className="mb-4 p-4 bg-white rounded-lg shadow space-y-3">
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
        {/* Sort Options */}
        <div className="flex gap-2 items-center flex-wrap">
          <span className="text-sm font-medium text-gray-700">Sort by:</span>
          <button
            onClick={() => toggleSort('name')}
            className={`px-3 py-1 rounded text-sm ${
              sort.field === 'name'
                ? 'bg-pink-600 text-white'
                : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
            }`}
          >
            Book Name {sort.field === 'name' && (sort.direction === 'asc' ? '↑' : '↓')}
          </button>
          <button
            onClick={() => toggleSort('quantity')}
            className={`px-3 py-1 rounded text-sm ${
              sort.field === 'quantity'
                ? 'bg-pink-600 text-white'
                : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
            }`}
          >
            Quantity {sort.field === 'quantity' && (sort.direction === 'asc' ? '↑' : '↓')}
          </button>
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
              <tr key={item.id} className="border-t">
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
  );
};

export default function InventoryPage() {
  const [user, setUser] = useState<any>(null);
  const [activeModal, setActiveModal] = useState<'add-book' | 'add-inventory' | null>(null);

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

  if (!user) return null;

  return (
    <DashboardLayout user={user}>
      <div className="p-6 space-y-6">
        {/* Action Cards (2-column, wider) */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <button
            onClick={() => setActiveModal('add-book')}
            className="p-4 bg-white rounded-lg shadow hover:shadow-md transition-shadow flex items-center gap-3"
          >
            <div className="flex items-center justify-center w-10 h-10 bg-pink-100 rounded-full">
              <FaPlus className="text-pink-600 text-lg" />
            </div>
            <div className="text-left">
              <h4 className="text-sm font-semibold">Add Books</h4>
              <p className="text-xs text-gray-600">Add new books to your catalog</p>
            </div>
          </button>

          <button
            onClick={() => setActiveModal('add-inventory')}
            className="p-4 bg-white rounded-lg shadow hover:shadow-md transition-shadow flex items-center gap-3"
          >
            <div className="flex items-center justify-center w-10 h-10 bg-yellow-100 rounded-full">
              <FaBoxOpen className="text-yellow-600 text-lg" />
            </div>
            <div className="text-left">
              <h4 className="text-sm font-semibold">Update Inventory</h4>
              <p className="text-xs text-gray-600">Add stock to existing books</p>
            </div>
          </button>
        </div>

        {/* Modals for add actions. */}
        {(activeModal === 'add-book' || activeModal === 'add-inventory') && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4">
            <div className="bg-white rounded-xl p-6 w-[95vw] md:w-[90vw] h-[95vh] md:h-[90vh] max-w-[1200px] overflow-y-auto">
              <div className="flex justify-between items-center mb-4">
                <h3 className="text-lg font-semibold">
                  {activeModal === 'add-book' && 'Add New Book'}
                  {activeModal === 'add-inventory' && 'Update Inventory'}
                </h3>
                <button
                  onClick={() => setActiveModal(null)}
                  className="text-gray-500 hover:text-gray-700"
                >
                  ×
                </button>
              </div>

              {activeModal === 'add-book' && (
                <AddBookForm onClose={() => setActiveModal(null)} warehouseType={user.storeType} />
              )}
              {activeModal === 'add-inventory' && (
                <AddInventoryForm onClose={() => setActiveModal(null)} user={user} />
              )}
            </div>
          </div>
        )}

        {/* Inventory Table - shown by default */}
        <div className="mt-6 bg-white rounded-xl shadow-lg p-4">
          <div className="mb-3">
            <h3 className="text-lg font-semibold">Current Inventory</h3>
          </div>
          <InventoryTable user={user} />
        </div>
      </div>
    </DashboardLayout>
  );
}