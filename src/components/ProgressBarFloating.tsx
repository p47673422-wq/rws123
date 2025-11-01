"use client";
import React, { useState, useRef, useEffect } from "react";

import "../app/home/home-custom.css";

interface ProgressBarFloatingProps {
  progress: number;
  completedPs: string[];
  psList: string[];
}

const psColors: Record<string, string> = {
  Prepare: "bg-blue-400",
  Pray: "bg-purple-400",
  Perform: "bg-yellow-400",
  Participate: "bg-green-400",
  Purchase: "bg-pink-400",
  Perfect: "bg-orange-400",
  Perceive: "bg-cyan-400",
  Pledge: "bg-red-400",
};

export const ProgressBarFloating: React.FC<ProgressBarFloatingProps> = ({ completedPs }) => {
  const percent = Math.min(100, completedPs.length * 12.5);

  // Drag logic
  const [pos, setPos] = useState<{x: number, y: number}>(() => {
    if (typeof window !== "undefined") {
      const saved = localStorage.getItem("progressBarPos");
      if (saved) return JSON.parse(saved);
    }
    return { x: 24, y: 24 };
  });
  const dragRef = useRef<HTMLDivElement>(null);
  const dragging = useRef(false);
  const offset = useRef({ x: 0, y: 0 });

  useEffect(() => {
    function onMouseMove(e: MouseEvent) {
      if (!dragging.current) return;
      setPos(prev => {
        const newPos = { x: e.clientX - offset.current.x, y: e.clientY - offset.current.y };
        localStorage.setItem("progressBarPos", JSON.stringify(newPos));
        return newPos;
      });
    }
    function onMouseUp() { dragging.current = false; }
    window.addEventListener("mousemove", onMouseMove);
    window.addEventListener("mouseup", onMouseUp);
    return () => {
      window.removeEventListener("mousemove", onMouseMove);
      window.removeEventListener("mouseup", onMouseUp);
    };
  }, []);

  function onDragStart(e: React.MouseEvent) {
    dragging.current = true;
    const rect = dragRef.current?.getBoundingClientRect();
    offset.current = {
      x: e.clientX - (rect?.left ?? 0),
      y: e.clientY - (rect?.top ?? 0)
    };
  }

  // Responsive: show circle on left for mobile, bar for desktop
  const [isMobile, setIsMobile] = useState(false);
  useEffect(() => {
    const checkMobile = () => setIsMobile(window.innerWidth <= 600);
    checkMobile();
    window.addEventListener('resize', checkMobile);
    return () => window.removeEventListener('resize', checkMobile);
  }, []);

  // Animation: fade in/out on update
  const [fade, setFade] = useState(false);
  useEffect(() => {
    setFade(true);
    const t = setTimeout(() => setFade(false), 1200);
    return () => clearTimeout(t);
  }, [percent]);

  if (isMobile) {
    return (
      <div
        ref={dragRef}
        className={`progressbar-floating-circle ${fade ? 'progressbar-fade' : ''}`}
        style={{
          left: 12,
          top: '50%',
          transform: 'translateY(-50%)',
          position: 'fixed',
          zIndex: 1000,
          cursor: 'move',
          width: 64,
          height: 64,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          background: 'rgba(255,224,130,0.85)',
          borderRadius: '50%',
          boxShadow: '0 2px 12px #0002',
          border: '3px solid #ffe082',
          transition: 'background 0.5s, opacity 0.7s',
          opacity: fade ? 0.5 : 1,
        }}
        onMouseDown={onDragStart}
      >
        <svg width="56" height="56" viewBox="0 0 56 56">
          <circle cx="28" cy="28" r="24" stroke="#fff" strokeWidth="6" fill="none" opacity="0.25" />
          <circle
            cx="28"
            cy="28"
            r="24"
            stroke="#2196f3"
            strokeWidth="6"
            fill="none"
            strokeDasharray={2 * Math.PI * 24}
            strokeDashoffset={2 * Math.PI * 24 * (1 - percent / 100)}
            style={{ transition: 'stroke-dashoffset 1s cubic-bezier(.4,2,.6,1)' }}
          />
        </svg>
        <div style={{
          position: 'absolute',
          left: 0, top: 0, width: '100%', height: '100%',
          display: 'flex', alignItems: 'center', justifyContent: 'center',
          fontWeight: 700, fontSize: 18, color: '#222',
          textShadow: '0 1px 4px #fff8',
          pointerEvents: 'none',
        }}>{percent}%</div>
      </div>
    );
  }

  // Desktop fallback: keep bar
  return (
    <div
      ref={dragRef}
      suppressHydrationWarning
      className="progressbar-floating-google"
      style={{ left: pos.x, top: pos.y, position: "fixed", zIndex: 1000, cursor: "move" }}
      onMouseDown={onDragStart}
    >
      <div className="progressbar-floating-google-inner">
        <div className="progressbar-floating-title">8Ps Progress</div>
        <div className="progressbar-bar-outer-google" style={{ background: '#ffe082', position: 'relative' }}>
          <div
            className="progressbar-bar-inner-google"
            style={{ width: `${percent}%`, background: '#fff', position: 'absolute', left: 0, top: 0, height: '100%' }}
          ></div>
          <div className="progressbar-bar-label-google">
            {percent}%
          </div>
        </div>
      </div>
    </div>
  );
};
