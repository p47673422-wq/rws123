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
  const QUIZ_TYPE = "ganesh-lord-ram";
  const QUIZ_TITLE = "Ganesh Lord Ram Quiz";
  const MAX_SCORE = 5;
  const quizQuestions = [
  {
    question: "What was the condition of the race among the Devatās?",
    options: [
      "Whoever runs the fastest will be worshipped first",
      "Whoever circumambulates the universe three times will be worshipped first",
      "Whoever flies the highest will be worshipped first",
      "Whoever collects the most flowers will be worshipped first"
    ],
    answer: "Whoever circumambulates the universe three times will be worshipped first"
  },
  {
    question: "Why couldn’t Gaṇeśa compete in the race like others?",
    options: [
      "His vehicle was slow – a tiny mouse",
      "He was afraid",
      "He was too tired",
      "He didn’t want to win"
    ],
    answer: "His vehicle was slow – a tiny mouse"
  },
  {
    question: "Who revealed the secret to Gaṇeśa during the race?",
    options: [
      "Indra",
      "Śiva",
      "Nārada Muni",
      "Kārtikeya"
    ],
    answer: "Nārada Muni"
  },
  {
    question: "What lesson do we learn from this story?",
    options: [
      "The holy name of the Lord is greater than the whole universe",
      "Running fast is most important",
      "One must always ignore saints to win",
      "Speed and strength decide real victory"
    ],
    answer: "The holy name of the Lord is greater than the whole universe"
  },
  {
    question: "What did Gaṇeśa do instead of circling the whole universe?",
    options: [
      "He gave up the race",
      "He wrote “Rāma” and circled the holy name three times",
      "He went to sleep",
      "He hid from the other Devatās"
    ],
    answer: "He wrote “Rāma” and circled the holy name three times"
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
      <div className="comeCustomBox1">
        <button className="back-btn" onClick={() => window.history.back()}>← Back</button>
        <h2 className="fancyTitle event-title" style={{textAlign: 'center', marginBottom: '1.5rem'}}>The Story of Lord Gaṇeśa and the Name “Rāma”</h2>
        <div className="event-detail-img-wrap" style={{display: 'flex', justifyContent: 'center', alignItems: 'center', marginBottom: '2rem'}}>
          <Image src="/images/icon.png" alt="Lord Ganesh" width={650} height={1000} style={{objectFit: 'contain', borderRadius: '1.2rem', boxShadow: '0 4px 32px rgba(0,0,0,0.10)'}} />
        </div>
        <div className="event-detail-content" style={{margin: '0 auto', borderRadius: '1.2rem', padding: '2rem 1.2rem', boxShadow: '0 2px 16px rgba(0,0,0,0.07)'}}>
          <ul className="event-detail-list" style={{fontSize: '1.08rem', lineHeight: '1.8', paddingLeft: '1.2rem'}}>
            <li>Once, the Devatās had a race: whoever goes around the universe three times will be worshipped first.</li>
            <li>All the Devatās rushed off on their fast vehicles</li>
            <li>Gaṇeśa’s vehicle was a tiny mouse, so he knew he could not compete.</li>
            <li>On the way, he met Nārada Muni, who revealed a secret:</li>
              <ul className="event-detail-list" style={{fontSize: '1.08rem', lineHeight: '1.8', paddingLeft: '1.8rem', listStyleType: "circle"}}>
                <li>Kṛṣānu (Fire) exists because of “ra”</li>
                <li>bhānu (Sun) exists because of “a”</li>
                <li>Himakara (Moon) exists because of “ma”</li>
                <li>Together it forms “Rāma” – the origin of the whole universe.</li>
              </ul>
            <li>Gaṇeśa wrote “Rāma” on the ground and went around it three times.</li>
            <li>In this way, he circumambulated the whole universe, because the holy name is greater than the universe itself.</li>
            <li>Pleased, the Devatās blessed Gaṇeśa to be worshipped first in every ceremony.</li>
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

