"use client";
import "../home-custom.css";
import React, { useState, useEffect } from "react";
import Link from "next/link";
import { FaHome } from "react-icons/fa";
import { useRouter} from "next/navigation";

const shlokaCards = [
  { id: 1, img: "/images/shloka1.png", title: "Divinity of Lord Krsna" },
  { id: 2, img: "/images/shloka1.png", title: "Devotion to Lord Krsna" },
  { id: 3, img: "/images/shloka1.png", title: "Description of Lord Krsna" },
  { id: 4, img: "/images/shloka1.png", title: "Dedication to Lord Krsna" },
  { id: 5, img: "/images/shloka1.png", title: "Deepen connection with Lord Krsna" },
];

export default function ShlokaContestPage() {
    const router = useRouter();
  return (
    <div className="content-overlay">
      <div className="homeCustomBox shloka-contest-box">
        <button className="back-btn" onClick={() => router.push("/home")}>← Back to Home</button>
        <h2 className="fancyTitle">Shloka Contest</h2>
        <p className="shloka-menu-desc">Click a shloka to view, learn, and get gifts!</p>
        <div className="ps-menu-bar shloka-menu-bar">
          {shlokaCards.map(card => (
            <Link
              href={`/home/shloka-contest/${card.id}`}
              key={card.id}
              className="ps-menu-item shloka-menu-item"
            >
              <img
                src={card.img}
                alt={card.title}
                className="shloka-menu-img"
              />
              <div className="shloka-menu-title">{card.title}</div>
            </Link>
          ))}
        </div>
        
      </div>
    </div>
  );
}
