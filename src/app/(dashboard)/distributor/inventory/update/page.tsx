"use client";
import React, { useState } from "react";
import { useRouter } from "next/navigation";

// Stub inventory data
const inventoryStub = [
  { id: "b1", name: "Bhagavad Gita", language: "English", qty: 5, price: 250 },
  { id: "b2", name: "Krishna Book", language: "Hindi", qty: 2, price: 300 },
  { id: "b3", name: "Science of Self Realization", language: "English", qty: 4, price: 150 },
];

export default function InventoryUpdatePage() {
  const router = useRouter();
  const [inventory, setInventory] = useState(inventoryStub);
  const [sold, setSold] = useState({});
  const [calculated, setCalculated] = useState(false);
  const [paymentDue, setPaymentDue] = useState(0);
  const [showModal, setShowModal] = useState(false);
  const [submitting, setSubmitting] = useState(false);

  const handleQtyChange = (id: string, value: string) => {
    setSold((s) => ({ ...s, [id]: value }));
  };

  const isQtyValid = (id: string) => {
  const qty = Number((sold as Record<string, number | string>)[id] || 0);
    const inv = inventory.find((b) => b.id === id);
    return qty >= 0 && inv && qty <= inv.qty;
  };

  const handleCalculate = () => {
    setCalculated(true);
    let total = 0;
    inventory.forEach((b) => {
  const qty = Number((sold as Record<string, number | string>)[b.id] || 0);
      if (qty > 0 && qty <= b.qty) {
        total += qty * b.price;
      }
    });
    setPaymentDue(total);
  };

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (!calculated) return;
    if (!inventory.every((b) => isQtyValid(b.id))) return;
    setSubmitting(true);
    // Optimistic inventory update
    setInventory((inv) =>
      inv.map((b) => {
  const qty = Number((sold as Record<string, number | string>)[b.id] || 0);
        return qty > 0 ? { ...b, qty: b.qty - qty } : b;
      })
    );
    setTimeout(() => {
      setShowModal(true);
      setSubmitting(false);
    }, 1200);
  };

  return (
    <div className="max-w-2xl mx-auto p-4">
      <h1 className="text-2xl font-bold mb-4">Inventory Management</h1>
      <div className="mb-6">
        <table className="w-full border rounded">
          <thead>
            <tr className="bg-gray-100">
              <th className="px-2 py-1 text-left">Book</th>
              <th className="px-2 py-1 text-left">Language</th>
              <th className="px-2 py-1 text-left">Current Qty</th>
            </tr>
          </thead>
          <tbody>
            {inventory.map((b) => (
              <tr key={b.id}>
                <td className="px-2 py-1">{b.name}</td>
                <td className="px-2 py-1">{b.language}</td>
                <td className="px-2 py-1">{b.qty}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      <form className="grid gap-6" onSubmit={handleSubmit}>
        <div>
          <h2 className="font-semibold mb-2">Record Books Sold</h2>
          <div className="grid gap-2">
            {inventory.map((book) => (
              <label key={book.id} className="flex items-center gap-2 border rounded px-3 py-2">
                <span className="font-semibold">{book.name}</span>
                <span className="text-xs text-gray-500">({book.language})</span>
                <span className="text-xs text-gray-500">Available: {book.qty}</span>
                <input
                  type="number"
                  min={0}
                  max={book.qty}
                  value={(sold as Record<string, number | string>)[book.id] || ""}
                  onChange={(e) => handleQtyChange(book.id, e.target.value)}
                  className="ml-2 border rounded px-2 py-1 w-20"
                  disabled={submitting}
                />
                {(sold as Record<string, number | string>)[book.id] && !isQtyValid(book.id) && (
                  <span className="text-red-600 text-xs ml-2">Invalid qty</span>
                )}
              </label>
            ))}
          </div>
        </div>
        <button
          type="button"
          className="bg-gray-600 text-white px-4 py-2 rounded font-semibold"
          onClick={handleCalculate}
          disabled={submitting}
        >
          Calculate
        </button>
        {calculated && (
          <div className="bg-blue-50 p-4 rounded mb-2">
            <div className="font-semibold mb-1">Books Sold:</div>
            <ul className="mb-2">
              {inventory.filter((b) => Number((sold as Record<string, number | string>)[b.id] || 0) > 0).map((b) => (
                <li key={b.id}>{b.name} ({b.language}): {(sold as Record<string, number | string>)[b.id]} sold</li>
              ))}
            </ul>
            <div className="font-semibold mb-1">New Inventory:</div>
            <ul className="mb-2">
              {inventory.map((b) => (
                <li key={b.id}>{b.name} ({b.language}): {b.qty - Number((sold as Record<string, number | string>)[b.id] || 0)}</li>
              ))}
            </ul>
            <div className="font-bold text-lg">Payment Due: ₹{paymentDue}</div>
          </div>
        )}
        <button
          type="submit"
          className="bg-blue-600 text-white px-6 py-3 rounded font-semibold text-lg"
          disabled={submitting || !calculated || !inventory.every((b) => isQtyValid(b.id))}
        >
          {submitting ? "Updating..." : "Update Inventory"}
        </button>
      </form>
      {showModal && (
        <div className="fixed inset-0 bg-black bg-opacity-30 flex items-center justify-center z-50">
          <div className="bg-white p-6 rounded shadow-lg text-center">
            <div className="font-bold text-xl mb-2">You have sold books worth ₹{paymentDue}.</div>
            <div className="mb-4">Please submit payment.</div>
            <button
              className="bg-blue-600 text-white px-6 py-2 rounded font-semibold"
              onClick={() => router.push("/app/(dashboard)/distributor/payment/new")}
            >
              Submit Payment Now
            </button>
            <button
              className="ml-4 bg-gray-300 px-4 py-2 rounded"
              onClick={() => setShowModal(false)}
            >
              Close
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
