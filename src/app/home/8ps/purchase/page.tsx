"use client";
import React, { useState, useEffect } from "react";
import PsMenuBar from "../PsMenuBar";
import { ProgressBarFloating } from "../../../../components/ProgressBarFloating";
import "../../home-custom.css";
import { isValidPhoneNumber } from "libphonenumber-js";
import { useRouter } from "next/navigation";

function PurchasePage() {
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
              <h2 className="fancyTitle">Purchase</h2>
              <p className="text-lg mt-2">Divine offerings: Find and purchase sacred items and offerings.</p>
              {/* <img src="/images/purchase.png" alt="Purchase" className="mt-6 rounded-xl shadow-lg w-64" /> */}
              <div className="mt-6 text-base max-w-2xl text-center">
                <p>
                  Many visitors may not reach the gift stalls. Display gift shop items (esp. Srila Prabhupada’s books) online or on screens—people can pay in the queue and collect later from volunteers.<br />
                  Remind them that <b>buying spiritual books is not just a transaction—it’s a transcendental investment</b>.
                </p>
              </div>
              <div className="shloka-nav-btns">
          <button className="nav-btn prev-btn" onClick={() => router.push(`/home/8ps/participate`)}>Previous P</button>
          <button className="nav-btn next-btn" onClick={() => router.push(`/home/8ps/perfect`)}>Next P</button>
        </div>
              <PurchaseQuiz />
            </div>
          </div>
        </>
      );
    }

    function PurchaseQuiz() {
      const QUIZ_TYPE = "purchase";
      const QUIZ_TITLE = "Purchase Quiz";
      const MAX_SCORE = 1;
      const P_NAME = "Purchase";
      const TOTAL_PS = 8;

      // For translation, all text is in variables
      const question = "True or False: Purchasing a Srila Prabhupada book is only for our reading pleasure.";
      const hint = "(Hint: It’s also seva to distribute transcendental knowledge to others.)";
      const trueLabel = "True";
      const falseLabel = "False";
      const correctAnswer = "False";

      const [step, setStep] = useState<"start" | "quiz" | "userinfo" | "result">("start");
      const [userId, setUserId] = useState<string | null>(null);
      const [userInfo, setUserInfo] = useState({ id: "",name: "", mobile: "", gender: "", address: "", maritalStatus: "" });
      const [answer, setAnswer] = useState<string>("");
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
          body: JSON.stringify({ ...userInfo, answers: [answer], score, quizType: QUIZ_TYPE, quizTitle: QUIZ_TITLE, maxScore: MAX_SCORE, pName: P_NAME, percent: 12.5 }),
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

      async function handleQuizSubmit(e: React.FormEvent<HTMLFormElement>) {
        e.preventDefault();
        if (!answer) {
          setError("Please select True or False.");
          return;
        }
        setError("");
        let newScore = 0;
        if (answer === correctAnswer) newScore = 1;
        setScore(newScore);
        setStep("result");
        // Calculate percent for this P (1/8 * 100 if correct)
        const percent = 12.5;
        // Submit to API
        if (userId) {
          userInfo.id = userId;
        await fetch("/api/quiz/submit", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ ...userInfo, answers: [answer], score: newScore, quizType: QUIZ_TYPE, quizTitle: QUIZ_TITLE, maxScore: MAX_SCORE, pName: P_NAME, percent }),
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
                <div className="font-semibold mb-2">{question}</div>
                <div className="mb-2 text-sm text-gray-600">{hint}</div>
                <div className="flex gap-6 justify-center mt-4">
                  <label className="flex items-center gap-2">
                    <input type="radio" name="truefalse" value={trueLabel} checked={answer === trueLabel} onChange={() => setAnswer(trueLabel)} />
                    <span>{trueLabel}</span>
                  </label>
                  <label className="flex items-center gap-2">
                    <input type="radio" name="truefalse" value={falseLabel} checked={answer === falseLabel} onChange={() => setAnswer(falseLabel)} />
                    <span>{falseLabel}</span>
                  </label>
                </div>
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

    export default PurchasePage;
