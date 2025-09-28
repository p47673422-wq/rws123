"use client";
import React, { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
// Save user details via API
async function saveUserDetails(details: any) {
  try {
    const res = await fetch("/api/user/get", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(details),
    });
    const data = await res.json();
    if (data.success) {
      if (typeof window !== "undefined") {
        localStorage.setItem("userDetails", JSON.stringify(details));
      }
    }
  } catch (err) {
    console.error("User details save failed", err);
  }
}
// Master quiz data source
const QUESTIONS = [
{
id: 1,
text: "Ravana worshiped whom? Was Ravana's worship a love for that personality (selfless) or a use of that personality (selfish)?",
options: [
"A Lord Shiva with selfless love",
"B Lord Shiva with Selfish motive",
"C Lord Brahma with Selfless love",
"D Lord Brahma with Selfish motive"
],
correct: ["B","D"],
multiple: true
},
{
id: 2,
text: "Ravana’s various curses show what? (more than 1 correct)",
options: [
"A The Law of Karma and its inevitable consequences.",
"B The sanctity and importance of respecting women's chastity.",
"C The impermanence of material power, even for the most powerful.",
"D The superiority of mystic power over Dharma.",
"E The ultimate infallibility of Divine will."
],
correct: ["A","B","C","E"],
multiple: true
},
{
id: 3,
text: "Which one of the six anarthas (unwanted qualities) is primarily symbolized by Ravana & one by Kumbhakarna respectively?",
options: [
"A Krodha (Anger) & Kāma (Lust)",
"B Kāma (Lust) & Moha (Illusion)",
"C Kāma (Lust) & Krodha (Anger)",
"D Mātsarya (Envy) & Krodha (Anger)"
],
correct: ["B"],
multiple: false
},
{
id: 4,
text: "Find the odd one out: Ravana, Kumbhakarna, & Vibhishana.",
options: ["A Ravana","B Kumbhakarna","C Vibhishana","D None is odd one out as all 3 are brothers together"],
correct: ["C"],
multiple: false,
allowExplanation: true // provide a free-text area for user reasoning
},
{
id: 5,
text: "How did Ravana miss making his choices correct? (Bhagavad Gita 2.62-63) Select the correct options.",
options: [
"A Maricha warned Ravana ... Ravana’s good intelligence is blinded by Lust - adamant desire to have mother Sita",
"B Ravana was given advice by his wife Madodari... but no change - as he is blinded by lust",
"C Lord Rama was also allured by Shurpanakha - but Rama held to Dharma, so no lust developed",
"D Social Media like bombardment leads to contemplation → lust → loss of intelligence (analogy)"
],
correct: ["A","B","C","D"],
multiple: true
},
{
id: 6,
text: "Select the right answers and get the right definition of Love.",
options: [
"A Ravana wanted to enjoy mother Sita for his own sense enjoyment which is called Kama (lust)",
"B Hanuman wanted to give the enjoyment to Lord Rama and mother Sita which is called Prema (selfless)",
"C Kama or Lust means working for gratifying one’s own senses",
"D Prema or Love means working for satisfying the Lord’s senses",
"E Lust means Selfish, Love means Selfless; Lust means Destruction, Love means Devotion"
],
correct: ["A","B","C","D","E"],
multiple: true
},
{
id: 7,
text: "When Vibhishana joins Lord Rama, what do we infer? (Choose best inference)",
options: [
"A Lord Rama was desperate for allies, even wicked ones.",
"B Ravana was secretly plotting to surrender later.",
"C The power of Surrender to the Lord is that all our sins are forgiven, as the Lord is very kind.",
"D Lord Rama was simply being diplomatic."
],
correct: ["C"],
multiple: false
},
{
id: 8,
text: "In the analogy of zeroes and a single 1, what do the 1 and 0's represent?",
options: [
"A Ravana had wealth/skill but without Lord Rama (1) they were like 0s",
"B Vibhishana never left that 1 - Lord Rama from his life",
"C Academics/profession/family without God/satsang/Gita/Bhagavatam remain 0s"
],
correct: ["A","B","C"],
multiple: true
},
{
id: 9,
text: "Our life may be surrounded with people who are against Dharma. What should we do (based on Vibhishana)?",
options: [
"A Surrender to their plan out of family loyalty (like Kumbhakarna).",
"B Compromise one's own Dharma temporarily to keep the peace.",
"C Seeing the majority and siding with them is more important than Dharma.",
"D Try to make them understand, and if they persist in Adharma, separate and align with Dharma."
],
correct: ["D"],
multiple: false
},
{
id: 10,
text: "Lord Rama’s army was materially inferior. What was the victory factor in life?",
options: [
// ...existing code...

// Victory Modal Component
function VictoryModal({ onGift, onCounselling, answers }: { onGift: () => void, onCounselling: () => void, answers: any[] }) {
  useEffect(() => {
    playConfetti();
    playConchSound();
    const timestamp = Date.now();
    saveQuizAttempt({ answers, timestamp });
    if (typeof window !== "undefined") {
      localStorage.setItem("quiz_attempted", "true");
    }
  }, []);
  return (
    <div className="fixed inset-0 z-[130] flex items-center justify-center bg-yellow-100 bg-opacity-90 fade-in">
      <div className="bg-gradient-to-r from-pink-100 via-yellow-50 to-green-100 rounded-2xl shadow-lg p-12 text-center border-4 border-yellow-400 max-w-lg w-full lotus-bg">
        <h2 className="text-3xl font-bold text-pink-700 mb-4">Victory!</h2>
        <div className="mb-4 text-lg text-gray-800">By taking shelter of Lord Ram, you have conquered Ravana and the anarthas — lust, envy, anger, pride, greed, illusion.</div>
        <img src="/images/ram-victory.png" alt="Victory" className="mx-auto w-40 h-40 mb-6" />
        // --- BEGIN CLEAN REWRITE ---
        "use client";
        import React, { useEffect, useState } from "react";
        import { useRouter } from "next/navigation";

        // Save user details via API
        async function saveUserDetails(details: any) {
          try {
            const res = await fetch("/api/user/get", {
              method: "POST",
              headers: { "Content-Type": "application/json" },
              body: JSON.stringify(details),
            });
            const data = await res.json();
            if (data.success) {
              if (typeof window !== "undefined") {
                localStorage.setItem("userDetails", JSON.stringify(details));
              }
            }
          } catch (err) {
            console.error("User details save failed", err);
          }
        }

        const QUESTIONS = [
          // ...full QUESTIONS array from original file...
        ];

        function VictoryModal({ onGift, onCounselling, answers }) {
          useEffect(() => {
            playConfetti();
            playConchSound();
            const timestamp = Date.now();
            saveQuizAttempt({ answers, timestamp });
            if (typeof window !== "undefined") {
              localStorage.setItem("quiz_attempted", "true");
            }
          }, []);
          return (
            <div className="fixed inset-0 z-[130] flex items-center justify-center bg-yellow-100 bg-opacity-90 fade-in">
              <div className="bg-gradient-to-r from-pink-100 via-yellow-50 to-green-100 rounded-2xl shadow-lg p-12 text-center border-4 border-yellow-400 max-w-lg w-full lotus-bg">
                <h2 className="text-3xl font-bold text-pink-700 mb-4">Victory!</h2>
                <div className="mb-4 text-lg text-gray-800">By taking shelter of Lord Ram, you have conquered Ravana and the anarthas — lust, envy, anger, pride, greed, illusion.</div>
                <img src="/images/ram-victory.png" alt="Victory" className="mx-auto w-40 h-40 mb-6" />
                <div className="flex flex-col gap-4 items-center">
                  <button className="px-8 py-3 rounded-2xl font-bold text-white bg-gradient-to-r from-pink-400 via-yellow-400 to-green-400 shadow-lg glow-effect hover:scale-105 transition-all duration-300 animate-pulse text-lg" onClick={onGift}>Claim Your Gift</button>
                  <button className="px-8 py-3 rounded-2xl font-bold text-pink-700 bg-yellow-200 border-2 border-pink-400 shadow hover:bg-yellow-300 transition-all duration-300 text-lg" onClick={onCounselling}>Free Counselling</button>
                </div>
              </div>
              <style jsx global>{`
                .flower-confetti::before {
                  content: "";
                  position: fixed;
                  left: 0; top: 0; width: 100vw; height: 100vh;
                  pointer-events: none;
                  z-index: 9999;
                  background-image: url('/images/lotus-petal.png');
                  background-repeat: repeat;
                  opacity: 0.22;
                  animation: lotusConfetti 2.2s linear;
                }
                @keyframes lotusConfetti {
                  0% { opacity: 0.22; }
                  100% { opacity: 0; }
                }
                .lotus-bg {
                  background-image: url('/images/lotus-petal.png');
                  background-repeat: repeat;
                  background-size: 120px;
                  opacity: 0.98;
                }
                .fade-in {
                  animation: fadeIn 0.7s cubic-bezier(.4,0,.2,1);
                }
                @keyframes fadeIn {
                  0% { opacity: 0; transform: scale(0.98); }
                  100% { opacity: 1; transform: scale(1); }
                }
              `}</style>
            </div>
          );
        }

        export default function RamaRavana() {
          const router = useRouter();
          // State declarations
          const [allAnswers, setAllAnswers] = useState([]);
          const [showVictory, setShowVictory] = useState(false);
          const [finalHitActive, setFinalHitActive] = useState(false);
          const [showUserDetailsModal, setShowUserDetailsModal] = useState(false);
          const [userForm, setUserForm] = useState({ name: "", mobile: "", address: "", gender: "", maritalStatus: "" });
          const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
          const [selectedAnswers, setSelectedAnswers] = useState([]);
          const [explanation, setExplanation] = useState("");
          const [showQuestionCard, setShowQuestionCard] = useState(false);
          const [showResultPopup, setShowResultPopup] = useState(false);
          const [resultCorrect, setResultCorrect] = useState(null);
          const TOTAL_HEADS = 10;
          const [heads, setHeads] = useState(Array.from({ length: TOTAL_HEADS }, (_, i) => i));
          const [turnRight, setTurnRight] = useState(false);
          const [flyingHead, setFlyingHead] = useState(null);
          const [arrowActive, setArrowActive] = useState(false);
          const [fireballActive, setFireballActive] = useState(false);
          const [jivaSteps, setJivaSteps] = useState(0);
          const [showIntro, setShowIntro] = useState(false);
          const [quizStarted, setQuizStarted] = useState(false);

          const progress = ((currentQuestionIndex + (showResultPopup ? 1 : 0)) / QUESTIONS.length) * 100;

          useEffect(() => {
            if (!showQuestionCard && selectedAnswers.length > 0) {
              setAllAnswers(prev => {
                const updated = [...prev];
                updated[currentQuestionIndex] = {
                  text: QUESTIONS[currentQuestionIndex]?.text,
                  selected: selectedAnswers,
                  explanation,
                };
                return updated;
              });
            }
          }, [showQuestionCard]);

          async function saveQuizAttempt({ answers, timestamp }) {
            try {
              const userDetails = typeof window !== "undefined" ? JSON.parse(localStorage.getItem("userDetails") || "{}") : {};
              await fetch("/api/quiz/submit", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ ...userDetails, answers, timestamp, quizType: "divine-journey" }),
              });
            } catch (err) {
              console.error("Quiz attempt save failed", err);
            }
          }

          function playConchSound() {
            if (typeof window !== "undefined") {
              const audio = new Audio("/sounds/conch.mp3");
              audio.play();
            }
          }

          function playConfetti() {
            if (typeof window !== "undefined" && (window as any).confetti) {
              (window as any).confetti({
                particleCount: 120,
                spread: 90,
                origin: { y: 0.7 },
                shapes: ["circle"],
                colors: ["#fbbf24", "#f472b6", "#34d399", "#fff", "#fde68a"],
              });
            } else {
              document.body.classList.add("flower-confetti");
              setTimeout(() => document.body.classList.remove("flower-confetti"), 2200);
            }
          }

          const finalHit = async () => {
            setFinalHitActive(true);
            await new Promise(res => setTimeout(res, 1600));
            setFinalHitActive(false);
            setShowVictory(true);
          };

          const beginQuiz = () => {
            setQuizStarted(true);
            setShowIntro(false);
            setCurrentQuestionIndex(0);
            setSelectedAnswers([]);
            setExplanation("");
            setShowQuestionCard(true);
            setShowResultPopup(false);
            setResultCorrect(null);
          };

          // ...rest of quiz logic and JSX, unchanged except for structure fixes...
          return (
            <div>{/* ...full quiz UI and logic here... */}</div>
          );
        }
        // --- END CLEAN REWRITE ---
    setSelectedAnswers([]);
    setExplanation("");
    setShowQuestionCard(true);
    setShowResultPopup(false);
    setResultCorrect(null);
  };

  // ...existing logic for shootArrow, launchFireball, renderHeads, renderFlyingHead...
  // ...existing JSX for UI, modals, quiz, etc...

  return (
    <div>{/* ...existing JSX, unchanged except for structure fixes... */}</div>
  );
}
    });
  };
  // Flying head when arrow hits
  const renderFlyingHead = () =>
  flyingHead !== null && (
    <img
      src="/images/ravan-head.png"
      className="absolute flying-head"
      style={{
        right: `${14 + flyingHead * -2}%`,
        bottom: `${28 + flyingHead * 6.2}%`,
        width: "22%",
        zIndex: 999,
      }}
      alt="Flying head"
    />
  );

  return (
    <div className="min-h-screen flex z-30 items-start justify-center bg-black pt-0 md:pt-8 relative">
      {/* Progress Bar */}
      {quizStarted && (
        <div className="fixed top-0 left-0 w-full z-[60]">
          <div className="h-2 bg-gradient-to-r from-pink-200 via-yellow-200 to-green-200 rounded-full overflow-hidden mx-auto max-w-xl">
            <div
              className="h-full bg-gradient-to-r from-pink-400 via-yellow-400 to-green-400 rounded-full transition-all duration-700"
              style={{ width: `${progress}%` }}
            ></div>
          </div>
        </div>
      )}
      {/* Quiz Question Card */}
      {quizStarted && showQuestionCard && (
        <div className="fixed top-0 left-0 w-full flex justify-center z-50 px-2 pt-2 fade-in">
          <div className="bg-gradient-to-r from-pink-100 via-yellow-50 to-green-100 rounded-2xl shadow-lg border-2 border-yellow-200 max-w-md w-full flex flex-col items-center py-8 px-6 relative lotus-bg">
            <h2 className="text-xl md:text-2xl font-bold text-pink-700 mb-2">Question {currentQuestionIndex + 1} of {QUESTIONS.length}</h2>
            <div className="font-semibold text-gray-800 mb-2 text-center">{QUESTIONS[currentQuestionIndex].text}</div>
              <form className="w-full flex flex-col items-center" onSubmit={async e => {
                e.preventDefault();
                setShowQuestionCard(false);
                // Check answer
                const q = QUESTIONS[currentQuestionIndex];
                let correct = false;
                if (q.multiple) {
                  // Compare selected option values to correct values
                  const selected = selectedAnswers.map(i => q.options[i]).sort();
                  const expected = q.correct.slice().sort();
                  correct = JSON.stringify(selected) === JSON.stringify(expected);
                } else {
                  correct = selectedAnswers.length === 1 && q.correct.includes(q.options[selectedAnswers[0]]);
                }
                setResultCorrect(correct);

                // After first question, check for userDetails in localStorage
                if (currentQuestionIndex === 0) {
                  let details = null;
                  if (typeof window !== "undefined") {
                    details = localStorage.getItem("userDetails");
                  }
                  if (!details) {
                    setShowUserDetailsModal(true);
                    return;
                  }
                }

                // Progression logic for Question 10 (index 9)
                if (currentQuestionIndex === 9) {
                  setHeads(Array.from({ length: TOTAL_HEADS }, (_, i) => i));
                  setTimeout(() => {
                    setShowResultPopup(true);
                  }, correct ? 1800 : 1400);
                  return;
                }

                // Final question logic (index 10)
                if (currentQuestionIndex === 10) {
                  if (correct) {
                    await finalHit();
                  }
                  setTimeout(() => {
                    setShowResultPopup(true);
                  }, correct ? 1800 : 1400);
                  return;
                }

                if (correct) {
                  shootArrow();
                  setTimeout(() => {
                    setShowResultPopup(true);
                  }, 1800);
                } else {
                  launchFireball();
                  setTimeout(() => {
                    setShowResultPopup(true);
                  }, 1400);
                }
              }}>
      {/* User Details Modal */}
      {showUserDetailsModal && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center bg-black bg-opacity-50">
          <div className="bg-white rounded-lg shadow-lg p-6 w-full max-w-md">
            <h2 className="text-xl font-bold mb-4 text-center">Enter Your Details</h2>
            <form onSubmit={e => {
              e.preventDefault();
              if (!userForm.name || !userForm.mobile || !userForm.address || !userForm.gender || !userForm.maritalStatus) {
                alert("Please fill all fields.");
                return;
              }
              if (typeof window !== "undefined") {
                localStorage.setItem("userDetails", JSON.stringify(userForm));
              }
              saveUserDetails(userForm);
              setShowUserDetailsModal(false);
              setTimeout(() => {
                setShowResultPopup(true);
              }, 400);
            }} className="space-y-3">
              <input
                type="text"
                placeholder="Name"
                className="w-full border rounded px-3 py-2"
                value={userForm.name}
                onChange={e => setUserForm({ ...userForm, name: e.target.value })}
                required
              />
              <input
                type="text"
                placeholder="Mobile"
                className="w-full border rounded px-3 py-2"
                value={userForm.mobile}
                onChange={e => setUserForm({ ...userForm, mobile: e.target.value })}
                required
              />
              <input
                type="text"
                placeholder="Address"
                className="w-full border rounded px-3 py-2"
                value={userForm.address}
                onChange={e => setUserForm({ ...userForm, address: e.target.value })}
                required
              />
              <select
                className="w-full border rounded px-3 py-2"
                value={userForm.gender}
                onChange={e => setUserForm({ ...userForm, gender: e.target.value })}
                required
              >
                <option value="">Select Gender</option>
                <option value="Male">Male</option>
                <option value="Female">Female</option>
              </select>
              <select
                className="w-full border rounded px-3 py-2"
                value={userForm.maritalStatus}
                onChange={e => setUserForm({ ...userForm, maritalStatus: e.target.value })}
                required
              >
                <option value="">Marital Status</option>
                <option value="Single">Single</option>
                <option value="Married">Married</option>
              </select>
              <button
                type="submit"
                className="w-full bg-yellow-500 text-white py-2 rounded font-bold mt-2 hover:bg-yellow-600"
              >
                Save & Continue
              </button>
            </form>
          </div>
        </div>
      )}
              <div className="w-full flex flex-col gap-2 mb-2">
                {QUESTIONS[currentQuestionIndex].options.map((opt, idx) => (
                  <label key={idx} className="flex items-center gap-2 cursor-pointer">
                    {QUESTIONS[currentQuestionIndex].multiple ? (
                      <input
                        type="checkbox"
                        checked={selectedAnswers.includes(idx)}
                        onChange={e => {
                          setSelectedAnswers(prev =>
                            e.target.checked
                              ? [...prev, idx]
                              : prev.filter(i => i !== idx)
                          );
                        }}
                      />
                    ) : (
                      <input
                        type="radio"
                        checked={selectedAnswers[0] === idx}
                        onChange={() => setSelectedAnswers([idx])}
                        name="answer"
                      />
                    )}
                    <span className="ml-1 text-gray-700">{opt}</span>
                  </label>
                ))}
              </div>
              {QUESTIONS[currentQuestionIndex].allowExplanation && (
                <textarea
                  className="w-full rounded-lg border border-pink-200 px-2 py-1 mt-2 text-sm"
                  placeholder="Your reasoning (optional)"
                  value={explanation}
                  onChange={e => setExplanation(e.target.value)}
                  rows={2}
                />
              )}
              <button
                type="submit"
                className="mt-4 px-6 py-2 rounded-2xl font-bold text-white bg-gradient-to-r from-pink-400 via-yellow-400 to-green-400 shadow-lg glow-effect hover:scale-105 transition-all duration-300 animate-pulse flex items-center gap-2"
                disabled={selectedAnswers.length === 0}
              >Submit Answer</button>
            </form>
          </div>
        </div>
      )}

      {/* Interstitial Result Popup */}
      {quizStarted && showResultPopup && !showVictory && (
        <div className="fixed top-0 left-0 w-full flex justify-center z-50 px-2 pt-2 fade-in">
          <div className="bg-gradient-to-r from-pink-100 via-yellow-50 to-green-100 rounded-2xl shadow-lg border-2 border-yellow-200 max-w-md w-full flex flex-col items-center py-8 px-6 relative lotus-bg">
            <h2 className={`text-xl md:text-2xl font-bold mb-2 ${resultCorrect ? 'text-green-700' : 'text-red-600'}`}>{resultCorrect ? 'Correct!' : 'Incorrect'}</h2>
            <div className="font-semibold text-gray-800 mb-2 text-center">
              {resultCorrect ? (currentQuestionIndex === 10 ? 'You struck Ravana’s naval!' : 'You conquered a head of Ravana!') : 'Ravana strikes back!'}
            </div>
            <button
              className="mt-4 px-6 py-2 rounded-2xl font-bold text-white bg-gradient-to-r from-pink-400 via-yellow-400 to-green-400 shadow-lg glow-effect hover:scale-105 transition-all duration-300 animate-pulse flex items-center gap-2"
              onClick={() => {
                setShowResultPopup(false);
                setSelectedAnswers([]);
                setExplanation("");
                if (currentQuestionIndex === 9) {
                  // After Q10, show Q11
                  setCurrentQuestionIndex(10);
                  setShowQuestionCard(true);
                  return;
                }
                if (currentQuestionIndex === 10) {
                  // After Q11, end quiz (Victory handled by finalHit)
                  setQuizStarted(false);
                  return;
                }
                if (currentQuestionIndex + 1 < QUESTIONS.length) {
                  setCurrentQuestionIndex(currentQuestionIndex + 1);
                  setShowQuestionCard(true);
                } else {
                  setQuizStarted(false);
                }
              }}
            >Take Shelter of Lord Ram</button>
          </div>
        </div>
      )}

      {/* Final Hit Animation */}
      {finalHitActive && (
        <div className="fixed inset-0 z-[120] flex items-center justify-center bg-black bg-opacity-60 fade-in">
          <div className="bg-gradient-to-r from-pink-100 via-yellow-50 to-green-100 rounded-2xl shadow-lg p-10 text-center lotus-bg">
            <h2 className="text-2xl font-bold text-yellow-700 mb-4">Final Arrow!</h2>
            <div className="mb-4">You shoot the divine arrow to Ravana’s naval!</div>
            <img src="/images/arrow-final.png" alt="Final Arrow" className="mx-auto w-32 h-32 animate-bounce" />
          </div>
        </div>
      )}

      {/* Victory Flow */}
      {showVictory && (
        <VictoryModal
          onGift={() => router.push("/gift")}
          onCounselling={() => router.push("/counselling")}
          answers={allAnswers}
        />
      )}
  // Track answers on each submit
  useEffect(() => {
    if (!showQuestionCard && selectedAnswers.length > 0) {
      setAllAnswers(prev => {
        const updated = [...prev];
        updated[currentQuestionIndex] = {
          text: QUESTIONS[currentQuestionIndex]?.text,
          selected: selectedAnswers,
          explanation,
        };
        return updated;
      });
    }
  }, [showQuestionCard]);
// Victory Modal Component
function VictoryModal({ onGift, onCounselling, answers }: { onGift: () => void, onCounselling: () => void, answers: any[] }) {
  useEffect(() => {
    // Play confetti and conch sound on mount
    playConfetti();
    playConchSound();
    // Save quiz attempt
    const timestamp = Date.now();
    saveQuizAttempt({ answers, timestamp });
    if (typeof window !== "undefined") {
      localStorage.setItem("quiz_attempted", "true");
    }
  }, []);
  return (
    <div className="fixed inset-0 z-[130] flex items-center justify-center bg-yellow-100 bg-opacity-90 fade-in">
      <div className="bg-gradient-to-r from-pink-100 via-yellow-50 to-green-100 rounded-2xl shadow-lg p-12 text-center border-4 border-yellow-400 max-w-lg w-full lotus-bg">
        <h2 className="text-3xl font-bold text-pink-700 mb-4">Victory!</h2>
        <div className="mb-4 text-lg text-gray-800">By taking shelter of Lord Ram, you have conquered Ravana and the anarthas — lust, envy, anger, pride, greed, illusion.</div>
        <img src="/images/ram-victory.png" alt="Victory" className="mx-auto w-40 h-40 mb-6" />
        <div className="flex flex-col gap-4 items-center">
          <button
            className="px-8 py-3 rounded-2xl font-bold text-white bg-gradient-to-r from-pink-400 via-yellow-400 to-green-400 shadow-lg glow-effect hover:scale-105 transition-all duration-300 animate-pulse text-lg"
            onClick={onGift}
          >Claim Your Gift</button>
          <button
            className="px-8 py-3 rounded-2xl font-bold text-pink-700 bg-yellow-200 border-2 border-pink-400 shadow hover:bg-yellow-300 transition-all duration-300 text-lg"
            onClick={onCounselling}
          >Free Counselling</button>
        </div>
      </div>
      {/* Confetti fallback CSS */}
      <style jsx global>{`
        .flower-confetti::before {
          content: "";
          position: fixed;
          left: 0; top: 0; width: 100vw; height: 100vh;
          pointer-events: none;
          z-index: 9999;
          background-image: url('/images/lotus-petal.png');
          background-repeat: repeat;
          opacity: 0.22;
          animation: lotusConfetti 2.2s linear;
        }
        @keyframes lotusConfetti {
          0% { opacity: 0.22; }
          100% { opacity: 0; }
        }
        .lotus-bg {
          background-image: url('/images/lotus-petal.png');
          background-repeat: repeat;
          background-size: 120px;
          opacity: 0.98;
        }
        .fade-in {
          animation: fadeIn 0.7s cubic-bezier(.4,0,.2,1);
        }
        @keyframes fadeIn {
          0% { opacity: 0; transform: scale(0.98); }
          100% { opacity: 1; transform: scale(1); }
        }
      `}</style>
    </div>
  );
}
      {/* Sticky Intro Card */}
      {showIntro && (
        <div className="fixed top-0 left-0 w-full flex justify-center z-50 px-2 pt-2 fade-in">
          <div className="bg-gradient-to-r from-pink-100 via-yellow-50 to-green-100 rounded-2xl shadow-lg border-2 border-yellow-200 max-w-md w-full flex flex-col items-center py-8 px-6 relative lotus-bg">
            <button
              className="absolute top-2 right-2 text-pink-600 hover:text-yellow-600 text-xl font-bold rounded-full px-2 py-1 bg-white/60 shadow"
              onClick={() => setShowIntro(false)}
              aria-label="Close intro"
            >×</button>
            <div className="flex items-center justify-center mb-2">
              <img src="/images/shloka.png" alt="Lotus" className="w-8 h-8 mr-2" />
              <h2 className="text-2xl md:text-3xl font-bold text-pink-700">Take Shelter of Lord Ram</h2>
              <img src="/images/shloka.png" alt="Lotus" className="w-8 h-8 ml-2" />
            </div>
            <p className="text-md text-gray-700 mb-4 text-center">Conquer Ravana and destroy the six anarthas: lust, envy, anger, pride, greed, illusion.</p>
            <button
              className="px-6 py-3 rounded-2xl font-bold text-white bg-gradient-to-r from-pink-400 via-yellow-400 to-green-400 shadow-lg glow-effect hover:scale-105 transition-all duration-300 animate-pulse flex items-center gap-2"
              onClick={beginQuiz}
            >
              <img src="/images/shloka.png" alt="Lotus" className="w-6 h-6 mr-2" /> Begin Quiz
            </button>
          </div>
        </div>
      )}
      <div
        className="relative w-full max-w-md h-screen bg-cover bg-center overflow-hidden"
        style={{ backgroundImage: "url('/images/ramb.png')", top: 0, position: 'absolute', left: '50%', transform: 'translateX(-50%)', maxHeight: '100vh' }}
      >
        {/* Ravana Heads */}
        {renderHeads()}
        {renderFlyingHead()}

        {/* Arrow animation */}
        {arrowActive && flyingHead !== null && (
          <div
            className="absolute arrow"
            style={{
              left: "20%",
              bottom: "50%",
              transform: `rotate(-10deg)`,
            }}
          ></div>
        )}

        {/* Fireball */}
        {fireballActive &&
          [0, 1, 2].map((f) => (
            <div
              key={f}
              className="absolute fireball"
              style={{
                right: "20%",
                bottom: "55%",
                animationDelay: `${f * 0.2}s`
              }}
            ></div>
          ))}

        {/* Jiva (stick figure) */}
        <div
          className={`absolute jiva ${fireballActive ? "jiva-shake" : ""}`}
          style={{
            left: `${35 - jivaSteps * 2}%`, // moves closer to Ram with each head fall
            bottom: "8%",
            transition: "left 1.2s ease",
          }}
        >
          {/* label */}
          <div className="absolute -top-6 left-1/2 -translate-x-1/2 text-xs text-white bg-black/60 px-2 py-1 rounded-full">
            You ✨
          </div>
          <svg viewBox="0 0 100 200" className="w-12 h-20">
            <circle
              cx="50"
              cy="20"
              r="16"
              className={`transition-colors duration-1000 ${
                heads.length >= 7 ? "fill-black" : heads.length <= 4 ? "fill-yellow-600" : "fill-yellow-400"
              }`}
            />
            <line
              x1="50"
              y1="32"
              x2="50"
              y2="110"
              strokeWidth="6"
              className={`transition-colors duration-1000 ${
                heads.length >= 7 ? "stroke-black" : heads.length <= 4 ? "stroke-yellow-600" : "stroke-yellow-400"
              }`}
            />
            <line
              x1="50"
              y1="50"
              x2="20"
              y2="80"
              strokeWidth="5"
              className={`${
                heads.length >= 7 ? "stroke-black" : heads.length <= 4 ? "stroke-yellow-600" : "stroke-yellow-400"
              }`}
            />
            <line
              x1="50"
              y1="50"
              x2="80"
              y2="80"
              strokeWidth="5"
              className={`${
                heads.length >= 7 ? "stroke-black" : heads.length <= 4 ? "stroke-yellow-600" : "stroke-yellow-400"
              }`}
            />
            <line
              x1="50"
              y1="110"
              x2="25"
              y2="160"
              strokeWidth="5"
              className={`${
                heads.length >= 7 ? "stroke-black" : heads.length <= 4 ? "stroke-yellow-600" : "stroke-yellow-400"
              }`}
            />
            <line
              x1="50"
              y1="110"
              x2="75"
              y2="160"
              strokeWidth="5"
              className={`${
                heads.length >= 7 ? "stroke-black" : heads.length <= 4 ? "stroke-yellow-600" : "stroke-yellow-400"
              }`}
            />
          </svg>
        </div>

        {/* Start Quiz Button */}
        {!quizStarted && !showIntro && (
          <div className="absolute top-10 left-1/2 -translate-x-1/2 flex justify-center w-full">
            <button
              className="px-8 py-4 rounded-xl font-bold text-white bg-gradient-to-r from-pink-400 via-yellow-400 to-green-400 shadow-lg hover:scale-105 transition glow-effect flex items-center gap-2 animate-pulse"
              onClick={() => setShowIntro(true)}
            >
              <img src="/images/shloka.png" alt="Lotus" className="w-6 h-6 mr-2" /> Start Quiz
            </button>
          </div>
        )}
      </div>

      {/* Custom CSS Animations */}
      <style jsx global>{`
        @keyframes arrowFly {
          0% {
            transform: translateX(0);
            opacity: 1;
          }
          100% {
            transform: translateX(80vw);
            opacity: 0;
          }
        }
        .arrow {
          width: 80px;
          height: 6px;
          background: linear-gradient(to right, #fff7d6, #facc15, #f59e0b);
          animation: arrowFly 0.8s linear forwards;
          border-radius: 4px;
          box-shadow: 0 0 15px 6px rgba(255, 215, 0, 0.8);
          
        }
        .arrow::after {
          content: "";
          position: absolute;
          right: -14px;
          top: -6px;
          border-left: 14px solid #fff7d6;
          border-top: 8px solid transparent;
          border-bottom: 8px solid transparent;
          filter: drop-shadow(0 0 6px #ffd700);
        }

        @keyframes fireballFly {
          0% {
            transform: translate(0, 0) scale(0.9);
            opacity: 1;
          }
          100% {
            transform: translate(-40vw, 145vh) scale(1.2);
            opacity: 0;
          }
        }
        .fireball {
          width: 32px;
          height: 32px;
          border-radius: 50%;
          background: radial-gradient(circle at 30% 30%, #ffdd00, #ff6600, #cc0000);
          box-shadow: 0 0 20px 6px rgba(255, 120, 0, 0.7);
          animation: fireballFly 1.2s linear forwards;
        }

        @keyframes headFly {
          0% {
            transform: translate(0, 0) rotate(0);
            opacity: 1;
          }
          50% {
            transform: translate(-20vw, -10vh) rotate(-90deg);
          }
          100% {
            transform: translate(-25vw, 50vh) rotate(-180deg);
            opacity: 0;
          }
        }
        .flying-head {
          animation: headFly 1s ease forwards;
        }

        @keyframes jivaShake {
          0% {
            transform: translateX(0);
          }
          25% {
            transform: translateX(-4px);
          }
          50% {
            transform: translateX(4px);
          }
          75% {
            transform: translateX(-2px);
          }
          100% {
            transform: translateX(0);
          }
        }
        .jiva-shake {
          animation: jivaShake 0.6s ease;
        }
        .battlefield-container {
  position: relative;
  width: 100%;
  max-width: 420px;
  padding-bottom: 177.78%; /* if ratio is 9:16 => 9/16 = 56.25% so inverse */
  overflow: hidden;
}
.battlefield-container > .background {
  position: absolute; top: 0; left: 0;
  width: 100%; height: 100%;
  object-fit: cover;
}
      `}</style>
    </div>
  );
}
