"use client";
import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';

export default function LoginPage() {
  const router = useRouter();

  // login state
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  // registration state (shown when temp password used)
  const [mode, setMode] = useState<'login' | 'register'>('login');
  const [regEmail, setRegEmail] = useState('');
  const [regName, setRegName] = useState('');
  const [regPhone, setRegPhone] = useState('');
  const [regPassword, setRegPassword] = useState('');
  const [regConfirm, setRegConfirm] = useState('');
  const [regStoreType, setRegStoreType] = useState<'VEC' | 'NORMAL' | ''>('');
  const [regUserType, setRegUserType] = useState('');
  const [regCaptainId, setRegCaptainId] = useState('');
  const [regQ1, setRegQ1] = useState<number | ''>('');
  const [regQ2, setRegQ2] = useState<number | ''>('');
  const [regA1, setRegA1] = useState('');
  const [regA2, setRegA2] = useState('');
  const [captains, setCaptains] = useState<any[]>([]);
  const [regError, setRegError] = useState('');
  const [pwHint, setPwHint] = useState('');

  // helpers
  function resetLoginError() { setError(''); }

  async function handleLogin(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);
    setError('');
    try {
      const res = await fetch('/api/ram/auth/login', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ email, password }) });
      const data = await res.json();
      if (res.ok && data.success) {
        router.push('/auth/ram/dashboard');
        return;
      }
      if (data.needsRegistration) {
        // show inline registration, with data from server (derive userType/storeType)
        setMode('register');
        setRegEmail(email);
        setRegUserType(data.userType || '');
  const st = data.prepopulated?.storeType || '';
  setRegStoreType(st || '');
        // load captains (for distributor case)
        try {
          const cres = await fetch('/api/ram/auth/captains');
          const cd = await cres.json();
          setCaptains(cd.captains || []);
        } catch (e) {
          // ignore
        }
        return;
      }
      if (data.error === 'not_registered') {
        setError('Email not registered. Ask BB leader for temp password.');
      } else if (data.error === 'invalid_credentials') {
        setError('Invalid credentials');
      } else {
        setError(data.error || 'Login failed');
      }
    } catch (err) {
      setError('Network error');
    } finally {
      setLoading(false);
    }
  }

  // auto-lock store type for owner roles
  useEffect(() => {
    if (regUserType === 'VEC_STORE_OWNER') setRegStoreType('VEC');
    else if (regUserType === 'STORE_OWNER') setRegStoreType('NORMAL');
  }, [regUserType]);

  // registration
  async function handleRegister(e: React.FormEvent) {
    e.preventDefault();
    setRegError('');
  // basic validation
  if (!regEmail || !regPassword || !regName) return setRegError('Please fill required fields');
  if (regPassword !== regConfirm) return setRegError('Passwords do not match');
  const pwValid = /(?=.{8,})(?=.*[a-z])(?=.*[A-Z])(?=.*\d)/.test(regPassword);
  if (!pwValid) return setRegError('Password must be 8+ chars, include upper & lower case letters and a number');
  // security questions required
  if (!regQ1 || !regQ2 || !regA1 || !regA2) return setRegError('Choose two security questions and provide answers');
  if (regQ1 === regQ2) return setRegError('Choose two different security questions');

    try {
      const payload = {
        email: regEmail,
        password: regPassword,
        name: regName,
        phone: regPhone,
        userType: regUserType,
        storeType: regStoreType || null,
        captainId: regCaptainId || null,
        securityQuestion1: regQ1,
        securityAnswer1: regA1,
        securityQuestion2: regQ2,
        securityAnswer2: regA2,
      };
      const res = await fetch('/api/ram/auth/register', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(payload) });
      const data = await res.json();
      if (res.ok && data.success) {
        // registration done - go back to login view and ask user to login with new password
        setMode('login');
        setEmail(regEmail);
        setPassword('');
        setRegPassword('');
        setRegConfirm('');
        setError('Registration completed. Please login with your new password.');
        return;
      }
      setRegError(data.error || 'Registration failed');
    } catch (err) {
      setRegError('Network error');
    }
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-yellow-100 via-pink-50 to-white p-4">
      <div className="max-w-md w-full bg-white rounded-2xl shadow-2xl p-8">
        {mode === 'login' ? (
          <>
            <h2 className="text-2xl font-bold text-pink-700 mb-4">Marathon Login</h2>
            <form onSubmit={handleLogin} className="grid gap-4">
              <input type="email" placeholder="Email" value={email} onChange={(e) => { setEmail(e.target.value); resetLoginError(); }} className="border px-3 py-2 rounded" required />
              <input type="password" placeholder="Password" value={password} onChange={(e) => { setPassword(e.target.value); resetLoginError(); }} className="border px-3 py-2 rounded" required />
              {error && <div className="text-sm text-red-600">{error}</div>}
              <div className="flex gap-2">
                <button type="submit" className="flex-1 px-4 py-2 rounded bg-pink-500 text-white font-semibold" disabled={loading}>{loading ? 'Signing in...' : 'Sign in'}</button>
                <button type="button" className="px-4 py-2 rounded bg-gray-100" onClick={() => router.push('/auth/ram/forgot-password')}>Forgot</button>
              </div>
            </form>
          </>
        ) : (
          <>
            <h2 className="text-2xl font-bold text-pink-700 mb-4">Complete Registration</h2>
            <div className="text-sm text-gray-600 mb-3">Registering as: <strong>{regUserType || 'N/A'}</strong></div>
            <form onSubmit={handleRegister} className="grid gap-3">
              <input value={regEmail} disabled className="border px-3 py-2 rounded bg-gray-100" />
              <input value={regName} onChange={(e)=>setRegName(e.target.value)} className="border px-3 py-2 rounded" placeholder="Name" required />
              <input value={regPhone} onChange={(e)=>setRegPhone(e.target.value)} className="border px-3 py-2 rounded" placeholder="Phone" />
              <input type="password" value={regPassword} onChange={(e)=>{ setRegPassword(e.target.value); const valid = /(?=.{8,})(?=.*[a-z])(?=.*[A-Z])(?=.*\d)/.test(e.target.value); setPwHint(valid ? 'Strong password' : 'Min 8 chars, include upper & lower case and a number'); }} className="border px-3 py-2 rounded" placeholder="Choose password" required />
              <input type="password" value={regConfirm} onChange={(e)=>setRegConfirm(e.target.value)} className="border px-3 py-2 rounded" placeholder="Confirm password" required />
              <div className="text-xs text-gray-500">{pwHint}</div>
              <div>
                <label className="block text-sm font-medium">Security question 1</label>
                <select value={regQ1 ?? ''} onChange={(e)=>setRegQ1(e.target.value ? Number(e.target.value) : '')} className="border px-3 py-2 rounded w-full">
                  <option value="">Choose a question</option>
                  <option value={1}>Which BG shloka you like read or hear most?</option>
                  <option value={2}>What is your favourite spiritual place you want to visit or visited?</option>
                  <option value={3}>Your first material school?</option>
                  <option value={4}>Who has given you BG book?</option>
                  <option value={5}>When you have read Ramayana last time?</option>
                </select>
                <input value={regA1} onChange={(e)=>setRegA1(e.target.value)} className="border px-3 py-2 rounded mt-2 w-full" placeholder="Answer" />
              </div>
              <div>
                <label className="block text-sm font-medium">Security question 2</label>
                <select value={regQ2 ?? ''} onChange={(e)=>setRegQ2(e.target.value ? Number(e.target.value) : '')} className="border px-3 py-2 rounded w-full">
                  <option value="">Choose a question</option>
                  <option value={1}>Which BG shloka you like read or hear most?</option>
                  <option value={2}>What is your favourite spiritual place you want to visit or visited?</option>
                  <option value={3}>Your first material school?</option>
                  <option value={4}>Who has given you BG book?</option>
                  <option value={5}>When you have read Ramayana last time?</option>
                </select>
                <input value={regA2} onChange={(e)=>setRegA2(e.target.value)} className="border px-3 py-2 rounded mt-2 w-full" placeholder="Answer" />
              </div>
              <div>
                <label className="block text-sm font-medium">Store Type</label>
                <select value={regStoreType} onChange={(e)=>setRegStoreType(e.target.value as any)} className="border px-3 py-2 rounded w-full" disabled={regUserType === 'STORE_OWNER' || regUserType === 'VEC_STORE_OWNER'}>
                  <option value="">Select</option>
                  <option value="VEC">VEC</option>
                  <option value="NORMAL">NORMAL</option>
                </select>
              </div>
              {regUserType === 'DISTRIBUTOR' && (
                <div>
                  <label className="block text-sm font-medium">Captain</label>
                  <select value={regCaptainId} onChange={(e)=>setRegCaptainId(e.target.value)} className="border px-3 py-2 rounded w-full">
                    <option value="">Select Captain</option>
                    {captains.map(c => <option key={c.id} value={c.id}>{c.name} ({c.storeType})</option>)}
                  </select>
                </div>
              )}
              {regError && <div className="text-sm text-red-600">{regError}</div>}
              <div className="flex gap-2">
                <button type="submit" className="flex-1 px-4 py-2 rounded bg-pink-500 text-white font-semibold">Complete registration</button>
                <button type="button" className="px-4 py-2 rounded bg-gray-100" onClick={() => { setMode('login'); setRegError(''); }}>Cancel</button>
              </div>
            </form>
          </>
        )}
      </div>
    </div>
  );
}
