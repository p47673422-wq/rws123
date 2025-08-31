"use client";

import React, { useState, useEffect } from "react";
import Image from "next/image";
import "./currentEvent.module.css";
import "../krishnabasket/purchase-items.css";
import "./eventResponsive.css";
import "../home-custom.css";
import Link from "next/link";
import { useRouter } from "next/navigation";

const tabs = [
  {
    title: "Simple Symbolism of Lord Gaṇeśa",
    image: "/images/sym.png",
    content: "Discover the deep symbolism behind Lord Gaṇeśa's form and attributes, representing wisdom, prosperity, and remover of obstacles."
  },
  {
    title: "The Story of Lord Gaṇeśa and the Name “Rāma”",
    image: "/images/icon.png",
    content: "Learn the fascinating story connecting Lord Gaṇeśa and the sacred name 'Rāma', highlighting devotion and divine blessings."
  },
  {
    title: "Asking Blessings On Ganesh Chaturthi",
    image: "/images/icon3.png",
    content: "Explore the tradition of seeking Lord Gaṇeśa's blessings during Ganesh Chaturthi for success and spiritual growth."
  },
  {
    title: "Lord Gaṇeśa and Lord Narasiṁhadeva",
    image: "/images/icon4.png",
    content: "Understand the connection between Lord Gaṇeśa and Lord Narasiṁhadeva, both protectors and bestowers of courage."
  },
  {
    title: "Illustrated Story of Lord Gaṇeśa",
    image: "/images/shutte.png",
    content: "Great Personality - Lord Ganesha...The Remover of obstacles."
  }
];

export default function CurrentEventPage() {
  const router = useRouter();
  // Animation for card entry
  const [mounted, setMounted] = useState(false);
  useEffect(() => {
    setMounted(true);
  }, []);

  return (
    <div className="content-overlay">
      <div className="comeCustomBox1 current-event-shell responsive-event-shell">
        <button className="back-btn" onClick={() => router.push("/home")}>← Back to Home</button>
        <h2 className="fancyTitle event-title">Current Event: Ganesh Chaturthi</h2>
        <p className="shloka-menu-desc event-menu-desc">Attend any section and get a special gift!</p>
        <div className="event-card-grid-animated purchase-items-grid">
          {tabs.map((tab, idx) => (
            <Link
              href={`/home/current-event/${idx + 1}`}
              key={tab.title}
              className={`event-card-animated purchase-card-dark${mounted ? " event-card-move-in" : ""}`}
              style={{ transitionDelay: `${idx * 0.12}s` }}
            >
              <div className="purchase-img-wrap-dark event-card-img-wrap">
                <Image src={tab.image} alt={tab.title} width={100} height={100} className="event-card-img" style={{objectFit: 'contain'}} />
              </div>
              <div className="purchase-card-content event-card-content">
                <div className="purchase-title event-card-title">{tab.title}</div>
                <div className="purchase-desc event-card-desc">{tab.content}</div>
                <button className="fancy-btn add-to-cart-btn">
                                                        Explore more →
                                                    </button>
              </div>
            </Link>
          ))}
        </div>
      </div>
    </div>
  );
}
