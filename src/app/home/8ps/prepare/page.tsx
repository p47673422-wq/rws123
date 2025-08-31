"use client";
import React, { useState, useEffect } from "react";
import { ProgressBarFloating } from "../../../../components/ProgressBarFloating";
import PsMenuBar from "../PsMenuBar";
import "../../home-custom.css";
import { isValidPhoneNumber } from "libphonenumber-js";
import { useRouter } from "next/navigation";

function PreparePage() {
  const router = useRouter();
  // Progress state for all Ps
  const [progress, setProgress] = useState<{ [key: string]: number }>({});
  const [userId, setUserId] = useState<string | null>(null);

  // List of all Ps in order
  const psList = [
    "Prepare", "Pray", "Perform", "Participate", "Purchase", "Perfect", "Perceive", "Pledge"
  ];

  useEffect(() => {
    if (typeof window !== "undefined") {
      const storedId = localStorage.getItem("userId1");
      if (storedId) {
        setUserId(storedId);
        fetch(`/api/progress/user?id=${storedId}`)
          .then(res => res.json())
          .then(data => {
            if (data.success && Array.isArray(data.progress)) {
              const progObj: { [key: string]: number } = {};
              data.progress.forEach((p: any) => {
                progObj[p.pName] = p.percent;
              });
              setProgress(progObj);
            }
          });
      }
    }
  }, []);

  return (
      <>
        <PsMenuBar />
        <ProgressBarFloating
          progress={Math.round((Object.values(progress).filter(v => v >= 12.5).length / psList.length) * 100)}
          completedPs={psList.filter(p => (progress[p] || 0) >= 12.5)}
          psList={psList}
        />
      <div className="content-overlay">
        <div className="homeCustomBox flex flex-col items-center mx-auto">
          <button className="back-btn" onClick={() => router.push("/home/8ps")}>← Back to 8Ps</button>
          <h2 className="fancyTitle">Prepare for Janmashtami</h2>
          {/* <img src="/images/prepare.png" alt="Prepare" className="mt-6 rounded-xl shadow-lg w-64" /> */}
          <div className="mt-6 text-base max-w-2xl text-center">
            <p>Janmashtami is the divine appearance day of Lord Sri Krishna, the Supreme Personality of Godhead. He appeared as the 8th child of Vasudeva and Devaki. The 7th child was Lord Balarama, symbolizing the spiritual master (Guru). The first six pregnancies of Devaki were destroyed—representing the six anarthas: <b>Kama</b> (lust), <b>Krodha</b> (anger), <b>Lobha</b> (greed), <b>Moha</b> (illusion), <b>Mada</b> (pride), and <b>Matsarya</b> (envy).</p>
            <p className="mt-4">When these impurities are cleansed from our hearts and we take shelter of the spiritual master (Balarama), Krishna can appear in our hearts and lives too.</p>
          </div>

          <div className="shloka-nav-btns">
          
          <button className="nav-btn next-btn" onClick={() => router.push(`/home/8ps/pray`)}>Next P</button>
        </div>
          <FancyQuiz />
        </div>
      </div>
    </>
  );
}
function FancyQuiz() {
  const QUIZ_TYPE = "prepare";
  const QUIZ_TITLE = "Prepare Quiz";
  const MAX_SCORE = 3;
  const P_NAME = "Prepare";
  const TOTAL_PS = 8;
  const quizQuestions = [
    {
      question: "Who appeared as the 8th child of Vasudeva and Devaki?",
      options: ["Lord Rama", "Lord Krishna", "Lord Balarama", "Lord Shiva"],
      answer: "Lord Krishna",
    },
    {
      question: "Who symbolizes the spiritual master (Guru)?",
      options: ["Lord Krishna", "Lord Balarama", "Devaki", "Vasudeva"],
      answer: "Lord Balarama",
    },
    {
      question: "Which of the following is NOT one of the six anarthas?",
      options: ["Kama", "Krodha", "Lobha", "Bhakti"],
      answer: "Bhakti",
    },
  ];

  const [step, setStep] = useState<"start" | "quiz" | "userinfo" | "result">("start");
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
    // Submit user info to quiz API to get userId
    const res = await fetch("/api/quiz/submit", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(
        { ...userInfo, answers: [], score, quizType: QUIZ_TYPE, quizTitle: QUIZ_TITLE, maxScore: MAX_SCORE, pName: P_NAME, percent: 12.5 }
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

  function handleAnswer(idx: number, value: string): void {
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
    // Calculate percent for this P (1/8 * 100 if completed)
    const percent = 12.5;
    // Submit to API
    if (userId) {
      userInfo.id = userId;
    await fetch("/api/quiz/submit", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ ...userInfo, answers, score: newScore, quizType: QUIZ_TYPE, quizTitle: QUIZ_TITLE, maxScore: MAX_SCORE, pName: P_NAME, percent }),
    });
    setSubmitted(true);
    setStep("result");
    } else {
      setStep("userinfo");
    }
  }

  return (
    <div className="fancy-quiz-box mt-8 p-6 rounded-2xl shadow-xl bg-gradient-to-br from-yellow-50 to-yellow-100 max-w-xl mx-auto">
      {step === "start" && (
        <button className="fancy-btn px-6 py-3 rounded-full bg-gradient-to-r from-yellow-400 to-yellow-600 text-white font-bold shadow-lg hover:scale-105 transition" onClick={handleProceed}>
          Proceed to Complete
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
          <button className="fancy-btn px-6 py-2 rounded-full bg-yellow-500 text-white font-bold shadow hover:bg-yellow-600" type="submit">Continue to result</button>
        </form>
      )}
      {step === "quiz" && (
        <form className="flex flex-col gap-6" onSubmit={handleQuizSubmit}>
          {quizQuestions.map((q, idx) => (
            <div key={idx} className="quiz-question-box p-4 rounded-xl bg-white shadow">
              <div className="font-semibold mb-2">{q.question}</div>
              {q.options.map(opt => (
                <label key={opt} className="flex items-center gap-2 mb-1">
                  <input type="checkbox" checked={answers[idx] === opt} onChange={() => handleAnswer(idx, opt)} />
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
  );
}

export default PreparePage;