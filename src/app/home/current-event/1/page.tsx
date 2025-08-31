"use client";
import React, { useState, useEffect } from "react";
import Image from "next/image";
import "../eventResponsive.css";
import "../../home-custom.css";
import { isValidPhoneNumber } from "libphonenumber-js";
import { useRouter } from "next/navigation";

export default function GaneshSymbolismPage() {
  // ...existing code...
  // Quiz logic
  const QUIZ_TYPE = "ganesh-symbolism";
  const QUIZ_TITLE = "Ganesh Symbolism Quiz";
  const MAX_SCORE = 5;
  const quizQuestions = [
  {
    question: "What do Lord Gaṇeśa’s large ears teach us?",
    options: [
      "Talk more",
      "Listen more",
      "Sleep more",
      "Eat more"
    ],
    answer: "Listen more"
  },
  {
    question: "His big head symbolizes:",
    options: [
      "Strength",
      "Anger",
      "Wisdom and intelligence",
      "Power over others"
    ],
    answer: "Wisdom and intelligence"
  },
  {
    question: "What does the mouse, his vehicle, represent?",
    options: [
      "Desire that must be controlled",
      "Laziness",
      "Speed",
      "Darkness only"
    ],
    answer: "Desire that must be controlled"
  },
  {
    question: "The rope in Lord Gaṇeśa’s hand is for:",
    options: [
      "Binding animals",
      "Pulling us closer to God",
      "Tying desires",
      "Controlling enemies"
    ],
    answer: "Pulling us closer to God"
  },
  {
    question: "One tusk of Lord Gaṇeśa reminds us to:",
    options: [
      "Fight strongly",
      "Retain positive and throw away negative",
      "Eat more sweets",
      "Always be strict"
    ],
    answer: "Retain positive and throw away negative"
  }
];


  const [step, setStep] = useState("start");
  const [userId, setUserId] = useState<string | null>(null);
  const [userInfo, setUserInfo] = useState({ id: "",name: "", mobile: "", gender: "", address: "", maritalStatus: "" });
  const [answers, setAnswers] = useState(Array(quizQuestions.length).fill(""));
  const [score, setScore] = useState(0);
  const [submitted, setSubmitted] = useState(false);
  const [error, setError] = useState("");
  const [loadingUser, setLoadingUser] = useState(false);

  useEffect(() => {
    if (typeof window !== "undefined") {
      const storedId = localStorage.getItem("userId1");
      if (storedId) {
        setUserId(storedId);
        setLoadingUser(true);
        const storedUserInfo = localStorage.getItem("userInfo1");
        if (storedUserInfo) {
          try {
            const parsed = JSON.parse(storedUserInfo);
            setUserInfo({
              id: storedId,
              name: parsed.name || "",
              mobile: parsed.mobile || "",
              gender: parsed.gender || "",
              address: parsed.address || "",
              maritalStatus: parsed.maritalStatus || "",
            });
          } catch {
            // fallback to empty
          }
        }
        setLoadingUser(false);
      }
    }
  }, []);

  function handleProceed() {
    setStep("quiz");
  }

  function handleUserInfoChange(e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) {
    setUserInfo({ ...userInfo, [e.target.name]: e.target.value });
  }

  function isValidIndianMobile(mobile: string) {
      const cleaned = mobile.replace(/\D/g, "");
      if (!/^([6-9][0-9]{9})$/.test(cleaned)) return false;
      try {
        return isValidPhoneNumber(cleaned, 'IN');
      } catch {
        return false;
      }
    }

  async function handleUserInfoSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    if (!userInfo.name || !userInfo.mobile || !userInfo.gender || !userInfo.address || !userInfo.maritalStatus) {
      setError("Please fill all details.");
      return;
    }
    if (!isValidIndianMobile(userInfo.mobile)) {
      setError("Please enter a valid mobile number.");
      return;
    }
    setError("");
    const res = await fetch("/api/quiz/submit", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(
        { ...userInfo, answers: [], score, quizType: QUIZ_TYPE, quizTitle: QUIZ_TITLE, maxScore: MAX_SCORE }
      ),
    });
    const data = await res.json();
    if (data.success && data.userId) {
      setUserId(data.userId);
      if (typeof window !== "undefined") {
        localStorage.setItem("userInfo1", JSON.stringify(userInfo));
        localStorage.setItem("userId1", data.userId);
      }
      setSubmitted(true);
      setStep("result");
    } else {
      setError("Could not save user info. Try again.");
    }
  }

  function handleAnswer(idx: number, value: string) {
    const newAnswers = [...answers];
    newAnswers[idx] = value;
    setAnswers(newAnswers);
  }

  async function handleQuizSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    let newScore = 0;
    quizQuestions.forEach((q, i) => {
      if (answers[i] === q.answer) newScore++;
    });
    setScore(newScore);
    setStep("result");
    if (userId) {
      userInfo.id = userId;
      await fetch("/api/quiz/submit", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ ...userInfo, answers, score: newScore, quizType: QUIZ_TYPE, quizTitle: QUIZ_TITLE, maxScore: MAX_SCORE }),
      });
      setSubmitted(true);
      setStep("result");
    } else {
      setStep("userinfo");
    }
  }

  return (
    <div className="content-overlay">
      <div className="comeCustomBox1 current-event-shell responsive-event-shell event-detail-fadein">
        <button className="back-btn" onClick={() => window.history.back()}>← Back</button>
        <h2 className="fancyTitle event-title" style={{textAlign: 'center', marginBottom: '1.5rem'}}>Simple Symbolism of Lord Gaṇeśa</h2>
        <div className="event-detail-img-wrap" style={{display: 'flex', justifyContent: 'center', alignItems: 'center', marginBottom: '2rem'}}>
          <Image src="/images/sym.png" alt="Lord Ganesh" width={650} height={1000} style={{objectFit: 'contain', borderRadius: '1.2rem', boxShadow: '0 4px 32px rgba(0,0,0,0.10)'}} />
        </div>
        <div className="event-detail-content" style={{margin: '0 auto', borderRadius: '1.2rem', padding: '2rem 1.2rem', boxShadow: '0 2px 16px rgba(0,0,0,0.07)'}}>
          <ul className="event-detail-list" style={{fontSize: '1.08rem', lineHeight: '1.8', paddingLeft: '1.2rem'}}>
            <li><b>Large Ears</b> → Listen more. Gaṇeśa hears everyone’s prayers and gives what is truly needed.</li>
            <li><b>Big Head</b> → Think big. Represents wisdom, intelligence, and clear thinking.</li>
            <li><b>Small Eyes</b> → Concentrate. Focus and pay attention.</li>
            <li><b>Small Mouth</b> → Talk less. Listen more, speak less.</li>
            <li><b>Large Trunk</b> → Be adaptable. Success requires flexibility.</li>
            <li><b>Large Stomach</b> → Digest all of life. Accept good and bad with peace.</li>
            <li><b>Mouse (Vehicle)</b> → Control desires. Ride over desires instead of being ruled by them.</li>
            <li><b>Modak (Sweet)</b> → Reward of devotion. Symbol of the sweet results of spiritual practice.</li>
            <li><b>Axe</b> → Cut attachments. Removes obstacles from the devotee’s path.</li>
            <li><b>Rope</b> → Pulls us closer to God. Guides us gently to the spiritual path.</li>
            <li><b>One Tusk</b> → Keep the positive, drop the negative. Symbol of overcoming duality.</li>
            <li><b>Four Arms</b> → Mind, Intellect, Ego, and Conscience – all guided by pure consciousness.</li>
            <li><b>Legs</b> → Balance life. One in the spiritual world, one in the material world.</li>
            <li><b>Forehead (Trishul)</b> → Mastery over time – past, present, and future.</li>
          </ul>
        </div>
        {/* Quiz Section */}
        <div className="fancy-quiz-box mt-8 p-6 rounded-2xl shadow-xl bg-gradient-to-br from-yellow-50 to-yellow-100 max-w-xl mx-auto">
          {step === "start" && (
            <button className="fancy-btn px-6 py-3 rounded-full bg-gradient-to-r from-yellow-400 to-yellow-600 text-white font-bold shadow-lg hover:scale-105 transition" onClick={handleProceed}>
              Proceed to Quiz
            </button>
          )}
          {step === "userinfo" && (
            <form className="flex flex-col gap-4 items-center" onSubmit={handleUserInfoSubmit}>
              <input className="input-fancy" name="name" type="text" placeholder="Your Name" value={userInfo.name} onChange={handleUserInfoChange} />
              <input className="input-fancy" name="mobile" type="tel" placeholder="Mobile Number" value={userInfo.mobile} onChange={handleUserInfoChange} 
               maxLength={10}
               pattern="[6-9]{1}[0-9]{9}"
               inputMode="numeric"
              />
              <select className="input-fancy" name="gender" value={userInfo.gender} onChange={handleUserInfoChange}>
                <option value="">Select Gender</option>
                <option value="Male">Male</option>
                <option value="Female">Female</option>
              </select>
              <select className="input-fancy" name="maritalStatus" value={userInfo.maritalStatus} onChange={handleUserInfoChange}>
                <option value="">Select Marital Status</option>
                <option value="Single">Single</option>
                <option value="Married">Married</option>
              </select>
              <input className="input-fancy" name="address" type="text" placeholder="Address" value={userInfo.address} onChange={handleUserInfoChange} />
              {error && <div className="text-red-500 text-sm">{error}</div>}
              <button className="fancy-btn px-6 py-2 rounded-full bg-yellow-500 text-white font-bold shadow hover:bg-yellow-600" type="submit">Continue to Quiz</button>
            </form>
          )}
          {step === "quiz" && (
            <form className="flex flex-col gap-6" onSubmit={handleQuizSubmit}>
              {quizQuestions.map((q, idx) => (
                <div key={idx} className="quiz-question-box p-4 rounded-xl bg-white shadow">
                  <div className="font-semibold mb-2">{q.question}</div>
                  {q.options.map(opt => (
                    <label key={opt} className="flex items-center gap-2 mb-1">
                      <input type="radio" name={`q${idx}`} checked={answers[idx] === opt} onChange={() => handleAnswer(idx, opt)} />
                      <span>{opt}</span>
                    </label>
                  ))}
                </div>
              ))}
              <button className="fancy-btn px-6 py-2 rounded-full bg-green-500 text-white font-bold shadow hover:bg-green-600 mt-4" type="submit">Submit Quiz</button>
            </form>
          )}
          {step === "result" && (
            <div className="text-center">
              <div className="text-2xl font-bold mb-2">Quiz Completed!</div>
              <div className="text-lg mb-4">You scored <span className="text-green-600 font-bold">{score}</span> out of {quizQuestions.length}!</div>
              {submitted && <div className="text-sm text-gray-500">Your attempt has been recorded. Thank you!</div>}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

