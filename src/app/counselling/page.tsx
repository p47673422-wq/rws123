"use client";

import React, { useState } from "react";

export default function CounsellingPage() {
  const [name, setName] = useState("");
  const [mobile, setMobile] = useState("");
  const [date, setDate] = useState("");
  const [time, setTime] = useState("");
  const [status, setStatus] = useState<string | null>(null);

  async function saveCounsellingSlot(slot: any) {
    // TODO: replace with real API
    console.log("saveCounsellingSlot placeholder", slot);
    return Promise.resolve({ ok: true });
  }

  const submit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!name || !mobile || !date || !time) {
      setStatus("Please fill all fields.");
      return;
    }
    setStatus("Saving...");
    await saveCounsellingSlot({ name, mobile, date, time, createdAt: Date.now() });
    setStatus("Saved! We'll contact you to confirm the slot.");
    setName("");
    setMobile("");
    setDate("");
    setTime("");
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-amber-50 to-rose-50 py-12">
      <main className="max-w-2xl mx-auto bg-white/90 rounded-3xl p-8 shadow-xl">
        <h1 className="text-2xl font-bold">Free Counselling</h1>
        <p className="mt-2 text-sm text-slate-700">Choose a preferred date and time and we will reach out to confirm.</p>

        <form onSubmit={submit} className="mt-6 space-y-4">
          <input value={name} onChange={(e) => setName(e.target.value)} placeholder="Full Name" className="w-full p-3 rounded-lg border" />
          <input value={mobile} onChange={(e) => setMobile(e.target.value)} placeholder="Mobile Number" className="w-full p-3 rounded-lg border" />
          <div className="grid grid-cols-2 gap-4">
            <input type="date" value={date} onChange={(e) => setDate(e.target.value)} className="p-3 rounded-lg border" />
            <input type="time" value={time} onChange={(e) => setTime(e.target.value)} className="p-3 rounded-lg border" />
          </div>

          <div className="flex items-center justify-between">
            <button type="submit" className="px-4 py-2 rounded-lg bg-indigo-600 text-white font-semibold">Request Slot</button>
            {status && <div className="text-sm text-slate-700">{status}</div>}
          </div>
        </form>
      </main>
    </div>
  );
}
