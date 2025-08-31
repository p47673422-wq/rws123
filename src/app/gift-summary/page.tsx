"use client";

import React, { useEffect, useState } from "react";
import { FaGift, FaShoppingBasket, FaBookOpen, FaChalkboardTeacher, FaCamera, FaPrayingHands } from "react-icons/fa";
import Image from "next/image";

export default function GiftSummaryPage() {
  const [cartItems, setCartItems] = useState<any[]>([]);
  const [quiz, setQuiz] = useState<any[]>([]);
  const [gitaRegs, setGitaRegs] = useState<any[]>([]);
  const [japaCount, setJapaCount] = useState<number>(0);
  const [progresses, setProgresses] = useState<any[]>([]);
  const [attempts, setAttempts] = useState<any[]>([]);
  const [userMobile, setUserMobile] = useState<string>("");
  const [userName, setUserName] = useState<string>("");
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (typeof window !== "undefined") {
      const user = localStorage.getItem("userInfo1");
      if (user) {
        const u = JSON.parse(user);
        setUserMobile(u.mobile || "");
        setUserName(u.name || "");
      }
      const japa = localStorage.getItem("chantCount");
      setJapaCount(japa ? parseInt(japa) : 0);
    }
  }, []);

  useEffect(() => {
    if (!userMobile) return;
    setLoading(true);
    fetch(`/api/gift-summary?mobile=${encodeURIComponent(userMobile)}`)
      .then(res => res.json())
      .then(data => {
        setQuiz(data.quiz || []);
        setCartItems(data.cartItems || []);
        setGitaRegs(data.gitaRegs || []);
        setProgresses(data.progresses || []);
        setAttempts(data.attempts || []);
      })
      .finally(() => setLoading(false));
  }, [userMobile]);

  return (
    <div className="content-overlay fancy-bg flex flex-col items-center justify-center min-h-screen" style={{ backdropFilter: "blur(5px)", background: "rgba(30, 30, 30, .68)", border: "1px solid rgba(255, 255, 255, .1)", borderRadius: "1.25rem", marginBottom: "2rem" }}>
      <div className="homeCustomBox purchase-main-box-dark max-w-3xl w-full mx-auto p-8 rounded-2xl shadow-2xl  border border-yellow-700">
        <div className="flex flex-col items-center mb-6">
          <Image src="/iskcon-logo.png" alt="ISKCON Logo" width={220} height={60} className="mb-2" />
          <h1 className="fancyTitle text-yellow-300 text-2xl text-center mb-2">Welcome to ISKCON Sri Sri Radha Madanmohan</h1>
        </div>

        {/* Gift Info Text */}
        <div className="text-center text-yellow-200 font-semibold mb-6 text-lg">
          These are your divine gifts from ISKCON: Ladoo Prasadam, Contest Certificate, and a Hare Krishna Mantra Sticker! Collect them from ISKCON ABIDS Hyderabad and celebrate your spiritual journey.
        </div>
        <div className="flex flex-row items-center justify-center gap-8 mb-8">
          <style>{`
            @keyframes shake {
              0% { transform: translateX(0); }
              20% { transform: translateX(-8px); }
              40% { transform: translateX(8px); }
              60% { transform: translateX(-8px); }
              80% { transform: translateX(8px); }
              100% { transform: translateX(0); }
            }
            .gift-img-shake:hover {
              animation: shake 0.5s;
            }
          `}</style>
          <div className="flex flex-col items-center">
            <img src="https://i.ytimg.com/vi/VfSdTW0dpOQ/maxresdefault.jpg" alt="Ladoo Gift" className="w-32 h-32 rounded-full shadow-lg border-4 border-yellow-300 bg-yellow-100 object-contain transition-transform hover:scale-110 hover:rotate-6 gift-img-shake" />
            <span className="mt-2 text-yellow-400 font-bold text-sm">Ladoo Prasadam</span>
          </div>
          <div className="flex flex-col items-center">
            <img src="https://www.values.iskconpune.com/wp-content/uploads/2020/08/Certificate-300x213.jpg" alt="Certificate Gift" className="w-32 h-32 rounded-xl shadow-lg border-4 border-blue-300 bg-blue-50 object-contain transition-transform hover:scale-110 hover:-rotate-6 gift-img-shake" />
            <span className="mt-2 text-blue-400 font-bold text-sm">Contest Certificate</span>
          </div>
          <div className="flex flex-col items-center">
            <img src="https://i.pinimg.com/736x/c9/33/d9/c933d9819a9055eabbd5d2ef585697f8.jpg" alt="Hare Krishna Mantra Sticker" className="w-32 h-32 rounded-full shadow-lg border-4 border-green-300 bg-green-50 object-contain transition-transform hover:scale-110 hover:rotate-3 gift-img-shake" />
            <span className="mt-2 text-green-400 font-bold text-sm">Mantra Sticker</span>
          </div>
        </div>

        <h2 className="fancyTitle mb-8 flex items-center gap-2 text-yellow-400"><FaGift className="text-yellow-400" /> Gift Summary</h2>

        
        {userMobile == "" ? (
          <div className="text-center text-yellow-400 font-bold text-lg">Please attempt any contest or challenge to get gifts!</div>
        ) : (
          loading ? (
            <div className="text-center text-yellow-400 font-bold text-lg">Loading your summary…</div>
          ) : (
            <div className="gift-summary-grid">
              <div className="gift-summary-card text-yellow-100 border border-yellow-700" style={{background: "linear-gradient(135deg, #2d2d2d 60%, #ffe082 100%)", border: "2px solid #ffe082", borderRadius: "1.5rem", padding: "1rem", marginBottom: "2rem"}}>
                <h3 className="gift-summary-title flex items-center gap-2 text-yellow-300"><FaShoppingBasket /> Krishna Basket Items</h3>
              {cartItems.length === 0 ? (
                <div className="gift-summary-empty text-yellow-500">No items added to cart.</div>
              ) : (
                <ul className="gift-summary-list">
                  {cartItems.map((item, idx) => (
                    <li key={idx} className="gift-summary-list-item flex gap-3 items-center">
                      <span className="gift-summary-item-title font-bold text-yellow-200">{item.title}</span>
                      <span className="gift-summary-item-qty text-yellow-400">x{item.qty}</span>
                      <span className="gift-summary-item-price text-yellow-300">₹{item.price * item.qty}</span>
                    </li>
                  ))}
                </ul>
              )}
            </div>
            <div className="gift-summary-card text-yellow-100 border border-yellow-700" style={{background: "linear-gradient(135deg, #2d2d2d 60%, #ffe082 100%)", border: "2px solid #ffe082", borderRadius: "1.5rem", padding: "1rem", marginBottom: "2rem"}}>
              <h3 className="gift-summary-title flex items-center gap-2 text-yellow-300"><FaBookOpen /> Bhagavad Gita Registration</h3>
              {gitaRegs.length === 0 ? (
                <span className="gift-summary-empty text-red-400">Not Registered</span>
              ) : (
                <span className="gift-summary-success text-green-400">Registered ({gitaRegs.map(r => r.language).join(", ")})</span>
              )}
            </div>
            <div className="gift-summary-card text-yellow-100 border border-yellow-700" style={{background: "linear-gradient(135deg, #2d2d2d 60%, #ffe082 100%)", border: "2px solid #ffe082", borderRadius: "1.5rem", padding: "1rem", marginBottom: "2rem"}}>
              <h3 className="gift-summary-title flex items-center gap-2 text-yellow-300"><FaPrayingHands /> Japa Challenge</h3>
              <span className="gift-summary-info">Total Japa Count: <span className="font-bold text-yellow-200">{japaCount}</span></span>
            </div>
            <div className="gift-summary-card text-yellow-100 border border-yellow-700" style={{background: "linear-gradient(135deg, #2d2d2d 60%, #ffe082 100%)", border: "2px solid #ffe082", borderRadius: "1.5rem", padding: "1rem", marginBottom: "2rem"}}>
              <h3 className="gift-summary-title flex items-center gap-2 text-yellow-300"><FaChalkboardTeacher /> Quiz Scores & Progress</h3>
              {quiz.length === 0 ? (
                <div className="gift-summary-empty text-yellow-500">No quizzes found.</div>
              ) : (
                <div className="quiz-section-list">
                  {/* 8P Section */}
                  <div className="quiz-section mb-4">
                    <div className="quiz-section-title text-yellow-400 text-lg font-bold mb-2 border-b border-yellow-400">8P Quiz</div>
                    <ul className="gift-summary-list">
                      {quiz.filter(q => q.title.startsWith('P')).map((q, idx) => {
                        const attempt = attempts.find(a => a.quizId === q.id);
                        const progress = progresses.find(p => p.pName.toLowerCase() === q.type.toLowerCase());
                        return (
                          <li key={q.id} className="gift-summary-list-item flex gap-3 items-center">
                            <span className="gift-summary-item-title font-bold text-yellow-200">{q.title}</span>
                            <span className="gift-summary-item-score text-yellow-300">Score: <span className="font-bold">{attempt ? attempt.score : "-"}</span></span>
                            <span className="gift-summary-item-status text-yellow-400">
                              {progress ? (progress.completed ? "Completed" : "In Progress") : ""}
                            </span>
                          </li>
                        );
                      })}
                    </ul>
                  </div>
                  {/* Mahaavtar Section */}
                  <div className="quiz-section mb-4">
                    <div className="quiz-section-title text-blue-400 text-lg font-bold mb-2 border-b border-blue-400">Mahaavtar Quiz</div>
                    <ul className="gift-summary-list">
                      {quiz.filter(q => q.title.startsWith('M')).map((q, idx) => {
                        const attempt = attempts.find(a => a.quizId === q.id);
                        const progress = progresses.find(p => p.pName.toLowerCase() === q.type.toLowerCase());
                        return (
                          <li key={q.id} className="gift-summary-list-item flex gap-3 items-center">
                            <span className="gift-summary-item-title font-bold text-yellow-200">{q.title}</span>
                            <span className="gift-summary-item-score text-yellow-300">Score: <span className="font-bold">{attempt ? attempt.score : "-"}</span></span>
                            <span className="gift-summary-item-status text-yellow-400">
                              {progress ? (progress.completed ? "Completed" : "In Progress") : ""}
                            </span>
                          </li>
                        );
                      })}
                    </ul>
                  </div>
                  {/* Shloak Section */}
                  <div className="quiz-section mb-4">
                    <div className="quiz-section-title text-green-400 text-lg font-bold mb-2 border-b border-green-400">Shloak Quiz</div>
                    <ul className="gift-summary-list">
                      {quiz.filter(q => !q.title.startsWith('P') && !q.title.startsWith('M')).map((q, idx) => {
                        const attempt = attempts.find(a => a.quizId === q.id);
                        const progress = progresses.find(p => p.pName.toLowerCase() === q.type.toLowerCase());
                        return (
                          <li key={q.id} className="gift-summary-list-item flex gap-3 items-center">
                            <span className="gift-summary-item-title font-bold text-yellow-200">{q.title}</span>
                            <span className="gift-summary-item-score text-yellow-300">Score: <span className="font-bold">{attempt ? attempt.score : "-"}</span></span>
                            <span className="gift-summary-item-status text-yellow-400">
                              {progress ? (progress.completed ? "Completed" : "In Progress") : ""}
                            </span>
                          </li>
                        );
                      })}
                    </ul>
                  </div>
                </div>
              )}
            </div>
          </div>
        ))}
        <div className="gift-summary-info text-center text-yellow-400 font-bold text-lg mt-8">Participate in all activities to unlock more divine gifts!</div>

        {/* WhatsApp Join Section */}
        <div className="whatsapp-join-box mt-12 flex flex-col items-center justify-center">
          <h2 className="fancyTitle text-green-400 mb-2">Join ISKCON Hyderabad WhatsApp Group</h2>
          <p className="text-yellow-200 mb-4">Click the button below to join our WhatsApp group and stay connected!</p>
          <a
            href="https://whatsapp.com/channel/0029VaZw2iYCxoAsaLVQNl3c"
            target="_blank"
            rel="noopener noreferrer"
            className="option optionFancy optionFull flex items-center justify-center gap-2 bg-green-700 hover:bg-green-600 text-white font-bold rounded-full px-6 py-3 shadow-lg transition"
            style={{ fontSize: '1.15rem' }}
          >
            <FaGift className="text-green-300 text-xl" />
            Join WhatsApp Channel
          </a>
        </div>
      </div>
    </div>
  );
}
