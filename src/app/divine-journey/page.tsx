"use client";

import React, { useEffect, useRef, useState } from "react";
import Link from "next/link";

const TOTAL_HEADS = 10;
const ANIMATION_DURATIONS = { arrow: 1800, fireball: 1200, finalHit: 2000, buffer: 200 };

type Question = {
  id: number;
  text: string;
  options: string[];
  correct: string[]; // letters e.g. ["A","B"]
  multiple?: boolean;
  allowExplanation?: boolean;
};

const QUESTIONS: Question[] = [
  {
    id: 1,
    text:
      "Ravana worshiped whom? Was Ravana's worship a love for that personality (selfless) or a use of that personality (selfish)?",
    options: [
      "A Lord Shiva with selfless love",
      "B Lord Shiva with Selfish motive",
      "C Lord Brahma with Selfless love",
      "D Lord Brahma with Selfish motive",
    ],
    correct: ["B", "D"],
    multiple: true,
  },
  {
    id: 2,
    text: "Ravana’s various curses show what? (more than 1 correct)",
    options: [
      "A The Law of Karma and its inevitable consequences.",
      "B The sanctity and importance of respecting women's chastity.",
      "C The impermanence of material power, even for the most powerful.",
      "D The superiority of mystic power over Dharma.",
      "E The ultimate infallibility of Divine will.",
    ],
    correct: ["A", "B", "C", "E"],
    multiple: true,
  },
  {
    id: 3,
    text:
      "Which one of the six anarthas (unwanted qualities) is primarily symbolized by Ravana & one by Kumbhakarna respectively?",
    options: [
      "A Krodha (Anger) & Kāma (Lust)",
      "B Kāma (Lust) & Moha (Illusion)",
      "C Kāma (Lust) & Krodha (Anger)",
      "D Mātsarya (Envy) & Krodha (Anger)",
    ],
    correct: ["B"],
  },
  {
    id: 4,
    text: "Find the odd one out: Ravana, Kumbhakarna, & Vibhishana.",
    options: ["A Ravana", "B Kumbhakarna", "C Vibhishana", "D None is odd one out as all 3 are brothers together"],
    correct: ["C"],
    allowExplanation: true,
  },
  {
    id: 5,
    text:
      "How did Ravana miss making his choices correct? (Bhagavad Gita 2.62-63) Select the correct options.",
    options: [
      "A Maricha warned Ravana how Lord Rama is so powerful, but still Ravana was not ready to listen; Ravana’s good intelligence is blinded by Lust - adamant desire to have mother Sita;",
      "B Ravana was given advice by his wife Madodari, brother Vibhishana, but no change - as he is blinded by lust;",
      "C Lord Rama was also allured by Shurpanakha - but as Lord Rama showed the importance of holding to the Dharma in life, there was no thought of contemplation about that proposal - so no question of developing lust and no question of losing the intelligence.",
      "D Isn’t it important for us to safeguard ourselves while handling the constant bombardment of Social Media which forces us to get into contemplation and then developing insatiable lust for the things making us lose our intelligence and losing oneself eventually.",
    ],
    correct: ["A", "B", "C", "D"],
    multiple: true,
  },
  {
    id: 6,
    text: "Select the right answers and get the right definition of Love.",
    options: [
      "A Ravana wanted to enjoy mother Sita for his own sense enjoyment which is called as the lust or Kama - adamant desire to enjoy",
      "B Hanuman wanted to give the enjoyment to Lord Rama and mother Sita which can be called as Love or Prema - selfless sacrifice for the beloved",
      "C Kama or Lust means working for gratifying one’s own senses",
      "D Prema or Love means working for satisfying the Lord’s senses",
      "E Lust means Selfish, Love means Selfless; Lust means Destruction, Love means Devotion;",
    ],
    correct: ["A", "B", "C", "D", "E"],
    multiple: true,
  },
  {
    id: 7,
    text:
      "When Vibhishana joins Lord Rama, many of the associates of Lord Rama were questioning the acceptance of Vibhishana as he was the brother of Ravana. The Lord says He would forgive even Ravana if he surrenders. What do we infer from this? (Select the best inference)",
    options: [
      "A Lord Rama was desperate for allies, even wicked ones.",
      "B Ravana was secretly plotting to surrender later.",
      "C The power of Surrender to the Lord is that all our sins are forgiven, as the Lord is very kind to all.",
      "D Lord Rama was simply being diplomatic.",
    ],
    correct: ["C"],
  },
  {
    id: 8,
    text:
      "In the analogy of 'No matter how many zeroes we gather, they have no value until we add a digit 1 before it,' what do the 1 and the 0's represent?",
    options: [
      "A Ravana had so much wealth, power, skills but all are like 0’s which without adding Lord Rama who is like 1, has made his whole life useless.",
      "B Vibhishana never left that 1 - Lord Rama from his life although he has lost some 0’s like his kingdom, wealth, property share, etc.",
      "C I am giving my time for academics/profession/family but with all these things only, my value will remain 0’s if i don’t give time to God by coming to satsang, temple, meditation, studying Bhagavad Gita & Srimad Bhagavatam which all are like adding 1.",
    ],
    correct: ["A", "B", "C"],
    multiple: true,
  },
  {
    id: 9,
    text:
      "Our life may be surrounded with people who are against the path of Dharma. What should we do (based on Vibhishana's example)?",
    options: [
      "A Surrender to their plan out of family loyalty (like Kumbhakarna).",
      "B Compromise one's own Dharma temporarily to keep the peace.",
      "C Seeing the majority and side them as the majority is more important than Dharma.",
      "D Try to make them understand, and if they persist in Adharma, we must separate from them and align with Dharma.",
    ],
    correct: ["D"],
  },
  {
    id: 10,
    text:
      "Lord Rama’s army was materially inferior (monkeys with sticks and stones) to Ravana's army (full of mystic powers). What was the victory factor in life?",
    options: [
      "A Strategic brilliance and political maneuvering.",
      "B The immense power of the monkeys' sticks and stones.",
      "C The principle of Dharmo rakṣati rakṣitaḥ (Dharma protects those who protect Dharma) and Divine grace.",
      "D We may be small in the worldly sense but when we hold on to the Lord, the impossible can become possible.",
    ],
    correct: ["C", "D"],
    multiple: true,
  },
  {
    id: 11,
    text:
      "Mother Sita gets caught by Ravana but still she maintained her virtue against Ravana's threats. What is the essential quality we need to adopt from this?",
    options: [
      "A Mother Sita crosses Laxmana Rekha and gets caught by Ravana. We also if we cross the limits of Laxmana Rekha set for us by Dharma & our kind superiors - we are sure to get trapped by evils like Ravana.",
      "B Honest Desire to be with the Lord and expressing that by chanting everyday the Holy Names in accordance with a pure lifestyle.",
      "C Never to leave 1 - Lord - Dharma - from our life no matter what external demands.",
    ],
    correct: ["A", "B", "C"],
    multiple: true,
  },
];

export default function DivineJourneyPage() {
  // User info state
  const [userInfo, setUserInfo] = useState({ name: "", mobile: "", gender: "", address: "", maritalStatus: "" });
  const [userId, setUserId] = useState<string | null>(null);
  const [showUserForm, setShowUserForm] = useState(false);
  const [userError, setUserError] = useState("");

  useEffect(() => {
    if (typeof window !== "undefined") {
      const storedId = localStorage.getItem("userId1");
      const storedInfo = localStorage.getItem("userInfo1");
      if (storedId) setUserId(storedId);
      if (storedInfo) {
        try {
          setUserInfo(JSON.parse(storedInfo));
        } catch {}
      }
    }
  }, []);

  const handleUserInfoChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    setUserInfo({ ...userInfo, [e.target.name]: e.target.value });
  };

  function isValidIndianMobile(mobile: string) {
    const cleaned = mobile.replace(/\D/g, "");
    if (!/^([6-9][0-9]{9})$/.test(cleaned)) return false;
    return cleaned.length === 10;
  }
  // Ravana heads state
  const initialHeads = Array.from({ length: TOTAL_HEADS }, (_, i) => i);
  const [heads, setHeads] = useState<number[]>(initialHeads);

  // first head removal should be from right side, then left, alternating
  const [turnRight, setTurnRight] = useState<boolean>(true);

  const [flyingHead, setFlyingHead] = useState<number | null>(null);
  const [arrowActive, setArrowActive] = useState(false);
  const [fireballActive, setFireballActive] = useState(false);
  const [jivaSteps, setJivaSteps] = useState(0);

  // Quiz state
  const [quizStarted, setQuizStarted] = useState(false);
  const [showCard, setShowCard] = useState(false);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [selectedLetters, setSelectedLetters] = useState<string[]>([]);
  const [animating, setAnimating] = useState(false);
  const [explanation, setExplanation] = useState<string>("");

  const [completed, setCompleted] = useState(false);
  const conchRef = useRef<HTMLAudioElement | null>(null);

  useEffect(() => {
    conchRef.current = new Audio("/sounds/conch.mp3");
    // pre-load silently
    try {
      conchRef.current.load();
    } catch {}
  }, []);

  // helper to get option letter
  const optionLetter = (i: number) => String.fromCharCode(65 + i); // A, B, C...

  // render ravana heads
  const renderHeads = () => {
    const mid = Math.floor(TOTAL_HEADS / 2);
    return heads.map((id, idx) => {
      const relativeIndex = idx - Math.floor(heads.length / 2);
      const offsetX = relativeIndex * 3.5;
      const offsetY = Math.abs(relativeIndex) * 0.9;
      const scale = 1 - Math.abs(relativeIndex) * 0.06;
      return (
        <img
          key={id}
          src="/images/ravan-head.png"
          className="absolute transition-all"
          style={{
            bottom: `${54 + offsetY}%`,
            right: `${15.1 + offsetX}%`,
            width: `${12.5 * scale}%`,
            transform: `scale(${scale})`,
            zIndex: 100 - Math.abs(relativeIndex),
          }}
          alt="Ravana head"
        />
      );
    });
  };

  // flying head
  const renderFlyingHead = () =>
    flyingHead !== null ? (
      <img
        src="/images/ravan-head.png"
        className="absolute flying-head"
        style={{
          right: `${14 + (flyingHead ?? 0) * -2}%`,
          bottom: `${28 + (flyingHead ?? 0) * 6.2}%`,
          width: "22%",
          zIndex: 999,
        }}
        alt="Ravana flying head"
      />
    ) : null;

  // shootArrow returns promise resolved after animation
  const shootArrow = (isFinal = false) =>
    new Promise<void>((resolve) => {
      if (arrowActive) {
        resolve();
        return;
      }
      setArrowActive(true);

      setHeads((prev) => {
        if (prev.length === 0) {
          return prev;
        }
        const mid = Math.floor(TOTAL_HEADS / 2);

        // choose target based on turnRight flag: if true, choose rightmost non-mid; else leftmost non-mid
        let targetId: number | null = null;

        if (prev.length === 1) {
          targetId = prev[0];
        } else {
          if (turnRight) {
            // iterate from end to find first not mid
            for (let i = prev.length - 1; i >= 0; i--) {
              if (prev[i] !== mid) {
                targetId = prev[i];
                break;
              }
            }
            if (targetId === null) targetId = prev[prev.length - 1];
          } else {
            for (let i = 0; i < prev.length; i++) {
              if (prev[i] !== mid) {
                targetId = prev[i];
                break;
              }
            }
            if (targetId === null) targetId = prev[0];
          }
        }

        // set flying head and toggle side for next time
        setFlyingHead(targetId);
        setTurnRight((t) => !t);

        // remove target from heads
        return prev.filter((id) => id !== targetId);
      });

      const dur = isFinal ? ANIMATION_DURATIONS.finalHit : ANIMATION_DURATIONS.arrow;
      setTimeout(() => {
        setFlyingHead(null);
        setArrowActive(false);
        setJivaSteps((s) => s + 1);
        resolve();
      }, dur + ANIMATION_DURATIONS.buffer);
    });

  const launchFireball = () =>
    new Promise<void>((resolve) => {
      if (fireballActive) {
        resolve();
        return;
      }
      setFireballActive(true);
      setTimeout(() => {
        setFireballActive(false);
        resolve();
      }, ANIMATION_DURATIONS.fireball + ANIMATION_DURATIONS.buffer);
    });

  const finalHit = async () => {
    // dramatic final hit: call shootArrow(true)
    await shootArrow(true);
    // ensure heads cleared
    setHeads([]);
  };

  // check selected vs correct
  const isCorrectForQuestion = (q: Question) => {
    const selected = selectedLetters.slice().map((s) => s.toUpperCase()).sort();
    const correct = q.correct.slice().map((s) => s.toUpperCase()).sort();
    if (selected.length !== correct.length) return false;
    for (let i = 0; i < correct.length; i++) {
      if (selected[i] !== correct[i]) return false;
    }
    return true;
  };

  // submit handler
  const handleSubmit = async () => {
    if (animating) return;
    const q = QUESTIONS[currentIndex];
    if (!q) return;
    if (selectedLetters.length === 0) {
      alert("Please select an answer.");
      return;
    }

    // If first question and no userId, show user form
    if (currentIndex === 0 && !userId) {
      setShowUserForm(true);
      return;
    }

    setShowCard(false);
    setAnimating(true);

    const correct = isCorrectForQuestion(q);

    if (correct) {
      // Final question: save quiz response
      if (currentIndex === 10) {
        await finalHit();
        try {
          conchRef.current?.play();
        } catch {}
        // Save quiz response to API
        try {
          await fetch("/api/quiz/submit", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
              userId,
              ...userInfo,
              answers: [], // You can collect all answers in an array if needed
              score: 11,
              quizType: "divineJourney",
              quizTitle: "Divine Journey Quiz",
              maxScore: 11
            })
          });
        } catch {}
        setAnimating(false);
        setCompleted(true);
        return;
      }

      await shootArrow(false);
      if (currentIndex === 9) {
        setHeads(initialHeads.slice());
        await new Promise((res) => setTimeout(res, 600));
        setCurrentIndex((ci) => ci + 1);
      } else {
        setCurrentIndex((ci) => ci + 1);
      }
      setSelectedLetters([]);
      setExplanation("");
      setAnimating(false);
      setTimeout(() => setShowCard(true), 200);
    } else {
      await launchFireball();
      setAnimating(false);
      setSelectedLetters([]);
      setExplanation("");
      setTimeout(() => setShowCard(true), 200);
    }
  };

  // Handle user info form submit
  const handleUserFormSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!userInfo.name || !userInfo.mobile || !userInfo.gender || !userInfo.address || !userInfo.maritalStatus) {
      setUserError("Please fill all user details.");
      return;
    }
    if (!isValidIndianMobile(userInfo.mobile)) {
      setUserError("Please enter a valid mobile number.");
      return;
    }
    setUserError("");
    // Only create user if userId1 does not exist
    if (typeof window !== "undefined" && localStorage.getItem("userId1")) {
      setShowUserForm(false);
      setShowCard(true);
      return;
    }
    try {
      const res = await fetch("/api/quiz/submit", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          ...userInfo,
          quizType: "divineJourneyUser",
          quizTitle: "Divine Journey User Info",
          maxScore: 11,
          answers: [],
          score: 0
        })
      });
      if (res.ok) {
        const data = await res.json();
        if (typeof window !== "undefined") {
          localStorage.setItem("userInfo1", JSON.stringify(userInfo));
          if (data.userId) {
            localStorage.setItem("userId1", data.userId);
            setUserId(data.userId);
          }
        }
        setShowUserForm(false);
        setShowCard(true);
      } else {
        setUserError("Could not save. Try again.");
      }
    } catch {
      setUserError("Could not save. Try again.");
    }
  };

  // UI handlers for selecting options
  const toggleOption = (letter: string, multi?: boolean) => {
    const upper = letter.toUpperCase();
    if (multi) {
      setSelectedLetters((prev) => (prev.includes(upper) ? prev.filter((p) => p !== upper) : [...prev, upper]));
    } else {
      setSelectedLetters([upper]);
    }
  };

  // Reset quiz (for testing)
  const resetQuiz = () => {
    setHeads(initialHeads.slice());
    setTurnRight(true);
    setFlyingHead(null);
    setArrowActive(false);
    setFireballActive(false);
    setJivaSteps(0);
    setQuizStarted(false);
    setShowCard(false);
    setCurrentIndex(0);
    setSelectedLetters([]);
    setAnimating(false);
    setExplanation("");
    setCompleted(false);
  };

  const currentQuestion = QUESTIONS[currentIndex];

  return (
     <div className="min-h-screen flex z-30 items-start justify-center bg-black pt-0 md:pt-8">
      {/* battlefield / background container */}
      <div
        className="relative w-full max-w-md h-screen bg-cover bg-center overflow-hidden"
        style={{ backgroundImage: "url('/images/ramb.png')", top: 0, position: 'absolute', left: '50%', transform: 'translateX(-50%)', maxHeight: '100vh' }}
      >
        {/* Render heads and flying head */}
        {renderHeads()}
        {renderFlyingHead()}

        {/* Arrow */}
        {arrowActive && flyingHead !== null && (
          <div
            className="absolute arrow"
            style={{
              left: "20%",
              bottom: "50%",
              transform: `rotate(-10deg)`,
            }}
            aria-hidden
          />
        )}

        {/* Fireballs */}
        {fireballActive &&
          [0, 1, 2].map((f) => (
            <div
              key={f}
              className="absolute fireball"
              style={{
                right: "20%",
                bottom: "55%",
                animationDelay: `${f * 0.18}s`,
              }}
            />
          ))}

        {/* Jiva (stick figure) */}
        <div
          className={`absolute jiva ${fireballActive ? "jiva-shake" : ""}`}
          style={{
            left: `${35 - jivaSteps * 2}%`,
            bottom: "8%",
            transition: "left 1.2s ease",
          }}
        >
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
            <line x1="50" y1="32" x2="50" y2="110" strokeWidth="6" className={`transition-colors duration-1000 ${
                heads.length >= 7 ? "stroke-black" : heads.length <= 4 ? "stroke-yellow-600" : "stroke-yellow-400"
              }`} />
            <line x1="50" y1="50" x2="20" y2="80" strokeWidth="5" className={`transition-colors duration-1000 ${
                heads.length >= 7 ? "stroke-black" : heads.length <= 4 ? "stroke-yellow-600" : "stroke-yellow-400"
              }`} />
            <line x1="50" y1="50" x2="80" y2="80" strokeWidth="5" className={`transition-colors duration-1000 ${
                heads.length >= 7 ? "stroke-black" : heads.length <= 4 ? "stroke-yellow-600" : "stroke-yellow-400"
              }`} />
            <line x1="50" y1="110" x2="25" y2="160" strokeWidth="5" className={`transition-colors duration-1000 ${
                heads.length >= 7 ? "stroke-black" : heads.length <= 4 ? "stroke-yellow-600" : "stroke-yellow-400"
              }`} />
            <line x1="50" y1="110" x2="75" y2="160" strokeWidth="5" className={`transition-colors duration-1000 ${
                heads.length >= 7 ? "stroke-black" : heads.length <= 4 ? "stroke-yellow-600" : "stroke-yellow-400"
              }`} />
          </svg>
        </div>

        {/* Begin Quiz button at top (prominent) */}
        {!quizStarted && (
          <div className="absolute top-6 left-1/2 -translate-x-1/2 z-50">
            <button
              onClick={() => {
                setQuizStarted(true);
                setShowCard(true);
              }}
              className="px-6 py-3 rounded-xl bg-amber-400 text-black font-semibold shadow-lg hover:scale-[1.02] transform transition"
            >
              Begin Quiz
            </button>
          </div>
        )}

        {/* Quiz Card Overlay: centered card with dim background */}
        {quizStarted && showCard && currentQuestion && !completed && !showUserForm && (
          <div className="fixed inset-0 flex items-center justify-center bg-black/60" style={{ zIndex: 1000 }}>
            <div className="w-11/12 md:w-2/3 lg:w-1/2 bg-white text-black rounded-2xl shadow-2xl p-6 border border-orange-100">
              <div className="flex items-start justify-between">
                <h3 className="text-lg md:text-2xl font-semibold">{`Question ${currentQuestion.id} of ${QUESTIONS.length}`}</h3>
                <div className="text-sm text-gray-600">{/* optional progress */}</div>
              </div>

              <p className="mt-3 text-base md:text-lg font-medium">{currentQuestion.text}</p>

              <div className="mt-4 space-y-3">
                {currentQuestion.options.map((opt, i) => {
                  const letter = optionLetter(i);
                  if (currentQuestion.multiple) {
                    return (
                      <label
                        key={letter}
                        className={`flex items-center gap-3 p-3 rounded-lg border cursor-pointer ${
                          selectedLetters.includes(letter) ? "bg-amber-100 border-amber-400" : "bg-white/90 border-gray-200"
                        }`}
                      >
                        <input
                          type="checkbox"
                          checked={selectedLetters.includes(letter)}
                          onChange={() => toggleOption(letter, true)}
                          className="accent-amber-500"
                          aria-label={`Option ${letter}`}
                        />
                        <span className="text-sm">{opt}</span>
                      </label>
                    );
                  } else {
                    return (
                      <label
                        key={letter}
                        className={`flex items-center gap-3 p-3 rounded-lg border cursor-pointer ${
                          selectedLetters.includes(letter) ? "bg-amber-100 border-amber-400" : "bg-white/90 border-gray-200"
                        }`}
                      >
                        <input
                          type="radio"
                          name={`q-${currentQuestion.id}`}
                          checked={selectedLetters.includes(letter)}
                          onChange={() => toggleOption(letter, false)}
                          className="accent-amber-500"
                          aria-label={`Option ${letter}`}
                        />
                        <span className="text-sm">{opt}</span>
                      </label>
                    );
                  }
                })}
              </div>

              {currentQuestion.allowExplanation && (
                <textarea
                  className="mt-4 w-full p-2 rounded-md border border-gray-200"
                  placeholder="Explain your answer (optional)"
                  value={explanation}
                  onChange={(e) => setExplanation(e.target.value)}
                />
              )}

              <div className="mt-4 flex items-center justify-end gap-3">
                <button
                  onClick={handleSubmit}
                  disabled={animating}
                  className="px-5 py-2 rounded-lg bg-amber-400 text-black font-semibold hover:bg-amber-500 disabled:opacity-50"
                >
                  Submit
                </button>
              </div>
            </div>
          </div>
        )}
        {/* User Info Form Modal - always top-level overlay */}
        {showUserForm && (
          <div className="fixed inset-0 flex items-center justify-center bg-black/60" style={{ zIndex: 2000 }}>
            <form className="w-11/12 md:w-2/3 lg:w-1/2 bg-white text-black rounded-2xl shadow-2xl p-6 border border-orange-100" onSubmit={handleUserFormSubmit}>
              <h3 className="text-lg md:text-2xl font-semibold mb-2">Please enter your details to continue</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <input className="p-2 rounded border border-gray-200" name="name" type="text" placeholder="Your Name" value={userInfo.name} onChange={handleUserInfoChange} />
                <input className="p-2 rounded border border-gray-200" name="mobile" type="tel" placeholder="Mobile Number" value={userInfo.mobile} onChange={handleUserInfoChange} maxLength={10} pattern="[6-9]{1}[0-9]{9}" inputMode="numeric" />
                <select className="p-2 rounded border border-gray-200" name="gender" value={userInfo.gender} onChange={handleUserInfoChange}>
                  <option value="">Select Gender</option>
                  <option value="Male">Male</option>
                  <option value="Female">Female</option>
                </select>
                <select className="p-2 rounded border border-gray-200" name="maritalStatus" value={userInfo.maritalStatus} onChange={handleUserInfoChange}>
                  <option value="">Select Marital Status</option>
                  <option value="Single">Single</option>
                  <option value="Married">Married</option>
                </select>
                <input className="p-2 rounded border border-gray-200 md:col-span-2" name="address" type="text" placeholder="Address" value={userInfo.address} onChange={handleUserInfoChange} />
              </div>
              {userError && <div className="text-red-600 mt-2">{userError}</div>}
              <div className="mt-4 flex items-center justify-end gap-3">
                <button type="submit" className="px-5 py-2 rounded-lg bg-amber-400 text-black font-semibold hover:bg-amber-500">Save & Continue</button>
              </div>
            </form>
          </div>
        )}

        {/* Completed modal after final */}
        {completed && (
          <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70">
            <div className="bg-white text-black rounded-3xl p-6 md:p-10 max-w-xl w-11/12 shadow-2xl">
              <h2 className="text-2xl font-bold">You have completed the Divine Journey</h2>
              <p className="mt-3">By taking shelter of Lord Ram, you move closer to freedom from the anarthas.</p>
              <div className="mt-6 flex gap-3 justify-end">
                <button
                  onClick={() => {
                    // simple reset option
                    resetQuiz();
                  }}
                  className="px-4 py-2 rounded-lg bg-gray-200 text-black"
                >
                  Retry
                </button>
                <Link href="/gift" className="px-4 py-2 rounded-lg bg-amber-400 text-black font-semibold">
                  Claim Gift
                </Link>
              </div>
            </div>
          </div>
        )}

        {/* Custom CSS animations */}
        <style jsx>{`
          .arrow {
            width: 80px;
            height: 6px;
            background: linear-gradient(to right, #fff7d6, #facc15, #f59e0b);
            border-radius: 4px;
            box-shadow: 0 0 15px 6px rgba(255, 215, 0, 0.8);
            position: absolute;
          }
          .arrow {
            animation: arrowFly ${ANIMATION_DURATIONS.arrow}ms linear forwards;
          }
          @keyframes arrowFly {
            0% {
              transform: translateX(0) rotate(-10deg);
              opacity: 1;
            }
            100% {
              transform: translateX(80vw);
              opacity: 0;
            }
          }

          .fireball {
            width: 32px;
            height: 32px;
            border-radius: 50%;
            background: radial-gradient(circle at 30% 30%, #ffdd00, #ff6600, #cc0000);
            box-shadow: 0 0 20px 6px rgba(255, 120, 0, 0.7);
            animation: fireballFly ${ANIMATION_DURATIONS.fireball}ms linear forwards;
          }
          @keyframes fireballFly {
            0% {
              transform: translate(0, 0) scale(0.9);
              opacity: 1;
            }
            100% {
              transform: translate(-30vw, 50vh) rotate(-180deg) scale(0.8);
              opacity: 0;
            }
          }

          @keyframes flyAway {
            0% {
              transform: translate(0, 0) rotate(0);
              opacity: 1;
            }
            50% {
              transform: translate(-20vw, -15vh) rotate(-90deg) scale(1.1);
              opacity: 0.9;
            }
            100% {
              transform: translate(-30vw, 50vh) rotate(-180deg) scale(0.8);
              opacity: 0;
            }
          }
          .flying-head {
            animation: flyAway ${ANIMATION_DURATIONS.arrow + 100}ms ease forwards;
            pointer-events: none;
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
        `}</style>
      </div>

      {/* small persistent Take Shelter message at bottom */}
      <div className="w-full text-center py-3 bg-black/70 text-sm fixed bottom-0">
        <span className="text-amber-300">🌸 Take shelter of Lord Ram — liberate yourself from lust, envy, anger, pride, greed, illusion. 🌸</span>
      </div>
    </div>
  );
}
