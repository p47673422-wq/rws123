"use client";

import React, { useState, useEffect } from "react";
import "./home-custom.css";
import Link from "next/link";
import Image from "next/image";
import { FaWhatsapp, FaBookOpen, FaGift, FaCamera,FaOm, FaChalkboardTeacher, FaPrayingHands, FaShoppingBasket, FaDonate, FaListAlt } from "react-icons/fa";
import { GiPrayerBeads } from "react-icons/gi";

export default function HomePage() {
  const [showSummary, setShowSummary] = useState(false);
  const [showEventPopup, setShowEventPopup] = useState(true);
  const [glowEvent, setGlowEvent] = useState(false);
  useEffect(() => {
    const timer = setTimeout(() => {
      setShowEventPopup(false);
    }, 3500);
    return () => clearTimeout(timer);
  }, []);
  return (
    <div className="content-overlay">
      {showEventPopup && (
        <div className="event-news-popup-bottom">
          <Image src="/images/shutte.png" alt="Lord Ganesh" width={480} height={480} className="event-news-img" />
          <div className="event-news-content">
            <h2 className="event-news-title">Ganesh Chaturthi Special!</h2>
            <p className="event-news-desc">Attend and receive a special gift. Celebrate with us and seek Lord Gaṇeśa's blessings!</p>
          </div>
        </div>
      )}
      <div className="homeCustomBox home-main-box">
        <div className="home-header">
          <Image src="/iskcon-logo.png" alt="ISKCON Logo" width={400} height={100} className="home-logo" />
          <h1 className="fancyTitle">Welcome to ISKCON Sri Sri Radha Madanmohan</h1>
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
          <Link href="/home/current-event" className="home-tile home-tile-event home-tile-glow">
            <Image src="/images/icon.png" alt="Lord Ganesh" width={48} height={48} className="home-tile-icon" />
            <span className="home-tile-title">Current Event</span>
            <span className="home-tile-desc">Ganesh chaturthi</span>
          </Link>
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
