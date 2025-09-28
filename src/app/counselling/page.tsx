"use client";
import { useState } from "react";

// Placeholder function
function saveCounsellingSlot(details: any) {
  // Simulate API call
  console.log("Counselling slot saved:", details);
}

export default function CounsellingPage() {
  const [form, setForm] = useState({
    name: "",
    mobile: "",
    gender: "",
    maritalStatus: "",
    date: "",
    time: "",
  });
  const [submitted, setSubmitted] = useState(false);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    saveCounsellingSlot(form);
    setSubmitted(true);
  };

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-gradient-to-b from-green-100 via-yellow-50 to-pink-100 py-12 px-4">
      <div className="bg-white rounded-xl shadow-lg border-2 border-green-200 max-w-md w-full p-8">
        <h1 className="text-2xl md:text-3xl font-bold text-green-700 mb-6 text-center">Free Counselling</h1>
        {!submitted ? (
          <form className="space-y-4" onSubmit={handleSubmit}>
            <input
              type="text"
              name="name"
              placeholder="Name"
              className="w-full border rounded px-3 py-2"
              value={form.name}
              onChange={handleChange}
              required
            />
            <input
              type="text"
              name="mobile"
              placeholder="Mobile Number"
              className="w-full border rounded px-3 py-2"
              value={form.mobile}
              onChange={handleChange}
              required
            />
            <select
              name="gender"
              className="w-full border rounded px-3 py-2"
              value={form.gender}
              onChange={handleChange}
              required
            >
              <option value="">Select Gender</option>
              <option value="Male">Male</option>
              <option value="Female">Female</option>
              <option value="Other">Other</option>
            </select>
            <select
              name="maritalStatus"
              className="w-full border rounded px-3 py-2"
              value={form.maritalStatus}
              onChange={handleChange}
              required
            >
              <option value="">Marital Status</option>
              <option value="Single">Single</option>
              <option value="Married">Married</option>
              <option value="Other">Other</option>
            </select>
            <input
              type="date"
              name="date"
              className="w-full border rounded px-3 py-2"
              value={form.date}
              onChange={handleChange}
              required
            />
            <input
              type="time"
              name="time"
              className="w-full border rounded px-3 py-2"
              value={form.time}
              onChange={handleChange}
              required
            />
            <button
              type="submit"
              className="w-full bg-green-500 text-white py-2 rounded font-bold mt-2 hover:bg-green-600"
            >
              Book Counselling Slot
            </button>
          </form>
        ) : (
          <div className="text-center py-8">
            <h2 className="text-xl font-bold text-pink-700 mb-4">Thank you!</h2>
            <p className="text-green-700">Your counselling slot has been booked. We will contact you soon.</p>
          </div>
        )}
      </div>
    </div>
  );
}
