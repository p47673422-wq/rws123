"use client";

import React from "react";
import Link from "next/link";

export default function GiftPage() {
  return (
    <div className="min-h-screen bg-gradient-to-b from-amber-50 to-rose-50 py-12">
      <main className="max-w-4xl mx-auto bg-white/80 rounded-3xl p-8 shadow-xl">
        <header className="text-center">
          <h1 className="text-3xl md:text-4xl font-bold">Congratulations! You unlocked your gift 🎁</h1>
          <p className="mt-3 text-sm text-slate-800">
            By taking shelter of Lord Ram you’ve taken a step towards inner freedom. Below are offerings and ways to continue your spiritual practice.
          </p>
        </header>

        {/* Krishna Basket promotion - styled similar to homepage */}
        <section className="mt-8 grid md:grid-cols-2 gap-6 items-center">
          
          <div>
            <h2 className="text-2xl font-semibold">Krishna Basket — Special Dusshera Offer</h2>
            <p className="mt-2 text-sm text-slate-700">
              Explore devotional kitscarefully assembled to support your practice. Exclusive discounts for Divine Journey participants.
            </p>
            <div className="mt-4 flex gap-3">
              <a href="/#krishna-basket" className="px-4 py-2 rounded-lg bg-amber-400 text-slate-900 font-semibold">Go to Krishna Basket</a>
              <a href="/donate" className="px-4 py-2 rounded-lg bg-rose-500 text-white font-semibold">Donate</a>
            </div>
          </div>
        </section>

        <section className="mt-8 bg-white/60 p-6 rounded-xl border border-white/30">
          <h3 className="text-lg font-semibold">A quote by Srila Prabhupada</h3>
          <blockquote className="mt-3 text-sm text-slate-800 italic">
            “Krishna is very merciful to His sincere devotees, but also we have to remember that Maya is very strong. Therefore, we have to always be engaged in serving Krishna. At every moment we should be doing this or that service for Krishna's transcendental pleasure.”
          </blockquote>
        </section>

        <section className="mt-8 flex justify-between items-center">
          <div>
            <h4 className="text-base font-semibold">Free Counselling</h4>
            <p className="text-sm text-slate-700">If you’d like a personal counselling slot, click below to book.</p>
          </div>
          <Link href="/counselling" className="px-4 py-2 rounded-lg bg-indigo-600 text-white">Book Counselling</Link>
        </section>
      </main>
    </div>
  );
}
