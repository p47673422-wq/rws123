"use client";
import "../../home-custom.css";
import React, { useState, useEffect } from "react";
import { useRouter, useParams } from "next/navigation";
import { isValidPhoneNumber } from "libphonenumber-js";

const shlokaData = [
  {
    id: 1,
    title: "BG 4.9: Divinity of Lord Krsna",
    audio: "/audio/BG 4.9.mp3",
    shloka: `janma karma ca me divyam\nevaṁ yo vetti tattvataḥ\ntyaktvā dehaṁ punar janma\nnaiti mām eti so ’rjuna`,
    synonyms: `janma — birth; karma — work; ca — also; me — of Mine; divyam — transcendental; evam — like this; yaḥ — anyone who; vetti — knows; tattvataḥ — in reality; tyaktvā — leaving aside; deham — this body; punaḥ — again; janma — birth; na — never; eti — does attain; mām — unto Me; eti — does attain; saḥ — he; arjuna — O Arjuna.`,
    translation: `One who knows the transcendental nature of My appearance and activities does not, upon leaving the body, take his birth again in this material world, but attains My eternal abode, O Arjuna.`
  },
  {
    id: 2,
    title: "BG 9.26: Devotion to Lord Krsna",
    
    audio: "/audio/BG 9.26.mp3",
    shloka: `patraṁ puṣpaṁ phalaṁ toyaṁ\nyo me bhaktyā prayacchati\ntad ahaṁ bhakty-upahṛtam\naśnāmi prayatātmanaḥ`,
    synonyms: `patram — a leaf; puṣpam — a flower; phalam — a fruit; toyam — water; yaḥ — whoever; me — unto Me; bhaktyā — with devotion; prayacchati — offers; tat — that; aham — I; bhakti-upahṛtam — offered in devotion; aśnāmi — accept; prayata-ātmanaḥ — from one in pure consciousness.`,
    translation: `If one offers Me with love and devotion a leaf, a flower, a fruit or water, I will accept it.`
  },
  {
    id: 3,
    title: "SB 1.8.22: Description of Lord Krsna",

    audio: "/audio/Namah pankaja nabhaya.mp3",
    shloka: `namaḥ paṅkaja-nābhāya\nnamaḥ paṅkaja-māline\nnamaḥ paṅkaja-netrāya\nnamas te paṅkajāṅghraye`,
    synonyms: `namaḥ — all respectful obeisances; paṅkaja-nābhāya — unto the Lord who has a specific depression resembling a lotus flower in the center of His abdomen; namaḥ — obeisances; paṅkaja-māline — one who is always decorated with a garland of lotus flowers; namaḥ — obeisances; paṅkaja-netrāya — one whose glance is as cooling as a lotus flower; namaḥ te — respectful obeisances unto You; paṅkaja-aṅghraye — unto You, the soles of whose feet are engraved with lotus flowers (and who are therefore said to possess lotus feet).`,
    translation: `My respectful obeisances are unto You, O Lord, whose abdomen is marked with a depression like a lotus flower, who are always decorated with garlands of lotus flowers, whose glance is as cool as the lotus and whose feet are engraved with lotuses.`
  },
  {
    id: 4,
    title: "BG 9.34: Dedication to Lord Krsna",
    
    audio: "/audio/BG 9.34.mp3",
    shloka: `man-manā bhava mad-bhakto\nmad-yājī māṁ namaskuru\nmām evaiṣyasi yuktvaivam\nātmānaṁ mat-parāyaṇaḥ`,
    synonyms: `mat-manāḥ — always thinking of Me; bhava — become; mat — My; bhaktaḥ — devotee; mat — My; yājī — worshiper; mām — unto Me; namas-kuru — offer obeisances; mām — unto Me; eva — completely; eṣyasi — you will come; yuktvā — being absorbed; evam — thus; ātmānam — your soul; mat-parāyaṇaḥ — devoted to Me.`,
    translation: `Engage your mind always in thinking of Me, become My devotee, offer obeisances to Me and worship Me. Being completely absorbed in Me, surely you will come to Me.`
  },
  {
    id: 5,
    title: "SB 12.13.23: Deepen connection with lord Krsna",
    
    audio: "/audio/Namasankirtanam Yasya.mp3",
    shloka: `nāma-saṅkīrtanaṁ yasya\nsarva-pāpa praṇāśanam\npraṇāmo duḥkha-śamanas\ntaṁ namāmi hariṁ param`,
    synonyms: `nāma-saṅkīrtanam — the congregational chanting of the holy name; yasya — of whom; sarva-pāpa — all sins; praṇāśanam — which destroys; praṇāmaḥ — the bowing down; duḥkha — misery; śamanaḥ — which subdues; tam — to Him; namāmi — I offer my obeisances; harim — to Lord Hari; param — the Supreme.`,
    translation: `I offer my respectful obeisances unto the Supreme Lord, Hari, the congregational chanting of whose holy names destroys all sinful reactions, and the offering of obeisances unto whom relieves all material suffering.`
  }
];

export default function ShlokaDetailPage() {
  const router = useRouter();
  const params = useParams();
  const id = parseInt(params.id as string);
  const idx = shlokaData.findIndex(s => s.id === id);
  const shloka = shlokaData[idx];
  const [showTest, setShowTest] = useState(false);
  const [userInfo, setUserInfo] = useState({ id: "",name: "", mobile: "", gender: "", address: "", maritalStatus: "" });
  const [userId, setUserId] = useState<string | null>(null);
  const [answer, setAnswer] = useState("");
  const [error, setError] = useState("");
  const [submitted, setSubmitted] = useState(false);

  useEffect(() => {
    if (typeof window !== "undefined") {
      const storedId = localStorage.getItem("userId1");
      if (storedId) setUserId(storedId);
    }
  }, []);

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

  const handleTestSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!answer.trim()) {
      setError("Please share what you have learnt.");
      return;
    }
    if (!userId && (!userInfo.name || !userInfo.mobile || !userInfo.gender || !userInfo.address || !userInfo.maritalStatus)) {
      setError("Please fill all user details.");
      return;
    }

    if (!isValidIndianMobile(userInfo.mobile)) {
      setError("Please enter a valid mobile number.");
      return;
    }
     if (userId) {
      const storedUserInfo = localStorage.getItem("userInfo1");
        if (storedUserInfo) {
          try {
            const parsed = JSON.parse(storedUserInfo);
            setUserInfo({
              id: userId,
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
      }
      if(userId) {
        userInfo.id = userId;
      }
    setError("");
    // Save via quiz API
    const res = await fetch("/api/quiz/submit", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        ...userInfo,
        answers: [answer],
        score: 1,
        quizType: `shloka${id}`,
        quizTitle: shloka.title,
        maxScore: 1
      })
    });
    if (res.ok) {
      setSubmitted(true);
      if (typeof window !== "undefined") {
        localStorage.setItem("userInfo1", JSON.stringify(userInfo));
        const data = await res.json();
        if (data.userId) {
          localStorage.setItem("userId1", data.userId);
        }
      }
      setTimeout(() => {
        // Go to next shloka or back to grid
        if (idx < shlokaData.length - 1) {
          router.push(`/home/shloka-contest/${shlokaData[idx + 1].id}`);
        } else {
          router.push("/home/shloka-contest");
        }
      }, 1200);
    } else {
      setError("Could not save. Try again.");
    }
  };

  return (
    <div className="content-overlay">
      <div className="homeCustomBox shloka-detail-box">
        <button className="back-btn" onClick={() => router.push("/home/shloka-contest")}>← Back to Shloka List</button>
        <h2 className="fancyTitle shloka-title">{shloka.title}</h2>
        {shloka.audio && (
          <audio controls className="shloka-audio">
            <source src={shloka.audio} type="audio/mpeg" />
            Your browser does not support the audio element.
          </audio>
        )}
        {shloka.shloka && (
          <div className="shloka-text">{shloka.shloka}</div>
        )}
        {shloka.synonyms && (
          <div className="shloka-synonyms"><b>Synonyms:</b> {shloka.synonyms}</div>
        )}
        {shloka.translation && (
          <div className="shloka-translation"><b>Translation:</b> {shloka.translation}</div>
        )}
        <div className="shloka-nav-btns">
          <button className="nav-btn prev-btn" disabled={idx === 0} onClick={() => router.push(`/home/shloka-contest/${shlokaData[idx - 1].id}`)}>Previous</button>
          <button className="nav-btn next-btn" disabled={idx === shlokaData.length - 1} onClick={() => router.push(`/home/shloka-contest/${shlokaData[idx + 1].id}`)}>Next</button>
        </div>
        <button className="take-test-btn" onClick={() => setShowTest(true)} disabled={showTest || submitted}>Take Test</button>
        {showTest && !submitted && (
          <form className="custom-form-glass shloka-test-form" onSubmit={handleTestSubmit}>
            <textarea className="input-fancy shloka-answer-input" placeholder="What have you learnt from this shloka?" value={answer} onChange={e => setAnswer(e.target.value)} />
            {!userId && (
              <>
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
              </>
            )}
            {error && <div className="form-error-msg">{error}</div>}
            <button className="submit-btn" type="submit">Submit</button>
          </form>
        )}
        {submitted && <div className="form-success-msg">Saved! Moving to next...</div>}
      </div>
    </div>
  );
}
