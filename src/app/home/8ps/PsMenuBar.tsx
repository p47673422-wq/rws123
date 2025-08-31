"use client";
import "../home-custom.css";
import React, { useEffect, useState } from "react";

const psList = [
  { name: "Prepare", href: "/home/8ps/prepare" },
  { name: "Pray", href: "/home/8ps/pray" },
  { name: "Perform", href: "/home/8ps/perform" },
  { name: "Participate", href: "/home/8ps/participate" },
  { name: "Purchase", href: "/home/8ps/purchase" },
  { name: "Perfect", href: "/home/8ps/perfect" },
  { name: "Perceive", href: "/home/8ps/perceive" },
  { name: "Pledge", href: "/home/8ps/pledge" },
];

export default function PsMenuBar() {
  const [completedPs, setCompletedPs] = useState<string[]>([]);

  useEffect(() => {
    if (typeof window !== "undefined") {
      const storedId = localStorage.getItem("userId1");
      if (storedId) {
        fetch(`/api/progress/user?id=${storedId}`)
          .then(res => res.json())
          .then(data => {
            if (data.success && Array.isArray(data.progress)) {
              const completed = data.progress.filter((p: any) => (p.percent || 0) >= 12.5).map((p: any) => p.pName);
              setCompletedPs(completed);
            }
          });
      }
    }
  }, []);

  return (
    <nav className="ps-menu-bar-simple">
      <ul className="ps-menu-list-simple">
        {psList.map((p) => (
          <li key={p.name}>
            <a
              href={p.href}
              className={
                completedPs.includes(p.name)
                  ? "text-green-500 font-bold bg-green-100 rounded px-2 py-1"
                  : ""
              }
            >
              {p.name}
              {completedPs.includes(p.name) && (
                <span className="ml-1 text-xs text-green-600 font-semibold">✓</span>
              )}
            </a>
          </li>
        ))}
      </ul>
    </nav>
  );
}
