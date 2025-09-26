"use client";
import React from "react";
import Link from "next/link";
import GlowingButton from "../../components/GlowingButton";

export default function DamodaraMalaPage() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-yellow-50 via-blue-50 to-pink-50 flex flex-col">
      {/* Top Section */}
      <section className="w-full py-10 px-4 flex flex-col items-center justify-center bg-gradient-to-r from-yellow-100 via-pink-50 to-white">
        <h1 className="text-4xl md:text-5xl font-extrabold text-pink-700 mb-2 drop-shadow-lg">🌼 Dāmodara Mālā🌼</h1>
        <h1 className="text-4xl md:text-5xl font-extrabold text-pink-700 mb-2 drop-shadow-lg">🌼 Kartik Month Vrata 🌼</h1>
        <p className="text-lg md:text-xl text-blue-700 mb-4 font-semibold">From Oct 8 to Nov 5</p>
        <p className="text-lg md:text-xl text-blue-700 mb-4 font-semibold">Registration closes Oct 8</p>
        <a href="https://rzp.io/rzp/c11BnYk" target="_blank">
          <GlowingButton className="mb-4 text-lg">Register Now</GlowingButton>
        </a>
      </section>
      {/* Section 1: Program Overview */}
      <section className="max-w-5xl mx-auto w-full py-8 px-4 grid grid-cols-1 md:grid-cols-3 gap-6">
        {/* Card 1 */}
        <div className="bg-yellow-100 rounded-xl shadow-lg p-6 flex flex-col items-center hover:scale-105 transition border border-yellow-200">
          <span className="text-3xl mb-2">🟨</span>
          <h2 className="font-bold text-xl text-yellow-700 mb-1">Śraddhāvān</h2>
          <p className="text-gray-700 text-center mb-4">Beginners – Simple daily practices and easy entry.</p>
          <a href="https://rzp.io/rzp/c11BnYk" target="_blank">
          <GlowingButton className="w-full">Register at this Level</GlowingButton></a>
        </div>
        {/* Card 2 */}
        <div className="bg-blue-100 rounded-xl shadow-lg p-6 flex flex-col items-center hover:scale-105 transition border border-blue-200">
          <span className="text-3xl mb-2">🟦</span>
          <h2 className="font-bold text-xl text-blue-700 mb-1">Vardhamān</h2>
          <p className="text-gray-700 text-center mb-4">Practitioners – Intermediate standards, more sadhana.</p>
          <a href="https://rzp.io/rzp/c11BnYk" target="_blank">
          <GlowingButton className="w-full">Register at this Level</GlowingButton></a>
        </div>
        {/* Card 3 */}
        <div className="bg-green-100 rounded-xl shadow-lg p-6 flex flex-col items-center hover:scale-105 transition border border-green-200">
          <span className="text-3xl mb-2">🟩</span>
          <h2 className="font-bold text-xl text-green-700 mb-1">Niṣṭhāvān</h2>
          <p className="text-gray-700 text-center mb-4">Regulars – Advanced standards and full sadhana.</p>
          <a href="https://rzp.io/rzp/c11BnYk" target="_blank">
            <GlowingButton className="w-full">Register at this Level</GlowingButton>
          </a>
        </div>
      </section>
      {/* Section 2: Standards Table */}
      <section className="max-w-5xl mx-auto w-full py-8 px-4">
        <h2 className="text-2xl font-bold text-pink-700 mb-4">Standards Information</h2>
        <div className="overflow-x-auto">
          <table className="min-w-full rounded-xl overflow-hidden shadow border border-pink-100">
            <thead>
              <tr>
                <th className="bg-yellow-100 text-yellow-700 px-4 py-2">Śraddhāvān</th>
                <th className="bg-blue-100 text-blue-700 px-4 py-2">Vardhamān</th>
                <th className="bg-green-100 text-green-700 px-4 py-2">Niṣṭhāvān</th>
              </tr>
            </thead>
            <tbody>
              <tr className="hover:bg-yellow-50">
                <td className="px-4 py-2">Rise max by 5AM</td>
                <td className="px-4 py-2">Rise max by 5AM</td>
                <td className="px-4 py-2">Ready by 4:30AM</td>
              </tr>
              <tr className="hover:bg-blue-50">
                <td className="px-4 py-2">Formal dress code(for men, if possible Dhoti Kurta)</td>
                <td className="px-4 py-2">Formal dress code(for men, if possible Dhoti Kurta)</td>
                <td className="px-4 py-2">Formal dress code(for men, if possible Dhoti Kurta)</td>
              </tr>
              <tr className="hover:bg-green-50">
                <td className="px-4 py-2">4 regs</td>
                <td className="px-4 py-2">4 regs, No Onion-Garlic, No Tea-Coffe</td>
                <td className="px-4 py-2">4 regs, No Onion-Garlic, No Tea-Coffe, No outside food, No unoffered food</td>
              </tr>
              <tr className="hover:bg-yellow-50">
                <td className="px-4 py-2">No Bad words, No fight with anyone</td>
                <td className="px-4 py-2">No Bad words, No fight with anyone</td>
                <td className="px-4 py-2">Glorifying atleast one devotee daily, personally & genuinely</td>
              </tr>
              <tr className="hover:bg-blue-50">
                <td className="px-4 py-2">Chanting daily min 4 rounds</td>
                <td className="px-4 py-2">Chanting daily min 6 rounds</td>
                <td className="px-4 py-2">Chanting daily min 4 extra rounds</td>
              </tr>
            </tbody>
          </table>
        </div>
      </section>
      {/* Section 3: Timeline */}
      <section className="max-w-5xl mx-auto w-full py-8 px-4">
        <h2 className="text-2xl font-bold text-pink-700 mb-4">Timeline</h2>
        <div className="flex flex-col md:flex-row items-center justify-between gap-6">
          <div className="flex flex-col items-center">
            <div className="bg-yellow-200 rounded-full w-12 h-12 flex items-center justify-center text-xl font-bold mb-2">Oct 5</div>
            <div className="text-gray-700 text-center">Mālā Ceremony<br />6:30 PM, ISKCON Abids</div>
          </div>
          <div className="flex-1 h-1 bg-pink-200 mx-2 md:mx-8" />
          <div className="flex flex-col items-center">
            <div className="bg-blue-200 rounded-full w-12 h-12 flex items-center justify-center text-xl font-bold mb-2">Oct 8</div>
            <div className="text-gray-700 text-center">Vrata Begins</div>
          </div>
          <div className="flex-1 h-1 bg-pink-200 mx-2 md:mx-8" />
          <div className="flex flex-col items-center">
            <div className="bg-green-200 rounded-full w-12 h-12 flex items-center justify-center text-xl font-bold mb-2">Nov 5</div>
            <div className="text-gray-700 text-center">Vrata Ends</div>
          </div>
        </div>
      </section>
      {/* Section 4: Highlights */}
      <section className="max-w-5xl mx-auto w-full py-8 px-4 grid grid-cols-2 md:grid-cols-4 gap-6">
        <div className="flex flex-col items-center gap-2 bg-yellow-50 rounded-xl p-4 shadow">
          <span className="text-2xl">✅</span>
          <span className="font-bold text-gray-700">Daily Practices</span>
        </div>
        <div className="flex flex-col items-center gap-2 bg-blue-50 rounded-xl p-4 shadow">
          <span className="text-2xl">✅</span>
          <span className="font-bold text-gray-700">1 Month Course</span>
        </div>
        <div className="flex flex-col items-center gap-2 bg-green-50 rounded-xl p-4 shadow">
          <span className="text-2xl">✅</span>
          <span className="font-bold text-gray-700">Online Sessions</span>
        </div>
        <div className="flex flex-col items-center gap-2 bg-pink-50 rounded-xl p-4 shadow">
          <span className="text-2xl">✅</span>
          <span className="font-bold text-gray-700">Goodies & Gifts</span>
        </div>
      </section>
      <br/>
      <br/>
      <br/>
      <br/>
      <br />
      {/* Sticky Bottom Bar */}
      <div className="fixed bottom-0 left-0 w-full bg-gradient-to-r from-pink-200 via-yellow-100 to-blue-100 shadow-lg py-4 px-4 flex flex-col md:flex-row items-center justify-between z-50">
        <span className="font-bold text-pink-700 text-lg flex items-center gap-2">🌺 Registration Closes Oct 8 — Don’t Miss Out!</span>
        <a href="https://rzp.io/rzp/c11BnYk" target="_blank" rel="noopener noreferrer">
          <GlowingButton className="mt-2 md:mt-0">Register Now</GlowingButton>
        </a>
      </div>
    </div>
  );
}
