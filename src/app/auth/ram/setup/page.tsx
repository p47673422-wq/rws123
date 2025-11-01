"use client";
import React, { useEffect, useMemo, useState } from 'react';
import { useRouter } from 'next/navigation';

type UserMe = {
  email?: string;
  name?: string;
  phone?: string;
  isFirstLogin?: boolean;
  tempPasswordType?: string | null; // optional hint about which temp pw was used
  role?: string | null;
};

const QUESTIONS = [
  "Which Krishna pastime inspires you most?",
  "Name of your first distributed book",
  "Your spiritual guide's name",
  "City where you serve",
];

export default function SetupPage() {
  const router = useRouter();
  const [loading, setLoading] = useState(true);
  const [user, setUser] = useState<UserMe | null>(null);
  const [step, setStep] = useState(1);

  // Step 1 fields
  const [name, setName] = useState('');
  const [phone, setPhone] = useState('');
  const [email, setEmail] = useState('');

  // Step 2 security questions
  const [selectedQuestions, setSelectedQuestions] = useState<number[]>([]);
  const [answers, setAnswers] = useState<Record<number, string>>({});

  // Step 3 conditional
  const [captains, setCaptains] = useState<Array<{ id: string; name: string }>>([]);
  const [captainId, setCaptainId] = useState<string | null>(null);
  const [storeType, setStoreType] = useState<'VEC' | 'NORMAL' | ''>('');

  // Step 4 password
  const [password, setPassword] = useState('');
  const [confirm, setConfirm] = useState('');
  const [submitting, setSubmitting] = useState(false);

  const [toast, setToast] = useState<{ type: 'success' | 'error'; message: string } | null>(null);

  useEffect(() => {
    // fetch current user to ensure this is first-login
    (async () => {
      try {
        const res = await fetch('/api/ram/auth/me');
        const j = await res.json();
        if (!j?.ok || !j.user) {
          router.replace('/auth/ram/login');
          return;
        }
        const u = j.user as UserMe;
        if (!u.isFirstLogin) {
          router.replace('/auth/ram/login');
          return;
        }
        setUser(u);
        setName(u.name || '');
        setPhone((u as any).phone || '');
        setEmail(u.email || '');

        // if temp password type exists, store as hint
        // fetch captains only if distributor will be shown
        if ((u as any).tempPasswordType === 'TEMP_DISTRIBUTOR' || (u as any).tempPasswordType === 'DISTRIBUTOR') {
          fetchCaptains();
        }
      } catch (e) {
        router.replace('/auth/ram/login');
      } finally {
        setLoading(false);
      }
    })();
  }, [router]);

  async function fetchCaptains() {
    try {
      const r = await fetch('/api/captains');
      if (!r.ok) return;
      const j = await r.json();
      if (Array.isArray(j)) setCaptains(j.map((c: any) => ({ id: c.id, name: c.name })));
    } catch (e) {
      // ignore
    }
  }

  function toggleQuestion(idx: number) {
    setSelectedQuestions(prev => {
      const found = prev.includes(idx);
      if (found) return prev.filter(i => i !== idx);
      // allow at most 2
      if (prev.length >= 2) return prev;
      return [...prev, idx];
    });
  }

  const strength = useMemo(() => {
    let score = 0;
    if (password.length >= 8) score++;
    if (/[A-Z]/.test(password)) score++;
    if (/[0-9]/.test(password)) score++;
    if (/[^A-Za-z0-9]/.test(password)) score++;
    return score; // 0..4
  }, [password]);

  function strengthLabel() {
    if (strength <= 1) return { label: 'Weak', color: 'bg-red-400' };
    if (strength === 2) return { label: 'Medium', color: 'bg-yellow-400' };
    return { label: 'Strong', color: 'bg-green-400' };
  }

  function validateStep(): string | true {
    if (step === 1) {
      if (!name.trim()) return 'Please provide your name.';
      if (!phone.trim()) return 'Please provide your phone number.';
      if (!email.trim()) return 'Email missing.';
      return true;
    }
    if (step === 2) {
      if (selectedQuestions.length !== 2) return 'Please select exactly 2 security questions.';
      for (const idx of selectedQuestions) {
        if (!answers[idx] || !answers[idx].trim()) return 'Please answer the selected questions.';
      }
      return true;
    }
    if (step === 3) {
      // If distributor, captain must be selected
      if ((user as any)?.tempPasswordType === 'TEMP_DISTRIBUTOR' || (user as any)?.tempPasswordType === 'DISTRIBUTOR') {
        if (!captainId) return 'Please select a captain.';
        if (!storeType) return 'Please pick a store type.';
      }
      if ((user as any)?.tempPasswordType === 'TEMP_CAPTAIN' || (user as any)?.tempPasswordType === 'CAPTAIN') {
        if (!storeType) return 'Please pick a store type.';
      }
      return true;
    }
    if (step === 4) {
      if (password.length < 8) return 'Password must be at least 8 characters.';
      if (!/[A-Z]/.test(password)) return 'Password must contain an uppercase letter.';
      if (!/[a-z]/.test(password)) return 'Password must contain a lowercase letter.';
      if (!/[0-9]/.test(password)) return 'Password must contain a number.';
      if (!/[^A-Za-z0-9]/.test(password)) return 'Password must contain a special character.';
      if (password !== confirm) return 'Passwords do not match.';
      return true;
    }
    return true;
  }

  async function onNext() {
    const v = validateStep();
    if (v !== true) {
      setToast({ type: 'error', message: String(v) });
      return;
    }
    setToast(null);
    setStep(s => Math.min(4, s + 1));
  }

  function onPrev() {
    setToast(null);
    setStep(s => Math.max(1, s - 1));
  }

  async function onSubmit(e?: React.FormEvent) {
    e?.preventDefault();
    const v = validateStep();
    if (v !== true) {
      setToast({ type: 'error', message: String(v) });
      return;
    }
    setSubmitting(true);
    try {
      const payload = {
        name: name.trim(),
        phone: phone.trim(),
        email: email.trim(),
        security: selectedQuestions.map(idx => ({ questionIdx: idx, question: QUESTIONS[idx], answer: (answers[idx] || '').trim() })),
        captainId: captainId || null,
        storeType: storeType || null,
        password,
      };

      const res = await fetch('/api/ram/auth/setup', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(payload) });
      const j = await res.json();
      if (!res.ok) {
        setToast({ type: 'error', message: j?.message || 'Failed to complete setup' });
        setSubmitting(false);
        return;
      }
  setToast({ type: 'success', message: 'Account setup complete. Please login.' });
  // small delay then redirect
  setTimeout(() => router.push('/auth/ram/login?setup=success'), 1200);
    } catch (err: any) {
      console.error(err);
      setToast({ type: 'error', message: err?.message || 'Network error' });
    } finally {
      setSubmitting(false);
    }
  }

  if (loading) return <div className="min-h-screen flex items-center justify-center">Loading…</div>;

  return (
    <div className="min-h-screen bg-gradient-to-br from-orange-50 via-white to-pink-50 p-6 flex items-center justify-center">
      <div className="w-full max-w-3xl bg-white/60 backdrop-blur-md rounded-2xl shadow-xl p-6">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-xl font-semibold">Complete your account setup</h2>
          <div className="text-sm text-gray-600">Step {step}/4</div>
        </div>

        {toast && (
          <div className={`p-3 rounded mb-4 ${toast.type === 'error' ? 'bg-red-100 text-red-800' : 'bg-green-100 text-green-800'}`}>
            {toast.message}
          </div>
        )}

        <form onSubmit={onSubmit} className="space-y-6">
          {step === 1 && (
            <div className="space-y-4">
              <label className="block">
                <div className="text-sm font-medium">Full name</div>
                <input value={name} onChange={e=>setName(e.target.value)} className="w-full p-3 rounded border" />
              </label>
              <label className="block">
                <div className="text-sm font-medium">Phone</div>
                <input value={phone} onChange={e=>setPhone(e.target.value)} className="w-full p-3 rounded border" />
              </label>
              <label className="block">
                <div className="text-sm font-medium">Email</div>
                <input value={email} onChange={e=>setEmail(e.target.value)} className="w-full p-3 rounded border" />
              </label>
            </div>
          )}

          {step === 2 && (
            <div className="space-y-4">
              <div className="text-sm font-medium">Choose exactly two security questions</div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                {QUESTIONS.map((q, i) => (
                  <button type="button" key={i} onClick={()=>toggleQuestion(i)} className={`p-4 text-left rounded border ${selectedQuestions.includes(i) ? 'border-orange-400 bg-orange-50' : 'bg-white'}`}>
                    <div className="flex items-center justify-between">
                      <div>{q}</div>
                      <input type="checkbox" readOnly checked={selectedQuestions.includes(i)} className="ml-2" />
                    </div>
                    {selectedQuestions.includes(i) && (
                      <div className="mt-3">
                        <input placeholder="Your answer" value={answers[i] || ''} onChange={e=>setAnswers(a=>({ ...a, [i]: e.target.value }))} className="w-full p-2 rounded border" />
                      </div>
                    )}
                  </button>
                ))}
              </div>
            </div>
          )}

          {step === 3 && (
            <div className="space-y-4">
              <div className="text-sm font-medium">Distributor / Captain details</div>
              {((user as any)?.tempPasswordType === 'TEMP_DISTRIBUTOR' || (user as any)?.tempPasswordType === 'DISTRIBUTOR') && (
                <div className="space-y-3">
                  <label className="block text-sm">Select Captain</label>
                  <select value={captainId || ''} onChange={e=>setCaptainId(e.target.value || null)} className="w-full p-3 rounded border">
                    <option value="">-- Select captain --</option>
                    {captains.map(c=> <option key={c.id} value={c.id}>{c.name}</option>)}
                  </select>
                </div>
              )}

              {(((user as any)?.tempPasswordType === 'TEMP_DISTRIBUTOR') || ((user as any)?.tempPasswordType === 'TEMP_CAPTAIN') || ((user as any)?.tempPasswordType === 'DISTRIBUTOR') || ((user as any)?.tempPasswordType === 'CAPTAIN')) && (
                <div>
                  <div className="text-sm mb-2">Store Type</div>
                  <label className="inline-flex items-center gap-2 mr-4"><input type="radio" name="storeType" checked={storeType==='VEC'} onChange={()=>setStoreType('VEC')} /> VEC</label>
                  <label className="inline-flex items-center gap-2"><input type="radio" name="storeType" checked={storeType==='NORMAL'} onChange={()=>setStoreType('NORMAL')} /> NORMAL</label>
                </div>
              )}

              {(!((user as any)?.tempPasswordType)) && (
                <div className="text-sm text-gray-600">No additional store/captain fields required for your account.</div>
              )}
            </div>
          )}

          {step === 4 && (
            <div className="space-y-4">
              <label className="block">
                <div className="text-sm font-medium">Create password</div>
                <input type="password" value={password} onChange={e=>setPassword(e.target.value)} className="w-full p-3 rounded border" />
              </label>
              <div className="flex items-center gap-3">
                <div className="w-48 h-3 bg-gray-200 rounded overflow-hidden">
                  <div style={{ width: `${(strength/4)*100}%` }} className={`${strengthLabel().color} h-full`} />
                </div>
                <div className="text-sm text-gray-700">{strengthLabel().label}</div>
              </div>
              <label className="block">
                <div className="text-sm font-medium">Confirm password</div>
                <input type="password" value={confirm} onChange={e=>setConfirm(e.target.value)} className="w-full p-3 rounded border" />
              </label>
            </div>
          )}

          <div className="flex items-center justify-between">
            <div>
              {step > 1 && <button type="button" onClick={onPrev} className="px-4 py-2 rounded border">Previous</button>}
            </div>
            <div className="flex items-center gap-3">
              {step < 4 && <button type="button" onClick={onNext} className="px-6 py-2 rounded bg-orange-500 text-white">Next</button>}
              {step === 4 && <button type="submit" disabled={submitting} className="px-6 py-2 rounded bg-green-600 text-white">{submitting ? 'Saving…' : 'Finish & Save'}</button>}
            </div>
          </div>
        </form>
      </div>
    </div>
  );
}
