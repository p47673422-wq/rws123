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
  const QUIZ_TYPE = "ganesh-narshima";
  const QUIZ_TITLE = "Ganesh Narshima Quiz";
  const MAX_SCORE = 5;
  const quizQuestions = [
  {
    question: "Which Purāṇa mentions the connection between Lord Gaṇeśa and Lord Narasiṁhadeva?",
    options: [
      "Viṣṇu Purāṇa",
      "Nārasiṁha Purāṇa",
      "Garuḍa Purāṇa",
      "Padma Purāṇa"
    ],
    answer: "Nārasiṁha Purāṇa"
  },
  {
    question: "According to the verse, who should be remembered first before worshipping Gaṇeśa?",
    options: [
      "Indra",
      "Nārada Muni",
      "Lord Narasiṁhadeva",
      "Lord Śiva"
    ],
    answer: "Lord Narasiṁhadeva"
  },
  {
    question: "From whom did Gaṇeśa receive the power to remove obstacles (Vighna-vināyaka)?",
    options: [
      "From his own penance",
      "From Lord Śiva",
      "From Lord Narasiṁhadeva",
      "From Goddess Pārvatī"
    ],
    answer: "From Lord Narasiṁhadeva"
  },
  {
    question: "What lesson does this pastime teach us about Gaṇeśa?",
    options: [
      "He is independent and supreme",
      "His greatness is in being a devotee of the Supreme Lord",
      "He only gives material blessings",
      "He is equal to Kṛṣṇa"
    ],
    answer: "His greatness is in being a devotee of the Supreme Lord"
  },
  {
    question: "How can we also receive true blessings like Gaṇeśa?",
    options: [
      "By running very fast",
      "By worshipping the Lord and serving His devotees",
      "By asking for material wealth",
      "By ignoring the scriptures"
    ],
    answer: "By worshipping the Lord and serving His devotees"
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
        <h2 className="fancyTitle event-title" style={{textAlign: 'center', marginBottom: '1.5rem'}}>Lord Gaṇeśa and Lord Narasiṁhadeva</h2>
        <div className="event-detail-img-wrap" style={{display: 'flex', justifyContent: 'center', alignItems: 'center', marginBottom: '2rem'}}>
          <Image src="/images/icon4.png" alt="Lord Ganesh" width={650} height={1000} style={{objectFit: 'contain', borderRadius: '1.2rem', boxShadow: '0 4px 32px rgba(0,0,0,0.10)'}} />
        </div>
        <div className="event-detail-content" style={{margin: '0 auto', borderRadius: '1.2rem', padding: '2rem 1.2rem', boxShadow: '0 2px 16px rgba(0,0,0,0.07)'}}>
          <div style={{fontSize: '1.12rem', lineHeight: '1.8', paddingLeft: '0.5rem', textAlign: 'center'}}>
            <div style={{marginBottom: '1.2rem', fontWeight: 600}}>
              In the <b>Nārasiṁha Purāṇa</b>, there is a prayer connecting Lord Gaṇeśa with Lord Narasiṁhadeva:<br/>
              <span style={{display: 'block', margin: '1rem 0', fontStyle: 'italic', fontSize: '1.05rem', color: '#c44f00'}}>
                iti matvā mahādevaṁ narasiṁhaṁ janārdanam<br/>
                gaṇeśaṁ bhāvayet paścāt tasya mantraṁ samuccaret<br/>
                (Nārasiṁha Purāṇa 41.55)
              </span>
              <span style={{fontWeight: 500}}>Meaning:<br/>First remember Lord Narasiṁha as the Supreme Lord, then worship Gaṇeśa.</span>
            </div>
            <div style={{marginBottom: '1.2rem', textAlign: 'left', maxWidth: '600px', margin: '0 auto'}}>
              <b>The Story</b><br/>
              Once Gaṇeśa prayed to Lord Narasiṁhadeva for blessings.<br/><br/>
              Narasiṁha, pleased with his devotion, gave Gaṇeśa the power to remove obstacles (Vighna-vināyaka).<br/><br/>
              From that time, Gaṇeśa is worshipped as the remover of obstacles — but his power comes from the blessings of the Lord.<br/><br/>
              Thus, whenever devotees worship Gaṇeśa, they remember he is a servant of the Supreme Lord, not independent.
            </div>
            <div style={{marginBottom: '1.2rem', textAlign: 'left', maxWidth: '600px', margin: '0 auto'}}>
              <b>Simple Lessons</b>
              <ul style={{fontSize: '1.08rem', lineHeight: '1.8', paddingLeft: '1.2rem', marginTop: '0.7rem'}}>
                <li>Gaṇeśa is great because he is a devotee of the Lord.</li>
                <li>His strength to remove obstacles comes from Lord Narasiṁha.</li>
                <li>We also receive blessings when we worship the Lord and serve His devotees.</li>
              </ul>
            </div>
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

