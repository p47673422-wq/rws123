"use client";
import React, { useState, useEffect } from "react";
import { formatDistanceToNow } from "date-fns";

const STATUS = ["ALL", "PENDING", "PACKED", "COLLECTED"];
const STATUS_COLORS: Record<string, string> = {
  PENDING: "bg-yellow-100 text-yellow-800",
  PACKED: "bg-blue-100 text-blue-800",
  COLLECTED: "bg-green-100 text-green-800",
};

const KRISHNA_QUOTES = [
  "Whatever happened, happened for the good. Whatever is happening, is happening for the good. Whatever will happen, will also happen for the good.",
  "You have the right to work, but never to the fruit of work.",
  "Change is the law of the universe. You can be a millionaire, or a pauper in an instant.",
];

function getRandomQuote() {
  return KRISHNA_QUOTES[Math.floor(Math.random() * KRISHNA_QUOTES.length)];
}

function SkeletonCard() {
  return (
    <div className="animate-pulse bg-gray-100 rounded-lg p-4 mb-4">
      <div className="h-4 bg-gray-300 rounded w-1/3 mb-2" />
      <div className="h-4 bg-gray-300 rounded w-1/2 mb-2" />
      <div className="h-4 bg-gray-300 rounded w-2/3 mb-2" />
      <div className="h-4 bg-gray-300 rounded w-1/4" />
    </div>
  );
}

export default function OrdersPage() {
  const [tab, setTab] = useState("ALL");
  const [orders, setOrders] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [quote] = useState(getRandomQuote());

  const fetchOrders = async () => {
    setLoading(true);
    // Replace with your actual API endpoint
    const res = await fetch("/api/ram/distributor/orders");
    const data = await res.json();
    setOrders(data.orders || []);
    setLoading(false);
  };

  useEffect(() => {
    fetchOrders();
  }, []);

  const handleRefresh = async () => {
    setRefreshing(true);
    await fetchOrders();
    setRefreshing(false);
  };

  const filteredOrders = tab === "ALL"
    ? orders
    : orders.filter((o) => o.status === tab);

  return (
    <div className="max-w-2xl mx-auto p-4">
      <div className="flex gap-2 mb-4">
        {STATUS.map((s) => (
          <button
            key={s}
            className={`px-3 py-1 rounded-full font-semibold border ${tab === s ? "bg-blue-600 text-white" : "bg-gray-100 text-gray-800"}`}
            onClick={() => setTab(s)}
          >
            {s.charAt(0) + s.slice(1).toLowerCase()}
          </button>
        ))}
        <button
          className="ml-auto px-3 py-1 rounded border bg-gray-50 text-gray-600"
          onClick={handleRefresh}
          disabled={refreshing}
        >
          {refreshing ? "Refreshing..." : "Pull to refresh"}
        </button>
      </div>
      {loading ? (
        <>
          <SkeletonCard />
          <SkeletonCard />
        </>
      ) : filteredOrders.length === 0 ? (
        <div className="text-center py-12 text-lg text-gray-600 italic">
          {quote}
        </div>
      ) : (
        <div className="flex flex-col gap-4">
          {filteredOrders.map((order) => (
            <OrderCard key={order.id} order={order} />
          ))}
        </div>
      )}
    </div>
  );
}

function OrderCard({ order }: { order: any }) {
  const [showItems, setShowItems] = useState(false);
  const statusColor = STATUS_COLORS[order.status] || "bg-gray-100 text-gray-800";
  const items = order.items || [];
  const showCollapse = items.length > 3;

  return (
    <div className="border rounded-lg p-4 shadow-sm flex flex-col md:flex-row md:items-center gap-4">
      <div className="flex-1">
        <div className="flex items-center gap-2 mb-1">
          <span className="font-bold">Order ID:</span>
          <span className="text-sm bg-gray-200 px-2 py-1 rounded">{order.id}</span>
          <CopyButton value={order.id} />
        </div>
        <div className="mb-1">
          <span className="font-semibold">Store Owner:</span> {order.storeOwnerName}
        </div>
        <div className="mb-1">
          <span className="font-semibold">Items:</span>
          {showCollapse ? (
            <>
              <button
                className="ml-2 text-blue-600 underline text-xs"
                onClick={() => setShowItems((v) => !v)}
              >
                {showItems ? "Hide" : `Show all (${items.length})`}
              </button>
              <ul className="ml-4 list-disc text-sm">
                {(showItems ? items : items.slice(0, 3)).map((item: any, idx: number) => (
                  <li key={idx}>{item.name} x{item.qty}</li>
                ))}
                {!showItems && <li className="italic text-gray-400">...and {items.length - 3} more</li>}
              </ul>
            </>
          ) : (
            <ul className="ml-4 list-disc text-sm">
              {items.map((item: any, idx: number) => (
                <li key={idx}>{item.name} x{item.qty}</li>
              ))}
            </ul>
          )}
        </div>
        <div className={`inline-block px-2 py-1 rounded ${statusColor} font-semibold text-xs mb-1`}>
          {order.status}
        </div>
        <div className="text-xs text-gray-500 mb-1">
          Created {formatDistanceToNow(new Date(order.createdAt), { addSuffix: true })}
        </div>
        {order.status === "PACKED" && order.otp && (
          <div className="mt-2 p-3 bg-blue-50 border-l-4 border-blue-400 rounded">
            <div className="text-2xl font-bold text-blue-700">{order.otp}</div>
            <div className="text-sm text-blue-700 mt-1">Give this OTP to store owner</div>
          </div>
        )}
      </div>
    </div>
  );
}

function CopyButton({ value }: { value: string }) {
  const [copied, setCopied] = useState(false);
  return (
    <button
      className="text-xs px-2 py-1 bg-gray-200 rounded hover:bg-gray-300"
      onClick={() => {
        navigator.clipboard.writeText(value);
        setCopied(true);
        setTimeout(() => setCopied(false), 1200);
      }}
    >
      {copied ? "Copied!" : "Copy"}
    </button>
  );
}
