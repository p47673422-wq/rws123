"use client";
import "../home-custom.css";

import React, { useState } from "react";

export default function SelfieContestPage() {
  const [instagram, setInstagram] = useState("");
  const [status, setStatus] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);
    setStatus(null);
    try {
      const res = await fetch("/api/selfie-contest/submit", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ instagram }),
      });
      const data = await res.json();
      if (res.ok) {
        setStatus("Thank you! Your selfie Instagram handle has been submitted.");
        setInstagram("");
      } else {
        setStatus(data.error || "Submission failed.");
      }
    } catch (err) {
      setStatus("Submission failed. Please try again later.");
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="content-overlay">
      <div className="homeCustomBox flex flex-col items-center mx-auto">
        <h2>Selfie Contest</h2>
        <p>Participate in our Selfie Contest and win exciting prizes!</p>
        <p>Don't forget add mention tag @iskconhyderabad_abids and hashtag #Janamasthami_in_iskconhyderabad_abids</p>
        <form onSubmit={handleSubmit} className="w-full flex flex-col gap-4 mt-4">
          <input
            type="text"
            className="option optionFancy optionFull"
            placeholder="Your Instagram handle (e.g. @yourname)"
            value={instagram}
            onChange={e => setInstagram(e.target.value)}
            required
            disabled={loading}
          />
          <button
            type="submit"
            className="option optionFancy optionFull bg-yellow-400 text-black font-bold hover:bg-yellow-300 transition"
            disabled={loading}
          >
            {loading ? "Submitting..." : "Submit Selfie"}
          </button>
        </form>
        {status && <div className="mt-4 text-center text-yellow-200">{status}</div>}
      </div>
    </div>
  );
}

