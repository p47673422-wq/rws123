"use client";
import React, { useState, useEffect } from "react";
import "../../../home-custom.css";
import "../../../../../globals.css";
import { isValidPhoneNumber } from "libphonenumber-js";

export default function CartSummaryPage() {
  const [cart, setCart] = useState<{ id: number; title: string; price: number; qty: number }[]>([]);
  const [userInfo, setUserInfo] = useState({ name: "", mobile: "", gender: "", address: "" });
  const [step, setStep] = useState<'userinfo' | 'summary' | 'placed'>("userinfo");
  const [error, setError] = useState("");

  useEffect(() => {
    // Load cart from localStorage or global state if needed
    const storedCart = localStorage.getItem("cart");
    if (storedCart) setCart(JSON.parse(storedCart));
    // Try to get user info from localStorage
    const storedUser = localStorage.getItem("userInfo1");
    if (storedUser) setUserInfo(JSON.parse(storedUser));
    else setStep("userinfo");
  }, []);

  function handleUserInfoChange(e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) {
    setUserInfo({ ...userInfo, [e.target.name]: e.target.value });
  }

  function handleUserInfoSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    if (!userInfo.name || !userInfo.mobile || !userInfo.gender || !userInfo.address) {
      setError("Please fill all details.");
      return;
    }
    setError("");
    localStorage.setItem("userInfo1", JSON.stringify(userInfo));
    setStep("summary");
  }

  const total = cart.reduce((sum, item) => sum + item.price * item.qty, 0);

  async function handlePlaceOrder() {
    // Make API call to backend
    try {
      const res = await fetch("/api/purchase/checkout", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ user: userInfo, items: cart, total }),
      });
      if (res.ok) {
        localStorage.removeItem("cart");
        localStorage.removeItem("userInfo");
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
    <div className="content-overlay min-h-screen flex flex-col items-center justify-center bg-gradient-to-br from-yellow-50 to-yellow-200">
      <div className="max-w-xl w-full bg-white/80 rounded-2xl shadow-2xl p-8 mt-10 mb-10">
        <h2 className="fancyTitle text-yellow-700 mb-6 text-center">Cart Summary</h2>
        {step === "userinfo" && (
          <form className="flex flex-col gap-4 items-center" onSubmit={handleUserInfoSubmit}>
            <input className="input-fancy" name="name" type="text" placeholder="Your Name" value={userInfo.name} onChange={handleUserInfoChange} />
            <input className="input-fancy" name="mobile" type="tel" placeholder="Mobile Number" value={userInfo.mobile} onChange={handleUserInfoChange} />
            <select className="input-fancy" name="gender" value={userInfo.gender} onChange={handleUserInfoChange}>
              <option value="">Select Gender</option>
              <option value="Male">Male</option>
              <option value="Female">Female</option>
              <option value="Other">Other</option>
            </select>
            <input className="input-fancy" name="address" type="text" placeholder="Address" value={userInfo.address} onChange={handleUserInfoChange} />
            {error && <div className="text-red-500 text-sm">{error}</div>}
            <button className="fancy-btn px-6 py-2 rounded-full bg-yellow-500 text-white font-bold shadow hover:bg-yellow-600" type="submit">Continue to Summary</button>
          </form>
        )}
        {step === "summary" && (
          <>
            <div className="mb-6">
              <h3 className="font-bold text-lg text-yellow-700 mb-2">Your Details</h3>
              <div className="bg-yellow-50 rounded p-4 mb-2">
                <div><span className="font-bold">Name:</span> {userInfo.name}</div>
                <div><span className="font-bold">Mobile:</span> {userInfo.mobile}</div>
                <div><span className="font-bold">Gender:</span> {userInfo.gender}</div>
                <div><span className="font-bold">Address:</span> {userInfo.address}</div>
              </div>
            </div>
            <div className="mb-6">
              <h3 className="font-bold text-lg text-yellow-700 mb-2">Cart Items</h3>
              {cart.length === 0 ? (
                <div className="text-gray-500">Your cart is empty.</div>
              ) : (
                <div className="space-y-3">
                  {cart.map(item => (
                    <div key={item.id} className="flex items-center gap-3 bg-yellow-100 rounded p-2">
                      <span className="font-bold text-yellow-800 flex-1">{item.title}</span>
                      <span className="text-yellow-700 font-bold">Qty: {item.qty}</span>
                      <span className="text-yellow-700 font-bold">₹{item.price * item.qty}</span>
                    </div>
                  ))}
                  <div className="flex justify-end font-bold text-yellow-800 text-lg mt-2">Total: ₹{total}</div>
                </div>
              )}
            </div>
            <button className="fancy-btn bg-green-500 text-white px-6 py-2 rounded-full font-bold shadow hover:bg-green-600 transition mt-4" onClick={handlePlaceOrder}>Confirm & Place Order</button>
            {error && <div className="text-red-500 text-sm mt-2">{error}</div>}
          </>
        )}
        {step === "placed" && (
          <div className="text-center text-green-700 font-bold text-lg mt-6">Order placed successfully! Thank you for your purchase.</div>
        )}
      </div>
    </div>
  );
}
