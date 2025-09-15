import { useRouter } from "next/navigation";
"use client";
import React, { useEffect, useState } from "react";
import Link from "next/link";
import { useMyBookings } from "../../hooks/useMyBookings";
 
import { useCurrentUser } from "../../hooks/useCurrentUser";


export default function MySubmissionsPage() {
  const router = useRouter();
  // Simulate user and bookings fetch (replace with real API/session)
  
  const { user, loading: userLoading } = useCurrentUser();
  const { bookings, loading: bookingsLoading } = useMyBookings();

  if (userLoading) return <div className="min-h-screen flex items-center justify-center">Loading...</div>;
  if (!user) return <div className="min-h-screen flex items-center justify-center text-red-600">Not logged in</div>;
  return (
    <>
      <div className="min-h-screen bg-gradient-to-br from-yellow-100 to-orange-200 py-6 px-2">
        <h2 className="text-xl font-bold text-yellow-700 mb-4">My Bookings</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {bookings.length === 0 && <div className="text-yellow-700">No bookings yet.</div>}
          {bookings.map(b => (
            <div key={b.id} className="bg-white rounded-xl shadow-md p-4 border border-yellow-200 flex flex-col gap-2">
              <div className="font-bold text-yellow-800 text-lg">{b.placeName}</div>
              <div className="text-yellow-700">Date: {b.date?.slice(0,10)}</div>
              <div className="text-yellow-700">Strength: {b.strength}</div>
              <div className="text-yellow-700">Duration: {b.duration}</div>
              <Link href={`/book-congregation?bookingId=${b.id}`} className="mt-2 py-1 px-3 bg-yellow-600 text-white rounded font-semibold text-center hover:bg-yellow-700 transition">Edit</Link>
            </div>
          ))}
        </div>
      </div>
      <button
        className="fixed bottom-4 left-1/2 -translate-x-1/2 bg-yellow-600 text-white px-6 py-2 rounded-full shadow-lg font-semibold hover:bg-yellow-700 transition z-50"
        onClick={() => router.back()}
      >
        ← Back
      </button>
    </>
  );
}
