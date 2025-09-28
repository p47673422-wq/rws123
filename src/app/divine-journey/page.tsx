"use client";

import React, { useEffect, useRef, useState } from "react";
import Link from "next/link";

/**
 * Divine Journey - Dusshera Quiz page
 *
 * - Reuses shootArrow / launchFireball logic (adapted to return Promises)
 * - Implements quiz flow:
 *   Start -> sticky intro -> question cards -> hide card on submit -> play animation -> interstitial -> next
 * - Q1 triggers user-details modal if missing (saved into localStorage and placeholder saveUserDetails)
 * - After Q10 resets heads and shows final Q11. Final correct triggers finalHit() and Victory Flow.
 * - Victory Flow: petal confetti + conch sound + Claim Your Gift -> /gift
 *
 * IMPORTANT:
 * - Place conch sound at /public/sounds/conch.mp3
 * - Replace/adjust images paths under /public/images/ as needed
 */

const TOTAL_HEADS = 10;
const ANIMATION_DURATIONS = { arrow: 1800, fireball: 1200, finalHit: 2000, buffer: 200 };

type Question = {
  id: number;
  text: string;
  options: string[];
  correct: string[]; // letters: ["A","B"]
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
    options: [
      "A Ravana",
      "B Kumbhakarna",
      "C Vibhishana",
      "D None is odd one out as all 3 are brothers together",
    ],
    correct: ["C"],
    allowExplanation: true,
  },
  {
    id: 5,
    text:
      "How did Ravana miss making his choices correct? (Bhagavad Gita 2.62-63) Select the correct options.",
    options: [
      "A Maricha warned Ravana ... Ravana’s intelligence blinded by Lust - desire to have mother Sita",
      "B Ravana was given advice by wife Madodari/Vibhishana but no change - blinded by lust",
      "C Lord Rama was allured by Shurpanakha but Rama held to Dharma, so no lust developed",
      "D Social Media bombardment → contemplation → lust → loss of intelligence (analogy)",
    ],
    correct: ["A", "B", "C", "D"],
    multiple: true,
  },
  {
    id: 6,
    text: "Select the right answers and get the right definition of Love.",
    options: [
      "A Ravana wanted to enjoy mother Sita for his own sense enjoyment called Kama (lust)",
      "B Hanuman wanted to give enjoyment to Lord Rama and mother Sita - Prema (selfless)",
      "C Kama or Lust means working for gratifying one’s own senses",
      "D Prema or Love means working for satisfying the Lord’s senses",
      "E Lust means Selfish, Love means Selfless; Lust means Destruction, Love means Devotion",
    ],
    correct: ["A", "B", "C", "D", "E"],
    multiple: true,
  },
  {
    id: 7,
    text:
      "When Vibhishana joins Lord Rama, what do we infer? (Choose best inference)",
    options: [
      "A Lord Rama was desperate for allies, even wicked ones.",
      "B Ravana was secretly plotting to surrender later.",
      "C The power of Surrender to the Lord is that all our sins are forgiven, as the Lord is very kind.",
      "D Lord Rama was simply being diplomatic.",
    ],
    correct: ["C"],
  },
  {
    id: 8,
    text:
      "In the analogy of zeroes and a single 1, what do the 1 and 0's represent?",
    options: [
      "A Ravana had wealth/skill but without Lord Rama (1) they were like 0s",
      "B Vibhishana never left that 1 - Lord Rama from his life",
      "C Academics/profession/family without God/satsang/Gita/Bhagavatam remain 0s",
    ],
    correct: ["A", "B", "C"],
    multiple: true,
  },
  {
    id: 9,
    text:
      "Our life may be surrounded with people who are against Dharma. What should we do (based on Vibhishana)?",
    options: [
      "A Surrender to their plan out of family loyalty (like Kumbhakarna).",
      "B Compromise one's own Dharma temporarily to keep the peace.",
      "C Seeing the majority and siding with them is more important than Dharma.",
      "D Try to make them understand, and if they persist in Adharma, separate and align with Dharma.",
    ],
    correct: ["D"],
  },
  {
    id: 10,
    text:
      "Lord Rama’s army was materially inferior. What was the victory factor in life?",
    options: [
      "A Strategic brilliance and political maneuvering.",
      "B The immense power of the monkeys' sticks and stones.",
      "C The principle of Dharmo rakṣati rakṣitaḥ (Dharma protects those who protect Dharma).",
      "D Divine grace and holding on to the Lord.",
    ],
    correct: ["C", "D"],
    multiple: true,
  },
  {
    id: 11,
    text:
      "Mother Sita maintained virtue while captured. What essential quality do we adopt from this?",
    options: [
      "A Not crossing the limits of Dharma (Laxmana Rekha) to avoid being trapped.",
      "B Honest desire to be with the Lord and chanting the Holy Names with a pure lifestyle.",
      "C Never leave the 1 — Lord/Dharma — from our life.",
    ],
    correct: ["A", "B", "C"],
    multiple: true,
  },
];

export default function DivineJourneyPage() {
  // Ravana heads state + animation
  const initialHeads = Array.from({ length: TOTAL_HEADS }, (_, i) => i);
  const [heads, setHeads] = useState<number[]>(initialHeads);
  const [turnRight, setTurnRight] = useState(false);
  const [flyingHead, setFlyingHead] = useState<number | null>(null);
  const [arrowActive, setArrowActive] = useState(false);
  const [fireballActive, setFireballActive] = useState(false);
  const [jivaSteps, setJivaSteps] = useState(0);

  // Quiz state
  const [quizStarted, setQuizStarted] = useState(false);
  const [introCollapsed, setIntroCollapsed] = useState(false);
  const [currentIndex, setCurrentIndex] = useState<number>(() => {
    // restore from localStorage if present
    try {
      const s = localStorage.getItem("dq_currentIndex");
      return s ? parseInt(s, 10) : 0;
    } catch {
      return 0;
    }
  });
  const [showQuestionCard, setShowQuestionCard] = useState(false);
  const [selected, setSelected] = useState<Record<string, boolean | string>>({});
  const [explanation, setExplanation] = useState("");
  const [showInterstitial, setShowInterstitial] = useState(false);
  const [lastAnswerCorrect, setLastAnswerCorrect] = useState<boolean | null>(null);
  const [showUserModal, setShowUserModal] = useState(false);
  const [userDetails, setUserDetails] = useState<any>(() => {
    try {
      const s = localStorage.getItem("dq_userDetails");
      return s ? JSON.parse(s) : null;
    } catch {
      return null;
    }
  });
  const [victory, setVictory] = useState(false);
  const [petalBurst, setPetalBurst] = useState(false);

  const conchRef = useRef<HTMLAudioElement | null>(null);

  useEffect(() => {
    // store progress
    try {
      localStorage.setItem("dq_currentIndex", String(currentIndex));
    } catch {}
  }, [currentIndex]);

  useEffect(() => {
    try {
      localStorage.setItem("dq_userDetails", JSON.stringify(userDetails || null));
    } catch {}
  }, [userDetails]);

  // Put placeholder audio element
  useEffect(() => {
    conchRef.current = new Audio("/audio/conch.mp3");
    conchRef.current.load();
  }, []);

  // Helper: compare selected set with correct letters
  const isAnswerCorrect = (q: Question) => {
    const selLetters = Object.entries(selected)
      .filter(([k, v]) => v === true || (typeof v === "string" && v === "selected"))
      .map(([k]) => k); // keys are letters like 'A'
    // for radio, if selected contains a letter as string, return that
    const finalSelected: string[] = selLetters.length
      ? selLetters
      : Object.entries(selected).reduce<string[]>((acc, [k, v]) => {
          if (v && typeof v === "string" && v !== "false") acc.push(k);
          return acc;
        }, []);

    // If radio: find any single selection
    if (!q.multiple) {
      // find selected letter
      for (const [k, v] of Object.entries(selected)) {
        if (v === "selected") return q.correct.includes(k);
      }
    }

    // Normalize sets
    const normA = q.correct.slice().sort();
    const normB = finalSelected.slice().sort();
    if (normA.length !== normB.length) return false;
    for (let i = 0; i < normA.length; i++) {
      if (normA[i] !== normB[i]) return false;
    }
    return true;
  };

  // --- Animation functions adapted from your original code (return Promises) ---
  const shootArrow = (isFinal = false) =>
    new Promise<void>((resolve) => {
      if (heads.length === 0 || arrowActive) {
        resolve();
        return;
      }
      setArrowActive(true);

      const mid = Math.floor(TOTAL_HEADS / 2);

      setHeads((prev) => {
        // if only center head remains → remove it
        if (prev.length === 1 && prev[0] === mid) {
          setFlyingHead(mid);
          return [];
        }

        // pick a target (left/right alternating)
        let targetId: number | null = null;
        if (prev.length === 1) {
          targetId = prev[0];
        } else {
          if (turnRight) {
            // choose rightmost not-center
            targetId = [...prev].reverse().find((id) => id !== mid) ?? null;
          } else {
            targetId = prev.find((id) => id !== mid) ?? null;
          }
        }

        if (targetId === null) {
          // fallback
          targetId = prev[0];
        }

        setFlyingHead(targetId);
        setTurnRight((t) => !t);
        // remove that head id
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
    // For final, we want dramatic hit: call shootArrow(true) then clear heads
    await shootArrow(true);
    // make sure all heads gone
    setHeads([]);
  };

  // Render heads (positions derived from your original logic)
  const renderHeads = () => {
    const mid = Math.floor(TOTAL_HEADS / 2);
    return heads.map((id, idx) => {
      // compute current index among remaining heads
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
        alt="Ravana head flying"
      />
    );

  // Petal confetti: create small DOM petals
  const launchPetalConfetti = (count = 40) => {
    setPetalBurst(true);
    // auto clear after some time
    setTimeout(() => setPetalBurst(false), 6000);
  };

  // Placeholder backend hooks
  async function saveUserDetails(details: any) {
    // TODO: replace with real API call
    console.log("saveUserDetails (placeholder):", details);
    return Promise.resolve({ ok: true });
  }
  async function saveQuizAttempt(attempt: any) {
    console.log("saveQuizAttempt (placeholder):", attempt);
    return Promise.resolve({ ok: true });
  }
  async function saveCounsellingSlot(slot: any) {
    console.log("saveCounsellingSlot (placeholder):", slot);
    return Promise.resolve({ ok: true });
  }

  // Submit answer handler
  const handleSubmitAnswer = async (q: Question) => {
    // hide card immediately so animation visible
    setShowQuestionCard(false);

    // evaluate correctness
    const correct = isAnswerCorrect(q);
    setLastAnswerCorrect(correct);

    // trigger animation
    if (correct) {
      // call shootArrow or finalHit if final question
      if (q.id === 11) {
        await finalHit();
      } else {
        await shootArrow(false);
      }
    } else {
      await launchFireball();
    }

    // Special: Q1 -> ensure user details
    if (q.id === 1 && !userDetails) {
      setShowUserModal(true);
      // showUserModal will on save call saveUserDetails and then continue to interstitial
      return;
    }

    // show interstitial
    setShowInterstitial(true);
  };

  // Called after interstitial "Take Shelter..." clicked
  const handleTakeShelterContinue = async () => {
    setShowInterstitial(false);

    // move to next question / handle progression
    const isLastBeforeFinal = currentIndex + 1 === 10; // answered Q10 just now (0-based)
    if (currentIndex + 1 < QUESTIONS.length) {
      // if we just answered question 10 (index 9), reset heads then go to 11th
      if (isLastBeforeFinal) {
        // reset all heads to full array
        setHeads(initialHeads);
        // small pause to show heads restored
        await new Promise((res) => setTimeout(res, 600));
      }
      setCurrentIndex((i) => i + 1);
      // reset selected/explanation for next question
      setSelected({});
      setExplanation("");
      setShowQuestionCard(true);
    } else {
      // finished all questions
      // mark attempt
      const attempt = { timestamp: Date.now(), answers: "saved-locally", user: userDetails || null };
      await saveQuizAttempt(attempt);
      try {
        localStorage.setItem("dq_quiz_attempted", "true");
      } catch {}
      // trigger victory modal / flow (should have already been triggered on finalHit true)
      setVictory(true);
      // play conch
      try {
        conchRef.current?.play();
      } catch {}
      launchPetalConfetti();
    }
  };

  // Save user details from modal
  const handleSaveUserDetails = async (details: any) => {
    await saveUserDetails(details);
    setUserDetails(details);
    setShowUserModal(false);
    // after saving details show interstitial
    setShowInterstitial(true);
  };

  // Start quiz
  const onBeginQuiz = () => {
    setQuizStarted(true);
    setShowQuestionCard(true);
    setCurrentIndex(0);
    setSelected({});
    setExplanation("");
    try {
      localStorage.setItem("dq_currentIndex", "0");
    } catch {}
  };

  // Resume if progress present
  useEffect(() => {
    // if quizStarted from persisted currentIndex, show intro collapsed false and show question if needed
    const tried = localStorage.getItem("dq_currentIndex");
    if (tried && parseInt(tried, 10) > 0) {
      // don't auto-start, but keep progress
    }
  }, []);

  const currentQuestion = QUESTIONS[currentIndex];

  // UI Helpers: option letters A,B,C...
  const optionLetter = (i: number) => String.fromCharCode(65 + i);

  // small helper for checkbox/radio change
  const handleOptionToggle = (letter: string, multi?: boolean) => {
    if (multi) {
      setSelected((s) => ({ ...s, [letter]: !s[letter] }));
    } else {
      // set only this letter to "selected", others to undefined
      const newS: Record<string, any> = {};
      newS[letter] = "selected";
      setSelected(newS);
    }
  };

  return (
    <div className="min-h-screen flex z-30 items-start justify-center bg-black pt-0 md:pt-8">
      {/* battlefield / background container */}
      <div
        className="relative w-full max-w-md h-screen bg-cover bg-center overflow-hidden"
        style={{ backgroundImage: "url('/images/ramb.png')", top: 0, position: 'absolute', left: '50%', transform: 'translateX(-50%)', maxHeight: '100vh' }}
      >
        {/* Ravana heads + flying head */}
        {renderHeads()}
        {renderFlyingHead()}

        {/* Arrow */}
        {arrowActive && flyingHead !== null && (
          <div
            className={`absolute arrow ${arrowActive ? "arrow-anim" : ""}`}
            style={{
              left: "20%",
              bottom: "50%",
              transform: `rotate(-10deg)`,
            }}
            aria-hidden
          ></div>
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
                animationDelay: `${f * 0.2}s`,
              }}
            />
          ))}

        {/* Jiva */}
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
            <line x1="50" y1="50" x2="20" y2="80" strokeWidth="5" className={`${heads.length >= 7 ? "stroke-black" : "stroke-yellow-400"}`} />
            <line x1="50" y1="50" x2="80" y2="80" strokeWidth="5" className={`${heads.length >= 7 ? "stroke-black" : "stroke-yellow-400"}`} />
            <line x1="50" y1="110" x2="25" y2="160" strokeWidth="5" className={`${heads.length >= 7 ? "stroke-black" : "stroke-yellow-400"}`} />
            <line x1="50" y1="110" x2="75" y2="160" strokeWidth="5" className={`${heads.length >= 7 ? "stroke-black" : "stroke-yellow-400"}`} />
          </svg>
        </div>

        {/* Sticky Intro Card (collapsible) */}
        <div
          className={`absolute top-6 left-1/2 -translate-x-1/2 w-11/12 md:w-3/4 rounded-2xl p-4 shadow-2xl backdrop-blur-md border border-white/10 transition-all ${
            introCollapsed ? "max-h-12 overflow-hidden" : "max-h-[220px]"
          } bg-gradient-to-r from-rose-900/20 to-amber-900/10`}
        >
          <div className="flex items-start justify-between gap-4">
            <div>
              <h2 className="text-lg md:text-2xl font-semibold">Take Shelter of Lord Ram</h2>
              {!introCollapsed && (
                <p className="mt-2 text-sm md:text-base text-white/80">
                  Conquer Ravana and liberate yourself from the six anarthas — lust, envy, anger, pride,
                  greed, and illusion. Click Begin Quiz to take the Divine Journey.
                </p>
              )}
            </div>

            <div className="flex items-center gap-3">
              <button
                onClick={() => setIntroCollapsed((c) => !c)}
                className="px-3 py-2 rounded-lg bg-white/10 hover:bg-white/20"
                aria-label="Collapse intro"
              >
                {introCollapsed ? "Expand" : "Collapse"}
              </button>
              <button
                onClick={() => {
                  if (!quizStarted) onBeginQuiz();
                }}
                className="px-4 py-2 rounded-full bg-gradient-to-r from-amber-300 to-rose-500 text-slate-900 font-semibold shadow-lg hover:scale-[1.02] transform transition"
                aria-label="Begin Quiz"
              >
                {quizStarted ? "Resume Quiz" : "Begin Quiz"}
              </button>
            </div>
          </div>
        </div>

        {/* Question Card */}
        {quizStarted && showQuestionCard && currentQuestion && (
          <div className="absolute left-1/2 -translate-x-1/2 top-28 w-11/12 md:w-2/3 bg-white/5 border border-white/10 rounded-2xl p-5 shadow-xl">
            <div className="flex items-center justify-between">
              <h3 className="text-base md:text-xl font-semibold">Question {currentQuestion.id} of {QUESTIONS.length}</h3>
              <div className="text-sm text-white/70">{/* progress */}</div>
            </div>

            <p className="mt-3 text-sm md:text-base">{currentQuestion.text}</p>

            <div className="mt-4 space-y-2">
              {currentQuestion.options.map((opt, i) => {
                const letter = optionLetter(i);
                if (currentQuestion.multiple) {
                  return (
                    <label key={letter} className="flex items-center gap-3">
                      <input
                        type="checkbox"
                        checked={!!selected[letter]}
                        onChange={() => handleOptionToggle(letter, true)}
                        aria-label={`Option ${letter}`}
                      />
                      <span>{opt}</span>
                    </label>
                  );
                } else {
                  return (
                    <label key={letter} className="flex items-center gap-3">
                      <input
                        type="radio"
                        name={`q-${currentQuestion.id}`}
                        checked={selected[letter] === "selected"}
                        onChange={() => handleOptionToggle(letter, false)}
                        aria-label={`Option ${letter}`}
                      />
                      <span>{opt}</span>
                    </label>
                  );
                }
              })}
            </div>

            {currentQuestion.allowExplanation && (
              <div className="mt-3">
                <textarea
                  placeholder="Explain your reasoning (optional)"
                  value={explanation}
                  onChange={(e) => setExplanation(e.target.value)}
                  className="w-full p-2 rounded-md bg-black/20 border border-white/10"
                />
              </div>
            )}

            <div className="mt-4 flex items-center gap-3 justify-end">
              <button
                onClick={() => {
                  // small validation: at least one selection
                  const anySel = Object.values(selected).some((v) => v === true || v === "selected");
                  if (!anySel) {
                    // highlight — for quick UX just alert for now
                    alert("Please select an answer before submitting.");
                    return;
                  }
                  handleSubmitAnswer(currentQuestion);
                }}
                className="px-4 py-2 rounded-lg bg-amber-400 text-black font-semibold shadow"
                aria-label="Submit answer"
              >
                Submit
              </button>
            </div>
          </div>
        )}

        {/* Interstitial popup shown after animation */}
        {showInterstitial && (
          <div className="absolute left-1/2 -translate-x-1/2 top-40 w-11/12 md:w-1/3 p-5 bg-white/6 rounded-2xl border border-white/10 shadow-xl">
            <h4 className="text-lg font-semibold">{lastAnswerCorrect ? "Correct — You have weakened Ravana!" : "Incorrect — The Jiva is shaken."}</h4>
            <p className="mt-2 text-sm text-white/80">
              {lastAnswerCorrect
                ? "By this choice you move closer to Rama. Reflect on surrender and continue."
                : "Reflect and continue. Lord Rama's shelter is always available."}
            </p>

            <div className="mt-4 flex justify-end">
              <button
                onClick={handleTakeShelterContinue}
                className="px-4 py-2 rounded-full bg-gradient-to-r from-rose-300 to-amber-400 text-slate-900 font-semibold"
                aria-label="Take shelter and continue"
              >
                Take Shelter of Lord Ram
              </button>
            </div>
          </div>
        )}

        {/* User Details Modal (shown after Q1 if missing) */}
        {showUserModal && (
          <div className="absolute left-1/2 -translate-x-1/2 top-40 w-11/12 md:w-1/2 p-5 bg-white/6 rounded-2xl border border-white/10 shadow-xl">
            <h4 className="text-lg font-semibold">Please provide your details</h4>
            <p className="text-sm text-white/80 mt-1">We need your details to save your attempt and contact you for gifts/counselling.</p>
            <UserDetailsForm initial={{}} onSave={handleSaveUserDetails} />
          </div>
        )}

        {/* Victory modal */}
        {victory && (
          <div className="absolute inset-0 flex items-center justify-center bg-black/60 z-50">
            <div className="bg-white/6 rounded-3xl p-6 md:p-10 w-11/12 md:w-2/3 border border-white/10 shadow-2xl">
              <h2 className="text-xl md:text-3xl font-bold">You have conquered Ravana!</h2>
              <p className="mt-4 text-sm md:text-base">
                By taking shelter of Lord Ram, you have conquered Ravana and the anarthas — lust, envy, anger, pride, greed, illusion.
              </p>

              <div className="mt-6 flex gap-4">
                <Link href="/gift" className="px-4 py-3 rounded-full bg-amber-300 text-slate-900 font-semibold">
                  Claim Your Gift
                </Link>
                <Link href="/counselling" className="px-4 py-3 rounded-full bg-white/10 border border-white/20">
                  Free Counselling
                </Link>
              </div>
            </div>
          </div>
        )}

        {/* Petal Confetti overlay */}
        {petalBurst && <PetalConfetti />}

        {/* Custom CSS */}
        <style jsx>{`
          .arrow {
            width: 80px;
            height: 6px;
            background: linear-gradient(to right, #fff7d6, #facc15, #f59e0b);
            border-radius: 4px;
            box-shadow: 0 0 15px 6px rgba(255, 215, 0, 0.8);
          }
          .arrow-anim {
            animation: arrowFly ${ANIMATION_DURATIONS.arrow}ms linear forwards;
          }
          @keyframes arrowFly {
            0% {
              transform: translateX(0) rotate(-10deg);
              opacity: 1;
            }
            100% {
              transform: translateX(80vw) rotate(-10deg);
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
              transform: translate(-40vw, 145vh) scale(1.2);
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
    </div>
  );
}

/* -------------------------
   UserDetailsForm component
   ------------------------- */
function UserDetailsForm({ initial, onSave }: { initial: any; onSave: (d: any) => void }) {
  const [name, setName] = useState(initial?.name || "");
  const [mobile, setMobile] = useState(initial?.mobile || "");
  const [address, setAddress] = useState(initial?.address || "");
  const [gender, setGender] = useState(initial?.gender || "");
  const [marital, setMarital] = useState(initial?.marital || "");

  return (
    <form
      onSubmit={(e) => {
        e.preventDefault();
        if (!mobile || !name) {
          alert("Please provide Name and Mobile number.");
          return;
        }
        const details = { name, mobile, address, gender, marital };
        onSave(details);
      }}
      className="mt-3 space-y-2"
    >
      <input value={name} onChange={(e) => setName(e.target.value)} placeholder="Full Name" className="w-full p-2 rounded-md bg-black/20" />
      <input value={mobile} onChange={(e) => setMobile(e.target.value)} placeholder="Mobile Number" className="w-full p-2 rounded-md bg-black/20" />
      <input value={address} onChange={(e) => setAddress(e.target.value)} placeholder="Address" className="w-full p-2 rounded-md bg-black/20" />
      <select value={gender} onChange={(e) => setGender(e.target.value)} className="w-full p-2 rounded-md bg-black/20">
        <option value="">Select Gender</option>
        <option>Male</option>
        <option>Female</option>
        <option>Other</option>
      </select>
      <select value={marital} onChange={(e) => setMarital(e.target.value)} className="w-full p-2 rounded-md bg-black/20">
        <option value="">Marital Status</option>
        <option>Single</option>
        <option>Married</option>
      </select>

      <div className="flex justify-end gap-2">
        <button type="submit" className="px-3 py-2 rounded-md bg-amber-400 text-black font-semibold">Save</button>
      </div>
    </form>
  );
}

/* -------------------------
   PetalConfetti component
   ------------------------- */
function PetalConfetti() {
  // simple CSS-based petals floating down; can be improved with images
  const petals = new Array(30).fill(0).map((_, i) => ({
    id: i,
    left: Math.random() * 100,
    delay: Math.random() * 2,
    size: 8 + Math.random() * 16,
    rotate: Math.random() * 180,
  }));

  return (
    <>
      <div aria-hidden className="pointer-events-none fixed inset-0 z-50 overflow-hidden">
        {petals.map((p) => (
          <div
            key={p.id}
            style={{
              left: `${p.left}%`,
              top: "-10%",
              width: p.size,
              height: p.size * 1.6,
              transform: `rotate(${p.rotate}deg)`,
              animationDelay: `${p.delay}s`,
            }}
            className="absolute rounded-full petal bg-rose-300/90"
          />
        ))}
      </div>

      <style jsx>{`
        .petal {
          transform-origin: center;
          animation: petalFall 5s linear forwards;
          box-shadow: 0 2px 6px rgba(0,0,0,0.2);
          border-radius: 50% 50% 40% 40%;
        }
        @keyframes petalFall {
          0% { transform: translateY(0) rotate(0); opacity: 1; }
          30% { opacity: 0.95; }
          80% { opacity: 0.9; }
          100% { transform: translateY(130vh) rotate(720deg); opacity: 0; }
        }
      `}</style>
    </>
  );
}
