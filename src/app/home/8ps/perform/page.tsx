"use client";
import React, { useState, useEffect } from "react";
import { ProgressBarFloating } from "../../../../components/ProgressBarFloating";
import PsMenuBar from "../PsMenuBar";
import "../../home-custom.css";
import { isValidPhoneNumber } from "libphonenumber-js";
import { useRouter } from "next/navigation";

function PerformPage() {
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
          <h2 className="fancyTitle">Perform: Intent & Content</h2>
          {/* <img src="/images/perform.png" alt="Perform" className="mt-6 rounded-xl shadow-lg w-64" /> */}

          <div className="mt-6 text-base max-w-2xl text-center">
            <p>Worship is an act of gratitude—offering back to the Lord what we have received from Him: <b>Tera Tujhko Arpana, Kya Lage Mera</b>.</p>
            <ul className="mt-4 text-left list-disc list-inside">
              <li><b>Fruit vendor lady</b> offered her stock to Krishna and received His mercy.</li>
              <li><b>Sudama</b> gave his little rice with pure love and got abundance in return.</li>
              <li>Even <b>Putana</b>, who tried to kill Krishna, was given the position of a mother because of her external offering.</li>
            </ul>
            <p className="mt-4">Offerings represent the five elements:</p>
            <ul className="text-left list-disc list-inside">
              <li>Lamp = Fire</li>
              <li>Arghyam = Water</li>
              <li>Incense = Earth</li>
              <li>Chamara = Air</li>
              <li>Conch = Ether</li>
            </ul>
            <p className="mt-4">—the very elements that make up our body.</p>
          </div>

          <div className="shloka-nav-btns">
          <button className="nav-btn prev-btn" onClick={() => router.push(`/home/8ps/pray`)}>Previous P</button>
          <button className="nav-btn next-btn" onClick={() => router.push(`/home/8ps/participate`)}>Next P</button>
        </div>
          <PerformQuiz />
        </div>
      </div>
    </>
  );
}
// ...existing code...

export default PerformPage;

function PerformQuiz() {
  const QUIZ_TYPE = "perform";
  const QUIZ_TITLE = "Perform Quiz";
  const MAX_SCORE = 2;
  const P_NAME = "Perform";
  const TOTAL_PS = 8;

  // Match the following data
  const leftItems = [
    "a. SUDAMA",
    "b. PUTANA",
    "c. YUDHISHTHIRA MAHARAJ",
  ];
  // Add distractor options to right side
  const rightItems = [
    "HIGH INTENT but NO MUCH CONTENT",
    "NEITHER CONTENT NOR INTENT",
    "FULL CONTENT & HIGH INTENT",
    "ONLY CONTENT, NO INTENT",
    "ONLY INTENT, NO CONTENT",
    "NO OFFERING AT ALL",
  ];
  // correct: a-0, b-1, c-2
  const correctMatch = [0, 1, 2];
  // User's matches: array of rightItem indices, or null
  const [userMatches, setUserMatches] = useState<(number | null)[]>([null, null, null]);

  const [step, setStep] = useState<"start" | "quiz" | "userinfo" | "result">("start");
  const [userId, setUserId] = useState<string | null>(null);
  const [userInfo, setUserInfo] = useState({ id: "",name: "", mobile: "", gender: "", address: "", maritalStatus: "" });
  // Remove old matches state
  const [reflection, setReflection] = useState("");
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
      body: JSON.stringify({ ...userInfo, answers: [userMatches, reflection], score, quizType: QUIZ_TYPE, quizTitle: QUIZ_TITLE, maxScore: MAX_SCORE, pName: P_NAME, percent: 12.5 }),
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

  async function handleQuizSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    // Check all matches assigned
    if (userMatches.some(m => m === null)) {
      setError("Please match all pairs.");
      return;
    }
    if (!reflection.trim()) {
      setError("Please share your thoughts in the textbox.");
      return;
    }
    setError("");
    let newScore = 0;
    // Check match correctness
    if (userMatches.every((val, idx) => val === correctMatch[idx])) newScore++;
    // +1 for reflection filled
    if (reflection.trim().length > 0) newScore++;
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
      body: JSON.stringify({ ...userInfo, answers: [userMatches, reflection], score: newScore, quizType: QUIZ_TYPE, quizTitle: QUIZ_TITLE, maxScore: MAX_SCORE, pName: P_NAME, percent }),
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
            <div className="font-semibold mb-2">When we have to PERFORM, we need ATTITUDE of HEART & MAGNITUDE of ITEMS we offerIntent & Content. Match the pairs below and reflect on your own offerings.</div>
            <div className="font-semibold mb-2">Match the Following</div>
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
              <div className="font-semibold">Drag a left item and drop on the right meaning.</div>
              <div className="flex gap-4">
                {leftItems.map((left, idx) => (
                  <div
                    key={idx}
                    className={`p-2 rounded border cursor-move ${userMatches[idx] !== null ? "bg-gray-200 border-gray-400 opacity-50" : "bg-yellow-100 border-yellow-400"}`}
                    draggable={userMatches[idx] === null}
                    onDragStart={() => handleDragStart(idx)}
                  >
                    {left}
                  </div>
                ))}
              </div>
            </div>
          </div>
          <div className="quiz-question-box p-4 rounded-xl bg-white shadow">
            <div className="font-semibold mb-2">What do you think of you PERFORMing your OFFERINGs?</div>
            <textarea
              className="input-fancy w-full min-h-[60px]"
              placeholder="Share your thoughts..."
              value={reflection}
              onChange={e => setReflection(e.target.value)}
            />
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
// ...existing code...
}
