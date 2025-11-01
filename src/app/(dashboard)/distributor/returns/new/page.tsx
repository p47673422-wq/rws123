"use client";
import React, { useState } from "react";

interface Book {
  id: string;
  name: string;
  qty: number;
}

// Stub inventory data
const inventoryStub: Book[] = [
  { id: "b1", name: "Bhagavad Gita", qty: 5 },
  { id: "b2", name: "Krishna Book", qty: 2 },
  { id: "b3", name: "Science of Self Realization", qty: 4 },
];

export default function ReturnRequestForm() {
  const [inventory, setInventory] = useState<Book[]>(inventoryStub);
  const [selected, setSelected] = useState<string[]>([]);
  const [quantities, setQuantities] = useState<Record<string, string>>({});
  const [reason, setReason] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [success, setSuccess] = useState(false);

  const handleBookSelect = (id:any) => {
    setSelected((sel) =>
      sel.includes(id) ? sel.filter((b) => b !== id) : [...sel, id]
    );
  };

  const handleQtyChange = (id: any, value:any) => {
    setQuantities((q) => ({ ...q, [id]: value }));
  };

  const isQtyValid = (id:any) => {
    const qty = Number(quantities[id] || 0);
    const inv = inventory.find((b) => b.id === id);
    return qty > 0 && inv && qty <= inv.qty;
  };

  const handleSubmit = async (e:any) => {
    e.preventDefault();
    if (!reason || selected.length === 0 || !selected.every(isQtyValid)) return;
    setSubmitting(true);
    // Optimistic inventory update
    setInventory((inv) =>
      inv.map((b) =>
        selected.includes(b.id)
          ? { ...b, qty: b.qty - Number(quantities[b.id] || 0) }
          : b
      )
    );
    // TODO: Submit return request to backend
    setTimeout(() => {
      setSuccess(true);
      setSubmitting(false);
    }, 1200);
  };

  return (
    <div className="max-w-xl mx-auto p-4">
      <h1 className="text-2xl font-bold mb-4">Return Request</h1>
      <form className="grid gap-6" onSubmit={handleSubmit}>
        <div>
          <label className="block font-semibold mb-2">Select Books</label>
          <div className="grid gap-2">
            {inventory.map((book) => (
              <label key={book.id} className="flex items-center gap-2 border rounded px-3 py-2">
                <input
                  type="checkbox"
                  checked={selected.includes(book.id)}
                  onChange={() => handleBookSelect(book.id)}
                  disabled={success || book.qty === 0}
                />
                <span className="font-semibold">{book.name}</span>
                <span className="text-xs text-gray-500">Available: {book.qty}</span>
                {selected.includes(book.id) && (
                  <input
                    type="number"
                    min={1}
                    max={book.qty}
                    value={quantities[book.id] || ""}
                    onChange={(e) => handleQtyChange(book.id, e.target.value)}
                    className="ml-2 border rounded px-2 py-1 w-20"
                    disabled={success}
                    required
                  />
                )}
                {selected.includes(book.id) && !isQtyValid(book.id) && (
                  <span className="text-red-600 text-xs ml-2">Invalid qty</span>
                )}
              </label>
            ))}
          </div>
        </div>
        <div>
          <label className="block font-semibold mb-2">Reason</label>
          <textarea
            className="border rounded px-3 py-2 w-full"
            value={reason}
            onChange={(e) => setReason(e.target.value)}
            required
            disabled={success}
            placeholder="Enter reason for return"
          />
        </div>
        <button
          type="submit"
          className="bg-blue-600 text-white px-6 py-3 rounded font-semibold text-lg"
          disabled={submitting || success || !reason || selected.length === 0 || !selected.every(isQtyValid)}
        >
          {submitting ? "Submitting..." : success ? "Submitted" : "Submit Return Request"}
        </button>
        {success && (
          <div className="mt-4 p-4 bg-green-100 text-green-800 rounded text-center font-semibold">
            Return request sent to store owner
          </div>
        )}
      </form>
    </div>
  );
}
