"use client";
import React, { useState, useEffect } from 'react';

interface Book {
  id: string;
  title: string;
  languages: Array<{
    code: string;
    quantity: number;
  }>;
}

interface BookSelectProps {
  onChange: (selection: { bookId: string; language: string; quantity: number; title: string }) => void;
}

export default function BookSelect({ onChange }: BookSelectProps) {
  const [books, setBooks] = useState<Book[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedBook, setSelectedBook] = useState<string>('');
  const [selectedLanguage, setSelectedLanguage] = useState<string>('');
  const [quantity, setQuantity] = useState<number>(1);
  const [error, setError] = useState<string>('');

  useEffect(() => {
    const fetchBooks = async () => {
      try {
        const res = await fetch('/api/ram/warehouse/inventory');
        const data = await res.json();
        if (Array.isArray(data)) {
          setBooks(data);
        }
      } catch (err) {
        setError('Failed to load books');
      } finally {
        setLoading(false);
      }
    };

    fetchBooks();
  }, []);

  const selectedBookData = books.find(b => b.id === selectedBook);
  const maxQuantity = selectedBookData?.languages.find(l => l.code === selectedLanguage)?.quantity ?? 0;

  const handleAdd = () => {
    if (!selectedBook || !selectedLanguage || !quantity) return;
    const book = books.find(b => b.id === selectedBook);
    if (!book) return;

    onChange({
      bookId: selectedBook,
      language: selectedLanguage,
      quantity,
      title: book.title
    });

    // Reset form
    setSelectedBook('');
    setSelectedLanguage('');
    setQuantity(1);
  };

  if (loading) return <div className="text-sm text-gray-500">Loading books...</div>;
  if (error) return <div className="text-sm text-red-500">{error}</div>;
  if (!books.length) return <div className="text-sm text-gray-500">No books available</div>;

  return (
    <div className="space-y-4 bg-gray-50 p-4 rounded-lg">
      <div>
        <label className="block text-sm text-gray-700 mb-1">Book</label>
        <select
          value={selectedBook}
          onChange={(e) => setSelectedBook(e.target.value)}
          className="w-full rounded border p-2"
        >
          <option value="">Select a book</option>
          {books.map((book) => (
            <option key={book.id} value={book.id}>{book.title}</option>
          ))}
        </select>
      </div>

      {selectedBook && (
        <div>
          <label className="block text-sm text-gray-700 mb-1">Language</label>
          <select
            value={selectedLanguage}
            onChange={(e) => setSelectedLanguage(e.target.value)}
            className="w-full rounded border p-2"
          >
            <option value="">Select language</option>
            {selectedBookData?.languages.map((lang) => (
              <option key={lang.code} value={lang.code}>
                {lang.code.toUpperCase()} (Available: {lang.quantity})
              </option>
            ))}
          </select>
        </div>
      )}

      {selectedLanguage && (
        <div>
          <label className="block text-sm text-gray-700 mb-1">Quantity</label>
          <input
            type="number"
            min="1"
            max={maxQuantity}
            value={quantity}
            onChange={(e) => setQuantity(Math.min(maxQuantity, Math.max(1, parseInt(e.target.value) || 1)))}
            className="w-full rounded border p-2"
          />
          <p className="text-xs text-gray-500 mt-1">Maximum: {maxQuantity}</p>
        </div>
      )}

      <button
        type="button"
        onClick={handleAdd}
        disabled={!selectedBook || !selectedLanguage || !quantity}
        className="w-full py-2 bg-pink-600 text-white rounded-lg disabled:opacity-50"
      >
        Add Book
      </button>
    </div>
  );
}