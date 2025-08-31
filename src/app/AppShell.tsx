"use client";
import React, { useState, useEffect, useRef } from "react";
import Image from "next/image";

declare global {
  interface Window {
    google?: any;
    googleTranslateElementInit?: () => void;
  }
}

const bgImages = [
  "/bg1.png",
  "/bg2.png",
  "/bg3.png",
  "/bg4.png",
];

import { FaGlobe } from "react-icons/fa";
import { IoClose } from "react-icons/io5";


function GoogleTranslate() {
  const ref = useRef<HTMLDivElement>(null);
  const [expanded, setExpanded] = useState(false);
  const [loading, setLoading] = useState(false);
  const [widgetLoaded, setWidgetLoaded] = useState(false);

  useEffect(() => {
    // Load Google Translate widget on mount, but keep hidden until expanded
    if (window.google && window.google.translate) {
      setWidgetLoaded(true);
      setLoading(false);
      return;
    }
    setLoading(true);
    window.googleTranslateElementInit = function () {
      new window.google.translate.TranslateElement({
        pageLanguage: 'en',
        includedLanguages: 'en,hi,te',
        layout: window.google.translate.TranslateElement.InlineLayout.SIMPLE,
        autoDisplay: false
      }, 'google_translate_element');
      setLoading(false);
      setWidgetLoaded(true);
    };
    const script = document.createElement('script');
    script.src = "https://translate.google.com/translate_a/element.js?cb=googleTranslateElementInit";
    script.async = true;
    document.body.appendChild(script);
    // Fallback: if widget doesn't load in 3s, stop loading
    const timeout = setTimeout(() => setLoading(false), 3000);
    return () => clearTimeout(timeout);
  }, []);

  // Hide widget when clicking outside
  useEffect(() => {
    function handleClick(e: MouseEvent) {
      if (ref.current && !ref.current.contains(e.target as Node)) {
        setExpanded(false);
      }
    }
    if (expanded) document.addEventListener('mousedown', handleClick);
    return () => document.removeEventListener('mousedown', handleClick);
  }, [expanded]);

  return (
    <div
      style={{
        position: 'fixed',
        bottom: 24,
        right: 24,
        zIndex: 1000,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        background: expanded ? 'linear-gradient(90deg, #ffe082 10%, #fffde4 90%)' : 'transparent',
        borderRadius: expanded ? '2rem' : '50%',
        boxShadow: expanded ? '0 4px 18px rgba(0,0,0,0.18)' : 'none',
        minWidth: expanded ? 220 : 48,
        minHeight: 48,
        width: expanded ? 260 : 48,
        height: 48,
        transition: 'all 0.25s cubic-bezier(.4,2,.6,1)',
        border: expanded ? '2px solid #ffe082' : '2px solid transparent',
        opacity: expanded ? 1 : 0.5,
        cursor: 'pointer',
      }}
      ref={ref}
      onClick={() => !expanded && setExpanded(true)}
      onMouseEnter={() => !expanded && (ref.current!.style.opacity = '0.85')}
      onMouseLeave={() => !expanded && (ref.current!.style.opacity = '0.5')}
    >
      {!expanded && (
        <FaGlobe size={24} color="#bfa100" style={{ margin: 'auto' }} />
      )}
      {/* Always render the widget container, but hide it unless expanded */}
      <div
        id="google_translate_element"
        style={{
          display: expanded ? 'flex' : 'none',
          alignItems: 'center',
          minWidth: 140,
          minHeight: 36,
          fontWeight: 600,
          fontSize: 16,
          color: '#222',
          marginLeft: 12,
          marginRight: 8,
          flex: 1,
        }}
      />
      {expanded && (
        <>
          {loading && (
            <span style={{ color: '#bfa100', fontSize: 14, marginLeft: 8 }}>Loading…</span>
          )}
          <button
            type="button"
            aria-label="Close translate"
            style={{
              background: 'none',
              border: 'none',
              marginLeft: 4,
              color: '#bfa100',
              fontSize: 22,
              cursor: 'pointer',
              borderRadius: '50%',
              width: 32,
              height: 32,
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              transition: 'background 0.18s',
            }}
            onClick={e => { e.stopPropagation(); setExpanded(false); }}
          >
            <IoClose />
          </button>
        </>
      )}
    </div>
  );
}

export default function AppShell({ children }: { children: React.ReactNode }) {
  const [bgIndex, setBgIndex] = useState(0);
  useEffect(() => {
    const interval = setInterval(() => {
      setBgIndex((prev) => (prev + 1) % bgImages.length);
    }, 4000);
    return () => clearInterval(interval);
  }, []);
  return (
    <>
      <GoogleTranslate />
      <div className="w-full min-h-screen flex flex-col items-center justify-center relative overflow-hidden">
        {/* Sliding background image */}
        <div className="absolute inset-0 w-full h-full -z-20">
          <Image
            src={bgImages[bgIndex]}
            alt="Background"
            fill
            style={{ objectFit: "cover", transition: "opacity 0.7s" }}
            className="animate-fadein"
            priority
          />
          {/* Dark overlay for better content visibility */}
          {/* <div className="absolute inset-0 bg-black/60 backdrop-blur-[8px]" /> */}
        </div>
        {/* <div className="flex flex-col items-center w-full z-20 mt-8 mb-4">
          <Image src="/iskcon-logo.png" alt="ISKCON Logo" width={400} height={100} className="mb-2 rounded-full text-center shadow-lg border-4 border-white/30" />
          <h1 className="mt-2 text-center fancyTitle">Welcome to Isckon Radha Madan Mohan</h1>
        </div> */}
        <main className="w-full flex flex-col items-center justify-center z-10">
          {children}
        </main>
      </div>
    </>
  );
}
