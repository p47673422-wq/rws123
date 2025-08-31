"use client";
import React, { useState, useEffect } from "react";
import PsMenuBar from "../PsMenuBar";
import { ProgressBarFloating } from "../../../../components/ProgressBarFloating";
import "../../home-custom.css";
import { isValidPhoneNumber } from "libphonenumber-js";
import { useRouter } from "next/navigation";


function ParticipatePage() {
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
          <h2 className="fancyTitle">Participate</h2>
          {/* <img src="/images/participate.png" alt="Participate" className="mt-6 rounded-xl shadow-lg w-64" /> */}
          <div className="mt-6 text-base max-w-2xl text-center">
            <p>In any activity, we seek happiness. But material happiness is temporary and often leads to problems. <b>Spiritual activities</b> like <b>kirtan</b>, <b>chanting</b>, and <b>seva</b> uplift consciousness, enrich happiness, and purify existence.</p>
            <p className="mt-4">True participation means not just collecting information but undergoing transformation: <i>Asato ma sad gamaya, Tamaso ma jyotir gamaya, Mrityor ma amritam gamaya</i>.</p>
          </div>

          <div className="shloka-nav-btns">
          <button className="nav-btn prev-btn" onClick={() => router.push(`/home/8ps/pray`)}>Previous P</button>
          <button className="nav-btn next-btn" onClick={() => router.push(`/home/8ps/purchase`)}>Next P </button>
        </div>
          <ParticipateQuiz />
        </div>
      </div>
    </>
  );
}

function ParticipateQuiz() {
  const QUIZ_TYPE = "participate";
  const QUIZ_TITLE = "Participate Quiz";
  const MAX_SCORE = 1;
  const P_NAME = "Participate";
  const TOTAL_PS = 8;

  // Match the following data
  const leftItems = [
    "Hunter",
    "Prahlada",
  ];
  // Add distractor options to right side
  const rightItems = [
    "Sage Valmiki",
    "Unaffected by torture from father",
    "Became a king",
    "Lost everything",
  ];
  // correct: Hunter-0, Prahlada-1
  const correctMatch = [0, 1];
  const [userMatches, setUserMatches] = useState<(number | null)[]>([null, null]);

  const [step, setStep] = useState<"start" | "quiz" | "userinfo" | "result">("start");
  const [userId, setUserId] = useState<string | null>(null);
  const [userInfo, setUserInfo] = useState({ name: "", mobile: "", gender: "", address: "", maritalStatus: "", id: "" });
  const [blank, setBlank] = useState("");
  const [score, setScore] = useState(0);
  const [submitted, setSubmitted] = useState(false);
  const [error, setError] = useState("");
  const [loadingUser, setLoadingUser] = useState(false);
  const [draggedIdx, setDraggedIdx] = useState<number | null>(null);

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

  function handleUserInfoChange(e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) {
    setUserInfo({ ...userInfo, [e.target.name]: e.target.value });
  }

  async function handleQuizSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    // Check all matches assigned
    if (userMatches.some(m => m === null)) {
      setError("Please match all pairs.");
      return;
    }
    if (!blank.trim()) {
      setError("Please fill in the blank.");
      return;
    }
    setError("");
    let newScore = 0;
    // Check match correctness and blank
    const matchCorrect = userMatches.every((val, idx) => val === correctMatch[idx]);
    const blankCorrect = blank.trim().toLowerCase().includes("transform");
    if (matchCorrect && blankCorrect) newScore = 1;
    setScore(newScore);
    // Calculate percent for this P (1/8 * 100 if correct)
    const percent = 12.5;
    // If userId exists, submit quiz and go to result. If not, go to userinfo form.
    if (userId) {
      // No need to set userId in userInfo as it's not part of the userInfo state
      userInfo.id = userId;

      await fetch("/api/quiz/submit", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ ...userInfo, answers: [userMatches, blank], score: newScore, quizType: QUIZ_TYPE, quizTitle: QUIZ_TITLE, maxScore: MAX_SCORE, pName: P_NAME, percent }),
      });
      setSubmitted(true);
      setStep("result");
    } else {
      setStep("userinfo");
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
    // Submit user info to quiz API to get userId and also submit quiz answers
    const res = await fetch("/api/quiz/submit", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ ...userInfo, answers: [userMatches, blank], score, quizType: QUIZ_TYPE, quizTitle: QUIZ_TITLE, maxScore: MAX_SCORE, pName: P_NAME, percent: 12.5 }),
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

  // Drag and drop logic for matching
  function handleDragStart(idx: number) {
    setDraggedIdx(idx);
  }
  function handleDrop(targetIdx: number) {
    if (draggedIdx === null) return;
    // Prevent duplicate assignment (no two lefts to same right)
    if (userMatches.includes(targetIdx)) return;
    const newMatches = [...userMatches];
    newMatches[draggedIdx] = targetIdx;
    setUserMatches(newMatches);
    setDraggedIdx(null);
  }
  function handleDragOver(e: React.DragEvent<HTMLDivElement>) {
    e.preventDefault();
  }
  function handleUnassign(idx: number) {
    const newMatches = [...userMatches];
    newMatches[idx] = null;
    setUserMatches(newMatches);
  }

  return (
    <div className="fancy-quiz-box mt-8 p-6 rounded-2xl shadow-xl bg-gradient-to-br from-yellow-50 to-yellow-100 max-w-xl mx-auto">
      {step === "start" && (
        <button className="fancy-btn px-6 py-3 rounded-full bg-gradient-to-r from-yellow-400 to-yellow-600 text-white font-bold shadow-lg hover:scale-105 transition" onClick={handleProceed}>
          Proceed to Complete
        </button>
      )}
      {step === "quiz" && (
  <form className="custom-form-glass flex flex-col gap-6" onSubmit={handleQuizSubmit}>
          <div className="quiz-question-box p-4 rounded-xl bg-white shadow">
            <div className="font-semibold mb-2">Find the common result of their participation:</div>
            <div className="flex flex-col md:flex-row gap-6 justify-center items-start">
              <div className="flex flex-col gap-4">
                {leftItems.map((left, idx) => (
                  <div key={idx} className="flex items-center gap-2">
                    <span className="font-bold">{left}</span>
                    {userMatches[idx] !== null && (
                      <button type="button" className="ml-2 text-xs text-red-500 underline" onClick={() => handleUnassign(idx)}>Unassign</button>
                    )}
                  </div>
                ))}
              </div>
              <div className="flex flex-col gap-4">
                {rightItems.map((right, idx) => {
                  // Find which left (if any) is assigned to this right
                  const assignedLeft = userMatches.findIndex(m => m === idx);
                  return (
                    <div
                      key={idx}
                      className={`p-2 rounded border ${assignedLeft !== -1 ? "bg-green-100 border-green-400" : "bg-white border-gray-300"}`}
                      onDragOver={handleDragOver}
                      onDrop={() => {
                        if (draggedIdx !== null) handleDrop(idx);
                      }}
                    >
                      <span>{right}</span>
                      {assignedLeft !== -1 && (
                        <span className="ml-2 text-xs text-blue-600">← {leftItems[assignedLeft]}</span>
                      )}
                    </div>
                  );
                })}
              </div>
            </div>
            <div className="mt-4 flex flex-col gap-2">
              <div className="font-semibold">Drag a left item and drop on the right result.</div>
              <div className="flex gap-4">
                {leftItems.map((left, idx) => (
                  <div
                    key={idx}
                    className={`p-2 rounded border cursor-move ${userMatches[idx] !== null ? "bg-gray-200 border-gray-400 opacity-50" : "bg-yellow-100 border-yellow-400"}`}
                    draggable={userMatches[idx] === null}
                    onDragStart={() => setDraggedIdx(idx)}
                  >
                    {left}
                  </div>
                ))}
              </div>
            </div>
          </div>
          <div className="quiz-question-box p-4 rounded-xl bg-white shadow">
            <div className="font-semibold mb-2">Both experienced <u>__________</u></div>
            <input
              className="input-fancy w-full"
              placeholder="Fill in the blank (e.g. Transformation by devotion)"
              value={blank}
              onChange={e => setBlank(e.target.value)}
            />
          </div>
          {error && <div className="text-red-500 text-sm">{error}</div>}
          <button className="fancy-btn px-6 py-2 rounded-full bg-green-500 text-white font-bold shadow hover:bg-green-600 mt-4" type="submit">Submit Quiz</button>
        </form>
      )}
      {step === "userinfo" && (
  <form className="custom-form-glass flex flex-col gap-4 items-center" onSubmit={handleUserInfoSubmit}>
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
          <button className="fancy-btn px-6 py-2 rounded-full bg-yellow-500 text-white font-bold shadow hover:bg-yellow-600" type="submit">Continue to Result</button>
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

export default ParticipatePage;
// End of file
