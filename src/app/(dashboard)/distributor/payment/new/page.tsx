"use client";
import React, { useState, useRef } from "react";
// import { Uploadthing } from "@/components/Uploadthing"; // Uncomment when Uploadthing is available

interface Book {
  id: string;
  name: string;
  qty: number;
  price: number;
}

function compressImage(file: File, callback: (compressedFile: File) => void): void {
  // Stub: Replace with actual compression logic or library
  callback(file);
}

const booksStub: Book[] = [
  { id: "b1", name: "Bhagavad Gita", qty: 2, price: 250 },
  { id: "b2", name: "Krishna Book", qty: 1, price: 300 },
  { id: "b3", name: "Science of Self Realization", qty: 3, price: 150 },
];

export default function PaymentFormPage() {
  const [amount, setAmount] = useState("");
  const [books, setBooks] = useState<Book[]>(booksStub);
  const [selected, setSelected] = useState<string[]>([]);
  const [receipt, setReceipt] = useState<File | null>(null);
  const [receiptPreview, setReceiptPreview] = useState<string | null>(null);
  const [submitting, setSubmitting] = useState(false);
  const [success, setSuccess] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const total = selected.reduce((sum, id) => {
    const book = books.find((b) => b.id === id);
    return sum + (book ? book.price * book.qty : 0);
  }, 0);

  const handleFileChange = (e: any) => {
    const file = e.target.files[0];
    if (!file) return;
    compressImage(file, (compressed) => {
      setReceipt(compressed);
      setReceiptPreview(URL.createObjectURL(compressed));
    });
  };

  const handleBookSelect = (id: any) => {
    setSelected((sel) =>
      sel.includes(id) ? sel.filter((b) => b !== id) : [...sel, id]
    );
  };

  const handleSubmit = async (e: any) => {
    e.preventDefault();
    if (Number(amount) !== total || !receipt || selected.length === 0) return;
    setSubmitting(true);
    // TODO: Submit payment to backend
    setTimeout(() => {
      setSuccess(true);
      setSubmitting(false);
    }, 1200);
  };

  return (
    <div className="max-w-xl mx-auto p-4">
      <h1 className="text-2xl font-bold mb-4">Submit Payment</h1>
      <form className="grid gap-6" onSubmit={handleSubmit}>
        <div>
          <label className="block font-semibold mb-2">Amount</label>
          <div className="flex items-center text-3xl font-bold">
            <span className="mr-2">₹</span>
            <input
              type="number"
              className="border rounded px-4 py-2 text-3xl w-full"
              value={amount}
              onChange={(e) => setAmount(e.target.value)}
              disabled={success}
              required
              min={1}
            />
          </div>
        </div>
        <div>
          <label className="block font-semibold mb-2">Upload Receipt</label>
          <div
            className="border-dashed border-2 border-gray-300 rounded p-4 flex flex-col items-center cursor-pointer"
            onClick={() => fileInputRef.current?.click()}
            style={{ background: receiptPreview ? `url(${receiptPreview}) center/cover` : undefined }}
          >
            {!receiptPreview ? (
              <span className="text-gray-500">Drag & drop or click to upload</span>
            ) : (
              <span className="text-green-600 font-semibold">Receipt uploaded</span>
            )}
            <input
              type="file"
              accept="image/*"
              ref={fileInputRef}
              className="hidden"
              onChange={handleFileChange}
              disabled={success}
            />
          </div>
        </div>
        <div>
          <label className="block font-semibold mb-2">Select Books</label>
          <div className="grid gap-2">
            {books.map((book) => (
              <label key={book.id} className="flex items-center gap-2 border rounded px-3 py-2">
                <input
                  type="checkbox"
                  checked={selected.includes(book.id)}
                  onChange={() => handleBookSelect(book.id)}
                  disabled={success}
                />
                <span className="font-semibold">{book.name}</span>
                <span className="text-xs text-gray-500">Qty: {book.qty}</span>
                <span className="ml-auto font-bold">₹{book.price * book.qty}</span>
              </label>
            ))}
          </div>
        </div>
        <div className="flex items-center gap-4">
          <span className="font-semibold">Total:</span>
          <span className="text-2xl font-bold">₹{total}</span>
        </div>
        <div className="text-sm text-gray-500 mb-2">
          {Number(amount) !== total && selected.length > 0 && (
            <span className="text-red-600">Amount must match selected books' total.</span>
          )}
        </div>
        <button
          type="submit"
          className="bg-blue-600 text-white px-6 py-3 rounded font-semibold text-lg"
          disabled={submitting || success || Number(amount) !== total || !receipt || selected.length === 0}
        >
          {submitting ? "Submitting..." : success ? "Submitted" : "Submit Payment"}
        </button>
        {success && (
          <div className="mt-4 p-4 bg-green-100 text-green-800 rounded text-center font-semibold">
            Payment submitted for verification
          </div>
        )}
      </form>
    </div>
  );
}
