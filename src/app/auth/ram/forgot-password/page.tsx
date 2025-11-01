"use client";
import React, { useMemo, useState } from 'react';
import { useRouter } from 'next/navigation';
import { motion } from 'framer-motion';

const strengthScore = (pw: string) => {
  let s = 0;
  if (pw.length >= 8) s++;
  if (/[A-Z]/.test(pw)) s++;
  if (/[0-9]/.test(pw)) s++;
  if (/[^A-Za-z0-9]/.test(pw)) s++;
  return s; // 0..4
};

export default function ForgotPasswordPage() {
  const router = useRouter();
  const [step, setStep] = useState(1);

  const [email, setEmail] = useState('');
  const [notFound, setNotFound] = useState<string | null>(null);

  const [questions, setQuestions] = useState<Array<{ idx: number; text: string }>>([]);
  const [answers, setAnswers] = useState<Record<number, string>>({});

  const [password, setPassword] = useState('');
  const [confirm, setConfirm] = useState('');

  const [busy, setBusy] = useState(false);
  const [toast, setToast] = useState<{ type: 'error' | 'success'; message: string } | null>(null);

  const strength = useMemo(() => strengthScore(password), [password]);

  async function verifyEmail() {
    setBusy(true); setToast(null); setNotFound(null);
    try {
      const res = await fetch('/api/ram/auth/forgot-start', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ email }) });
      const j = await res.json();
      if (!res.ok) {
        if (j?.code === 'NOT_FOUND') {
          setNotFound("Account doesn't exist. Please use your temp password to create an account.");
        } else {
          setToast({ type: 'error', message: j?.message || 'Failed to verify email' });
        }
        return;
      }
      // expected response: { ok: true, questions: [{idx,text}, ...] }
      if (Array.isArray(j?.questions)) {
        setQuestions(j.questions);
        setStep(2);
      } else {
        setToast({ type: 'error', message: 'No security questions found for this account.' });
      }
    } catch (err: any) {
      console.error(err);
      setToast({ type: 'error', message: 'Network error' });
    } finally { setBusy(false); }
  }

  async function verifyAnswers() {
    setBusy(true); setToast(null);
    try {
      const payload = { email, answers: Object.entries(answers).map(([k,v])=>({ idx: Number(k), answer: v.trim() })) };
      const res = await fetch('/api/ram/auth/forgot-verify', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(payload) });
      const j = await res.json();
      if (!res.ok) {
        setToast({ type: 'error', message: j?.message || 'Answers did not match' });
        return;
      }
      // proceed to reset password
      setStep(3);
    } catch (err: any) {
      console.error(err);
      setToast({ type: 'error', message: 'Network error' });
    } finally { setBusy(false); }
  }

  async function submitNewPassword(e?: React.FormEvent) {
    e?.preventDefault();
    setToast(null);
    if (password.length < 8) return setToast({ type: 'error', message: 'Password must be at least 8 characters.' });
    if (password !== confirm) return setToast({ type: 'error', message: 'Passwords do not match.' });
    setBusy(true);
    try {
      const res = await fetch('/api/ram/auth/forgot-reset', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ email, password }) });
      const j = await res.json();
      if (!res.ok) {
        setToast({ type: 'error', message: j?.message || 'Failed to reset password' });
        return;
      }
  setToast({ type: 'success', message: 'Password updated. Redirecting to login…' });
  setTimeout(()=>router.push('/auth/ram/login?reset=success'), 1200);
    } catch (err: any) {
      console.error(err);
      setToast({ type: 'error', message: 'Network error' });
    } finally { setBusy(false); }
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-sky-50 to-pink-50 p-6">
      <div className="relative w-full max-w-2xl">
        {/* decorative peacock feather */}
        <div className="absolute -top-6 -right-6 opacity-80 pointer-events-none">
          <svg width="140" height="140" viewBox="0 0 100 100" className="transform rotate-12">
            <defs>
              <linearGradient id="g1" x1="0%" x2="100%" y1="0%" y2="100%">
                <stop offset="0%" stopColor="#0b5fff" />
                <stop offset="100%" stopColor="#00c389" />
              </linearGradient>
            </defs>
            <path d="M50 10 C70 10,85 30,50 65 C15 30,30 10,50 10 Z" fill="url(#g1)" opacity="0.95" />
            <circle cx="50" cy="40" r="8" fill="#ffd700" />
          </svg>
        </div>

        <motion.div initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} className="bg-white/80 backdrop-blur-md rounded-xl shadow-lg p-6">
          <h2 className="text-lg font-semibold mb-2">Forgot password</h2>
          <p className="text-sm text-gray-600 mb-4">Recover your account using your security questions.</p>

          {toast && <div className={`p-3 rounded mb-4 ${toast.type==='error' ? 'bg-red-100 text-red-800':'bg-green-100 text-green-800'}`}>{toast.message}</div>}

          {step === 1 && (
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="space-y-4">
              <label className="block text-sm">Email</label>
              <input className="w-full p-3 rounded border" value={email} onChange={e=>setEmail(e.target.value)} placeholder="you@example.com" />
              {notFound && <div className="text-sm text-red-700">{notFound}</div>}
              <div className="flex justify-end gap-2">
                <button className="px-4 py-2 rounded border" onClick={()=>router.push('/auth/ram/login')}>Back</button>
                <button className="px-4 py-2 rounded bg-blue-600 text-white" onClick={verifyEmail} disabled={busy || !email}>Verify</button>
              </div>
            </motion.div>
          )}

          {step === 2 && (
            <motion.div initial={{ x: 10, opacity: 0 }} animate={{ x: 0, opacity: 1 }} className="space-y-4">
              <div className="text-sm font-medium">Answer your security questions</div>
              {questions.map((q) => (
                <div key={q.idx} className="p-3 border rounded">
                  <div className="text-sm mb-2">{q.text}</div>
                  <input className="w-full p-2 rounded border" value={answers[q.idx] || ''} onChange={e=>setAnswers(a=>({ ...a, [q.idx]: e.target.value }))} />
                </div>
              ))}
              <div className="flex justify-end gap-2">
                <button className="px-4 py-2 rounded border" onClick={()=>setStep(1)}>Back</button>
                <button className="px-4 py-2 rounded bg-blue-600 text-white" onClick={verifyAnswers} disabled={busy}>Continue</button>
              </div>
            </motion.div>
          )}

          {step === 3 && (
            <motion.form initial={{ y: 8, opacity: 0 }} animate={{ y: 0, opacity: 1 }} onSubmit={submitNewPassword} className="space-y-4">
              <div className="text-sm">Create a new password</div>
              <input type="password" className="w-full p-3 rounded border" placeholder="New password" value={password} onChange={e=>setPassword(e.target.value)} />
              <div className="flex items-center gap-3">
                <div className="w-48 h-3 bg-gray-200 rounded overflow-hidden">
                  <div style={{ width: `${(strength/4)*100}%` }} className={`${strength<=1 ? 'bg-red-400': strength===2 ? 'bg-yellow-400':'bg-green-400'} h-full`} />
                </div>
                <div className="text-sm text-gray-700">{strength<=1 ? 'Weak' : strength===2 ? 'Medium' : 'Strong'}</div>
              </div>
              <input type="password" className="w-full p-3 rounded border" placeholder="Confirm password" value={confirm} onChange={e=>setConfirm(e.target.value)} />
              <div className="flex justify-end gap-2">
                <button type="button" className="px-4 py-2 rounded border" onClick={()=>setStep(2)}>Back</button>
                <button type="submit" className="px-4 py-2 rounded bg-green-600 text-white" disabled={busy}>Set password</button>
              </div>
            </motion.form>
          )}
        </motion.div>
      </div>
    </div>
  );
}
