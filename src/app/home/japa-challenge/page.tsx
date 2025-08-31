"use client";
import "../home-custom.css";
import React, { useRef, useState } from "react";
import { FaHome } from "react-icons/fa";
import Link from "next/link";
import { useRouter} from "next/navigation";

const text = "Hare Krishna Hare Krishna Krishna Krishna Hare Hare Hare Ram Hare Ram Ram Ram Hare Hare";
const words = text.split(" ");
// Example timings in seconds (start time for each word)
const timings = [0, 1.2, 1.7, 2.07, 2.7, 3.2, 3.6, 4.2, 4.7, 5.2, 5.5, 6.0, 6.4, 6.9, 7.3, 7.6];

export default function JapaChallengePage() {
  const router = useRouter();
  const audioRef = useRef<HTMLAudioElement>(null);
  const [currentWord, setCurrentWord] = useState(0);
  const [playCount, setPlayCount] = useState(() => {
    if (typeof window !== 'undefined') {
      const stored = localStorage.getItem('chantCount');
      return stored ? parseInt(stored) : 0;
    }
    return 0;
  });
  const [isPlaying, setIsPlaying] = useState(false);

  // Sync highlight with audio
  const handleTimeUpdate = () => {
    const audio = audioRef.current;
    if (!audio) return;
    const time = audio.currentTime;
    let wordIdx = timings.length - 1;
    for (let i = 0; i < timings.length; i++) {
      if (time < timings[i]) {
        wordIdx = i - 1;
        break;
      }
    }
    setCurrentWord(Math.max(0, wordIdx));
  };

  const handlePlayClick = () => {
    const audio = audioRef.current;
    if (!audio) return;

    audio.currentTime = 0; // restart from beginning
    audio.play();
    setPlayCount(prev => {
      const next = prev + 1;
      localStorage.setItem('chantCount', next.toString());
      // Save to DB if user info exists and count is multiple of 9
      const userInfo = localStorage.getItem('userInfo');
      if (userInfo && next % 9 === 0) {
        const mobile = JSON.parse(userInfo).mobile;
        if (mobile) {
          fetch('/api/japa/save', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ mobile, chantCount: next }),
          });
        }
      }
      return next;
    });
    setIsPlaying(true);
  };

  const handleEnded = () => {
    setIsPlaying(false);
    setCurrentWord(0);
  };

  return (
    <div className="content-overlay">
      <div className="homeCustomBox japa-main-box">
        <button className="back-btn" onClick={() => router.push("/home")}>← Back to Home</button>
        <h2 className="japa-title">Japa Challenge</h2>
        {/* Hidden audio element */}
        <audio
          ref={audioRef}
          src="/audio/japa.mp3"
          onTimeUpdate={handleTimeUpdate}
          onEnded={handleEnded}
          style={{ display: "none" }}
        />
        {/* Custom Play button */}
        <button
          className={`japa-play-btn${isPlaying ? ' playing' : ''}`}
          onClick={handlePlayClick}
          disabled={isPlaying}
        >
          ▶ Chant Mantra
        </button>
        {/* Play count */}
        <div className="japa-counter">Japa Counter: {playCount}</div>
        <div className="japa-mantra-box">
          {words.map((word, idx) => (
            <React.Fragment key={idx}>
              <span
                className={`japa-mantra-word${idx === currentWord ? ' active' : ''}`}
              >
                {word} {" "}
              </span>
              {(idx + 1) % 4 === 0 && <br />}
            </React.Fragment>
          ))}
        </div>
      </div>
    </div>
  );
}