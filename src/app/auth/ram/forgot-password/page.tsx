"use client";
import React, { useState } from 'react';
import { useRouter } from 'next/navigation';

const QUESTIONS = [
  'Which BG shloka you like read or hear most?',
  'What is your favourite spiritual place you want to visit or visited?',
  'Your first material school?',
  'Who has given you BG book?',
  'When you have read Ramayana last time?'
];

export default function ForgotPage(){
  const router = useRouter();
  const [step, setStep] = useState<'verify' | 'reset'>('verify');

  // verification fields
  const [email, setEmail] = useState('');
  const [q1, setQ1] = useState<number | null>(null);
  const [a1, setA1] = useState('');
  const [q2, setQ2] = useState<number | null>(null);
  const [a2, setA2] = useState('');
  const [error, setError] = useState('');

  // reset fields
  const [newPw, setNewPw] = useState('');
  const [confirmPw, setConfirmPw] = useState('');
  const [pwHint, setPwHint] = useState('');

  async function verify(){
    setError('');
    // basic validation
    if (!email) return setError('Enter email');
    if (!q1 || !q2 || !a1 || !a2) return setError('Choose two questions and provide answers');
    if (q1 === q2) return setError('Choose two different questions');

    const res = await fetch('/api/ram/auth/forgot/verify', { method: 'POST', headers: {'Content-Type':'application/json'}, body: JSON.stringify({ email, securityQuestion1: q1, securityAnswer1: a1, securityQuestion2: q2, securityAnswer2: a2 }) });
    const data = await res.json();
    if (res.ok && data.verified) {
      setStep('reset');
      // clear any previous pw
      setNewPw('');
      setConfirmPw('');
      setPwHint('');
    } else {
      setError(data.error || 'Verification failed');
    }
  }

  async function resetPassword(){
    setError('');
    if (!newPw || !confirmPw) return setError('Please enter new password and confirm');
    if (newPw !== confirmPw) return setError('Passwords do not match');
    const pwValid = /(?=.{8,})(?=.*[a-z])(?=.*[A-Z])(?=.*\d)/.test(newPw);
    if (!pwValid) return setError('Password must be 8+ chars, include upper & lower case letters and a number');

    const res = await fetch('/api/ram/auth/forgot/reset', { method: 'POST', headers: {'Content-Type':'application/json'}, body: JSON.stringify({ email, newPassword: newPw }) });
    const data = await res.json();
    if (res.ok && data.success) router.push('/auth/ram/login');
    else setError(data.error || 'Reset failed');
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-yellow-100 via-pink-50 to-white p-4">
      <div className="max-w-md w-full bg-white rounded-2xl shadow-2xl p-8">
        {step === 'verify' ? (
          <>
            <h2 className="text-2xl font-bold text-pink-700 mb-4">Forgot password</h2>
            <div className="grid gap-3">
              <input value={email} onChange={(e)=>setEmail(e.target.value)} className="border px-3 py-2 rounded" placeholder="Email" />
              <select value={q1 ?? ''} onChange={(e)=>setQ1(Number(e.target.value))} className="border px-3 py-2 rounded">
                <option value="">Choose question 1</option>
                {QUESTIONS.map((q,i)=> <option key={i} value={i+1}>{q}</option>)}
              </select>
              <input value={a1} onChange={(e)=>setA1(e.target.value)} className="border px-3 py-2 rounded" placeholder="Answer 1" />
              <select value={q2 ?? ''} onChange={(e)=>setQ2(Number(e.target.value))} className="border px-3 py-2 rounded">
                <option value="">Choose question 2</option>
                {QUESTIONS.map((q,i)=> <option key={i} value={i+1}>{q}</option>)}
              </select>
              <input value={a2} onChange={(e)=>setA2(e.target.value)} className="border px-3 py-2 rounded" placeholder="Answer 2" />
              {error && <div className="text-sm text-red-600">{error}</div>}
              <div className="flex gap-2">
                <button className="flex-1 px-4 py-2 rounded bg-pink-500 text-white" onClick={verify}>Verify</button>
                <button className="px-4 py-2 rounded bg-gray-100" onClick={()=>router.push('/auth/ram/login')}>Cancel</button>
              </div>
            </div>
          </>
        ) : (
          <>
            <h2 className="text-2xl font-bold text-pink-700 mb-4">Reset password</h2>
            <div className="grid gap-3">
              <input value={email} disabled className="border px-3 py-2 rounded bg-gray-100" />
              <input value={newPw} onChange={(e)=>{ setNewPw(e.target.value); const valid = /(?=.{8,})(?=.*[a-z])(?=.*[A-Z])(?=.*\d)/.test(e.target.value); setPwHint(valid ? 'Strong password' : 'Min 8 chars, include upper & lower case and a number'); }} placeholder="New password" className="border px-3 py-2 rounded" type="password" />
              <input value={confirmPw} onChange={(e)=>setConfirmPw(e.target.value)} placeholder="Confirm password" className="border px-3 py-2 rounded" type="password" />
              <div className="text-xs text-gray-500">{pwHint}</div>
              {error && <div className="text-sm text-red-600">{error}</div>}
              <div className="flex gap-2">
                <button className="flex-1 px-4 py-2 rounded bg-pink-500 text-white" onClick={resetPassword}>Set password</button>
                <button className="px-4 py-2 rounded bg-gray-100" onClick={()=>{ setStep('verify'); setError(''); }}>Back</button>
              </div>
            </div>
          </>
        )}
      </div>
    </div>
  );
}
