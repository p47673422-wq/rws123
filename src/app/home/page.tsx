"use client";

import React, { useState, useEffect } from "react";
import { motion } from "framer-motion";
import "./home-custom.css";
import Link from "next/link";
import Image from "next/image";
import GlowingButton from "../../components/GlowingButton";
import CountdownTimer from "../../components/CountdownTimer";
import { FaWhatsapp, FaBookOpen, FaGift, FaCamera,FaOm, FaChalkboardTeacher, FaPrayingHands, FaShoppingBasket, FaDonate, FaListAlt } from "react-icons/fa";
import { GiPrayerBeads } from "react-icons/gi";

export default function HomePage() {
  const [showSummary, setShowSummary] = useState(false);
  // const [showEventPopup, setShowEventPopup] = useState(false);
  const [glowEvent, setGlowEvent] = useState(false);
  // useEffect(() => {
  //   const timer = setTimeout(() => {
  //     setShowEventPopup(false);
  //   }, 3500);
  //   return () => clearTimeout(timer);
  // }, []);
  const [isLoggedIn, setIsLoggedIn] = useState(false);

useEffect(() => {
  async function checkAuth() {
    try {
      const res = await fetch("/api/auth/me");
      if (res.ok) {
   
        const data = await res.json();
        setIsLoggedIn(!data?.email);
      } else {
        setIsLoggedIn(false);
      }
    } catch {
      setIsLoggedIn(false);
    }
  }
  checkAuth();
}, []);
  // QuizButton component for Begin/Resume logic
  function QuizButton() {
    const [hasProgress, setHasProgress] = useState(false);
    useEffect(() => {
      try {
        const progress = window.localStorage.getItem("quizProgress");
        setHasProgress(!!progress);
      } catch {}
    }, []);
    const handleClick = () => {
      window.location.href = "/divine-journey";
    };
    return (
      <button
        type="button"
        onClick={handleClick}
        className="w-full md:w-auto px-8 py-4 rounded-xl font-bold text-white bg-gradient-to-r from-yellow-400 via-amber-300 to-orange-400 shadow-lg hover:scale-105 transition-all flex items-center justify-center gap-2 text-lg md:text-xl focus:outline-none focus:ring-2 focus:ring-yellow-500 focus:ring-offset-2 animate-bounce-on-hover"
        aria-label={hasProgress ? "Resume Divine Journey Quiz" : "Begin Divine Journey Quiz"}
      >
        {hasProgress ? "Resume Quiz" : "Begin Quiz"}
      </button>
    );
  }

  // Custom bounce animation for button
  useEffect(() => {
    const style = document.createElement("style");
    style.innerHTML = `
      @keyframes bounce {
        0%, 100% { transform: scale(1); }
        30% { transform: scale(1.08); }
        50% { transform: scale(0.97); }
        70% { transform: scale(1.04); }
      }
      .animate-bounce-on-hover:hover {
        animation: bounce 0.6s;
      }
    `;
    document.head.appendChild(style);
    return () => { document.head.removeChild(style); };
  }, []);

  return (
    <div className="min-h-screen bg-gradient-to-br from-yellow-100 via-pink-50 to-white flex flex-col">
      {/* Sticky Lotus-themed Navigation Bar */}
      <header className="sticky top-0 z-50 w-full bg-gradient-to-r from-saffron-200 via-pink-50 to-white shadow-lg border-b border-yellow-200">
        <nav className="max-w-7xl mx-auto flex items-center justify-between px-4 py-2">
          {/* Left: Logo */}
          <div className="flex items-center gap-2">
            <Image src="/iskcon-logo.png" alt="ISKCON Logo" width={150} height={75} className="rounded-full border-2 border-pink-200" />
            <span className="font-bold text-xl text-yellow-700 tracking-wide">ISKCON ABIDS</span>
          </div>
          {/* Center: Menu Links (Desktop) */}
          <div className="hidden md:flex gap-4 items-center flex-1 justify-center">
            {/* <Link href="/" className="nav-btn font-semibold text-yellow-900 hover:text-pink-700 transition">Home</Link> */}
            <Link href="/home/whatsapp" className="nav-btn font-semibold text-yellow-900 hover:text-pink-700 transition">Join WhatsApp</Link>
            <Link href="/home/bhagavad-gita" className="nav-btn font-semibold text-yellow-900 hover:text-pink-700 transition">Courses</Link>
            <Link href="#events" className="nav-btn font-semibold text-yellow-900 hover:text-pink-700 transition">Events</Link>
            <Link href="/home/krishnabasket/items" className="nav-btn font-semibold text-yellow-900 hover:text-pink-700 transition">Krishna Basket</Link>
            <Link href="/counselling" className="nav-btn font-semibold text-yellow-900 hover:text-pink-700 transition">Free Counselling</Link>
            <a href="https://rzp.io/rzp/D5Q6s9m" target="_blank" rel="noopener noreferrer" className="nav-btn font-semibold text-yellow-900 hover:text-pink-700 transition">Donate</a>
            <Link href="/login-ram" className="nav-btn font-semibold text-yellow-900 hover:text-pink-700 transition">Gita Course</Link>
          </div>
          {/* Right: Auth Buttons (Desktop) */}
          {/* <div className="hidden md:flex gap-2 items-center">
            {isLoggedIn ? (
              <Link href="/booking-home" className="rounded-full px-5 py-2 font-semibold bg-green-600 text-white shadow hover:scale-105 transition">Home</Link>
            ) : (
              <>
                <Link href="/login" className="rounded-full px-5 py-2 font-semibold bg-gradient-to-r from-yellow-500 via-pink-400 to-orange-400 text-white shadow hover:scale-105 transition">Login</Link>
                <Link href="/signup" className="rounded-full px-5 py-2 font-semibold bg-gradient-to-r from-pink-400 via-yellow-400 to-orange-300 text-white shadow hover:scale-105 transition">Sign Up</Link>
              </>
            )}
          </div> */}
          {/* Mobile Hamburger */}
          <div className="md:hidden flex items-center">
            <button
              className="w-10 h-10 flex items-center justify-center rounded-full bg-gradient-to-r from-yellow-400 via-pink-200 to-white shadow-lg border border-yellow-300"
              onClick={() => setShowSummary(!showSummary)}
              aria-label="Open menu"
            >
              <svg width="28" height="28" viewBox="0 0 28 28" fill="none" xmlns="http://www.w3.org/2000/svg">
                <rect y="6" width="28" height="3" rx="1.5" fill="#eab308" />
                <rect y="13" width="28" height="3" rx="1.5" fill="#eab308" />
                <rect y="20" width="28" height="3" rx="1.5" fill="#eab308" />
              </svg>
            </button>
            {/* Slide-in Drawer */}
            <motion.div
              initial={{ x: 200, opacity: 0 }}
              animate={showSummary ? { x: 0, opacity: 1 } : { x: 200, opacity: 0 }}
              transition={{ type: "spring", stiffness: 200, damping: 30 }}
              className={`fixed top-0 right-0 h-full w-72 bg-gradient-to-br from-saffron-100 via-pink-50 to-white shadow-2xl z-50 flex flex-col pt-8 px-6 gap-6 ${showSummary ? '' : 'pointer-events-none'}`}
            >
              <div className="flex flex-col gap-4 mt-4">
                {/* <Link href="/" className="nav-btn font-semibold text-yellow-900 hover:text-pink-700 transition">Home</Link> */}
                <Link href="/home/whatsapp" className="nav-btn font-semibold text-yellow-900 hover:text-pink-700 transition">Join WhatsApp</Link>
                <Link href="/home/bhagavad-gita" className="nav-btn font-semibold text-yellow-900 hover:text-pink-700 transition">Courses</Link>
                <Link href="#events" className="nav-btn font-semibold text-yellow-900 hover:text-pink-700 transition">Events</Link>
                <Link href="/home/krishnabasket/items" className="nav-btn font-semibold text-yellow-900 hover:text-pink-700 transition">Krishna Basket</Link>
                <Link href="/counselling" className="nav-btn font-semibold text-yellow-900 hover:text-pink-700 transition">Free Counselling</Link>
                <a href="https://rzp.io/rzp/D5Q6s9m" target="_blank" rel="noopener noreferrer" className="nav-btn font-semibold text-yellow-900 hover:text-pink-700 transition">Donate</a>
                <Link href="/login-ram" className="nav-btn font-semibold text-yellow-900 hover:text-pink-700 transition">Gita Course</Link>
              </div>
              <div className="flex flex-col gap-2 mt-auto mb-16">
                {/* {isLoggedIn ? (
                  <Link href="/booking-home" className="rounded-full px-5 py-2 font-semibold bg-green-600 text-white shadow hover:scale-105 transition" onClick={() => setShowSummary(false)}>Home</Link>
                ) : (
                  <>
                    <Link href="/login" className="rounded-full px-5 py-2 font-semibold bg-gradient-to-r from-yellow-500 via-pink-400 to-orange-400 text-white shadow hover:scale-105 transition" onClick={() => setShowSummary(false)}>Login</Link>
                    <Link href="/signup" className="rounded-full px-5 py-2 font-semibold bg-gradient-to-r from-pink-400 via-yellow-400 to-orange-300 text-white shadow hover:scale-105 transition" onClick={() => setShowSummary(false)}>Sign Up</Link>
                  </>
                )} */}
                <button className="mt-2 text-xs text-gray-500" onClick={() => setShowSummary(false)}>Close</button>
              </div>
            </motion.div>
          </div>
        </nav>
      </header>

      {/* HERO SECTION - Dāmodara Mālā 2025 */}
      {/* <section className="relative w-full flex flex-col items-center justify-center py-16 md:py-24 bg-gradient-to-br from-yellow-100 via-blue-50 to-pink-50 overflow-hidden">
        <Image src="/images/damodar-hero.png" alt="Radha Damodar" width={1600} height={600} className="absolute inset-0 w-full h-full opacity-80 object-cover pointer-events-none select-none" />
        <div className="absolute inset-0 bg-gradient-to-br from-yellow-100 via-blue-100 to-pink-100 opacity-70" />
        <motion.div
          initial={{ opacity: 0, y: 40 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 1.2 }}
          className="relative z-10 text-center w-full px-4"
        >
          <h1 className="text-4xl md:text-5xl font-extrabold text-pink-700 mb-2 drop-shadow-lg flex items-center justify-center gap-2">
            🌸 Special Offer on Books 🌸
          </h1>
          <p className="text-xl md:text-2xl text-blue-700 mb-2 font-semibold">Explore more</p>
          
          <div className="mb-4">
            <span className="text-lg font-bold text-pink-600 animate-pulse">Limited time offer!</span>
          </div>
          <div className="flex flex-col md:flex-row gap-4 justify-center items-center w-full mb-2">
            <a href="/home/krishnabasket/items">
              <GlowingButton className="text-lg">Krishna Basket</GlowingButton>
            </a>
            <a href="#movie-quiz">
              <button className="w-full md:w-auto py-3 px-6 rounded-xl border-2 border-pink-400 text-pink-700 font-bold shadow-lg hover:scale-105 hover:border-yellow-400 transition flex items-center gap-2 bg-white">Narshima Movie Quiz</button>
            </a>
            <a href="#quizzes" className="px-6 py-3 rounded-xl font-bold text-white bg-gradient-to-r from-green-500 via-yellow-400 to-pink-400 shadow-lg hover:scale-105 transition flex items-center gap-2"><span>🎯</span> Quiz Corner</a>
          </div>
        </motion.div>
      </section> */}
      <section className="relative w-full flex flex-col items-center justify-center py-16 md:py-24 bg-gradient-to-br from-yellow-100 via-blue-50 to-pink-50 overflow-hidden">
        <Image src="/images/arjuna-krishna-chariot.jpg" alt="Radha Damodar" width={1600} height={600} className="absolute inset-0 w-full h-full opacity-80 object-cover pointer-events-none select-none" />
        <div className="absolute inset-0 bg-gradient-to-br from-yellow-100 via-blue-100 to-pink-100 opacity-70" />
        <motion.div
          initial={{ opacity: 0, y: 40 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 1.2 }}
          className="relative z-10 text-center w-full px-4"
        >
          <h1 className="text-4xl md:text-5xl font-extrabold text-pink-700 mb-2 drop-shadow-lg flex items-center justify-center gap-2">
           Gita Jayanti
          </h1>
          <p className="text-xl md:text-2xl text-blue-700 mb-2 font-semibold">🌸 Mediation 🌸</p>
          <p className="text-xl md:text-2xl text-blue-700 mb-2 font-semibold">Dec 1 – Dec 31</p>
          <div className="mb-4">
            <span className="text-lg font-bold text-pink-600 animate-pulse">Registration closes Dec 1!</span>
          </div>
          <div className="mb-6">
            <CountdownTimer />
          </div>
          <div className="flex flex-col md:flex-row gap-4 justify-center items-center w-full mb-2">
            <a href="https://pages.razorpay.com/pl_RerUM7s5oEyv5V/view" target="_blank" rel="noopener noreferrer">
              <GlowingButton className="text-lg">Register Now</GlowingButton>
            </a>
            <Link href="gita-jayanti">
              <button className="w-full md:w-auto py-3 px-6 rounded-xl border-2 border-pink-400 text-pink-700 font-bold shadow-lg hover:scale-105 hover:border-yellow-400 transition flex items-center gap-2 bg-white">View Details</button>
            </Link>
            <a href="tel:9985181358" className="px-6 py-3 rounded-xl font-bold text-white bg-gradient-to-r from-green-500 via-yellow-400 to-pink-400 shadow-lg hover:scale-105 transition flex items-center gap-2"><span>📩</span> Contact Us: 9985181358</a>
              <a href="#quizzes" className="px-6 py-3 rounded-xl font-bold text-white bg-gradient-to-r from-green-500 via-yellow-400 to-pink-400 shadow-lg hover:scale-105 transition flex items-center gap-2"><span>🎯</span> Quiz Corner</a>
          
          </div>
        </motion.div>
      </section>

      {/* ...existing homepage content... */}

      {/* HERO SECTION */}
      {/* <section className="relative w-full flex flex-col items-center justify-center py-12 md:py-20 bg-gradient-to-br from-yellow-100 via-pink-50 to-white overflow-hidden"> */}
        {/* Lotus faded overlay */}
        {/* <Image src="/images/lotus.png" alt="Lotus Overlay" width={400} height={400} className="absolute left-0 top-0 opacity-10 pointer-events-none select-none hidden md:block" />
        <motion.div
          initial={{ opacity: 0, y: 40 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 1.2 }}
          className="relative z-10 text-center w-full px-4"
        >
          <h1 className="text-4xl md:text-5xl font-extrabold text-yellow-700 mb-2 drop-shadow-lg flex items-center justify-center gap-2">
            <span className="inline-block"><Image src="/images/shloka1.png" alt="Lotus" width={40} height={40} className="inline-block mr-2" /></span>
            ✨ Holy Name Challenge
            <span className="inline-block"><Image src="/images/shloka1.png" alt="Lotus" width={40} height={40} className="inline-block ml-2" /></span>
          </h1>
          <p className="text-xl md:text-2xl text-pink-700 mb-6 font-semibold">Chant • Learn • Win Gifts</p>
          <div className="flex flex-col md:flex-row gap-4 justify-center items-center w-full mb-2">
            <a href="/holyname/quiz/level1" className="w-full md:w-auto">
              <button className="w-full md:w-auto py-3 px-6 rounded-xl bg-gradient-to-r from-yellow-400 via-pink-200 to-white text-yellow-900 font-bold shadow-lg hover:scale-105 transition flex items-center gap-2"><span>🚀</span> Start Quiz</button>
            </a>
            <a href="/holyname/japa" className="w-full md:w-auto">
              <button className="w-full md:w-auto py-3 px-6 rounded-xl bg-gradient-to-r from-yellow-400 via-pink-200 to-white text-yellow-900 font-bold shadow-lg hover:scale-105 transition flex items-center gap-2"><span>🙏</span> Join Japa Challenge</button>
            </a>
            <a href="/holyname/gifts" className="w-full md:w-auto">
              <button className="w-full md:w-auto py-3 px-6 rounded-xl bg-gradient-to-r from-yellow-400 via-pink-200 to-white text-yellow-900 font-bold shadow-lg hover:scale-105 transition flex items-center gap-2"><span>🎁</span> My Gifts</button>
            </a>
          </div>
          <div className="text-sm text-pink-700 font-medium mb-2">Step 1: Quiz • Step 2: Japa • Step 3: Claim Gifts</div>
        </motion.div> */}
        {/* Lotus petals divider */}
        {/* <div className="w-full flex justify-center items-center mt-4 mb-2">
          <Image src="/images/shloka.png" alt="Lotus Divider" width={120} height={32} className="opacity-30" />
        </div>
      </section> */}

      {/* WHY JOIN STRIP */}
      <section className="w-full bg-gradient-to-r from-yellow-50 via-pink-50 to-white py-4 flex flex-col md:flex-row justify-center items-center gap-6 border-y border-yellow-200">
        <div className="flex items-center gap-2 text-green-700 font-semibold"><span>✅</span> Fun & Interactive Quizzes</div>
        <div className="flex items-center gap-2 text-pink-700 font-semibold"><span>✅</span> Daily Japa Guidance</div>
        <div className="flex items-center gap-2 text-yellow-700 font-semibold"><span>✅</span> Earn Divine Gifts</div>
        <div className="flex items-center gap-2 text-orange-700 font-semibold"><span>✅</span> Stay Motivated with Community</div>
      </section>

 {/* Divine Journey Section */}
    <section
      className="relative w-full flex flex-col items-center justify-center py-16 md:py-24 bg-gradient-to-br from-yellow-100 via-pink-50 to-white overflow-hidden"
      aria-label="Divine Journey Section"
    >
      {/* Lotus petal background overlay */}
      <div className="absolute inset-0 pointer-events-none select-none flex justify-center items-center">
        <img
          src="/images/shloka.png"
          alt="Lotus Petal Pattern"
          className="opacity-10 w-[400px] h-[400px] md:w-[600px] md:h-[600px] object-cover"
          aria-hidden="true"
        />
      </div>
      <div className="relative z-10 w-full flex flex-col items-center justify-center">
        <h2 className="text-3xl md:text-5xl font-extrabold text-yellow-700 mb-4 text-center drop-shadow-lg animate-fadein">
          🪔 Divine Journey – Defeat Ravana, Take Shelter of Lord Ram
        </h2>
        <p className="text-base md:text-lg text-pink-700 mb-6 font-medium text-center max-w-xl mx-auto animate-fadein delay-100">
          Meditate and commit ourselves to following Rama. By taking shelter of Rama, we liberate ourselves from this Ravana within: lust, envy, anger, pride, greed, illusion.
        </p>
        <div className="w-full flex flex-col items-center justify-center">
          <div className="bg-white/90 rounded-xl shadow-2xl p-8 border border-yellow-100 max-w-lg w-full flex flex-col items-center animate-fadein delay-200">
            {/* Quiz Button Logic */}
            <QuizButton />
          </div>
        </div>
      </div>
      {/* Custom fade-in animation */}
      <style jsx>{`
        @keyframes fadein {
          0% { opacity: 0; transform: translateY(40px); }
          100% { opacity: 1; transform: translateY(0); }
        }
        .animate-fadein {
          animation: fadein 1.2s cubic-bezier(0.4,0,0.2,1) both;
        }
        .delay-100 { animation-delay: 0.1s; }
        .delay-200 { animation-delay: 0.2s; }
      `}</style>
    </section>

    <section className="w-full py-12 px-4 flex flex-col items-center bg-gradient-to-r from-green-50 via-yellow-50 to-pink-50" id="events">
      <div className="relative w-full max-w-xl flex flex-col items-center justify-center rounded-2xl shadow-2xl border border-green-100 bg-white/90 p-8 animate-fadein">
        <h2 className="text-3xl md:text-4xl font-extrabold text-green-700 mb-3 flex items-center gap-2 drop-shadow-lg">
          <span>🌿</span> Free Spiritual Counselling
        </h2>
        <p className="text-lg md:text-xl text-gray-700 mb-4 text-center font-medium">Feeling stuck, stressed, or seeking guidance? Our experienced spiritual mentors are here to help you for free. Confidential, compassionate, and personalized support for your journey.</p>
        <Link href="/counselling" className="px-8 py-4 rounded-2xl font-bold text-white bg-gradient-to-r from-green-500 via-yellow-400 to-pink-400 shadow-xl hover:scale-105 transition-all flex items-center gap-3 text-lg md:text-xl focus:outline-none focus:ring-2 focus:ring-green-500 focus:ring-offset-2 animate-bounce-on-hover">
          <span className="text-2xl">🌿</span> <span>Talk to a Counsellor Now</span>
        </Link>
        <div className="mt-4 text-sm text-green-700 font-semibold flex items-center gap-2"><span>✨</span> 100% Free & Confidential</div>
      </div>
      <style jsx>{`
        .animate-fadein {
          animation: fadein 1.2s cubic-bezier(0.4,0,0.2,1) both;
        }
        @keyframes fadein {
          0% { opacity: 0; transform: translateY(40px); }
          100% { opacity: 1; transform: translateY(0); }
        }
      `}</style>
    </section>

      {/* QUIZZES SECTION */}
      <section className="max-w-5xl mx-auto w-full py-10 px-4" id="quizzes">
        <h2 className="text-2xl md:text-3xl font-bold text-yellow-700 mb-6 flex items-center gap-2"><span>📘</span> Explore Multiple Quizzes</h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-2 gap-8 justify-center">
          {/* Card 1: Mahaavatar Quiz */}
          <Link href="/home/mahaavatar-quiz" className="bg-white rounded-xl shadow-lg p-6 flex flex-col items-center justify-center hover:scale-105 transition relative w-full max-w-xs mx-auto border border-pink-100">
            <span className="absolute top-2 right-2"><Image src="/images/shloka.png" alt="Lotus" width={24} height={24} /></span>
            <FaCamera className="text-4xl text-yellow-600 mb-2" />
            <span className="font-bold text-lg mb-1">Mahaavatar Quiz</span>
            <span className="text-sm text-gray-600 text-center">Test your knowledge of Lord's incarnations and avatars.</span>
          </Link>
          {/* Card 2: Shloka Contest */}
          <Link href="/home/shloka-contest" className="bg-white rounded-xl shadow-lg p-6 flex flex-col items-center justify-center hover:scale-105 transition relative w-full max-w-xs mx-auto border border-pink-100">
            <span className="absolute top-2 right-2"><Image src="/images/shloka.png" alt="Lotus" width={24} height={24} /></span>
            <FaOm className="text-4xl text-pink-600 mb-2" />
            <span className="font-bold text-lg mb-1">Shloka Contest</span>
            <span className="text-sm text-gray-600 text-center">Recite and learn beautiful shlokas from scriptures.</span>
          </Link>
          {/* Card 3: Japa Challenge */}
          <Link href="/home/japa-challenge" className="bg-white rounded-xl shadow-lg p-6 flex flex-col items-center justify-center hover:scale-105 transition relative w-full max-w-xs mx-auto border border-pink-100">
            <span className="absolute top-2 right-2"><Image src="/images/shloka.png" alt="Lotus" width={24} height={24} /></span>
            <GiPrayerBeads className="text-4xl text-green-600 mb-2" />
            <span className="font-bold text-lg mb-1">Japa Challenge</span>
            <span className="text-sm text-gray-600 text-center">Chant daily and track your spiritual progress.</span>
          </Link>
          {/* Card 4: 8Ps Divine Journey */}
          <Link href="/home/8ps" className="bg-white rounded-xl shadow-lg p-6 flex flex-col items-center justify-center hover:scale-105 transition relative w-full max-w-xs mx-auto border border-pink-100">
            <span className="absolute top-2 right-2"><Image src="/images/shloka.png" alt="Lotus" width={24} height={24} /></span>
            <FaGift className="text-4xl text-orange-500 mb-2" />
            <span className="font-bold text-lg mb-1">8Ps Divine Journey</span>
            <span className="text-sm text-gray-600 text-center">Embark on a journey of spiritual cultivation.</span>
          </Link>
        </div>
      </section>

      {/* GIFT SECTION */}
      <section className="w-full py-8 flex flex-col items-center justify-center bg-gradient-to-r from-pink-50 via-yellow-50 to-white">
        <div className="text-xl font-bold text-pink-700 mb-4 flex items-center gap-2"><span>🎉</span> Complete challenges → Unlock your Free Gift!</div>
        <a href="/gift-summary" rel="noopener noreferrer" className="inline-block">
          <button className="px-8 py-4 rounded-xl font-bold text-white bg-gradient-to-r from-pink-400 via-yellow-400 to-orange-400 shadow-lg hover:scale-105 transition glow-effect flex items-center gap-2">
            <FaListAlt className="text-2xl" /> <span>Claim Gift</span>
          </button>
        </a>
      </section>

      {/* DAILY ENGAGEMENT STRIP */}
      <section className="w-full py-3 bg-gradient-to-r from-yellow-50 via-pink-50 to-white flex flex-col md:flex-row justify-center items-center gap-6 border-t border-yellow-200 animate-slide-x">
        <div className="flex items-center gap-2 text-yellow-700 font-semibold"><span>🌞</span> Morning: 1 Sloka for the Day</div>
        <div className="flex items-center gap-2 text-pink-700 font-semibold"><span>🕉️</span> Midday: Japa Reminder</div>
        <div className="flex items-center gap-2 text-orange-700 font-semibold"><span>🌙</span> Evening: Quiz / Reflection Prompt</div>
      </section>

      {/* KRISHNA BASKET SECTION */}
      <section className="max-w-5xl mx-auto w-full py-10 px-4 flex flex-col items-center" id="krishna-basket">
        <h2 className="text-2xl md:text-3xl font-bold text-yellow-700 mb-2 flex items-center gap-2"><span>🛍️</span> Krishna Basket – Affordable Devotional Kits</h2>
        <p className="text-md text-gray-700 mb-4 text-center">Choose from a variety of spiritual kits and essentials at affordable prices.</p>
        <Link href="/home/krishnabasket/items" className="px-6 py-3 rounded-xl font-bold text-white bg-gradient-to-r from-yellow-500 via-pink-400 to-orange-400 shadow-lg hover:scale-105 transition flex items-center gap-2 mb-6"><span>🛒</span> Explore Krishna Basket</Link>
        {/* Sample kits showcase (optional) */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 w-full max-w-2xl">
          <div className="bg-white rounded-xl shadow p-4 flex flex-col items-center border border-yellow-100">
            <Image src="/images/KRSNA.jpg" alt="Kit 1" width={80} height={80} className="mb-2" />
            <span className="font-bold text-yellow-700">Krishna Kit</span>
            <span className="text-sm text-gray-600">Includes Krishna book, japa mala, japa bag, certificate, frame, keychain, pen and cookie packet.</span>
          </div>
          <div className="bg-white rounded-xl shadow p-4 flex flex-col items-center border border-yellow-100">
            <Image src="/images/BG.jpg" alt="Kit 2" width={80} height={80} className="mb-2" />
            <span className="font-bold text-pink-700">Bhagavad Gita Kit</span>
            <span className="text-sm text-gray-600">Includes Bhagavad gita, japa mala, japa bag, certificate, frame, keychain, pen and cookie packet.</span>
          </div>
        </div>
      </section>

      {/* SPIRITUAL PROGRAMS SECTION */}
      <section className="w-full py-10 px-4 flex flex-col items-center bg-gradient-to-r from-yellow-50 via-pink-50 to-white" id="events">
        <h2 className="text-2xl md:text-3xl font-bold text-green-700 mb-2 flex items-center gap-2"><span>🌿</span> Join Our Spiritual Programs</h2>
        <p className="text-md text-gray-700 mb-4 text-center">Want to organize or participate in spiritual events? Please contact us.</p>
        <a href="tel:9985181358" className="px-6 py-3 rounded-xl font-bold text-white bg-gradient-to-r from-green-500 via-yellow-400 to-pink-400 shadow-lg hover:scale-105 transition flex items-center gap-2"><span>📩</span> Contact Us: 9985181358</a>
      </section>


      {/* DONATE / SUPPORT SECTION */}
      <section className="w-full py-6 flex flex-col items-center justify-center bg-gradient-to-r from-pink-50 via-yellow-50 to-white">
        <div className="text-lg font-bold text-pink-700 mb-2 flex items-center gap-2"><span>💖</span> Support Krishna Seva</div>
        <a href="https://rzp.io/rzp/D5Q6s9m" target="_blank" rel="noopener noreferrer" className="px-6 py-3 rounded-xl font-bold text-white bg-gradient-to-r from-pink-400 via-yellow-400 to-orange-400 shadow-lg hover:scale-105 transition flex items-center gap-2"><FaDonate className="text-2xl" /> Donate</a>
      </section>

      {/* MAHAVATAR MOVIE QUIZ SECTION */}
      <section id="movie-quiz" className="w-full py-10 flex flex-col items-center justify-center bg-gradient-to-r from-yellow-50 via-pink-50 to-white">
        <h2 className="text-3xl md:text-4xl font-extrabold text-yellow-700 mb-2 flex items-center gap-2 drop-shadow-lg"><span>🎬</span> Mahavatar Movie Quiz</h2>
        <p className="text-lg md:text-xl text-pink-700 mb-6 text-center font-medium max-w-2xl">Test your knowledge and dive into divine insights from the Mahavatar movie!</p>
        <button
          onClick={() => window.location.href = '/movie-quiz'}
          className="px-10 py-5 rounded-2xl font-bold text-white bg-gradient-to-r from-pink-400 via-yellow-400 to-orange-400 shadow-xl hover:scale-105 hover:shadow-amber-300/60 transition-all flex items-center gap-3 text-xl md:text-2xl focus:outline-none focus:ring-2 focus:ring-yellow-500 focus:ring-offset-2 animate-bounce-on-hover"
          style={{ boxShadow: '0 4px 32px 0 rgba(255, 193, 7, 0.10)' }}
        >
          <span className="text-3xl">🌸</span> Start Quiz
        </button>
      </section>

  {/* FOOTER */}
  <footer className="w-full bg-gradient-to-r from-saffron-100 via-pink-50 to-white py-8 mt-8 border-t border-yellow-200 relative">
        <div className="absolute inset-0 flex justify-center items-center pointer-events-none select-none">
          <Image src="/images/shloka.png" alt="Lotus Mandala" width={180} height={180} className="opacity-10" />
        </div>
        <div className="max-w-7xl mx-auto flex flex-col md:flex-row justify-between items-center px-4 relative z-10">
          <div className="flex flex-col gap-2 mb-4 md:mb-0">
            <span className="font-bold text-yellow-700 text-lg">MyKrishnaTouch.in</span>
            <div className="flex gap-4 text-sm text-pink-700">
              <Link href="/">Home</Link>
              <Link href="/home/whatsapp">Join WhatsApp</Link>
              <Link href="/home/bhagavad-gita">Courses</Link>
              <Link href="/home/krishnabasket/items">Krishna Basket</Link>
              <Link href="/auth/ram/dashboard/">Book Marathon</Link>
            </div>
          </div>
          <div className="flex gap-4 items-center mb-4 md:mb-0">
            <a href="https://wa.me/9985181358" target="_blank" rel="noopener noreferrer" className="text-green-600 text-2xl"><FaWhatsapp /></a>
            <a href="https://instagram.com/iskconhyd" target="_blank" rel="noopener noreferrer" className="text-pink-600 text-2xl"><FaGift /></a>
            <a href="https://youtube.com/@iskconhyderabad" target="_blank" rel="noopener noreferrer" className="text-red-600 text-2xl"><FaCamera /></a>
          </div>
          <div className="text-sm text-gray-500">© {new Date().getFullYear()} MyKrishnaTouch.in</div>
        </div>
      </footer>

      {/* Mobile fixed Divine Journey Quiz strip */}
      {/* <div className="fixed bottom-0 left-0 w-full z-50 block md:hidden">
        <button
          onClick={() => { window.location.href = '/movie-quiz'; }}
          className="w-full py-4 bg-gradient-to-r from-yellow-400 via-amber-300 to-orange-400 text-black font-bold text-lg flex items-center justify-center gap-2 shadow-xl animate-bounce-on-hover border-t border-yellow-300"
          style={{ borderTopLeftRadius: 16, borderTopRightRadius: 16 }}
        >
          <span className="text-2xl">🪔</span> Tap to attend Mahavatar Narsimha Quiz
        </button>
      </div> */}
    </div> 
  );
}
