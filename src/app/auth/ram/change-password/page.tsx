"use client";
import React, { useState } from 'react';
import { useRouter } from 'next/navigation';

export default function ChangePassword(){
  const router = useRouter();
  const [email, setEmail] = useState('');
  const [oldPw, setOldPw] = useState('');
  const [newPw, setNewPw] = useState('');
  const [confirmPw, setConfirmPw] = useState('');
  const [error, setError] = useState('');
  const [pwHint, setPwHint] = useState('');

  async function submit(){
    setError('');
    if (!email || !oldPw || !newPw) return setError('Please fill required fields');
    if (newPw !== confirmPw) return setError('Passwords do not match');
    const pwValid = /(?=.{8,})(?=.*[a-z])(?=.*[A-Z])(?=.*\d)/.test(newPw);
    if (!pwValid) return setError('Password must be 8+ chars, include upper & lower case letters and a number');

    const res = await fetch('/api/ram/auth/change-password', { method: 'POST', headers: {'Content-Type':'application/json'}, body: JSON.stringify({ email, oldPassword: oldPw, newPassword: newPw }) });
    const data = await res.json();
    if (res.ok && data.success) router.push('/auth/ram/login');
    else setError(data.error || 'Failed');
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-yellow-100 via-pink-50 to-white p-4">
      <div className="max-w-md w-full bg-white rounded-2xl shadow-2xl p-8">
        <h2 className="text-2xl font-bold text-pink-700 mb-4">Change password</h2>
        <div className="grid gap-3">
          <input value={email} onChange={(e)=>setEmail(e.target.value)} className="border px-3 py-2 rounded" placeholder="Email" />
          <input value={oldPw} onChange={(e)=>setOldPw(e.target.value)} className="border px-3 py-2 rounded" placeholder="Old password" type="password" />
          <input value={newPw} onChange={(e)=>{ setNewPw(e.target.value); const valid = /(?=.{8,})(?=.*[a-z])(?=.*[A-Z])(?=.*\d)/.test(e.target.value); setPwHint(valid ? 'Strong password' : 'Min 8 chars, include upper & lower case and a number'); }} className="border px-3 py-2 rounded" placeholder="New password" type="password" />
          <input value={confirmPw} onChange={(e)=>setConfirmPw(e.target.value)} className="border px-3 py-2 rounded" placeholder="Confirm new password" type="password" />
          <div className="text-xs text-gray-500">{pwHint}</div>
          {error && <div className="text-sm text-red-600">{error}</div>}
          <div className="flex gap-2">
            <button className="flex-1 px-4 py-2 rounded bg-pink-500 text-white" onClick={submit}>Change</button>
            <button className="px-4 py-2 rounded bg-gray-100" onClick={()=>router.push('/auth/ram/login')}>Cancel</button>
          </div>
        </div>
      </div>
    </div>
  );
}
