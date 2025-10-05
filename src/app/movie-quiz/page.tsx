"use client";
import { useEffect, useRef } from "react";

export default function MovieQuizEmbedPage() {
  const audioRef = useRef<HTMLAudioElement | null>(null);
  useEffect(() => {
    // Try to play background music on mount
    if (audioRef.current) {
      audioRef.current.volume = 0.5;
      audioRef.current.play().catch(() => {});
    }
  }, []);
  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-gradient-to-br from-yellow-50 via-pink-50 to-white py-6 px-2">
      <h1 className="text-2xl md:text-3xl font-bold text-yellow-700 mb-2 flex items-center gap-2 drop-shadow-lg"><span>🎬</span> Mahavatar Movie Quiz</h1>
      <p className="text-base md:text-lg text-pink-700 mb-4 text-center max-w-xl">Test your knowledge and dive into divine insights from the Mahavatar movie!</p>
      <div className="w-full max-w-2xl flex items-center justify-center rounded-xl overflow-hidden shadow-2xl border border-yellow-100 bg-white p-2 md:p-6" style={{ height: '85vh', minHeight: 320 }}>
        <iframe
          src="https://tinyurl.com/Mahavatarmoviequiz"
          title="Mahavatar Movie Quiz"
          className="w-full h-full"
          allowFullScreen
          style={{ border: 0, height: '100%', width: '100%' }}
        />
      </div>
      <audio ref={audioRef} src="/audio/qBG.mp3" autoPlay loop style={{ display: 'none' }} />
      <style jsx>{`
        .aspect-video {
          aspect-ratio: 16/9;
        }
      `}</style>
      <button
        onClick={() => window.history.back()}
        className="flex items-center gap-2 text-yellow-700 hover:text-pink-700 font-semibold mb-2 px-3 py-1 rounded-full bg-yellow-100 hover:bg-pink-100 transition-colors shadow-sm self-start"
        style={{ fontSize: '1.1rem' }}
        aria-label="Go back"
      >
        <span style={{ fontSize: '1.3em', lineHeight: 1 }}>&larr;</span> Back
      </button>
    </div>
    
  );
}
