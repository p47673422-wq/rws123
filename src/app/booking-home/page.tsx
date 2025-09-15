"use client";
import React from "react";
import Carousel from "../../components/Carousel";
import Link from "next/link";
import Image from "next/image";

import RewardsTracker from "../../components/RewardsTracker";
import { useMyBookings } from "../../hooks/useMyBookings";
import { useRewards } from "../../hooks/useRewards";
import { useCurrentUser } from "../../hooks/useCurrentUser";

export default function BookCongregationPage() {
  const { user, loading: userLoading } = useCurrentUser();
  const { bookings, loading: bookingsLoading } = useMyBookings();
  const userId = user?.id || "";
  const { progress, loading: rewardsLoading } = useRewards(userId);
  const totalBookings = bookings.length;
  const totalStrength = bookings.reduce((sum, b) => sum + b.strength, 0);

  if (userLoading) return <div className="min-h-screen flex items-center justify-center">Loading...</div>;
  if (!user) return <div className="min-h-screen flex items-center justify-center text-red-600">Not logged in</div>;

  return (
    <div className="min-h-screen bg-gradient-to-br from-yellow-100 to-orange-200 flex flex-col items-center py-4 px-2">
      <div className="w-full max-w-2xl">
        <div className="flex flex-col items-center mb-4">
          <Image src="/iskcon-logo.png" alt="ISKCON Logo" width={180} height={60} />
          <h1 className="text-2xl md:text-3xl font-bold text-yellow-700 mt-2">Hare Krishna, {user.name}</h1>
        </div>
        <Carousel />
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mt-6 mb-4">
          <div className="flex flex-col items-center bg-white rounded-xl shadow-md p-4 border border-yellow-200 w-full md:w-40 mb-4 md:mb-0">
            <div className="text-3xl text-yellow-600 mb-2">📖</div>
            <div className="text-lg font-bold text-yellow-700">My Bookings</div>
            <div className="text-xl text-yellow-900 font-semibold">{bookingsLoading ? "..." : totalBookings}</div>
          </div>
          <div className="flex flex-col items-center bg-white rounded-xl shadow-md p-4 border border-yellow-200 w-full md:w-40 mb-4 md:mb-0">
            <div className="text-3xl text-yellow-600 mb-2">📖</div>
            <div className="text-lg font-bold text-yellow-700">My Total Strength</div>
            <div className="text-xl text-yellow-900 font-semibold">{bookingsLoading ? "..." : totalStrength}</div>
          </div>
          <RewardsTracker totalBookings={totalBookings} totalStrength={totalStrength} />
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-6">
          <Link href="/book-congregation" className="w-full py-6 bg-yellow-600 text-white rounded-xl shadow-lg text-xl font-bold text-center hover:bg-yellow-700 transition">Book Congregation</Link>
          <Link href="/my-submissions" className="w-full py-6 bg-yellow-500 text-white rounded-xl shadow-lg text-xl font-bold text-center hover:bg-yellow-600 transition">My Submissions</Link>
          <Link href="/all-submissions" className="w-full py-6 bg-yellow-400 text-white rounded-xl shadow-lg text-xl font-bold text-center hover:bg-yellow-500 transition">All Submissions</Link>
          <Link href="/leaderboard" className="w-full py-6 bg-orange-500 text-white rounded-xl shadow-lg text-xl font-bold text-center hover:bg-orange-600 transition">Leaderboard</Link>
        </div>
      </div>
    </div>
  );
}
