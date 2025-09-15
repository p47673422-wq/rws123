"use client";
import React, { useEffect, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import Image from "next/image";
const placeTypes = ["SCHOOL",
"COLLEGE",
"COMPANY",
"PUBLIC_PLACE",
"SHRESHTHA",
"OTHER"];

const durations = ["30 min", "1 hr", "2 hr", "custom"];
const resourcesList = ["Japa Mala", "Mantra Card", "QR Code", "Book for stall", "Gifts", "Ladoo Prasadam"];

import { apiFetch } from "../lib/api";

export default function BookingForm({ user }: { user: { id: string; name: string } }) {
  const router = useRouter();
  const searchParams = useSearchParams();
  const bookingId = searchParams.get("bookingId");

  const [form, setForm] = useState({
    placeType: "SCHOOL",
    placeName: "",
    date: "",
    time: "",
    strength: 1,
    duration: "30 min",
    customDuration: "",
    resources: [] as string[],
    comment: "",
  });
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [loading, setLoading] = useState(false);

  // Prefill for edit mode
  useEffect(() => {
    if (bookingId) {
      apiFetch<{ booking: any }>(`/api/bookings/${bookingId}`)
        .then(data => {
          if (data.booking) {
            // If duration matches a preset, use it; else set customDuration
            const preset = durations.find(d => d === data.booking.duration);
            setForm({
              placeType: data.booking.placeType,
              placeName: data.booking.placeName,
              date: data.booking.date?.slice(0, 10) || "",
              time: data.booking.time || "",
              strength: data.booking.strength,
              duration: preset ? preset : "custom",
              customDuration: preset ? "" : String(data.booking.duration),
              resources: data.booking.resources || [],
              comment: data.booking.comment || "",
            });
          }
        });
    }
  }, [bookingId]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    const { name, value, type } = e.target;
    if (type === "checkbox") {
      const checked = (e.target as HTMLInputElement).checked;
      setForm(f => ({
        ...f,
        resources: checked
          ? [...f.resources, value]
          : f.resources.filter(r => r !== value),
      }));
    } else if (type === "number") {
      setForm(f => ({ ...f, [name]: Number(value) }));
    } else {
      setForm(f => ({ ...f, [name]: value }));
    }
  };

  const validate = () => {
    if (!form.placeType || !form.placeName || !form.date || !form.time || !form.strength || !form.duration) {
      return "Please fill all required fields.";
    }
    if (form.duration === "custom" && (!form.customDuration || isNaN(Number(form.customDuration)) || Number(form.customDuration) <= 0)) {
      return "Please enter a valid custom duration in minutes.";
    }
    if (form.strength <= 0) return "Strength must be greater than 0.";
    return "";
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setSuccess("");
    const err = validate();
    if (err) {
      setError(err);
      return;
    }
    setLoading(true);
    // Calculate duration value for backend
    let durationValue = form.duration;
    if (form.duration === "custom") {
      durationValue = form.customDuration;
    }
    const payload = {
      coordinatorId: user.id,
      ...form,
      duration: durationValue,
    };
    const method = bookingId ? "PUT" : "POST";
    const url = bookingId ? `/api/bookings/${bookingId}` : "/api/bookings";
    const data = await apiFetch<any>(url, {
      method,
      body: JSON.stringify(payload),
    });
    setLoading(false);
    if (data.error) {
      setError(data.error);
      return;
    }
    setSuccess("Booking saved successfully!");
    // Update rewards progress
  apiFetch(`/api/rewards/progress?userId=${user.id}`);
    setTimeout(() => router.push("/booking-home"), 2000);
  };

  return (
    <div className="max-w-lg mx-auto bg-white rounded-xl shadow-lg border border-yellow-200 p-6 mt-6 relative">
      {/* Temple motif */}
      <Image src="/bg3.png" alt="motif" width={80} height={40} className="absolute top-2 right-2 opacity-20" />
      <h2 className="text-xl font-bold text-yellow-700 mb-4">Book a Congregation</h2>
      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label className="block text-yellow-700 font-semibold mb-1">Coordinator Name</label>
          <input type="text" value={user.name} readOnly className="w-full px-4 py-2 border rounded bg-yellow-50 text-yellow-900" />
        </div>
        <div>
          <label className="block text-yellow-700 font-semibold mb-1">Place Type</label>
          <select name="placeType" value={form.placeType} onChange={handleChange} className="w-full px-4 py-2 border rounded" required>
            {placeTypes.map(pt => <option key={pt} value={pt}>{pt}</option>)}
          </select>
        </div>
        <div>
          <label className="block text-yellow-700 font-semibold mb-1">Place Name</label>
          <input name="placeName" type="text" value={form.placeName} onChange={handleChange} className="w-full px-4 py-2 border rounded" required />
        </div>
        <div className="flex gap-2">
          <div className="flex-1">
            <label className="block text-yellow-700 font-semibold mb-1">Date</label>
            <input name="date" type="date" value={form.date} onChange={handleChange} className="w-full px-4 py-2 border rounded" required />
          </div>
          <div className="flex-1">
            <label className="block text-yellow-700 font-semibold mb-1">Time</label>
            <input name="time" type="time" value={form.time} onChange={handleChange} className="w-full px-4 py-2 border rounded" required />
          </div>
        </div>
        <div>
          <label className="block text-yellow-700 font-semibold mb-1">Strength</label>
          <input name="strength" type="number" min={1} value={form.strength} onChange={handleChange} className="w-full px-4 py-2 border rounded" required />
        </div>
        <div>
          <label className="block text-yellow-700 font-semibold mb-1">Duration</label>
          <select name="duration" value={form.duration} onChange={handleChange} className="w-full px-4 py-2 border rounded" required>
            {durations.map(d => <option key={d} value={d}>{d}</option>)}
          </select>
          {form.duration === "custom" && (
            <input
              type="number"
              name="customDuration"
              min={1}
              value={form.customDuration}
              onChange={handleChange}
              className="w-full mt-2 px-4 py-2 border rounded"
              placeholder="Enter duration in minutes"
              required
            />
          )}
        </div>
        <div>
          <label className="block text-yellow-700 font-semibold mb-1">Resources</label>
          <div className="flex flex-wrap gap-2">
            {resourcesList.map(r => (
              <label key={r} className="flex items-center gap-1 text-yellow-700">
                <input type="checkbox" name="resources" value={r} checked={form.resources.includes(r)} onChange={handleChange} /> {r}
              </label>
            ))}
          </div>
        </div>
        <div>
          <label className="block text-yellow-700 font-semibold mb-1"> Any additional resources</label>
          <textarea name="comment" value={form.comment} onChange={handleChange} className="w-full px-4 py-2 border rounded" rows={2} />
        </div>
        {error && <div className="text-red-600 text-sm">{error}</div>}
        {success && <div className="text-green-600 text-sm font-semibold">{success}</div>}
        <button type="submit" className="w-full py-2 bg-yellow-600 text-white rounded font-semibold hover:bg-yellow-700 transition" disabled={loading}>{loading ? (bookingId ? "Saving..." : "Booking...") : (bookingId ? "Save Changes" : "Book Congregation")}</button>
      </form>
    </div>
  );
}
