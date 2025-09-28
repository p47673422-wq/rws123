"use client";

import React, { useState } from "react";

export default function CounsellingPage() {
  const [name, setName] = useState("");
  const [mobile, setMobile] = useState("");
  const [maritalStatus, setMaritalStatus] = useState("");
  const [gender, setGender] = useState("");
  const [preferredDate, setPreferredDate] = useState("");
  const [preferredTime, setPreferredTime] = useState("");
  const [status, setStatus] = useState<string | null>(null);

  async function saveCounsellingSlot(slot: any) {
    try {
      const res = await fetch("/api/counselling/submit", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(slot)
      });
      return await res.json();
    } catch {
      return { error: "Network error" };
    }
  }

  const submit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!name || !mobile || !maritalStatus || !gender || !preferredDate || !preferredTime) {
      setStatus("Please fill all fields.");
      return;
    }
    setStatus("Saving...");
    const result = await saveCounsellingSlot({ name, mobile, maritalStatus, gender, preferredDate, preferredTime });
    if (result.success) {
      setStatus("Saved! We'll contact you to confirm the slot.");
      setName("");
      setMobile("");
      setMaritalStatus("");
      setGender("");
      setPreferredDate("");
      setPreferredTime("");
    } else {
      setStatus(result.error || "Error saving. Try again.");
    }
  };

  return (
    <div className="min-h-screen flex z-30 items-start justify-center bg-black pt-0 md:pt-8">
      <div className="relative w-full max-w-md h-screen bg-cover bg-center overflow-hidden" style={{ backgroundImage: "url('/images/ramb.png')", top: 0, position: 'absolute', left: '50%', transform: 'translateX(-50%)', maxHeight: '100vh' }}>
        <div className="fixed inset-0 flex items-center justify-center bg-black/60" style={{ zIndex: 1000 }}>
          <form onSubmit={submit} className="w-11/12 md:w-2/3 lg:w-1/2 bg-white text-black rounded-2xl shadow-2xl p-6 border border-orange-100">
            <h3 className="text-lg md:text-2xl font-semibold mb-2">Request Free Counselling</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <input className="p-2 rounded border border-gray-200" name="name" type="text" placeholder="Your Name" value={name} onChange={(e) => setName(e.target.value)} />
              <input className="p-2 rounded border border-gray-200" name="mobile" type="tel" placeholder="Mobile Number" value={mobile} onChange={(e) => setMobile(e.target.value)} maxLength={10} pattern="[6-9]{1}[0-9]{9}" inputMode="numeric" />
              <select className="p-2 rounded border border-gray-200" name="gender" value={gender} onChange={(e) => setGender(e.target.value)}>
                <option value="">Select Gender</option>
                <option value="Male">Male</option>
                <option value="Female">Female</option>
              </select>
              <select className="p-2 rounded border border-gray-200" name="maritalStatus" value={maritalStatus} onChange={(e) => setMaritalStatus(e.target.value)}>
                <option value="">Select Marital Status</option>
                <option value="Single">Single</option>
                <option value="Married">Married</option>
              </select>
              <input className="p-2 rounded border border-gray-200" name="preferredDate" type="date" value={preferredDate} onChange={(e) => setPreferredDate(e.target.value)} />
              <input className="p-2 rounded border border-gray-200" name="preferredTime" type="time" value={preferredTime} onChange={(e) => setPreferredTime(e.target.value)} />
            </div>
            <div className="mt-4 flex items-center justify-end gap-3">
              <button type="submit" className="px-5 py-2 rounded-lg bg-amber-400 text-black font-semibold hover:bg-amber-500">Request Slot</button>
              {status && <div className="text-sm text-slate-700">{status}</div>}
            </div>
          </form>
        </div>
      </div>
      <div className="w-full text-center py-3 bg-black/70 text-sm fixed bottom-0">
        <span className="text-amber-300">🌸 Take shelter of Lord Ram — liberate yourself from lust, envy, anger, pride, greed, illusion. 🌸</span>
      </div>
    </div>
  );
}
