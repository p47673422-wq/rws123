"use client";
import React, { useEffect, useState } from "react";
import { apiFetch } from "../../lib/api";

function groupBy(arr: any[], key: string) {
  return arr.reduce((acc, item) => {
    const k = item[key] || "Unknown";
    if (!acc[k]) acc[k] = [];
    acc[k].push(item);
    return acc;
  }, {} as Record<string, any[]>);
}

export default function AllSubmissionsPage() {
  const [bookings, setBookings] = useState<any[]>([]);
  const [search, setSearch] = useState("");
  const [dateFrom, setDateFrom] = useState("");
  const [dateTo, setDateTo] = useState("");
  const [expanded, setExpanded] = useState<Record<string, boolean>>({});

  useEffect(() => {
    apiFetch<{ bookings: any[] }>("/api/bookings")
      .then(data => setBookings(data.bookings || []));
  }, []);

  // Filter bookings
  const filtered = bookings.filter(b => {
    const matchPlace = b.placeName.toLowerCase().includes(search.toLowerCase());
    const matchDate = (!dateFrom || b.date >= dateFrom) && (!dateTo || b.date <= dateTo);
    return matchPlace && matchDate;
  });

  const grouped = groupBy(filtered, "cordinator.name");

  return (
    <div className="min-h-screen bg-gradient-to-br from-yellow-100 to-orange-200 py-6 px-2">
      <h2 className="text-xl font-bold text-yellow-700 mb-4">All Bookings</h2>
      <div className="flex flex-wrap gap-2 mb-4">
        <input type="text" placeholder="Search by place name" value={search} onChange={e => setSearch(e.target.value)} className="px-3 py-2 border rounded" />
        <input type="date" value={dateFrom} onChange={e => setDateFrom(e.target.value)} className="px-3 py-2 border rounded" />
        <input type="date" value={dateTo} onChange={e => setDateTo(e.target.value)} className="px-3 py-2 border rounded" />
      </div>
      {Object.entries(grouped).map(([cordName, group]) => {
        const bookingsGroup = group as any[];
        return (
          <div key={cordName} className="mb-6 bg-white rounded-xl shadow-md border border-yellow-200">
            <button
              className="w-full text-left px-4 py-3 font-bold text-yellow-800 flex justify-between items-center"
              onClick={() => setExpanded(e => ({ ...e, [cordName]: !e[cordName] }))}
            >
              <span>{cordName}</span>
              <span className="ml-2 bg-yellow-500 text-white rounded-full px-3 py-1 text-sm">{bookingsGroup.length} bookings</span>
              <span className="ml-2 bg-orange-400 text-white rounded-full px-3 py-1 text-sm">{bookingsGroup.reduce((a, b) => a + b.strength, 0)} strength</span>
              <span>{expanded[cordName] ? "▲" : "▼"}</span>
            </button>
            {expanded[cordName] && (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 px-4 pb-4">
                {bookingsGroup.map(b => (
                  <div key={b.id} className="bg-yellow-50 rounded-lg shadow p-3 flex flex-col gap-1">
                    <div className="font-bold text-yellow-800 text-lg">{b.placeName}</div>
                    <div className="text-yellow-700">Date: {b.date?.slice(0,10)}</div>
                    <div className="text-yellow-700">Strength: {b.strength}</div>
                    <div className="text-yellow-700">Duration: {b.duration}</div>
                    <div className="text-yellow-700">Coordinator: {cordName}</div>
                  </div>
                ))}
              </div>
            )}
          </div>
        );
      })}
    </div>
  );
}
