"use client";
import Image from "next/image";
import Link from "next/link";

export default function GitaJayanti2025() {
  return (
    <>
      {/* Load Fonts */}
      <link
        href="https://fonts.googleapis.com/css2?family=Poppins:wght@300;400;600;700&family=Noto+Serif+Devanagari:wght@400;700&display=swap"
        rel="stylesheet"
      />

      <main className="bg-[#FFF8EC] text-[#5A2727] font-[Poppins]">

        {/* Hero */}
        <section className="relative w-full h-[420px] flex items-center justify-center">
          <Image
            src="/images/arjuna-krishna-chariot.jpg"
            alt="Gita Jayanti Banner"
            fill
            className="object-cover brightness-75"
          />

          <div className="relative text-center px-4">
            <h1 className="text-4xl font-bold text-yellow-300 drop-shadow-md">
              Gita Jayanti Meditations – 2025
            </h1>
            <p className="text-lg mt-2 text-white">Dec 1 – Dec 31</p>
            <p className="text-white mt-3 italic">
              A sacred month of Gita wisdom, Krishna stories & daily meditation.
            </p>

            <Link
              href="https://pages.razorpay.com/pl_RerUM7s5oEyv5V/view"
              target="_blank"
              className="mt-5 inline-block bg-yellow-300 text-[#5A2727] font-bold px-8 py-2 rounded-full shadow-lg hover:scale-105 transition"
            >
              Register Now ✨
            </Link>

            <p className="text-white text-sm mt-2 animate-bounce">
              Only ₹300 • Limited seats ⏳
            </p>
          </div>
        </section>

        {/* Courses Section */}
        <section className="py-12 px-6">
          <h2 className="text-3xl font-bold text-center mb-6">📚 Courses (Daily Sessions)</h2>

          <div className="grid md:grid-cols-2 gap-6">
            {/* Course 1 */}
            <div className="bg-white p-6 rounded-2xl shadow-lg border-t-4 border-yellow-500">
              <h3 className="text-xl font-bold">
                🌼 Course I – <span className="font-[Noto_Serif_Devanagari]">मा शुचः</span>
              </h3>
              <p className="italic mt-1">Stories of Krishna’s Loving Promises</p>
              <p className="text-sm mt-2">🕒 7:30–8:00 PM IST</p>
              <ul className="list-disc ml-5 mt-3 text-sm">
                <li>Shlokas • Recitation • Memorization</li>
                <li>Stories of Protection</li>
              </ul>
            </div>

            {/* Course 2 */}
            <div className="bg-white p-6 rounded-2xl shadow-lg border-t-4 border-blue-500">
              <h3 className="text-xl font-bold">🌼 Course II – Kṛṣṇā Quest</h3>
              <p className="italic mt-1">Vrindavan Leelas from Kṛṣṇa Book</p>
              <p className="text-sm mt-2">🕒 8:30–9:00 PM IST</p>
              <ul className="list-disc ml-5 mt-3 text-sm">
                <li>Pastimes • Devotion • Memory Maps</li>
              </ul>
            </div>
          </div>

          <div className="text-center mt-8">
            <Link
              className="bg-yellow-500 px-6 py-3 rounded-lg shadow text-[#5A2727] font-semibold hover:scale-105 transition"
              target="_blank"
              href="https://pages.razorpay.com/pl_RerUM7s5oEyv5V/view"
            >
              Join These Courses 🙌
            </Link>
          </div>
        </section>

        {/* Contests */}
        <section className="py-12 text-center bg-white">
          <h2 className="text-3xl font-bold mb-6">🏆 Contests (Open for All)</h2>

          <div className="grid md:grid-cols-2 gap-6 px-6">
            <div className="bg-yellow-200 p-6 rounded-xl shadow">
              <h3 className="font-bold mb-1">🥇 VEC – Bhagavad Gita Quest</h3>
              <p className="text-sm">10 Orientation Classes (Sat & Sun)</p>
            </div>

            <div className="bg-blue-200 p-6 rounded-xl shadow">
              <h3 className="font-bold mb-1">🥇 jñāna-plava</h3>
              <p className="text-sm">Learn Chapter 4 of the Gita</p>
              <p className="text-sm">🕒 6:30–7:00 AM IST</p>
            </div>
          </div>

          <p className="text-lg font-semibold mt-6">Experience Gita — Compete with Devotion 🎯</p>

          <Link
            target="_blank"
            href="https://pages.razorpay.com/pl_RerUM7s5oEyv5V/view"
            className="mt-4 inline-block bg-blue-600 text-red-600 px-8 py-3 rounded-full shadow-lg hover:scale-105 transition"
          >
            Register & Participate 🏆
          </Link>
        </section>

        {/* Fee & Rewards */}
        <section className="py-10 text-center px-6">
          <p className="text-lg">📅 Assessment: <b>11 January</b></p>
          <p className="text-lg">🏆 Results & Prizes: <b>14 January</b></p>

          <div className="mt-6 bg-yellow-100 py-4 rounded-lg shadow-md">
            <p className="text-xl font-bold text-red-600">
              🔥 Only ₹300 for the Full Month 🔥
            </p>
            <p className="text-sm mt-1">
              One FREE book (Bhagavad Gita or Krishna Book) + Surprise Gifts 🎁
            </p>
          </div>
        </section>

        {/* Footer */}
        <footer className="py-6 text-center bg-[#5A2727] text-yellow-300">
          Organized by ISKCON Hyderabad – Abids 🌸
        </footer>
      </main>
    </>
  );
}