"use client";
import React, { useState, useEffect } from "react";
import { ProgressBarFloating } from "../../../../components/ProgressBarFloating";
import PsMenuBar from "../PsMenuBar";
import "../../home-custom.css";
import { isValidPhoneNumber } from "libphonenumber-js";
import { useRouter } from "next/navigation";

function PrayPage() {
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
          <h2 className="fancyTitle">Pray</h2>
          {/* <img src="/images/pray.png" alt="Pray" className="mt-6 rounded-xl shadow-lg w-64" /> */}
          <div className="mt-6 text-base max-w-2xl text-center">
            <p>The Lord says in <b>Bhagavad Gita</b>—as we approach Him, He reciprocates accordingly. Our intelligence is to approach Him in the right mood, so we get the best reciprocation. Example:</p>
            <ul className="mt-4 text-left list-disc list-inside">
              <li><b>Duryodhana vs Arjuna</b> – Duryodhana sought Krishna’s army (energy) for victory; Arjuna sought Krishna Himself (the energetic) for love.</li>
              <li><b>Ravana vs Hanuman</b> – Ravana separated Lord Rama from Sita (bhoga vritti), Hanuman united Them (seva vritti).</li>
            </ul>
          </div>

          <div className="shloka-nav-btns">
          <button className="nav-btn prev-btn" onClick={() => router.push(`/home/8ps/prepare`)}>Previous P</button>
          <button className="nav-btn next-btn" onClick={() => router.push(`/home/8ps/perform`)}>Next P</button>
        </div>
          <PrayQuiz />
        </div>
      </div>
    </>
  );
}

function PrayQuiz() {
  const QUIZ_TYPE = "pray";
  const QUIZ_TITLE = "Pray Quiz";
  const MAX_SCORE = 2;
  const P_NAME = "Pray";
  const TOTAL_PS = 8;
  const options = [
    "I strike the Relation because I get from the Lord what I want;",
    "I may have a certain needs & wants but still I want to strike the Relations with the Lord so as I can purify myself and develop pure Relations of LOVE eventually;",
    "Better I go to other gods so as I can fulfil my desires - Krishna approach need lot of conditions and Restrictions;",
    "I breath my existence solely for the service of the Lord - without that service my life is like living DEAD;",
  ];
  // 1st best: d (index 3), 2nd best: b (index 1)
  const correctFirst = 3;
  const correctSecond = 1;

  const [step, setStep] = useState<"start" | "quiz" | "userinfo" | "result">("start");
  const [userId, setUserId] = useState<string | null>(null);
  const [userInfo, setUserInfo] = useState({ id: "",name: "", mobile: "", gender: "", address: "", maritalStatus: "" });
  const [firstBest, setFirstBest] = useState<number | null>(null);
  const [secondBest, setSecondBest] = useState<number | null>(null);
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
      body: JSON.stringify({ ...userInfo, answers: [firstBest, secondBest], score, quizType: QUIZ_TYPE, quizTitle: QUIZ_TITLE, maxScore: MAX_SCORE, pName: P_NAME, percent: 12.5 }),
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

  function handleFirstBest(idx: number) {
    setFirstBest(idx);
    // If secondBest is same, reset it
    if (secondBest === idx) setSecondBest(null);
  }
  function handleSecondBest(idx: number) {
    setSecondBest(idx);
    // If firstBest is same, reset it
    if (firstBest === idx) setFirstBest(null);
  }

  async function handleQuizSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    if (firstBest === null || secondBest === null) {
      setError("Please select both 1st and 2nd best options.");
      return;
    }
    setError("");
    let newScore = 0;
    if (firstBest === correctFirst) newScore++;
    if (secondBest === correctSecond) newScore++;
    setScore(newScore);
    setStep("result");
    // Calculate percent for this P (1/8 * 100 if both correct)
    const percent = 12.5;
    // Submit to API
    if (userId) {
      userInfo.id = userId;
    await fetch("/api/quiz/submit", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ ...userInfo, answers: [firstBest, secondBest], score: newScore, quizType: QUIZ_TYPE, quizTitle: QUIZ_TITLE, maxScore: MAX_SCORE, pName: P_NAME, percent }),
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
          <div className="quiz-question-box p-4 rounded-xl bg-white shadow">
            <div className="font-semibold mb-2">Sequence with BEST as 1 and 2nd BEST as 2 - ATTITUDE of PRAYERS</div>
            <div className="mb-4">Select your 1st and 2nd best options:</div>
            {options.map((opt, idx) => (
              <div key={idx} className="flex items-center gap-4 mb-2">
                <label className="flex items-center gap-2">
                  <input type="radio" name="firstBest" checked={firstBest === idx} onChange={() => handleFirstBest(idx)} />
                  <span>1st Best</span>
                </label>
                <label className="flex items-center gap-2">
                  <input type="radio" name="secondBest" checked={secondBest === idx} onChange={() => handleSecondBest(idx)} />
                  <span>2nd Best</span>
                </label>
                <span>{String.fromCharCode(97 + idx)}. {opt}</span>
              </div>
            ))}
          </div>
          {error && <div className="text-red-500 text-sm">{error}</div>}
          <button className="fancy-btn px-6 py-2 rounded-full bg-green-500 text-white font-bold shadow hover:bg-green-600 mt-4" type="submit">Submit Quiz</button>
        </form>
      )}
      {step === "result" && (
        <div className="text-center">
          <div className="text-2xl font-bold mb-2">Quiz Completed!</div>
          <div className="text-lg mb-4">You scored <span className="text-green-600 font-bold">{score}</span> out of {MAX_SCORE}!</div>
          {submitted && <div className="text-sm text-gray-500">Your attempt has been recorded. Thank you!</div>}
        </div>
      )}
    </div>
  );
}

export default PrayPage;
