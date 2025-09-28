"use client";
import Image from "next/image";
import Link from "next/link";

export default function GiftPage() {
  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-gradient-to-b from-pink-100 via-yellow-50 to-green-100 relative">
      {/* Lotus petals background */}
      <div className="absolute inset-0 z-0 pointer-events-none">
        <img src="/images/lotus-petal.png" alt="Lotus Petal" className="absolute left-0 top-0 w-32 opacity-30 animate-spin-slow" />
        <img src="/images/lotus-petal.png" alt="Lotus Petal" className="absolute right-0 top-0 w-32 opacity-30 animate-spin-reverse" />
        <img src="/images/lotus-petal.png" alt="Lotus Petal" className="absolute left-0 bottom-0 w-32 opacity-30 animate-spin" />
        <img src="/images/lotus-petal.png" alt="Lotus Petal" className="absolute right-0 bottom-0 w-32 opacity-30 animate-spin-reverse" />
      </div>

      <div className="relative z-10 w-full max-w-xl mx-auto flex flex-col items-center py-12 px-4">
        <h1 className="text-3xl md:text-4xl font-bold text-pink-700 mb-4 text-center drop-shadow-lg">
          Congratulations! You unlocked your gift 🎁
        </h1>

        {/* Krishna Basket Promotion */}
        <div className="bg-white rounded-xl shadow-lg border-2 border-yellow-200 flex flex-col md:flex-row items-center p-6 mb-8 w-full">
          <div className="md:w-1/2 w-full flex justify-center mb-4 md:mb-0">
            <Image src="/images/krishnabasket.png" alt="Krishna Basket" width={180} height={180} className="rounded-lg shadow" />
          </div>
          <div className="md:w-1/2 w-full flex flex-col items-center md:items-start px-2">
            <h2 className="text-xl font-bold text-green-700 mb-2">Krishna Basket</h2>
            <p className="text-gray-700 mb-3 text-center md:text-left">A special basket of spiritual gifts to help you on your journey. Includes books, prasadam, and more!</p>
            <Link href="/krishnabasket">
              <button className="px-6 py-2 rounded-xl font-bold text-white bg-gradient-to-r from-green-400 via-yellow-400 to-pink-400 shadow-lg hover:scale-105 transition glow-effect">
                Go to Krishna Basket
              </button>
            </Link>
          </div>
        </div>

        {/* Donate Button */}
        <Link href="/donate">
          <button className="w-full px-8 py-4 rounded-xl font-bold text-white bg-pink-600 shadow-lg hover:bg-pink-700 transition text-2xl mb-8">
            Donate
          </button>
        </Link>

        {/* Srila Prabhupada Quote */}
        <div className="bg-yellow-50 border-l-4 border-pink-400 p-6 rounded-xl shadow text-center max-w-lg mx-auto">
          <p className="text-lg italic text-pink-700 mb-2">
            "Chant Hare Krishna and your life will be sublime."
          </p>
          <span className="font-bold text-gray-700">— Srila Prabhupada</span>
        </div>
      </div>

      {/* Custom lotus petal spin animations */}
      <style jsx global>{`
        @keyframes spin-slow { 0% { transform: rotate(0deg); } 100% { transform: rotate(360deg); } }
        @keyframes spin-reverse { 0% { transform: rotate(360deg); } 100% { transform: rotate(0deg); } }
        .animate-spin-slow { animation: spin-slow 18s linear infinite; }
        .animate-spin-reverse { animation: spin-reverse 22s linear infinite; }
      `}</style>
    </div>
  );
}
