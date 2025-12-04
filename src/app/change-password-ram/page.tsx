"use client";
import React, { Suspense } from "react";
import Image from "next/image";

function ChangePasswordForm() {
  const { useRouter, useSearchParams } = require("next/navigation");
  const router = useRouter();
  const searchParams = useSearchParams();
  const userId = searchParams.get("userId");
  const [oldPassword, setOldPassword] = React.useState("");
  const [newPassword, setNewPassword] = React.useState("");
  const [confirm, setConfirm] = React.useState("");
  const [error, setError] = React.useState("");
  const [success, setSuccess] = React.useState("");
  const [loading, setLoading] = React.useState(false);

  const handleChangePassword = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setSuccess("");
    if (newPassword !== confirm) {
      setError("Passwords do not match.");
      return;
    }
    setLoading(true);
    const res = await fetch("/api/auth1/change-password", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ userId, oldPassword, newPassword }),
    });
    const data = await res.json();
    setLoading(false);
    if (data.error) {
      setError(data.error);
      return;
    }
    setSuccess("Password changed successfully.");
    setTimeout(() => router.push("/recordings"), 2000);
  };

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-gradient-to-br from-yellow-100 to-orange-200">
      <div className="w-full max-w-sm p-6 bg-white rounded-xl shadow-lg border border-yellow-300">
        <div className="flex flex-col items-center mb-6">
          <Image src="/iskcon-logo.png" alt="ISKCON Logo" width={180} height={60} />
          <h2 className="text-xl font-bold text-yellow-700 mt-2">Change Password</h2>
        </div>
        <form onSubmit={handleChangePassword} className="space-y-4">
          <input type="password" className="w-full px-4 py-2 border rounded focus:outline-none focus:ring-2 focus:ring-yellow-400" placeholder="Old Password" value={oldPassword} onChange={e => setOldPassword(e.target.value)} required />
          <input type="password" className="w-full px-4 py-2 border rounded focus:outline-none focus:ring-2 focus:ring-yellow-400" placeholder="New Password" value={newPassword} onChange={e => setNewPassword(e.target.value)} required />
          <input type="password" className="w-full px-4 py-2 border rounded focus:outline-none focus:ring-2 focus:ring-yellow-400" placeholder="Confirm New Password" value={confirm} onChange={e => setConfirm(e.target.value)} required />
          {error && <div className="text-red-600 text-sm">{error}</div>}
          {success && <div className="text-green-600 text-sm font-semibold">{success}</div>}
          <button type="submit" className="w-full py-2 bg-yellow-600 text-white rounded font-semibold hover:bg-yellow-700 transition" disabled={loading}>{loading ? "Changing..." : "Change Password"}</button>
        </form>
      </div>
    </div>
  );
}

export default function ChangePasswordPage() {
  return (
    <Suspense fallback={<div className="min-h-screen flex items-center justify-center">Loading...</div>}>
      <ChangePasswordForm />
    </Suspense>
  );
}
