"use client";
import React, { useEffect, useMemo, useState } from 'react';
import { useRouter } from 'next/navigation';

export default function ChangePasswordPage() {
  const router = useRouter();
  const [loading, setLoading] = useState(true);
  const [user, setUser] = useState<any>(null);

  const [email, setEmail] = useState('');
  const [oldPassword, setOldPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirm, setConfirm] = useState('');
  const [busy, setBusy] = useState(false);
  const [toast, setToast] = useState<{ type: 'error' | 'success'; message: string } | null>(null);

  useEffect(() => {
    (async () => {
      try {
        const res = await fetch('/api/ram/auth/me');
        const j = await res.json();
        if (!res.ok || !j?.user) {
          router.replace('/auth/ram/login');
          return;
        }
        setUser(j.user);
        setEmail(j.user.email || '');
      } catch (e) {
        router.replace('/auth/ram/login');
      } finally {
        setLoading(false);
      }
    })();
  }, [router]);

  const strength = useMemo(() => {
    let s = 0;
    if (newPassword.length >= 8) s++;
    if (/[A-Z]/.test(newPassword)) s++;
    if (/[0-9]/.test(newPassword)) s++;
    if (/[^A-Za-z0-9]/.test(newPassword)) s++;
    return s;
  }, [newPassword]);

  function strengthLabel() {
    if (strength <= 1) return { label: 'Weak', color: 'bg-red-400' };
    if (strength === 2) return { label: 'Medium', color: 'bg-yellow-400' };
    return { label: 'Strong', color: 'bg-green-400' };
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setToast(null);
    if (!oldPassword) return setToast({ type: 'error', message: 'Please enter your old password.' });
    if (newPassword.length < 8) return setToast({ type: 'error', message: 'New password must be at least 8 characters.' });
    if (newPassword !== confirm) return setToast({ type: 'error', message: 'Passwords do not match.' });

    setBusy(true);
    try {
      const payload = { userId: user?.id, oldPassword, newPassword };
  const res = await fetch('/api/ram/auth/change-password', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(payload) });
      const j = await res.json();
      if (!res.ok) {
        // handle not found vs incorrect old password
        const message = j?.error || j?.message || 'Failed to change password.';
        return setToast({ type: 'error', message });
      }
      setToast({ type: 'success', message: j?.message || 'Password updated successfully. Redirecting…' });
      setTimeout(() => {
        // redirect to dashboard — try to pick a sensible landing
        router.push('/booking-home');
      }, 1200);
    } catch (err: any) {
      console.error(err);
      setToast({ type: 'error', message: 'Network error' });
    } finally {
      setBusy(false);
    }
  }

  if (loading) return <div className="min-h-screen flex items-center justify-center">Loading…</div>;

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-indigo-50 via-white to-pink-50 p-6">
      <div className="w-full max-w-lg bg-white/70 backdrop-blur rounded-xl shadow-md p-6">
        <h1 className="text-2xl font-semibold mb-4">Change Password</h1>
        {toast && (
          <div className={`p-3 rounded mb-4 ${toast.type === 'error' ? 'bg-red-100 text-red-800' : 'bg-green-100 text-green-800'}`}>{toast.message}</div>
        )}

        <form onSubmit={handleSubmit} className="space-y-4">
          <label className="block text-sm">Email</label>
          <input value={email} onChange={e=>setEmail(e.target.value)} className="w-full p-3 rounded border" disabled />

          <label className="block text-sm">Old password</label>
          <input type="password" value={oldPassword} onChange={e=>setOldPassword(e.target.value)} className="w-full p-3 rounded border" />

          <label className="block text-sm">New password</label>
          <input type="password" value={newPassword} onChange={e=>setNewPassword(e.target.value)} className="w-full p-3 rounded border" />
          <div className="flex items-center gap-3">
            <div className="w-48 h-3 bg-gray-200 rounded overflow-hidden">
              <div style={{ width: `${(strength/4)*100}%` }} className={`${strengthLabel().color} h-full`} />
            </div>
            <div className="text-sm text-gray-700">{strengthLabel().label}</div>
          </div>

          <label className="block text-sm">Confirm new password</label>
          <input type="password" value={confirm} onChange={e=>setConfirm(e.target.value)} className="w-full p-3 rounded border" />

          <div className="flex justify-between items-center">
            <button type="button" onClick={()=>router.back()} className="px-4 py-2 rounded border">Cancel</button>
            <button type="submit" disabled={busy} className="px-6 py-2 rounded bg-blue-600 text-white">{busy ? 'Saving…' : 'Update password'}</button>
          </div>
        </form>
      </div>
    </div>
  );
}
