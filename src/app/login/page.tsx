"use client";
import React, { useState } from "react";
import { useRouter } from "next/navigation";
import Image from "next/image";

export default function LoginPage() {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError("");
    const res = await fetch("/api/auth/login", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ email, password }),
    });
    const data = await res.json();
    setLoading(false);
    if (data.error) {
      setError(data.error);
      return;
    }
    if (data.requireChangePassword) {
      router.push("/change-password?userId=" + data.userId);
      return;
    }
    // Session is set via httpOnly cookie by backend
    router.push("/booking-home");
  };

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-gradient-to-br from-yellow-100 to-orange-200">
      <div className="w-full max-w-sm p-6 bg-white rounded-xl shadow-lg border border-yellow-300">
        <div className="flex flex-col items-center mb-6">
          <Image src="/iskcon-logo.png" alt="ISKCON Logo" width={180} height={60} />
          <h2 className="text-xl font-bold text-yellow-700 mt-2">Login to Congregation Portal</h2>
        </div>
        <form onSubmit={handleLogin} className="space-y-4">
          <input type="email" className="w-full px-4 py-2 border rounded focus:outline-none focus:ring-2 focus:ring-yellow-400" placeholder="Email" value={email} onChange={e => setEmail(e.target.value)} required />
          <input type="password" className="w-full px-4 py-2 border rounded focus:outline-none focus:ring-2 focus:ring-yellow-400" placeholder="Password" value={password} onChange={e => setPassword(e.target.value)} required />
          {error && <div className="text-red-600 text-sm">{error}</div>}
          <button type="submit" className="w-full py-2 bg-yellow-600 text-white rounded font-semibold hover:bg-yellow-700 transition" disabled={loading}>{loading ? "Logging in..." : "Login"}</button>
        </form>
        <div className="mt-4 text-center">
          <a href="/signup" className="text-yellow-700 hover:underline">Don't have an account? Sign up</a>
        </div>
      </div>
    </div>
  );
}
