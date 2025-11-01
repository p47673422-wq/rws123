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

function validatePhone(phone: string): boolean {
  return /^\d{10}$/.test(phone);
}

export default function SalesRecordPage() {
  const [recordCustomer, setRecordCustomer] = useState(false);
  const [customerName, setCustomerName] = useState("");
  const [customerPhone, setCustomerPhone] = useState("");
  const [inventory, setInventory] = useState<Book[]>(inventoryStub);
  const [selected, setSelected] = useState<string[]>([]);
  const [quantities, setQuantities] = useState<Record<string, string>>({});
  const [submitting, setSubmitting] = useState(false);
  const [success, setSuccess] = useState(false);
  const [showUpdatePrompt, setShowUpdatePrompt] = useState(false);
  const [updateNow, setUpdateNow] = useState(false);

  const handleBookSelect = (id: string) => {
    setSelected((sel) =>
      sel.includes(id) ? sel.filter((b) => b !== id) : [...sel, id]
    );
  };

  const handleQtyChange = (id: string, value: string) => {
    setQuantities((q) => ({ ...q, [id]: value }));
  };

  const isQtyValid = (id: string): boolean | any => {
    const qty = Number(quantities[id] || 0);
    const inv = inventory.find((b) => b.id === id);
    return qty > 0 && inv && qty <= inv.qty;
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (recordCustomer && !customerName) return;
    if (recordCustomer && customerPhone && !validatePhone(customerPhone)) return;
    if (selected.length === 0 || !selected.every(isQtyValid)) return;
    setSubmitting(true);
    // TODO: Submit sale to backend
    setTimeout(() => {
      setSuccess(true);
      setSubmitting(false);
      setShowUpdatePrompt(true);
    }, 1200);
  };

  const handleUpdateInventory = () => {
    setUpdateNow(true);
    // Pre-fill inventory update flow (stub)
    setInventory((inv) =>
      inv.map((b) =>
        selected.includes(b.id)
          ? { ...b, qty: b.qty - Number(quantities[b.id] || 0) }
          : b
      )
    );
  };

  return (
    <div className="max-w-xl mx-auto p-4">
      <h1 className="text-2xl font-bold mb-4">Record Sale</h1>
      <form className="grid gap-6" onSubmit={handleSubmit}>
        <label className="flex items-center gap-2 mb-2">
          <input
            type="checkbox"
            checked={recordCustomer}
            onChange={() => setRecordCustomer((v) => !v)}
            disabled={success}
          />
          Record customer details?
        </label>
        {recordCustomer && (
          <div className="grid gap-2">
            <input
              type="text"
              placeholder="Customer name"
              className="border rounded px-3 py-2"
              value={customerName}
              onChange={(e) => setCustomerName(e.target.value)}
              required
              disabled={success}
            />
            <input
              type="text"
              placeholder="Phone (10 digits)"
              className="border rounded px-3 py-2"
              value={customerPhone}
              onChange={(e) => setCustomerPhone(e.target.value)}
              disabled={success}
              pattern="\d{10}"
            />
            {customerPhone && !validatePhone(customerPhone) && (
              <span className="text-red-600 text-xs">Invalid phone format</span>
            )}
          </div>
        )}
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
        <button
          type="submit"
          className="bg-blue-600 text-white px-6 py-3 rounded font-semibold text-lg"
          disabled={submitting || success || (recordCustomer && !customerName) || (recordCustomer && customerPhone && !validatePhone(customerPhone)) || selected.length === 0 || !selected.every(isQtyValid)}
        >
          {submitting ? "Submitting..." : success ? "Submitted" : "Record Sale"}
        </button>
        {success && (
          <div className="mt-4 p-4 bg-green-100 text-green-800 rounded text-center font-semibold">
            Sale recorded successfully!
          </div>
        )}
        {showUpdatePrompt && !updateNow && (
          <div className="mt-4 p-4 bg-blue-100 text-blue-800 rounded text-center font-semibold">
            Update inventory now?
            <div className="mt-2 flex gap-4 justify-center">
              <button className="bg-blue-600 text-white px-4 py-2 rounded" type="button" onClick={handleUpdateInventory}>Yes</button>
              <button className="bg-gray-300 px-4 py-2 rounded" type="button" onClick={() => setShowUpdatePrompt(false)}>No</button>
            </div>
          </div>
        )}
        {updateNow && (
          <div className="mt-4 p-4 bg-blue-50 text-blue-900 rounded text-center font-semibold">
            Inventory updated!
          </div>
        )}
      </form>
    </div>
  );
}
