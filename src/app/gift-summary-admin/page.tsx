"use client";
import React, { useState } from "react";
import "../home/home-custom.css";
import "../../globals.css";

export default function GiftSummaryAdminPage() {
  const [mobile, setMobile] = useState("");
  const [error, setError] = useState("");
  const [summary, setSummary] = useState<any>(null);
  const [loading, setLoading] = useState(false);

  // Basic Auth State
  const [auth, setAuth] = useState({ user: "", pass: "" });
  const [isAuthed, setIsAuthed] = useState(false);
  const [authError, setAuthError] = useState("");

  // Change to your desired credentials
  const ADMIN_USER = "admin";
  const ADMIN_PASS = "iskcon20251608";

  function handleAuthSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (auth.user === ADMIN_USER && auth.pass === ADMIN_PASS) {
      setIsAuthed(true);
      setAuthError("");
    } else {
      setAuthError("Invalid credentials");
    }
  }

  async function handleSearch(e: React.FormEvent) {
    e.preventDefault();
    setError("");
    setSummary(null);
    if (!mobile.match(/^[6-9][0-9]{9}$/)) {
      setError("Enter valid Indian mobile number");
      return;
    }
    setLoading(true);
    try {
  const res = await fetch(`/api/gift-summary-open-orders?mobile=${mobile}`);
      if (!res.ok) throw new Error("Not found or error fetching");
      const data = await res.json();
      setSummary(data);
    } catch (err) {
      setError("No data found or error fetching details");
    }
    setLoading(false);
  }

  if (!isAuthed) {
    return (
      <div className="min-h-screen bg-black flex flex-col items-center justify-center">
        <form className="bg-zinc-900 p-8 rounded-xl shadow-xl flex flex-col gap-4 w-full max-w-xs" onSubmit={handleAuthSubmit}>
          <h2 className="text-yellow-300 text-xl font-bold text-center mb-2">Admin Login</h2>
          <input className="input-fancy bg-zinc-800 text-yellow-100 border-yellow-600" type="text" placeholder="Username" value={auth.user} onChange={e => setAuth({ ...auth, user: e.target.value })} />
          <input className="input-fancy bg-zinc-800 text-yellow-100 border-yellow-600" type="password" placeholder="Password" value={auth.pass} onChange={e => setAuth({ ...auth, pass: e.target.value })} />
          {authError && <div className="text-red-400 text-sm text-center">{authError}</div>}
          <button className="fancy-btn bg-yellow-500 text-black font-bold rounded-full px-6 py-2 mt-2" type="submit">Login</button>
        </form>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-black text-yellow-100 flex flex-col items-center py-8 px-2">
      <div className="w-full max-w-2xl bg-gradient-to-br from-zinc-900 to-black rounded-2xl shadow-2xl p-6 md:p-10 mt-6 mb-10 border border-yellow-700/40 relative">
        <div className="flex flex-col items-center mb-6">
          <img src="/iskcon-logo.png" alt="ISKCON Logo" className="h-16 mb-2" style={{ filter: 'drop-shadow(0 0 8px #ffe066)' }} />
          <h1 className="text-2xl md:text-3xl font-extrabold text-yellow-300 tracking-wide mb-1 text-center">ISKCON Admin Gift Summary</h1>
          <div className="text-yellow-400 text-lg font-semibold mb-2 text-center">Search by Mobile</div>
        </div>
        <form className="flex flex-col md:flex-row gap-4 items-center mb-6" onSubmit={handleSearch}>
          <input
            className="input-fancy bg-zinc-800 text-yellow-100 border-yellow-600 placeholder-yellow-400"
            type="tel"
            placeholder="Enter Mobile Number"
            value={mobile}
            onChange={e => setMobile(e.target.value)}
            maxLength={10}
            pattern="[6-9]{1}[0-9]{9}"
            title="Enter a valid 10-digit Indian mobile number starting with 6-9"
            inputMode="numeric"
          />
          <button className="fancy-btn bg-yellow-500 text-black font-bold rounded-full px-6 py-2" type="submit" disabled={loading}>{loading ? "Searching..." : "Search"}</button>
        </form>
        {error && <div className="text-red-400 text-sm mb-4 text-center">{error}</div>}
        {summary && (
          <div className="bg-zinc-800/80 rounded-xl p-4 border border-yellow-700/30 mt-4">
            {/* Krishna Basket Items (Orders) */}
            <h3 className="text-yellow-300 text-lg font-bold mb-2">Krishna Basket Items</h3>
            {summary.cartItems?.length === 0 ? (
              <div className="text-yellow-500 mb-4">No items added to cart.</div>
            ) : (
              (() => {
                // Group items by orderId
                const grouped: { [orderId: string]: any[] } = {};
                summary.cartItems.forEach((item: any) => {
                  if (!item.orderId) return;
                  if (!grouped[item.orderId]) grouped[item.orderId] = [];
                  grouped[item.orderId].push(item);
                });
                return (
                  <ul className="mb-4">
                    {Object.entries(grouped).map(([orderId, items]: [string, any[]], idx) => (
                      <li key={orderId} className="mb-4 border-b border-yellow-700 pb-2">
                        <div className="font-bold text-yellow-400 mb-1">Order #{orderId}</div>
                        <ul>
                          {items.map((item, i) => (
                            <li key={i} className="flex gap-3 items-center mb-1">
                              <span className="font-bold text-yellow-200">{item.title}</span>
                              <span className="text-yellow-400">x{item.qty}</span>
                              <span className="text-yellow-300">₹{item.price * item.qty}</span>
                            </li>
                          ))}
                        </ul>
                        {(() => {
                          const [delivered, setDelivered] = React.useState(false);
                          if (delivered) {
                            return <span className="text-green-400 font-bold mt-2 block">Order marked as delivered!</span>;
                          }
                          return (
                            <button
                              className="mt-2 px-3 py-1 rounded bg-green-600 text-white font-bold hover:bg-green-500 transition text-sm"
                              onClick={async () => {
                                try {
                                  const res = await fetch('/api/order-delivery', {
                                    method: 'POST',
                                    headers: { 'Content-Type': 'application/json' },
                                    body: JSON.stringify({ orderId })
                                  });
                                  if (res.ok) {
                                    setDelivered(true);
                                  } else {
                                    alert('Failed to update order status.');
                                  }
                                } catch {
                                  alert('Error updating order status.');
                                }
                              }}
                            >Mark Delivered</button>
                          );
                        })()}
                      </li>
                    ))}
                  </ul>
                );
              })()
            )}

            {/* Bhagavad Gita Registration */}
            <h3 className="text-yellow-300 text-lg font-bold mb-2">Bhagavad Gita Registration</h3>
            {summary.gitaRegs?.length === 0 ? (
              <span className="text-red-400 mb-4 block">Not Registered</span>
            ) : (
              <span className="text-green-400 mb-4 block">Registered ({summary.gitaRegs.map((r: any) => r.language).join(", ")})</span>
            )}

            {/* Quiz Progress & Scores */}
            <h3 className="text-yellow-300 text-lg font-bold mb-2">Quiz Progress & Scores</h3>
            {summary.progresses?.length === 0 ? (
              <div className="text-yellow-500 mb-4">No quiz progress found.</div>
            ) : (
              <div className="quiz-section-list">
                  {/* 8P Section */}
                  <div className="quiz-section mb-4">
                    <div className="quiz-section-title text-yellow-400 text-lg font-bold mb-2 border-b border-yellow-400">8P Quiz</div>
                    <ul className="gift-summary-list">
                      {summary.quiz.filter((q: any) => q.title.startsWith('P')).map((q:any, idx:number) => {
                        const attempt = summary.attempts.find((a: any) => a.quizId === q.id);
    const progress = summary.progresses.find((p: any) => p.pName.toLowerCase() === q.type.toLowerCase());
                        return (
                          <li key={q.id} className="gift-summary-list-item flex gap-3 items-center">
                            <span className="gift-summary-item-title font-bold text-yellow-200">{q.title}</span>
                            <span className="gift-summary-item-score text-yellow-300">Score: <span className="font-bold">{attempt ? attempt.score : "-"}</span></span>
                            <span className="gift-summary-item-status text-yellow-400">
                              {progress ? (progress.completed ? "Completed" : "In Progress") : ""}
                            </span>
                          </li>
                        );
                      })}
                    </ul>
                  </div>
                  {/* Mahaavtar Section */}
                  <div className="quiz-section mb-4">
                    <div className="quiz-section-title text-blue-400 text-lg font-bold mb-2 border-b border-blue-400">Mahaavtar Quiz</div>
                    <ul className="gift-summary-list">
                      {summary.quiz.filter((q: any) => q.title.startsWith('M')).map((q:any, idx:number) => {
                        const attempt = summary.attempts.find((a: any) => a.quizId === q.id);
    const progress = summary.progresses.find((p: any) => p.pName.toLowerCase() === q.type.toLowerCase());
                        return (
                          <li key={q.id} className="gift-summary-list-item flex gap-3 items-center">
                            <span className="gift-summary-item-title font-bold text-yellow-200">{q.title}</span>
                            <span className="gift-summary-item-score text-yellow-300">Score: <span className="font-bold">{attempt ? attempt.score : "-"}</span></span>
                            <span className="gift-summary-item-status text-yellow-400">
                              {progress ? (progress.completed ? "Completed" : "In Progress") : ""}
                            </span>
                          </li>
                        );
                      })}
                    </ul>
                  </div>
                  {/* Shloak Section */}
                  <div className="quiz-section mb-4">
                    <div className="quiz-section-title text-green-400 text-lg font-bold mb-2 border-b border-green-400">Shloak Quiz</div>
                    <ul className="gift-summary-list">
                      {summary.quiz.filter((q: any) => !q.title.startsWith('P') && !q.title.startsWith('M')).map((q:any, idx:number) => {
                        const attempt = summary.attempts.find((a: any) => a.quizId === q.id);
    const progress = summary.progresses.find((p: any) => p.pName.toLowerCase() === q.type.toLowerCase());
                        return (
                          <li key={q.id} className="gift-summary-list-item flex gap-3 items-center">
                            <span className="gift-summary-item-title font-bold text-yellow-200">{q.title}</span>
                            <span className="gift-summary-item-score text-yellow-300">Score: <span className="font-bold">{attempt ? attempt.score : "-"}</span></span>
                            <span className="gift-summary-item-status text-yellow-400">
                              {progress ? (progress.completed ? "Completed" : "In Progress") : ""}
                            </span>
                          </li>
                        );
                      })}
                    </ul>
                  </div>
                </div>



            )}

          </div>
        )}
      </div>
    </div>
  );
}
