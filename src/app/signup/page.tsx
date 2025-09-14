"use client";
import React, { useState } from "react";
import { useRouter } from "next/navigation";
import Image from "next/image";

export default function SignupPage() {
  const router = useRouter();
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [type, setType] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSignup = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError("");
    setSuccess("");
    const res = await fetch("/api/auth/signup", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ name, email, type, password }),
    });
    const data = await res.json();
    setLoading(false);
    if (data.error) {
      setError(data.error);
      return;
    }
    setSuccess("Signup successful. Please login and change password.");
    setTimeout(() => router.push("/login"), 2000);
  };

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-gradient-to-br from-yellow-100 to-orange-200">
      <div className="w-full max-w-sm p-6 bg-white rounded-xl shadow-lg border border-yellow-300">
        <div className="flex flex-col items-center mb-6">
          <Image src="/iskcon-logo.png" alt="ISKCON Logo" width={180} height={60} />
          <h2 className="text-xl font-bold text-yellow-700 mt-2">Sign Up for Congregation Portal</h2>
        </div>
        <form onSubmit={handleSignup} className="space-y-4">
          <input type="text" className="w-full px-4 py-2 border rounded focus:outline-none focus:ring-2 focus:ring-yellow-400" placeholder="Name" value={name} onChange={e => setName(e.target.value)} required />
          <input type="email" className="w-full px-4 py-2 border rounded focus:outline-none focus:ring-2 focus:ring-yellow-400" placeholder="Email" value={email} onChange={e => setEmail(e.target.value)} required />
          <input type="text" className="w-full px-4 py-2 border rounded focus:outline-none focus:ring-2 focus:ring-yellow-400" placeholder="Coordinator Type" value={type} onChange={e => setType(e.target.value)} required />
          <input type="password" className="w-full px-4 py-2 border rounded focus:outline-none focus:ring-2 focus:ring-yellow-400" placeholder="Temp Password" value={password} onChange={e => setPassword(e.target.value)} required />
          {error && <div className="text-red-600 text-sm">{error}</div>}
          {success && <div className="text-green-600 text-sm font-semibold">{success}</div>}
          <button type="submit" className="w-full py-2 bg-yellow-600 text-white rounded font-semibold hover:bg-yellow-700 transition" disabled={loading}>{loading ? "Signing up..." : "Sign Up"}</button>
        </form>
        <div className="mt-4 text-center">
          <a href="/login" className="text-yellow-700 hover:underline">Already have an account? Login</a>
        </div>
      </div>
    </div>
  );
}
