"use client";
import React, { useState } from 'react';
import { Music } from 'lucide-react';
import { signIn } from 'next-auth/react';
import { useRouter } from 'next/navigation';

function hexFromRandomBytes(len = 32) {
  const arr = new Uint8Array(len);
  if (typeof window !== 'undefined' && window.crypto && window.crypto.getRandomValues) {
    window.crypto.getRandomValues(arr);
    return Array.from(arr).map(b => b.toString(16).padStart(2, '0')).join('');
  }
  // fallback
  let s = '';
  for (let i = 0; i < len; i++) s += Math.floor(Math.random() * 256).toString(16).padStart(2, '0');
  return s;
}

export default function RamLoginPage() {
  const router = useRouter();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [remember, setRemember] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const redirectByUserType = (userType: string | null) => {
    const t = String(userType || '').toUpperCase();
    if (t.includes('DISTRIBUTOR')) return '/distributor/dashboard';
    if (t.includes('CAPTAIN')) return '/captain/dashboard';
    if (t.includes('VEC') || t.includes('STORE_OWNER')) return '/store-owner/dashboard';
    return '/booking-home';
  };

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError(null);
    if (!email || !password) {
      setError('Please provide both email and password.');
      return;
    }
    setLoading(true);
    try {
      const res = await signIn('credentials', { redirect: false, email, password, rememberDevice: remember });
      // @ts-ignore
      if (res?.error) {
        setError(res.error || 'Invalid credentials');
        setLoading(false);
        return;
      }

      // fetch current user
      const me = await fetch('/api/ram/auth/me');
      const meJson = await me.json();
      if (!meJson?.ok) {
        setError('Login succeeded but failed to fetch user info.');
        setLoading(false);
        return;
      }
      const user = meJson.user;

      // If remember checked, generate token and call API to persist (server will hash and set cookie)
      if (remember) {
        const token = hexFromRandomBytes(32);
        const expiry = Date.now() + 30 * 60 * 1000; // 30 minutes per spec
        await fetch('/api/ram/auth/remember-set', {
          method: 'POST', headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ email: user.email, token, expiry })
        });
      }

      // handle redirect flows
      if (meJson.user?.isFirstLogin) {
        router.push('/auth/ram/setup');
      } else {
        const dest = redirectByUserType(meJson.user?.role || meJson.user?.userType || null);
        router.push(dest);
      }
    } catch (err: any) {
      console.error(err);
      setError(err?.message || 'Network error');
    } finally { setLoading(false); }
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-orange-50 via-blue-50 to-pink-50 p-4">
      <div className="max-w-md w-full backdrop-blur-lg bg-white/30 rounded-2xl shadow-2xl p-6">
        <div className="flex flex-col items-center gap-3 mb-4">
          <div className="p-4 rounded-full bg-white/40 shadow-inner">
            <Music className="text-[#0B5FFF]" size={36} />
          </div>
          <h1 className="text-2xl font-bold text-[#0B5FFF]">Hare Krishna — Login</h1>
          <p className="text-sm text-gray-700">Welcome to My Krishna Touch — Book Marathon</p>
        </div>

        <form onSubmit={handleSubmit} className="flex flex-col gap-3">
          <label className="text-sm font-medium">Email</label>
          <input type="email" value={email} onChange={e=>setEmail(e.target.value)} className="w-full p-3 rounded-lg border border-white/50 focus:outline-none focus:ring-2 focus:ring-orange-300" placeholder="you@example.com" />

          <label className="text-sm font-medium">Password</label>
          <div className="relative">
            <input type={showPassword ? 'text' : 'password'} value={password} onChange={e=>setPassword(e.target.value)} className="w-full p-3 pr-14 rounded-lg border border-white/50 focus:outline-none focus:ring-2 focus:ring-orange-300" placeholder="Enter your password" />
            <button type="button" onClick={()=>setShowPassword(s=>!s)} className="absolute right-2 top-1/2 -translate-y-1/2 text-sm text-gray-600 px-3 py-1 rounded">{showPassword ? 'Hide' : 'Show'}</button>
          </div>

          <label className="flex items-center gap-2 text-sm">
            <input type="checkbox" checked={remember} onChange={e=>setRemember(e.target.checked)} className="w-4 h-4" />
            <span>Remember me on this device for 30 minutes</span>
          </label>

          {error && (
            <div className="text-red-700 bg-red-100 p-2 rounded transition-all">{error}</div>
          )}

          <button type="submit" disabled={loading} className="w-full py-3 rounded-xl text-white font-semibold bg-gradient-to-r from-orange-500 to-pink-500 flex items-center justify-center gap-3">
            {loading && <svg className="animate-spin h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24"><circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle><path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8H4z"></path></svg>}
            <span>{loading ? 'Signing in...' : 'Login'}</span>
          </button>

          <div className="flex justify-between text-sm text-blue-700 mt-2">
            <a href="#" onClick={(e)=>{ e.preventDefault(); router.push('/auth/ram/forgot-password'); }}>Forgot Password?</a>
            <a href="#" onClick={(e)=>{ e.preventDefault(); router.push('/auth/ram/change-password'); }}>Change Password</a>
          </div>
        </form>
      </div>
    </div>
  );
}
