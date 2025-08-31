"use client";
import "../home-custom.css";
import React, { useState, useEffect } from "react";
import { ProgressBarFloating } from "../../../components/ProgressBarFloating";
import { FaHandsWash,FaHome, FaPrayingHands, FaRegStar, FaUsers, FaShoppingBag, FaRocket, FaEye, FaHandshake } from "react-icons/fa";
import Link from "next/link";
import { useRouter} from "next/navigation";

export default function EightPsPage() {
  const router = useRouter();
  const ps = [
    {
      name: "Prepare",
      desc: "Sacred preparation",
      href: "/home/8ps/prepare",
  icon: <FaHandsWash className="ps-icon ps-icon-prepare" />,
      img: "/images/prepare.png"
    },
    {
      name: "Pray",
      desc: "Divine prayers",
      href: "/home/8ps/pray",
  icon: <FaPrayingHands className="ps-icon ps-icon-pray" />,
      img: "/images/pray.png"
    },
    {
      name: "Perform",
      desc: "Sacred rituals",
      href: "/home/8ps/perform",
  icon: <FaRegStar className="ps-icon ps-icon-perform" />,
      img: "/images/perform.png"
    },
    {
      name: "Participate",
      desc: "Community seva",
      href: "/home/8ps/participate",
  icon: <FaUsers className="ps-icon ps-icon-participate" />,
      img: "/images/participate.png"
    },
    {
      name: "Purchase",
      desc: "Divine offerings",
      href: "/home/8ps/purchase",
  icon: <FaShoppingBag className="ps-icon ps-icon-purchase" />,
      img: "/images/purchase.png"
    },
    {
      name: "Perfect",
      desc: "Spiritual programs",
      href: "/home/8ps/perfect",
  icon: <FaRocket className="ps-icon ps-icon-perfect" />,
      img: "/images/perfect.png"
    },
    {
      name: "Perceive",
      desc: "Divine gallery",
      href: "/home/8ps/perceive",
  icon: <FaEye className="ps-icon ps-icon-perceive" />,
      img: "/images/perceive.png"
    },
    {
      name: "Pledge",
      desc: "Sacred vows",
      href: "/home/8ps/pledge",
  icon: <FaHandshake className="ps-icon ps-icon-pledge" />,
      img: "/images/pledge.png"
    },
  ];

  const [progress, setProgress] = useState<{ [key: string]: number }>({});
  const psList = ps.map(p => p.name);
  useEffect(() => {
    if (typeof window !== "undefined") {
      const storedId = localStorage.getItem("userId1");
      if (storedId) {
        fetch(`/api/progress/user?id=${storedId}`)
          .then(res => res.json())
          .then(data => {
            if (data.success && Array.isArray(data.progress)) {
              const progObj: { [key: string]: number } = {};
              data.progress.forEach((p: any) => {
                progObj[p.pName] = p.percent;
              });
              setProgress(progObj);
            }
          });
      }
    }
  }, []);
  return (
  <div className="content-overlay">
      <ProgressBarFloating
        progress={Math.round((Object.values(progress).filter(v => v >= 12.5).length / psList.length) * 100)}
        completedPs={psList.filter(p => (progress[p] || 0) >= 12.5)}
        psList={psList}
      />
  <div className="eightps-main-box">
    <button className="back-btn" onClick={() => router.push("/home")}>← Back to Home</button>
  <h2 className="eightps-title">8Ps Divine Journey</h2>
  <div className="ps-menu-bar">
          {ps.map((p, idx) => {
            const percent = progress[p.name] || 0;
            const completed = percent >= 12.5;
            return (
              <Link
                href={p.href}
                key={p.name}
                className={`ps-menu-item${completed ? ' ps-menu-item-completed' : ''}`}
              >
                <div className={`ps-menu-icon${completed ? ' ps-menu-icon-completed' : ''}`}>{p.icon}</div>
                <div className={`ps-menu-name${completed ? ' ps-menu-name-completed' : ''}`}>{p.name}</div>
                <div className={`ps-menu-desc${completed ? ' ps-menu-desc-completed' : ''}`}>{p.desc}</div>
                {completed ? (
                  <span className="ps-menu-status ps-menu-status-completed">Completed</span>
                ) : (
                  <span className="ps-menu-status">Click to explore</span>
                )}
              </Link>
            );
          })}
        </div>
  <p className="eightps-desc">Embark on your spiritual journey by exploring each P below!</p>
      </div>
    </div>
  );
}

