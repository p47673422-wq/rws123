"use client";
import { useState } from "react";
import { isValidPhoneNumber } from "libphonenumber-js";

export default function ProfileForm({ initial, onSave, onCancel }: any) {
  const [name, setName] = useState(initial?.name || "");
  const [mobile, setMobile] = useState(initial?.mobile || "");
  const [gender, setGender] = useState(initial?.gender || "");
  const [marital, setMarital] = useState(initial?.marital || "");

  function isValidIndianMobile(mobile: string) {
    // Remove spaces, dashes, etc.
    const cleaned = mobile.replace(/\D/g, "");
    // Static check: 10 digits, starts with 6-9
    if (!/^([6-9][0-9]{9})$/.test(cleaned)) return false;
    // Library check (libphonenumber-js)
    try {
      return isValidPhoneNumber(cleaned, 'IN');
    } catch {
      return false;
    }
  }

  function save() {
    if (!name || !mobile) {
      alert("Name & mobile required.");
      return;
    }
    if (!isValidIndianMobile(mobile)) {
      alert("Invalid mobile number.");
      return;
    }
    const profile = {
      id: initial?.id || "u_" + Date.now(),
      name,
      mobile,
      gender,
      marital,
    };
    onSave(profile);
  }

  return (
    <div className="bg-white p-6 rounded-xl shadow max-w-md mx-auto">
      <h2 className="text-lg font-semibold">Your Details</h2>

      <div className="space-y-3 mt-4">
        <input
          className="border p-2 rounded w-full"
          value={name}
          onChange={(e) => setName(e.target.value)}
          placeholder="Full name"
        />
        <input
          className="border p-2 rounded w-full"
          value={mobile}
          onChange={(e) => setMobile(e.target.value)}
          placeholder="Mobile number"
          maxLength={10}
          pattern="[6-9]{1}[0-9]{9}"
          inputMode="numeric"
        />
        <select
          className="border p-2 rounded w-full"
          value={gender}
          onChange={(e) => setGender(e.target.value)}
        >
          <option value="">Gender</option>
          <option>Male</option>
          <option>Female</option>
        </select>
        <select
          className="border p-2 rounded w-full"
          value={marital}
          onChange={(e) => setMarital(e.target.value)}
        >
          <option value="">Marital Status</option>
          <option>Single</option>
          <option>Married</option>
        </select>
      </div>

      <div className="flex gap-3 mt-5">
        <button className="bg-amber-600 text-white px-4 py-2 rounded" onClick={save}>
          Save & Continue
        </button>
        <button className="px-4 py-2 border rounded" onClick={onCancel}>
          Cancel
        </button>
      </div>
    </div>
  );
}
