"use client";

import React, { useState } from "react";

export default function CounsellingAdminPage() {
  const [auth, setAuth] = useState("");
  const [authed, setAuthed] = useState(false);
  const [data, setData] = useState<any[]>([]);
  const [filterDate, setFilterDate] = useState("");
  const [loading, setLoading] = useState(false);

  async function fetchCounselling() {
    setLoading(true);
    let url = "/api/counselling/all";
    if (filterDate) url += `?date=${filterDate}`;
    const res = await fetch(url);
    const json = await res.json();
    setData(json.data || []);
    setLoading(false);
  }

  function handleAuth(e: React.FormEvent) {
    e.preventDefault();
    if (auth === "Sitaram108") {
      setAuthed(true);
      fetchCounselling();
    }
  }

  return (
    <div className="min-h-screen bg-black flex flex-col items-center justify-start pt-12">
      {!authed ? (
        <form onSubmit={handleAuth} className="bg-white rounded-xl shadow-lg p-6 mt-12">
          <h2 className="text-lg font-bold mb-2">Admin Access</h2>
          <input type="password" value={auth} onChange={e => setAuth(e.target.value)} placeholder="Enter Access Code" className="p-2 rounded border border-gray-300" />
          <button type="submit" className="ml-3 px-4 py-2 rounded bg-amber-400 text-black font-semibold">Login</button>
        </form>
      ) : (
        <div className="w-full max-w-2xl mx-auto mt-8">
          <div className="flex items-center gap-4 mb-4">
            <input type="date" value={filterDate} onChange={e => setFilterDate(e.target.value)} className="p-2 rounded border" />
            <button onClick={fetchCounselling} className="px-4 py-2 rounded bg-amber-400 text-black font-semibold">Filter</button>
          </div>
          {loading ? <div className="text-white">Loading...</div> : null}
          {data.length === 0 && !loading ? <div className="text-white">No data found.</div> : null}
          <div className="space-y-4">
            {data.map((item, idx) => (
              <details key={item.id || idx} className="bg-white rounded-xl p-4 shadow">
                <summary className="cursor-pointer font-semibold text-amber-700">{item.name} ({item.mobile}) - {item.preferredDate?.slice(0,10)} {item.preferredTime}</summary>
                <div className="mt-2 text-sm text-gray-700">
                  <div><b>Gender:</b> {item.gender}</div>
                  <div><b>Marital Status:</b> {item.maritalStatus}</div>
                  <div><b>Date:</b> {item.preferredDate?.slice(0,10)}</div>
                  <div><b>Time:</b> {item.preferredTime}</div>
                  <div><b>Created At:</b> {item.createdAt?.slice(0,19).replace('T',' ')}</div>
                </div>
              </details>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
