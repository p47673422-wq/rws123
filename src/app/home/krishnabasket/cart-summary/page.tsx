"use client";
import React, { useState, useEffect } from "react";
import { isValidPhoneNumber } from "libphonenumber-js";
import "../../home-custom.css";
import "../../../../globals.css";
import { FaHome } from "react-icons/fa";
import Link from "next/link";


export default function CartSummaryPage() {
  const [cart, setCart] = useState<{ id: number; title: string; price: number; qty: number }[]>([]);
  const [userInfo, setUserInfo] = useState({ name: "", mobile: "", gender: "", address: "" });
  const [step, setStep] = useState<'userinfo' | 'summary' | 'placed'>("userinfo");
  const [error, setError] = useState("");

  useEffect(() => {
    const storedCart = localStorage.getItem("cart");
    if (storedCart) setCart(JSON.parse(storedCart));
    const storedUser = localStorage.getItem("userInfo1");
    if (storedUser) setUserInfo(JSON.parse(storedUser));
    else setStep("userinfo");
  }, []);

  function handleUserInfoChange(e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) {
    setUserInfo({ ...userInfo, [e.target.name]: e.target.value });
  }

  function isValidIndianMobile(mobile: string) {
    // Remove spaces, dashes, etc.
    const cleaned = mobile.replace(/\D/g, "");
    // Static check: 10 digits, starts with 6-9
    if (!/^([6-9][0-9]{9})$/.test(cleaned)) return false;
    // Library check (libphonenumber-js)
    try {
      return isValidPhoneNumber(cleaned, 'IN');
    } catch {
      return false;
    }
  }

  function handleUserInfoSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    if (!userInfo.name || !userInfo.mobile || !userInfo.gender || !userInfo.address) {
      setError("Please fill all details.");
      return;
    }
    if (!isValidIndianMobile(userInfo.mobile)) {
      setError("Please enter a valid mobile number.");
      return;
    }
    setError("");
    localStorage.setItem("userInfo1", JSON.stringify(userInfo));
    setStep("summary");
  }

  const total = cart.reduce((sum, item) => sum + item.price * item.qty, 0);

  async function handlePlaceOrder() {
    try {
      const res = await fetch("/api/purchase/checkout", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ user: userInfo, items: cart, total }),
      });
      if (res.ok) {
        localStorage.removeItem("cart");
        setCart([]);
        setStep("placed");
      } else {
        setError("Failed to place order.");
      }
    } catch (err) {
      setError("Error: " + err);
    }
  }

  return (
    <div className="min-h-screen bg-black text-yellow-100 flex flex-col items-center justify-center py-8 px-2">
      <div className="w-full max-w-2xl bg-gradient-to-br from-zinc-900 to-black rounded-2xl shadow-2xl p-6 md:p-10 mt-6 mb-10 border border-yellow-700/40 relative">
        {/* ISKCON Branding */}
        <div className="flex flex-col items-center mb-6">
          <img src="/iskcon-logo.png" alt="ISKCON Logo" className="h-16 mb-2" style={{ filter: 'drop-shadow(0 0 8px #ffe066)' }} />
          <h1 className="text-2xl md:text-3xl font-extrabold text-yellow-300 tracking-wide mb-1 text-center">Welcome to ISKCON</h1>
          <div className="text-yellow-400 text-lg font-semibold mb-2 text-center">Cart Summary</div>
        </div>

        {step === "userinfo" && (
          <form className="flex flex-col gap-4 items-center" onSubmit={handleUserInfoSubmit}>
            <input className="input-fancy bg-zinc-800 text-yellow-100 border-yellow-600 placeholder-yellow-400" name="name" type="text" placeholder="Your Name" value={userInfo.name} onChange={handleUserInfoChange} />
            <input
              className="input-fancy bg-zinc-800 text-yellow-100 border-yellow-600 placeholder-yellow-400"
              name="mobile"
              type="tel"
              placeholder="Mobile Number"
              value={userInfo.mobile}
              onChange={handleUserInfoChange}
              title="Enter a valid mobile number"
              maxLength={10}
              pattern="[6-9]{1}[0-9]{9}"
              inputMode="numeric"
            />
            <select className="input-fancy bg-zinc-800 text-yellow-100 border-yellow-600" name="gender" value={userInfo.gender} onChange={handleUserInfoChange}>
              <option value="">Select Gender</option>
              <option value="Male">Male</option>
              <option value="Female">Female</option>
            </select>
            <input className="input-fancy bg-zinc-800 text-yellow-100 border-yellow-600 placeholder-yellow-400" name="address" type="text" placeholder="Address" value={userInfo.address} onChange={handleUserInfoChange} />
            {error && <div className="text-red-400 text-sm">{error}</div>}
            <button className="fancy-btn px-6 py-2 rounded-full bg-yellow-500 text-black font-bold shadow hover:bg-yellow-400 transition" type="submit">Continue to Summary</button>
          </form>
        )}

        {step === "summary" && (
          <>
            <div className="mb-6">
              <Link href="/home" className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-yellow-800/80 text-yellow-100 font-bold shadow hover:bg-yellow-700/90 transition mb-3">
                <FaHome className="text-yellow-300" /> Home
              </Link>
              <h3 className="font-bold text-lg text-yellow-300 mb-2 mt-4">Your Details</h3>
              <div className="bg-zinc-800/80 rounded-xl p-4 mb-2 border border-yellow-700/30">
                <div><span className="font-bold text-yellow-400">Name:</span> {userInfo.name}</div>
                <div><span className="font-bold text-yellow-400">Mobile:</span> {userInfo.mobile}</div>
                <div><span className="font-bold text-yellow-400">Gender:</span> {userInfo.gender}</div>
                <div><span className="font-bold text-yellow-400">Address:</span> {userInfo.address}</div>
              </div>
            </div>
            <div className="mb-6">
              <h3 className="font-bold text-lg text-yellow-300 mb-2">Cart Items</h3>
              {cart.length === 0 ? (
                <div className="text-yellow-500">Your cart is empty.</div>
              ) : (
                <div className="grid gap-3">
                  {cart.map(item => (
                    <div key={item.id} className="flex items-center gap-3 bg-gradient-to-r from-yellow-900/60 to-yellow-800/40 rounded-xl p-3 border border-yellow-700/30 shadow">
                      <span className="font-bold text-yellow-200 flex-1">{item.title}</span>
                      <span className="text-yellow-400 font-bold">Qty: {item.qty}</span>
                      <span className="text-yellow-300 font-bold">₹{item.price * item.qty}</span>
                    </div>
                  ))}
                  <div className="flex justify-end font-bold text-yellow-200 text-lg mt-2">Total: ₹{total}</div>
                </div>
              )}
            </div>
            <button className="fancy-btn bg-green-500 text-black px-6 py-2 rounded-full font-bold shadow hover:bg-green-400 transition mt-4" onClick={handlePlaceOrder}>Confirm & Place Order</button>
            {error && <div className="text-red-400 text-sm mt-2">{error}</div>}
          </>
        )}

        {step === "placed" && (
          <div className="text-center text-green-400 font-bold text-lg mt-6">Order placed successfully! Thank you for your purchase.</div>
        )}

      </div>
    </div>
  );
}
