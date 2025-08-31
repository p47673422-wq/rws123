"use client";

import "../home-custom.css";
import React from "react";
import { FaWhatsapp } from "react-icons/fa";
import { useRouter} from "next/navigation";

export default function WhatsappPage() {
  const router = useRouter();

  return (
    <div className="content-overlay">
      <div className="homeCustomBox flex flex-col items-center mx-auto">
        <button className="back-btn" onClick={() => router.push("/home")}>← Back to Home</button>
        <h2>Join ISKCON Hyderabad WhatsApp Group</h2>
        <p>Click the button below to join our WhatsApp group and stay connected!</p>
        <a
          href="https://whatsapp.com/channel/0029VaZw2iYCxoAsaLVQNl3c"
          target="_blank"
          rel="noopener noreferrer"
          className="option optionFancy optionFull flex items-center justify-center gap-2"
        >
          <FaWhatsapp className="text-green-400 text-xl" />
          Join WhatsApp Channel
        </a>
      </div>
    </div>
  );
}
