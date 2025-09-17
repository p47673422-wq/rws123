"use client";

import React, { useState, useEffect } from "react";
import { motion } from "framer-motion";
import "./home-custom.css";
import Link from "next/link";
import Image from "next/image";
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
  return (
    <div className="content-overlay">
       {/* {showEventPopup && (
        <div className="event-news-popup-bottom">
          <Image src="/images/shutte.png" alt="Lord Ganesh" width={480} height={480} className="event-news-img" />
          <div className="event-news-content">
            <h2 className="event-news-title">Ganesh Chaturthi Special!</h2>
            <p className="event-news-desc">Attend and receive a special gift. Celebrate with us and seek Lord Gaṇeśa's blessings!</p>
          </div>
        </div>
      )} */}
      <div className="homeCustomBox home-main-box">
        {/* Desktop Nav */}
        <nav className="hidden md:flex justify-end gap-4 py-2 px-2">
          <Image src="/iskcon-logo.png" alt="ISKCON Logo" width={120} height={40} className="" />
          {isLoggedIn ? (
            <Link href="/booking-home" className="home-nav-btn bg-green-600 text-white px-4 py-2 rounded shadow hover:bg-green-700 transition font-semibold">Home</Link>
          ) : (
            <>
              <Link href="/login" className="home-nav-btn bg-yellow-600 text-white px-4 py-2 rounded shadow hover:bg-yellow-700 transition font-semibold">Login</Link>
              <Link href="/signup" className="home-nav-btn bg-yellow-500 text-white px-4 py-2 rounded shadow hover:bg-yellow-600 transition font-semibold">Sign Up</Link>
            </>
          )}
        </nav>

        {/* Mobile Top Nav Bar */}
        <nav className="md:hidden fixed top-0 left-0 w-full z-50 flex items-center justify-between bg-yellow-100 px-4 py-2 shadow">
          <Image src="/iskcon-logo.png" alt="ISKCON Logo" width={120} height={40} className="" />
          <button
            className="w-10 h-10 flex items-center justify-center rounded-full bg-yellow-500"
            onClick={() => setShowSummary(!showSummary)}
            aria-label="Open menu"
          >
            {/* Menu icon: three horizontal lines */}
            <svg width="28" height="28" viewBox="0 0 28 28" fill="none" xmlns="http://www.w3.org/2000/svg">
              <rect y="6" width="28" height="3" rx="1.5" fill="white" />
              <rect y="13" width="28" height="3" rx="1.5" fill="white" />
              <rect y="20" width="28" height="3" rx="1.5" fill="white" />
            </svg>
          </button>
          {showSummary && (
            <div className="absolute top-14 right-4 bg-white rounded-xl shadow-lg p-4 flex flex-col gap-2">
              {isLoggedIn ? (
                <Link href="/booking-home" className="home-nav-btn bg-green-600 text-white px-4 py-2 rounded font-semibold" onClick={() => setShowSummary(false)}>Home</Link>
              ) : (
                <>
                  <Link href="/login" className="home-nav-btn bg-yellow-600 text-white px-4 py-2 rounded font-semibold" onClick={() => setShowSummary(false)}>Login</Link>
                  <Link href="/signup" className="home-nav-btn bg-yellow-500 text-white px-4 py-2 rounded font-semibold" onClick={() => setShowSummary(false)}>Sign Up</Link>
                </>
              )}
              <button className="mt-2 text-xs text-gray-500" onClick={() => setShowSummary(false)}>Close</button>
            </div>
          )}
        </nav>

        <div className="home-header">
          <h1 className="fancyTitle">Welcome to ISKCON Sri Sri Radha Madanmohan</h1>
        </div>

        {/* Hero Section */}
        <div className="relative w-full flex flex-col items-center justify-center py-8 mb-6">
          {/* Animated pulsing aura background */}
          <motion.div
            initial={{ opacity: 0.7, scale: 1 }}
            animate={{ opacity: [0.7, 1, 0.7], scale: [1, 1.08, 1] }}
            transition={{ duration: 2, repeat: Infinity }}
            className="absolute inset-0 z-0 flex items-center justify-center"
          >
            <div className="w-72 h-72 md:w-96 md:h-96 rounded-full bg-gradient-to-br from-yellow-400 via-pink-200 to-white blur-2xl opacity-60 mx-auto" />
          </motion.div>
          <div className="relative z-10 text-center w-full px-4">
            <h2 className="text-3xl md:text-4xl font-extrabold text-yellow-700 mb-2 drop-shadow-lg">🌸 Holy Name Challenge</h2>
            <p className="text-lg md:text-xl text-pink-700 mb-6 font-semibold">Take the 3-Level Quiz & 7-Day Japa Challenge</p>
            <div className="flex flex-col md:flex-row gap-4 justify-center items-center w-full">
                <a href="/holyname/quiz/level1" className="w-full">
                  <button className="w-full py-3 rounded bg-gradient-to-r from-yellow-400 via-pink-200 to-white text-yellow-900 font-bold shadow hover:scale-105 transition">Start Quiz</button>
                </a>
                <a href="/holyname/japa" className="w-full">
                  <button className="w-full py-3 rounded bg-gradient-to-r from-yellow-400 via-pink-200 to-white text-yellow-900 font-bold shadow hover:scale-105 transition">Join Japa Challenge</button>
                </a>
                <a href="/holyname/gifts" className="w-full">
                  <button className="w-full py-3 rounded bg-gradient-to-r from-yellow-400 via-pink-200 to-white text-yellow-900 font-bold shadow hover:scale-105 transition">View My Gifts</button>
                </a>
            </div>
          </div>
        </div>
        <div className="home-grid">
          {/* Row 1 */}
          <Link href="/home/whatsapp" className="home-tile home-tile-connect">
            <FaWhatsapp className="home-tile-icon" />
            <span className="home-tile-title">Connect</span>
            <span className="home-tile-desc">Join WhatsApp</span>
          </Link>
          <Link href="/home/bhagavad-gita" className="home-tile home-tile-course">
            <FaBookOpen className="home-tile-icon" />
            <span className="home-tile-title">Course</span>
            <span className="home-tile-desc">Bhagavad Gita</span>
          </Link>
          {/* Current Event Tile */}
                    {/* <Link href="/home/current-event" className="home-tile home-tile-event home-tile-glow">
            <Image src="/images/icon.png" alt="Lord Ganesh" width={48} height={48} className="home-tile-icon" />
            <span className="home-tile-title">Current Event</span>
            <span className="home-tile-desc">Ganesh chaturthi</span>
          </Link> */}
        </div>
        <hr className="home-divider" />
        <div className="home-gift-title">Attend this to get free gift</div>
        <div className="home-grid home-grid-2">
          {/* Row 2 */}
          <Link href="/home/mahaavatar-quiz" className="home-tile home-tile-challenge">
            <FaCamera className="home-tile-icon" />
            <span className="home-tile-title">Challenge</span>
            <span className="home-tile-desc">Mahaavatar Quiz</span>
          </Link>
          <Link href="/home/shloka-contest" className="home-tile home-tile-contest">
            <FaOm className="home-tile-icon" />
            <span className="home-tile-title">Contest</span>
            <span className="home-tile-desc">Shloka Contest</span>
          </Link>
          {/* Row 3 */}
          <Link href="/home/japa-challenge" className="home-tile home-tile-chanting">
            <GiPrayerBeads className="home-tile-icon" />
            <span className="home-tile-title">Chanting</span>
            <span className="home-tile-desc">Japa Challenge</span>
          </Link>
          <Link href="/home/8ps" className="home-tile home-tile-cultivate">
            <FaGift className="home-tile-icon" />
            <span className="home-tile-title">Cultivate</span>
            <span className="home-tile-desc">8 Ps Divine Journey</span>
          </Link>
        </div>
        <div className="home-actions">
          <a href="https://janmashtami.iskconhyderabad.com/?ref=bram12" target="_blank" rel="noopener noreferrer" className="home-action-btn home-donate-btn"><FaDonate className="home-action-icon" /> Donate</a>
          <Link href="/home/krishnabasket/items" className="home-action-btn home-basket-btn"><FaShoppingBasket className="home-action-icon" /> Krishna Basket</Link>
        </div>
        <div className="home-gift-summary-left">
          <a
            href="/gift-summary"
            target="_blank"
            rel="noopener noreferrer"
            className="home-gift-summary-btn"
            title="Show Gift Summary"
          >
            <FaListAlt className="home-gift-summary-icon" />
            <span className="home-gift-summary-label">Gifts</span>
          </a>
        </div>
      </div>
    </div>
  );
}
