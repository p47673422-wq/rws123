"use client";
import React, { useState, useEffect } from "react";
import PsMenuBar from "../8ps/PsMenuBar";
import "../home-custom.css";
import { FaHome } from "react-icons/fa";
import Link from "next/link";
import { useRouter} from "next/navigation";
import { isValidPhoneNumber } from "libphonenumber-js";

const QUIZ_TYPE = "mahaavatar";
const QUIZ_TITLE = "Mahaavatar Quiz";
const MAX_SCORE = 10;
const P_NAME = "Mahaavatar";
const TOTAL_PS = 8;

const questions = [
  { id: 1, type: "text", text: "Whose name made stones float, whose touch made stone alive, who rescued stone heavy heart from an ocean of sorrow across ocean", answer: "Rama" },
  { id: 2, type: "text", text: "Has all attributes of Krishna except colour", answer: "Balaram" },
  { id: 3, type: "text", text: "neither in night nor in day; neither inside nor outside; neither living nor dead", answer: "Narasimha" },
  { id: 4, type: "text", text: "The RESCUER of MOTHER EARTH", answer: "Varaha" },
  { id: 5, type: "text", text: "one who covered entire universe with 2 steps", answer: "Vamana" },
  { id: 6, type: "image", src: "/images/mahaavatar5.png", answer: "Matsya" },
  { id: 7, type: "image", src: "/images/mahaavatar4.png", answer: "Kurma" },
  { id: 8, type: "image", src: "/images/mahaavatar6.png", answer: "Parasuram" },
  { id: 9, type: "image", src: "/images/mahaavatar7.png", answer: "Buddha" },
  { id: 10, type: "text", text: "When people doesn’t change by any means, He enters the scene", answer: "Kalki" },
];

const answerImages = [
  { id: 1, src: "/images/ans_ram.png", label: "Rama" },
  { id: 2, src: "/images/ans_k.png", label: "Balaram" },
  { id: 3, src: "/images/ans_narasimha.png", label: "Narasimha" },
  { id: 4, src: "/images/ans_varaha.png", label: "Varaha" },
  { id: 5, src: "/images/ans_vamana.png", label: "Vamana" },
  { id: 6, src: "/images/ans_matsya.png", label: "Matsya" },
  { id: 7, src: "/images/ans_kurma.png", label: "Kurma" },
  { id: 8, src: "/images/ans_parashurama.png", label: "Parasuram" },
  { id: 9, src: "/images/ans_buddha.png", label: "Buddha" },
  { id: 10, src: "/images/ans_ka.png", label: "Kalki" }
];

export default function MahaavatarQuizPage() {
  const router = useRouter();
  const [userAnswers, setUserAnswers] = useState(Array(10).fill(""));
  const [submitted, setSubmitted] = useState(false);
  const [score, setScore] = useState(0);
  const [tab, setTab] = useState(0); // 0: first 5, 1: next 5
  const [userId, setUserId] = useState<string | null>(null);
  const [userInfo, setUserInfo] = useState({ id: "",name: "", mobile: "", gender: "", address: "", maritalStatus: "" });
  const [showUserInfo, setShowUserInfo] = useState(false);
  const [error, setError] = useState("");
  const [loadingUser, setLoadingUser] = useState(false);

  useEffect(() => {
    // Try to load userId from localStorage and fetch user info
    if (typeof window !== "undefined") {
      const storedId = localStorage.getItem("userId1");
      if (storedId) {
        setUserId(storedId);
        setLoadingUser(true);
        fetch(`/api/user/get?id=${storedId}`)
          .then(res => res.json())
          .then(data => {
            if (data.success && data.user) {
              setUserInfo({
                id: storedId,
                name: data.user.name,
                mobile: data.user.mobile,
                gender: data.user.gender,
                address: data.user.address,
                maritalStatus: data.user.maritalStatus,
              });
            }
          })
          .finally(() => setLoadingUser(false));
      }
    }
  }, []);

  const handleDrop = (qIdx: number, label: string) => {
    const newAnswers = [...userAnswers];
    newAnswers[qIdx] = label;
    setUserAnswers(newAnswers);
  };

  const handleUserInfoChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    setUserInfo({ ...userInfo, [e.target.name]: e.target.value });
  };

  function isValidIndianMobile(mobile: string) {
      // Remove spaces, dashes, etc.
      const cleaned = mobile.replace(/\D/g, "");
      // Static check: 10 digits, starts with 6-9
      if (!/^([6-9][0-9]{9})$/.test(cleaned)) return false;
      // Library check (libphonenumber-js)
      try {
        return isValidPhoneNumber(cleaned, 'IN');
      } catch {
        return false;
      }
    }

  const handleUserInfoSubmit = async (e: React.FormEvent) => {
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
    // Submit user info to quiz API to get userId
    const res = await fetch("/api/quiz/submit", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ ...userInfo, answers: [], score: 0, quizType: QUIZ_TYPE, quizTitle: QUIZ_TITLE, maxScore: MAX_SCORE }),
    });
    const data = await res.json();
    if (data.success && data.userId) {
      setUserId(data.userId);
      if (typeof window !== "undefined") {
        localStorage.setItem("userInfo1", JSON.stringify(userInfo));
        localStorage.setItem("userId1", data.userId);
      }
      setShowUserInfo(false);
    } else {
      setError("Could not save user info. Try again.");
    }
  };

  const handleSubmit = async () => {
    // If no userId, show form
    if (!userId) {
      setShowUserInfo(true);
      return;
    }
    let s = 0;
    questions.forEach((q, i) => {
      if (userAnswers[i] === q.answer) s++;
    });
    setScore(s);
    setSubmitted(true);
    userInfo.id = userId;
    // Save quiz attempt (no progress or P info for Mahaavatar)
    await fetch("/api/quiz/submit", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ ...userInfo, answers: userAnswers, score: s, quizType: QUIZ_TYPE, quizTitle: QUIZ_TITLE, maxScore: MAX_SCORE }),
    });
  };

  // Responsive: 2x5 grid for desktop, 1 question per screen for mobile
  const [windowWidth, setWindowWidth] = useState(1024);
  useEffect(() => {
    if (typeof window !== "undefined") {
      setWindowWidth(window.innerWidth);
      const handleResize = () => setWindowWidth(window.innerWidth);
      window.addEventListener("resize", handleResize);
      return () => window.removeEventListener("resize", handleResize);
    }
  }, []);
  const isMobile = windowWidth < 700;
  // For mobile, show only one question at a time
  const [mobileQIdx, setMobileQIdx] = useState(0);
  const showQuestions = isMobile ? [questions[mobileQIdx]] : questions;

  return (
    <div className="content-overlay">
      <div className="comeCustomBox1 quiz-main-box">
        <button className="back-btn" onClick={() => router.push("/home")}>← Back to Home</button>
        <h2 className="quiz-title">Mahaavatar Quiz</h2>
        <p className="quiz-desc">Drag the correct answer image below each question. Some questions are images, some are text. Good luck!</p>
        <div className="quiz-time">Time: 4 minutes</div>
        {showUserInfo && (
          <form className="quiz-user-form" onSubmit={handleUserInfoSubmit}>
            <div className="quiz-user-form-title">Please enter your details</div>
            <input className="quiz-user-input" name="name" placeholder="Name" value={userInfo.name} onChange={handleUserInfoChange} />
            <input className="quiz-user-input" name="mobile" placeholder="Mobile Number" value={userInfo.mobile} onChange={handleUserInfoChange} 
            maxLength={10}
              pattern="[6-9]{1}[0-9]{9}"
              inputMode="numeric"
            />
            <select className="quiz-user-input" name="gender" value={userInfo.gender} onChange={handleUserInfoChange}>
              <option value="">Select Gender</option>
              <option value="Male">Male</option>
              <option value="Female">Female</option>
            </select>
            <select className="quiz-user-input" name="maritalStatus" value={userInfo.maritalStatus} onChange={handleUserInfoChange}>
              <option value="">Select Marital Status</option>
              <option value="Single">Single</option>
              <option value="Married">Married</option>
            </select>
            <input className="quiz-user-input" name="address" placeholder="Address" value={userInfo.address} onChange={handleUserInfoChange} />
            {error && <div className="quiz-user-error">{error}</div>}
            <button className="quiz-user-btn" type="submit">Save & Continue</button>
          </form>
        )}
        {isMobile && !showUserInfo && (
          <div className="quiz-mobile-nav">
            <button className="quiz-mobile-btn" onClick={() => setMobileQIdx(Math.max(0, mobileQIdx - 1))} disabled={mobileQIdx === 0}>Prev</button>
            <button className="quiz-mobile-btn" onClick={() => setMobileQIdx(Math.min(questions.length - 1, mobileQIdx + 1))} disabled={mobileQIdx === questions.length - 1}>Next</button>
          </div>
        )}
        <div className="quiz-grid-box">
          {showQuestions.map((q, idx) => (
            <div
              key={q.id}
              className="quiz-question-box"
              onDragOver={e => e.preventDefault()}
              onDrop={e => {
                const label = e.dataTransfer.getData("text/plain");
                handleDrop(q.id - 1, label);
              }}
            >
              {q.type === "image" ? (
                <img src={q.src} alt={`Q${q.id}`} className="quiz-question-img" />
              ) : (
                <div className="quiz-question-text">{q.text}</div>
              )}
              <div className="quiz-drop-area">
                {userAnswers[q.id - 1] ? (
                  <div className="quiz-drop-answer">
                    <img
                      src={
                        answerImages.find(a => a.label.toLowerCase() === userAnswers[q.id - 1].toLowerCase())?.src || ""
                      }
                      alt={userAnswers[q.id - 1]}
                      className="quiz-drop-img"
                    />
                    <span className="quiz-drop-label">{userAnswers[q.id - 1]}</span>
                    <button type="button" className="quiz-drop-unassign" onClick={() => handleDrop(q.id - 1, "")}>Unassign</button>
                  </div>
                ) : (
                  <span className="quiz-drop-placeholder">Drop answer here</span>
                )}
              </div>
            </div>
          ))}
        </div>
        <div className="quiz-answer-row">
          {answerImages.map(ans => (
            <div
              key={ans.id}
              className="quiz-answer-img-box"
              draggable
              onDragStart={e => e.dataTransfer.setData("text/plain", ans.label)}
              onClick={() => {
                if (isMobile) {
                  handleDrop(mobileQIdx, ans.label);
                } else {
                  const firstEmpty = userAnswers.findIndex(a => !a);
                  if (firstEmpty !== -1) handleDrop(firstEmpty, ans.label);
                }
              }}
            >
              <img
                src={ans.src}
                alt={ans.label}
                className="quiz-answer-img"
              />
            </div>
          ))}
        </div>
        {!submitted ? (
          // make this button disabled untill all 10 question is answered
          <button className="quiz-submit-btn" onClick={handleSubmit} disabled={userAnswers.some(a => !a)}>Submit Quiz</button>
        ) : (
          <div className="quiz-result-box">
            <div className="quiz-result-title">Quiz Completed!</div>
            <div className="quiz-result-score">You scored <span>{score}</span> out of 10!</div>
          </div>
        )}
      </div>
    </div>
  );
}
