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
  const QUIZ_TYPE = "ganesh-blessing";
  const QUIZ_TITLE = "Ganesh Blessing Quiz";
  const MAX_SCORE = 5;
  const quizQuestions = [
  {
    question: "Whatever we ask with our body, words, mind, or heart should be dedicated to whom?",
    options: [
      "Lord Śiva",
      "Lord Kṛṣṇa",
      "Lord Gaṇeśa",
      "Goddess Lakṣmī"
    ],
    answer: "Lord Kṛṣṇa"
  },
  {
    question: "How should we pray to Lord Gaṇeśa?",
    options: [
      "With pride and confidence",
      "With humility, asking Him to guide us to what is right",
      "By demanding what we want",
      "By remaining silent"
    ],
    answer: "With humility, asking Him to guide us to what is right"
  },
  {
    question: "What is the role of Lord Gaṇeśa and other deities in our prayers?",
    options: [
      "To give us whatever material things we ask for",
      "To send us to the Supreme Lord, Śrī Kṛṣṇa",
      "To test our patience",
      "To grant only wealth and prosperity"
    ],
    answer: "To send us to the Supreme Lord, Śrī Kṛṣṇa"
  },
  {
    question: "When we pray to Lord Gaṇeśa, what should we ask Him to remove?",
    options: [
      "Our hunger",
      "Our debts",
      "Inauspiciousness from our mind, heart, and life",
      "Our material possessions"
    ],
    answer: "Inauspiciousness from our mind, heart, and life"
  },
  {
    question: "What is true happiness according to our scriptures?",
    options: [
      "Having lots of money",
      "Material pleasures",
      "Knowledge that brings us closer to Lord Kṛṣṇa and frees us from misery",
      "Winning competitions"
    ],
    answer: "Knowledge that brings us closer to Lord Kṛṣṇa and frees us from misery"
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
        <h2 className="fancyTitle event-title" style={{textAlign: 'center', marginBottom: '1.5rem'}}>Asking Blessings On Ganesh Chaturthi</h2>
        <div className="event-detail-img-wrap" style={{display: 'flex', justifyContent: 'center', alignItems: 'center', marginBottom: '2rem'}}>
          <Image src="/images/icon3.png" alt="Lord Ganesh" width={650} height={1000} style={{objectFit: 'contain', borderRadius: '1.2rem', boxShadow: '0 4px 32px rgba(0,0,0,0.10)'}} />
        </div>
        <div className="event-detail-content" style={{margin: '0 auto', borderRadius: '1.2rem', padding: '2rem 1.2rem', boxShadow: '0 2px 16px rgba(0,0,0,0.07)'}}>
          <div style={{fontSize: '1.12rem', lineHeight: '1.8', paddingLeft: '0.5rem', textAlign: 'center'}}>
            <div style={{marginBottom: '1.2rem', fontWeight: 600}}>
              With whatever desire we worship Lord Ganesha, we will get what we want.<br/>
              <span style={{fontWeight: 700, color: '#c44f00'}}>But The Question is What We Should Ask For?</span>
            </div>
            <ul style={{textAlign: 'left', fontSize: '1.08rem', lineHeight: '1.8', paddingLeft: '1.2rem', margin: '0 auto', maxWidth: '600px'}}>
              <li>Whatever we ask with our body, words, mind, or heart should be dedicated to <b>Lord Kṛṣṇa</b>, who is beyond material qualities.</li>
              <li>We should pray with humility: <i>“O Lord, I don’t know what is good for me. Please guide me to what is right.”</i></li>
              <li>In this way, Lord Gaṇeśa and all other deities bless us by leading us to the Supreme Personality of Godhead, <b>Śrī Kṛṣṇa</b>.</li>
              <li>When we pray to Lord Gaṇeśa, we ask him to remove inauspiciousness from our mind, heart, and life.</li>
              <li>True happiness is not material pleasure — it is the knowledge that brings us closer to Lord Kṛṣṇa and frees us from misery.</li>
            </ul>
          </div>
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

