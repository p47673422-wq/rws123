"use client";
import React, { useEffect, useState } from "react";
import { useRouter } from "next/navigation";

// Save user details via API
async function saveUserDetails(details: any) {
  try {
    const res = await fetch("/api/user/get", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(details),
    });
    const data = await res.json();
    if (data.success) {
      if (typeof window !== "undefined") {
        localStorage.setItem("userDetails", JSON.stringify(details));
      }
    }
  } catch (err) {
    console.error("User details save failed", err);
  }
}

const QUESTIONS = [
  {
    id: 1,
    text: "Ravana worshiped whom? Was Ravana's worship a love for that personality (selfless) or a use of that personality (selfish)?",
    options: [
      "A Lord Shiva with selfless love",
      "B Lord Shiva with Selfish motive",
      "C Lord Brahma with Selfless love",
      "D Lord Brahma with Selfish motive"
    ],
    correct: ["B","D"],
    multiple: true
  },
  // ... (add all other questions from the original array here) ...
];

function VictoryModal({ onGift, onCounselling, answers }) {
  const QUESTIONS = [
        <div className="flex flex-col gap-4 items-center">
          <button className="px-8 py-3 rounded-2xl font-bold text-white bg-gradient-to-r from-pink-400 via-yellow-400 to-green-400 shadow-lg glow-effect hover:scale-105 transition-all duration-300 animate-pulse text-lg" onClick={onGift}>Claim Your Gift</button>
          <button className="px-8 py-3 rounded-2xl font-bold text-pink-700 bg-yellow-200 border-2 border-pink-400 shadow hover:bg-yellow-300 transition-all duration-300 text-lg" onClick={onCounselling}>Free Counselling</button>
        </div>
      </div>
      <style jsx global>{`
        .flower-confetti::before {
          content: "";
          position: fixed;
          left: 0; top: 0; width: 100vw; height: 100vh;
          pointer-events: none;
          z-index: 9999;
          background-image: url('/images/lotus-petal.png');
          background-repeat: repeat;
          opacity: 0.22;
          animation: lotusConfetti 2.2s linear;
        }
        @keyframes lotusConfetti {
          0% { opacity: 0.22; }
          100% { opacity: 0; }
        }
        .lotus-bg {
          background-image: url('/images/lotus-petal.png');
          background-repeat: repeat;
          background-size: 120px;
          opacity: 0.98;
        }
        .fade-in {
          animation: fadeIn 0.7s cubic-bezier(.4,0,.2,1);
        }
        @keyframes fadeIn {
          0% { opacity: 0; transform: scale(0.98); }
          100% { opacity: 1; transform: scale(1); }
        }
      `}</style>
    </div>
  );
}

export default function Journey() {
  const router = useRouter();
  // State declarations
  const [allAnswers, setAllAnswers] = useState([]);
  const [showVictory, setShowVictory] = useState(false);
  const [finalHitActive, setFinalHitActive] = useState(false);
  const [showUserDetailsModal, setShowUserDetailsModal] = useState(false);
  const [userForm, setUserForm] = useState({ name: "", mobile: "", address: "", gender: "", maritalStatus: "" });
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [selectedAnswers, setSelectedAnswers] = useState([]);
  const [explanation, setExplanation] = useState("");
  const [showQuestionCard, setShowQuestionCard] = useState(false);
  const [showResultPopup, setShowResultPopup] = useState(false);
  const [resultCorrect, setResultCorrect] = useState(null);
  const TOTAL_HEADS = 10;
  const [heads, setHeads] = useState(Array.from({ length: TOTAL_HEADS }, (_, i) => i));
  const [turnRight, setTurnRight] = useState(false);
  const [flyingHead, setFlyingHead] = useState(null);
  const [arrowActive, setArrowActive] = useState(false);
  const [fireballActive, setFireballActive] = useState(false);
  const [jivaSteps, setJivaSteps] = useState(0);
  const [showIntro, setShowIntro] = useState(false);
  const [quizStarted, setQuizStarted] = useState(false);

  const progress = ((currentQuestionIndex + (showResultPopup ? 1 : 0)) / QUESTIONS.length) * 100;

  useEffect(() => {
    if (!showQuestionCard && selectedAnswers.length > 0) {
      setAllAnswers(prev => {
        const updated = [...prev];
        updated[currentQuestionIndex] = {
          text: QUESTIONS[currentQuestionIndex]?.text,
          selected: selectedAnswers,
          explanation,
        };
        return updated;
      });
    }
  }, [showQuestionCard]);

  async function saveQuizAttempt({ answers, timestamp }) {
    try {
      const userDetails = typeof window !== "undefined" ? JSON.parse(localStorage.getItem("userDetails") || "{}") : {};
      await fetch("/api/quiz/submit", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ ...userDetails, answers, timestamp, quizType: "divine-journey" }),
      });
    } catch (err) {
      console.error("Quiz attempt save failed", err);
    }
  }

  function playConchSound() {
    if (typeof window !== "undefined") {
      const audio = new Audio("/sounds/conch.mp3");
      audio.play();
    }
  }

  function playConfetti() {
    if (typeof window !== "undefined" && (window as any).confetti) {
      (window as any).confetti({
        particleCount: 120,
        spread: 90,
        origin: { y: 0.7 },
        shapes: ["circle"],
        colors: ["#fbbf24", "#f472b6", "#34d399", "#fff", "#fde68a"],
      });
    } else {
      document.body.classList.add("flower-confetti");
      setTimeout(() => document.body.classList.remove("flower-confetti"), 2200);
    }
  }

  const finalHit = async () => {
    setFinalHitActive(true);
    await new Promise(res => setTimeout(res, 1600));
    setFinalHitActive(false);
    setShowVictory(true);
  };

  const beginQuiz = () => {
    setQuizStarted(true);
    setShowIntro(false);
    setCurrentQuestionIndex(0);
    setSelectedAnswers([]);
    setExplanation("");
    setShowQuestionCard(true);
    setShowResultPopup(false);
    setResultCorrect(null);
  };

  // ...rest of quiz logic and JSX, unchanged except for structure fixes...
  // Utility functions
  async function saveUserDetails(details: any) {
    try {
      const res = await fetch("/api/user/get", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(details),
      });
      const data = await res.json();
      if (data.success) {
        if (typeof window !== "undefined") {
          localStorage.setItem("userDetails", JSON.stringify(details));
        }
      }
    } catch (err) {
      console.error("User details save failed", err);
    }
  }

  function playConchSound(): void {
    if (typeof window !== "undefined") {
      const audio = new Audio("/sounds/conch.mp3");
      audio.play();
    }
  }

  function playConfetti(): void {
    if (typeof window !== "undefined" && (window as any).confetti) {
      (window as any).confetti({
        particleCount: 120,
        spread: 90,
        origin: { y: 0.7 },
        shapes: ["circle"],
        colors: ["#fbbf24", "#f472b6", "#34d399", "#fff", "#fde68a"],
      });
    } else {
      document.body.classList.add("flower-confetti");
      setTimeout(() => document.body.classList.remove("flower-confetti"), 2200);
    }
  }

  async function saveQuizAttempt({ answers, timestamp }: { answers: any; timestamp: number }): Promise<void> {
    try {
      const userDetails = typeof window !== "undefined" ? JSON.parse(localStorage.getItem("userDetails") || "{}") : {};
      await fetch("/api/quiz/submit", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ ...userDetails, answers, timestamp, quizType: "divine-journey" }),
      });
    } catch (err) {
      console.error("Quiz attempt save failed", err);
    }
  }

  function VictoryModal({ onGift, onCounselling, answers }: { onGift: () => void; onCounselling: () => void; answers: any[] }) {
    useEffect(() => {
      playConfetti();
      playConchSound();
      const timestamp = Date.now();
      saveQuizAttempt({ answers, timestamp });
      if (typeof window !== "undefined") {
        localStorage.setItem("quiz_attempted", "true");
      }
    }, []);
    return (
      <div className="fixed inset-0 z-[130] flex items-center justify-center bg-yellow-100 bg-opacity-90 fade-in">
        <div className="bg-gradient-to-r from-pink-100 via-yellow-50 to-green-100 rounded-2xl shadow-lg p-12 text-center border-4 border-yellow-400 max-w-lg w-full lotus-bg">
          <h2 className="text-3xl font-bold text-pink-700 mb-4">Victory!</h2>
          <div className="mb-4 text-lg text-gray-800">By taking shelter of Lord Ram, you have conquered Ravana and the anarthas — lust, envy, anger, pride, greed, illusion.</div>
          <img src="/images/ram-victory.png" alt="Victory" className="mx-auto w-40 h-40 mb-6" />
          <div className="flex flex-col gap-4 items-center">
            <button className="px-8 py-3 rounded-2xl font-bold text-white bg-gradient-to-r from-pink-400 via-yellow-400 to-green-400 shadow-lg glow-effect hover:scale-105 transition-all duration-300 animate-pulse text-lg" onClick={onGift}>Claim Your Gift</button>
            <button className="px-8 py-3 rounded-2xl font-bold text-pink-700 bg-yellow-200 border-2 border-pink-400 shadow hover:bg-yellow-300 transition-all duration-300 text-lg" onClick={onCounselling}>Free Counselling</button>
          </div>
        </div>
        <style jsx global>{`
          .flower-confetti::before {
            content: "";
            position: fixed;
            left: 0; top: 0; width: 100vw; height: 100vh;
            pointer-events: none;
            z-index: 9999;
            background-image: url('/images/lotus-petal.png');
            background-repeat: repeat;
            opacity: 0.22;
            animation: lotusConfetti 2.2s linear;
          }
          @keyframes lotusConfetti {
            0% { opacity: 0.22; }
            100% { opacity: 0; }
          }
          .lotus-bg {
            background-image: url('/images/lotus-petal.png');
            background-repeat: repeat;
            background-size: 120px;
            opacity: 0.98;
          }
          .fade-in {
            animation: fadeIn 0.7s cubic-bezier(.4,0,.2,1);
          }
          @keyframes fadeIn {
            0% { opacity: 0; transform: scale(0.98); }
            100% { opacity: 1; transform: scale(1); }
          }
        `}</style>
      </div>
    );
  }
